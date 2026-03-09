# 占卜系統整合實作計畫

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 將西洋占星、吠陀占星、數字命理整合到現有占卜系統，讓用戶填寫一次基本資料後複選想要的占卜方式，並新增 GPT 對話和複製功能

**Architecture:** 擴展現有 `DivinationMethod` 類型，在 `MethodSelector` 中新增問題輸入欄位,新增 `GPTIntegration` 元件顯示綜合分析結果,複製提示詞

**Tech Stack:** React, TypeScript, Zustand, i18next

---

## Task 1: 擴展 DivinationMethod 類型

**檔案:**
- 修改: `src/store/useAppStore.ts`

**Step 1: 更新類型定義**

```typescript
export type DivinationMethod = 
  | 'ziwei' 
  | 'bazi' 
  | 'iching' 
  | 'tarot' 
  | 'western-astro'  // 新增
  | 'vedic-astro'    // 新增
  | 'numerology';     // 新增
```

**Step 2: 驗證失敗**
```bash
npm run build
```
Expected: TypeScript 編譯錯誤 (顯示新增的類型)

**Step 3: 提交**

```bash
git add src/store/useAppStore.ts
git commit -m "feat: extend DivinationMethod with western-astro, vedic-astro, numerology"
```

---

## Task 2: 擴展 useAppStore 新屬性
**檔案:**
- 修改: `src/store/useAppStore.ts`

**Step 1: 新增 name, question, location 屬位**

```typescript
interface AppState {
  // ... 現有欄位
  name?: string;
  question?: string;
  location?: { city: string; lat: number; lng: number };
  
  setName: (name: string) => void;
  setQuestion: (question: string) => void;
  setLocation: (location: { city: string; lat: number; lng: number }) => void;
}
```

**Step 2: 更新 initialState**

```typescript
const initialState = {
  step: 1,
  birthDate: '',
  birthHour: 12,
  gender: 'male',
  name: '',
  question: '',
  location: { city: '台北市', lat: 25.0330, lng: 121.5654 },
  selectedMethods: [],
  result: null,
  divinationResults: {
    iching: null,
    tarot: null,
    ziwei: null,
    bazi: null,
    westernAstro: null,
    vedicAstro: null,
    numerology: null,
  },
  isLoading: false,
};
```

**Step 3: 新增 actions**

```typescript
setName: (name) => set({ name }),
setQuestion: (question) => set({ question }),
setLocation: (location) => set({ location }),
```

**Step 4: 提交**

```bash
git add src/store/useAppStore.ts
git commit -m "feat: add name, question, location fields to useAppStore"
```

---

## Task 3: 擴展 DivinationResults 型別
**檔案:**
- 修改: `src/store/useAppStore.ts`

**Step 1: 新增模組類型匯入**

```typescript
import { WesternAstroChart } from '../modules/western-astro';
import { VedicAstroChart } from '../modules/vedic-astro';
import { NumerologyResult } from '../modules/numerology';
```

**Step 2: 更新 DivinationResults 介面**

```typescript
export interface DivinationResults {
  iching: DivinationResult | null
  tarot: TarotReading | null
  ziwei: ZiweiResult | null
  bazi: BaziResult | null
  westernAstro: WesternAstroChart | null
  vedicAstro: VedicAstroChart | null
  numerology: NumerologyResult | null
}
```

**Step 3: 提交**

```bash
git add src/store/useAppStore.ts
git commit -m "feat: extend DivinationResults with new module types"
```

---

## Task 4: 更新 MethodSelector 元件
**檔案:**
- 修改: `src/components/MethodSelector/index.tsx`

**Step 1: 新增 METHOD_OPTIONS 項目**

