import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { copyToClipboard } from '../../utils/clipboard'

interface CopyAllResultsActionProps {
  summaryText: string
  hasMeaningfulContent: boolean
}

export function CopyAllResultsAction({
  summaryText,
  hasMeaningfulContent,
}: CopyAllResultsActionProps) {
  const { t } = useTranslation()
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')

  useEffect(() => {
    if (copyState !== 'copied') {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setCopyState('idle')
    }, 2000)

    return () => window.clearTimeout(timeoutId)
  }, [copyState])

  const isDisabled = !hasMeaningfulContent || !summaryText.trim()

  const handleCopyAll = async () => {
    if (isDisabled) {
      setCopyState('error')
      return
    }

    try {
      await copyToClipboard(summaryText)
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        onClick={handleCopyAll}
        disabled={isDisabled}
        className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {copyState === 'copied'
          ? t('resultActions.copied')
          : t('resultActions.copyAll')}
      </button>

      {copyState === 'error' && (
        <p className="text-sm text-red-600 dark:text-red-400">
          {isDisabled
            ? t('resultActions.nothingToCopy')
            : t('resultActions.copyFailed')}
        </p>
      )}
    </div>
  )
}
