# GPT Prompt Classics Design

## Goal

升級 GPT 提示詞模板，讓所有占卜方法都能被納入 prompt，並且每種方法都附上「經典參考清單 + 分析視角」，引導 GPT 以經典詮釋脈絡綜合分析，而不是只做資料羅列。

## Scope

### In Scope

- 將 GPT prompt 支援範圍從目前 3 種方法擴充到所有占卜方法
- 為每種方法加入代表性經典參考清單
- 為每種方法加入分析視角說明
- 在 prompt 總則中要求 GPT 以經典脈絡綜合解讀，但不要假裝逐字引用原文
- 補齊對應測試

### Out of Scope

- 實作真正的經典文本檢索或引用系統
- 多語系 prompt 版本切換
- 根據使用者地區或流派偏好切換經典
- 對 GPT 回答內容做後處理或評分

## Problem Statement

目前 `src/utils/gptPromptTemplate.ts` 只支援 `western-astro`、`vedic-astro`、`numerology` 三種方法，而且 prompt 主要是「方法清單 + 結果摘要」。這樣的 prompt 對 GPT 來說缺少方法學引導，容易生成泛化或過度口語的分析，也無法涵蓋東方命理/占卜模組。使用者希望將各種方法的代表性經典與詮釋脈絡放進 prompt，讓 GPT 的綜合分析更有「依據某一傳統解讀框架」的感覺。

## Recommended Approach

採用「方法設定表驅動」：

- 每個方法對應一份 config
- config 內包含：顯示名稱、經典參考、分析視角、資料 section builder
- `buildGptPrompt()` 只負責遍歷已選方法並組合 prompt

這樣可以避免大量 `switch` 與散落的硬編碼文案，並讓未來新增方法或調整經典時只改一處。

## Supported Methods

本次擴充後，GPT prompt 支援全部方法：

- `ziwei`
- `bazi`
- `iching`
- `liuyao`
- `tarot`
- `western-astro`
- `vedic-astro`
- `numerology`

## Prompt Structure

### 1. Global Instruction Layer

開頭加入更清楚的總則，內容大意：

- 請綜合各種占卜結果進行分析
- 請參考每種方法列出的代表經典與常見詮釋脈絡
- 不要假裝逐字引用原文
- 若資料不足，需明確指出不確定性
- 請整合多方法交集與差異，而不是各說各話

### 2. User Context Layer

- `User question`
- `Selected methods`

### 3. Method Blocks

每個方法區塊都固定包含：

1. 方法名稱
2. `Classic references`
3. `Analysis lens`
4. `Method details`

區塊範例：

```text
[ziwei]
Classic references:
- 紫微斗數全書
- 紫微斗數全集

Analysis lens:
- Focus on life palace structure, major stars, and temperament patterns
- Infer counseling timing and orientation from personality dynamics and stress tendencies

Method details:
- Major stars: ...
- Life palace analysis: ...
```

## Classic Reference Strategy

本次採「經典參考清單 + 分析視角」，而非要求 GPT 逐本套用。

原因：

- prompt 長度仍可控
- 不會讓 GPT 假裝做精確書籍引用
- 能保留傳統脈絡感，同時維持可讀性

### Suggested Reference Style

- 每種方法列 1 到 3 個最具代表性的傳統/經典來源
- 若某方法本身是現代系統（如 tarot / numerology），則使用其常見權威文本或代表流派著作

## Method-Specific Data Design

### Config Shape

建議建立統一設定結構，例如：

```ts
interface GptMethodConfig {
  label: string
  classicReferences: string[]
  analysisLens: string[]
  buildSection: (results: DivinationResults) => string[]
}
```

### Benefits

- 統一維護方法文案
- 測試能直接驗證每個方法的經典與視角是否存在
- 可逐步擴充，而不破壞既有組 prompt 邏輯

## Data Handling Rules

- 缺資料時仍要保留方法區塊
- `Method details` 中對缺漏欄位顯示 `unavailable`
- 即使資料缺漏，也保留 `Classic references` 與 `Analysis lens`，讓 GPT 知道應用什麼脈絡但同時注意不確定性

## Testing Strategy

### `src/utils/gptPromptTemplate.test.ts`

新增或更新測試，覆蓋：

- 所有方法都能出現在 prompt
- 每個方法區塊包含 `Classic references`
- 每個方法區塊包含 `Analysis lens`
- 缺資料時 prompt 仍可讀
- 非空方法選擇時不再被過濾掉東方方法

### Regression Focus

- 舊有 3 種方法的資訊不可丟失
- `hasSupportedGptMethods()` 行為需同步更新為全方法可用，或直接調整為「有選方法即支援」

## Open Decisions Resolved

- 支援範圍：全部方法
- 呈現方式：經典參考清單 + 分析視角
- 架構：方法設定表驅動
- GPT 指示：以經典脈絡綜合分析，但不得假裝逐字引用

## Implementation Notes

- 儘量把方法 metadata 與 section builder 放在同一檔案或同一模組，避免分散維護
- 經典名稱以穩定、常見稱呼為主，不追求學術版本細節
- prompt 要避免過度膨脹，analysis lens 每方法控制在 2 到 3 點
- 若未來想做多語系 prompt，可把 metadata 外移成翻譯資源，但 v1 先維持英文 prompt + 中文/英文經典名稱混合可接受
