import { beforeEach, describe, expect, it } from 'vitest'

import type { CounselingRecommendation } from '../analysis/orientation'
import type { WesternAstroChart } from '../modules/western-astro/types'
import type { ZiweiResult } from '../modules/ziwei'
import { useHistoryStore } from './useHistoryStore'

const mockRecommendation = {
  timing: {
    score: 80,
    level: '建議',
    factors: [],
    summary: '適合開始諮商。',
  },
  orientation: {
    therapies: [],
    dominantElement: 'water',
    deficientElement: 'fire',
    elementScores: {
      wood: 20,
      fire: 10,
      water: 35,
      earth: 15,
      metal: 20,
    },
  },
  overallAdvice: '先從穩定支持性的資源開始。',
} satisfies CounselingRecommendation

const mockZiwei = {
  majorStars: ['紫微', '天府'],
  lifeAnalysis: '命宮穩定。',
  personalityAnalysis: '個性敏銳。',
  counselingAdvice: '適合探索式晤談。',
} as ZiweiResult

const mockWestern = {
  planets: [],
  ascendant: { sign: 'Leo', degree: 10 },
  midheaven: { sign: 'Aries', degree: 20 },
  houses: [],
  aspects: [],
} as unknown as WesternAstroChart

describe('useHistoryStore', () => {
  beforeEach(() => {
    useHistoryStore.setState({ records: [] })
  })

  it('stores a full history snapshot', () => {
    useHistoryStore.getState().addRecord({
      birthDate: '1990-01-01',
      birthHour: 12,
      gender: 'male',
      name: 'Alex',
      question: 'Should I start counseling now?',
      location: { city: 'Taipei', lat: 25.03, lng: 121.56 },
      selectedMethods: ['ziwei', 'western-astro'],
      result: mockRecommendation,
      divinationResults: {
        iching: null,
        liuyao: null,
        tarot: null,
        ziwei: mockZiwei,
        bazi: null,
        westernAstro: mockWestern,
        vedicAstro: null,
        numerology: null,
      },
      summaryText: 'summary',
    })

    const [record] = useHistoryStore.getState().records

    expect(record.name).toBe('Alex')
    expect(record.question).toContain('counseling')
    expect(record.location.city).toBe('Taipei')
    expect(record.divinationResults.westernAstro).toEqual(mockWestern)
    expect(record.summaryText).toBe('summary')
  })

  it('keeps newest records first and trims to 50', () => {
    for (let index = 0; index < 55; index += 1) {
      useHistoryStore.getState().addRecord({
        birthDate: '1990-01-01',
        birthHour: 12,
        gender: 'male',
        name: `Alex-${index}`,
        question: `question-${index}`,
        location: { city: 'Taipei', lat: 25.03, lng: 121.56 },
        selectedMethods: ['ziwei'],
        result: mockRecommendation,
        divinationResults: {
          iching: null,
          liuyao: null,
          tarot: null,
          ziwei: mockZiwei,
          bazi: null,
          westernAstro: null,
          vedicAstro: null,
          numerology: null,
        },
        summaryText: `summary-${index}`,
      })
    }

    const records = useHistoryStore.getState().records

    expect(records).toHaveLength(50)
    expect(records[0].question).toBe('question-54')
    expect(records[records.length - 1]?.question).toBe('question-5')
  })

  it('removes a single record by id', () => {
    useHistoryStore.getState().addRecord({
      birthDate: '1990-01-01',
      birthHour: 12,
      gender: 'male',
      name: 'Alex',
      question: 'keep',
      location: { city: 'Taipei', lat: 25.03, lng: 121.56 },
      selectedMethods: ['ziwei'],
      result: mockRecommendation,
      divinationResults: {
        iching: null,
        liuyao: null,
        tarot: null,
        ziwei: mockZiwei,
        bazi: null,
        westernAstro: null,
        vedicAstro: null,
        numerology: null,
      },
      summaryText: 'summary-1',
    })

    useHistoryStore.getState().addRecord({
      birthDate: '1990-01-02',
      birthHour: 13,
      gender: 'female',
      name: 'Blair',
      question: 'remove',
      location: { city: 'Taipei', lat: 25.03, lng: 121.56 },
      selectedMethods: ['bazi'],
      result: mockRecommendation,
      divinationResults: {
        iching: null,
        liuyao: null,
        tarot: null,
        ziwei: null,
        bazi: null,
        westernAstro: null,
        vedicAstro: null,
        numerology: null,
      },
      summaryText: 'summary-2',
    })

    const recordsBeforeRemove = useHistoryStore.getState().records
    const idToRemove = recordsBeforeRemove.find((record) => record.question === 'remove')?.id

    expect(idToRemove).toBeTruthy()

    useHistoryStore.getState().removeRecord(idToRemove as string)

    const records = useHistoryStore.getState().records
    expect(records).toHaveLength(1)
    expect(records[0].question).toBe('keep')
  })

  it('clears all history records', () => {
    useHistoryStore.getState().addRecord({
      birthDate: '1990-01-01',
      birthHour: 12,
      gender: 'male',
      name: 'Alex',
      question: 'keep',
      location: { city: 'Taipei', lat: 25.03, lng: 121.56 },
      selectedMethods: ['ziwei'],
      result: mockRecommendation,
      divinationResults: {
        iching: null,
        liuyao: null,
        tarot: null,
        ziwei: mockZiwei,
        bazi: null,
        westernAstro: null,
        vedicAstro: null,
        numerology: null,
      },
      summaryText: 'summary',
    })

    useHistoryStore.getState().clearHistory()

    expect(useHistoryStore.getState().records).toEqual([])
  })
})
