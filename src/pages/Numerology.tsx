import React from 'react';
import { SharedInput } from '../components/SharedInput';
import { useUserDataStore } from '../store/userDataStore';
import { calculateNumerology } from '../modules/numerology';

const NUMEROLOGY_MEANINGS: { [key: number]: { title: string; description: string } } = {
  1: { title: '領導者', description: '獨立、創新、有野心' },
  2: { title: '調解者', description: '敏感、外交、合作' },
  3: { title: '溝通者', description: '創意、表達、社交' },
  4: { title: '建構者', description: '務實、穩定、勤奮' },
  5: { title: '自由者', description: '冒險、變化、自由' },
  6: { title: '照護者', description: '責任、愛心、家庭' },
  7: { title: '思考者', description: '分析、靈性、內省' },
  8: { title: '執行者', description: '權力、成功、物質' },
  9: { title: '人道者', description: '慈悲、理想、博愛' },
  11: { title: '啟發者', description: '直覺、靈性、願景' },
  22: { title: '建築大師', description: '實踐理想、大規模成就' },
  33: { title: '療癒大師', description: '無條件的愛、服務人群' },
};

const NumberCard: React.FC<{ label: string; value: number }> = ({ label, value }) => {
  const meaning = NUMEROLOGY_MEANINGS[value] || { title: '', description: '' };
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-sm text-gray-500">{label}</h3>
      <p className="text-4xl font-bold text-blue-600 my-2">{value}</p>
      <p className="text-lg font-medium">{meaning.title}</p>
      <p className="text-sm text-gray-600">{meaning.description}</p>
    </div>
  );
};

export const NumerologyPage: React.FC = () => {
  const { data } = useUserDataStore();
  const [showInput, setShowInput] = React.useState(!data);
  const [result, setResult] = React.useState<ReturnType<typeof calculateNumerology> | null>(null);

  React.useEffect(() => {
    if (data) {
      const numerologyResult = calculateNumerology(
        data.name,
        data.birthDate.getFullYear(),
        data.birthDate.getMonth() + 1,
        data.birthDate.getDate()
      );
      setResult(numerologyResult);
      setShowInput(false);
    }
  }, [data]);

  const handleSubmit = () => {
    setShowInput(false);
  };

  if (showInput || !data) {
    return (
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">數字命理分析</h1>
        <SharedInput onSubmit={handleSubmit} showLocation={false} />
      </div>
    );
  }

  if (!result) {
    return <div className="p-4 text-center">計算中...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">數字命理分析</h1>
        <button
          onClick={() => setShowInput(true)}
          className="text-blue-600 hover:text-blue-800"
        >
          重新輸入
        </button>
      </div>

      <p className="text-gray-600 mb-6">
        分析對象：<strong>{data.name}</strong>
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <NumberCard label="生命靈數" value={result.lifePathNumber} />
        <NumberCard label="命運數" value={result.destinyNumber} />
        <NumberCard label="靈魂數" value={result.soulNumber} />
        <NumberCard label="人格數" value={result.personalityNumber} />
        <NumberCard label="生日數" value={result.birthdayNumber} />
        <NumberCard label="表現數" value={result.expressionNumber} />
      </div>
    </div>
  );
};

export default NumerologyPage;
