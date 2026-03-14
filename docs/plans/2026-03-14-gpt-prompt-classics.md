# GPT Prompt Classics Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Expand the GPT prompt template to cover all divination methods and add classic reference lists plus interpretation lenses so GPT analyzes results from recognizable traditional frameworks.

**Architecture:** Refactor the current supplemental-only prompt builder into a method-config-driven system. Each method config defines its label, classic references, analysis lens bullets, and result section builder. `buildGptPrompt()` then assembles a global instruction block plus one structured section per selected method.

**Tech Stack:** TypeScript, Vitest

---

### Task 1: Add a config-driven prompt shape for existing methods

**Files:**
- Modify: `src/utils/gptPromptTemplate.ts`
- Test: `src/utils/gptPromptTemplate.test.ts`

**Step 1: Write the failing test**

Add a test that verifies an existing method block now includes `Classic references` and `Analysis lens` sections.

```ts
it('includes classic references and analysis lens for western astrology', () => {
  const prompt = buildGptPrompt(makePromptInput(['western-astro']))

  expect(prompt).toContain('Classic references:')
  expect(prompt).toContain('Analysis lens:')
  expect(prompt).toContain('[western-astro]')
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/utils/gptPromptTemplate.test.ts`

Expected: FAIL because the prompt does not include those sections yet.

**Step 3: Write minimal implementation**

Refactor `src/utils/gptPromptTemplate.ts` to introduce a method config map for at least the current three supported methods:

```ts
interface GptMethodConfig {
  label: string
  classicReferences: string[]
  analysisLens: string[]
  buildSection: (results: DivinationResults) => string[]
}
```

Then update `buildGptPrompt()` to render:

```ts
lines.push(`[${method}]`)
lines.push('Classic references:')
lines.push(...config.classicReferences.map((item) => `- ${item}`))
lines.push('Analysis lens:')
lines.push(...config.analysisLens.map((item) => `- ${item}`))
lines.push('Method details:')
lines.push(...config.buildSection(divinationResults))
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/utils/gptPromptTemplate.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add src/utils/gptPromptTemplate.ts src/utils/gptPromptTemplate.test.ts
git commit -m "feat(gpt): add classical prompt framing"
```

### Task 2: Add global interpretation instructions

**Files:**
- Modify: `src/utils/gptPromptTemplate.ts`
- Test: `src/utils/gptPromptTemplate.test.ts`

**Step 1: Write the failing test**

Add a test that checks the prompt starts with a clearer instruction block about using traditional interpretive frameworks without pretending to quote texts literally.

```ts
it('adds global guidance for tradition-based synthesis', () => {
  const prompt = buildGptPrompt(makePromptInput(['numerology']))

  expect(prompt).toContain('Use the classic references and interpretive lenses below')
  expect(prompt).toContain('Do not present invented direct quotations')
  expect(prompt).toContain('Note uncertainty where data is incomplete')
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/utils/gptPromptTemplate.test.ts`

Expected: FAIL because the old opening text is still generic.

**Step 3: Write minimal implementation**

Replace the existing prompt opening with a more structured instruction block.

```ts
const lines = [
  'Please synthesize these divination results into a clear reading.',
  'Use the classic references and interpretive lenses below as guiding frameworks.',
  'Do not present invented direct quotations from those works.',
  'Note uncertainty where data is incomplete.',
  'Highlight where multiple methods converge or differ.',
  ...
]
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/utils/gptPromptTemplate.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add src/utils/gptPromptTemplate.ts src/utils/gptPromptTemplate.test.ts
git commit -m "feat(gpt): strengthen synthesis instructions"
```

### Task 3: Expand GPT prompt support to all methods

**Files:**
- Modify: `src/utils/gptPromptTemplate.ts`
- Test: `src/utils/gptPromptTemplate.test.ts`

**Step 1: Write the failing test**

Add a test that selects all methods and expects each method block to appear.

```ts
it('includes all divination methods in the prompt body', () => {
  const prompt = buildGptPrompt(makePromptInput([
    'ziwei',
    'bazi',
    'iching',
    'liuyao',
    'tarot',
    'western-astro',
    'vedic-astro',
    'numerology',
  ]))

  expect(prompt).toContain('[ziwei]')
  expect(prompt).toContain('[bazi]')
  expect(prompt).toContain('[iching]')
  expect(prompt).toContain('[liuyao]')
  expect(prompt).toContain('[tarot]')
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/utils/gptPromptTemplate.test.ts`

Expected: FAIL because only the prior three methods are supported.

**Step 3: Write minimal implementation**

In `src/utils/gptPromptTemplate.ts`:

- Remove `SupportedGptMethod` restriction or expand it to all methods
- Add config entries and section builders for:
  - `ziwei`
  - `bazi`
  - `iching`
  - `liuyao`
  - `tarot`

