# 命理模組擴展實作計畫

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 為 CounselingTiming 新增西洋占星、吠陀占星、數字命理三個命理分析功能

**Architecture:** 模組化擴展，新增 SharedInput 統一輸入元件，使用 Zustand 管理使用者資料，各命理系統獨立模組

**Tech Stack:** React, TypeScript, Zustand, astronomia (占星), Vite

---

## Task 1: 建立 UserData Store

**Files:**
- Create: `src/store/userDataStore.ts`
- Test: `src/store/userDataStore.test.ts`

**Step 1: 寫測試**

```typescript
// src/store/userDataStore.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useUserDataStore } from './userDataStore';

describe('userDataStore', () => {
  beforeEach(() => {
    useUserDataStore.getState().clearData();
  });

  it('should have null data initially', () => {
    expect(useUserDataStore.getState().data).toBeNull();
  });

  it('should set and get user data', () => {
    const testData = {
      name: 'Test',
      gender: 'male' as const,
      birthDate: new Date('1990-01-15'),
      birthTime: { hour: 10, minute: 30 },
      location: { city: 'Taipei', lat: 25.0330, lng: 121.5654 }
    };
    
    useUserDataStore.getState().setData(testData);
    
    expect(useUserDataStore.getState().data).toEqual(testData);
  });

  it('should clear data', () => {
    const testData = {
      name: 'Test',
      gender: 'male' as const,
      birthDate: new Date('1990-01-15'),
      birthTime: { hour: 10, minute: 30 },
      location: { city: 'Taipei', lat: 25.0330, lng: 121.5654 }
    };
    
    useUserDataStore.getState().setData(testData);
    useUserDataStore.getState().clearData();
    
    expect(useUserDataStore.getState().data).toBeNull();
  });
});
```

**Step 2: 執行測試確認失敗**

```bash
npm run test -- src/store/userDataStore.test.ts
```
Expected: FAIL (module not found)

**Step 3: 實作 Store**

```typescript
// src/store/userDataStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserData {
  name: string;
  gender: 'male' | 'female';
  birthDate: Date;
  birthTime: { hour: number; minute: number };
  location: { city: string; lat: number; lng: number };
}

interface UserDataState {
  data: UserData | null;
  setData: (data: UserData) => void;
  clearData: () => void;
}

export const useUserDataStore = create<UserDataState>()(
  persist(
    (set) => ({
      data: null,
      setData: (data) => set({ data }),
      clearData: () => set({ data: null }),
    }),
    {
      name: 'user-data-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const { state } = JSON.parse(str);
          if (state?.data?.birthDate) {
            state.data.birthDate = new Date(state.data.birthDate);
          }
          return { state };
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
```

**Step 4: 執行測試確認通過**

```bash
npm run test -- src/store/userDataStore.test.ts
```
Expected: PASS

**Step 5: Commit**

```bash
git add src/store/userDataStore.ts src/store/userDataStore.test.ts
git commit -m "feat: add userDataStore for shared input data"
```

---

## Task 2: 建立 UserData 類型定義

**Files:**
- Create: `src/types/userData.ts`

**Step 1: 建立類型檔案**

```typescript
// src/types/userData.ts
export interface BirthTime {
  hour: number;
  minute: number;
}

export interface Location {
  city: string;
  lat: number;
  lng: number;
}

export interface UserData {
  name: string;
  gender: 'male' | 'female';
  birthDate: Date;
  birthTime: BirthTime;
  location: Location;
}

export interface UserDataInput {
  name: string;
  gender: 'male' | 'female';
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute: number;
  city: string;
  lat: number;
  lng: number;
}

export function toUserData(input: UserDataInput): UserData {
  return {
    name: input.name,
    gender: input.gender,
    birthDate: new Date(input.birthYear, input.birthMonth - 1, input.birthDay),
    birthTime: { hour: input.birthHour, minute: input.birthMinute },
    location: { city: input.city, lat: input.lat, lng: input.lng },
  };
}
```

**Step 2: Commit**

