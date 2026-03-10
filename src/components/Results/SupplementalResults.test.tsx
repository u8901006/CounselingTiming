import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import '../../i18n'
import { NumerologyResult } from './NumerologyResult'
import { VedicAstroResult } from './VedicAstroResult'
import { WesternAstroResult } from './WesternAstroResult'

describe('supplemental result components', () => {
  it('renders western astrology data with partial-safe fallbacks', () => {
    render(
      <WesternAstroResult
        chart={{
          ascendant: {
            sign: 'Cancer',
            degree: 12,
            minute: 30,
          },
          planets: [
            {
              name: 'Sun',
              nameEn: 'Sun',
              symbol: 'Sun',
              sign: 'Taurus',
              degree: 18,
              minute: 0,
              retrograde: false,
            },
          ],
          aspects: [
            {
              planet1: 'Sun',
              type: 'trine',
              planet2: 'Moon',
              orb: 1.5,
            },
          ],
        }}
      />,
    )

    expect(screen.getByText('西洋占星')).toBeInTheDocument()
    expect(screen.getByText('Cancer 12度 30分')).toBeInTheDocument()
    expect(screen.getByText('Sun Sun')).toBeInTheDocument()
    expect(screen.getByText('Taurus 18度 0分')).toBeInTheDocument()
    expect(screen.getByText('Sun trine Moon (1.5度)')).toBeInTheDocument()
    expect(screen.getByText('天頂')).toBeInTheDocument()
    expect(screen.getByText('-', { selector: 'div' })).toBeInTheDocument()
  })

  it('renders vedic astrology essentials and dasha fallback text', () => {
    render(
      <VedicAstroResult
        chart={{
          moonSign: 'Pisces',
          ascendant: 'Leo',
          moonNakshatra: {
            number: 1,
            name: 'Ashwini',
            nameEn: 'Ashwini',
            lord: 'Ketu',
            pada: 2,
          },
          moonDegree: 10.25,
        }}
      />,
    )

    expect(screen.getByText('吠陀占星')).toBeInTheDocument()
    expect(screen.getByText('Pisces')).toBeInTheDocument()
    expect(screen.getByText('Leo')).toBeInTheDocument()
    expect(screen.getByText('Ashwini')).toBeInTheDocument()
    expect(screen.getByText(/10\.25度/)).toBeInTheDocument()
    expect(screen.getByText('暫無 Dasha 資料。')).toBeInTheDocument()
  })

  it('renders numerology values and handles empty partial results', () => {
    const { rerender } = render(
      <NumerologyResult
        result={{
          lifePathNumber: 7,
          destinyNumber: 3,
        }}
      />,
    )

    expect(screen.getByText('數字命理')).toBeInTheDocument()
    expect(screen.getByText('生命道路數')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('命運數')).toBeInTheDocument()

    rerender(<NumerologyResult result={{}} />)

    expect(screen.getByText('此結果暫無數字命理詳細資料。')).toBeInTheDocument()
  })

  it('renders an unavailable state when western astrology data is null', () => {
    render(<WesternAstroResult chart={null} />)

    expect(screen.getByText('西洋占星')).toBeInTheDocument()
    expect(screen.getByText('此結果暫無西洋占星詳細資料。')).toBeInTheDocument()
  })
})
