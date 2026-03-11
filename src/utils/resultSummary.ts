import { type CounselingRecommendation } from '../analysis/orientation'
import { type DivinationMethod, type DivinationResults } from '../store/useAppStore'

type SummaryTranslationOptions = {
  score?: string
  value?: string | number
}

type SummaryTranslator = (
  key: string,
  options?: SummaryTranslationOptions,
) => string

export interface BuildResultSummaryInput {
  question: string
  selectedMethods: DivinationMethod[]
  divinationResults: DivinationResults
  result: CounselingRecommendation | null
  t?: SummaryTranslator
}

const DEFAULT_LABELS = {
  unavailable: '詳細資料暫缺',
  title: '諮商時機摘要',
  question: '問題',
  questionMissing: '（未提供）',
  selectedMethods: '已選方法',
  selectedMethodsMissing: '（未選擇）',
  recommendationHeading: '綜合建議',
  ziweiMajorStars: '命盤重點',
  ziweiLifeAnalysis: '命宮分析',
  ziweiPersonalityAnalysis: '人格特質',
  counselingAdvice: '諮商建議',
  baziFourPillars: '四柱',
  baziDayMaster: '日主',
  baziDominantWuxing: '優勢五行',
  baziDeficientWuxing: '待補五行',
  analysisSummary: '分析摘要',
  ichingOriginalHexagram: '本卦',
  ichingChangedHexagram: '變卦',
  ichingChangingLines: '動爻',
  interpretationSummary: '解讀摘要',
  tarotSpread: '牌陣',
  tarotRepresentativeCard: '代表牌',
  tarotPsychologicalState: '心理狀態',
  westernAstroSunPosition: '太陽位置',
  westernAstroMoonPosition: '月亮位置',
  westernAstroAscendant: '上升星座',
  westernAstroMidheaven: '天頂星座',
  vedicAstroMoonSign: '月亮星座',
  vedicAstroAscendant: '上升星座',
  vedicAstroSunSign: '太陽星座',
  vedicAstroNakshatra: '月宿',
  vedicAstroCurrentDasha: '當前達夏',
  numerologyLifePath: '生命靈數',
  numerologyDestiny: '命運數',
  numerologySoul: '靈魂數',
  numerologyPersonality: '人格數',
  recommendationTiming: '時機評估',
  recommendationTimingSummary: '時機摘要',
  recommendationOverallAdvice: '整體建議',
  listSeparator: '、',
  fieldSeparator: '：',
  sunIn: '太陽在',
  moonIn: '月亮在',
  lord: '主星',
  startsIn: '起始於',
} as const

const DEFAULT_METHOD_LABELS: Record<DivinationMethod, string> = {
  ziwei: '紫微斗數',
  bazi: '八字',
  iching: '易經',
  tarot: '塔羅',
  'western-astro': '西洋占星',
  'vedic-astro': '吠陀占星',
  numerology: '數字命理',
}

const METHOD_TRANSLATION_KEYS: Record<DivinationMethod, string> = {
  ziwei: 'method.ziwei',
  bazi: 'method.bazi',
  iching: 'method.iching',
  tarot: 'method.tarot',
  'western-astro': 'method.westernAstro',
  'vedic-astro': 'method.vedicAstro',
  numerology: 'method.numerology',
}

function translate(
  t: SummaryTranslator | undefined,
  key: string,
  fallback: string,
  options?: SummaryTranslationOptions,
): string {
  const applyFallback = () => {
    if (!options) {
      return fallback
    }

    return Object.entries(options).reduce(
      (text, [optionKey, optionValue]) =>
        text.split(`{{${optionKey}}}`).join(String(optionValue)),
      fallback,
    )
  }

  if (!t) {
    return applyFallback()
  }

  const translated = t(key, options)
  return translated === key ? applyFallback() : translated
}

function getListSeparator(t?: SummaryTranslator): string {
  return translate(t, 'resultSummary.listSeparator', DEFAULT_LABELS.listSeparator)
}

function getFieldSeparator(t?: SummaryTranslator): string {
  return translate(t, 'resultSummary.fieldSeparator', DEFAULT_LABELS.fieldSeparator)
}

function buildLine(label: string, value: string, t?: SummaryTranslator): string {
  return `- ${label}${getFieldSeparator(t)}${value}`
}

function buildHeaderLine(label: string, value: string, t?: SummaryTranslator): string {
  return `${label}${getFieldSeparator(t)}${value}`
}

function getMethodLabel(method: DivinationMethod, t?: SummaryTranslator): string {
  return translate(t, METHOD_TRANSLATION_KEYS[method], DEFAULT_METHOD_LABELS[method])
}