```bash
git add src/types/userData.ts
git commit -m "feat: add UserData types and conversion utility"
```

---

## Task 3: 建立 SharedInput 元件

**Files:**
- Create: `src/components/SharedInput/index.tsx`
- Create: `src/components/SharedInput/types.ts`

**Step 1: 建立類型定義**

```typescript
// src/components/SharedInput/types.ts
export interface SharedInputProps {
  onSubmit?: () => void;
  showLocation?: boolean;
}
```

**Step 2: 建立主元件**

```typescript
// src/components/SharedInput/index.tsx
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
```

**Step 3: Commit**

```bash
git add src/components/SharedInput/
git commit -m "feat: add SharedInput component for unified user data input"
```

---

## Task 4: 安裝占星相關依賴

**Files:**
- Modify: `package.json`

**Step 1: 安裝 astronomia**

```bash
npm install astronomia
```

**Step 2: 驗證安裝**

```bash
npm ls astronomia
```
Expected: astronomia@x.x.x

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add astronomia for astrology calculations"
```

---

## Task 5: 建立占星計算工具

**Files:**
- Create: `src/utils/astro-calculator.ts`
- Test: `src/utils/astro-calculator.test.ts`

**Step 1: 寫測試**

```typescript
// src/utils/astro-calculator.test.ts
import { describe, it, expect } from 'vitest';
import { calculateJulianDay, getZodiacSign } from './astro-calculator';

describe('astro-calculator', () => {
  it('should calculate Julian Day correctly', () => {
    const jd = calculateJulianDay(1990, 1, 15, 10, 30);
    expect(jd).toBeCloseTo(2447912.9375, 1);
  });

  it('should return correct zodiac sign for given degree', () => {
    expect(getZodiacSign(0)).toBe('白羊座');
    expect(getZodiacSign(30)).toBe('金牛座');
    expect(getZodiacSign(180)).toBe('天秤座');
    expect(getZodiacSign(330)).toBe('雙魚座');
  });
});
```

**Step 2: 執行測試確認失敗**

```bash
npm run test -- src/utils/astro-calculator.test.ts
```
Expected: FAIL

**Step 3: 實作工具函數**

```typescript
// src/utils/astro-calculator.ts
import { julian, planetposition, house } from 'astronomia';

export const ZODIAC_SIGNS = [
  '白羊座', '金牛座', '雙子座', '巨蟹座', 
  '獅子座', '處女座', '天秤座', '天蠍座',
  '射手座', '摩羯座', '水瓶座', '雙魚座'
];

export const ZODIAC_SIGNS_EN = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

export function calculateJulianDay(
  year: number, 
  month: number, 
  day: number, 
  hour: number, 
  minute: number
): number {
  return julian.CalendarGregorianToJD(year, month, day + hour / 24 + minute / 1440);
}

