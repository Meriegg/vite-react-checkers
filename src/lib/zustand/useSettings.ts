import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface UseSettings {
  boardHeight: number;
  boardWidth: number;
  occupyRows: number;
  setBoardHeight: (input: number) => void;
  setBoardWidth: (input: number) => void;
  setBoardOccupyRows: (input: number) => void;
}

export const useSettings = create(
  persist<UseSettings>(
    (set, get) => ({
      boardHeight: 9,
      boardWidth: 9,
      occupyRows: 3,
      setBoardHeight: (input) => set(() => ({
        boardHeight: input
      })),
      setBoardWidth: (input) => set(() => ({
        boardWidth: input
      })),
      setBoardOccupyRows: (input) => set(() => ({
        occupyRows: input
      }))
    }),
    {
      name: 'settings', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage),
    }
  )
)