import { describe, it, expect } from 'vitest'
import { manualDivination, analyzeTimingFromHexagram } from './index'

describe('manualDivination', () => {
  it('should return correct hexagram for known coin results', () => {
    const coinResults = [2, 2, 2, 2, 2, 2]
    const result = manualDivination(coinResults)
    expect(result).toBeDefined()
    expect(result.lines).toHaveLength(6)
  })

  it('should handle all yang lines with changing', () => {
    const coinResults = [0, 0, 0, 0, 0, 0]
    const result = manualDivination(coinResults)
    expect(result.lines.every(l => l.value === 'yang')).toBe(true)
    expect(result.lines.every(l => l.isChanging)).toBe(true)
  })

  it('should handle mixed coin results', () => {
    const coinResults = [0, 1, 2, 3, 2, 1]
    const result = manualDivination(coinResults)
    expect(result).toBeDefined()
    expect(result.lines).toHaveLength(6)
  })

  it('should position lines correctly', () => {
    const coinResults = [2, 2, 2, 2, 2, 2]
    const result = manualDivination(coinResults)
    const positions = result.lines.map(l => l.position).sort((a, b) => a - b)
    expect(positions).toEqual([1, 2, 3, 4, 5, 6])
  })

  it('should return valid hexagram for 111111 binary', () => {
    const coinResults = [2, 2, 2, 2, 2, 2]
    const result = manualDivination(coinResults)
    expect(result.originalHexagram).toBeDefined()
    expect(result.originalHexagram.number).toBeGreaterThanOrEqual(1)
    expect(result.originalHexagram.number).toBeLessThanOrEqual(64)
  })

  it('should generate summary', () => {
    const coinResults = [2, 2, 2, 2, 2, 2]
    const result = manualDivination(coinResults)
    expect(result.summary).toBeDefined()
    expect(result.summary.length).toBeGreaterThan(0)
  })

  it('should generate counseling advice', () => {
    const coinResults = [2, 2, 2, 2, 2, 2]
    const result = manualDivination(coinResults)
    expect(result.counselingAdvice).toBeDefined()
    expect(result.counselingAdvice.length).toBeGreaterThan(0)
  })

  it('should not have changed hexagram when no changing lines', () => {
    const coinResults = [2, 2, 2, 2, 2, 2]
    const result = manualDivination(coinResults)
    expect(result.changingLines.length).toBe(0)
    expect(result.changedHexagram).toBeUndefined()
  })

  it('should identify changing lines correctly', () => {
    const coinResults = [0, 2, 2, 2, 2, 2]
    const result = manualDivination(coinResults)
    expect(result.changingLines.length).toBe(1)
    expect(result.changingLines).toContain(6)
  })

  it('should handle yin lines', () => {
    const coinResults = [1, 1, 1, 1, 1, 1]
    const result = manualDivination(coinResults)
    expect(result.lines.every(l => l.value === 'yin')).toBe(true)
    expect(result.lines.every(l => !l.isChanging)).toBe(true)
  })

  it('should handle yin with changing', () => {
    const coinResults = [3, 3, 3, 3, 3, 3]
    const result = manualDivination(coinResults)
    expect(result.lines.every(l => l.value === 'yin')).toBe(true)
    expect(result.lines.every(l => l.isChanging)).toBe(true)
  })
})

describe('analyzeTimingFromHexagram', () => {
  it('should return timing advice with score', () => {
    const coinResults = [2, 2, 2, 2, 2, 2]
    const result = manualDivination(coinResults)
    const timing = analyzeTimingFromHexagram(result)
    expect(timing).toBeDefined()
    expect(typeof timing.score).toBe('number')
    expect(timing.score).toBeGreaterThanOrEqual(0)
    expect(timing.score).toBeLessThanOrEqual(100)
  })

  it('should return isGoodTime boolean', () => {
    const coinResults = [2, 2, 2, 2, 2, 2]
    const result = manualDivination(coinResults)
    const timing = analyzeTimingFromHexagram(result)
    expect(typeof timing.isGoodTime).toBe('boolean')
  })

  it('should return factors array', () => {
    const coinResults = [2, 2, 2, 2, 2, 2]
    const result = manualDivination(coinResults)
    const timing = analyzeTimingFromHexagram(result)
    expect(Array.isArray(timing.factors)).toBe(true)
  })

  it('should have valid factor descriptions', () => {
    const coinResults = [2, 2, 2, 2, 2, 2]
    const result = manualDivination(coinResults)
    const timing = analyzeTimingFromHexagram(result)
    timing.factors.forEach(factor => {
      expect(typeof factor).toBe('string')
      expect(factor.length).toBeGreaterThan(0)
    })
  })
})