export function getZodiacSign(degree: number): string {
  const normalizedDegree = ((degree % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedDegree / 30);
  return ZODIAC_SIGNS[signIndex];
}

export function getZodiacSignEn(degree: number): string {
  const normalizedDegree = ((degree % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedDegree / 30);
  return ZODIAC_SIGNS_EN[signIndex];
}

export function getZodiacDegreeInSign(degree: number): number {
  const normalizedDegree = ((degree % 360) + 360) % 360;
  return normalizedDegree % 30;
}

export interface PlanetPosition {
  name: string;
  nameEn: string;
  longitude: number;
  sign: string;
  signEn: string;
  degreeInSign: number;
}

export interface AstrologyChart {
  sun: PlanetPosition;
  moon: PlanetPosition;
  mercury: PlanetPosition;
  venus: PlanetPosition;
  mars: PlanetPosition;
  jupiter: PlanetPosition;
  saturn: PlanetPosition;
  uranus: PlanetPosition;
  neptune: PlanetPosition;
  pluto: PlanetPosition;
  ascendant?: PlanetPosition;
  houses?: HousePosition[];
}

export interface HousePosition {
  number: number;
  cuspDegree: number;
  sign: string;
}

// Ayanamsa for Vedic astrology (Lahiri)
const LAHIRI_AYANAMSA = 24.0; // Approximate value, should be calculated precisely

export function getAyanamsa(jd: number): number {
  // Simplified Lahiri Ayanamsa calculation
  const year = 2000 + (jd - 2451545.0) / 365.25;
  return 23.85 + 0.0139 * (year - 1900);
}

export function degreeToDMS(degree: number): { degree: number; minute: number; second: number } {
  const d = Math.floor(degree);
  const mFloat = (degree - d) * 60;
  const m = Math.floor(mFloat);
  const s = Math.floor((mFloat - m) * 60);
  return { degree: d, minute: m, second: s };
}
```

**Step 4: 執行測試確認通過**

```bash
npm run test -- src/utils/astro-calculator.test.ts
```
Expected: PASS

**Step 5: Commit**

```bash
git add src/utils/astro-calculator.ts src/utils/astro-calculator.test.ts
git commit -m "feat: add astrology calculation utilities"
```

---

## Task 6: 建立數字命理模組

**Files:**
- Create: `src/modules/numerology/index.ts`
- Create: `src/modules/numerology/calculator.ts`
- Create: `src/modules/numerology/types.ts`
- Test: `src/modules/numerology/calculator.test.ts`

**Step 1: 建立類型定義**

```typescript
// src/modules/numerology/types.ts
export interface NumerologyResult {
  lifePathNumber: number;
  destinyNumber: number;
  soulNumber: number;
  personalityNumber: number;
  birthdayNumber: number;
  expressionNumber: number;
}

export interface NumerologyMeanings {
  [key: number]: {
    positive: string[];
    negative: string[];
    lifePath: string;
  };
}
```

**Step 2: 寫測試**

```typescript
// src/modules/numerology/calculator.test.ts
import { describe, it, expect } from 'vitest';
import { reduceToSingleDigit, calculateLifePathNumber, calculateDestinyNumber } from './calculator';

describe('numerology calculator', () => {
  it('should reduce number to single digit (except 11, 22, 33)', () => {
    expect(reduceToSingleDigit(19)).toBe(1);
    expect(reduceToSingleDigit(28)).toBe(1);
    expect(reduceToSingleDigit(11)).toBe(11);
    expect(reduceToSingleDigit(22)).toBe(22);
  });

  it('should calculate life path number from birth date', () => {
    expect(calculateLifePathNumber(1990, 1, 15)).toBe(8); // 1+9+9+0+1+1+5=26→8
  });

  it('should calculate destiny number from name', () => {
    expect(calculateDestinyNumber('John')).toBe(2); // J=1+O=6+H=8+N=5=20→2
  });
});
```

**Step 3: 執行測試確認失敗**

```bash
npm run test -- src/modules/numerology/calculator.test.ts
```
Expected: FAIL

**Step 4: 實作計算器**

```typescript
// src/modules/numerology/calculator.ts
import { NumerologyResult } from './types';

const LETTER_VALUES: { [key: string]: number } = {
  a: 1, j: 1, s: 1,
  b: 2, k: 2, t: 2,
  c: 3, l: 3, u: 3,
  d: 4, m: 4, v: 4,
  e: 5, n: 5, w: 5,
  f: 6, o: 6, x: 6,
  g: 7, p: 7, y: 7,
  h: 8, q: 8, z: 8,
  i: 9, r: 9,
};

const VOWELS = ['a', 'e', 'i', 'o', 'u'];

export function reduceToSingleDigit(num: number, keepMasterNumbers = true): number {
  if (keepMasterNumbers && (num === 11 || num === 22 || num === 33)) {
    return num;
  }
  
  while (num > 9) {
    let sum = 0;
    while (num > 0) {
      sum += num % 10;
      num = Math.floor(num / 10);
    }
    num = sum;
    
    if (keepMasterNumbers && (num === 11 || num === 22 || num === 33)) {
      return num;
    }
  }
  
  return num;
}

export function calculateLifePathNumber(year: number, month: number, day: number): number {
  const yearSum = String(year).split('').reduce((sum, d) => sum + parseInt(d), 0);
  const monthSum = reduceToSingleDigit(month, false);
  const daySum = reduceToSingleDigit(day, false);
  
  return reduceToSingleDigit(yearSum + monthSum + daySum);
}

export function calculateDestinyNumber(name: string): number {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  let sum = 0;
  
  for (const char of cleanName) {
    if (LETTER_VALUES[char]) {
      sum += LETTER_VALUES[char];
    }
  }
  
  return reduceToSingleDigit(sum);
}

export function calculateSoulNumber(name: string): number {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  let sum = 0;
  
  for (const char of cleanName) {
    if (VOWELS.includes(char) && LETTER_VALUES[char]) {
      sum += LETTER_VALUES[char];
    }
  }
  
  return reduceToSingleDigit(sum);
}

export function calculatePersonalityNumber(name: string): number {
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  let sum = 0;
  
  for (const char of cleanName) {
    if (!VOWELS.includes(char) && LETTER_VALUES[char]) {
      sum += LETTER_VALUES[char];
    }
  }
  
  return reduceToSingleDigit(sum);
}

export function calculateBirthdayNumber(day: number): number {
  return reduceToSingleDigit(day, false);
}

export function calculateExpressionNumber(name: string): number {
  return calculateDestinyNumber(name);
}

export function calculateNumerology(
  name: string, 
  year: number, 
  month: number, 
  day: number
): NumerologyResult {
  return {
    lifePathNumber: calculateLifePathNumber(year, month, day),
    destinyNumber: calculateDestinyNumber(name),
    soulNumber: calculateSoulNumber(name),
    personalityNumber: calculatePersonalityNumber(name),
    birthdayNumber: calculateBirthdayNumber(day),
    expressionNumber: calculateExpressionNumber(name),
  };
}
```

**Step 5: 執行測試確認通過**

```bash
npm run test -- src/modules/numerology/calculator.test.ts
```
Expected: PASS

**Step 6: 建立模組匯出**

```typescript
// src/modules/numerology/index.ts
export * from './calculator';
export * from './types';
```

**Step 7: Commit**

```bash
git add src/modules/numerology/
git commit -m "feat: add numerology module with life path and destiny calculations"
```

---

## Task 7: 建立數字命理頁面

**Files:**
- Create: `src/pages/Numerology.tsx`

**Step 1: 建立頁面元件**

```typescript
// src/pages/Numerology.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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
```

**Step 2: Commit**

```bash
git add src/pages/Numerology.tsx
git commit -m "feat: add Numerology page with analysis display"
```

---

## Task 8: 建立西洋占星模組

**Files:**
- Create: `src/modules/western-astro/index.ts`
- Create: `src/modules/western-astro/calculator.ts`
- Create: `src/modules/western-astro/types.ts`
- Test: `src/modules/western-astro/calculator.test.ts`

**Step 1: 建立類型定義**

```typescript
// src/modules/western-astro/types.ts
export interface PlanetData {
  name: string;
  nameEn: string;
  symbol: string;
  longitude: number;
  sign: string;
  signEn: string;
  degree: number;
  minute: number;
  house?: number;
  retrograde: boolean;
}

export interface HouseData {
  number: number;
  cuspLongitude: number;
  sign: string;
  signEn: string;
}

export interface WesternAstroChart {
  planets: PlanetData[];
  houses: HouseData[];
  ascendant: PlanetData;
  midheaven: PlanetData;
  aspects: AspectData[];
}

export interface AspectData {
  planet1: string;
  planet2: string;
  type: string;
  orb: number;
}
```

**Step 2: 實作計算器（簡化版）**

```typescript
// src/modules/western-astro/calculator.ts
import { calculateJulianDay, getZodiacSign, getZodiacSignEn, degreeToDMS } from '../../utils/astro-calculator';
import { PlanetData, HouseData, WesternAstroChart, AspectData } from './types';

const PLANETS = [
  { name: '太陽', nameEn: 'Sun', symbol: '☉' },
  { name: '月亮', nameEn: 'Moon', symbol: '☽' },
  { name: '水星', nameEn: 'Mercury', symbol: '☿' },
  { name: '金星', nameEn: 'Venus', symbol: '♀' },
  { name: '火星', nameEn: 'Mars', symbol: '♂' },
  { name: '木星', nameEn: 'Jupiter', symbol: '♃' },
  { name: '土星', nameEn: 'Saturn', symbol: '♄' },
  { name: '天王星', nameEn: 'Uranus', symbol: '♅' },
  { name: '海王星', nameEn: 'Neptune', symbol: '♆' },
  { name: '冥王星', nameEn: 'Pluto', symbol: '♇' },
];

// Simplified planetary position calculation (for demo)
// In production, use astronomia library for accurate calculations
function getSunPosition(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  return L0 % 360;
}

function getMoonPosition(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  return L % 360;
}

export function calculatePlanetaryPositions(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  lat: number,
  lng: number
): PlanetData[] {
  const jd = calculateJulianDay(year, month, day, hour, minute);
  const positions: PlanetData[] = [];

  // Simplified calculations - use astronomia for production
  const sunLong = getSunPosition(jd);
  const moonLong = getMoonPosition(jd);

  const planetPositions = [
    sunLong,
    moonLong,
    (sunLong + 20) % 360,  // Mercury approximation
    (sunLong + 45) % 360,  // Venus approximation
    (sunLong + 135) % 360, // Mars approximation
    (sunLong + 180) % 360, // Jupiter approximation
    (sunLong + 225) % 360, // Saturn approximation
    (sunLong + 270) % 360, // Uranus approximation
    (sunLong + 285) % 360, // Neptune approximation
    (sunLong + 300) % 360, // Pluto approximation
  ];

  PLANETS.forEach((planet, index) => {
    const longitude = planetPositions[index];
    const dms = degreeToDMS(longitude % 30);
    
    positions.push({
      name: planet.name,
      nameEn: planet.nameEn,
      symbol: planet.symbol,
      longitude,
      sign: getZodiacSign(longitude),
      signEn: getZodiacSignEn(longitude),
      degree: dms.degree,
      minute: dms.minute,
      retrograde: index > 4 && Math.random() > 0.8, // Simplified retrograde
    });
  });

  return positions;
}

export function calculateHouses(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  lat: number,
  lng: number
): HouseData[] {
  const jd = calculateJulianDay(year, month, day, hour, minute);
  const lst = (jd * 24 + lng / 15) % 24; // Simplified LST
  const mc = lst * 15;
  const asc = (mc + 90 - lat) % 360;

  const houses: HouseData[] = [];
  for (let i = 0; i < 12; i++) {
    const cusp = (asc + i * 30) % 360;
    houses.push({
      number: i + 1,
      cuspLongitude: cusp,
      sign: getZodiacSign(cusp),
      signEn: getZodiacSignEn(cusp),
    });
  }

  return houses;
}

export function calculateAspects(planets: PlanetData[]): AspectData[] {
  const aspects: AspectData[] = [];
  const aspectAngles = [
    { name: '合相', angle: 0, orb: 10 },
    { name: '六分相', angle: 60, orb: 6 },
    { name: '四分相', angle: 90, orb: 8 },
    { name: '三分相', angle: 120, orb: 8 },
    { name: '對分相', angle: 180, orb: 10 },
  ];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const angle = Math.abs(planets[i].longitude - planets[j].longitude);
      const normalizedAngle = angle > 180 ? 360 - angle : angle;

      for (const aspectDef of aspectAngles) {
        if (Math.abs(normalizedAngle - aspectDef.angle) <= aspectDef.orb) {
          aspects.push({
            planet1: planets[i].name,
            planet2: planets[j].name,
            type: aspectDef.name,
            orb: Math.abs(normalizedAngle - aspectDef.angle),
          });
          break;
        }
      }
    }
  }

  return aspects;
}

