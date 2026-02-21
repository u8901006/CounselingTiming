export interface TimingFactor {
  description: string;
  impact: number;
}

interface TimingScoreProps {
  score: number;
  level: string;
  factors: TimingFactor[];
}

export function TimingScore({ score, level, factors }: TimingScoreProps) {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">諮商時機評估</h2>
      <div className="flex items-center gap-4 mb-4">
        <div className="text-4xl font-bold text-water">{score}</div>
        <div>
          <div className="text-lg font-medium">{level}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">滿分 100</div>
        </div>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-4">
        <div
          className="bg-water h-4 rounded-full transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
      {factors.length > 0 && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {factors.map((f, i) => (
            <div key={i} className="flex justify-between py-1">
              <span>{f.description}</span>
              <span className={f.impact > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                {f.impact > 0 ? '+' : ''}{f.impact}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
