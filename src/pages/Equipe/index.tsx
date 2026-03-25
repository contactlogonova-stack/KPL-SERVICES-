import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Award } from 'lucide-react';

export default function Equipe() {
  const { t } = useTranslation();

  const teamPhotos = [
    "https://i.postimg.cc/gwT4knsB/IMG-20260321-WA0002.jpg",
    "https://i.postimg.cc/G4zqVMyY/IMG-20260321-WA0003.jpg",
    "https://i.postimg.cc/1gjM5fBM/IMG-20260321-WA0004.jpg",
    "https://i.postimg.cc/WD3XvMGH/IMG-20260321-WA0005.jpg"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* SECTION 1 - Hero Équipe */}
      <section className="relative w-full h-[40vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(135deg, #E91E8C 0%, #C0392B 100%)'
          }}
        />
        <div className="absolute inset-0 z-10 bg-black/40" />
        
        <div className="relative z-20 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            {t('team.hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90"
          >
            {t('team.hero.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* SECTION 2 - Dirigeante */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="max-w-sm mx-auto bg-white rounded-3xl p-8 shadow-xl border border-stone-100 flex flex-col items-center text-center relative"
          >
            {/* Badge */}
            <div className="absolute -top-4 bg-[#D4AF37] text-white px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-1.5 shadow-lg">
              <Award className="w-4 h-4" />
              {t('team.leader.badge')}
            </div>

            {/* Photo */}
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-primary mb-6 shadow-md">
              <img 
                src="https://i.postimg.cc/SRZbCr1s/IMG-20260321-WA0006.jpg" 
                alt="KPOSSOUALI LYDIE" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Info */}
            <h2 className="text-2xl font-bold text-stone-900 mb-2">
              KPOSSOUALI LYDIE
            </h2>
            <p className="text-primary font-medium">
              {t('team.leader.role')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 3 - L'Équipe */}
      <section className="py-20 bg-[#F8F8F8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl font-bold text-stone-900"
            >
              {t('team.grid.title')}
            </motion.h2>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8"
          >
            {teamPhotos.map((photo, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <img 
                  src={photo} 
                  alt={`Membre de l'équipe ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                {/* Subtle overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 4 - CTA */}
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
            {t('team.cta.title')}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl"
          >
            {t('team.cta.subtitle')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-white text-[#E91E8C] hover:bg-gray-50 rounded-md text-lg font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              {t('team.cta.contact')}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