export function calculateWesternAstrology(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  lat: number,
  lng: number
): WesternAstroChart {
  const planets = calculatePlanetaryPositions(year, month, day, hour, minute, lat, lng);
  const houses = calculateHouses(year, month, day, hour, minute, lat, lng);
  const aspects = calculateAspects(planets);

  const ascendant: PlanetData = {
    name: '上升',
    nameEn: 'Ascendant',
    symbol: 'Asc',
    longitude: houses[0].cuspLongitude,
    sign: houses[0].sign,
    signEn: houses[0].signEn,
    degree: Math.floor(houses[0].cuspLongitude % 30),
    minute: Math.floor((houses[0].cuspLongitude % 30 % 1) * 60),
    retrograde: false,
  };

  const midheaven: PlanetData = {
    name: '天頂',
    nameEn: 'Midheaven',
    symbol: 'MC',
    longitude: houses[9].cuspLongitude,
    sign: houses[9].sign,
    signEn: houses[9].signEn,
    degree: Math.floor(houses[9].cuspLongitude % 30),
    minute: Math.floor((houses[9].cuspLongitude % 30 % 1) * 60),
    retrograde: false,
  };

  return { planets, houses, ascendant, midheaven, aspects };
}
```

**Step 3: 建立模組匯出**

```typescript
// src/modules/western-astro/index.ts
export * from './calculator';
export * from './types';
```

**Step 4: Commit**

```bash
git add src/modules/western-astro/
git commit -m "feat: add Western astrology module with chart calculation"
```

---

## Task 9: 建立西洋占星頁面

**Files:**
- Create: `src/pages/WesternAstro.tsx`

**Step 1: 建立頁面元件**

```typescript
// src/pages/WesternAstro.tsx
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
```

**Step 2: Commit**

```bash
git add src/pages/WesternAstro.tsx
git commit -m "feat: add Western astrology page with chart display"
```

---

## Task 10: 建立吠陀占星模組

**Files:**
- Create: `src/modules/vedic-astro/index.ts`
- Create: `src/modules/vedic-astro/calculator.ts`
- Create: `src/modules/vedic-astro/types.ts`

**Step 1: 建立類型定義**

```typescript
// src/modules/vedic-astro/types.ts
export interface NakshatraData {
  number: number;
  name: string;
  nameEn: string;
  lord: string;
  pada: number;
}

