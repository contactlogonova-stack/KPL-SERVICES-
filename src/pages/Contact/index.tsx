import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { notifyNewMessage } from '../../utils/notificationService';

// Custom TikTok Icon since it's not in Lucide
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function Contact() {
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    message: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.nom || !formData.email || formData.message.length < 10) {
      return;
    }

    try {
      setStatus('loading');
      
      const { error } = await supabase
        .from('messages')
        .insert([
          { 
            nom: formData.nom, 
            email: formData.email, 
            message: formData.message,
            lu: false
          }
        ]);

      if (error) throw error;
      
      // Envoi des notifications
      try {
        notifyNewMessage(formData.nom);
      } catch (notifError) {
        console.error('Erreur lors de l\'envoi des notifications:', notifError);
      }
      
      setStatus('success');
      setFormData({ nom: '', email: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
      
      // Reset error message after 5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* SECTION 1 - Hero Contact */}
      <section className="relative w-full h-[40vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(135deg, #C0392B 0%, #D4AF37 100%)'
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
            {t('contact.hero.title')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-white/90"
          >
            {t('contact.hero.subtitle')}
          </motion.p>
        </div>
      </section>

      {/* SECTION 2 - Infos + Formulaire */}
      <section className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Colonne Gauche - Informations */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-stone-900 mb-8">
                {t('contact.info.title')}
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-4">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-stone-600 mb-1">{t('contact.info.address1')}</p>
                    <p className="text-stone-600">{t('contact.info.address2')}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-4">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-stone-600 mb-1">+228 91 33 34 68</p>
                    <p className="text-stone-600">+228 90 43 87 98</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-4">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div className="flex items-center h-12">
                    <p className="text-stone-600">kpllyly@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mr-4">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div className="flex items-center h-12">
                    <p className="text-stone-600">{t('contact.info.hours')}</p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="text-xl font-bold text-stone-900 mb-6">
                  {t('contact.info.follow')}
                </h3>
                <div className="flex space-x-4">
                  <a 
                    href="https://www.tiktok.com/@kpl.services" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center text-stone-600 hover:bg-primary hover:text-white transition-colors duration-300"
                  >
                    <TikTokIcon className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://www.instagram.com/kpl.services" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center text-stone-600 hover:bg-primary hover:text-white transition-colors duration-300"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a 
                    href="https://www.facebook.com/share/1AWgHarLPa/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center text-stone-600 hover:bg-primary hover:text-white transition-colors duration-300"
                  >
                    <Facebook className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Colonne Droite - Formulaire */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 md:p-10 rounded-2xl shadow-lg"
            >
              <h2 className="text-3xl font-bold text-stone-900 mb-8">
                {t('contact.form.title')}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="nom" className="block text-sm font-medium text-stone-700 mb-2">
                    {t('contact.form.name')} *
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    required
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-stone-50"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
                    {t('contact.form.email')} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-stone-50"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-stone-700 mb-2">
                    {t('contact.form.message')} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    minLength={10}
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-primary focus:border-primary transition-colors bg-stone-50 resize-none"
                  />
                </div>

                {status === 'success' && (
                  <div className="p-4 bg-green-50 text-green-700 rounded-xl flex items-start">
                    <CheckCircle2 className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                    <p>{t('contact.form.success')}</p>
                  </div>
                )}

                {status === 'error' && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-start">
                    <XCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                    <p>{t('contact.form.error')}</p>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-4 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t('contact.form.sending')}
                    </>
                  ) : (
                    t('contact.form.submit')
                  )}
                </button>
              </form>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* SECTION 3 - Google Maps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-stone-900 mb-12"
          >
            {t('contact.map.title')}
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full h-[400px] rounded-2xl overflow-hidden shadow-lg"
          >
            <iframe
              src="https://maps.google.com/maps?q=Kpl+services,+04,+Lom%C3%A9&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="400"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps KPL SERVICES"
            />
          </motion.div>
        </div>
      </section>

      {/* SECTION 4 - CTA */}
      <section 
        className="py-20 flex items-center justify-center text-center px-4 sm:px-6 lg:px-8"
        style={{ background: 'linear-gradient(135deg, #C0392B 0%, #D4AF37 100%)' }}
      >
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-white mb-10"
          >
            {t('contact.cta.title')}
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              to="/reservation"
              className="px-8 py-4 bg-white text-[#C0392B] hover:bg-gray-50 rounded-md text-lg font-medium transition-colors shadow-lg hover:shadow-xl"
            >
              {t('contact.cta.book')}
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
