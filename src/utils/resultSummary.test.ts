import { describe, expect, it } from 'vitest'

import { type CounselingRecommendation } from '../analysis/orientation'
import i18n from '../i18n'
import { type DivinationResults } from '../store/useAppStore'
import { buildResultSummary } from './resultSummary'

function createRecommendation(): CounselingRecommendation {
  return {
    timing: {
      score: 78,
      level: '建議',
      factors: [],
      summary: '整體時機穩定，適合循序展開。',
    },
    orientation: {
      therapies: [],
      dominantElement: 'wood',
      deficientElement: 'water',
      elementScores: {
        wood: 30,
        fire: 20,
        earth: 20,
        metal: 15,
        water: 15,
      },
    },
    overallAdvice: '建議先安排一次初談，確認當前需求與期待。',
  }
}

describe('buildResultSummary', () => {
  it('builds a readable mixed-method summary with a final recommendation', () => {
    const text = buildResultSummary({
      question: '我現在適合開始諮商嗎？',
      selectedMethods: ['ziwei', 'western-astro', 'numerology'],
      divinationResults: {
        iching: null,
        liuyao: null,
        tarot: null,
        bazi: null,
        vedicAstro: null,
        ziwei: {
          chineseDate: '甲辰年正月初一',
          lunarDate: '正月初一',
          solarDate: '2026-03-11',
          time: '巳時',
          zodiac: 'Aries',
          chineseZodiac: '龍',
          palaces: [],
          majorStars: ['紫微'],
          patterns: [],
          starBrightnessAnalysis: '主星明朗。',
          mutagenAnalysis: '化祿帶來穩定推進。',
          lifePalaceDetail: '命宮坐守穩定星曜。',
          lifeAnalysis: '命宮特質穩定，適合建立支持系統。',
          sanfangAnalysis: '三方四正有助力。',
          shaStarsAnalysis: '煞星影響有限。',
          allPalaceAnalysis: '整體盤勢平衡。',
          personalityAnalysis: '能夠理性觀察情緒。',
          currentDaXian: '目前大限平順。',
          counselingAdvice: '可從低壓力的諮商節奏開始。',
        },
        westernAstro: {
          planets: [
            {
              name: 'Sun',
              nameEn: 'Sun',
              symbol: 'S',
              longitude: 0,
              sign: '牡羊座',
              signEn: 'Aries',
              degree: 12,
              minute: 30,
              retrograde: false,
            },
          ],
          houses: [],
          ascendant: {
            name: 'Ascendant',
            nameEn: 'Ascendant',
            symbol: 'Asc',
            longitude: 0,
            sign: '雙子座',
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
            sign: '水瓶座',
            signEn: 'Aquarius',
            degree: 19,
            minute: 0,
            retrograde: false,
          },
          aspects: [],
        },
        numerology: {
          lifePathNumber: 7,
          destinyNumber: 3,
          soulNumber: 9,
          personalityNumber: 5,
          birthdayNumber: 1,
          expressionNumber: 6,
        },
      } satisfies DivinationResults,
      result: createRecommendation(),
    })

    expect(text).toContain('問題：我現在適合開始諮商嗎？')
    expect(text).toContain('已選方法：紫微斗數、西洋占星、數字命理')
    expect(text).toContain('命宮特質穩定，適合建立支持系統。')
    expect(text).toContain('太陽在牡羊座')
    expect(text).toContain('生命靈數：7')
    expect(text).toContain('綜合建議')
    expect(text).toContain('建議（78分）')
    expect(text).toContain('建議先安排一次初談，確認當前需求與期待。')
  })

  it('falls back to unavailable text for missing or partial method results', () => {
    const text = buildResultSummary({
      question: '',
      selectedMethods: ['tarot', 'vedic-astro'],
      divinationResults: {
        iching: null,
        liuyao: null,
        ziwei: null,
        bazi: null,
        westernAstro: null,
        numerology: null,
        tarot: {
          cards: [],
          spread: 'single',
          summary: '',
          psychologicalState: {
            stressLevel: 0,
            hopeLevel: 0,
            needForSupport: 0,
            emotionalState: '',
          },
          counselingAdvice: '',
        },
        vedicAstro: null,
      } satisfies DivinationResults,
      result: null,
    })

    expect(text).toContain('問題：（未提供）')
    expect(text).toContain('塔羅')
    expect(text).toContain('吠陀占星')
    expect(text).toContain('詳細資料暫缺')
  })

  it('ignores malformed list entries without throwing', () => {
    const text = buildResultSummary({
      question: '我可以慢慢開始嗎？',
      selectedMethods: ['ziwei'],
      divinationResults: {
        iching: null,
        liuyao: null,
        tarot: null,
        bazi: null,
        westernAstro: null,
        vedicAstro: null,
        numerology: null,
        ziwei: {
          chineseDate: '甲辰年正月初一',
          lunarDate: '正月初一',
          solarDate: '2026-03-11',
          time: '巳時',
          zodiac: 'Aries',
          chineseZodiac: '龍',
          palaces: [],
          majorStars: ['紫微', 123 as unknown as string, '' as unknown as string, null as unknown as string],
          patterns: [],
          starBrightnessAnalysis: '主星明朗。',
          mutagenAnalysis: '化祿帶來穩定推進。',
          lifePalaceDetail: '命宮坐守穩定星曜。',
          lifeAnalysis: '命宮特質穩定，適合建立支持系統。',
          sanfangAnalysis: '三方四正有助力。',
          shaStarsAnalysis: '煞星影響有限。',
          allPalaceAnalysis: '整體盤勢平衡。',
          personalityAnalysis: '能夠理性觀察情緒。',
          currentDaXian: '目前大限平順。',
          counselingAdvice: '可從低壓力的諮商節奏開始。',
        },
      } satisfies DivinationResults,
      result: null,
    })

    expect(text).toContain('命盤重點：紫微')
    expect(text).not.toContain('123')
  })

  it('includes liuyao output in the copy-all summary', () => {
    const text = buildResultSummary({
      question: '這次適合展開新的諮商節奏嗎？',
      selectedMethods: ['liuyao'],
      divinationResults: {
        iching: null,
        tarot: null,
        bazi: null,
        ziwei: null,
        westernAstro: null,
        vedicAstro: null,
        numerology: null,
        liuyao: {
          lines: [
            { value: 'yang', isMoving: false },
            { value: 'yin', isMoving: true },
            { value: 'yang', isMoving: false },
            { value: 'yin', isMoving: false },
            { value: 'yang', isMoving: true },
            { value: 'yin', isMoving: false },
          ],
          movingLineIndexes: [2, 5],
        },
      } satisfies DivinationResults,
      result: createRecommendation(),
    })

    expect(text).toContain('六爻')
    expect(text).toContain('本卦：陽靜、陰動、陽靜、陰靜、陽動、陰靜')
    expect(text).toContain('之卦：陽靜、陽靜、陽靜、陰靜、陰靜、陰靜')
    expect(text).toContain('動爻：2、5')
  })

  it('uses localized English separators and row formatting', () => {
    const text = buildResultSummary({
      question: 'Is this a good time to begin counseling?',
      selectedMethods: ['ziwei', 'western-astro', 'numerology'],
      divinationResults: {
        iching: null,
        liuyao: null,
        tarot: null,
        bazi: null,
        ziwei: {
          chineseDate: '甲辰年正月初一',
          lunarDate: '正月初一',
          solarDate: '2026-03-11',
          time: '巳時',
          zodiac: 'Aries',
          chineseZodiac: '龍',
          palaces: [],
          majorStars: ['Zi Wei', 'Tian Fu'],
          patterns: [],
          starBrightnessAnalysis: 'Clear chart.',
          mutagenAnalysis: 'Stable changes.',
          lifePalaceDetail: 'Stable palace.',
          lifeAnalysis: 'Steady and reflective.',
          sanfangAnalysis: 'Supportive layout.',
          shaStarsAnalysis: 'Limited obstacles.',
          allPalaceAnalysis: 'Balanced chart.',
          personalityAnalysis: 'Observant and calm.',
          currentDaXian: 'Smooth cycle.',
          counselingAdvice: 'Start gently.',
        },
        vedicAstro: null,
        numerology: {
          lifePathNumber: 7,
          destinyNumber: 3,
          soulNumber: 9,
          personalityNumber: 5,
          birthdayNumber: 1,
          expressionNumber: 6,
        },
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
            sign: 'Gemini',
            signEn: 'Gemini',
            degree: 2,
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
            degree: 18,
            minute: 0,
            retrograde: false,
          },
          aspects: [],
        },
      } satisfies DivinationResults,
      result: createRecommendation(),
      t: i18n.getFixedT('en'),
    })

    expect(text).toContain('Counseling timing summary')
    expect(text).toContain('Question: Is this a good time to begin counseling?')
    expect(text).toContain('Selected methods: Zi Wei Dou Shu, Western Astrology, Numerology')
    expect(text).not.toContain('、')
    expect(text).toContain('Chart highlights: Zi Wei, Tian Fu')
    expect(text).toContain('Sun position: Sun in Aries')
    expect(text).toContain('Life path: 7')
    expect(text).toContain('Overall recommendation')
    expect(text).toContain('Timing assessment: 建議 (78 pts)')
  })

  it('uses localized English liuyao labels and line formatting', () => {
    const text = buildResultSummary({
      question: 'Is this a good time to start a new counseling rhythm?',
      selectedMethods: ['liuyao'],
      divinationResults: {
        iching: null,
        tarot: null,
        bazi: null,
        ziwei: null,
        westernAstro: null,
        vedicAstro: null,
        numerology: null,
        liuyao: {
          lines: [
            { value: 'yang', isMoving: false },
            { value: 'yin', isMoving: true },
            { value: 'yang', isMoving: false },
            { value: 'yin', isMoving: false },
            { value: 'yang', isMoving: true },
            { value: 'yin', isMoving: false },
          ],
          movingLineIndexes: [2, 5],
        },
      } satisfies DivinationResults,
      result: null,
      t: i18n.getFixedT('en'),
    })

    expect(text).toContain('Liuyao')
    expect(text).toContain('Primary hexagram: Yang static, Yin moving, Yang static, Yin static, Yang moving, Yin static')
    expect(text).toContain('Transformed hexagram: Yang static, Yang static, Yang static, Yin static, Yin static, Yin static')
    expect(text).toContain('Moving lines: 2, 5')
  })
})
