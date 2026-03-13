import { beforeEach, describe, expect, it } from 'vitest'

import type { LiuyaoHexagramResult, LiuyaoMode } from '../modules/liuyao'
import type { TarotReading } from '../modules/tarot'
import { useAppStore } from './useAppStore'

interface LiuyaoStoreSlice {
  liuyaoMode: LiuyaoMode
  liuyaoDraft: LiuyaoHexagramResult | null
  setLiuyaoMode: (mode: LiuyaoMode) => void
  setLiuyaoDraft: (draft: LiuyaoHexagramResult | null) => void
}

const liuyaoDraft: LiuyaoHexagramResult = {
  lines: [
    { value: 'yang', isMoving: false },
    { value: 'yin', isMoving: true },
    { value: 'yang', isMoving: false },
    { value: 'yin', isMoving: false },
    { value: 'yang', isMoving: true },
    { value: 'yin', isMoving: false },
  ],
  movingLineIndexes: [2, 5],
}

const tarotReading: TarotReading = {
  cards: [],
  spread: 'single',
  summary: 'Existing tarot result',
  psychologicalState: {
    stressLevel: 10,
    hopeLevel: 60,
    needForSupport: 20,
    emotionalState: 'steady',
  },
  counselingAdvice: 'Keep this entry intact.',
}

describe('useAppStore Liuyao state', () => {
  beforeEach(() => {
    useAppStore.getState().reset()
  })

  it('supports liuyao selection and starts with empty liuyao state', () => {
    const state = useAppStore.getState()

    state.toggleMethod('liuyao' as never)

    const liuyaoState = useAppStore.getState() as typeof state & LiuyaoStoreSlice

    expect(liuyaoState.selectedMethods).toContain('liuyao')
    expect(liuyaoState.liuyaoMode).toBe('manual')
    expect(liuyaoState.liuyaoDraft).toBeNull()
    expect(liuyaoState.divinationResults.liuyao).toBeNull()
  })

  it('stores liuyao mode, draft input, and final result state', () => {
    const state = useAppStore.getState() as ReturnType<typeof useAppStore.getState> &
      LiuyaoStoreSlice

    state.setLiuyaoMode('auto')
    state.setLiuyaoDraft(liuyaoDraft)
    state.setDivinationResults({
      ...state.divinationResults,
      liuyao: liuyaoDraft,
    })

    const nextState = useAppStore.getState() as typeof state

    expect(nextState.liuyaoMode).toBe('auto')
    expect(nextState.liuyaoDraft).toEqual(liuyaoDraft)
    expect(nextState.divinationResults.liuyao).toEqual(liuyaoDraft)
  })

  it('merges partial liuyao result updates without clobbering other results', () => {
    const state = useAppStore.getState() as ReturnType<typeof useAppStore.getState> &
      LiuyaoStoreSlice

    state.setDivinationResults({ tarot: tarotReading })
    state.setLiuyaoDraft(liuyaoDraft)
    state.setDivinationResults({ liuyao: liuyaoDraft })

    const nextState = useAppStore.getState() as typeof state

    expect(nextState.liuyaoDraft).toEqual(liuyaoDraft)
    expect(nextState.divinationResults.liuyao).toEqual(liuyaoDraft)
    expect(nextState.divinationResults.tarot).toEqual(tarotReading)
  })
})
