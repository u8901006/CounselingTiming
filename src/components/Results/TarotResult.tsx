import type { TarotReading } from '../../modules/tarot';

interface TarotResultProps {
  reading: TarotReading;
}

export function TarotResult({ reading }: TarotResultProps) {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>🃏</span> 塔羅牌解讀
      </h2>
      <div className="space-y-4 mb-4">
        {reading.cards.map((drawn, index) => (
          <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-water">{drawn.position}</span>
              <span className={`text-sm ${drawn.isReversed ? 'text-orange-500' : 'text-green-600'}`}>
                {drawn.isReversed ? '逆位' : '正位'}
              </span>
            </div>
            <div className="font-medium text-lg mb-1">
              {drawn.card.name}
              {drawn.isReversed && <span className="text-orange-500 ml-2">（逆位）</span>}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {drawn.isReversed ? drawn.card.meaningRev : drawn.card.meaningUp}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
        <div className="font-medium mb-2">心理狀態評估：</div>
        <div className="text-sm mb-2">{reading.psychologicalState.emotionalState}</div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="bg-white dark:bg-gray-800 rounded p-2">
            <div className="text-gray-500 dark:text-gray-400">壓力指數</div>
            <div className="font-bold text-red-500">{reading.psychologicalState.stressLevel}%</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded p-2">
            <div className="text-gray-500 dark:text-gray-400">希望指數</div>
            <div className="font-bold text-green-500">{reading.psychologicalState.hopeLevel}%</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded p-2">
            <div className="text-gray-500 dark:text-gray-400">支持需求</div>
            <div className="font-bold text-blue-500">{reading.psychologicalState.needForSupport}%</div>
          </div>
        </div>
        <div className="mt-4 text-sm whitespace-pre-line">{reading.counselingAdvice}</div>
      </div>
    </div>
  );
}
