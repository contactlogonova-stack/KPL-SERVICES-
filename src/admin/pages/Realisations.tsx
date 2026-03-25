import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Images, Plus, Settings, Edit, Trash2, X, 
  Image as ImageIcon, Loader2, CheckCircle2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { uploadToCloudinary } from '../../lib/cloudinary';

interface Category {
  id: string;
  nom: string;
  created_at: string;
}

interface Realisation {
  id: string;
  titre: string;
  description: string;
  categorie_id: string;
  date_event: string;
  photo_1: string | null;
  photo_2: string | null;
  photo_3: string | null;
  photo_4: string | null;
  photo_5: string | null;
  created_at: string;
  categories?: { nom: string };
}

export default function Realisations() {
  const [realisations, setRealisations] = useState<Realisation[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isRealisationModalOpen, setIsRealisationModalOpen] = useState(false);
  
  // Category management
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categoryError, setCategoryError] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Realisation management
  const [editingRealisation, setEditingRealisation] = useState<Realisation | null>(null);
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    categorie_id: '',
    date_event: ''
  });
  const [photos, setPhotos] = useState<(string | null)[]>([null, null, null, null, null]);
  const [isUploading, setIsUploading] = useState<boolean[]>([false, false, false, false, false]);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch categories
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('nom');
      
      if (catError) throw catError;
      setCategories(catData || []);

      // Fetch realisations
      let query = supabase
        .from('realisations')
        .select(`
          *,
          categories (nom)
        `)
        .order('created_at', { ascending: false });

      if (categoryFilter !== 'all') {
        query = query.eq('categorie_id', categoryFilter);
      }
      if (searchTerm) {
        query = query.ilike('titre', `%${searchTerm}%`);
      }

      const { data: realData, error: realError } = await query;
      
      if (realError) throw realError;
      setRealisations(realData || []);
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryFilter, searchTerm]);

  // --- CATEGORIES MANAGEMENT ---
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    setIsAddingCategory(true);
    setCategoryError('');
    
    try {
      // Check uniqueness
      const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .ilike('nom', newCategoryName.trim())
        .single();
        
      if (existing) {
        setCategoryError('Cette catégorie existe déjà');
        setIsAddingCategory(false);
        return;
      }

      const { data, error } = await supabase
        .from('categories')
        .insert([{ nom: newCategoryName.trim() }])
        .select()
        .single();

      if (error) throw error;
      
      setCategories([...categories, data].sort((a, b) => a.nom.localeCompare(b.nom)));
      setNewCategoryName('');
    } catch (error) {
      console.error("Erreur lors de l'ajout de la catégorie:", error);
      setCategoryError('Erreur lors de la création');
    } finally {
      setIsAddingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Supprimer cette catégorie supprimera TOUTES les réalisations liées. Confirmer ?')) return;
    
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setCategories(categories.filter(c => c.id !== id));
      // Refresh realisations as some might have been deleted (CASCADE)
      fetchData();
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
      alert('Erreur lors de la suppression.');
    }
  };

  // --- REALISATIONS MANAGEMENT ---
  const openAddModal = () => {
    setEditingRealisation(null);
    setFormData({
      titre: '',
      description: '',
      categorie_id: categories.length > 0 ? categories[0].id : '',
      date_event: new Date().toISOString().split('T')[0]
    });
    setPhotos([null, null, null, null, null]);
    setIsRealisationModalOpen(true);
  };

  const openEditModal = (realisation: Realisation) => {
    setEditingRealisation(realisation);
    setFormData({
      titre: realisation.titre,
      description: realisation.description,
      categorie_id: realisation.categorie_id,
      date_event: realisation.date_event ? new Date(realisation.date_event).toISOString().split('T')[0] : ''
    });
    setPhotos([
      realisation.photo_1,
      realisation.photo_2,
      realisation.photo_3,
      realisation.photo_4,
      realisation.photo_5
    ]);
    setIsRealisationModalOpen(true);
  };

  const handlePhotoUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Set uploading state for this specific index
    const newUploading = [...isUploading];
    newUploading[index] = true;
    setIsUploading(newUploading);

    try {
      const url = await uploadToCloudinary(file);
      const newPhotos = [...photos];
      newPhotos[index] = url;
      setPhotos(newPhotos);
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      alert("Erreur lors du téléchargement de l'image.");
    } finally {
      const newUploading = [...isUploading];
      newUploading[index] = false;
      setIsUploading(newUploading);
      
      // Reset input
      if (fileInputRefs[index].current) {
        fileInputRefs[index].current!.value = '';
      }
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = [...photos];
    newPhotos[index] = null;
    setPhotos(newPhotos);
  };

  const handleSaveRealisation = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.titre || !formData.description || !formData.categorie_id || !formData.date_event) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    
    // Check if at least one photo is uploaded
    if (!photos.some(p => p !== null)) {
      alert('Veuillez ajouter au moins une photo.');
      return;
    }

    setIsSaving(true);
    
    try {
      const realisationData = {
        titre: formData.titre,
        description: formData.description,
        categorie_id: formData.categorie_id,
        date_event: formData.date_event,
        photo_1: photos[0],
        photo_2: photos[1],
        photo_3: photos[2],
        photo_4: photos[3],
        photo_5: photos[4]
      };

      if (editingRealisation) {
        // Update
        const { error } = await supabase
          .from('realisations')
          .update(realisationData)
          .eq('id', editingRealisation.id);
          
        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('realisations')
          .insert([realisationData]);
          
        if (error) throw error;
      }

      // Success
      setIsRealisationModalOpen(false);
      fetchData();
      
      // Show toast
      setToastMessage(editingRealisation ? 'Réalisation modifiée avec succès' : 'Réalisation ajoutée avec succès');
      setTimeout(() => setToastMessage(''), 3000);
      
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      alert("Erreur lors de l'enregistrement de la réalisation.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRealisation = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette réalisation ?')) return;

    try {
      const { error } = await supabase
        .from('realisations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setRealisations(realisations.filter(r => r.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression.');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6 bg-[#F8F8F8] min-h-full -m-4 lg:-m-8 p-4 lg:p-8 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-8 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Section 1: Header + Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Réalisations</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C5A028] transition-colors font-medium shadow-sm"
          >
            <Settings className="w-4 h-4" />
            Gérer les catégories
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-[#E91E8C] text-white rounded-lg hover:bg-[#D81B80] transition-colors font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Ajouter une réalisation
          </button>
        </div>
      </div>

      {/* Section 2: Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-2/3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher par titre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-64 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E91E8C] focus:border-transparent outline-none bg-white"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nom}</option>
            ))}
          </select>
        </div>
        <div className="text-sm text-gray-500 font-medium whitespace-nowrap">
          {realisations.length} résultat(s)
        </div>
      </div>

      {/* Section 3: Grid */}
      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E91E8C]"></div>
        </div>
      ) : realisations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {realisations.map((realisation) => {
            // Count actual photos
            const photoList = [realisation.photo_1, realisation.photo_2, realisation.photo_3, realisation.photo_4, realisation.photo_5].filter(Boolean);
            
            return (
              <motion.div
                key={realisation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col"
              >
                {/* Cover Image */}
                <div className="relative h-48 bg-gray-100">
                  {realisation.photo_1 ? (
                    <img 
                      src={realisation.photo_1} 
                      alt={realisation.titre} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-12 h-12 opacity-50" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                      {realisation.categories?.nom || 'Sans catégorie'}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{realisation.titre}</h3>
                  <p className="text-sm text-gray-500 mb-4">{formatDate(realisation.date_event)}</p>
                  
                  {/* Thumbnails */}
                  <div className="flex gap-2 mb-4 mt-auto">
                    {photoList.slice(0, 5).map((photo, idx) => (
                      <div key={idx} className="w-10 h-10 rounded bg-gray-100 overflow-hidden border border-gray-200">
                        <img src={photo as string} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                    {photoList.length === 0 && (
                      <span className="text-xs text-gray-400 italic">Aucune photo</span>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => openEditModal(realisation)}
                      className="p-2 text-gray-500 hover:text-[#E91E8C] hover:bg-[#E91E8C]/10 rounded-lg transition-colors"
                      title="Modifier"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteRealisation(realisation.id)}
                      className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-16 text-center">
          <div className="flex flex-col items-center justify-center text-gray-400">
            <Images className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-xl font-medium text-gray-600 mb-2">Aucune réalisation trouvée</p>
            <p className="text-sm mb-6">Ajoutez votre première réalisation pour l'afficher sur le site.</p>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-6 py-3 bg-[#E91E8C] text-white rounded-lg hover:bg-[#D81B80] transition-colors font-medium shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Ajouter une réalisation
            </button>
          </div>
        </div>
      )}

      {/* MODAL GESTION CATÉGORIES */}
      <AnimatePresence>
        {isCategoryModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCategoryModalOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                <h2 className="text-xl font-bold text-gray-800">Gérer les catégories</h2>
                <button 
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                <form onSubmit={handleAddCategory} className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nouvelle catégorie</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="Nom de la catégorie..."
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E91E8C] outline-none"
                      disabled={isAddingCategory}
                    />
                    <button
                      type="submit"
                      disabled={!newCategoryName.trim() || isAddingCategory}
                      className="px-4 py-2 bg-[#E91E8C] text-white rounded-lg hover:bg-[#D81B80] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center min-w-[100px]"
                    >
                      {isAddingCategory ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Ajouter'}
                    </button>
                  </div>
                  {categoryError && <p className="text-red-500 text-sm mt-2">{categoryError}</p>}
                </form>

                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Catégories existantes</h3>
                  {categories.length > 0 ? (
                    <ul className="divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden">
                      {categories.map((cat) => (
                        <li key={cat.id} className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors">
                          <span className="font-medium text-gray-800">{cat.nom}</span>
                          <button
                            onClick={() => handleDeleteCategory(cat.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">Aucune catégorie existante.</p>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MODAL AJOUT/MODIFICATION RÉALISATION */}
      <AnimatePresence>
        {isRealisationModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSaving && setIsRealisationModalOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingRealisation ? 'Modifier la réalisation' : 'Ajouter une réalisation'}
                </h2>
                <button 
                  onClick={() => !isSaving && setIsRealisationModalOpen(false)}
                  disabled={isSaving}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1">
                <form id="realisation-form" onSubmit={handleSaveRealisation} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Titre <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={formData.titre}
                        onChange={(e) => setFormData({...formData, titre: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E91E8C] outline-none"
                        placeholder="Ex: Mariage de Sophie & Thomas"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Catégorie <span className="text-red-500">*</span></label>
                      <select
                        required
                        value={formData.categorie_id}
                        onChange={(e) => setFormData({...formData, categorie_id: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E91E8C] outline-none bg-white"
                      >
                        <option value="" disabled>Sélectionner une catégorie</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.nom}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Date de l'événement <span className="text-red-500">*</span></label>
                    <input
                      type="date"
                      required
                      value={formData.date_event}
                      onChange={(e) => setFormData({...formData, date_event: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E91E8C] outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#E91E8C] outline-none resize-none"
                      placeholder="Décrivez la réalisation..."
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Photos (1 min, 5 max) <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500">La première photo sera utilisée comme couverture.</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {[0, 1, 2, 3, 4].map((index) => (
                        <div key={index} className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden group">
                          {photos[index] ? (
                            <>
                              <img src={photos[index] as string} alt={`Upload ${index + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              <button
                                type="button"
                                onClick={() => removePhoto(index)}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <div 
                              className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                              onClick={() => !isUploading[index] && fileInputRefs[index].current?.click()}
                            >
                              {isUploading[index] ? (
                                <Loader2 className="w-6 h-6 text-[#E91E8C] animate-spin" />
                              ) : (
                                <>
                                  <Plus className="w-6 h-6 text-gray-400 mb-1" />
                                  <span className="text-[10px] text-gray-400 font-medium">Photo {index + 1}</span>
                                </>
                              )}
                            </div>
                          )}
                          <input
                            type="file"
                            ref={fileInputRefs[index]}
                            onChange={(e) => handlePhotoUpload(index, e)}
                            accept="image/*"
                            className="hidden"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
                <button 
                  type="button"
                  onClick={() => setIsRealisationModalOpen(false)}
                  disabled={isSaving}
                  className="px-6 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  form="realisation-form"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2 bg-[#E91E8C] text-white hover:bg-[#D81B80] rounded-lg transition-colors font-medium disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
