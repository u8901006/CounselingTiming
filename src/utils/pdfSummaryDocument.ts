export interface BuildPdfSummaryDocumentInput {
  summaryText: string
  exportedAt?: Date
  title?: string
  exportedAtLabel?: string
}

const FALLBACK_BODY = '詳細資料暫缺'

export function buildPdfSummaryDocument({
  summaryText,
  exportedAt = new Date(),
  title = 'CounselingNow',
  exportedAtLabel = '匯出時間',
}: BuildPdfSummaryDocumentInput): string {
  const body = summaryText.trim() || FALLBACK_BODY
  const timestamp = exportedAt.toLocaleString('zh-TW', { hour12: false })

  return [title, `${exportedAtLabel}：${timestamp}`, '', body].join('\n').trim()
}
