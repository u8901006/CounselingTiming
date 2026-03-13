import { act, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import i18n from '../../i18n'
import { LiuyaoResult } from './LiuyaoResult'

describe('LiuyaoResult', () => {
  afterEach(async () => {
    await act(async () => {
      await i18n.changeLanguage('zh-TW')
    })
  })

  it('renders the primary and transformed hexagrams with moving lines', () => {
    render(
      <LiuyaoResult
        result={{
          lines: [
            { value: 'yang', isMoving: false },
            { value: 'yin', isMoving: true },
            { value: 'yang', isMoving: false },
            { value: 'yin', isMoving: false },
            { value: 'yang', isMoving: true },
            { value: 'yin', isMoving: false },
          ],
          movingLineIndexes: [2, 5],
        }}
      />,
    )

    expect(screen.getByText('六爻卦象')).toBeTruthy()
    expect(screen.getByText('本卦')).toBeTruthy()
    expect(screen.getByText('陽靜、陰動、陽靜、陰靜、陽動、陰靜')).toBeTruthy()
    expect(screen.getByText('之卦')).toBeTruthy()
    expect(screen.getByText('陽靜、陽靜、陽靜、陰靜、陰靜、陰靜')).toBeTruthy()
    expect(screen.getByText('動爻：2、5')).toBeTruthy()
  })

  it('renders English result labels and formatted line text', async () => {
    await act(async () => {
      await i18n.changeLanguage('en')
    })

    render(
      <LiuyaoResult
        result={{
          lines: [
            { value: 'yang', isMoving: false },
            { value: 'yin', isMoving: true },
            { value: 'yang', isMoving: false },
            { value: 'yin', isMoving: false },
            { value: 'yang', isMoving: true },
            { value: 'yin', isMoving: false },
          ],
          movingLineIndexes: [2, 5],
        }}
      />,
    )

    expect(screen.getByRole('heading', { name: /Liuyao hexagram/i })).toBeTruthy()
    expect(screen.getByText('Primary hexagram')).toBeTruthy()
    expect(screen.getByText('Yang static, Yin moving, Yang static, Yin static, Yang moving, Yin static')).toBeTruthy()
    expect(screen.getByText('Transformed hexagram')).toBeTruthy()
    expect(screen.getByText('Yang static, Yang static, Yang static, Yin static, Yin static, Yin static')).toBeTruthy()
    expect(screen.getByText('Moving lines: 2, 5')).toBeTruthy()
  })
})
