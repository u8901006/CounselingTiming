import type { BaziResult } from '../../modules/ziwei';
import { ELEMENT_NAMES } from '../../data/wuxing-therapy';

interface BaziResultProps {
  bazi: BaziResult;
}

const WUXING_COLORS: Record<string, string> = {
  water: '#2196f3',
  fire: '#f44336',
  wood: '#4caf50',
  earth: '#ffeb3b',
  metal: '#9e9e9e',
};

export function BaziResult({ bazi }: BaziResultProps) {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>☯️</span> 八字四柱分析
      </h2>
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">年柱</div>
          <div className="text-xl font-bold">{bazi.yearPillar}</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">月柱</div>
          <div className="text-xl font-bold">{bazi.monthPillar}</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">日柱</div>
          <div className="text-xl font-bold">{bazi.dayPillar}</div>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">時柱</div>
          <div className="text-xl font-bold">{bazi.hourPillar}</div>
        </div>
      </div>
      <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
        <div className="text-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">日主（命主）</span>
          <span className="text-2xl font-bold ml-2">{bazi.dayMaster}</span>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        {Object.entries(bazi.wuxingScores).map(([element, score]) => (
          <div key={element}>
            <div className="flex justify-between text-sm mb-1">
              <span>{ELEMENT_NAMES[element]}</span>
              <span>{score}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${score}%`,
                  backgroundColor: WUXING_COLORS[element],
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
        <div className="font-medium mb-2">八字解讀</div>
        <div className="text-sm whitespace-pre-line">{bazi.analysis}</div>
      </div>
    </div>
  );
}
