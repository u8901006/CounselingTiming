import { ELEMENT_NAMES, ELEMENT_TRAITS } from '../../data/wuxing-therapy';

interface WuxingDisplayProps {
  elementScores: Record<string, number>;
  dominant: string;
  deficient: string;
}

const WUXING_COLORS: Record<string, string> = {
  water: '#2196f3',
  fire: '#f44336',
  wood: '#4caf50',
  earth: '#ffeb3b',
  metal: '#9e9e9e',
};

export function WuxingDisplay({ elementScores, dominant, deficient }: WuxingDisplayProps) {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">五行特質分析</h2>
      <div className="space-y-3">
        {Object.entries(elementScores).map(([element, score]) => (
          <div key={element}>
            <div className="flex justify-between text-sm mb-1">
              <span>{ELEMENT_NAMES[element]}</span>
              <span>{score}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div
                className="h-3 rounded-full"
                style={{ width: `${score}%`, backgroundColor: WUXING_COLORS[element] }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>主導五行：<strong>{ELEMENT_NAMES[dominant]}</strong>（{ELEMENT_TRAITS[dominant]}）</p>
        <p>不足五行：<strong>{ELEMENT_NAMES[deficient]}</strong></p>
      </div>
    </div>
  );
}
