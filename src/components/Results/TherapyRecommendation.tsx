import type { TherapyType } from '../../data/wuxing-therapy';

export interface TherapyMatch {
  therapy: TherapyType;
  score: number;
  reasons: string[];
}

interface TherapyRecommendationProps {
  therapies: TherapyMatch[];
}

export function TherapyRecommendation({ therapies }: TherapyRecommendationProps) {
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">諮商取向推薦 TOP 5</h2>
      <div className="space-y-4">
        {therapies.slice(0, 5).map((match, index) => (
          <div key={match.therapy.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-lg font-bold text-gray-400 dark:text-gray-500">#{index + 1}</span>
              <div>
                <div className="font-medium">{match.therapy.name}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{match.therapy.enName}</div>
              </div>
              <div className="ml-auto text-lg font-bold text-water">{match.score}分</div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
              <div
                className="bg-water h-2 rounded-full"
                style={{ width: `${match.score}%` }}
              />
            </div>
            {match.reasons.length > 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {match.reasons.map((r, i) => (
                  <div key={i}>✓ {r}</div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
