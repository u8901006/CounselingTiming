import { useState } from 'react'
import { exportAsImage, exportAsPDF } from '../../utils/export'

interface ExportButtonProps {
  targetId: string
  filename?: string
}

export default function ExportButton({ targetId, filename = 'counseling-result' }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExportImage = async () => {
    setIsExporting(true)
    try {
      await exportAsImage(targetId, filename)
    } catch (error) {
      alert('匯出圖片失敗，請稍後再試')
    } finally {
      setIsExporting(false)
    }
  }

  const handleExportPDF = async () => {
    setIsExporting(true)
    try {
      await exportAsPDF(targetId, filename)
    } catch (error) {
      alert('匯出 PDF 失敗，請稍後再試')
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
        {isExporting ? '匯出中...' : '匯出圖片'}
      </button>
      <button
        onClick={handleExportPDF}
        disabled={isExporting}
        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50"
      >
        {isExporting ? '匯出中...' : '匯出 PDF'}
      </button>
    </div>
  )
}
