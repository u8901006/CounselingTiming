import { describe, expect, it } from 'vitest'

import { buildPdfSummaryDocument } from './pdfSummaryDocument'

describe('buildPdfSummaryDocument', () => {
  it('builds a PDF summary document with header and summary body', () => {
    const content = buildPdfSummaryDocument({
      summaryText: '諮商時機摘要\n問題：現在適合開始諮商嗎？',
      exportedAt: new Date('2026-03-14T14:30:00Z'),
    })

    expect(content.startsWith('CounselingNow\n匯出時間：2026/3/14 ')).toBe(true)
    expect(content).toContain('\n\n諮商時機摘要\n問題：現在適合開始諮商嗎？')
  })

  it('falls back when summary text is blank', () => {
    const content = buildPdfSummaryDocument({ summaryText: '   ' })

    expect(content).toContain('詳細資料暫缺')
  })
})
