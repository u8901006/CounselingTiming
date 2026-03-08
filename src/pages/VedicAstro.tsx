import React from 'react';
import { SharedInput } from '../components/SharedInput';
import { useUserDataStore } from '../store/userDataStore';
import { calculateVedicAstrology } from '../modules/vedic-astro';

export const VedicAstroPage: React.FC = () => {
  const { data } = useUserDataStore();
  const [showInput, setShowInput] = React.useState(!data);
  const [chart, setChart] = React.useState<ReturnType<typeof calculateVedicAstrology> | null>(null);

  React.useEffect(() => {
    if (data) {
      const result = calculateVedicAstrology(
        data.birthDate.getFullYear(),
        data.birthDate.getMonth() + 1,
        data.birthDate.getDate(),
        data.birthTime.hour,
        data.birthTime.minute,
        data.location.lat,
        data.location.lng
      );
      setChart(result);
      setShowInput(false);
    }
  }, [data]);

  const handleSubmit = () => {
    setShowInput(false);
  };

  if (showInput || !data) {
    return (
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">吠陀占星分析</h1>
        <SharedInput onSubmit={handleSubmit} showLocation={true} />
      </div>
    );
  }

  if (!chart) {
    return <div className="p-4 text-center">計算中...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">吠陀占星分析</h1>
        <button
          onClick={() => setShowInput(true)}
          className="text-blue-600 hover:text-blue-800"
        >
          重新輸入
        </button>
      </div>

      <p className="text-gray-600 mb-6">
        分析對象：<strong>{data.name}</strong>｜出生地點：<strong>{data.location.city}</strong>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">基本資訊</h2>
          <div className="space-y-3">
            <p><strong>月亮星座（Janma Rashi）：</strong>{chart.moonSign}</p>
            <p><strong>上升星座（Lagna）：</strong>{chart.ascendant}</p>
            <p><strong>太陽星座：</strong>{chart.sunSign}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-bold mb-4">月宿（Nakshatra）</h2>
          <div className="space-y-2">
            <p><strong>名稱：</strong>{chart.moonNakshatra.name}</p>
            <p><strong>主星：</strong>{chart.moonNakshatra.lord}</p>
            <p><strong>Pada：</strong>{chart.moonNakshatra.pada}</p>
            <p><strong>度數：</strong>{chart.moonDegree.toFixed(2)}°</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">大運（Mahadasha）</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">主星</th>
                  <th className="py-2 px-4 text-left">開始年份</th>
                  <th className="py-2 px-4 text-left">持續年數</th>
                  <th className="py-2 px-4 text-left">結束年份</th>
                </tr>
              </thead>
              <tbody>
                {chart.dashas.map((dasha, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{dasha.planet}</td>
                    <td className="py-2 px-4">{dasha.startYear}</td>
                    <td className="py-2 px-4">{dasha.duration} 年</td>
                    <td className="py-2 px-4">{dasha.startYear + dasha.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VedicAstroPage;