Keep existing section builders for supplemental methods and add matching metadata.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/utils/gptPromptTemplate.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add src/utils/gptPromptTemplate.ts src/utils/gptPromptTemplate.test.ts
git commit -m "feat(gpt): cover all divination methods"
```

### Task 4: Add classics and lenses for Eastern methods

**Files:**
- Modify: `src/utils/gptPromptTemplate.ts`
- Test: `src/utils/gptPromptTemplate.test.ts`

**Step 1: Write the failing test**

Add a test that verifies Eastern methods include specific classic references and analysis lens bullets.

```ts
it('adds classic references and interpretation lenses for eastern methods', () => {
  const prompt = buildGptPrompt(makePromptInput(['ziwei', 'bazi', 'iching', 'liuyao']))

  expect(prompt).toContain('紫微斗數全書')
  expect(prompt).toContain('淵海子平')
  expect(prompt).toContain('周易')
  expect(prompt).toContain('增刪卜易')
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/utils/gptPromptTemplate.test.ts`

Expected: FAIL until the metadata is added.

**Step 3: Write minimal implementation**

Add method metadata for Eastern systems, for example:

```ts
ziwei: {
  label: 'Zi Wei Dou Shu',
  classicReferences: ['紫微斗數全書', '紫微斗數全集'],
  analysisLens: [
    'Focus on life palace structure, major stars, and temperament patterns',
    'Infer counseling timing from stress tendencies and personality dynamics',
  ],
  buildSection: buildZiweiSection,
}
```

Repeat the same pattern for `bazi`, `iching`, and `liuyao`.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/utils/gptPromptTemplate.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add src/utils/gptPromptTemplate.ts src/utils/gptPromptTemplate.test.ts
git commit -m "feat(gpt): add eastern classical references"
```

### Task 5: Add classics and lenses for tarot and modern systems

**Files:**
- Modify: `src/utils/gptPromptTemplate.ts`
- Test: `src/utils/gptPromptTemplate.test.ts`

**Step 1: Write the failing test**

Add a test that verifies tarot, western astrology, vedic astrology, and numerology include classic references and method-specific lenses.

```ts
it('adds classic references and lenses for tarot and supplemental systems', () => {
  const prompt = buildGptPrompt(makePromptInput(['tarot', 'western-astro', 'vedic-astro', 'numerology']))

  expect(prompt).toContain('The Pictorial Key to the Tarot')
  expect(prompt).toContain('Tetrabiblos')
  expect(prompt).toContain('Brihat Parashara Hora Shastra')
  expect(prompt).toContain('The Complete Book of Numerology')
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/utils/gptPromptTemplate.test.ts`

Expected: FAIL until metadata is complete.

**Step 3: Write minimal implementation**

Add/complete metadata for:

- `tarot`
- `western-astro`
- `vedic-astro`
- `numerology`

Keep each method to 1-3 references and 2-3 analysis lens bullets.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/utils/gptPromptTemplate.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add src/utils/gptPromptTemplate.ts src/utils/gptPromptTemplate.test.ts
git commit -m "feat(gpt): add cross-tradition reference lenses"
```

### Task 6: Update support detection logic

**Files:**
- Modify: `src/utils/gptPromptTemplate.ts`
- Test: `src/utils/gptPromptTemplate.test.ts`

**Step 1: Write the failing test**

Add a test that confirms `hasSupportedGptMethods()` returns `true` for any selected supported method, including formerly unsupported ones.

```ts
it('treats all divination methods as supported for GPT prompts', () => {
  expect(hasSupportedGptMethods(['iching'])).toBe(true)
  expect(hasSupportedGptMethods(['tarot'])).toBe(true)
  expect(hasSupportedGptMethods(['ziwei'])).toBe(true)
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/utils/gptPromptTemplate.test.ts`

Expected: FAIL because the helper still only knows the old subset.

**Step 3: Write minimal implementation**

Update `hasSupportedGptMethods()` and any related helper to use the new config-driven method set.

```ts
const GPT_METHOD_CONFIG: Partial<Record<DivinationMethod, GptMethodConfig>> = { ... }

export function hasSupportedGptMethods(methods: DivinationMethod[]): boolean {
  return methods.some((method) => method in GPT_METHOD_CONFIG)
}
```

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/utils/gptPromptTemplate.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add src/utils/gptPromptTemplate.ts src/utils/gptPromptTemplate.test.ts
git commit -m "feat(gpt): align supported prompt methods"
```

### Task 7: Run focused verification

**Files:**
- No code changes required unless tests fail

**Step 1: Run focused tests**

Run:

```bash
npm test -- --run src/utils/gptPromptTemplate.test.ts
```

Expected: PASS

**Step 2: Fix any failures minimally**

If tests fail, update only the prompt builder and its tests.

**Step 3: Re-run focused tests**

Run the same command again.

Expected: PASS

**Step 4: Commit**

```bash
git add src/utils/gptPromptTemplate.ts src/utils/gptPromptTemplate.test.ts
git commit -m "test(gpt): verify classical prompt coverage"
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
git commit -m "chore: finalize gpt classical prompt upgrade"
```
