# GPT Full Context Prompt Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enrich the GPT prompt with full personal and metaphysical context, including name, gender, birth date, birth hour, birth location, and Ba Zi core fields, so GPT can produce more grounded synthesis.

**Architecture:** Extend the prompt builder input shape to include full user profile data from `useAppStore`, then render two new prompt sections before the existing method blocks: `Personal profile` and `Core metaphysical context`. Keep the method-specific classical framework sections intact and add UI disclosure text in `GPTIntegration`.

**Tech Stack:** React, TypeScript, Vitest, React Testing Library, i18next

---

### Task 1: Extend the GPT prompt input shape

**Files:**
- Modify: `src/utils/gptPromptTemplate.ts`
- Test: `src/utils/gptPromptTemplate.test.ts`

**Step 1: Write the failing test**

Add a test that expects the prompt to include a `Personal profile` section with name, gender, birth date, birth hour, and birth location.

```ts
it('includes a personal profile section with full user context', () => {
  const prompt = buildGptPrompt(makePromptInput(['bazi']))

  expect(prompt).toContain('Personal profile:')
  expect(prompt).toContain('- Name: 王小明')
  expect(prompt).toContain('- Gender: male')
  expect(prompt).toContain('- Birth date (Gregorian): 1990-05-10')
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/utils/gptPromptTemplate.test.ts`

Expected: FAIL because the prompt input and output do not include that context yet.

**Step 3: Write minimal implementation**

Update `BuildGptPromptInput` to include:

- `name`
- `gender`
- `birthDate`
- `birthHour`
- `locationName`