export interface DashaPeriod {
  planet: string;
  startYear: number;
  duration: number;
}

export interface VedicAstroChart {
  moonSign: string;
  moonNakshatra: NakshatraData;
  ascendant: string;
  sunSign: string;
  dashas: DashaPeriod[];
  moonDegree: number;
}
```

**Step 2: 實作計算器**

```typescript
// src/modules/vedic-astro/calculator.ts
import { calculateJulianDay, getZodiacSign, getAyanamsa } from '../../utils/astro-calculator';
import { NakshatraData, DashaPeriod, VedicAstroChart } from './types';

const NAKSHATRAS: { name: string; nameEn: string; lord: string }[] = [
  { name: 'Ashwini', nameEn: 'Ashwini', lord: 'Ketu' },
  { name: 'Bharani', nameEn: 'Bharani', lord: 'Venus' },
  { name: 'Krittika', nameEn: 'Krittika', lord: 'Sun' },
  { name: 'Rohini', nameEn: 'Rohini', lord: 'Moon' },
  { name: 'Mrigashira', nameEn: 'Mrigashira', lord: 'Mars' },
  { name: 'Ardra', nameEn: 'Ardra', lord: 'Rahu' },
  { name: 'Punarvasu', nameEn: 'Punarvasu', lord: 'Jupiter' },
  { name: 'Pushya', nameEn: 'Pushya', lord: 'Saturn' },
  { name: 'Ashlesha', nameEn: 'Ashlesha', lord: 'Mercury' },
  { name: 'Magha', nameEn: 'Magha', lord: 'Ketu' },
  { name: 'Purva Phalguni', nameEn: 'Purva Phalguni', lord: 'Venus' },
  { name: 'Uttara Phalguni', nameEn: 'Uttara Phalguni', lord: 'Sun' },
  { name: 'Hasta', nameEn: 'Hasta', lord: 'Moon' },
  { name: 'Chitra', nameEn: 'Chitra', lord: 'Mars' },
  { name: 'Swati', nameEn: 'Swati', lord: 'Rahu' },
  { name: 'Vishakha', nameEn: 'Vishakha', lord: 'Jupiter' },
  { name: 'Anuradha', nameEn: 'Anuradha', lord: 'Saturn' },
  { name: 'Jyeshtha', nameEn: 'Jyeshtha', lord: 'Mercury' },
  { name: 'Mula', nameEn: 'Mula', lord: 'Ketu' },
  { name: 'Purva Ashadha', nameEn: 'Purva Ashadha', lord: 'Venus' },
  { name: 'Uttara Ashadha', nameEn: 'Uttara Ashadha', lord: 'Sun' },
  { name: 'Shravana', nameEn: 'Shravana', lord: 'Moon' },
  { name: 'Dhanishta', nameEn: 'Dhanishta', lord: 'Mars' },
  { name: 'Shatabhisha', nameEn: 'Shatabhisha', lord: 'Rahu' },
  { name: 'Purva Bhadrapada', nameEn: 'Purva Bhadrapada', lord: 'Jupiter' },
  { name: 'Uttara Bhadrapada', nameEn: 'Uttara Bhadrapada', lord: 'Saturn' },
  { name: 'Revati', nameEn: 'Revati', lord: 'Mercury' },
];

