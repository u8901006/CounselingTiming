import { createElement } from 'react'
import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import './i18n'
import App, { calculateSupplementalResults } from './App'
import { useAppStore } from './store/useAppStore'
import * as westernAstroModule from './modules/western-astro'

const initialAppState = useAppStore.getState()

afterEach(() => {
  act(() => {
    useAppStore.setState(initialAppState)
  })
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

    expect(screen.getByRole('button', { name: '複製全部占卜結果' })).toBeInTheDocument()
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
