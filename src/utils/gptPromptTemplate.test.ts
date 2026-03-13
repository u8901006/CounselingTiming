import { describe, expect, it } from 'vitest'

import { buildGptPrompt } from './gptPromptTemplate'

describe('buildGptPrompt', () => {
  it('uses the real supplemental method ids in the generated prompt', () => {
    const prompt = buildGptPrompt({
      question: 'What should I focus on next?',
      selectedMethods: ['western-astro', 'vedic-astro', 'numerology'],
      divinationResults: {
        iching: null,
        tarot: null,
        ziwei: null,
        bazi: null,
        westernAstro: {
          planets: [
            {
              name: 'Sun',
              nameEn: 'Sun',
              symbol: 'S',
              longitude: 0,
              sign: 'Aries',
              signEn: 'Aries',
              degree: 10,
              minute: 15,
              retrograde: false,
            },
          ],
          houses: [],
          ascendant: {
            name: 'Ascendant',
            nameEn: 'Ascendant',
            symbol: 'Asc',
            longitude: 0,
            sign: 'Gemini',
            signEn: 'Gemini',
            degree: 3,
            minute: 0,
            retrograde: false,
          },
          midheaven: {
            name: 'Midheaven',
            nameEn: 'Midheaven',
            symbol: 'Mc',
            longitude: 0,
            sign: 'Aquarius',
            signEn: 'Aquarius',
            degree: 19,
            minute: 0,
            retrograde: false,
          },
          aspects: [],
        },
        vedicAstro: {
          moonSign: 'Taurus',
          moonNakshatra: {
            number: 4,
            name: 'Rohini',
            nameEn: 'Rohini',
            lord: 'Moon',
            pada: 2,
          },
          ascendant: 'Leo',
          sunSign: 'Aries',
          dashas: [{ planet: 'Moon', startYear: 2020, duration: 10 }],
          moonDegree: 15.2,
        },
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

    expect(prompt).toContain('western-astro')
    expect(prompt).toContain('vedic-astro')
    expect(prompt).toContain('numerology')
    expect(prompt).toContain('Sun sign: Aries')
    expect(prompt).toContain('Moon nakshatra: Rohini')
    expect(prompt).toContain('Life path number: 7')
  })

  it('stays readable when method results are partial or missing', () => {
    const prompt = buildGptPrompt({
      question: '',
      selectedMethods: ['western-astro', 'numerology'],
      divinationResults: {
        iching: null,
        tarot: null,
        ziwei: null,
        bazi: null,
        westernAstro: {
          planets: [],
          houses: [],
          ascendant: {
            name: 'Ascendant',
            nameEn: 'Ascendant',
            symbol: 'Asc',
            longitude: 0,
            sign: '',
            signEn: '',
            degree: 0,
            minute: 0,
            retrograde: false,
          },
          midheaven: {
            name: 'Midheaven',
            nameEn: 'Midheaven',
            symbol: 'Mc',
            longitude: 0,
            sign: '',
            signEn: '',
            degree: 0,
            minute: 0,
            retrograde: false,
          },
          aspects: [],
        },
        vedicAstro: null,
        numerology: null,
      },
    })

    expect(prompt).toContain('User question: (not provided)')
    expect(prompt).toContain('Sun sign: unavailable')
    expect(prompt).toContain('Ascendant: unavailable')
    expect(prompt).toContain('Result data unavailable.')
  })

  it('does not throw when supplemental result arrays are missing entirely', () => {
    expect(() =>
      buildGptPrompt({
        question: 'Help me interpret incomplete data',
        selectedMethods: ['western-astro', 'vedic-astro'],
        divinationResults: {
          iching: null,
          tarot: null,
          ziwei: null,
          bazi: null,
          westernAstro: {
            ascendant: {
              name: 'Ascendant',
              nameEn: 'Ascendant',
              symbol: 'Asc',
              longitude: 0,
              sign: 'Libra',
              signEn: 'Libra',
              degree: 0,
              minute: 0,
              retrograde: false,
            },
            midheaven: {
              name: 'Midheaven',
              nameEn: 'Midheaven',
              symbol: 'Mc',
              longitude: 0,
              sign: '',
              signEn: '',
              degree: 0,
              minute: 0,
              retrograde: false,
            },
          } as unknown as NonNullable<(typeof buildGptPrompt extends (input: infer T) => string ? T : never)['divinationResults']['westernAstro']>,
          vedicAstro: {
            moonSign: 'Pisces',
            moonNakshatra: {
              number: 0,
              name: '',
              nameEn: '',
              lord: '',
              pada: 0,
            },
            ascendant: '',
            sunSign: '',
            moonDegree: 0,
          } as unknown as NonNullable<(typeof buildGptPrompt extends (input: infer T) => string ? T : never)['divinationResults']['vedicAstro']>,
          numerology: null,
        },
      }),
    ).not.toThrow()

    const prompt = buildGptPrompt({
      question: 'Help me interpret incomplete data',
      selectedMethods: ['western-astro', 'vedic-astro'],
      divinationResults: {
        iching: null,
        tarot: null,
        ziwei: null,
        bazi: null,
        westernAstro: {
          ascendant: {
            name: 'Ascendant',
            nameEn: 'Ascendant',
            symbol: 'Asc',
            longitude: 0,
            sign: 'Libra',
            signEn: 'Libra',
            degree: 0,
            minute: 0,
            retrograde: false,
          },
          midheaven: {
            name: 'Midheaven',
            nameEn: 'Midheaven',
            symbol: 'Mc',
            longitude: 0,
            sign: '',
            signEn: '',
            degree: 0,
            minute: 0,
            retrograde: false,
          },
        } as unknown as NonNullable<(typeof buildGptPrompt extends (input: infer T) => string ? T : never)['divinationResults']['westernAstro']>,
        vedicAstro: {
          moonSign: 'Pisces',
          moonNakshatra: {
            number: 0,
            name: '',
            nameEn: '',
            lord: '',
            pada: 0,
          },
          ascendant: '',
          sunSign: '',
          moonDegree: 0,
        } as unknown as NonNullable<(typeof buildGptPrompt extends (input: infer T) => string ? T : never)['divinationResults']['vedicAstro']>,
        numerology: null,
      },
    })

    expect(prompt).toContain('Ascendant: Libra')
    expect(prompt).toContain('Example aspect: unavailable')
    expect(prompt).toContain('Current dasha sample: unavailable')
  })

  it('includes only supported GPT methods in the prompt body', () => {
    const prompt = buildGptPrompt({
      question: 'Keep only supported methods',
      selectedMethods: ['tarot', 'western-astro', 'iching'],
      divinationResults: {
        iching: null,
        tarot: null,
        ziwei: null,
        bazi: null,
        westernAstro: {
          planets: [
            {
              name: 'Sun',
              nameEn: 'Sun',
              symbol: 'S',
              longitude: 0,
              sign: 'Leo',
              signEn: 'Leo',
              degree: 10,
              minute: 0,
              retrograde: false,
            },
          ],
          houses: [],
          ascendant: {
            name: 'Ascendant',
            nameEn: 'Ascendant',
            symbol: 'Asc',
            longitude: 0,
            sign: 'Virgo',
            signEn: 'Virgo',
            degree: 0,
            minute: 0,
            retrograde: false,
          },
          midheaven: {
            name: 'Midheaven',
            nameEn: 'Midheaven',
            symbol: 'Mc',
            longitude: 0,
            sign: 'Gemini',
            signEn: 'Gemini',
            degree: 0,
            minute: 0,
            retrograde: false,
          },
          aspects: [],
        },
        vedicAstro: null,
        numerology: null,
      },
    })

    expect(prompt).toContain('- western-astro (Western astrology)')
    expect(prompt).toContain('[western-astro]')
    expect(prompt).not.toContain('- tarot')
    expect(prompt).not.toContain('[tarot]')
    expect(prompt).not.toContain('- iching')
    expect(prompt).not.toContain('[iching]')
  })
})
