import { describe, it, expect } from 'vitest'
import { 
  analyzeTiming, 
  matchCounselingOrientation,
  calculateElementScores,
  generateOverallAdvice,
  generateFullRecommendation
} from './index'
import type { ElementScores, TimingFactor } from '../index'

describe('analyzeTiming', () => {
  it('should return timing result with score', () => {
    const result = analyzeTiming()
    expect(result).toBeDefined()
    expect(typeof result.score).toBe('number')
    expect(result.score).toBeGreaterThanOrEqual(0)
    expect(result.score).toBeLessThanOrEqual(100)
  })

  it('should return correct level based on score', () => {
    const factors: TimingFactor[] = [
      { source: 'ziwei', factor: 'test', impact: 30, description: 'test' }
    ]
    const result = analyzeTiming(factors)
    expect(result.score).toBe(80)
    expect(result.level).toBe('強烈建議')
  })

  it('should handle negative impact factors', () => {
    const factors: TimingFactor[] = [
      { source: 'bazi', factor: 'test', impact: -20, description: 'test' }
    ]
    const result = analyzeTiming([], factors)
    expect(result.score).toBe(30)
    expect(result.level).toBe('不建議')
  })

  it('should combine all factor sources', () => {
    const ziweiFactors: TimingFactor[] = [
      { source: 'ziwei', factor: 'z1', impact: 10, description: 'ziwei factor' }
    ]
    const baziFactors: TimingFactor[] = [
      { source: 'bazi', factor: 'b1', impact: 10, description: 'bazi factor' }
    ]
    const ichingFactors: TimingFactor[] = [
      { source: 'iching', factor: 'i1', impact: 10, description: 'iching factor' }
    ]
    const tarotFactors: TimingFactor[] = [
      { source: 'tarot', factor: 't1', impact: 10, description: 'tarot factor' }
    ]
    
    const result = analyzeTiming(ziweiFactors, baziFactors, ichingFactors, tarotFactors)
    expect(result.score).toBe(90)
    expect(result.factors).toHaveLength(4)
  })

  it('should generate summary', () => {
    const result = analyzeTiming()
    expect(result.summary).toBeDefined()
    expect(result.summary.length).toBeGreaterThan(0)
  })

  it('should return valid levels', () => {
    const result = analyzeTiming()
    expect(['不建議', '可考慮', '建議', '強烈建議']).toContain(result.level)
  })
})

describe('calculateElementScores', () => {
  it('should return default scores when no input', () => {
    const scores = calculateElementScores({})
    expect(scores.wood).toBe(20)
    expect(scores.fire).toBe(20)
    expect(scores.water).toBe(20)
    expect(scores.earth).toBe(20)
    expect(scores.metal).toBe(20)
  })

  it('should apply bazi scores', () => {
    const baziScores: Partial<ElementScores> = {
      wood: 40,
      fire: 10,
    }
    const scores = calculateElementScores(baziScores)
    const total = Object.values(scores).reduce((a, b) => a + b, 0)
    expect(total).toBeGreaterThanOrEqual(99)
    expect(total).toBeLessThanOrEqual(101)
    expect(scores.wood).toBeGreaterThan(scores.fire)
  })

  it('should apply ziwei dominant element boost', () => {
    const scores = calculateElementScores({}, { dominant: 'water' })
    expect(scores.water).toBeGreaterThan(20)
  })

  it('should apply ziwei secondary element boost', () => {
    const scores = calculateElementScores({}, { dominant: 'wood', secondary: 'fire' })
    expect(scores.wood).toBeGreaterThan(20)
    expect(scores.fire).toBeGreaterThan(20)
  })

  it('should normalize scores to sum to 100', () => {
    const baziScores: Partial<ElementScores> = {
      wood: 50,
      fire: 50,
      water: 0,
      earth: 0,
      metal: 0,
    }
    const scores = calculateElementScores(baziScores)
    const total = Object.values(scores).reduce((a, b) => a + b, 0)
    expect(total).toBe(100)
  })
})

