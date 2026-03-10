import type { WesternAstroChart } from '../../modules/western-astro/types'
import { useTranslation } from 'react-i18next'

type RecursivePartial<T> = {
  [K in keyof T]?: T[K] extends Array<infer U>
    ? Array<RecursivePartial<U>>
    : T[K] extends object
      ? RecursivePartial<T[K]>
      : T[K]
}

interface WesternAstroResultProps {
  chart: RecursivePartial<WesternAstroChart> | null
}

const FALLBACK_TEXT = '-'

function formatPoint(
  degreeUnit: string,
  minuteUnit: string,
  sign?: string,
  degree?: number,
  minute?: number,
) {
  if (!sign) {
    return FALLBACK_TEXT
  }

  if (typeof degree !== 'number') {
    return sign
  }

  if (typeof minute !== 'number') {
    return `${sign} ${degree}${degreeUnit}`
  }

  return `${sign} ${degree}${degreeUnit} ${minute}${minuteUnit}`
}

function formatAspect(
  planet1: string | undefined,
  type: string | undefined,
  planet2: string | undefined,
  orb: number | undefined,
  degreeUnit: string,
  fallback: string,
) {
  const parts = [planet1, type, planet2].filter(Boolean)

  if (parts.length === 0) {
    return fallback
  }

  if (typeof orb !== 'number') {
    return parts.join(' ')
  }

  return `${parts.join(' ')} (${orb.toFixed(1)}${degreeUnit})`
}

export function WesternAstroResult({ chart }: WesternAstroResultProps) {
  const { t } = useTranslation()
  const degreeUnit = t('supplemental.common.degreeUnit')
  const minuteUnit = t('supplemental.common.minuteUnit')
  const retrogradeLabel = t('supplemental.common.retrograde')
  const planets = Array.isArray(chart?.planets) ? chart.planets.slice(0, 4) : []
  const aspects = Array.isArray(chart?.aspects) ? chart.aspects.slice(0, 3) : []

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>星</span> {t('result.westernAstro')}
      </h2>

      {!chart ? (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {t('supplemental.westernAstro.detailsUnavailable')}
        </div>
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 mb-4">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('supplemental.westernAstro.ascendant')}</div>
              <div className="font-medium">
                {formatPoint(degreeUnit, minuteUnit, chart.ascendant?.sign, chart.ascendant?.degree, chart.ascendant?.minute)}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t('supplemental.westernAstro.midheaven')}</div>
              <div className="font-medium">
                {formatPoint(degreeUnit, minuteUnit, chart.midheaven?.sign, chart.midheaven?.degree, chart.midheaven?.minute)}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="font-medium mb-2">{t('supplemental.westernAstro.keyPlanets')}</div>
              {planets.length > 0 ? (
                <div className="grid gap-2 sm:grid-cols-2 text-sm">
                  {planets.map((planet, index) => (
                    <div key={`${planet.nameEn ?? planet.name ?? 'planet'}-${index}`} className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                      <div className="font-medium">{planet.symbol ? `${planet.symbol} ` : ''}{planet.name ?? planet.nameEn ?? t('supplemental.westernAstro.unknownPlanet')}</div>
                      <div className="text-gray-600 dark:text-gray-300">
                        {formatPoint(degreeUnit, minuteUnit, planet.sign, planet.degree, planet.minute)}
                        {planet.retrograde ? ` ${retrogradeLabel}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">{t('supplemental.westernAstro.planetPositionsUnavailable')}</div>
              )}
            </div>

            <div>
              <div className="font-medium mb-2">{t('supplemental.westernAstro.mainAspects')}</div>
              {aspects.length > 0 ? (
                <div className="space-y-2 text-sm">
                  {aspects.map((aspect, index) => (
                    <div key={`${aspect.planet1 ?? 'aspect'}-${aspect.planet2 ?? index}-${index}`} className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                      {formatAspect(
                        aspect.planet1,
                        aspect.type,
                        aspect.planet2,
                        aspect.orb,
                        degreeUnit,
                        t('supplemental.westernAstro.aspectDataUnavailable'),
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">{t('supplemental.westernAstro.noMajorAspects')}</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
