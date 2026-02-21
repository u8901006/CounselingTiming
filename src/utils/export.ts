import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export async function exportAsImage(elementId: string, filename: string = 'counseling-result'): Promise<void> {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`)
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
    })

    const link = document.createElement('a')
    link.download = `${filename}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch (error) {
    console.error('Failed to export as image:', error)
    throw error
  }
}

export async function exportAsPDF(elementId: string, filename: string = 'counseling-result'): Promise<void> {
  const element = document.getElementById(elementId)
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`)
  }

  try {
    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })

    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pageWidth / imgWidth, pageHeight / imgHeight) * 0.9
    const scaledWidth = imgWidth * ratio
    const scaledHeight = imgHeight * ratio
    const x = (pageWidth - scaledWidth) / 2
    const y = 10

    pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight)
    pdf.save(`${filename}.pdf`)
  } catch (error) {
    console.error('Failed to export as PDF:', error)
    throw error
  }
}