Then add a `Personal profile:` block before the selected methods list.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/utils/gptPromptTemplate.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add src/utils/gptPromptTemplate.ts src/utils/gptPromptTemplate.test.ts
git commit -m "feat(gpt): add personal profile context"
```

### Task 2: Add core metaphysical context

**Files:**
- Modify: `src/utils/gptPromptTemplate.ts`
- Test: `src/utils/gptPromptTemplate.test.ts`

**Step 1: Write the failing test**

Add a test that verifies Ba Zi core fields are surfaced in a `Core metaphysical context` section.

```ts
it('includes core metaphysical context from bazi results', () => {
  const prompt = buildGptPrompt(makePromptInput(['bazi']))

  expect(prompt).toContain('Core metaphysical context:')
  expect(prompt).toContain('- Four pillars: 甲子、乙丑、丙寅、丁卯')
  expect(prompt).toContain('- Day master: 丙火')
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/utils/gptPromptTemplate.test.ts`

Expected: FAIL because the prompt does not have this section yet.

**Step 3: Write minimal implementation**

Add a helper in `src/utils/gptPromptTemplate.ts` that reads Ba Zi fields from `divinationResults.bazi` and renders:

- `Four pillars`
- `Day master`
- `Dominant wuxing`
- `Deficient wuxing`

If missing, use `unavailable`.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/utils/gptPromptTemplate.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add src/utils/gptPromptTemplate.ts src/utils/gptPromptTemplate.test.ts
git commit -m "feat(gpt): add core metaphysical context"
```

### Task 3: Add privacy notice and stronger synthesis guidance

**Files:**
- Modify: `src/utils/gptPromptTemplate.ts`
- Test: `src/utils/gptPromptTemplate.test.ts`

**Step 1: Write the failing test**

Add a test that checks for a privacy notice about full personal data and a stronger instruction to avoid repeating unnecessary personal data in the answer.

```ts
it('adds a privacy notice for full personal context', () => {
  const prompt = buildGptPrompt(makePromptInput(['ziwei']))

  expect(prompt).toContain('This prompt contains full personal profile data')
  expect(prompt).toContain('Do not repeat unnecessary personal identifiers')
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/utils/gptPromptTemplate.test.ts`

Expected: FAIL because this guidance does not exist yet.

**Step 3: Write minimal implementation**

Add a short privacy/instruction block near the top of the prompt.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/utils/gptPromptTemplate.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add src/utils/gptPromptTemplate.ts src/utils/gptPromptTemplate.test.ts
git commit -m "feat(gpt): add privacy-aware prompt guidance"
```

### Task 4: Pass full context from GPTIntegration

**Files:**
- Modify: `src/components/Results/GPTIntegration.tsx`
- Test: `src/components/Results/GPTIntegration.test.tsx`

**Step 1: Write the failing test**

Add a component test that seeds the store with name, birth data, and location, then verifies `buildGptPrompt()` receives those fields.

```ts
it('passes full personal context into the GPT prompt builder', () => {
  expect(buildGptPrompt).toHaveBeenCalledWith(
    expect.objectContaining({
      name: '王小明',
      birthDate: '1990-05-10',
      birthHour: 8,
      locationName: 'Taipei',
    }),
  )
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/Results/GPTIntegration.test.tsx`

Expected: FAIL because `GPTIntegration` only passes question/methods/results today.

**Step 3: Write minimal implementation**

Update `GPTIntegration.tsx` to read from `useAppStore`:

- `name`
- `gender`
- `birthDate`
- `birthHour`
- `location.city`

Pass them into `buildGptPrompt()`.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/Results/GPTIntegration.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add src/components/Results/GPTIntegration.tsx src/components/Results/GPTIntegration.test.tsx
git commit -m "feat(gpt): pass full profile data to prompts"
```

### Task 5: Add UI disclosure text for personal data

**Files:**
- Modify: `src/components/Results/GPTIntegration.tsx`
- Modify: `src/i18n/locales/zh-TW.json`
- Modify: `src/i18n/locales/en.json`
- Test: `src/components/Results/GPTIntegration.test.tsx`

**Step 1: Write the failing test**

Add a test that checks for a disclosure message stating the prompt contains personal data such as name, birth details, and location.

```ts
it('shows a disclosure that the prompt contains full personal data', () => {
  render(<GPTIntegration />)
  expect(screen.getByText(/姓名、生日、生辰與出生地/i)).toBeTruthy()
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/components/Results/GPTIntegration.test.tsx`

Expected: FAIL because the disclosure does not exist yet.

**Step 3: Write minimal implementation**

Add `gpt.personalDataNotice` translation keys and render the text in `GPTIntegration.tsx` near the description.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/components/Results/GPTIntegration.test.tsx`

Expected: PASS

**Step 5: Commit**

```bash
git add src/components/Results/GPTIntegration.tsx src/components/Results/GPTIntegration.test.tsx src/i18n/locales/zh-TW.json src/i18n/locales/en.json
git commit -m "feat(gpt): disclose personal data in prompt UI"
```

### Task 6: Tighten prompt output instructions

**Files:**
- Modify: `src/utils/gptPromptTemplate.ts`
- Test: `src/utils/gptPromptTemplate.test.ts`

**Step 1: Write the failing test**

Add a test that checks for explicit final output instructions to synthesize overall judgment, method convergence/divergence, and concrete guidance.

```ts
it('asks GPT for concrete synthesis instead of raw restatement', () => {
  const prompt = buildGptPrompt(makePromptInput(['ziwei', 'bazi']))

  expect(prompt).toContain('Start with an overall judgment')
  expect(prompt).toContain('Explain where methods converge or diverge')
  expect(prompt).toContain('End with concrete guidance')
})
```

**Step 2: Run test to verify it fails**

Run: `npm test -- --run src/utils/gptPromptTemplate.test.ts`

Expected: FAIL because the final answer format is not explicit enough yet.

**Step 3: Write minimal implementation**

Add a short `Final response requirements:` block near the end of the prompt.

**Step 4: Run test to verify it passes**

Run: `npm test -- --run src/utils/gptPromptTemplate.test.ts`

Expected: PASS

**Step 5: Commit**

```bash
git add src/utils/gptPromptTemplate.ts src/utils/gptPromptTemplate.test.ts
git commit -m "feat(gpt): refine final synthesis instructions"
```

### Task 7: Run focused verification

**Files:**
- No code changes required unless tests fail

**Step 1: Run focused tests**

Run:

```bash
npm test -- --run src/utils/gptPromptTemplate.test.ts src/components/Results/GPTIntegration.test.tsx
```

Expected: PASS

**Step 2: Fix any failures minimally**

If failures appear, update only the prompt builder, GPT integration component, or related i18n.

**Step 3: Re-run focused tests**

Run the same command again.

Expected: PASS

**Step 4: Commit**

```bash
git add .
git commit -m "test(gpt): verify full-context prompt flow"
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
git commit -m "chore: finalize full-context gpt prompt"
```
