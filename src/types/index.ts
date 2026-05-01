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
}

export type RootTabParamList = {
  Accueil: undefined;
  Services: undefined;
  Activite: undefined;
  Compte: undefined;
};