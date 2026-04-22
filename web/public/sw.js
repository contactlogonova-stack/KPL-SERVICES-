self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {}
  self.registration.showNotification(data.title || 'KPL SERVICES', {
    body: data.body || '',
    icon: '/favicon.svg',
    badge: '/favicon.svg'
  })
})

self.addEventListener('notificationclick', function(event) {
  event.notification.close()
  event.waitUntil(clients.openWindow('/admin'))
})

// Basic fetch handler to satisfy PWA installability requirements
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request);
    })
  );
});