function getUnavailableText(t?: SummaryTranslator): string {
  return translate(t, 'resultSummary.unavailable', DEFAULT_LABELS.unavailable)
}

function readText(value: unknown, fallback: string): string {
  if (typeof value !== 'string') {
    return fallback
  }

  const trimmed = value.trim()
  return trimmed || fallback
}

function readNumber(value: unknown, fallback: string): string {
  return typeof value === 'number' && Number.isFinite(value)
    ? String(value)
    : fallback
}

function readList(value: string[] | undefined, fallback: string, t?: SummaryTranslator): string {
  if (!Array.isArray(value)) {
    return fallback
  }

  const items = value
    .map((item) => (typeof item === 'string' ? item.trim() : ''))
    .filter(Boolean)

  return items.length > 0 ? items.join(getListSeparator(t)) : fallback
}

function appendSection(lines: string[], heading: string, items: string[]): void {
  lines.push(heading)
  lines.push(...items)
  lines.push('')
}

function buildZiweiSummary(results: DivinationResults, t?: SummaryTranslator): string[] {
  const ziwei = results.ziwei
  const unavailableText = getUnavailableText(t)

  if (!ziwei) {
    return [`- ${unavailableText}`]
  }

  return [
    buildLine(translate(t, 'resultSummary.ziweiMajorStars', DEFAULT_LABELS.ziweiMajorStars), readList(ziwei.majorStars, unavailableText, t), t),
    buildLine(translate(t, 'resultSummary.ziweiLifeAnalysis', DEFAULT_LABELS.ziweiLifeAnalysis), readText(ziwei.lifeAnalysis, unavailableText), t),
    buildLine(translate(t, 'resultSummary.ziweiPersonalityAnalysis', DEFAULT_LABELS.ziweiPersonalityAnalysis), readText(ziwei.personalityAnalysis, unavailableText), t),
    buildLine(translate(t, 'resultSummary.counselingAdvice', DEFAULT_LABELS.counselingAdvice), readText(ziwei.counselingAdvice, unavailableText), t),
  ]
}

function buildBaziSummary(results: DivinationResults, t?: SummaryTranslator): string[] {
  const bazi = results.bazi
  const unavailableText = getUnavailableText(t)

  if (!bazi) {
    return [`- ${unavailableText}`]
  }

  return [
    buildLine(translate(t, 'resultSummary.baziFourPillars', DEFAULT_LABELS.baziFourPillars), `${readText(bazi.yearPillar, unavailableText)}${getListSeparator(t)}${readText(bazi.monthPillar, unavailableText)}${getListSeparator(t)}${readText(bazi.dayPillar, unavailableText)}${getListSeparator(t)}${readText(bazi.hourPillar, unavailableText)}`, t),
    buildLine(translate(t, 'resultSummary.baziDayMaster', DEFAULT_LABELS.baziDayMaster), readText(bazi.dayMaster, unavailableText), t),
    buildLine(translate(t, 'resultSummary.baziDominantWuxing', DEFAULT_LABELS.baziDominantWuxing), readText(bazi.dominantWuxing, unavailableText), t),
    buildLine(translate(t, 'resultSummary.baziDeficientWuxing', DEFAULT_LABELS.baziDeficientWuxing), readText(bazi.deficientWuxing, unavailableText), t),
    buildLine(translate(t, 'resultSummary.analysisSummary', DEFAULT_LABELS.analysisSummary), readText(bazi.analysis, unavailableText), t),
  ]
}

function buildIchingSummary(results: DivinationResults, t?: SummaryTranslator): string[] {
  const iching = results.iching
  const unavailableText = getUnavailableText(t)

  if (!iching) {
    return [`- ${unavailableText}`]
  }

  const originalHexagramName = readText(iching.originalHexagram?.name, unavailableText)
  const originalHexagramNumber = iching.originalHexagram?.number
  const originalHexagramValue = Number.isFinite(originalHexagramNumber)
    ? `${originalHexagramName}${translate(t, 'resultSummary.hexagramNumberValue', '（第{{value}}卦）', { value: originalHexagramNumber })}`
    : originalHexagramName

  return [
    buildLine(translate(t, 'resultSummary.ichingOriginalHexagram', DEFAULT_LABELS.ichingOriginalHexagram), originalHexagramValue, t),
    buildLine(translate(t, 'resultSummary.ichingChangedHexagram', DEFAULT_LABELS.ichingChangedHexagram), readText(iching.changedHexagram?.name, unavailableText), t),
    buildLine(translate(t, 'resultSummary.ichingChangingLines', DEFAULT_LABELS.ichingChangingLines), Array.isArray(iching.changingLines) && iching.changingLines.length > 0 ? iching.changingLines.join(getListSeparator(t)) : unavailableText, t),
    buildLine(translate(t, 'resultSummary.interpretationSummary', DEFAULT_LABELS.interpretationSummary), readText(iching.summary, unavailableText), t),
    buildLine(translate(t, 'resultSummary.counselingAdvice', DEFAULT_LABELS.counselingAdvice), readText(iching.counselingAdvice, unavailableText), t),
  ]
}

