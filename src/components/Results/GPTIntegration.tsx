import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppStore } from '../../store/useAppStore'
import { copyToClipboard } from '../../utils/clipboard'
import { buildGptPrompt, hasSupportedGptMethods } from '../../utils/gptPromptTemplate'

export function GPTIntegration() {
  const { t } = useTranslation()
  const {
    name,
    gender,
    birthDate,
    birthHour,
    location,
    question,
    selectedMethods,
    divinationResults,
  } = useAppStore()
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle')

  const prompt = useMemo(
    () =>
      buildGptPrompt({
        name,
        gender,
        birthDate,
        birthHour,
        locationName: location.city,
        question,
        selectedMethods,
        divinationResults,
      }),
    [birthDate, birthHour, divinationResults, gender, location.city, name, question, selectedMethods],
  )

  useEffect(() => {
    if (copyState !== 'copied') {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setCopyState('idle')
    }, 2000)

    return () => window.clearTimeout(timeoutId)
  }, [copyState])

  if (!hasSupportedGptMethods(selectedMethods)) {
    return null
  }

  const handleCopy = async () => {
    try {
      await copyToClipboard(prompt)
      setCopyState('copied')
    } catch {
      setCopyState('error')
    }
  }

  return (
    <div className="card">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">{t('gpt.title')}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {t('gpt.description')}
        </p>
        <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
          {t('gpt.personalDataNotice')}
        </p>
      </div>

      <textarea
        aria-label={t('gpt.previewLabel')}
        readOnly
        value={prompt}
        className="w-full min-h-[16rem] rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 p-3 font-mono text-sm dark:text-gray-100"
      />

      <div className="mt-4 flex flex-wrap gap-3 items-center">
        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-2 rounded-lg bg-water text-white font-medium hover:bg-water-dark"
        >
          {copyState === 'copied' ? t('gpt.copied') : t('gpt.copy')}
        </button>

        <a
          href="https://chat.openai.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg border border-water text-water font-medium hover:bg-water hover:text-white"
        >
          {t('gpt.openChatGPT')}
        </a>

        {copyState === 'error' && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {t('gpt.copyFailed')}
          </p>
        )}
      </div>
    </div>
  )
}
