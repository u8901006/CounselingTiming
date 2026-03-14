import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { exportAsImage, exportSummaryAsPDF } from '../../utils/export'
import { buildPdfSummaryDocument } from '../../utils/pdfSummaryDocument'

interface ExportButtonProps {
  targetId: string
  summaryText: string
  filename?: string
}

export default function ExportButton({
  targetId,
  summaryText,
  filename = 'counseling-result',
}: ExportButtonProps) {
  const { t } = useTranslation()
  const [isExporting, setIsExporting] = useState(false)

  const handleExportImage = async () => {
    setIsExporting(true)
    try {
      await exportAsImage(targetId, filename)
    } catch (error) {
      alert(t('export.exportImageFailed'))
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      const content = buildPdfSummaryDocument({
        summaryText,
        title: t('app.title'),
        exportedAtLabel: t('export.exportedAt'),
      })
      await exportSummaryAsPDF({ content, filename })
    } catch (error) {
      alert(t('export.exportPdfFailed'))
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleExportImage}
        disabled={isExporting}
        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
      >
        {isExporting ? t('export.exporting') : t('export.exportImage')}
      </button>
      <button
        onClick={handleExportPDF}
        disabled={isExporting}
        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
      >
        {isExporting ? t('export.exporting') : t('export.exportPdf')}
      </button>
    </div>
  )
}
