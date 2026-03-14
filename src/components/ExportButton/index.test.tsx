import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '../../i18n'
import i18n from '../../i18n'
import ExportButton from './index'

const mocks = vi.hoisted(() => ({
  exportAsImage: vi.fn(),
  exportSummaryAsPDF: vi.fn(),
  buildPdfSummaryDocument: vi.fn(() => 'pdf-document'),
}))

vi.mock('../../utils/export', () => ({
  exportAsImage: mocks.exportAsImage,
  exportSummaryAsPDF: mocks.exportSummaryAsPDF,
}))

vi.mock('../../utils/pdfSummaryDocument', () => ({
  buildPdfSummaryDocument: mocks.buildPdfSummaryDocument,
}))

describe('ExportButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(window, 'alert').mockImplementation(() => {})
    void i18n.changeLanguage('zh-TW')
  })

  it('exports PDF from summary text', async () => {
    mocks.exportSummaryAsPDF.mockResolvedValue(undefined)

    render(
      <ExportButton
        targetId="result-panel"
        summaryText="諮商時機摘要"
        filename="report"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /匯出 PDF/i }))

    await waitFor(() => {
      expect(mocks.buildPdfSummaryDocument).toHaveBeenCalledWith(
        expect.objectContaining({
          summaryText: '諮商時機摘要',
          title: 'CounselingNow',
          exportedAtLabel: '匯出時間',
        }),
      )
      expect(mocks.exportSummaryAsPDF).toHaveBeenCalledWith(
        expect.objectContaining({
          content: 'pdf-document',
          filename: 'report',
        }),
      )
    })
  })

  it('shows a localized failure message when PDF export fails', async () => {
    mocks.exportSummaryAsPDF.mockRejectedValueOnce(new Error('boom'))

    render(
      <ExportButton
        targetId="result"
        summaryText="summary"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /匯出 PDF/i }))

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('匯出 PDF 失敗，請稍後再試')
    })
  })

  it('renders localized export labels in English', async () => {
    await i18n.changeLanguage('en')

    render(<ExportButton targetId="result" summaryText="summary" />)

    expect(screen.getByRole('button', { name: 'Export image' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Export PDF' })).toBeTruthy()
  })

  it('shows a localized exporting label while PDF export is pending', async () => {
    let resolveExport: (() => void) | undefined
    mocks.exportSummaryAsPDF.mockImplementation(
      () => new Promise<void>((resolve) => {
        resolveExport = resolve
      }),
    )

    render(<ExportButton targetId="result" summaryText="summary" />)

    fireEvent.click(screen.getByRole('button', { name: /匯出 PDF/i }))

    expect(screen.getAllByRole('button', { name: '匯出中...' })).toHaveLength(2)

    resolveExport?.()
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /匯出 PDF/i })).toBeTruthy()
    })
  })

  it('keeps image export behavior unchanged', async () => {
    mocks.exportAsImage.mockResolvedValue(undefined)

    render(<ExportButton targetId="result-panel" summaryText="summary" filename="report" />)

    fireEvent.click(screen.getByRole('button', { name: /匯出圖片/i }))

    await waitFor(() => {
      expect(mocks.exportAsImage).toHaveBeenCalledWith('result-panel', 'report')
    })
  })
})
