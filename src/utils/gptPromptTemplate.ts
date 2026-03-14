import { formatLiuyaoResult } from '../modules/liuyao'
import { DivinationMethod, DivinationResults } from '../store/useAppStore'

interface GptMethodConfig {
  label: string
  classicReferences: string[]
  analysisLens: string[]
  buildSection: (results: DivinationResults) => string[]
}

const METHOD_CONFIG: Record<DivinationMethod, GptMethodConfig> = {
  ziwei: {
    label: 'Zi Wei Dou Shu',
    classicReferences: ['紫微斗數全書', '紫微斗數全集'],
    analysisLens: [
      'Focus on life palace structure, major stars, and temperament patterns.',
      'Infer counseling timing from stress tendencies and personality dynamics.',
    ],
    buildSection: buildZiweiSection,
  },
  bazi: {
    label: 'Ba Zi',
    classicReferences: ['淵海子平', '三命通會'],
    analysisLens: [
      'Read day master strength, elemental balance, and timing climate.',
      'Consider emotional regulation and support needs through wuxing dynamics.',
    ],
    buildSection: buildBaziSection,
  },
  iching: {
    label: 'I Ching',
    classicReferences: ['周易', '易傳'],
    analysisLens: [
      'Read the primary and changed hexagrams as a process of transition.',
      'Use changing lines to identify timing shifts, cautions, and response strategy.',
    ],
    buildSection: buildIchingSection,
  },
  tarot: {
    label: 'Tarot',
    classicReferences: ['The Pictorial Key to the Tarot', 'Seventy-Eight Degrees of Wisdom'],
    analysisLens: [
      'Read symbolic patterns, spread positions, and emotional themes together.',
      'Highlight psychological readiness, tension, and supportive next steps.',
    ],
    buildSection: buildTarotSection,
  },
  liuyao: {
    label: 'Liuyao',
    classicReferences: ['周易', '增刪卜易'],
    analysisLens: [
      'Focus on the primary hexagram, transformed hexagram, and moving lines.',
      'Interpret timing and decision pressure through change dynamics and line movement.',
    ],
    buildSection: buildLiuyaoSection,
  },
  'western-astro': {
    label: 'Western astrology',
    classicReferences: ['Tetrabiblos', 'Christian Astrology'],
    analysisLens: [
      'Emphasize planetary placements, angles, and notable aspect patterns.',
      'Infer emotional tone and counseling orientation from personality and timing signatures.',
    ],
    buildSection: buildWesternSection,
  },
  'vedic-astro': {
    label: 'Vedic astrology',
    classicReferences: ['Brihat Parashara Hora Shastra', 'Phaladeepika'],
    analysisLens: [
      'Read lagna, moon sign, nakshatra, and dasha timing together.',
      'Frame interpretation through karmic tendencies, timing cycles, and emotional patterning.',
    ],
    buildSection: buildVedicSection,
  },
  numerology: {
    label: 'Numerology',
    classicReferences: ['The Complete Book of Numerology', 'The Numerology Handbook'],
    analysisLens: [
      'Read life path, destiny, soul, and personality numbers as a combined pattern.',
      'Infer developmental emphasis, motivation, and readiness for reflective work.',
    ],
    buildSection: buildNumerologySection,
  },
}

function readText(value: unknown): string {
  if (typeof value !== 'string') {
    return 'unavailable'
  }

  const trimmed = value.trim()
  return trimmed ? trimmed : 'unavailable'
}

function readNumber(value: unknown): string {
  return typeof value === 'number' && Number.isFinite(value)
    ? String(value)
    : 'unavailable'
}

function readArray<T>(value: T[] | undefined): T[] {
  return Array.isArray(value) ? value : []
}

function buildWesternSection(results: DivinationResults): string[] {
  const chart = results.westernAstro

  if (!chart) {
    return ['- Result data unavailable.']
  }

  const planets = readArray(chart.planets)
  const aspects = readArray(chart.aspects)
  const sun = planets.find((planet) => planet.nameEn === 'Sun') ?? planets[0]
  const moon = planets.find((planet) => planet.nameEn === 'Moon') ?? planets[1]
  const topAspect = aspects[0]

  return [
    `- Sun sign: ${readText(sun?.sign)}`,
    `- Moon sign: ${readText(moon?.sign)}`,
    `- Ascendant: ${readText(chart.ascendant?.sign)}`,
    `- Midheaven: ${readText(chart.midheaven?.sign)}`,
    `- Example aspect: ${topAspect ? `${readText(topAspect.planet1)} ${readText(topAspect.type)} ${readText(topAspect.planet2)}` : 'unavailable'}`,
  ]
}

function buildVedicSection(results: DivinationResults): string[] {
  const chart = results.vedicAstro

  if (!chart) {
    return ['- Result data unavailable.']
  }

  const dashas = readArray(chart.dashas)
  const firstDasha = dashas[0]

  return [
    `- Moon sign: ${readText(chart.moonSign)}`,
    `- Ascendant: ${readText(chart.ascendant)}`,
    `- Sun sign: ${readText(chart.sunSign)}`,
    `- Moon nakshatra: ${readText(chart.moonNakshatra?.name)}`,
    `- Nakshatra lord: ${readText(chart.moonNakshatra?.lord)}`,
    `- Current dasha sample: ${firstDasha ? `${readText(firstDasha.planet)} starting ${readNumber(firstDasha.startYear)}` : 'unavailable'}`,
  ]
}

