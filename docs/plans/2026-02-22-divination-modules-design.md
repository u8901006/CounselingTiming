# 命理模組擴展設計

## 概述

為 CounselingTiming 新增西洋占星、吠陀占星、數字命理三個命理分析功能。

## 背景

現有專案已支援：
- 紫微斗數（`src/modules/ziwei/`）
- 易經（`src/modules/iching/`）
- 塔羅（`src/modules/tarot/`）

本次擴展採用相同模組化架構。

## 設計決策

| 決策 | 選擇 | 理由 |
|------|------|------|
| 開源策略 | 優先使用開源庫 | 加速開發，減少重複造輪子 |
| 輸入方式 | 統一輸入元件 | 改善 UX，一次輸入多處使用 |
| 呈現方式 | 分頁顯示 | 符合現有架構，易於維護 |
| 擴展方式 | 模組化 | 與現有 `modules/` 結構一致 |

## 架構

```
src/
├── modules/
│   ├── ziwei/              # 現有
│   ├── iching/             # 現有
│   ├── tarot/              # 現有
│   ├── western-astro/      # 新增：西洋占星
│   │   ├── index.ts
│   │   ├── calculator.ts
│   │   └── types.ts
│   ├── vedic-astro/        # 新增：吠陀占星
│   │   ├── index.ts
│   │   ├── calculator.ts
│   │   └── types.ts
│   └── numerology/         # 新增：數字命理
│       ├── index.ts
│       ├── calculator.ts
│       └── types.ts
├── components/
│   ├── SharedInput/        # 新增：統一輸入
│   │   ├── index.tsx
│   │   ├── LocationPicker.tsx
│   │   └── types.ts
│   └── ...
├── pages/
│   ├── WesternAstro.tsx    # 新增
│   ├── VedicAstro.tsx      # 新增
│   └── Numerology.tsx      # 新增
├── store/
│   └── userDataStore.ts    # 新增：使用者資料 store
└── utils/
    ├── astro-calculator.ts # 新增：占星計算共用
    └── location-utils.ts   # 新增：地點轉換
```

## 統一輸入元件

### 收集資料

| 欄位 | 類型 | 用途 | 必填 |
|------|------|------|------|
| name | string | 數字命理 | 是 |
| gender | 'male' \| 'female' | 紫微、吠陀 | 是 |
| birthDate | Date | 所有系統 | 是 |
| birthTime | { hour, minute } | 占星類、紫微 | 是 |
| location | { city, lat, lng } | 西洋、吠陀占星 | 否（預設台北） |

### Store 結構

```typescript
interface UserData {
  name: string;
  gender: 'male' | 'female';
  birthDate: Date;
  birthTime: { hour: number; minute: number };
  location: { city: string; lat: number; lng: number };
}

interface UserDataStore {
  data: UserData | null;
  setData: (data: UserData) => void;
  clearData: () => void;
}
```

## 西洋占星模組

### 開源庫
- 主要：`astronomia` 或 `swisseph`
- 備選：`astrology-js`

### 輸出內容
- 太陽星座、月亮星座、上升星座
- 行星位置（水金火木土天海冥）
- 十二宮位分佈
- 主要相位（合相、對沖、三分、四分）

### 計算流程
1. 輸入：出生時間 + 經緯度
2. 計算 Julian Day
3. 計算行星位置
4. 計算宮位（Placidus 或 Koch 系統）
5. 計算相位

## 吠陀占星模組

### 與西洋占星差異
- 使用恆星黃道（Sidereal Zodiac）
- 需要應用 Ayanamsa 校正
- 強調月宿（Nakshatra）

### 輸出內容
- 月宿（Nakshatra）
- 大運/小運（Dasha）
- Lagna（上升）

### 計算流程
1. 基於西洋占星計算
2. 應用 Ayanamsa 校正（Lahiri 或 Raman 系統）
3. 計算吠陀特有指標

## 數字命理模組

### 開源庫
- 主要：自建計算邏輯
- 參考：`numerology` npm 套件

### 輸出內容
- 生命靈數（Life Path Number, 1-9）
- 命運數（Destiny Number）
- 靈魂數（Soul Number）
- 人格數（Personality Number）
- 生日數（Birthday Number）

### 計算公式
```
生命靈數 = 數字和 reduced to 1-9 or 11/22/33
命運數 = 姓名字母數字和
靈魂數 = 母音字母數字和
人格數 = 子音字母數字和
生日數 = 日期數字和
```

## 路由設計

```typescript
// 新增路由
/western-astro   → WesternAstroPage
/vedic-astro     → VedicAstroPage
/numerology      → NumerologyPage
```

### 導航結構
```
首頁
├── 紫微斗數
├── 西洋占星    (新增)
├── 吠陀占星    (新增)
├── 數字命理    (新增)
├── 易經
└── 塔羅
```

## 資料流

```
使用者輸入
    │
    ▼
SharedInput 元件
    │
    ▼
Zustand Store (userData)
    │
    ├─→ 西洋占星頁面 → western-astro 計算 → 顯示結果
    ├─→ 吠陀占星頁面 → vedic-astro 計算 → 顯示結果
    └─→ 數字命理頁面 → numerology 計算 → 顯示結果
```

## 暫不實作

以下功能因開源庫不足，列入待辦：
- 一掌經
- 符文（Runes）
- 奇門遁甲
- 梅花易數

## 實作順序

1. 建立 UserData Store
2. 建立 SharedInput 元件
3. 實作數字命理（最簡單，無需外部庫）
4. 實作西洋占星
5. 實作吠陀占星
6. 更新路由與導航

## 測試策略

- 各模組單元測試：計算邏輯正確性
- SharedInput 元件測試：表單驗證
- 整合測試：輸入 → 計算 → 顯示流程