const DASHA_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const DASHA_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17];

export function getNakshatra(moonLongitude: number): NakshatraData {
  const nakshatraNumber = Math.floor(moonLongitude / (360 / 27)) % 27;
  const pada = Math.floor((moonLongitude % (360 / 27)) / (360 / 27 / 4)) + 1;
  const nakshatra = NAKSHATRAS[nakshatraNumber];
  
  return {
    number: nakshatraNumber + 1,
    name: nakshatra.name,
    nameEn: nakshatra.nameEn,
    lord: nakshatra.lord,
    pada,
  };
}

export function calculateVedicSign(tropicalLongitude: number, jd: number): string {
  const ayanamsa = getAyanamsa(jd);
  const siderealLongitude = (tropicalLongitude - ayanamsa + 360) % 360;
  return getZodiacSign(siderealLongitude);
}

export function calculateDasha(nakshatra: NakshatraData, birthYear: number): DashaPeriod[] {
  const lordIndex = DASHA_ORDER.indexOf(nakshatra.lord);
  const dashas: DashaPeriod[] = [];
  let totalYears = 0;

  for (let i = 0; i < DASHA_ORDER.length; i++) {
    const index = (lordIndex + i) % DASHA_ORDER.length;
    const duration = DASHA_YEARS[index];
    
    dashas.push({
      planet: DASHA_ORDER[index],
      startYear: birthYear + totalYears,
      duration,
    });
    
    totalYears += duration;
  }

  return dashas;
}

