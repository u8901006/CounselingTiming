import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CounselingRecommendation } from '../analysis/orientation'
import { DivinationResult } from '../modules/iching'
import { TarotReading } from '../modules/tarot'
import { ZiweiResult, BaziResult } from '../modules/ziwei'
import { DivinationMethod } from './useAppStore'

interface DivinationResultsSnapshot {
  iching: DivinationResult | null
  tarot: TarotReading | null
  ziwei: ZiweiResult | null
  bazi: BaziResult | null
}

export interface HistoryRecord {
  id: string
  timestamp: number
  birthDate: string
  birthHour: number
  gender: 'male' | 'female'
  selectedMethods: DivinationMethod[]
  result: CounselingRecommendation | null
  divinationResults: DivinationResultsSnapshot
}

interface HistoryState {
  records: HistoryRecord[]
  addRecord: (record: Omit<HistoryRecord, 'id' | 'timestamp'>) => void
  removeRecord: (id: string) => void
  clearHistory: () => void
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      records: [],
      
      addRecord: (record) => set((state) => ({
        records: [
          {
            ...record,
            id: generateId(),
            timestamp: Date.now(),
          },
          ...state.records,
        ].slice(0, 50)
      })),
      
      removeRecord: (id) => set((state) => ({
        records: state.records.filter((r) => r.id !== id)
      })),
      
      clearHistory: () => set({ records: [] }),
    }),
    {
      name: 'counseling-history',
    }
  )
)
