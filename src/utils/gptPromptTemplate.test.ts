import { describe, expect, it } from 'vitest'

import { type BuildGptPromptInput, buildGptPrompt, hasSupportedGptMethods } from './gptPromptTemplate'

function makePromptInput(selectedMethods: BuildGptPromptInput['selectedMethods']): BuildGptPromptInput {
  return {
    name: '王小明',
    gender: 'male',
    birthDate: '1990-05-10',
    birthHour: 8,
    locationName: 'Taipei',
    question: 'What should I focus on next?',
    selectedMethods,
    divinationResults: {
      iching: {
        originalHexagram: { number: 1, name: '乾' },
        changedHexagram: { number: 2, name: '坤' },
        changingLines: [2, 5],
        lines: ['yang', 'yang', 'yang', 'yang', 'yang', 'yang'],
        summary: 'Move with clear intent.',
        counselingAdvice: 'Take a steady first step.',
      } as unknown as BuildGptPromptInput['divinationResults']['iching'],
      liuyao: {
        lines: [
          { value: 'yang', isMoving: false },
          { value: 'yang', isMoving: true },
          { value: 'yang', isMoving: false },
          { value: 'yang', isMoving: false },
          { value: 'yang', isMoving: true },
          { value: 'yang', isMoving: false },
        ],
        movingLineIndexes: [2, 5],
      } as unknown as BuildGptPromptInput['divinationResults']['liuyao'],
      tarot: {
        spread: 'Three-card spread',
        cards: [
          {
            position: 'present',
            card: {
              id: 'the-star',
              name: 'The Star',
              arcana: 'major',
              upright: 'Hope',
              reversed: 'Doubt',
            },
            orientation: 'upright',
          },
        ],
        summary: 'Renewed hope is available.',
        psychologicalState: { emotionalState: 'Hopeful but cautious' },
        counselingAdvice: 'Use supportive reflection and pacing.',
      } as unknown as BuildGptPromptInput['divinationResults']['tarot'],
      ziwei: {
        majorStars: ['紫微', '天府'],
        lifeAnalysis: 'Life palace is stable.',
        personalityAnalysis: 'Thoughtful and sensitive.',
        counselingAdvice: 'Begin with supportive, exploratory work.',
      } as unknown as BuildGptPromptInput['divinationResults']['ziwei'],
      bazi: {
        yearPillar: '甲子',
        monthPillar: '乙丑',
        dayPillar: '丙寅',
        hourPillar: '丁卯',
        dayMaster: '丙火',
        dominantWuxing: '木',
        deficientWuxing: '金',
        analysis: 'Growth is strong but boundaries need support.',
      } as unknown as BuildGptPromptInput['divinationResults']['bazi'],
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
      } as unknown as BuildGptPromptInput['divinationResults']['westernAstro'],
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
      } as unknown as BuildGptPromptInput['divinationResults']['vedicAstro'],
      numerology: {
        lifePathNumber: 7,
        destinyNumber: 3,
        soulNumber: 9,
        personalityNumber: 5,
        birthdayNumber: 1,
        expressionNumber: 6,
      } as unknown as BuildGptPromptInput['divinationResults']['numerology'],
    },
  }
}

function withFullContext(
  input: Omit<BuildGptPromptInput, 'name' | 'gender' | 'birthDate' | 'birthHour' | 'locationName'>,
): BuildGptPromptInput {
  return {
    name: '王小明',
    gender: 'male',
    birthDate: '1990-05-10',
    birthHour: 8,
    locationName: 'Taipei',
    ...input,
  }
}

