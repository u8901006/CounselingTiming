import type { ZiweiResult } from '../../modules/ziwei';

interface ZiweiResultProps {
  ziwei: ZiweiResult;
}

export function ZiweiResult({ ziwei }: ZiweiResultProps) {
  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>⭐</span> 紫微斗數命盤
        </h2>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">農曆</div>
              <div className="font-medium">{ziwei.lunarDate}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">時辰</div>
              <div className="font-medium">{ziwei.time}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">生肖</div>
              <div className="font-medium">{ziwei.chineseZodiac}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">星座</div>
              <div className="font-medium">{ziwei.zodiac}</div>
            </div>
          </div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            四柱：{ziwei.chineseDate}
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-medium mb-3 text-gray-700 dark:text-gray-300">十二宮位</h3>
          <div className="grid grid-cols-4 gap-2">
            {ziwei.palaces.map((palace, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg border text-xs ${
                  palace.name === '命宮'
                    ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700'
                    : palace.isBodyPalace
                    ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700'
                    : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="font-medium text-center mb-1">
                  {palace.name}
                  {palace.isBodyPalace && <span className="text-amber-600 dark:text-amber-400">（身）</span>}
                </div>
                <div className="flex flex-wrap gap-1 justify-center">
                  {palace.majorStars.slice(0, 3).map((star, j) => (
                    <span
                      key={j}
                      className={`px-1 rounded text-xs ${
                        star.mutagen === '忌'
                          ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                          : star.mutagen === '祿'
                          ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                          : star.mutagen === '權'
                          ? 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300'
                          : star.mutagen === '科'
                          ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {star.name}
                      {star.mutagen && <span className="text-xs">化{star.mutagen}</span>}
                    </span>
                  ))}
                  {palace.majorStars.length > 3 && (
                    <span className="text-gray-400 dark:text-gray-500">+{palace.majorStars.length - 3}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {ziwei.patterns.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold mb-3">格局分析</h3>
          <div className="space-y-3">
            {ziwei.patterns.map((pattern, i) => (
              <div key={i} className="bg-amber-50 dark:bg-amber-900/30 rounded-lg p-3">
                <div className="font-medium text-amber-800 dark:text-amber-300">{pattern.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">{pattern.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="text-lg font-bold mb-3">主星亮度與吉凶分析</h3>
        <div className="text-sm whitespace-pre-line bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          {ziwei.starBrightnessAnalysis}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold mb-3">四化分析</h3>
        <div className="text-sm whitespace-pre-line bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4">
          {ziwei.mutagenAnalysis}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold mb-3">本命：命宮各星說明</h3>
        <div className="text-sm whitespace-pre-line bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
          {ziwei.lifePalaceDetail}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold mb-3">命盤解讀</h3>
        <div className="text-sm whitespace-pre-line bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          {ziwei.lifeAnalysis}
        </div>
      </div>

      <div className="card bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30">
        <h3 className="text-lg font-bold mb-3">諮商建議</h3>
        <div className="text-sm whitespace-pre-line">{ziwei.counselingAdvice}</div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold mb-3">三方四正分析</h3>
        <div className="text-sm whitespace-pre-line bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
          {ziwei.sanfangAnalysis}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold mb-3">煞星與吉星分析</h3>
        <div className="text-sm whitespace-pre-line bg-amber-50 dark:bg-amber-900/30 rounded-lg p-4">
          {ziwei.shaStarsAnalysis}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold mb-3">性格綜合分析</h3>
        <div className="text-sm whitespace-pre-line bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
          {ziwei.personalityAnalysis}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold mb-3">大限運勢</h3>
        <div className="text-sm whitespace-pre-line bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4">
          {ziwei.currentDaXian}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold mb-3">十二宮位詳細解讀</h3>
        <div className="text-sm whitespace-pre-line bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
          {ziwei.allPalaceAnalysis}
        </div>
      </div>
    </div>
  );
}
