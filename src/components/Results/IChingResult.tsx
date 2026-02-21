import type { DivinationResult } from '../../modules/iching';

interface IChingResultProps {
  result: DivinationResult;
}

export function IChingResult({ result }: IChingResultProps) {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>🔮</span> 易經占卜結果
      </h2>
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
        <div className="text-lg font-medium mb-2">
          第 {result.originalHexagram.number} 卦：{result.originalHexagram.name}卦
        </div>
        <div className="text-gray-600 dark:text-gray-400 mb-4">
          {result.originalHexagram.meaning.general}
        </div>
        {result.changedHexagram && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            變卦：第 {result.changedHexagram.number} 卦 {result.changedHexagram.name}卦
            {result.changingLines.length > 0 && (
              <span>（動爻：第 {result.changingLines.join('、')} 爻）</span>
            )}
          </div>
        )}
      </div>
      <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
        <div className="font-medium mb-2">諮商建議：</div>
        <div className="text-sm whitespace-pre-line">{result.counselingAdvice}</div>
      </div>
    </div>
  );
}
