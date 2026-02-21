import { useTranslation } from 'react-i18next'
import { DivinationMethod } from '../../store/useAppStore'

interface MethodSelectorProps {
  selectedMethods: DivinationMethod[]
  onToggle: (method: DivinationMethod) => void
  onBack: () => void
  onAnalyze: () => void
  isLoading: boolean
}

const METHOD_OPTIONS: { id: DivinationMethod; icon: string; nameKey: string; descKey: string }[] = [
  { id: 'ziwei', icon: '⭐', nameKey: 'method.ziwei', descKey: 'method.ziweiDesc' },
  { id: 'bazi', icon: '☯️', nameKey: 'method.bazi', descKey: 'method.baziDesc' },
  { id: 'iching', icon: '🔮', nameKey: 'method.iching', descKey: 'method.ichingDesc' },
  { id: 'tarot', icon: '🃏', nameKey: 'method.tarot', descKey: 'method.tarotDesc' },
]

export default function MethodSelector({
  selectedMethods,
  onToggle,
  onBack,
  onAnalyze,
  isLoading,
}: MethodSelectorProps) {
  const { t } = useTranslation()

  return (
    <div className="card max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center dark:text-gray-200">
        {t('method.title')}
      </h2>

      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
          {t('method.subtitle')}
        </p>

        <div className="grid grid-cols-2 gap-4">
          {METHOD_OPTIONS.map((option) => (
            <div
              key={option.id}
              onClick={() => onToggle(option.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                selectedMethods.includes(option.id)
                  ? 'border-water bg-blue-50 dark:bg-blue-900/30 ring-2 ring-water'
                  : 'border-gray-200 dark:border-gray-700 hover:border-water dark:hover:border-water'
              }`}
            >
              <div className="text-2xl mb-2">{option.icon}</div>
              <div className="font-medium dark:text-gray-200">{t(option.nameKey)}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{t(option.descKey)}</div>
              {selectedMethods.includes(option.id) && (
                <div className="mt-2 text-xs text-water font-medium">✓ {t('method.selected')}</div>
              )}
            </div>
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
            disabled={selectedMethods.length === 0 || isLoading}
            className="flex-1 py-3 bg-water text-white rounded-lg font-medium hover:bg-water-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t('method.analyzing') : t('method.startAnalysis')}
          </button>
        </div>
      </div>
    </div>
  )
}