describe('buildGptPrompt', () => {
  it('uses the real supplemental method ids in the generated prompt', () => {
    const prompt = buildGptPrompt(makePromptInput(['western-astro', 'vedic-astro', 'numerology']))

    expect(prompt).toContain('western-astro')
    expect(prompt).toContain('vedic-astro')
    expect(prompt).toContain('numerology')
    expect(prompt).toContain('Sun sign: Aries')
    expect(prompt).toContain('Moon nakshatra: Rohini')
    expect(prompt).toContain('Life path number: 7')
  })

  it('includes a personal profile section with full user context', () => {
    const prompt = buildGptPrompt(makePromptInput(['bazi']))

    expect(prompt).toContain('Personal profile:')
    expect(prompt).toContain('- Name: 王小明')
    expect(prompt).toContain('- Gender: male')
    expect(prompt).toContain('- Birth date (Gregorian): 1990-05-10')
    expect(prompt).toContain('- Birth hour: 8')
    expect(prompt).toContain('- Birth location: Taipei')
  })

  it('includes core metaphysical context from bazi results', () => {
    const prompt = buildGptPrompt(makePromptInput(['bazi']))

    expect(prompt).toContain('Core metaphysical context:')
    expect(prompt).toContain('- Four pillars: 甲子、乙丑、丙寅、丁卯')
    expect(prompt).toContain('- Day master: 丙火')
  })

  it('adds a privacy notice for full personal context', () => {
    const prompt = buildGptPrompt(makePromptInput(['ziwei']))

    expect(prompt).toContain('This prompt contains full personal profile data')
    expect(prompt).toContain('Do not repeat unnecessary personal identifiers')
  })

  it('asks GPT for concrete synthesis instead of raw restatement', () => {
    const prompt = buildGptPrompt(makePromptInput(['ziwei', 'bazi']))

    expect(prompt).toContain('Final response requirements:')
    expect(prompt).toContain('Start with an overall judgment')
    expect(prompt).toContain('Explain where methods converge or diverge')
    expect(prompt).toContain('End with concrete guidance')
  })

  it('includes classic references and analysis lens for western astrology', () => {
    const prompt = buildGptPrompt(makePromptInput(['western-astro']))

    expect(prompt).toContain('[western-astro]')
    expect(prompt).toContain('Classic references:')
    expect(prompt).toContain('Analysis lens:')
    expect(prompt).toContain('- Tetrabiblos')
    expect(prompt).toContain('- Emphasize planetary placements, angles, and notable aspect patterns.')
  })

  it('adds global guidance for tradition-based synthesis', () => {
    const prompt = buildGptPrompt(makePromptInput(['numerology']))

    expect(prompt).toContain('Use the classic references and interpretive lenses below')
    expect(prompt).toContain('Do not present invented direct quotations')
    expect(prompt).toContain('Note uncertainty where data is incomplete')
  })

  it('includes all divination methods in the prompt body', () => {
    const prompt = buildGptPrompt(makePromptInput([
      'ziwei',
      'bazi',
      'iching',
      'liuyao',
      'tarot',
      'western-astro',
      'vedic-astro',
      'numerology',
    ]))

    expect(prompt).toContain('[ziwei]')
    expect(prompt).toContain('[bazi]')
    expect(prompt).toContain('[iching]')
    expect(prompt).toContain('[liuyao]')
    expect(prompt).toContain('[tarot]')
    expect(prompt).toContain('[western-astro]')
    expect(prompt).toContain('[vedic-astro]')
    expect(prompt).toContain('[numerology]')
  })

  it('adds classic references and interpretation lenses for eastern methods', () => {
    const prompt = buildGptPrompt(makePromptInput(['ziwei', 'bazi', 'iching', 'liuyao']))

    expect(prompt).toContain('紫微斗數全書')
    expect(prompt).toContain('淵海子平')
    expect(prompt).toContain('周易')
    expect(prompt).toContain('增刪卜易')
    expect(prompt).toContain('Focus on life palace structure, major stars, and temperament patterns.')
    expect(prompt).toContain('Read day master strength, elemental balance, and timing climate.')
  })

  it('adds classic references and lenses for tarot and supplemental systems', () => {
    const prompt = buildGptPrompt(makePromptInput(['tarot', 'western-astro', 'vedic-astro', 'numerology']))

    expect(prompt).toContain('The Pictorial Key to the Tarot')
    expect(prompt).toContain('Tetrabiblos')
    expect(prompt).toContain('Brihat Parashara Hora Shastra')
    expect(prompt).toContain('The Complete Book of Numerology')
  })

  it('treats all divination methods as supported for GPT prompts', () => {
    expect(hasSupportedGptMethods(['iching'])).toBe(true)
    expect(hasSupportedGptMethods(['tarot'])).toBe(true)
    expect(hasSupportedGptMethods(['ziwei'])).toBe(true)
    expect(hasSupportedGptMethods(['western-astro'])).toBe(true)
  })

  it('stays readable when method results are partial or missing', () => {
    const prompt = buildGptPrompt(withFullContext({
      question: '',
      selectedMethods: ['western-astro', 'numerology'],
      divinationResults: {
        iching: null,
        liuyao: null,
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
    }))

    expect(prompt).toContain('User question: (not provided)')
    expect(prompt).toContain('Core metaphysical context:')
    expect(prompt).toContain('- Four pillars: unavailable')
    expect(prompt).toContain('Sun sign: unavailable')
    expect(prompt).toContain('Ascendant: unavailable')
    expect(prompt).toContain('Result data unavailable.')
  })

  it('does not throw when supplemental result arrays are missing entirely', () => {
    expect(() =>
      buildGptPrompt(withFullContext({
        question: 'Help me interpret incomplete data',
        selectedMethods: ['western-astro', 'vedic-astro'],
        divinationResults: {
          iching: null,
          liuyao: null,
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
      })),
    ).not.toThrow()

    const prompt = buildGptPrompt(withFullContext({
      question: 'Help me interpret incomplete data',
      selectedMethods: ['western-astro', 'vedic-astro'],
      divinationResults: {
        iching: null,
        liuyao: null,
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
    }))

    expect(prompt).toContain('Ascendant: Libra')
    expect(prompt).toContain('Example aspect: unavailable')
    expect(prompt).toContain('Current dasha sample: unavailable')
  })

  it('includes every selected method that has prompt metadata', () => {
    const prompt = buildGptPrompt(withFullContext({
      question: 'Keep only supported methods',
      selectedMethods: ['tarot', 'western-astro', 'iching'],
      divinationResults: {
        iching: null,
        liuyao: null,
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
    }))

    expect(prompt).toContain('- tarot (Tarot)')
    expect(prompt).toContain('- western-astro (Western astrology)')
    expect(prompt).toContain('- iching (I Ching)')
    expect(prompt).toContain('[tarot]')
    expect(prompt).toContain('[western-astro]')
    expect(prompt).toContain('[iching]')
  })
})
