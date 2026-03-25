import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useInView } from 'motion/react';
import { Heart, Lightbulb, Star, Shield, Zap } from 'lucide-react';

const AnimatedCounter = ({ target, suffix, title }: { target: number, suffix: string, title: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps

      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.ceil(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [isInView, target]);

  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <div className="text-4xl md:text-5xl font-bold mb-2">
        {count}{suffix}
      </div>
      <div className="text-lg text-white/90">{title}</div>
    </div>
  );
};

export default function APropos() {
  const { t } = useTranslation();

  const values = [
    { id: 'creativity', icon: <Lightbulb className="w-8 h-8 text-primary" /> },
    { id: 'excellence', icon: <Star className="w-8 h-8 text-primary" /> },
    { id: 'passion', icon: <Heart className="w-8 h-8 text-primary" /> },
    { id: 'commitment', icon: <Shield className="w-8 h-8 text-primary" /> },
    { id: 'innovation', icon: <Zap className="w-8 h-8 text-primary" /> },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* SECTION 1 - Hero */}
      <section className="relative w-full h-[40vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(135deg, #E91E8C 0%, #D4AF37 100%)'
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
            {t('about.hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90"
          >
            {t('about.hero.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* SECTION 2 - Notre Histoire */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6">
                {t('about.story.title')}
              </h2>
              <p className="text-lg text-stone-600 leading-relaxed">
                {t('about.story.text')}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="relative h-[400px] rounded-2xl overflow-hidden flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, rgba(233,30,140,0.1) 0%, rgba(212,175,55,0.2) 100%)' }}
            >
              <Heart className="w-24 h-24 text-primary opacity-80" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 3 - Nos Valeurs */}
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
              {t('about.values.title')}
            </motion.h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {values.map((value) => (
              <motion.div
                key={value.id}
                variants={itemVariants}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-stone-900 mb-3">
                  {t(`about.values.items.${value.id}.title`)}
                </h3>
                <p className="text-stone-600">
                  {t(`about.values.items.${value.id}.desc`)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SECTION 4 - Chiffres Clés */}
      <section 
        className="py-20 text-white"
        style={{ background: 'linear-gradient(135deg, #E91E8C 0%, #C0392B 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            <AnimatedCounter target={7} suffix="+" title={t('about.stats.years')} />
            <AnimatedCounter target={400} suffix="+" title={t('about.stats.events')} />
            <AnimatedCounter target={100} suffix="%" title={t('about.stats.clients')} />
            <AnimatedCounter target={5} suffix="⭐" title={t('about.stats.rating')} />
          </div>
        </div>
      </section>
    </div>
  );
}
