export const notifyNewReservation = (nom: string, typeEvenement: string, pack: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('🎉 Nouvelle Réservation !', {
      body: `${nom} — ${pack} — ${typeEvenement}`
    });
  }
};

export const notifyNewMessage = (nom: string) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('💬 Nouveau Message !', {
      body: `${nom} vous a envoyé un message`
    });
  }
};