describe('matchCounselingOrientation', () => {
  it('should return ranked therapies', () => {
    const scores: ElementScores = { wood: 30, fire: 20, water: 25, earth: 15, metal: 10 }
    const result = matchCounselingOrientation(scores)
    expect(result.therapies.length).toBeGreaterThan(0)
    expect(result.therapies.length).toBeLessThanOrEqual(10)
  })

  it('should identify dominant element', () => {
    const scores: ElementScores = { wood: 30, fire: 20, water: 25, earth: 15, metal: 10 }
    const result = matchCounselingOrientation(scores)
    expect(result.dominantElement).toBe('wood')
  })

  it('should identify deficient element', () => {
    const scores: ElementScores = { wood: 30, fire: 20, water: 25, earth: 15, metal: 10 }
    const result = matchCounselingOrientation(scores)
    expect(result.deficientElement).toBe('metal')
  })

  it('should include element scores in result', () => {
    const scores: ElementScores = { wood: 30, fire: 20, water: 25, earth: 15, metal: 10 }
    const result = matchCounselingOrientation(scores)
    expect(result.elementScores).toEqual(scores)
  })

  it('should sort therapies by score descending', () => {
    const scores: ElementScores = { wood: 50, fire: 10, water: 10, earth: 10, metal: 10 }
    const result = matchCounselingOrientation(scores)
    for (let i = 1; i < result.therapies.length; i++) {
      expect(result.therapies[i - 1].score).toBeGreaterThanOrEqual(result.therapies[i].score)
    }
  })

  it('should provide reasons for matches', () => {
    const scores: ElementScores = { wood: 40, fire: 15, water: 15, earth: 15, metal: 15 }
    const result = matchCounselingOrientation(scores, ['結構化思考'])
    expect(result.therapies[0].reasons).toBeDefined()
    expect(Array.isArray(result.therapies[0].reasons)).toBe(true)
  })

  it('should boost structured therapies for ziwei traits', () => {
    const scores: ElementScores = { wood: 20, fire: 20, water: 20, earth: 20, metal: 20 }
    const resultWithoutTraits = matchCounselingOrientation(scores, [])
    const resultWithTraits = matchCounselingOrientation(scores, ['結構化思考'])
    
    const cbtWithTraits = resultWithTraits.therapies.find(t => t.therapy.id === 'cbt')
    const cbtWithoutTraits = resultWithoutTraits.therapies.find(t => t.therapy.id === 'cbt')
    
    expect(cbtWithTraits?.score).toBeGreaterThan(cbtWithoutTraits?.score || 0)
  })

  it('should boost creative therapies for creative traits', () => {
    const scores: ElementScores = { wood: 20, fire: 20, water: 20, earth: 20, metal: 20 }
    const resultWithTraits = matchCounselingOrientation(scores, ['創意表達'])
    
    const artTherapy = resultWithTraits.therapies.find(t => t.therapy.id === 'art')
    const narrativeTherapy = resultWithTraits.therapies.find(t => t.therapy.id === 'narrative')
    
    expect(artTherapy?.reasons.length).toBeGreaterThan(0)
    expect(narrativeTherapy?.reasons.length).toBeGreaterThan(0)
  })
})

describe('generateOverallAdvice', () => {
  it('should generate advice for 強烈建議 level', () => {
    const timing = {
      score: 85,
      level: '強烈建議' as const,
      factors: [],
      summary: 'test'
    }
    const orientation = {
      therapies: [{ therapy: { id: 'cbt', name: 'CBT' } as any, score: 70, reasons: ['test'] }],
      dominantElement: 'wood',
      deficientElement: 'metal',
      elementScores: { wood: 30, fire: 20, water: 20, earth: 15, metal: 15 }
    }
    
    const advice = generateOverallAdvice(timing, orientation)
    expect(advice).toContain('強烈建議')
  })

  it('should generate advice for 不建議 level', () => {
    const timing = {
      score: 20,
      level: '不建議' as const,
      factors: [],
      summary: 'test'
    }
    const orientation = {
      therapies: [],
      dominantElement: 'wood',
      deficientElement: 'metal',
      elementScores: { wood: 30, fire: 20, water: 20, earth: 15, metal: 15 }
    }
    
    const advice = generateOverallAdvice(timing, orientation)
    expect(advice).toContain('不是最佳時機')
  })

  it('should include top therapy in advice', () => {
    const timing = {
      score: 70,
      level: '建議' as const,
      factors: [],
      summary: 'test'
    }
    const orientation = {
      therapies: [{ therapy: { id: 'cbt', name: '認知行為治療' } as any, score: 75, reasons: ['匹配度高'] }],
      dominantElement: 'wood',
      deficientElement: 'metal',
      elementScores: { wood: 30, fire: 20, water: 20, earth: 15, metal: 15 }
    }
    
    const advice = generateOverallAdvice(timing, orientation)
    expect(advice).toContain('認知行為治療')
  })
})

describe('generateFullRecommendation', () => {
  it('should combine timing and orientation results', () => {
    const timing = {
      score: 70,
      level: '建議' as const,
      factors: [],
      summary: 'test summary'
    }
    const orientation = {
      therapies: [],
      dominantElement: 'wood',
      deficientElement: 'metal',
      elementScores: { wood: 30, fire: 20, water: 20, earth: 15, metal: 15 }
    }
    
    const result = generateFullRecommendation(timing, orientation)
    expect(result.timing).toEqual(timing)
    expect(result.orientation).toEqual(orientation)
    expect(result.overallAdvice).toBeDefined()
  })
})
