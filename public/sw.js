self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {}
  self.registration.showNotification(data.title || 'KPL SERVICES', {
    body: data.body || '',
    icon: '/favicon.ico',
    badge: '/favicon.ico'
  })
})

self.addEventListener('notificationclick', function(event) {
  event.notification.close()
  event.waitUntil(clients.openWindow('/admin'))
})
