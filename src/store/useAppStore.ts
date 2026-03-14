import { create } from 'zustand'
import { CounselingRecommendation } from '../analysis/orientation'
import { DivinationResult } from '../modules/iching'
import { LiuyaoHexagramResult, LiuyaoMode } from '../modules/liuyao'
import { NumerologyResult } from '../modules/numerology/types'
import { TarotReading } from '../modules/tarot'
import { VedicAstroChart } from '../modules/vedic-astro/types'
import { WesternAstroChart } from '../modules/western-astro/types'
import { ZiweiResult, BaziResult } from '../modules/ziwei'

export type DivinationMethod =
  | 'ziwei'
  | 'bazi'
  | 'iching'
  | 'tarot'
  | 'liuyao'
  | 'western-astro'
  | 'vedic-astro'
  | 'numerology'

export interface DivinationResults {
  iching: DivinationResult | null
  liuyao: LiuyaoHexagramResult | null
  tarot: TarotReading | null
  ziwei: ZiweiResult | null
  bazi: BaziResult | null
  westernAstro: WesternAstroChart | null
  vedicAstro: VedicAstroChart | null
  numerology: NumerologyResult | null
}

export interface LocationInput {
  city: string
  lat: number
  lng: number
}

interface AppState {
  step: number
  birthDate: string
  birthHour: number
  gender: 'male' | 'female'
  name: string
  question: string
  location: LocationInput
  selectedMethods: DivinationMethod[]
  liuyaoMode: LiuyaoMode
  liuyaoDraft: LiuyaoHexagramResult | null
  result: CounselingRecommendation | null
  divinationResults: DivinationResults
  isLoading: boolean
  
  setStep: (step: number) => void
  setBirthDate: (date: string) => void
  setBirthHour: (hour: number) => void
  setGender: (gender: 'male' | 'female') => void
  setName: (name: string) => void
  setQuestion: (question: string) => void
  setLocation: (location: LocationInput) => void
  setSelectedMethods: (methods: DivinationMethod[]) => void
  toggleMethod: (method: DivinationMethod) => void
  setLiuyaoMode: (mode: LiuyaoMode) => void
  setLiuyaoDraft: (draft: LiuyaoHexagramResult | null) => void
  setResult: (result: CounselingRecommendation | null) => void
  setDivinationResults: (results: Partial<DivinationResults> | DivinationResults) => void
  setIsLoading: (loading: boolean) => void
  reset: () => void
}

const initialState = {
  step: 1,
  birthDate: '',
  birthHour: 12,
  gender: 'male' as const,
  name: '',
  question: '',
  location: {
    city: '',
    lat: 0,
    lng: 0,
  } as LocationInput,
  selectedMethods: ['ziwei', 'bazi'] as DivinationMethod[],
  liuyaoMode: 'manual' as LiuyaoMode,
  liuyaoDraft: null as LiuyaoHexagramResult | null,
  result: null,
  divinationResults: {
    iching: null,
    liuyao: null,
    tarot: null,
    ziwei: null,
    bazi: null,
    westernAstro: null,
    vedicAstro: null,
    numerology: null,
  } as DivinationResults,
  isLoading: false,
}

export const useAppStore = create<AppState>((set) => ({
  ...initialState,
  
  setStep: (step) => set({ step }),
  setBirthDate: (birthDate) => set({ birthDate }),
  setBirthHour: (birthHour) => set({ birthHour }),
  setGender: (gender) => set({ gender }),
  setName: (name) => set({ name }),
  setQuestion: (question) => set({ question }),
  setLocation: (location) => set({ location }),
  setSelectedMethods: (selectedMethods) => set({ selectedMethods }),
  toggleMethod: (method) => set((state) => {
    const isSelected = state.selectedMethods.includes(method)

    if (method === 'liuyao' && isSelected) {
      return {
        selectedMethods: state.selectedMethods.filter((m) => m !== method),
        liuyaoDraft: null,
      }
    }

    return {
      selectedMethods: isSelected
        ? state.selectedMethods.filter((m) => m !== method)
        : [...state.selectedMethods, method],
    }
  }),
  setLiuyaoMode: (liuyaoMode) => set({ liuyaoMode }),
  setLiuyaoDraft: (liuyaoDraft) => set({ liuyaoDraft }),
  setResult: (result) => set({ result }),
  setDivinationResults: (divinationResults) => set((state) => ({
    divinationResults: {
      ...state.divinationResults,
      ...divinationResults,
    },
  })),
  setIsLoading: (isLoading) => set({ isLoading }),
  reset: () => set(initialState),
}))