```typescript
const METHOD_OPTIONS = [
  { id: 'ziwei' as const, icon: '⭐', nameKey: 'method.ziwei', descKey: 'method.ziweiDesc' },
  { id: 'bazi' as const, icon: '☯️', nameKey: 'method.bazi', descKey: 'method.baziDesc' },
  { id: 'iching' as const, icon: '🔮', nameKey: 'method.iching', descKey: 'method.ichingDesc' },
  { id: 'tarot' as const, icon: '🃏', nameKey: 'method.tarot', descKey: 'method.tarotDesc' },
  { id: 'western-astro' as const, icon: '⛎', nameKey: 'method.westernAstro', descKey: 'method.westernAstroDesc' },
  { id: 'vedic-astro' as const, icon: '🕉', nameKey: 'method.vedicAstro', descKey: 'method.vedicAstroDesc' },
  { id: 'numerology' as const, icon: '🔢', nameKey: 'method.numerology', descKey: 'method.numerologyDesc' },
];
```

**Step 2: 新增問題輸入 props**

```typescript
interface MethodSelectorProps {
  selectedMethods: DivinationMethod[]
  onToggle: (method: DivinationMethod) => void
  onBack: () => void
  onAnalyze: () => void
  isLoading: boolean
  question?: string
  onQuestionChange: (question: string) => void
}
```

**Step 3: 更新函數簽名**

```typescript
export default function MethodSelector({
  selectedMethods,
  onToggle,
  onBack,
  onAnalyze,
  isLoading,
  question = '',
  onQuestionChange,
}: MethodSelectorProps) {
```

**Step 4: 新增問題輸入 UI**

```tsx
<div className="mt-4 mb-2">
  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
    {t('question.label') || '想詢問的問題'}
  </label>
  <textarea
    value={question}
    onChange={(e) => onQuestionChange(e.target.value)}
    placeholder={t('question.placeholder') || '例如：目前面臨什麼困境？想要獲得什麼指引?'}
    className="w-full p-3 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
    rows={3}
  />
</div>
```

**Step 5: 提交**

```bash
git add src/components/MethodSelector/index.tsx
git commit -m "feat: add new divination methods and question input to MethodSelector"
```

---

## Task 5: 新增 copyToClipboard 工具
**檔案:**
- 建立: `src/utils/clipboard.ts`
- 建立: `src/utils/clipboard.test.ts`

**Step 1: 咰寫測試**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { copyToClipboard } from './clipboard';

describe('copyToClipboard', () => {
  it('should copy text to clipboard', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(true);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      writable: true,
    });
    
    const result = await copyToClipboard('test text');
    expect(result).toBe(true);
    expect(mockWriteText).toHaveBeenCalledWith('test text');
  });
});
```

**Step 2: 建立工具函數**

```typescript
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
}
```

**Step 3: 執行測試**

```bash
npm test -- --testPathPattern=clipboard
```
Expected: PASS

**Step 4: 提交**

```bash
git add src/utils/clipboard.ts src/utils/clipboard.test.ts
git commit -m "feat: add copyToClipboard utility"
```

---

## Task 6: 新增 GPT Prompt Template
**檔案:**
- 建立: `src/utils/gptPromptTemplate.ts`

**Step 1: 建立模板**

```typescript
export const GPT_PROMPT_TEMPLATE = `請將以下占卜方式的共同交會之處解析：

## 想詢問的問題
{question}

## 選擇的占卜方式
{methods}

## 占卜結果
\`\`\`json
{results}
\`\`\`

請提供：
1. 各占卜方式對同一問題的觀點
2. 共同出現的重要徵象或建議
3. 整體趨勢分析
4. 具體行動建議`;
```

**Step 2: 提交**

```bash
git add src/utils/gptPromptTemplate.ts
git commit -m "feat: add GPT prompt template"
```

---

## Task 7: 新增 GPTIntegration 元件
**檔案:**
- 建立: `src/components/Results/GPTIntegration.tsx`

**Step 1: 撰寫元件**

```typescript
import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from 'react-i18next';
import { copyToClipboard } from '../../utils/clipboard';
import { GPT_PROMPT_TEMPLATE } from '../../utils/gptPromptTemplate';

interface GPTIntegrationProps {}

