import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';

export default function NotificationPermission() {
  const { t } = useTranslation();
  const { permission, requestPermission } = useNotifications();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('notification_banner_dismissed');
    if (permission === 'default' && !dismissed && 'Notification' in window) {
      setIsVisible(true);
    }
  }, [permission]);

  const handleEnable = async () => {
    await requestPermission();
    setIsVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem('notification_banner_dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-[#D4AF37] text-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between z-40 relative shadow-md">
      <p className="text-sm font-medium mb-3 sm:mb-0 text-center sm:text-left">
        {t('notifications.banner_text')}
      </p>
      <div className="flex items-center space-x-4">
        <button 
          onClick={handleEnable}
          className="text-sm font-bold bg-white text-[#D4AF37] px-4 py-1.5 rounded-md hover:bg-stone-100 transition-colors shadow-sm"
        >
          {t('notifications.enable')}
        </button>
        <button 
          onClick={handleDismiss} 
          className="text-white hover:text-stone-200 transition-colors p-1"
          aria-label={t('notifications.close')}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
