import { beforeEach, describe, expect, it, vi } from 'vitest'

import { PDF_FONT_DATA, PDF_FONT_FAMILY, PDF_FONT_FILE } from './pdfFont'

const mockAddFileToVFS = vi.fn()
const mockAddFont = vi.fn()
const mockSetFont = vi.fn()
const mockSetFontSize = vi.fn()
const mockSplitTextToSize = vi.fn((content: string) => content.split('\n'))
const mockText = vi.fn()
const mockAddPage = vi.fn()
const mockSave = vi.fn()

vi.mock('jspdf', () => ({
  jsPDF: vi.fn(function JsPdfMock() {
    return {
      addFileToVFS: mockAddFileToVFS,
      addFont: mockAddFont,
      setFont: mockSetFont,
      setFontSize: mockSetFontSize,
      splitTextToSize: mockSplitTextToSize,
      text: mockText,
      addPage: mockAddPage,
      save: mockSave,
      internal: {
        pageSize: {
          getWidth: () => 595,
          getHeight: () => 842,
        },
      },
    }
  }),
}))

import { exportSummaryAsPDF } from './export'

describe('exportSummaryAsPDF', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exports a summary PDF with embedded font setup', async () => {
    await exportSummaryAsPDF({
      content: 'CounselingNow\n匯出時間：2026/03/14 14:30\n\n諮商時機摘要',
      filename: 'report',
    })

    expect(mockAddFileToVFS).toHaveBeenCalledWith(PDF_FONT_FILE, PDF_FONT_DATA)
    expect(mockAddFont).toHaveBeenCalledWith(PDF_FONT_FILE, PDF_FONT_FAMILY, 'normal')
    expect(mockSetFont).toHaveBeenCalledWith(PDF_FONT_FAMILY, 'normal')
    expect(mockText).toHaveBeenCalledWith('CounselingNow', 40, 40)
    expect(mockSave).toHaveBeenCalledWith('report.pdf')
  })

  it('adds a new page when wrapped text exceeds the page height', async () => {
    mockSplitTextToSize.mockReturnValueOnce(Array.from({ length: 60 }, (_, index) => `line-${index + 1}`))

    await exportSummaryAsPDF({
      content: 'long content',
      filename: 'long-report',
    })

    expect(mockAddPage).toHaveBeenCalled()
    expect(mockText).toHaveBeenCalledWith('line-1', 40, 40)
  })
})
