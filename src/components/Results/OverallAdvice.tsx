interface OverallAdviceProps {
  advice: string;
}

export function OverallAdvice({ advice }: OverallAdviceProps) {
  return (
    <div className="card bg-water-light dark:bg-water/10">
      <h2 className="text-xl font-bold mb-4">綜合建議</h2>
      <p className="whitespace-pre-line">{advice}</p>
    </div>
  );
}
