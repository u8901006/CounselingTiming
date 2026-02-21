# CounselingNow 改善計畫

## 概述

基於現有功能，依序執行四大改善方向：
- **A. 功能增強**：歷史記錄、匯出、流年、i18n
- **B. 視覺體驗升級**：Recharts 雷達圖、暗色模式、完整命盤視覺化
- **C. 技術重構**：Zustand、組件拆分、Vitest 完整測試
- **D. 內容深化**：治療說明頁、參考資源、內容優化

---

## 技術決策

| 項目 | 選擇 | 理由 |
|------|------|------|
| 五行雷達圖 | Recharts | React 生態，API 簡單 |
| 多語言 | 繁中 + 英文 | react-i18next |
| 命盤視覺化 | 完整版 SVG | 12宮格 + 星曜亮度 + 四化 + 色彩 |
| 測試 | Vitest + Testing Library | 核心模組 + UI 組件 |

---

## 計畫 A：功能增強

### A1. 歷史記錄 (localStorage)

**檔案結構：**
```
src/
├── store/
│   └── useStore.ts          # Zustand store
├── types/
│   └── index.ts             # 共用型別
└── components/
    └── HistoryList/
        └── index.tsx        # 歷史記錄列表
```

**實作內容：**
1. 建立 Zustand store，包含：
   - `history: AnalysisRecord[]`
   - `addToHistory(record)`
   - `clearHistory()`
   - `removeFromHistory(id)`
2. localStorage 持久化 middleware
3. 歷史記錄 UI：列表、刪除、重新載入

### A2. 匯出功能

**依賴：** html2canvas, jspdf

**實作內容：**
1. `src/utils/export.ts`
   - `exportAsImage(elementId)`
   - `exportAsPDF(elementId)`
2. 結果頁新增匯出按鈕
3. 生成美觀的匯出版面

### A3. 流年運勢

**實作內容：**
1. 擴展 `src/modules/ziwei/index.ts`
   - `getYearlyFortune(astrolabe, year)`
   - `getMonthlyFortune(astrolabe, year, month)`
2. 新增流年卡片組件
3. 顯示當年/當月運勢重點

### A4. 多語言 (i18n)

**依賴：** react-i18next, i18next

**檔案結構：**
```
src/
├── i18n/
│   ├── index.ts
│   └── locales/
│       ├── zh-TW.json
│       └── en.json
└── components/
    └── LanguageSwitcher/
        └── index.tsx
```

**實作內容：**
1. i18n 初始化配置
2. 翻譯檔案（核心 UI、五行、治療名稱）
3. 語言切換器組件

---

## 計畫 B：視覺體驗升級

### B1. 五行雷達圖 (Recharts)

**依賴：** recharts

**檔案結構：**
```
src/components/
└── WuxingRadarChart/
    └── index.tsx
```

**實作內容：**
1. RadarChart 組件
2. 五行數據格式化
3. 動畫效果
4. 深色模式支援

### B2. 暗色模式

**實作內容：**
1. Tailwind dark mode 配置
2. CSS 變數定義色彩系統
3. 主題切換按鈕（儲存偏好到 localStorage）
4. 全站 dark: 樣式補完

### B3. 命盤視覺化（完整版）

**檔案結構：**
```
src/components/
└── ZiweiChart/
    ├── index.tsx           # 主組件
    ├── PalaceCell.tsx      # 單一宮位
    ├── StarBadge.tsx       # 星曜標籤
    └── constants.ts        # 色彩定義
```

**視覺規格：**
- 12 宮格狀佈局（3x4 或傳統排列）
- 星曜色彩編碼：
  - 紫微系：紫色
  - 天府系：黃色
  - 日月：紅/藍
  - 煞星：紅色
- 亮度標示：廟旺（實心）、陷（半透明）
- 四化標示：祿(綠)、權(黃)、科(藍)、忌(紅)
- 身宮標記
- 滑鼠懸停顯示詳細資訊

### B4. 結果卡片美化

**實作內容：**
1. 統一卡片樣式（圓角、陰影、漸層）
2. 分數圓環進度條
3. 圖示取代 emoji
4. 動畫進場效果

---

## 計畫 C：技術重構

### C1. Zustand 狀態管理

**檔案結構：**
```
src/store/
├── index.ts            # 匯出
├── useAppStore.ts      # 應用狀態
├── useHistoryStore.ts  # 歷史記錄
└── useThemeStore.ts    # 主題狀態
```

**狀態設計：**
```typescript
interface AppState {
  step: number;
  birthDate: string;
  birthHour: number;
  gender: 'male' | 'female';
  selectedMethods: DivinationMethod[];
  result: CounselingRecommendation | null;
  divinationResults: DivinationResults;
  isLoading: boolean;
  
  // Actions
  setStep: (step: number) => void;
  setBirthInfo: (date: string, hour: number, gender: 'male' | 'female') => void;
  toggleMethod: (method: DivinationMethod) => void;
  analyze: () => Promise<void>;
  reset: () => void;
}
```

