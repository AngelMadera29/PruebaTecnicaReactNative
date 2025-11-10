import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FavoritesState = {
  favorites: string[];
  addFavorite: (name: string) => void;
  removeFavorite: (name: string) => void;
  isFavorite: (name: string) => boolean;
};

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],

      addFavorite: (name) => {
        const current = get().favorites;
        if (!current.includes(name)) {
          set({ favorites: [...current, name] });
        }
      },

      removeFavorite: (name) => {
        const filtered = get().favorites.filter((item) => item !== name);
        set({ favorites: filtered });
      },

      isFavorite: (name) => get().favorites.includes(name),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
