import { useState, useEffect } from 'react'

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined'
      ? Notification.permission
      : 'default'
  )

  const isSupported = typeof Notification !== 'undefined'

  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if (!isSupported) return 'denied'
    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }

  const sendNotification = async (title: string, body: string) => {
    if (!isSupported) return
    if (Notification.permission !== 'granted') return
    try {
      // Essaie Service Worker d'abord (mobile)
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready
        await registration.showNotification(title, {
          body,
          icon: '/favicon.ico',
          badge: '/favicon.ico'
        })
      } else {
        // Fallback desktop
        new Notification(title, { body, icon: '/favicon.ico' })
      }
    } catch (error) {
      // Fallback si Service Worker échoue
      try {
        new Notification(title, { body, icon: '/favicon.ico' })
      } catch (e) {
        console.error('Notification error:', e)
      }
    }
  }

  return { permission, isSupported, requestPermission, sendNotification }
}
