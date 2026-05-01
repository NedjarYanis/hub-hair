export interface User {
  id: string;
  name: string;
  role: 'client' | 'barber';
}

export interface Barber {
  id: string;
  name: string;
  isMobile: boolean;
  latitude: number;
  longitude: number;
  rating?: number; // Désormais officiel
  price?: number;  // Désormais officiel
}

// Déclaration de la navigation interne de l'onglet Recherche
export type DiscoveryStackParamList = {
  DiscoveryMain: undefined;
  BarberProfile: { barberId: string; barberName: string };
};

export type RootTabParamList = {
  Accueil: undefined;
  Services: undefined;
  Activite: undefined;
  Compte: undefined;
};