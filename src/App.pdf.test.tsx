import { createElement } from 'react'
import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import './i18n'
import { useAppStore } from './store/useAppStore'

const exportButtonMock = vi.hoisted(() => vi.fn(() => <div data-testid="export-button-probe" />))

vi.mock('./components/ExportButton', () => ({
  default: exportButtonMock,
}))

import App from './App'

const initialAppState = useAppStore.getState()

afterEach(() => {
  act(() => {
    useAppStore.setState(initialAppState)
  })
  vi.clearAllMocks()
})

describe('App PDF export integration', () => {
  it('passes summary text to the export button on the result page', () => {
    act(() => {
      useAppStore.setState({
        ...initialAppState,
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
      })
    })

    render(createElement(App))

    expect(screen.getByTestId('export-button-probe')).toBeTruthy()
    expect(exportButtonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        targetId: 'result-content',
        summaryText: expect.stringContaining('諮商時機摘要'),
      }),
      expect.anything(),
    )
  })
})
