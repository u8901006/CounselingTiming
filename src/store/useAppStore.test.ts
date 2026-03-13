import { beforeEach, describe, expect, it } from 'vitest'

import { useAppStore } from './useAppStore'

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.getState().reset()
  })

  it('starts with the normalized integration fields', () => {
    const state = useAppStore.getState()

    expect(state.name).toBe('')
    expect(state.question).toBe('')
    expect(state.location).toEqual({ city: '', lat: 0, lng: 0 })
    expect(state.divinationResults).toEqual({
      iching: null,
      liuyao: null,
      tarot: null,
      ziwei: null,
      bazi: null,
      westernAstro: null,
      vedicAstro: null,
      numerology: null,
    })
  })

  it('resets the normalized fields back to their defaults', () => {
    const state = useAppStore.getState()

    state.setName('Taylor')
    state.setQuestion('What should I focus on next?')
    state.setLocation({ city: 'Taipei', lat: 25.033, lng: 121.5654 })

    state.reset()

    expect(useAppStore.getState().name).toBe('')
    expect(useAppStore.getState().question).toBe('')
    expect(useAppStore.getState().location).toEqual({ city: '', lat: 0, lng: 0 })
  })
})