function buildTarotSummary(results: DivinationResults, t?: SummaryTranslator): string[] {
  const tarot = results.tarot
  const unavailableText = getUnavailableText(t)

  if (!tarot) {
    return [`- ${unavailableText}`]
  }

  const firstCard = Array.isArray(tarot.cards) ? tarot.cards[0] : undefined
  const cardName = firstCard?.card?.name
  const position = firstCard?.position

  return [
    buildLine(translate(t, 'resultSummary.tarotSpread', DEFAULT_LABELS.tarotSpread), readText(tarot.spread, unavailableText), t),
    buildLine(translate(t, 'resultSummary.tarotRepresentativeCard', DEFAULT_LABELS.tarotRepresentativeCard), cardName ? `${cardName}${position ? ` (${position})` : ''}` : unavailableText, t),
    buildLine(translate(t, 'resultSummary.interpretationSummary', DEFAULT_LABELS.interpretationSummary), readText(tarot.summary, unavailableText), t),
    buildLine(translate(t, 'resultSummary.tarotPsychologicalState', DEFAULT_LABELS.tarotPsychologicalState), readText(tarot.psychologicalState?.emotionalState, unavailableText), t),
    buildLine(translate(t, 'resultSummary.counselingAdvice', DEFAULT_LABELS.counselingAdvice), readText(tarot.counselingAdvice, unavailableText), t),
  ]
}

function buildWesternAstroSummary(results: DivinationResults, t?: SummaryTranslator): string[] {
  const westernAstro = results.westernAstro
  const unavailableText = getUnavailableText(t)

  if (!westernAstro) {
    return [`- ${unavailableText}`]
  }

  const planets = Array.isArray(westernAstro.planets) ? westernAstro.planets : []
  const sun = planets.find((planet) => planet.nameEn === 'Sun') ?? planets[0]
  const moon = planets.find((planet) => planet.nameEn === 'Moon')

  return [
    buildLine(translate(t, 'resultSummary.westernAstroSunPosition', DEFAULT_LABELS.westernAstroSunPosition), sun ? `${translate(t, 'resultSummary.sunIn', DEFAULT_LABELS.sunIn)}${readText(sun.sign, unavailableText)}` : unavailableText, t),
    buildLine(translate(t, 'resultSummary.westernAstroMoonPosition', DEFAULT_LABELS.westernAstroMoonPosition), moon ? `${translate(t, 'resultSummary.moonIn', DEFAULT_LABELS.moonIn)}${readText(moon.sign, unavailableText)}` : unavailableText, t),
    buildLine(translate(t, 'resultSummary.westernAstroAscendant', DEFAULT_LABELS.westernAstroAscendant), readText(westernAstro.ascendant?.sign, unavailableText), t),
    buildLine(translate(t, 'resultSummary.westernAstroMidheaven', DEFAULT_LABELS.westernAstroMidheaven), readText(westernAstro.midheaven?.sign, unavailableText), t),
  ]
}

function buildVedicAstroSummary(results: DivinationResults, t?: SummaryTranslator): string[] {
  const vedicAstro = results.vedicAstro
  const unavailableText = getUnavailableText(t)

  if (!vedicAstro) {
    return [`- ${unavailableText}`]
  }

  const dasha = Array.isArray(vedicAstro.dashas) ? vedicAstro.dashas[0] : undefined

  return [
    buildLine(translate(t, 'resultSummary.vedicAstroMoonSign', DEFAULT_LABELS.vedicAstroMoonSign), readText(vedicAstro.moonSign, unavailableText), t),
    buildLine(translate(t, 'resultSummary.vedicAstroAscendant', DEFAULT_LABELS.vedicAstroAscendant), readText(vedicAstro.ascendant, unavailableText), t),
    buildLine(translate(t, 'resultSummary.vedicAstroSunSign', DEFAULT_LABELS.vedicAstroSunSign), readText(vedicAstro.sunSign, unavailableText), t),
    buildLine(translate(t, 'resultSummary.vedicAstroNakshatra', DEFAULT_LABELS.vedicAstroNakshatra), vedicAstro.moonNakshatra ? `${readText(vedicAstro.moonNakshatra.name, unavailableText)} (${translate(t, 'resultSummary.lord', DEFAULT_LABELS.lord)} ${readText(vedicAstro.moonNakshatra.lord, unavailableText)})` : unavailableText, t),
    buildLine(translate(t, 'resultSummary.vedicAstroCurrentDasha', DEFAULT_LABELS.vedicAstroCurrentDasha), dasha ? `${readText(dasha.planet, unavailableText)}${getListSeparator(t)}${translate(t, 'resultSummary.startsIn', DEFAULT_LABELS.startsIn)} ${readNumber(dasha.startYear, unavailableText)}` : unavailableText, t),
  ]
}

