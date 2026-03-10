import { useHistoryStore, HistoryRecord } from '../../store/useHistoryStore'
import { DivinationMethod } from '../../store/useAppStore'

interface HistoryListProps {
  onSelectRecord?: (record: HistoryRecord) => void
  maxDisplay?: number
}

const methodIcons: Record<DivinationMethod, string> = {
  ziwei: '⭐',
  bazi: '☯️',
  iching: '🔮',
  tarot: '🃏',
  'western-astro': '🌞',
  'vedic-astro': '🪐',
  numerology: '#',
}

const methodLabels: Record<DivinationMethod, string> = {
  ziwei: '紫微',
  bazi: '八字',
  iching: '易經',
  tarot: '塔羅',
  'western-astro': '西洋占星',
  'vedic-astro': '吠陀占星',
  numerology: '數字命理',
}

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function HistoryList({ onSelectRecord, maxDisplay = 10 }: HistoryListProps) {
  const { records, removeRecord, clearHistory } = useHistoryStore()
  const displayRecords = records.slice(0, maxDisplay)

  if (displayRecords.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 dark:text-gray-500">
        <p className="text-lg">尚無分析記錄</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {displayRecords.map((record) => (
        <div
          key={record.id}
          onClick={() => onSelectRecord?.(record)}
          className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md cursor-pointer transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(record.timestamp)}
              </div>
              <div className="font-medium text-gray-900 dark:text-white truncate">
                {record.birthDate}
              </div>
              <div className="flex flex-wrap gap-1 mt-1">
                {record.selectedMethods.map((method) => (
                  <span
                    key={method}
                    className="inline-flex items-center text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded"
                  >
                    <span className="mr-1">{methodIcons[method]}</span>
                    {methodLabels[method]}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                removeRecord(record.id)
              }}
              className="ml-2 p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
              title="刪除"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}

      {records.length > 0 && (
        <button
          onClick={clearHistory}
          className="w-full mt-4 py-2 px-4 text-sm text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors"
        >
          清除所有記錄
        </button>
      )}
    </div>
  )
}
