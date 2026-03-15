# PDF Export v1 Design

## Goal

提供「純文字摘要型」PDF 匯出，讓使用者可以把單次分析結果下載成含頁首與匯出時間的可讀 PDF 文件，內容以 `buildResultSummary()` 為唯一資料來源。

## Scope

### In Scope

- 在結果頁提供 PDF 匯出入口
- 以 `buildResultSummary()` 為主體內容生成 PDF
- PDF 頁首顯示 app 名稱與匯出時間
- 採用內嵌中文字型，優先保證 zh-TW 顯示正確
- 支援基本自動換行與跨頁
- 補齊 util、button 與 i18n 測試

### Out of Scope

- 圖片型或截圖型 PDF
- 複雜排版、品牌視覺模板、頁碼設計
- 匯出歷史批次 PDF
- 多種紙張尺寸與版型切換
- 雲端儲存或分享連結

## Problem Statement

目前 `src/components/ExportButton/index.tsx` 的 PDF 匯出是呼叫 `exportAsPDF(targetId, filename)`，偏向 DOM/畫面匯出模式，不符合這次確認的「純文字摘要型」需求。現有 `src/utils/resultSummary.ts` 已經能穩定產生跨方法的一致摘要，因此最小可行方案應該改為：用 `buildResultSummary()` 生成文字內容，再交給 `jsPDF` 輸出真正的文字 PDF，而不是抓畫面。

## User Experience

### Primary Flow

1. 使用者完成分析並看到結果頁
2. 點擊「匯出 PDF」
3. 系統生成一份 PDF，內容包含頁首與摘要
4. 下載檔名維持既有 `filename` 規則

### PDF Content

PDF v1 內容固定為：

1. `CounselingNow`
2. 匯出時間
3. 空行
4. `buildResultSummary()` 的完整內容

### Failure Handling

- 若 PDF 生成失敗，按鈕維持可重試
- 顯示既有失敗提示，不額外引入複雜 toast 系統

## Architecture

### 1. Document Builder Layer

新增一個 PDF 專用文字組裝 helper，例如：

`src/utils/pdfSummaryDocument.ts`

責任：

- 接收 `summaryText`
- 接收匯出時間與可選翻譯器
- 輸出完整 PDF 文字內容

輸出範例：

```text
CounselingNow
匯出時間：2026/03/14 14:30

諮商時機摘要
問題：...
已選方法：...
...
```

這個 helper 不關心 PDF API，只負責文字內容。

### 2. PDF Export Layer

在 `src/utils/export.ts` 新增文字 PDF 專用 helper，例如：

- `exportSummaryAsPDF()`

責任：

- 建立 `jsPDF` 實例
- 載入並註冊內嵌中文字型
- 將完整文件文字分段、自動換行
- 在超出頁面高度時新增頁面
- 觸發 `doc.save(filename)`

### 3. Font Strategy

PDF v1 採「中文優先字型內嵌」。

建議方式：

- 將可分發的中文字型轉成 jsPDF 可讀的 base64 模組
- 新增 `src/assets/fonts/` 或 `src/utils/pdfFont.ts`
- 匯出時統一註冊該字型並設為當前字型

這樣可避免系統字型依賴，確保 zh-TW 內容不亂碼。

### 4. UI Layer

#### `src/components/ExportButton/index.tsx`

- PDF 按鈕不再需要 `targetId` 來生成 PDF 內容
- 改為直接接收摘要所需資料，或直接接收 `summaryText`
- 圖片匯出可暫時維持既有 `targetId` 流程

建議最小改法：

- `ExportButton` 新增 `summaryText` prop
- `handleExportPDF()` 呼叫新 helper

### 5. Integration Point

在結果頁所在容器，由父層先生成 `summaryText` 並傳給 `ExportButton`，避免 button 自己重複拼裝業務資料。

這樣可以保持：

- `resultSummary.ts` 負責內容
- `pdfSummaryDocument.ts` 負責文件包裝
- `export.ts` 負責 PDF 寫入

## Data Flow

```text
Result page data
  -> buildResultSummary(...)
  -> summaryText
  -> buildPdfSummaryDocument({ summaryText, exportedAt })
  -> exportSummaryAsPDF({ content, filename })
  -> jsPDF save()
```

## Internationalization

需要新增 PDF 匯出相關文案，例如：

- `export.pdfTitle` 或共用 app title
- `export.exportedAt`
- `export.exporting`
- `export.exportPdf`
- `export.exportPdfFailed`

若未提供翻譯，v1 可先有 fallback 文案。

## Error Handling

- `summaryText` 為空時仍可匯出，但內容至少包含頁首與 fallback 文案
- 字型註冊失敗時直接丟錯給 UI，由按鈕顯示失敗提示
- 若 `jsPDF` 寫入過程出錯，不應影響目前頁面狀態

## Testing Strategy

### Document Builder Tests

`src/utils/pdfSummaryDocument.test.ts`

- 內容包含 app 名稱
- 內容包含匯出時間 label
- 內容包含傳入的摘要本文
- 空摘要時顯示 fallback

### Export Utility Tests

`src/utils/export.test.ts`

- 驗證 `jsPDF` 被建立
- 驗證字型註冊流程被呼叫
- 驗證長文字會經過 split/wrap 流程
- 驗證最後呼叫 `save()`

### Component Tests

`src/components/ExportButton/index.test.tsx`

- 點 PDF 按鈕會呼叫新的文字 PDF helper
- 匯出失敗時顯示失敗提示
- 匯出中狀態正確禁用按鈕

## Resolved Decisions

- 匯出形式：純文字摘要型
- 內容來源：`buildResultSummary()`
- 文件包裝：加頁首與匯出時間
- 字型策略：中文優先字型內嵌
- v1 不做截圖型 PDF，也不做進階視覺排版

## Implementation Notes

- 儘量避免讓 `ExportButton` 重複知道太多結果結構
- 若現有 `exportAsPDF()` 是 DOM 匯出專用，可保留並新增新函式，而不是直接覆蓋舊語意
- 匯出時間建議統一在 helper 內格式化，避免各處字串格式不一致
- 若字型檔太大，需注意 bundle 體積，但 v1 先以正確顯示中文為優先
