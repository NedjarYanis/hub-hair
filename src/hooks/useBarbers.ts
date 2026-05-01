import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import * as Location from 'expo-location';
import { Barber } from '../types';

export const useBarbers = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [userLoc, setUserLoc] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Demander la position réelle
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          let loc = await Location.getCurrentPositionAsync({});
          setUserLoc(loc.coords);
        }

        // 2. Récupérer les barbiers de Firebase
        const querySnapshot = await getDocs(collection(db, "barbers"));
        const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any;
        setBarbers(list);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { barbers, userLoc, loading };
};