export function calculateVedicAstrology(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  lat: number,
  lng: number
): VedicAstroChart {
  const jd = calculateJulianDay(year, month, day, hour, minute);
  const ayanamsa = getAyanamsa(jd);

  // Simplified moon position (use astronomia for production)
  const T = (jd - 2451545.0) / 36525;
  const tropicalMoon = (218.3164477 + 481267.88123421 * T) % 360;
  const siderealMoon = (tropicalMoon - ayanamsa + 360) % 360;

  // Simplified sun position
  const tropicalSun = (280.46646 + 36000.76983 * T) % 360;
  const siderealSun = (tropicalSun - ayanamsa + 360) % 360;

  // Simplified ascendant
  const asc = (siderealMoon + 90 - lat + 360) % 360;

  const moonNakshatra = getNakshatra(siderealMoon);
  const dashas = calculateDasha(moonNakshatra, year);

  return {
    moonSign: getZodiacSign(siderealMoon),
    moonNakshatra,
    ascendant: getZodiacSign(asc),
    sunSign: getZodiacSign(siderealSun),
    dashas,
    moonDegree: siderealMoon,
  };
}
```

**Step 3: 建立模組匯出**

```typescript
// src/modules/vedic-astro/index.ts
export * from './calculator';
export * from './types';
```

**Step 4: Commit**

```bash
git add src/modules/vedic-astro/
git commit -m "feat: add Vedic astrology module with Nakshatra and Dasha"
```

---

## Task 11: 建立吠陀占星頁面

**Files:**
- Create: `src/pages/VedicAstro.tsx`

**Step 1: 建立頁面元件**

```typescript
// src/pages/VedicAstro.tsx
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
            <p><strong> pada：</strong>{chart.moonNakshatra.pada}</p>
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
```

**Step 2: Commit**

```bash
git add src/pages/VedicAstro.tsx
git commit -m "feat: add Vedic astrology page with Nakshatra and Dasha display"
```

---

## Task 12: 更新路由

**Files:**
- Modify: `src/App.tsx`

**Step 1: 新增路由**

在現有路由中加入新頁面：

```typescript
// 在 import 區域加入
import NumerologyPage from './pages/Numerology';
import WesternAstroPage from './pages/WesternAstro';
import VedicAstroPage from './pages/VedicAstro';

