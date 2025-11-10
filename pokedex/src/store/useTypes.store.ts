import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TypesState = {
  types: string[];                 
  setTypes: (types: string[]) => void;
  clearTypes: () => void;        
};

export const useTypesStore = create<TypesState>()(
  persist(
    (set) => ({
      types: [],

      setTypes: (types: string[]) => set({ types }),

      clearTypes: () => set({ types: [] }),
    }),
    {
      name: 'types-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