### C2. 組件拆分

**目標結構：**
```
src/
├── components/
│   ├── Layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ProgressBar.tsx
│   ├── InputForm/
│   │   ├── BirthDateInput.tsx
│   │   ├── GenderSelect.tsx
│   │   └── index.tsx
│   ├── MethodSelector/
│   │   └── index.tsx
│   ├── Results/
│   │   ├── ZiweiResult.tsx
│   │   ├── BaziResult.tsx
│   │   ├── IChingResult.tsx
│   │   ├── TarotResult.tsx
│   │   ├── TimingScore.tsx
│   │   ├── WuxingChart.tsx
│   │   ├── TherapyRecommendation.tsx
│   │   └── index.tsx
│   ├── ZiweiChart/
│   │   └── index.tsx
│   ├── WuxingRadarChart/
│   │   └── index.tsx
│   ├── HistoryList/
│   │   └── index.tsx
│   ├── ExportButton/
│   │   └── index.tsx
│   └── ui/
│       ├── Card.tsx
│       ├── Button.tsx
│       └── Modal.tsx
├── pages/
│   ├── Home.tsx
│   ├── Analysis.tsx
│   ├── Result.tsx
│   └── TherapyDetail.tsx
└── App.tsx              # 路由配置
```

### C3. 完整測試 (Vitest)

**依賴：** vitest, @testing-library/react, @testing-library/jest-dom, jsdom

**測試檔案結構：**
```
src/
├── modules/
│   ├── ziwei/
│   │   └── index.test.ts
│   ├── iching/
│   │   └── index.test.ts
│   └── tarot/
│       └── index.test.ts
├── analysis/
│   └── orientation/
│       └── index.test.ts
└── components/
    ├── InputForm/
    │   └── index.test.tsx
    ├── WuxingRadarChart/
    │   └── index.test.tsx
    └── ZiweiChart/
        └── index.test.tsx
```

**測試範圍：**
1. 核心模組測試
   - ziwei: 命盤計算、格局判斷
   - bazi: 八字計算、五行分析
   - iching: 卦象生成、動爻計算
   - tarot: 抽牌、解讀
2. 分析引擎測試
   - 時機評分邏輯
   - 治療匹配邏輯
3. UI 組件測試
   - 表單輸入
   - 結果渲染
   - 主題切換

### C4. 錯誤邊界

**實作內容：**
1. `src/components/ErrorBoundary.tsx`
2. 包裹主要區塊
3. 友善錯誤訊息與重試按鈕

---

## 計畫 D：內容深化

### D1. 治療取向說明頁

**路由：** `/therapy/:id`

**檔案結構：**
```
src/
├── pages/
│   └── TherapyDetail.tsx
├── data/
│   └── therapy-details.ts    # 24 種治療詳細說明
└── App.tsx                   # 新增路由
```

**內容結構：**
```typescript
interface TherapyDetail {
  id: string;
  name: string;
  enName: string;
  wuxing: Element;
  description: string;
  suitableFor: string[];
  howItWorks: string;
  sessionFormat: string;
  references: string[];
}
```

### D2. 參考資源連結

**實作內容：**
1. `src/data/resources.ts`
2. 結果頁底部顯示相關資源
3. 分類：諮商所、線上資源、書籍推薦

### D3. 結果解釋優化

**實作內容：**
1. 擴展 `src/data/wuxing-therapy.ts` 描述
2. 新增 `src/data/star-descriptions.ts` 擴展
3. 更白話的諮商建議文案
4. 專業術語 tooltip

---

## 實施順序

### Phase 1: 基礎建設 (C1, C2, C4)
1. Zustand 狀態管理
2. 組件拆分
3. 錯誤邊界

### Phase 2: 核心功能 (A1, A3, B1, B3)
1. 歷史記錄
2. 流年運勢
3. 五行雷達圖
4. 命盤視覺化

### Phase 3: 增強功能 (A2, A4, B2, B4)
1. 匯出功能
2. 多語言
3. 暗色模式
4. 結果美化

### Phase 4: 內容與測試 (D1, D2, D3, C3)
1. 治療說明頁
2. 參考資源
3. 內容優化
4. 完整測試

---

## 依賴安裝清單

```bash
npm install zustand recharts react-i18next i18next html2canvas jspdf react-router-dom
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom @vitest/coverage-v8
```

---

## 檔案變更總覽

| 類型 | 數量 | 說明 |
|------|------|------|
| 新增 | ~30 | 組件、store、測試 |
| 修改 | ~8 | App.tsx, ziwei/index.ts 等 |
| 刪除 | 0 | 無 |

---

## 版本歷程

| 日期 | 版本 | 說明 |
|------|------|------|
| 2025-02-21 | v1.0 | 初版改善計畫 |

---

## 授權

MIT License
