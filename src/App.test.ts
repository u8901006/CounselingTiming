import { createElement } from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import './i18n'
import i18n from './i18n'
import App, { calculateSupplementalResults } from './App'
import { type DivinationMethod, useAppStore } from './store/useAppStore'
import { type HistoryRecord, useHistoryStore } from './store/useHistoryStore'
import { buildResultSummary } from './utils/resultSummary'
import * as westernAstroModule from './modules/western-astro'

const pdfMocks = vi.hoisted(() => ({
  buildPdfSummaryDocument: vi.fn(() => 'pdf-document'),
  exportSummaryAsPDF: vi.fn(),
}))

function makeHistoryRecord(): HistoryRecord {
  return {
    id: 'history-1',
    timestamp: Date.UTC(2026, 2, 14, 10, 30),
    birthDate: '1990-05-10',
    birthHour: 8,
    gender: 'male' as const,
    name: 'Taylor Swift',
    question: 'Should I start counseling now?',
    location: { city: 'Taipei', lat: 25.033, lng: 121.5654 },
    selectedMethods: ['numerology'] as DivinationMethod[],
    result: {
      timing: {
        score: 82,
        level: '建議',
        factors: [],
        summary: '目前是適合開始諮商的時機。',
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
      overallAdvice: '建議開始尋求適合的心理諮商資源。',
    },
    divinationResults: {
      ...initialAppState.divinationResults,
      numerology: {
        lifePathNumber: 7,
        destinyNumber: 3,
        soulNumber: 9,
        personalityNumber: 5,
        birthdayNumber: 1,
        expressionNumber: 6,
      },
    },
    summaryText: 'Counseling timing summary\nQuestion: Should I start counseling now?\nOverall recommendation: Start now.',
  }
}

vi.mock('./utils/resultSummary', () => ({
  buildResultSummary: vi.fn(() => 'summary'),
}))

vi.mock('./utils/pdfSummaryDocument', () => ({
  buildPdfSummaryDocument: pdfMocks.buildPdfSummaryDocument,
}))

vi.mock('./utils/export', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./utils/export')>()

  return {
    ...actual,
    exportSummaryAsPDF: pdfMocks.exportSummaryAsPDF,
  }
})

const initialAppState = useAppStore.getState()

afterEach(() => {
  act(() => {
    useAppStore.setState(initialAppState)
    useHistoryStore.getState().clearHistory()
  })
  vi.clearAllMocks()
})

