import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Palette, Gift, Sparkles, ClipboardList, Armchair, ArrowRight } from 'lucide-react';
import { SEO } from '../../components/SEO';

export default function Services() {
  const { t } = useTranslation();

  const services = [
    {
      id: 'deco',
      icon: <Palette className="w-16 h-16 text-primary" />,
      color: 'primary',
    },
    {
      id: 'surprise',
      icon: <Gift className="w-16 h-16 text-[#D4AF37]" />,
      color: 'gold',
    },
    {
      id: 'themes',
      icon: <Sparkles className="w-16 h-16 text-primary" />,
      color: 'primary',
    },
    {
      id: 'coord',
      icon: <ClipboardList className="w-16 h-16 text-[#D4AF37]" />,
      color: 'gold',
    },
    {
      id: 'rental',
      icon: <Armchair className="w-16 h-16 text-primary" />,
      color: 'primary',
    }
  ];

  return (
    <div className="flex flex-col w-full">
      <SEO 
        title="Nos Services"
        description="KPL SERVICES propose la décoration événementielle, organisation de surprises, thèmes personnalisés, coordination et location de matériel à Lomé, Togo."
        keywords="services décoration, organisation surprise, location matériel événement, Lomé"
        image="https://i.postimg.cc/xcbNmSYQ/services.jpg"
        url="/services"
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Décoration Événementielle",
          "provider": {
            "@type": "LocalBusiness",
            "name": "KPL SERVICES"
          },
          "areaServed": "Lomé, Togo"
        }}
      />
      {/* SECTION 1 - Hero Services */}
      <section 
        className="relative w-full h-[40vh] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: 'url(https://i.postimg.cc/xcbNmSYQ/services.jpg)',
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
            {t('services.hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90"
          >
            {t('services.hero.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* SECTION 2 - Liste des Services */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-24">
            {services.map((service, index) => {
              const isEven = index % 2 === 0;
              const tags = t(`services.items.${service.id}.tags`, { returnObjects: true }) as string[];

              return (
                <div key={service.id} className="relative">
                  <div className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}>
                    
                    {/* Image/Icon Column */}
                    <motion.div 
                      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6 }}
                      className="w-full lg:w-1/2 flex justify-center"
                    >
                      <div className={`w-64 h-64 rounded-full flex items-center justify-center shadow-xl ${
                        service.color === 'primary' ? 'bg-primary/10' : 'bg-[#D4AF37]/10'
                      }`}>
                        {service.icon}
                      </div>
                    </motion.div>

                    {/* Text Column */}
                    <motion.div 
                      initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className="w-full lg:w-1/2 flex flex-col items-start"
                    >
                      <h2 className="text-3xl font-bold text-primary mb-6">
                        {t(`services.items.${service.id}.title`)}
                      </h2>
                      
                      <p className="text-lg text-stone-600 leading-relaxed mb-8">
                        {t(`services.items.${service.id}.desc`)}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {tags.map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Link
                        to="/contact"
                        className="inline-flex items-center px-6 py-3 bg-white border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-md font-medium transition-colors group"
                      >
                        {t('services.contact_btn')}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>

                  </div>

                  {/* Separator (except for last item) */}
                  {index < services.length - 1 && (
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-24 h-px bg-stone-200" />
                  )}
                </div>
              );
            })}
          </div>
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
            {t('services.cta.title')}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl"
          >
            {t('services.cta.subtitle')}
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
              {t('services.cta.book')}
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-md text-lg font-medium transition-colors"
            >
              {t('services.cta.contact')}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
