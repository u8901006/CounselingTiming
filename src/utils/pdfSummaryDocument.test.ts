// @ts-ignore Node built-in available in Vitest runtime
import { readFileSync } from 'fs'
// @ts-ignore Node built-in available in Vitest runtime
import { resolve } from 'path'
import { describe, expect, it } from 'vitest'

import { buildPdfSummaryDocument } from './pdfSummaryDocument'

const subsetChars = new Set(
  // @ts-ignore process is available in Vitest runtime
  readFileSync(resolve(process.cwd(), 'scripts/pdf-font-chars.txt'), 'utf-8')
    .replace(/\r/g, '')
    .split(''),
)

function expectSubsetCoverage(text: string) {
  const missing = Array.from(new Set(text.split('').filter((char) => char !== '\n' && !subsetChars.has(char))))
  expect(missing).toEqual([])
}

describe('buildPdfSummaryDocument', () => {
  it('builds a PDF summary document with header and summary body', () => {
    const content = buildPdfSummaryDocument({
      summaryText: '諮商時機摘要\n問題：現在適合開始諮商嗎？',
      exportedAt: new Date('2026-03-14T14:30:00Z'),
    })

    expect(content.startsWith('CounselingNow\n匯出時間：2026/3/14 ')).toBe(true)
    expect(content).toContain('\n\n諮商時機摘要\n問題：現在適合開始諮商嗎？')
  })

  it('builds a document containing the fixed PDF header labels', () => {
    const content = buildPdfSummaryDocument({ summaryText: '諮商時機摘要' })

    expect(content).toContain('CounselingNow')
    expect(content).toContain('匯出時間')
    expect(content).toContain('諮商時機摘要')
  })

  it('keeps representative exported content inside the subset character list', () => {
    const content = buildPdfSummaryDocument({
      summaryText: '諮商時機摘要\n問題：現在適合開始諮商嗎？\n已選方法：紫微斗數、西洋占星、數字命理\n綜合建議：先穩定情緒，再開始。',
    })

    expectSubsetCoverage(content)
  })

  it('falls back when summary text is blank', () => {
    const content = buildPdfSummaryDocument({ summaryText: '   ' })

    expect(content).toContain('詳細資料暫缺')
  })
})