export const GPTIntegration: React.FC<GPTIntegrationProps> = () => {
  const { t } = useTranslation();
  const { question, divinationResults, selectedMethods } = useAppStore();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const allResults: Record<string, unknown> = {};
    selectedMethods.forEach(method => {
      allResults[method] = divinationResults[method];
    });

    const promptText = GPT_PROMPT_TEMPLATE
      .replace('{question}', question || t('question.placeholder', '請輸入您的問題'))
      .replace('{methods}', selectedMethods.map(m => t(`method.${m}`)).join(', '))
      .replace('{results}', JSON.stringify(allResults, null, 2));
    
    await copyToClipboard(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const methodsSelected = selectedMethods.map(m => t(`method.${m}`)).join(', ');

  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4 dark:text-gray-200">
        {t('gpt.title') || '與 AI 對話分析'}
      </h2>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {t('gpt.subtitle') || '將您的占卜結果與 AI 助手分析，獲得綜合解讀'}
      </p>
      
      <div className="mb-4">
        <p className="font-medium dark:text-gray-200">{t('gpt.yourQuestion') || '您的問題'}</p>
        <p className="text-gray-700 dark:text-gray-300">{question || t('question.placeholder', '（未輸入）')}</p>
      </div>
      
      <div className="mb-4">
        <p className="font-medium dark:text-gray-200">{t('gpt.selectedMethods') || '選擇的占卜方式'}</p>
        <p className="text-gray-700 dark:text-gray-300">{methodsSelected}</p>
      </div>
      
      <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-auto-auto">
        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono">
          {promptText.substring(0, 200)}...
        </p>
      </div>
      
      <div className="flex gap-2 mt-4">
        <button
          onClick={handleCopy}
          className="flex-1 py-2 bg-water text-white rounded-lg font-medium hover:bg-water-dark flex items-center justify-center gap-2"
        >
          {copied ? (
            <>
              <span className="text-green-200">✓</span>
            </>
          ) : (
            <span>{t('gpt.copyButton') || '複製提示詞'}</span>
          )}
        </button>
        
        <a
          href="https://chat.openai.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 border border-water text-water rounded-lg font-medium hover:bg-water-dark hover:text-white flex items-center justify-center gap-2"
        >
          {t('gpt.openChat') || '開啟對話'}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6h6l4 5 4M10 6zm3.293a5.293 1.293-3 3 1.293 5.293 3 3 3 3.293 3 3c0 1.293-1.293 3.293a1 0 1 0 1.294-2.293 3.293L4.354 1.646a.5.5 0 010-.708.708L8.354 5.646a.5.5 0 01.708 0L10.646 5.646a.5.5 0 010 .708-.708L8.353 5.647 5.293 3.293L4.354-1.647a.5.5 00-.707-.708L1.646 8.353a.5.5 00-.708.708L5.647 4.354a.5.5 010 .707 0L8.354 1.646a.5.5 01-.708.708L10 6.353l5.646-5.647z" />
          </svg>
        </a>
      </div>
    </div>
  );
};
```

**Step 2: 提交**

```bash
git add src/components/Results/GPTIntegration.tsx
git commit -m "feat: add GPTIntegration component with copy and chat features"
```

---

## Task 8: 更新 handleAnalyze 函數
**檔案:**
- 修改: `src/App.tsx`

**Step 1: 新增模組匯入**

```typescript
import { calculateNumerology } from './modules/numerology';
import { calculateWesternAstrology } from './modules/western-astro';
import { calculateVedicAstrology } from './modules/vedic-astro';
```

**Step 2: 新增占卜結果計算邏輯**

在 handleAnalyze 函數中新增:

```typescript
let westernAstroResult = null;
let vedicAstroResult = null;
let numerologyResult = null;

if (selectedMethods.includes('western-astro') && birthDate) {
  westernAstroResult = calculateWesternAstrology(
    birthDate.getFullYear(),
    birthDate.getMonth() + 1,
    birthDate.getDate(),
    birthHour,
    0,
    location.lat,
    location.lng
  );
}

if (selectedMethods.includes('vedic-astro') && birthDate) {
  vedicAstroResult = calculateVedicAstrology(
    birthDate.getFullYear(),
    birthDate.getMonth() + 1,
    birthDate.getDate(),
    birthHour,
    0,
    location.lat,
    location.lng
  );
}

