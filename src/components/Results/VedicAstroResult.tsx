import type { VedicAstroChart } from '../../modules/vedic-astro/types'
import { useTranslation } from 'react-i18next'

type RecursivePartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<RecursivePartial<U>>
    : T[K] extends object
      ? RecursivePartial<T[K]>
      : T[K]
}

interface VedicAstroResultProps {
  chart: RecursivePartial<VedicAstroChart> | null
}

function formatMoonDegree(value: number | undefined, degreeUnit: string) {
  return typeof value === 'number' ? `${value.toFixed(2)}${degreeUnit}` : '-'
}

export function VedicAstroResult({ chart }: VedicAstroResultProps) {
  const { t } = useTranslation()
  const degreeUnit = t('supplemental.common.degreeUnit')
  const rangeSeparator = t('supplemental.common.rangeSeparator')
  const dashas = Array.isArray(chart?.dashas) ? chart.dashas.slice(0, 3) : []

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>月</span> {t('result.vedicAstro')}
      </h2>

      {!chart ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {t('supplemental.vedicAstro.detailsUnavailable')}
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3 mb-4 text-sm">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('supplemental.vedicAstro.moonSign')}</div>
              <div className="font-medium">{chart.moonSign ?? '-'}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('supplemental.vedicAstro.ascendant')}</div>
              <div className="font-medium">{chart.ascendant ?? '-'}</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('supplemental.vedicAstro.sunSign')}</div>
              <div className="font-medium">{chart.sunSign ?? '-'}</div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 text-sm">
              <div className="font-medium mb-2">{t('supplemental.vedicAstro.nakshatra')}</div>
              <div>{chart.moonNakshatra?.name ?? chart.moonNakshatra?.nameEn ?? t('supplemental.vedicAstro.unavailable')}</div>
              <div className="text-gray-600 dark:text-gray-300 mt-1">
                {t('supplemental.vedicAstro.lord')}: {chart.moonNakshatra?.lord ?? '-'}
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                {t('supplemental.vedicAstro.pada')}: {chart.moonNakshatra?.pada ?? '-'} | {t('supplemental.vedicAstro.moonDegree')}: {formatMoonDegree(chart.moonDegree, degreeUnit)}
              </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-sm">
              <div className="font-medium mb-2">{t('supplemental.vedicAstro.currentDashaSequence')}</div>
              {dashas.length > 0 ? (
                <div className="space-y-2">
                  {dashas.map((dasha, index) => (
                    <div key={`${dasha.planet ?? 'dasha'}-${dasha.startYear ?? index}-${index}`}>
                      <span className="font-medium">{dasha.planet ?? t('supplemental.vedicAstro.unknown')}</span>
                      <span className="text-gray-600 dark:text-gray-300">
                        {' '}
                        {dasha.startYear ?? '-'}
                        {` ${rangeSeparator} `}
                        {typeof dasha.startYear === 'number' && typeof dasha.duration === 'number'
                          ? dasha.startYear + dasha.duration
                          : '-'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 dark:text-gray-400">{t('supplemental.vedicAstro.dashaDataUnavailable')}</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
