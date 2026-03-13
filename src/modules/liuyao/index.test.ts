import { describe, expect, it } from 'vitest'

import {
  DEFAULT_LIUYAO_RESULT_LABELS,
  buildTransformedHexagram,
  createLiuyaoHexagram,
  deriveMovingLineIndexes,
  formatLiuyaoResult,
  generateCoinCastResult,
} from './index'
import type { LiuyaoLine } from './types'

describe('liuyao helpers', () => {
  it('derives moving-line indexes from six lines', () => {
    const hexagram = createLiuyaoHexagram([
      { value: 'yang', isMoving: false },
      { value: 'yin', isMoving: true },
      { value: 'yang', isMoving: false },
      { value: 'yang', isMoving: true },
      { value: 'yin', isMoving: false },
      { value: 'yin', isMoving: true },
    ])

    expect(deriveMovingLineIndexes(hexagram)).toEqual([2, 4, 6])
  })

  it('builds a transformed hexagram by flipping moving lines', () => {
    const hexagram = createLiuyaoHexagram([
      { value: 'yang', isMoving: false },
      { value: 'yin', isMoving: true },
      { value: 'yang', isMoving: false },
      { value: 'yang', isMoving: true },
      { value: 'yin', isMoving: false },
      { value: 'yin', isMoving: true },
    ])

    const transformedHexagram = buildTransformedHexagram(hexagram)

    expect(transformedHexagram).toEqual({
      lines: [
        { value: 'yang', isMoving: false },
        { value: 'yang', isMoving: false },
        { value: 'yang', isMoving: false },
        { value: 'yin', isMoving: false },
        { value: 'yin', isMoving: false },
        { value: 'yang', isMoving: false },
      ],
      movingLineIndexes: [],
    })

    expect(transformedHexagram.movingLineIndexes).toEqual(
      deriveMovingLineIndexes(transformedHexagram.lines),
    )
  })

  it('rejects invalid line counts', () => {
    const invalidLines: LiuyaoLine[] = [
      { value: 'yang', isMoving: false },
      { value: 'yin', isMoving: false },
      { value: 'yang', isMoving: false },
      { value: 'yin', isMoving: false },
      { value: 'yang', isMoving: false },
    ]

    expect(() => createLiuyaoHexagram(invalidLines)).toThrow(
      'Liuyao hexagrams require exactly 6 lines',
    )
  })

  it('generates a valid six-line coin cast result', () => {
    const result = generateCoinCastResult()

    expect(result.lines).toHaveLength(6)

    for (const line of result.lines) {
      expect(['yin', 'yang']).toContain(line.value)
      expect(typeof line.isMoving).toBe('boolean')
    }

    expect(result.movingLineIndexes).toEqual(
      deriveMovingLineIndexes(result.lines),
    )
  })

  it('formats a liuyao result with configurable labels and separators', () => {
    const result = formatLiuyaoResult({
      lines: createLiuyaoHexagram([
        { value: 'yang', isMoving: false },
        { value: 'yin', isMoving: true },
        { value: 'yang', isMoving: false },
        { value: 'yin', isMoving: false },
        { value: 'yang', isMoving: true },
        { value: 'yin', isMoving: false },
      ]),
      movingLineIndexes: [2, 5],
    }, {
      lineSeparator: ' | ',
      movingLineSeparator: ', ',
      movingLineFallback: 'none',
      labels: {
        yin: 'Yin',
        yang: 'Yang',
        moving: 'moving',
        static: 'static',
      },
    })

    expect(result).toEqual({
      primaryHexagram: 'Yangstatic | Yinmoving | Yangstatic | Yinstatic | Yangmoving | Yinstatic',
      transformedHexagram: 'Yangstatic | Yangstatic | Yangstatic | Yinstatic | Yinstatic | Yinstatic',
      movingLines: '2, 5',
    })
  })

  it('exposes default result-card labels for non-UI reuse', () => {
    expect(DEFAULT_LIUYAO_RESULT_LABELS).toEqual({
      title: '六爻卦象',
      primaryHexagram: '本卦',
      transformedHexagram: '之卦',
      movingLines: '動爻',
      movingLineFallback: '無',
    })
  })
})
