import React, { useState, useEffect } from 'react';
import { useUserDataStore } from '../../store/userDataStore';
import { SharedInputProps } from './types';

const TAIWAN_CITIES = [
  { name: '台北市', lat: 25.0330, lng: 121.5654 },
  { name: '新北市', lat: 25.0122, lng: 121.4654 },
  { name: '桃園市', lat: 24.9936, lng: 121.3010 },
  { name: '台中市', lat: 24.1477, lng: 120.6736 },
  { name: '台南市', lat: 22.9999, lng: 120.2269 },
  { name: '高雄市', lat: 22.6273, lng: 120.3014 },
];

export const SharedInput: React.FC<SharedInputProps> = ({ 
  onSubmit,
  showLocation = true 
}) => {
  const { data, setData } = useUserDataStore();
  
  const [name, setName] = useState(data?.name || '');
  const [gender, setGender] = useState<'male' | 'female'>(data?.gender || 'male');
  const [birthYear, setBirthYear] = useState(data?.birthDate?.getFullYear() || 1990);
  const [birthMonth, setBirthMonth] = useState((data?.birthDate?.getMonth() || 0) + 1);
  const [birthDay, setBirthDay] = useState(data?.birthDate?.getDate() || 1);
  const [birthHour, setBirthHour] = useState(data?.birthTime?.hour || 12);
  const [birthMinute, setBirthMinute] = useState(data?.birthTime?.minute || 0);
  const [city, setCity] = useState(data?.location?.city || '台北市');
  const [lat, setLat] = useState(data?.location?.lat || 25.0330);
  const [lng, setLng] = useState(data?.location?.lng || 121.5654);

  useEffect(() => {
    if (data) {
      setName(data.name);
      setGender(data.gender);
      setBirthYear(data.birthDate.getFullYear());
      setBirthMonth(data.birthDate.getMonth() + 1);
      setBirthDay(data.birthDate.getDate());
      setBirthHour(data.birthTime.hour);
      setBirthMinute(data.birthTime.minute);
      setCity(data.location.city);
      setLat(data.location.lat);
      setLng(data.location.lng);
    }
  }, [data]);

  const handleCityChange = (cityName: string) => {
    const selected = TAIWAN_CITIES.find(c => c.name === cityName);
    if (selected) {
      setCity(selected.name);
      setLat(selected.lat);
      setLng(selected.lng);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    setData({
      name,
      gender,
      birthDate: new Date(birthYear, birthMonth - 1, birthDay),
      birthTime: { hour: birthHour, minute: birthMinute },
      location: { city, lat, lng },
    });
    
    onSubmit?.();
  };

  const years = Array.from({ length: 100 }, (_, i) => 2026 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
      <h2 className="text-xl font-bold mb-4">基本資料</h2>
      
      <div>
        <label className="block text-sm font-medium mb-1">姓名</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">性別</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              checked={gender === 'male'}
              onChange={() => setGender('male')}
              className="mr-2"
            />
            男
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              checked={gender === 'female'}
              onChange={() => setGender('female')}
              className="mr-2"
            />
            女
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">出生日期</label>
        <div className="flex gap-2">
          <select
            value={birthYear}
            onChange={(e) => setBirthYear(Number(e.target.value))}
            className="border rounded px-3 py-2"
          >
            {years.map(y => (
              <option key={y} value={y}>{y} 年</option>
            ))}
          </select>
          <select
            value={birthMonth}
            onChange={(e) => setBirthMonth(Number(e.target.value))}
            className="border rounded px-3 py-2"
          >
            {months.map(m => (
              <option key={m} value={m}>{m} 月</option>
            ))}
          </select>
          <select
            value={birthDay}
            onChange={(e) => setBirthDay(Number(e.target.value))}
            className="border rounded px-3 py-2"
          >
            {days.map(d => (
              <option key={d} value={d}>{d} 日</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">出生時間</label>
        <div className="flex gap-2 items-center">
          <select
            value={birthHour}
            onChange={(e) => setBirthHour(Number(e.target.value))}
            className="border rounded px-3 py-2"
          >
            {hours.map(h => (
              <option key={h} value={h}>{h.toString().padStart(2, '0')}</option>
            ))}
          </select>
          <span>:</span>
          <select
            value={birthMinute}
            onChange={(e) => setBirthMinute(Number(e.target.value))}
            className="border rounded px-3 py-2"
          >
            {[0, 15, 30, 45].map(m => (
              <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
            ))}
          </select>
        </div>
      </div>

      {showLocation && (
        <div>
          <label className="block text-sm font-medium mb-1">出生地點</label>
          <select
            value={city}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            {TAIWAN_CITIES.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        儲存並分析
      </button>
    </form>
  );
};

export default SharedInput;
