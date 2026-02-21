import { describe, it, expect } from 'vitest'
import { getZiweiResult, getBaziResult, getZiweiTimingFactors } from './index'

describe('getZiweiResult', () => {
  it('should return result with known birth data', () => {
    const result = getZiweiResult('1990-01-15', 12, 'male')
    expect(result).not.toBeNull()
    expect(result?.solarDate).toBe('1990-01-15')
    expect(result?.zodiac).toBeDefined()
    expect(result?.palaces).toHaveLength(12)
  })

  it('should calculate correct palaces', () => {
    const result = getZiweiResult('1985-06-20', 8, 'female')
    expect(result).not.toBeNull()
    expect(result?.palaces).toBeDefined()
    
    const lifePalace = result?.palaces.find(p => p.name === '命宮')
    expect(lifePalace).toBeDefined()
  })

  it('should detect patterns', () => {
    const result = getZiweiResult('1990-05-10', 6, 'male')
    expect(result).not.toBeNull()
    expect(result?.patterns).toBeDefined()
    expect(Array.isArray(result?.patterns)).toBe(true)
  })

  it('should generate star brightness analysis', () => {
    const result = getZiweiResult('1990-01-15', 12, 'male')
    expect(result).not.toBeNull()
    expect(result?.starBrightnessAnalysis).toBeDefined()
    expect(result?.starBrightnessAnalysis.length).toBeGreaterThan(0)
  })

  it('should generate counseling advice', () => {
    const result = getZiweiResult('1990-01-15', 12, 'male')
    expect(result).not.toBeNull()
    expect(result?.counselingAdvice).toBeDefined()
    expect(result?.counselingAdvice.length).toBeGreaterThan(0)
  })

  it('should handle female gender', () => {
    const result = getZiweiResult('1992-03-25', 14, 'female')
    expect(result).not.toBeNull()
    expect(result?.solarDate).toBe('1992-03-25')
  })

  it('should handle edge case dates', () => {
    const result = getZiweiResult('1900-01-01', 0, 'male')
    expect(result).not.toBeNull()
  })
})

describe('getBaziResult', () => {
  it('should calculate correct four pillars', () => {
    const result = getBaziResult('1990-01-15', 12)
    expect(result).not.toBeNull()
    expect(result?.yearPillar).toBeDefined()
    expect(result?.monthPillar).toBeDefined()
    expect(result?.dayPillar).toBeDefined()
    expect(result?.hourPillar).toBeDefined()
  })

  it('should calculate wuxing scores', () => {
    const result = getBaziResult('1990-01-15', 12)
    expect(result).not.toBeNull()
    expect(result?.wuxingScores).toHaveProperty('wood')
    expect(result?.wuxingScores).toHaveProperty('fire')
    expect(result?.wuxingScores).toHaveProperty('water')
    expect(result?.wuxingScores).toHaveProperty('earth')
    expect(result?.wuxingScores).toHaveProperty('metal')
  })

  it('should have wuxing scores sum close to 100', () => {
    const result = getBaziResult('1990-01-15', 12)
    expect(result).not.toBeNull()
    const total = Object.values(result?.wuxingScores || {}).reduce((a, b) => a + b, 0)
    expect(total).toBeGreaterThanOrEqual(95)
    expect(total).toBeLessThanOrEqual(105)
  })

  it('should identify dominant and deficient wuxing', () => {
    const result = getBaziResult('1990-01-15', 12)
    expect(result).not.toBeNull()
    expect(result?.dominantWuxing).toBeDefined()
    expect(result?.deficientWuxing).toBeDefined()
    expect(['wood', 'fire', 'water', 'earth', 'metal']).toContain(result?.dominantWuxing)
    expect(['wood', 'fire', 'water', 'earth', 'metal']).toContain(result?.deficientWuxing)
  })

  it('should calculate day master', () => {
    const result = getBaziResult('1990-01-15', 12)
    expect(result).not.toBeNull()
    expect(result?.dayMaster).toBeDefined()
    expect(result?.dayMaster.length).toBe(1)
  })

  it('should generate analysis text', () => {
    const result = getBaziResult('1990-01-15', 12)
    expect(result).not.toBeNull()
    expect(result?.analysis).toBeDefined()
    expect(result?.analysis.length).toBeGreaterThan(0)
  })

  it('should handle different hours', () => {
    const result1 = getBaziResult('1990-01-15', 0)
    const result2 = getBaziResult('1990-01-15', 22)
    expect(result1).not.toBeNull()
    expect(result2).not.toBeNull()
    expect(result1?.hourPillar).not.toBe(result2?.hourPillar)
  })
})

describe('getZiweiTimingFactors', () => {
  it('should return timing factors array', () => {
    const ziweiResult = getZiweiResult('1990-01-15', 12, 'male')
    expect(ziweiResult).not.toBeNull()
    
    const factors = getZiweiTimingFactors(ziweiResult!)
    expect(Array.isArray(factors)).toBe(true)
  })

  it('should have correct factor structure', () => {
    const ziweiResult = getZiweiResult('1990-01-15', 12, 'male')
    expect(ziweiResult).not.toBeNull()
    
    const factors = getZiweiTimingFactors(ziweiResult!)
    factors.forEach(factor => {
      expect(factor).toHaveProperty('factor')
      expect(factor).toHaveProperty('impact')
      expect(factor).toHaveProperty('description')
      expect(typeof factor.impact).toBe('number')
    })
  })
})
