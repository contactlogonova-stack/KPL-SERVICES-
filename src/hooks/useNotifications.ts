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

  const sendNotification = (title: string, body: string) => {
    if (!isSupported) return
    if (Notification.permission !== 'granted') return
    try {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico'
      })
    } catch (error) {
      console.error('Notification error:', error)
    }
  }

  return { permission, isSupported, requestPermission, sendNotification }
}
