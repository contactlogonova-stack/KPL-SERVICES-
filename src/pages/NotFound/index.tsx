import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, AlertCircle } from 'lucide-react';
import { SEO } from '../../components/SEO';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-stone-50 px-4 sm:px-6 lg:px-8">
      <SEO 
        title="404 - Page introuvable"
        description="La page que vous recherchez n'existe pas."
        url="/404"
      />
      
      <div className="max-w-md w-full text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <div className="relative">
            <h1 className="text-9xl font-extrabold text-primary/10 tracking-tighter">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <AlertCircle className="w-20 h-20 text-primary" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-3xl font-bold text-stone-900">
            {t('not_found.title')}
          </h2>
          <p className="text-lg text-stone-600">
            {t('not_found.subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            to="/"
            className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5 mr-2" />
            {t('not_found.back_home')}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
