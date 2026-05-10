export interface Categorie {
  id: string;
  nom: string;
  created_at: string;
}

export interface Realisation {
  id: string;
  titre: string;
  description: string;
  categorie_id: string;
  date_event: string;
  photo_1?: string;
  photo_2?: string;
  photo_3?: string;
  photo_4?: string;
  photo_5?: string;
  created_at: string;
}

export interface Galerie {
  id: string;
  photo_url: string;
  created_at: string;
}

export interface Temoignage {
  id: string;
  nom: string;
  texte: string;
  note: number;
  created_at: string;
}

export interface Message {
  id: string;
  nom: string;
  email: string;
  message: string;
  lu: boolean;
  created_at: string;
}

export interface Reservation {
  id: string;
  nom: string;
  telephone: string;
  email: string;
  date_evenement: string;
  type_evenement: string;
  pack_choisi: string;
  prix: number;
  statut: 'en_attente' | 'confirmee' | 'annulee' | string;
  created_at: string;
}