function buildNumerologySection(results: DivinationResults): string[] {
  const chart = results.numerology

  if (!chart) {
    return ['- Result data unavailable.']
  }

  return [
    `- Life path number: ${readNumber(chart.lifePathNumber)}`,
    `- Destiny number: ${readNumber(chart.destinyNumber)}`,
    `- Soul number: ${readNumber(chart.soulNumber)}`,
    `- Personality number: ${readNumber(chart.personalityNumber)}`,
    `- Birthday number: ${readNumber(chart.birthdayNumber)}`,
    `- Expression number: ${readNumber(chart.expressionNumber)}`,
  ]
}

function buildZiweiSection(results: DivinationResults): string[] {
  const chart = results.ziwei

  if (!chart) {
    return ['- Result data unavailable.']
  }

  return [
    `- Major stars: ${readArray(chart.majorStars).join(', ') || 'unavailable'}`,
    `- Life palace analysis: ${readText(chart.lifeAnalysis)}`,
    `- Personality analysis: ${readText(chart.personalityAnalysis)}`,
    `- Counseling advice: ${readText(chart.counselingAdvice)}`,
  ]
}

function buildBaziSection(results: DivinationResults): string[] {
  const chart = results.bazi

  if (!chart) {
    return ['- Result data unavailable.']
  }

  return [
    `- Four pillars: ${[chart.yearPillar, chart.monthPillar, chart.dayPillar, chart.hourPillar].map(readText).join(', ')}`,
    `- Day master: ${readText(chart.dayMaster)}`,
    `- Dominant wuxing: ${readText(chart.dominantWuxing)}`,
    `- Deficient wuxing: ${readText(chart.deficientWuxing)}`,
    `- Analysis summary: ${readText(chart.analysis)}`,
  ]
}

function buildIchingSection(results: DivinationResults): string[] {
  const result = results.iching

  if (!result) {
    return ['- Result data unavailable.']
  }

  return [
    `- Primary hexagram: ${readText(result.originalHexagram?.name)}`,
    `- Changed hexagram: ${readText(result.changedHexagram?.name)}`,
    `- Changing lines: ${readArray(result.changingLines).join(', ') || 'unavailable'}`,
    `- Interpretation summary: ${readText(result.summary)}`,
    `- Counseling advice: ${readText(result.counselingAdvice)}`,
  ]
}

function buildLiuyaoSection(results: DivinationResults): string[] {
  const result = results.liuyao

  if (!result) {
    return ['- Result data unavailable.']
  }

  const formatted = formatLiuyaoResult(result)

  return [
    `- Primary hexagram: ${formatted.primaryHexagram}`,
    `- Transformed hexagram: ${formatted.transformedHexagram}`,
    `- Moving lines: ${formatted.movingLines}`,
  ]
}

function buildTarotSection(results: DivinationResults): string[] {
  const reading = results.tarot

  if (!reading) {
    return ['- Result data unavailable.']
  }

  const firstCard = readArray(reading.cards)[0]
  const cardName = firstCard?.card?.name

  return [
    `- Spread: ${readText(reading.spread)}`,
    `- Representative card: ${cardName ? `${cardName}${firstCard?.position ? ` (${firstCard.position})` : ''}` : 'unavailable'}`,
    `- Interpretation summary: ${readText(reading.summary)}`,
    `- Emotional state: ${readText(reading.psychologicalState?.emotionalState)}`,
    `- Counseling advice: ${readText(reading.counselingAdvice)}`,
  ]
}

export interface BuildGptPromptInput {
  question: string
  selectedMethods: DivinationMethod[]
  divinationResults: DivinationResults
}

export function buildGptPrompt({
  question,
  selectedMethods,
  divinationResults,
}: BuildGptPromptInput): string {
  const supportedSelections = selectedMethods.filter((method) => method in METHOD_CONFIG)

  const lines = [
    'Please synthesize these divination results into a clear reading.',
    'Use the classic references and interpretive lenses below as guiding frameworks.',
    'Do not present invented direct quotations from those works.',
    'Note uncertainty where data is incomplete.',
    'Highlight where multiple methods converge or differ.',
    `User question: ${question.trim() || '(not provided)'}`,
    '',
    'Selected methods:',
    ...supportedSelections.map((method) => `- ${method} (${METHOD_CONFIG[method].label})`),
    '',
  ]

  for (const method of supportedSelections) {
    const config = METHOD_CONFIG[method]
    lines.push(`[${method}]`)
    lines.push('Classic references:')
    lines.push(...config.classicReferences.map((item) => `- ${item}`))
    lines.push('Analysis lens:')
    lines.push(...config.analysisLens.map((item) => `- ${item}`))
    lines.push('Method details:')
    lines.push(...config.buildSection(divinationResults))
    lines.push('')
  }

  return lines.join('\n')
}

export function hasSupportedGptMethods(methods: DivinationMethod[]): boolean {
  return methods.some((method) => method in METHOD_CONFIG)
}
