# PDF Export v1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Export a single analysis result as a text-based PDF with a header and export timestamp, using `buildResultSummary()` as the only content source.

**Architecture:** Build the summary text first, wrap it in a PDF document helper that adds the header and export time, then hand that text to a jsPDF utility that embeds a Chinese-capable font and writes paginated text output. Keep the PDF generation logic in utilities and keep the button thin.

**Tech Stack:** React, TypeScript, jsPDF, Vitest, React Testing Library, i18next

---

### Task 1: Add a PDF document text builder

**Files:**
- Create: `src/utils/pdfSummaryDocument.ts`
- Test: `src/utils/pdfSummaryDocument.test.ts`

**Step 1: Write the failing test**

Create `src/utils/pdfSummaryDocument.test.ts` with a test that verifies the built document contains the app title, export time label, and the incoming summary body.

```ts
it('builds a PDF summary document with header and summary body', () => {
  const content = buildPdfSummaryDocument({
    summaryText: '諮商時機摘要\n問題：現在適合開始諮商嗎？',
    exportedAt: new Date('2026-03-14T14:30:00Z'),
  })

  expect(content).toContain('CounselingNow')
  expect(content).toContain('匯出時間')
  expect(content).toContain('諮商時機摘要')
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/utils/pdfSummaryDocument.test.ts`

Expected: FAIL because the helper does not exist yet.

**Step 3: Write minimal implementation**

Create `src/utils/pdfSummaryDocument.ts` with:

- `buildPdfSummaryDocument()`
- fallback title `CounselingNow`
- fallback label `匯出時間`
- simple date formatting with `toLocaleString('zh-TW')`

```ts
export function buildPdfSummaryDocument({ summaryText, exportedAt = new Date() }: BuildPdfSummaryDocumentInput): string {
  const body = summaryText.trim() || '詳細資料暫缺'
  const timestamp = exportedAt.toLocaleString('zh-TW', { hour12: false })

  return ['CounselingNow', `匯出時間：${timestamp}`, '', body].join('\n').trim()
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/utils/pdfSummaryDocument.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add src/utils/pdfSummaryDocument.ts src/utils/pdfSummaryDocument.test.ts
git commit -m "feat(pdf): add summary document builder"
```

### Task 2: Add PDF document fallback coverage

**Files:**
- Modify: `src/utils/pdfSummaryDocument.test.ts`

**Step 1: Write the failing test**

Add a test that passes blank summary text and expects the helper to emit fallback content instead of an empty document.

```ts
it('falls back when summary text is blank', () => {
  const content = buildPdfSummaryDocument({ summaryText: '   ' })
  expect(content).toContain('詳細資料暫缺')
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/utils/pdfSummaryDocument.test.ts`

Expected: FAIL if blank input is not handled.

**Step 3: Write minimal implementation**

