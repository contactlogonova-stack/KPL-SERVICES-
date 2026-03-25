import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Plus, Trash2, X, UploadCloud, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { uploadToCloudinary } from '../../lib/cloudinary';

interface GalleryPhoto {
  id: string;
  photo_url: string;
  created_at: string;
}

export default function Galerie() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingIndices, setUploadingIndices] = useState<number[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      const { data, error } = await supabase
        .from('galerie')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPhotos(data || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
      alert('Erreur lors du chargement de la galerie.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer cette photo de la galerie ?')) return;

    try {
      const { error } = await supabase
        .from('galerie')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPhotos(photos.filter(p => p.id !== id));
      showToast('Photo supprimée avec succès');
    } catch (error) {
      console.error('Error deleting photo:', error);
      alert('Erreur lors de la suppression de la photo.');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files).filter((file: any) => file.type.startsWith('image/'));
      setSelectedFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    try {
      const newPhotos: GalleryPhoto[] = [];
      
      // Upload each file sequentially to track progress individually
      for (let i = 0; i < selectedFiles.length; i++) {
        setUploadingIndices(prev => [...prev, i]);
        
        const file = selectedFiles[i];
        const photo_url = await uploadToCloudinary(file);
        
        const { data, error } = await supabase
          .from('galerie')
          .insert([{ photo_url }])
          .select()
          .single();
          
        if (error) throw error;
        if (data) newPhotos.push(data);
        
        setUploadingIndices(prev => prev.filter(idx => idx !== i));
      }

      // Add new photos to state (at the beginning since it's ORDER BY created_at DESC)
      setPhotos(prev => [...newPhotos, ...prev]);
      
      // Reset and close
      setSelectedFiles([]);
      setIsModalOpen(false);
      showToast(`${newPhotos.length} photo(s) ajoutée(s) avec succès`);
      
    } catch (error) {
      console.error('Error uploading photos:', error);
      alert('Erreur lors de l\'upload des photos.');
      setUploadingIndices([]);
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion de la Galerie</h1>
          <p className="text-gray-500 mt-1">{photos.length} photo(s) dans la galerie</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#E91E8C] text-white rounded-lg hover:bg-[#D81B82] transition-colors font-medium shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Ajouter des photos
        </button>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#E91E8C]" />
        </div>
      ) : photos.length > 0 ? (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              variants={itemVariants}
              className="relative aspect-square group overflow-hidden rounded-xl bg-gray-200 shadow-sm"
            >
              <img
                src={photo.photo_url}
                alt="Galerie"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                <div className="flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(photo.id);
                    }}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg transform hover:scale-110"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div>
                  <p className="text-white text-sm font-medium drop-shadow-md">
                    Ajoutée le {formatDate(photo.created_at)}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center h-[50vh]">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Camera className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">La galerie est vide</h3>
          <p className="text-gray-500 mb-6 max-w-md">
            Ajoutez vos premières photos pour enrichir votre galerie et montrer votre travail à vos clients.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#E91E8C] text-white rounded-full hover:bg-[#D81B82] transition-colors font-medium shadow-md"
          >
            <Plus className="w-5 h-5" />
            Ajouter vos premières photos
          </button>
        </div>
      )}

      {/* Modal Ajout Photos */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !uploadingIndices.length && setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-800">Ajouter des photos à la galerie</h2>
                <button
                  onClick={() => !uploadingIndices.length && setIsModalOpen(false)}
                  disabled={uploadingIndices.length > 0}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex-1">
                {/* Dropzone */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-50 hover:border-[#E91E8C] transition-colors mb-6"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                  <UploadCloud className="w-12 h-12 text-gray-400 mb-4" />
                  <p className="text-gray-800 font-medium mb-1">
                    Cliquez ou glissez-déposez vos photos ici
                  </p>
                  <p className="text-gray-500 text-sm">
                    Formats supportés : JPG, PNG, WEBP
                  </p>
                </div>

                {/* Previews */}
                {selectedFiles.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Photos sélectionnées ({selectedFiles.length})
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Remove button (only if not uploading) */}
                          {!uploadingIndices.includes(index) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeSelectedFile(index);
                              }}
                              className="absolute top-1 right-1 p-1 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}

                          {/* Uploading Spinner Overlay */}
                          {uploadingIndices.includes(index) && (
                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                              <Loader2 className="w-6 h-6 text-[#E91E8C] animate-spin" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={uploadingIndices.length > 0}
                  className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleUpload}
                  disabled={selectedFiles.length === 0 || uploadingIndices.length > 0}
                  className="flex items-center gap-2 px-6 py-2.5 bg-[#E91E8C] text-white font-medium rounded-lg hover:bg-[#D81B82] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploadingIndices.length > 0 ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Upload en cours...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-5 h-5" />
                      Uploader {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-3"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