describe('App result page', () => {
  it('renders the copy-all action on step 3 when result data exists', () => {
    act(() => {
      useAppStore.setState({
        step: 3,
        question: '我現在適合開始諮商嗎？',
        selectedMethods: ['numerology'],
        result: {
          timing: {
            score: 82,
            level: '建議',
            factors: [],
            summary: '目前是適合開始諮商的時機。',
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
          overallAdvice: '建議開始尋求適合的心理諮商資源。',
        },
        divinationResults: {
          ...useAppStore.getState().divinationResults,
          numerology: {
            lifePathNumber: 7,
            destinyNumber: 3,
            soulNumber: 9,
            personalityNumber: 5,
            birthdayNumber: 1,
            expressionNumber: 6,
          },
        },
      })
    })

    render(createElement(App))

    expect(screen.getByRole('button', { name: '複製全部占卜結果' })).toBeTruthy()
  })

  it('passes summary text to the export button on the result page', async () => {
    act(() => {
      useAppStore.setState({
        step: 3,
        question: '我現在適合開始諮商嗎？',
        selectedMethods: ['numerology'],
        result: {
          timing: {
            score: 82,
            level: '建議',
            factors: [],
            summary: '目前是適合開始諮商的時機。',
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
          overallAdvice: '建議開始尋求適合的心理諮商資源。',
        },
        divinationResults: {
          ...useAppStore.getState().divinationResults,
          numerology: {
            lifePathNumber: 7,
            destinyNumber: 3,
            soulNumber: 9,
            personalityNumber: 5,
            birthdayNumber: 1,
            expressionNumber: 6,
          },
        },
      })
    })

    render(createElement(App))

    expect(screen.getByRole('button', { name: '匯出 PDF' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: '匯出 PDF' }))

    await waitFor(() => {
      expect(pdfMocks.buildPdfSummaryDocument).toHaveBeenCalledWith(
        expect.objectContaining({
          summaryText: 'summary',
        }),
      )
    })
  })

  it('renders the history section when records exist', () => {
    act(() => {
      useHistoryStore.setState({ records: [makeHistoryRecord()] })
    })

    render(createElement(App))

    expect(screen.getByText(/history|歷史/i)).toBeTruthy()
  })
})

function seedStep2State() {
  act(() => {
    useAppStore.setState({
      ...initialAppState,
      step: 2,
      birthDate: '1990-05-10',
      birthHour: 8,
      gender: 'male',
      name: 'Taylor',
      question: '我現在適合開始諮商嗎？',
      selectedMethods: [],
      liuyaoMode: 'manual',
      liuyaoDraft: null,
      result: null,
      isLoading: false,
      divinationResults: {
        ...initialAppState.divinationResults,
        liuyao: null,
      },
    })
  })
}

function getLiuyaoLineLabel(lineNumber: number) {
  return i18n.t('liuyaoInput.lineLabel', { value: lineNumber })
}

function getLiuyaoLabel(key: 'moving' | 'manualSubmit' | 'autoMode' | 'generateDraft') {
  return i18n.t(`liuyaoInput.${key}`)
}

describe('App liuyao integration', () => {
  it('stores the normalized manual liuyao result in the main flow before step 3', async () => {
    seedStep2State()

    render(createElement(App))

    fireEvent.click(screen.getByRole('button', { name: /六爻/i }))

    expect(screen.getByRole('button', { name: /六爻/i }).getAttribute('aria-pressed')).toBe('true')

    const lineValues = ['yang', 'yin', 'yang', 'yin', 'yang', 'yin']

    lineValues.forEach((value, index) => {
      fireEvent.change(screen.getByLabelText(getLiuyaoLineLabel(index + 1)), { target: { value } })
    })

    const movingInputs = screen.getAllByLabelText(getLiuyaoLabel('moving'))
    fireEvent.click(movingInputs[1])
    fireEvent.click(movingInputs[4])
    fireEvent.click(screen.getByRole('button', { name: getLiuyaoLabel('manualSubmit') }))
    fireEvent.click(screen.getByRole('button', { name: '開始分析' }))

    await screen.findByRole('button', { name: '重新分析' })

    expect(screen.getByText('六爻卦象')).toBeTruthy()
    expect(screen.getByText('動爻：2、5')).toBeTruthy()

    expect(useAppStore.getState().step).toBe(3)
    expect(useAppStore.getState().divinationResults.liuyao).toEqual({
      lines: [
        { value: 'yang', isMoving: false },
        { value: 'yin', isMoving: true },
        { value: 'yang', isMoving: false },
        { value: 'yin', isMoving: false },
        { value: 'yang', isMoving: true },
        { value: 'yin', isMoving: false },
      ],
      movingLineIndexes: [2, 5],
    })

    expect(buildResultSummary).toHaveBeenCalledWith(
      expect.objectContaining({
        selectedMethods: ['liuyao'],
      }),
    )

    expect(useHistoryStore.getState().records[0]?.selectedMethods).toEqual(['liuyao'])
    expect(useHistoryStore.getState().records[0]?.divinationResults.liuyao).toEqual({
      lines: [
        { value: 'yang', isMoving: false },
        { value: 'yin', isMoving: true },
        { value: 'yang', isMoving: false },
        { value: 'yin', isMoving: false },
        { value: 'yang', isMoving: true },
        { value: 'yin', isMoving: false },
      ],
      movingLineIndexes: [2, 5],
    })
  })

  it('stores the normalized auto liuyao result in the main flow before step 3', async () => {
    seedStep2State()

    render(createElement(App))

    fireEvent.click(screen.getByRole('button', { name: /六爻/i }))
    fireEvent.click(screen.getByRole('button', { name: getLiuyaoLabel('autoMode') }))
    fireEvent.click(screen.getByRole('button', { name: getLiuyaoLabel('generateDraft') }))

    const generatedDraft = useAppStore.getState().liuyaoDraft

    expect(generatedDraft).not.toBeNull()

    fireEvent.click(screen.getByRole('button', { name: '開始分析' }))

    await screen.findByRole('button', { name: '重新分析' })

    expect(screen.getByText('六爻卦象')).toBeTruthy()

    expect(useAppStore.getState().step).toBe(3)
    expect(useAppStore.getState().divinationResults.liuyao).toEqual(generatedDraft)
  })

  it('automatically saves a complete history record after analysis', async () => {
    act(() => {
      useAppStore.setState({
        ...initialAppState,
        step: 2,
        birthDate: '1990-05-10',
        birthHour: 8,
        gender: 'male',
        name: 'Taylor Swift',
        question: 'Should I start counseling now?',
        location: { city: 'Taipei', lat: 25.033, lng: 121.5654 },
        selectedMethods: ['western-astro', 'numerology'],
        result: null,
        isLoading: false,
      })
    })

    render(createElement(App))

    fireEvent.click(screen.getByRole('button', { name: '開始分析' }))

    await screen.findByRole('button', { name: '重新分析' })

    const [record] = useHistoryStore.getState().records

    expect(record.summaryText).toBe('summary')
    expect(record.question).toBe('Should I start counseling now?')
    expect(record.name).toBe('Taylor Swift')
    expect(record.location).toEqual({ city: 'Taipei', lat: 25.033, lng: 121.5654 })
    expect(record.divinationResults.westernAstro).not.toBeNull()
    expect(record.divinationResults.numerology).not.toBeNull()
  })

  it('reloads a saved history record into step 3', async () => {
    act(() => {
      useHistoryStore.setState({ records: [makeHistoryRecord()] })
      useAppStore.setState({
        ...initialAppState,
        step: 1,
        result: null,
      })
    })

    render(createElement(App))

    fireEvent.click(screen.getByText('Should I start counseling now?'))

    expect(screen.getByText('綜合建議')).toBeTruthy()
    expect(useAppStore.getState().step).toBe(3)
    expect(useAppStore.getState().question).toBe('Should I start counseling now?')
  })
})

describe('calculateSupplementalResults', () => {
  it('throws when birth date is invalid', () => {
    expect(() =>
      calculateSupplementalResults({
        birthDate: 'invalid',
        birthHour: 10,
        name: 'Taylor',
        location: { city: 'Taipei', lat: 25.033, lng: 121.5654 },
        selectedMethods: ['western-astro'],
      }),
    ).toThrow('Invalid birth date')
  })

  it('calculates the selected supplemental methods when prerequisites are present', () => {
    const results = calculateSupplementalResults({
      birthDate: '1990-05-10',
      birthHour: 8,
      name: 'Taylor Swift',
      location: { city: 'Taipei', lat: 25.033, lng: 121.5654 },
      selectedMethods: ['western-astro', 'vedic-astro', 'numerology'],
    })

    expect(results.westernAstro).not.toBeNull()
    expect(results.vedicAstro).not.toBeNull()
    expect(results.numerology).not.toBeNull()
  })

  it('skips methods with missing prerequisites', () => {
    const results = calculateSupplementalResults({
      birthDate: '1990-05-10',
      birthHour: 8,
      name: '   ',
      location: { city: '', lat: 0, lng: 0 },
      selectedMethods: ['western-astro', 'vedic-astro', 'numerology'],
    })

    expect(results.westernAstro).toBeNull()
    expect(results.vedicAstro).toBeNull()
    expect(results.numerology).toBeNull()
  })

  it('isolates method failures so one error does not block the others', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const westernSpy = vi
      .spyOn(westernAstroModule, 'calculateWesternAstrology')
      .mockImplementation(() => {
        throw new Error('western failure')
      })

    const results = calculateSupplementalResults({
      birthDate: '1990-05-10',
      birthHour: 8,
      name: 'Taylor Swift',
      location: { city: 'Taipei', lat: 25.033, lng: 121.5654 },
      selectedMethods: ['western-astro', 'numerology'],
    })

    expect(results.westernAstro).toBeNull()
    expect(results.numerology).not.toBeNull()

    westernSpy.mockRestore()
    consoleErrorSpy.mockRestore()
  })
})