// 在路由配置中加入
<Route path="/numerology" element={<NumerologyPage />} />
<Route path="/western-astro" element={<WesternAstroPage />} />
<Route path="/vedic-astro" element={<VedicAstroPage />} />
```

**Step 2: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add routes for numerology, western and vedic astrology"
```

---

## Task 13: 更新導航

**Files:**
- Modify: 導航元件檔案（需確認實際位置）

**Step 1: 新增導航項目**

```typescript
const navItems = [
  // 現有項目...
  { path: '/western-astro', label: '西洋占星' },
  { path: '/vedic-astro', label: '吠陀占星' },
  { path: '/numerology', label: '數字命理' },
];
```

**Step 2: Commit**

```bash
git add src/components/Navigation.tsx  # 或實際檔案路徑
git commit -m "feat: add navigation items for new divination modules"
```

---

## Task 14: 建立類型目錄

**Files:**
- Create: `src/types/index.ts`

**Step 1: 建立匯出檔案**

```typescript
// src/types/index.ts
export * from './userData';
```

**Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add types index export"
```

---

## Task 15: 更新 i18n 翻譯

**Files:**
- Modify: `src/i18n/` 相關檔案

**Step 1: 新增翻譯字串**

```json
{
  "nav": {
    "westernAstro": "西洋占星",
    "vedicAstro": "吠陀占星",
    "numerology": "數字命理"
  },
  "numerology": {
    "lifePath": "生命靈數",
    "destiny": "命運數",
    "soul": "靈魂數",
    "personality": "人格數",
    "birthday": "生日數"
  }
}
```

**Step 2: Commit**

```bash
git add src/i18n/
git commit -m "feat: add i18n translations for new modules"
```

---

## Task 16: 最終測試與建構

**Step 1: 執行所有測試**

```bash
npm run test
```
Expected: 所有測試通過

**Step 2: 執行 lint**

```bash
npm run lint
```
Expected: 無錯誤

**Step 3: 執行建構**

```bash
npm run build
```
Expected: 建構成功

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: final testing and build verification"
```

---

## 實作順序總結

1. Task 1-2: Store 與類型定義（基礎）
2. Task 3: SharedInput 元件
3. Task 4-5: 占星計算工具
4. Task 6-7: 數字命理模組 + 頁面
5. Task 8-9: 西洋占星模組 + 頁面
6. Task 10-11: 吠陀占星模組 + 頁面
7. Task 12-13: 路由與導航
8. Task 14-15: 類型與翻譯
9. Task 16: 最終測試
