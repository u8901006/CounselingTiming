import { describe, expect, it, vi } from 'vitest'

import { calculateSupplementalResults } from './App'
import * as westernAstroModule from './modules/western-astro'

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
