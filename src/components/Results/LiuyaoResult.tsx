import { useTranslation } from 'react-i18next'

import {
  formatLiuyaoResult,
  type LiuyaoHexagramResult,
} from '../../modules/liuyao'

interface LiuyaoResultProps {
  result: LiuyaoHexagramResult
}

export function LiuyaoResult({ result }: LiuyaoResultProps) {
  const { t } = useTranslation()
  const lineLabels = {
    yin: t('resultSummary.liuyaoYin'),
    yang: t('resultSummary.liuyaoYang'),
    moving: t('resultSummary.liuyaoMoving'),
    static: t('resultSummary.liuyaoStatic'),
  }
  const usesLatinLineLabels = /^[A-Za-z]+$/.test(lineLabels.yin) && /^[A-Za-z]+$/.test(lineLabels.yang)
  const formatted = formatLiuyaoResult(result, {
    lineSeparator: t('resultSummary.listSeparator', { defaultValue: '、' }),
    movingLineSeparator: t('resultSummary.listSeparator', { defaultValue: '、' }),
    movingLineFallback: t('result.liuyaoMovingLineFallback'),
    labels: {
      yin: usesLatinLineLabels ? `${lineLabels.yin} ` : lineLabels.yin,
      yang: usesLatinLineLabels ? `${lineLabels.yang} ` : lineLabels.yang,
      moving: lineLabels.moving,
      static: lineLabels.static,
    },
  })
  const labels = {
    title: t('result.liuyao'),
    primaryHexagram: t('result.liuyaoPrimaryHexagram'),
    transformedHexagram: t('result.liuyaoTransformedHexagram'),
    movingLines: t('result.liuyaoMovingLines'),
  }
  const fieldSeparator = t('resultSummary.fieldSeparator', { defaultValue: '：' })

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>🪙</span> {labels.title}
      </h2>

      <div className="space-y-3">
        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="text-sm text-gray-500 dark:text-gray-400">{labels.primaryHexagram}</div>
          <div className="mt-1 font-medium">{formatted.primaryHexagram}</div>
        </div>

        <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
          <div className="text-sm text-gray-500 dark:text-gray-400">{labels.transformedHexagram}</div>
          <div className="mt-1 font-medium">{formatted.transformedHexagram}</div>
        </div>

        <div className="rounded-lg bg-amber-50 p-4 text-sm dark:bg-amber-900/30">
          {`${labels.movingLines}${fieldSeparator}${formatted.movingLines}`}
        </div>
      </div>
    </div>
  )
}
