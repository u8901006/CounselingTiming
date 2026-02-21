import type { YearlyFortune, MonthlyFortune } from '../../modules/ziwei';

interface YearlyFortuneCardProps {
  fortune: YearlyFortune | null;
  monthlyFortunes?: MonthlyFortune[];
}

export default function YearlyFortuneCard({ fortune, monthlyFortunes }: YearlyFortuneCardProps) {
  if (!fortune) return null;

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
          <span>📅</span> {fortune.year} 年運勢（{fortune.age}歲）
        </h3>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">流年命宮</div>
            <div className="font-medium text-lg">{fortune.palaceName}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="text-sm text-gray-500 dark:text-gray-400">化祿 / 化忌</div>
            <div className="flex gap-2 mt-1">
              <span className={fortune.hasLu ? 'text-green-500 font-medium' : 'text-gray-400'}>
                {fortune.hasLu ? '✓ 祿' : '✗ 祿'}
              </span>
              <span className={fortune.hasJi ? 'text-red-500 font-medium' : 'text-gray-400'}>
                {fortune.hasJi ? '✓ 忌' : '✗ 忌'}
              </span>
            </div>
          </div>
        </div>

        {fortune.majorStars.length > 0 && (
          <div className="mb-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">流年主星</div>
            <div className="flex flex-wrap gap-2">
              {fortune.majorStars.map((star, i) => (
                <span
                  key={i}
                  className={`px-2 py-1 rounded text-sm ${
                    star.mutagen === '忌'
                      ? 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300'
                      : star.mutagen === '祿'
                      ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                      : 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
                  }`}
                >
                  {star.name}
                  {star.brightness && <span className="text-xs ml-1">({star.brightness})</span>}
                  {star.mutagen && <span className="text-xs ml-1">化{star.mutagen}</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm whitespace-pre-line bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
          {fortune.summary}
        </div>

        <div className="text-sm bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
          <div className="font-medium mb-2 text-blue-800 dark:text-blue-300">諮商建議</div>
          <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{fortune.advice}</div>
        </div>
      </div>

      {monthlyFortunes && monthlyFortunes.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold mb-3">流月運勢</h3>
          <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
            {monthlyFortunes.map((mf) => (
              <div
                key={mf.month}
                className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 text-center"
              >
                <div className="font-medium text-sm">{mf.month}月</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{mf.palaceName}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
