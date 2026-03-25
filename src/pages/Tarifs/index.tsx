import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Star } from 'lucide-react';

type TabType = 'women' | 'men' | 'wedding';

interface Pack {
  name: string;
  price: string;
  items?: string[];
  guests?: number;
  bonus?: string;
  isPopular?: boolean;
}

export default function Tarifs() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TabType>('women');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'women', label: t('pricing.tabs.women') },
    { id: 'men', label: t('pricing.tabs.men') },
    { id: 'wedding', label: t('pricing.tabs.wedding') }
  ];

  const womenPacks = t('pricing.women_packs', { returnObjects: true }) as Pack[];
  const menPacks = t('pricing.men_packs', { returnObjects: true }) as Pack[];
  const weddingPacks = t('pricing.wedding_packs', { returnObjects: true }) as Pack[];
  const weddingCommon = t('pricing.wedding_common', { returnObjects: true }) as string[];

  const renderCard = (pack: Pack, index: number) => {
    return (
      <motion.div
        key={pack.name}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className={`relative flex flex-col bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow border-2 ${
          pack.isPopular ? 'border-primary' : 'border-stone-100'
        }`}
      >
        {pack.isPopular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-md">
            <Star className="w-4 h-4 fill-current" />
            {t('pricing.popular')}
          </div>
        )}

        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-primary mb-4">{pack.name}</h3>
          <div className="text-3xl lg:text-4xl font-black text-[#D4AF37] mb-2">
            {pack.price}
          </div>
          {pack.guests && (
            <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mt-2">
              {pack.guests} {t('pricing.guests')}
            </div>
          )}
        </div>

        <div className="flex-grow">
          <ul className="space-y-4 mb-8">
            {pack.items && pack.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-stone-600 leading-relaxed">{item}</span>
              </li>
            ))}
            {pack.bonus && (
              <li className="flex items-start gap-3 mt-6 pt-6 border-t border-stone-100">
                <Star className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span className="text-stone-800 font-medium leading-relaxed">{pack.bonus}</span>
              </li>
            )}
          </ul>
        </div>

        <Link
          to="/reservation"
          className={`w-full py-4 rounded-xl text-center font-bold transition-colors ${
            pack.isPopular 
              ? 'bg-primary text-white hover:bg-primary/90 shadow-md' 
              : 'bg-stone-100 text-stone-800 hover:bg-stone-200'
          }`}
        >
          {t('pricing.book_pack')}
        </Link>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col w-full">
      {/* SECTION 1 - Hero Tarifs */}
      <section className="relative w-full h-[40vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(135deg, #C0392B 0%, #E91E8C 100%)'
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
            {t('pricing.hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90"
          >
            {t('pricing.hero.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* SECTION 2 - Onglets Tarifs */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Tabs Navigation */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-full text-sm md:text-base font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-md scale-105'
                    : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tabs Content */}
          <div className="min-h-[600px]">
            <AnimatePresence mode="wait">
              {activeTab === 'women' && (
                <motion.div
                  key="women"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {womenPacks.map((pack, index) => renderCard(pack, index))}
                </motion.div>
              )}

              {activeTab === 'men' && (
                <motion.div
                  key="men"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
                >
                  {menPacks.map((pack, index) => renderCard(pack, index))}
                </motion.div>
              )}

              {activeTab === 'wedding' && (
                <motion.div
                  key="wedding"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="flex flex-col gap-16"
                >
                  {/* Common Content for Wedding */}
                  <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 max-w-4xl mx-auto w-full">
                    <h3 className="text-2xl font-bold text-stone-800 mb-6 text-center">Inclus dans tous les packs Mariage</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {weddingCommon.map((item, i) => {
                        const [title, ...rest] = item.split(':');
                        return (
                          <div key={i} className="flex flex-col gap-1">
                            <span className="font-bold text-primary">{title}:</span>
                            <span className="text-stone-600">{rest.join(':')}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Wedding Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {weddingPacks.map((pack, index) => renderCard(pack, index))}
                  </div>

                  {/* Wedding Note */}
                  <div className="text-center mt-8">
                    <p className="inline-block bg-red-50 text-red-600 px-6 py-3 rounded-lg font-medium border border-red-100">
                      ⚠️ {t('pricing.wedding_note')}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
            {t('pricing.cta.title')}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl"
          >
            {t('pricing.cta.subtitle')}
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
              {t('pricing.cta.book')}
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white/10 rounded-md text-lg font-medium transition-colors"
            >
              {t('pricing.cta.contact')}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
