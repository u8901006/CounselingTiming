import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserData {
  name: string;
  gender: 'male' | 'female';
  birthDate: Date;
  birthTime: { hour: number; minute: number };
  location: { city: string; lat: number; lng: number };
}

interface UserDataState {
  data: UserData | null;
  setData: (data: UserData) => void;
  clearData: () => void;
}

export const useUserDataStore = create<UserDataState>()(
  persist(
    (set) => ({
      data: null,
      setData: (data) => set({ data }),
      clearData: () => set({ data: null }),
    }),
    {
      name: 'user-data-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          if (state?.data?.birthDate) {
            state.data.birthDate = new Date(state.data.birthDate);
          }
          return { state };
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
