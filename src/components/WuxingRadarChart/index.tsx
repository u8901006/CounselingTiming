import { useMemo } from 'react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

interface WuxingRadarChartProps {
  scores: {
    wood: number
    fire: number
    water: number
    earth: number
    metal: number
  }
  dominant?: string
  deficient?: string
  size?: number
}

const ELEMENT_LABELS: Record<string, string> = {
  wood: '木',
  fire: '火',
  earth: '土',
  metal: '金',
  water: '水',
}

const ELEMENT_COLORS: Record<string, string> = {
  wood: '#4caf50',
  fire: '#f44336',
  earth: '#ffeb3b',
  metal: '#9e9e9e',
  water: '#2196f3',
}

export function WuxingRadarChart({
  scores,
  dominant,
  deficient,
  size = 300,
}: WuxingRadarChartProps) {
  const data = useMemo(
    () => [
      { element: '木', score: scores.wood, fullMark: 100, key: 'wood' },
      { element: '火', score: scores.fire, fullMark: 100, key: 'fire' },
      { element: '土', score: scores.earth, fullMark: 100, key: 'earth' },
      { element: '金', score: scores.metal, fullMark: 100, key: 'metal' },
      { element: '水', score: scores.water, fullMark: 100, key: 'water' },
    ],
    [scores]
  )

  const radarColor = dominant ? ELEMENT_COLORS[dominant] || '#3b82f6' : '#3b82f6'
  const strokeColor = dominant ? ELEMENT_COLORS[dominant] || '#1d4ed8' : '#1d4ed8'

  const dominantLabel = dominant ? ELEMENT_LABELS[dominant] : null
  const dominantScore = dominant ? scores[dominant as keyof typeof scores] : 0

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid
            stroke="#9ca3af"
            strokeOpacity={0.5}
            className="dark:stroke-gray-600"
          />
          <PolarAngleAxis
            dataKey="element"
            tick={{ fill: '#374151', fontSize: 14, fontWeight: 500 }}
            className="dark:fill-gray-300"
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#6b7280', fontSize: 10 }}
            tickCount={5}
            className="dark:fill-gray-400"
          />
          <Radar
            name="五行"
            dataKey="score"
            stroke={strokeColor}
            fill={radarColor}
            fillOpacity={0.4}
            strokeWidth={2}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload
                const isDominant = dominant && item.key === dominant
                const isDeficient = deficient && item.key === deficient
                return (
                  <div className="bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {item.element} ({item.key})
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      分數: {item.score}
                    </p>
                    {isDominant && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        ★ 旺
                      </p>
                    )}
                    {isDeficient && (
                      <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                        ▼ 弱
                      </p>
                    )}
                  </div>
                )
              }
              return null
            }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {dominantLabel && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              {dominantLabel}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {dominantScore}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default WuxingRadarChart
