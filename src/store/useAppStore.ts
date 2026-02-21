import { create } from 'zustand'
import { CounselingRecommendation } from '../analysis/orientation'
import { DivinationResult } from '../modules/iching'
import { TarotReading } from '../modules/tarot'
import { ZiweiResult, BaziResult } from '../modules/ziwei'

export type DivinationMethod = 'ziwei' | 'bazi' | 'iching' | 'tarot'

export interface DivinationResults {
  iching: DivinationResult | null
  tarot: TarotReading | null
  ziwei: ZiweiResult | null
  bazi: BaziResult | null
}

interface AppState {
  step: number
  birthDate: string
  birthHour: number
  gender: 'male' | 'female'
  selectedMethods: DivinationMethod[]
  result: CounselingRecommendation | null
  divinationResults: DivinationResults
  isLoading: boolean
  
  setStep: (step: number) => void
  setBirthDate: (date: string) => void
  setBirthHour: (hour: number) => void
  setGender: (gender: 'male' | 'female') => void
  toggleMethod: (method: DivinationMethod) => void
  setResult: (result: CounselingRecommendation | null) => void
  setDivinationResults: (results: DivinationResults) => void
  setIsLoading: (loading: boolean) => void
  reset: () => void
}

const initialState = {
  step: 1,
  birthDate: '',
  birthHour: 12,
  gender: 'male' as const,
  selectedMethods: ['ziwei', 'bazi'] as DivinationMethod[],
  result: null,
  divinationResults: {
    iching: null,
    tarot: null,
    ziwei: null,
    bazi: null,
  } as DivinationResults,
  isLoading: false,
}

export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  
  setStep: (step) => set({ step }),
  setBirthDate: (birthDate) => set({ birthDate }),
  setBirthHour: (birthHour) => set({ birthHour }),
  setGender: (gender) => set({ gender }),
  toggleMethod: (method) => set((state) => ({
    selectedMethods: state.selectedMethods.includes(method)
      ? state.selectedMethods.filter((m) => m !== method)
      : [...state.selectedMethods, method]
  })),
  setResult: (result) => set({ result }),
  setDivinationResults: (divinationResults) => set({ divinationResults }),
  setIsLoading: (isLoading) => set({ isLoading }),
  reset: () => set(initialState),
}))
