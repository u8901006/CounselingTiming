# GPT Full Context Prompt Design

## Goal

改善複製到 GPT 的提示詞內容，加入完整個人命理上下文，包括姓名、性別、國曆生日、生辰、出生地、四柱與各方法結果，讓 GPT 能在完整背景下做更有脈絡的綜合分析。

## Scope

### In Scope

- 擴充 `buildGptPrompt()` 輸入，納入完整個人資料
- 在 prompt 中新增個人檔案與核心命理背景區塊
- 在 prompt 中加入四柱、日主、地點等高價值資訊
- 更新 `GPTIntegration` 以傳遞這些欄位
- 在 UI 中明示「此提示詞包含完整個資」
- 補齊測試

### Out of Scope

- 提供遮罩姓名 / 匿名模式開關
- 對外部 GPT 回覆結果做品質評分
- 自動上傳到任何第三方 AI 平台

## Problem Statement

目前 `buildGptPrompt()` 只使用 `question`、`selectedMethods` 與 `divinationResults`。即使已有方法結果與經典視角，GPT 仍缺少關鍵的個人背景欄位，例如姓名、性別、出生日期、生辰、出生地，以及能快速概括命盤結構的四柱資料。對綜合型分析來說，這會讓 GPT 難以建立完整上下文，也降低多方法整合品質。

## Recommended Approach

採用「分層上下文 prompt」：

1. 角色與分析規則
2. 個人基本資料
3. 核心命理資料
4. 各占卜方法詳情
5. 最終綜合分析要求

這比把資料全部平鋪更容易讓 GPT 抓到主次，也能讓之後再加入更多欄位時仍保持可讀性。

## Prompt Structure

### 1. Role / Instruction Block

保留目前的經典脈絡分析規則，並加強：

- 請先理解個人背景，再讀各方法結果
- 請以多方法交集為核心、矛盾為輔助
- 請提出具體、可執行的分析與建議

### 2. Privacy Notice

新增一段明確說明：

- 以下內容包含完整個資
- 僅用於本次分析
- 請避免在回答中重複不必要的個資資訊

### 3. Personal Profile

新增區塊，例如：

```text
Personal profile:
- Name: 王小明
- Gender: male
- Birth date (Gregorian): 1990-05-10
- Birth hour: 08:00
- Birth location: Taipei
- User question: 我現在適合開始諮商嗎？
```

### 4. Core Metaphysical Context

新增高價值背景欄位：

- 四柱
- 日主
- 優勢五行
- 待補五行
- 若無八字資料，明確標示 unavailable

範例：

```text
Core metaphysical context:
- Four pillars: 甲子、乙丑、丙寅、丁卯
- Day master: 丙火
- Dominant wuxing: 木
- Deficient wuxing: 金
```

### 5. Method Sections

保留目前每方法的：

- `Classic references`
- `Analysis lens`
- `Method details`

### 6. Final Synthesis Instruction

新增更明確的輸出要求：

- 先做整體判讀
- 再說明各方法交集與差異
- 最後給出具體行動建議
- 避免只重述原始資料

## Data Sources

### From `useAppStore`

- `name`
- `gender`
- `birthDate`
- `birthHour`
- `location`
- `question`
- `selectedMethods`
- `divinationResults`

### From `divinationResults.bazi`

- `yearPillar`
- `monthPillar`
- `dayPillar`
- `hourPillar`
- `dayMaster`
- `dominantWuxing`
- `deficientWuxing`

## UI Change

### `src/components/Results/GPTIntegration.tsx`

在現有說明文字附近新增一段個資提示，例如：

- 這份提示詞包含姓名、生日、生辰與出生地
- 貼到外部 AI 前請自行確認

這次先做明示，不加遮罩模式。

## Testing Strategy

### `src/utils/gptPromptTemplate.test.ts`

新增測試覆蓋：

- 包含 `Personal profile`
- 包含 `Core metaphysical context`
- 四柱與日主有正確進 prompt
- 缺八字時仍顯示 unavailable

### `src/components/Results/GPTIntegration.test.tsx`

新增測試覆蓋：

- `GPTIntegration` 會把完整個資傳給 prompt builder
- UI 顯示個資提醒文案

## Open Decisions Resolved

- 個資層級：完整個資版
- 架構：分層上下文 prompt
- UI 防護：先做明示提醒，不做遮罩模式

## Implementation Notes

- `birthHour` 若目前只保存整數時辰，可先轉成簡單字串而不是強做精準時間格式
- `location` 先使用城市名稱即可，不必把經緯度送進 GPT
- 如果沒有八字結果，核心命理區仍保留欄位，避免 GPT 以為資料遺失
