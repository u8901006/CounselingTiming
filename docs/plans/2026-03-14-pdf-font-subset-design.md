# PDF Font Subset Design

## Goal

將目前 PDF 匯出所使用的內嵌中文字型改為靜態子集字型產物，顯著降低 `pdfFont` chunk 體積，同時保留目前 PDF v1 所需的常見中英數與標點顯示能力。

## Scope

### In Scope

- 建立一份最小可用的 PDF 字型字元集
- 以靜態流程生成 subset 字型產物
- 更新 `src/utils/pdfFont.ts` 以使用較小的 base64 payload
- 保持 `exportSummaryAsPDF()` API 不變
- 以 build 產物大小作為主要驗證指標

### Out of Scope

- 執行期動態裁字
- 多字型 fallback 機制
- 後端/伺服器端 PDF 生成
- 針對任意使用者輸入字元做到完整覆蓋

## Problem Statement

目前 `src/utils/pdfFont.ts` 內嵌的是完整字型 base64，雖然已經改為 lazy import，但 build 後仍產生約 `6.9 MB` 的 `pdfFont-*.js` chunk。對 PDF v1 來說，這個體積過大，會讓首次使用 PDF 功能時下載負擔偏高。由於目前 PDF 內容主要來自固定頁首、匯出時間標籤、`resultSummary` 常用欄位與少量動態內容，最實際的優化方式是改用靜態子集字型。

## Recommended Approach

採用「靜態子集字型產物」：

1. 收集 PDF 會用到的最小字元集
2. 用本機字型工具對現有中文字型做 subset
3. 將 subset 字型轉為 base64
4. 覆蓋 `src/utils/pdfFont.ts`

這個方案的好處是：

- 匯出流程維持簡單
- 前端邏輯幾乎不變
- 體積可預期、易驗證

## Character Set Strategy

### 1. Fixed UI Strings

優先納入固定文案：

- `CounselingNow`
- `匯出時間`
- `諮商時機摘要`
- `問題`
- `已選方法`
- `綜合建議`
- 其他 `resultSummary` 常見標籤

### 2. Structural Characters

- 英文大小寫 `A-Z a-z`
- 數字 `0-9`
- 空白、換行、冒號、頓號、逗號、句號、括號、破折號
- 常見星座/占卜標籤中會出現的連字元與斜線

### 3. Common Chinese Coverage

加入目前結果摘要最常見的繁中字，例如：

- 時、機、建、議、分、析、結、果、方、法、本、卦、變、卦、動、爻、月、日、星、座、命、運、數

### 4. Risk Acceptance

因為本次優先目標是最小體積，所以接受：

- 使用者輸入中極少見字可能無法完整顯示在 PDF
- 某些非常用專有名詞可能落字

## Generation Workflow

### Source Font

- 仍使用目前可用的繁中字型來源（例如 `C:\Windows\Fonts\kaiu.ttf`）

### Build Artifact Flow

建議新增一個本機腳本，例如：

- `scripts/generate-pdf-font-subset.py`

流程：

1. 讀取字元清單
2. 使用字型工具生成 subset 字型
3. 輸出 subset `.ttf`
4. 轉 base64 並寫回 `src/utils/pdfFont.ts`

## Code Architecture

### `src/utils/pdfFont.ts`

- 保持目前輸出介面不變：
  - `PDF_FONT_FAMILY`
  - `PDF_FONT_FILE`
  - `PDF_FONT_DATA`

這樣 `src/utils/export.ts` 不需要改 API，只需吃新的較小 payload。

### Optional Metadata

如果有幫助，可以在 `pdfFont.ts` 加入註解或 metadata，例如：

- 來源字型
- subset 生成日期
- 子集用途說明

## Verification Strategy

### Functional Verification

- 既有 `src/utils/export.test.ts` 應保持通過
- 既有 `src/components/ExportButton/index.test.tsx` 應保持通過

### Build Verification

- `npm run build`
- 比較 `dist/assets/pdfFont-*.js` 體積
- 目標是明顯小於目前約 `6.9 MB`

### Manual Smoke Check

建議匯出一份含常見中文欄位的 PDF，確認：

- 頁首正常
- 中文欄位不亂碼
- 英數時間正常

## Success Criteria

- PDF 文字匯出功能維持可用
- 測試與 build 都通過
- `pdfFont` chunk 明顯縮小
- 不需要重寫 PDF 匯出邏輯

## Open Decisions Resolved

- 目標優先級：最小體積
- 技術方案：靜態子集字型產物
- API 策略：沿用現有 `exportSummaryAsPDF()` 介面

## Implementation Notes

- 這次是「體積優先」優化，不追求完整字形覆蓋
- 如果之後缺字回報變多，再考慮第二階段做 fallback font 或擴大字集
- 最好把字元清單來源也保存下來，避免日後無法重建 subset
