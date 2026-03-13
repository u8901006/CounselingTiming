import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import '../../../src/i18n'
import { useAppStore } from '../../store/useAppStore'
import { GPTIntegration } from './GPTIntegration'

const copyToClipboardMock = vi.fn()

vi.mock('../../utils/clipboard', () => ({
  copyToClipboard: (text: string) => copyToClipboardMock(text),
}))

describe('GPTIntegration', () => {
  const initialState = useAppStore.getState()

  afterEach(() => {
    act(() => {
      useAppStore.setState(initialState)
    })
    copyToClipboardMock.mockReset()
  })

  it('shows a preview block for manual copying', () => {
    act(() => {
      useAppStore.setState({
        question: 'How should I approach my next decision?',
        selectedMethods: ['numerology'],
        divinationResults: {
          ...useAppStore.getState().divinationResults,
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
    })

    render(<GPTIntegration />)

    const preview = screen.getByLabelText('GPT 提示詞預覽') as HTMLTextAreaElement
    expect(preview.value).toContain('Life path number: 7')
  })

  it('handles copy failures without hiding the prompt preview', async () => {
    copyToClipboardMock.mockRejectedValue(new Error('copy failed'))

    act(() => {
      useAppStore.setState({
        question: 'What is the bigger pattern here?',
        selectedMethods: ['western-astro'],
        divinationResults: {
          ...useAppStore.getState().divinationResults,
          westernAstro: {
            planets: [],
            houses: [],
            ascendant: {
              name: 'Ascendant',
              nameEn: 'Ascendant',
              symbol: 'Asc',
              longitude: 0,
              sign: 'Cancer',
              signEn: 'Cancer',
              degree: 12,
              minute: 0,
              retrograde: false,
            },
            midheaven: {
              name: 'Midheaven',
              nameEn: 'Midheaven',
              symbol: 'Mc',
              longitude: 0,
              sign: 'Pisces',
              signEn: 'Pisces',
              degree: 18,
              minute: 0,
              retrograde: false,
            },
            aspects: [],
          },
        },
    })
    })

    render(<GPTIntegration />)

    fireEvent.click(screen.getByRole('button', { name: '複製提示詞' }))

    await waitFor(() => {
      expect(screen.getByText('複製失敗，您可以直接從預覽區手動複製。')).toBeInTheDocument()
    })

    const preview = screen.getByLabelText('GPT 提示詞預覽') as HTMLTextAreaElement
    expect(preview.value).toContain('Ascendant: Cancer')
  })
})
