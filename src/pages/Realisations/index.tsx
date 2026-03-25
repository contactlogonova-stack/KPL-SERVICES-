import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Images, X, ChevronLeft, ChevronRight, Calendar, Tag } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { SEO } from '../../components/SEO';

interface Category {
  id: string;
  nom: string;
}

interface Realisation {
  id: string;
  titre: string;
  description: string;
  categorie_id: string;
  date_event: string;
  photo_1: string;
  photo_2?: string;
  photo_3?: string;
  photo_4?: string;
  photo_5?: string;
  created_at: string;
}

export default function Realisations() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [realisations, setRealisations] = useState<Realisation[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [selectedRealisation, setSelectedRealisation] = useState<Realisation | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories
      const { data: catData, error: catError } = await supabase
        .from('categories')
        .select('*')
        .order('nom');
        
      if (catError) throw catError;
      if (catData) setCategories(catData);

      // Fetch realisations
      const { data: realData, error: realError } = await supabase
        .from('realisations')
        .select('*')
        .order('date_event', { ascending: false });
        
      if (realError) throw realError;
      if (realData) setRealisations(realData);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRealisations = activeCategory === 'all' 
    ? realisations 
    : realisations.filter(r => r.categorie_id === activeCategory);

  const getCategoryName = (id: string) => {
    return categories.find(c => c.id === id)?.nom || 'Catégorie';
  };

  const getPhotos = (realisation: Realisation) => {
    const photos = [realisation.photo_1];
    if (realisation.photo_2) photos.push(realisation.photo_2);
    if (realisation.photo_3) photos.push(realisation.photo_3);
    if (realisation.photo_4) photos.push(realisation.photo_4);
    if (realisation.photo_5) photos.push(realisation.photo_5);
    return photos;
  };

  const openModal = (realisation: Realisation) => {
    setSelectedRealisation(realisation);
    setCurrentPhotoIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedRealisation(null);
    document.body.style.overflow = 'auto';
  };

  const nextPhoto = () => {
    if (!selectedRealisation) return;
    const photos = getPhotos(selectedRealisation);
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    if (!selectedRealisation) return;
    const photos = getPhotos(selectedRealisation);
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(date);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      <SEO 
        title="Nos Réalisations"
        description="Découvrez les réalisations de KPL SERVICES : mariages, anniversaires, événements d'entreprise. Des décorations uniques et sur mesure à Lomé, Togo."
        keywords="réalisations décoration, portfolio événementiel, mariage Lomé, anniversaire Togo"
        image="https://i.postimg.cc/SnfsLSPF/realisations.jpg"
        url="/realisations"
      />
      {/* SECTION 1 - Hero Réalisations */}
      <section 
        className="relative w-full h-[40vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://i.postimg.cc/SnfsLSPF/realisations.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="absolute inset-0 z-10 bg-black/55" />
        
        <div className="relative z-20 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            {t('realisations.hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90"
          >
            {t('realisations.hero.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* SECTION 2 - Filtres + Grille */}
      <section className="py-20 bg-stone-50 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === 'all'
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
              }`}
            >
              {t('realisations.filters.all')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                }`}
              >
                {cat.nom}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
                  <div className="w-full h-64 bg-stone-200" />
                  <div className="p-6">
                    <div className="h-6 bg-stone-200 rounded w-3/4 mb-4" />
                    <div className="h-4 bg-stone-200 rounded w-1/4 mb-6" />
                    <div className="h-10 bg-stone-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRealisations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-stone-400">
              <Images className="w-20 h-20 mb-6 opacity-50" />
              <p className="text-xl font-medium">{t('realisations.grid.empty')}</p>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filteredRealisations.map((realisation) => (
                  <motion.div
                    key={realisation.id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                  >
                    <div className="relative w-full h-64 overflow-hidden">
                      <img 
                        src={realisation.photo_1} 
                        alt={realisation.titre}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        {getCategoryName(realisation.categorie_id)}
                      </div>
                    </div>
                    
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-bold text-stone-900 mb-2 line-clamp-1">
                        {realisation.titre}
                      </h3>
                      <div className="flex items-center text-stone-500 text-sm mb-6">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(realisation.date_event)}
                      </div>
                      
                      <div className="mt-auto">
                        <button
                          onClick={() => openModal(realisation)}
                          className="w-full py-3 bg-stone-100 text-stone-800 hover:bg-primary hover:text-white rounded-xl font-medium transition-colors"
                        >
                          {t('realisations.grid.view_details')}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* SECTION 3 - CTA */}
      <section 
        className="py-20 flex items-center justify-center text-center px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(135deg, #E91E8C 0%, #C0392B 100%)' }}
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-white mb-6"
          >
            {t('realisations.cta.title')}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl"
          >
            {t('realisations.cta.subtitle')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/reservation"
              className="px-8 py-4 bg-white text-[#E91E8C] hover:bg-gray-50 rounded-md text-lg font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              {t('realisations.cta.book')}
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-md text-lg font-medium transition-colors"
            >
              {t('realisations.cta.contact')}
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Modal Détail Réalisation */}
      <AnimatePresence>
        {selectedRealisation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
            >
              {/* Close Button */}
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Photos Carousel */}
              <div className="w-full md:w-3/5 bg-black relative flex items-center justify-center min-h-[300px] md:min-h-full">
                {getPhotos(selectedRealisation).length > 1 && (
                  <>
                    <button 
                      onClick={prevPhoto}
                      className="absolute left-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button 
                      onClick={nextPhoto}
                      className="absolute right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-10"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
                
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentPhotoIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    src={getPhotos(selectedRealisation)[currentPhotoIndex]}
                    alt={`${selectedRealisation.titre} - Photo ${currentPhotoIndex + 1}`}
                    className="w-full h-full object-contain max-h-[60vh] md:max-h-[90vh]"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                {/* Dots */}
                {getPhotos(selectedRealisation).length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {getPhotos(selectedRealisation).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentPhotoIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentPhotoIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="w-full md:w-2/5 p-8 flex flex-col overflow-y-auto">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1.5">
                    <Tag className="w-4 h-4" />
                    {getCategoryName(selectedRealisation.categorie_id)}
                  </span>
                  <span className="text-stone-500 text-sm flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {formatDate(selectedRealisation.date_event)}
                  </span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-6">
                  {selectedRealisation.titre}
                </h2>
                
                <div className="prose prose-stone">
                  <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
                    {selectedRealisation.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
