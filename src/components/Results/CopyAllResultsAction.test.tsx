import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import i18n from '../../i18n'
import { CopyAllResultsAction } from './CopyAllResultsAction'

const copyToClipboardMock = vi.fn()

vi.mock('../../utils/clipboard', () => ({
  copyToClipboard: (text: string) => copyToClipboardMock(text),
}))

describe('CopyAllResultsAction', () => {
  afterEach(() => {
    vi.useRealTimers()
    copyToClipboardMock.mockReset()
  })

  it('copies the full summary and shows a success state', async () => {
    const summary = '諮商時機摘要\n\n問題：我現在適合開始諮商嗎？'

    copyToClipboardMock.mockResolvedValue(undefined)
    vi.useFakeTimers()

    render(<CopyAllResultsAction summaryText={summary} hasMeaningfulContent />)

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '複製全部占卜結果' }))
      await Promise.resolve()
    })

    expect(copyToClipboardMock).toHaveBeenCalledWith(summary)

    expect(screen.getByRole('button', { name: '已複製全部結果' })).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(screen.getByRole('button', { name: '複製全部占卜結果' })).toBeInTheDocument()
  })

  it('shows a failure message when copying fails', async () => {
    copyToClipboardMock.mockRejectedValue(new Error('copy failed'))

    render(<CopyAllResultsAction summaryText={'諮商時機摘要'} hasMeaningfulContent />)

    fireEvent.click(screen.getByRole('button', { name: '複製全部占卜結果' }))

    await waitFor(() => {
      expect(screen.getByText('複製失敗，請稍後再試。')).toBeInTheDocument()
    })
  })

  it('recovers from an error state after a successful retry', async () => {
    copyToClipboardMock
      .mockRejectedValueOnce(new Error('copy failed'))
      .mockResolvedValueOnce(undefined)

    render(<CopyAllResultsAction summaryText={'諮商時機摘要'} hasMeaningfulContent />)

    fireEvent.click(screen.getByRole('button', { name: '複製全部占卜結果' }))

    await waitFor(() => {
      expect(screen.getByText('複製失敗，請稍後再試。')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: '複製全部占卜結果' }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '已複製全部結果' })).toBeInTheDocument()
    })

    expect(screen.queryByText('複製失敗，請稍後再試。')).not.toBeInTheDocument()
  })

  it('disables the button when there is no meaningful result content', () => {
    render(<CopyAllResultsAction summaryText={'   '} hasMeaningfulContent={false} />)

    expect(screen.getByRole('button', { name: '複製全部占卜結果' })).toBeDisabled()
  })

  it('renders localized copy text in English', async () => {
    await act(async () => {
      await i18n.changeLanguage('en')
    })

    render(<CopyAllResultsAction summaryText={'Counseling timing summary'} hasMeaningfulContent />)

    expect(screen.getByRole('button', { name: 'Copy all divination results' })).toBeInTheDocument()

    await act(async () => {
      await i18n.changeLanguage('zh-TW')
    })
  })
})