if (selectedMethods.includes('numerology') && name && birthDate) {
  numerologyResult = calculateNumerology(
    name,
    birthDate.getFullYear(),
    birthDate.getMonth() + 1,
    birthDate.getDate()
  );
}
```

**Step 3: 更新 setDivinationResults**

```typescript
setDivinationResults({
  ...divinationResults,
  westernAstro: westernAstroResult,
  vedicAstro: vedicAstroResult,
  numerology: numerologyResult,
});
```

**Step 4: 提交**

```bash
git add src/App.tsx
git commit -m "feat: integrate western-astro, vedic-astro, numerology in handleAnalyze"
```

---

## Task 9: 更新 App.tsx 整合 GPT 功能
**檔案:**
- 修改: `src/App.tsx`

**Step 1: 從 useAppStore 獲取新独態**

```typescript
const {
  step, setStep,
  birthDate, birthHour, gender,
  setBirthDate, setBirthHour, setGender,
  name, question, location,
  setName, setQuestion, setLocation,
  selectedMethods, toggleMethod,
  result, setResult,
  divinationResults, setDivinationResults,
  isLoading, setIsLoading,
  reset
} = useAppStore();
```

**Step 2: 更新 MethodSelector 調用**

```typescript
<MethodSelector
  selectedMethods={selectedMethods}
  onToggle={toggleMethod}
  onBack={() => setStep(1)}
  onAnalyze={handleAnalyze}
  isLoading={isLoading}
  question={question}
  onQuestionChange={setQuestion}
/>
```

**Step 3: 新增結果顯示**

在 renderStep3 中新增

```tsx
{selectedMethods.includes('western-astro') && divinationResults.westernAstro && (
  <div className="card">
    <h3 className="text-lg font-bold mb-4 dark:text-gray-200">西洋占星分析</h3>
    <div className="space-y-2">
      <p><strong>太陽星座：</strong>{divinationResults.westernAstro.planets[0]?.sign}</p>
      <p><strong>月亮星座：</strong>{divinationResults.westernAstro.planets[1]?.sign}</p>
      <p><strong>上升星座：</strong>{divinationResults.westernAstro.ascendant?.sign}</p>
    </div>
  </div>
)}

{selectedMethods.includes('vedic-astro') && divinationResults.vedicAstro && (
  <div className="card">
    <h3 className="text-lg font-bold mb-4 dark:text-gray-200">吠陀占星分析</h3>
    <div className="space-y-2">
      <p><strong>月亮星座：</strong>{divinationResults.vedicAstro.moonSign}</p>
      <p><strong>月宿：</strong>{divinationResults.vedicAstro.moonNakshatra?.name}</p>
      <p><strong>上升星座：</strong>{divinationResults.vedicAstro.ascendant}</p>
    </div>
  </div>
)}

{selectedMethods.includes('numerology') && divinationResults.numerology && (
  <div className="card">
    <h3 className="text-lg font-bold mb-4 dark:text-gray-200">數字命理分析</h3>
    <div className="space-y-2">
      <p><strong>生命靈數：</strong>{divinationResults.numerology.lifePathNumber}</p>
      <p><strong>命運數：</strong>{divinationResults.numerology.destinyNumber}</p>
      <p><strong>靈魂數：</strong>{divinationResults.numerology.soulNumber}</p>
    </div>
  </div>
)}

