import type { NumerologyResult as NumerologyResultData } from '../../modules/numerology/types'
import { useTranslation } from 'react-i18next'

type RecursivePartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<RecursivePartial<U>>
    : T[K] extends object
      ? RecursivePartial<T[K]>
      : T[K]
}

interface NumerologyResultProps {
  result: RecursivePartial<NumerologyResultData> | null
}

const NUMBER_FIELDS: Array<{ key: keyof NumerologyResultData; labelKey: string }> = [
  { key: 'lifePathNumber', labelKey: 'supplemental.numerology.lifePath' },
  { key: 'destinyNumber', labelKey: 'supplemental.numerology.destiny' },
  { key: 'soulNumber', labelKey: 'supplemental.numerology.soul' },
  { key: 'personalityNumber', labelKey: 'supplemental.numerology.personality' },
  { key: 'birthdayNumber', labelKey: 'supplemental.numerology.birthday' },
  { key: 'expressionNumber', labelKey: 'supplemental.numerology.expression' },
]

export function NumerologyResult({ result }: NumerologyResultProps) {
  const { t } = useTranslation()
  const entries = NUMBER_FIELDS.filter(({ key }) => typeof result?.[key] === 'number')

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>數</span> {t('result.numerology')}
      </h2>

      {entries.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(({ key, labelKey }) => (
            <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t(labelKey)}</div>
              <div className="text-2xl font-bold">{result?.[key]}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500 dark:text-gray-400">{t('supplemental.numerology.detailsUnavailable')}</div>
      )}
    </div>
  )
}