function buildNumerologySummary(results: DivinationResults, t?: SummaryTranslator): string[] {
  const numerology = results.numerology
  const unavailableText = getUnavailableText(t)

  if (!numerology) {
    return [`- ${unavailableText}`]
  }

  return [
    buildLine(translate(t, 'resultSummary.numerologyLifePath', DEFAULT_LABELS.numerologyLifePath), readNumber(numerology.lifePathNumber, unavailableText), t),
    buildLine(translate(t, 'resultSummary.numerologyDestiny', DEFAULT_LABELS.numerologyDestiny), readNumber(numerology.destinyNumber, unavailableText), t),
    buildLine(translate(t, 'resultSummary.numerologySoul', DEFAULT_LABELS.numerologySoul), readNumber(numerology.soulNumber, unavailableText), t),
    buildLine(translate(t, 'resultSummary.numerologyPersonality', DEFAULT_LABELS.numerologyPersonality), readNumber(numerology.personalityNumber, unavailableText), t),
  ]
}

function buildMethodSummary(method: DivinationMethod, results: DivinationResults, t?: SummaryTranslator): string[] {
  switch (method) {
    case 'ziwei':
      return buildZiweiSummary(results, t)
    case 'bazi':
      return buildBaziSummary(results, t)
    case 'iching':
      return buildIchingSummary(results, t)
    case 'tarot':
      return buildTarotSummary(results, t)
    case 'western-astro':
      return buildWesternAstroSummary(results, t)
    case 'vedic-astro':
      return buildVedicAstroSummary(results, t)
    case 'numerology':
      return buildNumerologySummary(results, t)
  }
}

function buildRecommendationSummary(result: CounselingRecommendation, t?: SummaryTranslator): string[] {
  const unavailableText = getUnavailableText(t)

  return [
    buildLine(translate(t, 'resultSummary.recommendationTiming', DEFAULT_LABELS.recommendationTiming), `${readText(result.timing.level, unavailableText)}${translate(t, 'resultSummary.scoreValue', '（{{score}}分）', { score: readNumber(result.timing.score, unavailableText) })}`, t),
    buildLine(translate(t, 'resultSummary.recommendationTimingSummary', DEFAULT_LABELS.recommendationTimingSummary), readText(result.timing.summary, unavailableText), t),
    buildLine(translate(t, 'resultSummary.recommendationOverallAdvice', DEFAULT_LABELS.recommendationOverallAdvice), readText(result.overallAdvice, unavailableText), t),
  ]
}

export function buildResultSummary({
  question,
  selectedMethods,
  divinationResults,
  result,
  t,
}: BuildResultSummaryInput): string {
  const lines: string[] = [
    translate(t, 'resultSummary.title', DEFAULT_LABELS.title),
    '',
    buildHeaderLine(translate(t, 'resultSummary.question', DEFAULT_LABELS.question), question.trim() || translate(t, 'resultSummary.questionMissing', DEFAULT_LABELS.questionMissing), t),
    buildHeaderLine(translate(t, 'resultSummary.selectedMethods', DEFAULT_LABELS.selectedMethods), selectedMethods.length > 0 ? selectedMethods.map((method) => getMethodLabel(method, t)).join(getListSeparator(t)) : translate(t, 'resultSummary.selectedMethodsMissing', DEFAULT_LABELS.selectedMethodsMissing), t),
    '',
  ]

  for (const method of selectedMethods) {
    appendSection(lines, getMethodLabel(method, t), buildMethodSummary(method, divinationResults, t))
  }

  if (result) {
    appendSection(
      lines,
      translate(t, 'resultSummary.recommendationHeading', DEFAULT_LABELS.recommendationHeading),
      buildRecommendationSummary(result, t),
    )
  }

  return lines.join('\n').trim()
}
