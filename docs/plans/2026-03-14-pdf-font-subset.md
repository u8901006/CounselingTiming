# PDF Font Subset Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current full embedded PDF font with a static subset font artifact so PDF export stays functional while significantly reducing the `pdfFont` chunk size.

**Architecture:** Keep the runtime PDF export API unchanged and optimize only the font asset pipeline. Generate a fixed character subset from known PDF strings, convert the subset font into a smaller base64 module, and verify the reduced build artifact size plus unchanged export behavior.

**Tech Stack:** TypeScript, Python, local font tooling, Vitest, Vite

---

### Task 1: Define the subset character source list

**Files:**
- Create: `scripts/pdf-font-chars.txt`
- Test: `src/utils/pdfSummaryDocument.test.ts`

**Step 1: Write the failing test**

Add a test in `src/utils/pdfSummaryDocument.test.ts` that covers a representative set of fixed PDF strings and common summary labels so there is a stable reference for the subset text content.

```ts
it('builds a document containing the fixed PDF header labels', () => {
  const content = buildPdfSummaryDocument({ summaryText: '諮商時機摘要' })

  expect(content).toContain('CounselingNow')
  expect(content).toContain('匯出時間')
  expect(content).toContain('諮商時機摘要')
})
```

**Step 2: Run test to verify it fails only if coverage is missing**

Run: `npm test -- --run src/utils/pdfSummaryDocument.test.ts`

Expected: If already green, proceed and treat this as regression coverage for the subset source.

**Step 3: Write minimal implementation**

Create `scripts/pdf-font-chars.txt` and populate it with:

- fixed PDF labels
- common `resultSummary` labels
- ASCII letters and digits
- common punctuation

Example starting content:

```text
CounselingNow
匯出時間
諮商時機摘要
問題
已選方法
綜合建議
0123456789
ABCDEFGHIJKLMNOPQRSTUVWXYZ
abcdefghijklmnopqrstuvwxyz
：、，。()[]-_/ 
```

**Step 4: Run the test to confirm no regression**

Run: `npm test -- --run src/utils/pdfSummaryDocument.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add scripts/pdf-font-chars.txt src/utils/pdfSummaryDocument.test.ts
git commit -m "build(pdf): define subset font characters"
```

### Task 2: Add a repeatable subset generation script

**Files:**
- Create: `scripts/generate-pdf-font-subset.py`
- Modify: `src/utils/pdfFont.ts`

**Step 1: Write the failing verification step**

Attempt to run a not-yet-existing generator script.

Run: `python scripts/generate-pdf-font-subset.py`

Expected: FAIL because the script does not exist yet.

**Step 2: Write minimal implementation**

Create `scripts/generate-pdf-font-subset.py` that:

- reads `scripts/pdf-font-chars.txt`
- loads the source font (for example `C:\Windows\Fonts\kaiu.ttf`)
- uses local font tooling to generate a subset font if available
- base64-encodes the subset font
- writes `src/utils/pdfFont.ts`

If a real subsetting library is unavailable, implement the script so it documents the required tool invocation and fails clearly instead of silently generating the full font.

**Step 3: Run the script to verify it works**

Run: `python scripts/generate-pdf-font-subset.py`

Expected: PASS and regenerate `src/utils/pdfFont.ts`

**Step 4: Inspect the generated module**

Run: `python -c "from pathlib import Path; print(Path('src/utils/pdfFont.ts').stat().st_size)"`

Expected: file size is meaningfully smaller than the prior full-font module.

**Step 5: Commit**

```bash
git add scripts/generate-pdf-font-subset.py src/utils/pdfFont.ts
git commit -m "build(pdf): add subset font generator"
```

### Task 3: Verify export utility still works with subset font

**Files:**
- Modify: `src/utils/export.test.ts`

**Step 1: Write the failing test**

Add or tighten a test in `src/utils/export.test.ts` that still expects font registration to happen with the generated subset module.

```ts
it('registers the subset font module before writing text', async () => {
  await exportSummaryAsPDF({ content: '諮商時機摘要', filename: 'report' })

  expect(mockAddFileToVFS).toHaveBeenCalledWith(PDF_FONT_FILE, PDF_FONT_DATA)
})
```

**Step 2: Run test to verify it fails only if the generator changed the contract**

Run: `npm test -- --run src/utils/export.test.ts`

Expected: PASS or fail only if the generated module broke the contract.

**Step 3: Write minimal implementation**

If the module contract changed, restore `PDF_FONT_FAMILY`, `PDF_FONT_FILE`, and `PDF_FONT_DATA` exports in the generated file.

**Step 4: Re-run the test**

Run: `npm test -- --run src/utils/export.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add src/utils/export.test.ts src/utils/pdfFont.ts
git commit -m "test(pdf): keep subset font export contract"
```

### Task 4: Measure build impact

**Files:**
- No source changes required unless the build still bloats unexpectedly

**Step 1: Run production build**

Run: `npm run build`

Expected: PASS

**Step 2: Capture the subset font chunk size**

Read the build output and note the `pdfFont-*.js` size.

Expected: noticeably smaller than the previous ~6.9 MB chunk.

**Step 3: If still too large, reduce the character set minimally**

Edit `scripts/pdf-font-chars.txt` to remove unnecessary characters and regenerate the subset font.

**Step 4: Re-run build**

Run: `npm run build`

Expected: PASS with a smaller font chunk than before.

**Step 5: Commit**

```bash
git add scripts/pdf-font-chars.txt src/utils/pdfFont.ts
git commit -m "perf(pdf): reduce embedded font payload"
```

### Task 5: Run focused verification

**Files:**
- No code changes required unless tests fail

**Step 1: Run focused checks**

Run:

```bash
npm test -- --run src/utils/pdfSummaryDocument.test.ts src/utils/export.test.ts src/components/ExportButton/index.test.tsx
```

Expected: PASS

**Step 2: Fix any focused failures minimally**

If failures appear, change only the font artifact or export utility contract.

**Step 3: Re-run focused checks**

Run the same command again.

Expected: PASS

**Step 4: Commit**

```bash
git add .
git commit -m "test(pdf): verify subset font export flow"
```

### Task 6: Run full verification

**Files:**
- No code changes required unless verification fails

**Step 1: Run full test suite**

Run: `npm test -- --run`

Expected: PASS

**Step 2: Run production build**

Run: `npm run build`

Expected: PASS

**Step 3: Record final size improvement**

Note the new `pdfFont` chunk size in your final report.

**Step 4: Commit final fixes if needed**

```bash
git add .
git commit -m "chore: finalize pdf font subset optimization"
```