<GPTIntegration />
```

**Step 4: 提交**

```bash
git add src/App.tsx
git commit -m "feat: integrate GPT features in main flow"
```

---

## Task 10: 更新 InputForm 添加地點欄位
**檔案:**
- 修改: `src/components/InputForm/InputForm.tsx`

**Step 1: 新增台灣城市常數**

```typescript
const TAIWAN_CITIES = [
  { name: '台北市', lat: 25.0330, lng: 121.5654 },
  { name: '新北市', lat: 25.0122, lng: 121.4654 },
  { name: '桃園市', lat: 24.9936, lng: 121.3010 },
  { name: '台中市', lat: 24.1477, lng: 120.6736 },
  { name: '台南市', lat: 22.9999, lng: 120.2269 },
  { name: '高雄市', lat: 22.6273, lng: 120.3014 },
];
```

**Step 2: 新增 props**

```typescript
interface InputFormProps {
  birthDate: string;
  birthHour: number;
  gender: 'male' | 'female';
  name?: string;
  location?: { city: string; lat: number; lng: number };
  onBirthDateChange: (date: string) => void;
  onBirthHourChange: (hour: number) => void;
  onGenderChange: (gender: 'male' | 'female') => void;
  onNameChange?: (name: string) => void;
  onLocationChange?: (location: { city: string; lat: number; lng: number }) => void;
  onSubmit: () => void;
}
```

**Step 3: 新增姓名輸入 UI**

```tsx
<div className="mb-4">
  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
    {t('name') || '姓名'}
  </label>
  <input
    type="text"
    value={name}
    onChange={(e) => onNameChange?.(e.target.value)}
    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
  />
</div>
```

**Step 4: 新增地點選擇 UI**

```tsx
<div className="mb-4">
  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
    {t('birthLocation') || '出生地點'}
  </label>
  <select
    value={location?.city}
    onChange={(e) => {
      const selected = TAIWAN_CITIES.find(c => c.name === e.target.value);
      if (selected && onLocationChange) {
        onLocationChange(selected);
      }
    }}
    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"
  >
    {TAIWAN_CITIES.map(city => (
      <option key={city.name} value={city.name}>{city.name}</option>
    ))}
  </select>
</div>
```

**Step 5: 提交**

```bash
git add src/components/InputForm/InputForm.tsx
git commit -m "feat: add name and location fields to InputForm"
```

---

## Task 11: 更新 i18n
**檔案:**
- 修改: `src/i18n/locales/zh-TW/translation.json`
- 修改: `src/i18n/locales/en/translation.json`

**Step 1: 新增翻譯字串**

```json
{
  "method": {
    "westernAstro": "西洋占星",
    "westernAstroDesc": "基於出生時間和地點分析星盤",
    "vedicAstro": "吠陀占星",
    "vedicAstroDesc": "印度占星系統,分析月亮星座與月宿",
    "numerology": "數字命理",
    "numerologyDesc": "透過姓名和出生日期計算生命靈數"
  },
  "question": {
    "label": "想詢問的問題",
    "placeholder": "例如：目前面臨什麼困境？"
  },
  "gpt": {
    "title": "與 AI 對話分析",
    "subtitle": "將您的占卜結果與 AI 助手分析,獲得綜合解讀",
    "yourQuestion": "您的問題",
    "selectedMethods": "選擇的占卜方式",
    "copyButton": "複製提示詞",
    "copied": "已複製",
    "openChat": "開啟對話"
  },
  "name": "姓名",
  "birthLocation": "出生地點"
}
```

**Step 2: 提交**

```bash
git add src/i18n/
git commit -m "feat: add i18n translations for new features"
```

---

## Task 12: 最終測試與建構
**Step 1: 執行所有測試**

```bash
npm test
```
Expected: 所有測試通過

**Step 2: 建構測試**

```bash
npm run build
```
Expected: 建構成功

**Step 3: 提交最終版本**

```bash
git add -A
git commit -m "feat: complete divination system integration"
```

---

## 驗證方案

| 步驟 | 驗證方式 |
|------|--------|
| Task 1-4 | TypeScript 編譯檢查 |
| Task 5-7 | 元件渲染測試 |
| Task 8 | 單元測試 (clipboard) |
| Task 9 | 功能測試 (新增占卜計算) |
| Task 10 | 整合測試 (完整流程) |
| Task 11 | UI 測試 (結果顯示) |
| Task 12 | 終端對端測試 |

---

## 風險與回滾方案
| 風險 | 緩解措施 | 回滾方案 |
|------|--------|--------|
| 現有測試失敗 | 在新分支開發 | `git checkout -- .` |
| 類型衝突 | 使用 TypeScript strict 模式 | 修改類型定義 |
| Bundle 過大 | Code splitting | 移除非必要功能 |
| GPT 功能異常 | 錯誤邊界處理 | 禁用相關功能 |
