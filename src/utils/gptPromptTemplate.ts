import { DivinationMethod, DivinationResults } from '../store/useAppStore'

type SupportedGptMethod = 'western-astro' | 'vedic-astro' | 'numerology'

const SUPPORTED_METHODS: SupportedGptMethod[] = [
  'western-astro',
  'vedic-astro',
  'numerology',
]

const METHOD_LABELS: Record<SupportedGptMethod, string> = {
  'western-astro': 'Western astrology',
  'vedic-astro': 'Vedic astrology',
  numerology: 'Numerology',
}

function isSupportedGptMethod(method: DivinationMethod): method is SupportedGptMethod {
  return (SUPPORTED_METHODS as readonly string[]).includes(method)
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

function getWesternSection(results: DivinationResults): string[] {
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

function getVedicSection(results: DivinationResults): string[] {
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

function getNumerologySection(results: DivinationResults): string[] {
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

function getMethodSection(method: DivinationMethod, results: DivinationResults): string[] {
  switch (method) {
    case 'western-astro':
      return getWesternSection(results)
    case 'vedic-astro':
      return getVedicSection(results)
    case 'numerology':
      return getNumerologySection(results)
    default:
      return ['- Unsupported method for this prompt.']
  }
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
  const supportedSelections = selectedMethods.filter(isSupportedGptMethod)

  const lines = [
    'Please synthesize these divination results into a clear reading.',
    `User question: ${question.trim() || '(not provided)'}`,
    '',
    'Selected methods:',
    ...supportedSelections.map((method) => `- ${method} (${METHOD_LABELS[method]})`),
    '',
    'Method details:',
  ]

  for (const method of supportedSelections) {
    lines.push(`[${method}]`)
    lines.push(...getMethodSection(method, divinationResults))
    lines.push('')
  }

  lines.push('Please note uncertainty where source data is incomplete.')

  return lines.join('\n')
}

export function hasSupportedGptMethods(methods: DivinationMethod[]): boolean {
  return methods.some(isSupportedGptMethod)
}
