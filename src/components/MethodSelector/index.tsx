import { useTranslation } from 'react-i18next'
import { DivinationMethod } from '../../store/useAppStore'

interface MethodSelectorProps {
  selectedMethods: DivinationMethod[]
  onToggle: (method: DivinationMethod) => void
  onBack: () => void
  onAnalyze: () => void
  isLoading: boolean
  question: string
  onQuestionChange: (value: string) => void
}

const METHOD_OPTIONS: {
  id: DivinationMethod
  icon: string
  nameKey: string
  descKey: string
  defaultName: string
  defaultDescription: string
}[] = [
  {
    id: 'ziwei',
    icon: '⭐',
    nameKey: 'method.ziwei',
    descKey: 'method.ziweiDesc',
    defaultName: '紫微斗數',
    defaultDescription: '命盤分析',
  },
  {
    id: 'bazi',
    icon: '☯️',
    nameKey: 'method.bazi',
    descKey: 'method.baziDesc',
    defaultName: '八字四柱',
    defaultDescription: '五行分析',
  },
  {
    id: 'iching',
    icon: '🔮',
    nameKey: 'method.iching',
    descKey: 'method.ichingDesc',
    defaultName: '易經',
    defaultDescription: '蓍草/銅錢占卜',
  },
  {
    id: 'tarot',
    icon: '🃏',
    nameKey: 'method.tarot',
    descKey: 'method.tarotDesc',
    defaultName: '塔羅',
    defaultDescription: '牌陣解讀',
  },
  {
    id: 'western-astro',
    icon: '☉',
    nameKey: 'method.westernAstro',
    descKey: 'method.westernAstroDesc',
    defaultName: '西洋占星',
    defaultDescription: '行星與宮位分析',
  },
  {
    id: 'vedic-astro',
    icon: '🕉',
    nameKey: 'method.vedicAstro',
    descKey: 'method.vedicAstroDesc',
    defaultName: '吠陀占星',
    defaultDescription: 'Lagna 與 Dasha 分析',
  },
  {
    id: 'numerology',
    icon: '#',
    nameKey: 'method.numerology',
    descKey: 'method.numerologyDesc',
    defaultName: '數字命理',
    defaultDescription: '生命靈數與週期分析',
  },
]

export default function MethodSelector({
  selectedMethods,
  onToggle,
  onBack,
  onAnalyze,
  isLoading,
  question,
  onQuestionChange,
}: MethodSelectorProps) {
  const { t } = useTranslation()
  const canAnalyze = selectedMethods.length > 0 && question.trim().length > 0 && !isLoading

  return (
    <div className="card max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-gray-200">
        {t('method.title')}
      </h2>

      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          {t('method.subtitle')}
        </p>

        <div>
          <label htmlFor="question" className="block text-sm font-medium mb-2 dark:text-gray-200">
            {t('method.question')}
          </label>
          <textarea
            id="question"
            value={question}
            onChange={(event) => onQuestionChange(event.target.value)}
            rows={4}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-water dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
            placeholder={t('method.questionPlaceholder')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {METHOD_OPTIONS.map((option) => (
            <button
              type="button"
              key={option.id}
              onClick={() => onToggle(option.id)}
              aria-pressed={selectedMethods.includes(option.id)}
              className={`p-4 border rounded-lg transition-all text-left ${
                selectedMethods.includes(option.id)
                  ? 'border-water bg-blue-50 dark:bg-blue-900/30 ring-2 ring-water'
                  : 'border-gray-200 dark:border-gray-700 hover:border-water dark:hover:border-water'
              }`}
            >
              <div className="text-2xl mb-2">{option.icon}</div>
              <div className="font-medium dark:text-gray-200">
                {t(option.nameKey, { defaultValue: option.defaultName })}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {t(option.descKey, { defaultValue: option.defaultDescription })}
              </div>
              {selectedMethods.includes(option.id) && (
                <div className="mt-2 text-xs text-water font-medium">✓ {t('method.selected')}</div>
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-4 pt-4">
          <button
            onClick={onBack}
            className="flex-1 py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-200"
          >
            {t('method.prevStep')}
          </button>
          <button
            onClick={onAnalyze}
            disabled={!canAnalyze}
            className="flex-1 py-3 bg-water text-white rounded-lg font-medium hover:bg-water-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t('method.analyzing') : t('method.startAnalysis')}
          </button>
        </div>
      </div>
    </div>
  )
}