Keep the helper trimming logic and fallback body behavior.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/utils/pdfSummaryDocument.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add src/utils/pdfSummaryDocument.test.ts src/utils/pdfSummaryDocument.ts
git commit -m "test(pdf): cover summary document fallbacks"
```

### Task 3: Add text-based PDF export utility

**Files:**
- Modify: `src/utils/export.ts`
- Create: `src/utils/export.test.ts`
- Create or modify: `src/utils/pdfFont.ts`

**Step 1: Write the failing test**

Create `src/utils/export.test.ts` with a test that mocks `jspdf` and verifies `exportSummaryAsPDF()` registers a font, writes text, and saves a file.

```ts
it('exports a summary PDF with embedded font setup', async () => {
  await exportSummaryAsPDF({
    content: 'CounselingNow\n匯出時間：2026/03/14 14:30\n\n諮商時機摘要',
    filename: 'report',
  })

  expect(mockAddFileToVFS).toHaveBeenCalled()
  expect(mockAddFont).toHaveBeenCalled()
  expect(mockText).toHaveBeenCalled()
  expect(mockSave).toHaveBeenCalledWith('report.pdf')
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/utils/export.test.ts`

Expected: FAIL because the helper and font module do not exist yet.

**Step 3: Write minimal implementation**

In `src/utils/export.ts`:

- Keep existing image export helpers intact
- Add `exportSummaryAsPDF({ content, filename })`
- Initialize `jsPDF`
- Register embedded font from `src/utils/pdfFont.ts`
- Split text to width and paginate vertically

In `src/utils/pdfFont.ts`:

- Export font metadata and base64 payload constant placeholder

```ts
export const PDF_FONT_FAMILY = 'NotoSansTC'
export const PDF_FONT_FILE = 'NotoSansTC-Regular.ttf'
export const PDF_FONT_DATA = '...base64...'
```

```ts
const doc = new jsPDF({ unit: 'pt', format: 'a4' })
doc.addFileToVFS(PDF_FONT_FILE, PDF_FONT_DATA)
doc.addFont(PDF_FONT_FILE, PDF_FONT_FAMILY, 'normal')
doc.setFont(PDF_FONT_FAMILY, 'normal')
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/utils/export.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add src/utils/export.ts src/utils/export.test.ts src/utils/pdfFont.ts
git commit -m "feat(pdf): add text-based pdf export utility"
```

### Task 4: Wire PDF export through the button

**Files:**
- Modify: `src/components/ExportButton/index.tsx`
- Test: `src/components/ExportButton/index.test.tsx`

**Step 1: Write the failing test**

Create or update `src/components/ExportButton/index.test.tsx` to verify the PDF button calls the new text-based export helper with `summaryText` instead of `targetId`.

```tsx
it('exports PDF from summary text', async () => {
  render(<ExportButton targetId="result-panel" summaryText="諮商時機摘要" filename="report" />)

  await user.click(screen.getByRole('button', { name: /匯出 PDF/i }))

  expect(exportSummaryAsPDF).toHaveBeenCalledWith(
    expect.objectContaining({
      filename: 'report',
    }),
  )
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/ExportButton/index.test.tsx`

Expected: FAIL because the component still calls DOM export.

**Step 3: Write minimal implementation**

Update `src/components/ExportButton/index.tsx`:

- Add `summaryText` prop
- Use `buildPdfSummaryDocument()` inside `handleExportPDF()`
- Call `exportSummaryAsPDF()`
- Keep image export behavior unchanged

```tsx
const content = buildPdfSummaryDocument({ summaryText })
await exportSummaryAsPDF({ content, filename })
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/ExportButton/index.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add src/components/ExportButton/index.tsx src/components/ExportButton/index.test.tsx
git commit -m "feat(pdf): connect export button to summary pdf"
```

### Task 5: Integrate summary text into the result page export entry

**Files:**
- Modify: `src/App.tsx`
- Test: `src/App.test.ts`

**Step 1: Write the failing test**

Add an app test that renders step 3 and verifies the export button receives a non-empty summary string when result data exists.

```ts
it('passes summary text to the export button on the result page', () => {
  render(createElement(App))
  expect(screen.getByRole('button', { name: /匯出 PDF/i })).toBeTruthy()
})
```

If the export button is mocked, assert it receives `summaryText`.

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/App.test.ts`

Expected: FAIL because the export button is not connected to summary-based PDF content.

**Step 3: Write minimal implementation**

In `src/App.tsx`:

- Reuse existing result summary generation at render time for export button props if needed
- Pass `summaryText` into `ExportButton`

```tsx
const exportSummaryText = buildResultSummary({
  question,
  selectedMethods,
  divinationResults,
  result,
  t,
})
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/App.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add src/App.tsx src/App.test.ts
git commit -m "feat(pdf): provide summary text to export action"
```

### Task 6: Add export labels and error copy

**Files:**
- Modify: `src/i18n/locales/zh-TW.json`
- Modify: `src/i18n/locales/en.json`
- Test: `src/components/ExportButton/index.test.tsx`

**Step 1: Write the failing test**

Extend the export button test to verify localized exporting and error text are rendered.

```tsx
it('shows a localized failure message when PDF export fails', async () => {
  vi.mocked(exportSummaryAsPDF).mockRejectedValueOnce(new Error('boom'))
  render(<ExportButton targetId="result" summaryText="summary" />)

  await user.click(screen.getByRole('button', { name: /匯出 PDF/i }))

  expect(window.alert).toHaveBeenCalledWith('匯出 PDF 失敗，請稍後再試')
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/ExportButton/index.test.tsx`

Expected: FAIL if the button still uses hardcoded strings or wrong helper.

**Step 3: Write minimal implementation**

Add i18n keys for:

- `export.exportImage`
- `export.exportPdf`
- `export.exporting`
- `export.exportImageFailed`
- `export.exportPdfFailed`
- `export.exportedAt`

Update the button to use `useTranslation()`.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/ExportButton/index.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add src/i18n/locales/zh-TW.json src/i18n/locales/en.json src/components/ExportButton/index.tsx src/components/ExportButton/index.test.tsx
git commit -m "feat(pdf): localize export actions"
```

### Task 7: Run focused verification

**Files:**
- No code changes required unless tests fail

**Step 1: Run focused tests**

Run:

```bash
npm test -- --run src/utils/pdfSummaryDocument.test.ts src/utils/export.test.ts src/components/ExportButton/index.test.tsx src/App.test.ts
```

Expected: PASS

**Step 2: Fix any focused failures minimally**

If tests fail, change only the affected files and keep the PDF responsibilities separated.

**Step 3: Re-run focused tests**

Run the same command again.

Expected: PASS

**Step 4: Commit**

```bash
git add .
git commit -m "test(pdf): verify summary export flow"
```

### Task 8: Run full verification

**Files:**
- No code changes required unless verification fails

**Step 1: Run full test suite**

Run: `npm test -- --run`

Expected: PASS

**Step 2: Run production build**

Run: `npm run build`

Expected: PASS

**Step 3: Commit final fixes if needed**

```bash
git add .
git commit -m "chore: finalize pdf export v1"
```
