import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import {
  createLiuyaoHexagram,
  deriveMovingLineIndexes,
  generateCoinCastResult,
  type LiuyaoLine,
  type LiuyaoMode,
} from '../../modules/liuyao'
import { useAppStore } from '../../store/useAppStore'

type ManualLineDraft = {
  value: LiuyaoLine['value'] | ''
  isMoving: boolean
}

const LINE_COUNT = 6
const MANUAL_DEFAULT_LINES: ManualLineDraft[] = Array.from({ length: LINE_COUNT }, () => ({
  value: '',
  isMoving: false,
}))

function formatLine(
  line: LiuyaoLine,
  labels: {
    yin: string
    yang: string
    moving: string
    static: string
  },
): string {
  const polarity = line.value === 'yang' ? labels.yang : labels.yin
  const movement = line.isMoving ? labels.moving : labels.static

  return `${polarity} ${movement}`
}

export default function LiuyaoInput() {
  const { t } = useTranslation()
  const liuyaoMode = useAppStore((state) => state.liuyaoMode)
  const liuyaoDraft = useAppStore((state) => state.liuyaoDraft)
  const setLiuyaoMode = useAppStore((state) => state.setLiuyaoMode)
  const setLiuyaoDraft = useAppStore((state) => state.setLiuyaoDraft)

  const [manualLines, setManualLines] = useState<ManualLineDraft[]>(MANUAL_DEFAULT_LINES)

  const lineLabels = useMemo(
    () => ({
      yin: t('liuyaoInput.yin'),
      yang: t('liuyaoInput.yang'),
      moving: t('liuyaoInput.moving'),
      static: t('liuyaoInput.static'),
    }),
    [t],
  )

  const isManualComplete = useMemo(
    () => manualLines.every((line) => line.value !== ''),
    [manualLines],
  )

  const updateManualLine = (index: number, nextLine: ManualLineDraft) => {
    setManualLines((currentLines) =>
      currentLines.map((line, lineIndex) => (lineIndex === index ? nextLine : line)),
    )
  }

  const handleModeChange = (mode: LiuyaoMode) => {
    if (mode !== liuyaoMode) {
      setLiuyaoDraft(null)
    }

    setLiuyaoMode(mode)
  }

  const handleManualSubmit = () => {
    if (!isManualComplete) {
      return
    }

    const lines = createLiuyaoHexagram(
      manualLines.map((line) => ({
        value: line.value as LiuyaoLine['value'],
        isMoving: line.isMoving,
      })) as [LiuyaoLine, LiuyaoLine, LiuyaoLine, LiuyaoLine, LiuyaoLine, LiuyaoLine],
    )

    setLiuyaoDraft({
      lines,
      movingLineIndexes: deriveMovingLineIndexes(lines),
    })
  }

  const handleAutoGenerate = () => {
    setLiuyaoDraft(generateCoinCastResult())
  }

  return (
    <section className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
      <div className="mb-4 flex gap-2" role="group" aria-label={t('liuyaoInput.modeGroup')}>
        <button
          type="button"
          aria-pressed={liuyaoMode === 'manual'}
          onClick={() => handleModeChange('manual')}
          className="rounded-md border px-3 py-2"
        >
          {t('liuyaoInput.manualMode')}
        </button>
        <button
          type="button"
          aria-pressed={liuyaoMode === 'auto'}
          onClick={() => handleModeChange('auto')}
          className="rounded-md border px-3 py-2"
        >
          {t('liuyaoInput.autoMode')}
        </button>
      </div>

      {liuyaoMode === 'manual' ? (
        <div className="space-y-3">
          {manualLines.map((line, index) => {
            const lineNumber = index + 1

            return (
              <div key={lineNumber} className="flex items-center gap-3">
                <label className="min-w-16 text-sm font-medium" htmlFor={`liuyao-line-${lineNumber}`}>
                  {t('liuyaoInput.lineLabel', { value: lineNumber })}
                </label>
                <select
                  id={`liuyao-line-${lineNumber}`}
                  value={line.value}
                  onChange={(event) =>
                    updateManualLine(index, {
                      ...line,
                      value: event.target.value as ManualLineDraft['value'],
                    })
                  }
                  className="rounded-md border px-3 py-2"
                >
                  <option value="">{t('liuyaoInput.linePlaceholder')}</option>
                  <option value="yang">{t('liuyaoInput.yang')}</option>
                  <option value="yin">{t('liuyaoInput.yin')}</option>
                </select>
                <label className="flex items-center gap-2 text-sm" htmlFor={`liuyao-moving-${lineNumber}`}>
                  <input
                    id={`liuyao-moving-${lineNumber}`}
                    type="checkbox"
                    checked={line.isMoving}
                    onChange={(event) =>
                      updateManualLine(index, {
                        ...line,
                        isMoving: event.target.checked,
                      })
                    }
                  />
                  {t('liuyaoInput.moving')}
                </label>
              </div>
            )
          })}

          <button
            type="button"
            onClick={handleManualSubmit}
            disabled={!isManualComplete}
            className="rounded-md bg-water px-4 py-2 text-white disabled:opacity-50"
          >
            {t('liuyaoInput.manualSubmit')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleAutoGenerate}
            className="rounded-md bg-water px-4 py-2 text-white"
          >
            {liuyaoDraft ? t('liuyaoInput.rerollDraft') : t('liuyaoInput.generateDraft')}
          </button>

          {liuyaoDraft ? (
            <ol aria-label={t('liuyaoInput.generatedDraft')} className="space-y-2 text-sm">
              {liuyaoDraft.lines.map((line, index) => (
                <li key={`${index + 1}-${line.value}-${line.isMoving ? 'moving' : 'static'}`}>
                  {t('liuyaoInput.draftLine', {
                    value: index + 1,
                    line: formatLine(line, lineLabels),
                  })}
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      )}
    </section>
  )
}
