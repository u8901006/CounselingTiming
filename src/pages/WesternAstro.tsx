import React from 'react';
import { SharedInput } from '../components/SharedInput';
import { useUserDataStore } from '../store/userDataStore';
import { calculateWesternAstrology } from '../modules/western-astro';

const PlanetRow: React.FC<{ planet: ReturnType<typeof calculateWesternAstrology>['planets'][0] }> = ({ planet }) => (
  <tr className="border-b">
    <td className="py-2 px-4">{planet.symbol} {planet.name}</td>
    <td className="py-2 px-4">{planet.sign}</td>
    <td className="py-2 px-4">{planet.degree}° {planet.minute}'</td>
    <td className="py-2 px-4">{planet.retrograde ? '逆行' : ''}</td>
  </tr>
);

export const WesternAstroPage: React.FC = () => {
  const { data } = useUserDataStore();
  const [showInput, setShowInput] = React.useState(!data);
  const [chart, setChart] = React.useState<ReturnType<typeof calculateWesternAstrology> | null>(null);

  React.useEffect(() => {
    if (data) {
      const result = calculateWesternAstrology(
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
        <h1 className="text-2xl font-bold mb-4 text-center">西洋占星分析</h1>
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
        <h1 className="text-2xl font-bold">西洋占星分析</h1>
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
          <h2 className="text-xl font-bold mb-4">行星位置</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 px-4 text-left">行星</th>
                <th className="py-2 px-4 text-left">星座</th>
                <th className="py-2 px-4 text-left">度數</th>
                <th className="py-2 px-4 text-left">狀態</th>
              </tr>
            </thead>
            <tbody>
              {chart.planets.map((planet) => (
                <PlanetRow key={planet.nameEn} planet={planet} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4">重要點位</h2>
            <p><strong>上升星座：</strong>{chart.ascendant.sign} {chart.ascendant.degree}°</p>
            <p><strong>天頂星座：</strong>{chart.midheaven.sign} {chart.midheaven.degree}°</p>
          </div>

          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4">主要相位</h2>
            <div className="space-y-2">
              {chart.aspects.slice(0, 10).map((aspect, index) => (
                <p key={index}>
                  {aspect.planet1} {aspect.type} {aspect.planet2}
                  <span className="text-gray-500 text-sm ml-2">（誤差 {aspect.orb.toFixed(1)}°）</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WesternAstroPage;
