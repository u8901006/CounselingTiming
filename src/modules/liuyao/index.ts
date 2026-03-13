import type {
  LiuyaoHexagram,
  LiuyaoHexagramResult,
  LiuyaoLine,
} from './types'

const LIUYAO_LINE_COUNT = 6

type LiuyaoFormattingLabels = {
  yin: string
  yang: string
  moving: string
  static: string
}

type LiuyaoResultLabels = {
  title: string
  primaryHexagram: string
  transformedHexagram: string
  movingLines: string
  movingLineFallback: string
}

type LiuyaoFormattingOptions = {
  lineSeparator?: string
  movingLineSeparator?: string
  movingLineFallback?: string
  labels?: Partial<LiuyaoFormattingLabels>
}

type FormattedLiuyaoResult = {
  primaryHexagram: string
  transformedHexagram: string
  movingLines: string
}

const DEFAULT_LIUYAO_FORMATTING_LABELS: LiuyaoFormattingLabels = {
  yin: '陰',
  yang: '陽',
  moving: '動',
  static: '靜',
}

export const DEFAULT_LIUYAO_RESULT_LABELS: LiuyaoResultLabels = {
  title: '六爻卦象',
  primaryHexagram: '本卦',
  transformedHexagram: '之卦',
  movingLines: '動爻',
  movingLineFallback: '無',
}

function generateCoinCastLine(): LiuyaoLine {
  const coinTotal = Array.from({ length: 3 }, () =>
    Math.random() < 0.5 ? 2 : 3,
  ).reduce((sum, value) => sum + value, 0)

  if (coinTotal === 6) {
    return { value: 'yin', isMoving: true }
  }

  if (coinTotal === 7) {
    return { value: 'yang', isMoving: false }
  }

  if (coinTotal === 8) {
    return { value: 'yin', isMoving: false }
  }

  return { value: 'yang', isMoving: true }
}

function assertValidLineCount(lines: LiuyaoLine[]): void {
  if (lines.length !== LIUYAO_LINE_COUNT) {
    throw new Error('Liuyao hexagrams require exactly 6 lines')
  }
}

export function createLiuyaoHexagram(lines: LiuyaoLine[]): LiuyaoHexagram {
  assertValidLineCount(lines)

  return [...lines] as LiuyaoHexagram
}

export function deriveMovingLineIndexes(lines: LiuyaoHexagram): number[] {
  return lines.reduce<number[]>((indexes, line, index) => {
    if (line.isMoving) {
      indexes.push(index + 1)
    }

    return indexes
  }, [])
}

export function buildTransformedHexagram(lines: LiuyaoHexagram): LiuyaoHexagramResult {
  const transformedLines = lines.map((line) => {
    if (!line.isMoving) {
      return {
        value: line.value,
        isMoving: false,
      }
    }

    return {
      value: line.value === 'yang' ? 'yin' : 'yang',
      isMoving: false,
    }
  }) as LiuyaoHexagram

  return {
    lines: transformedLines,
    movingLineIndexes: deriveMovingLineIndexes(transformedLines),
  }
}

export function formatLiuyaoResult(
  result: LiuyaoHexagramResult,
  options: LiuyaoFormattingOptions = {},
): FormattedLiuyaoResult {
  const labels = {
    ...DEFAULT_LIUYAO_FORMATTING_LABELS,
    ...options.labels,
  }
  const lineSeparator = options.lineSeparator ?? '、'
  const movingLineSeparator = options.movingLineSeparator ?? '、'
  const movingLineFallback = options.movingLineFallback ?? DEFAULT_LIUYAO_RESULT_LABELS.movingLineFallback

  const formatLine = (line: LiuyaoLine): string => {
    const valueLabel = line.value === 'yang' ? labels.yang : labels.yin
    const movementLabel = line.isMoving ? labels.moving : labels.static

    return `${valueLabel}${movementLabel}`
  }

  const transformed = buildTransformedHexagram(result.lines)

  return {
    primaryHexagram: result.lines.map(formatLine).join(lineSeparator),
    transformedHexagram: transformed.lines.map(formatLine).join(lineSeparator),
    movingLines: result.movingLineIndexes.length > 0
      ? result.movingLineIndexes.join(movingLineSeparator)
      : movingLineFallback,
  }
}

export function generateCoinCastResult(): LiuyaoHexagramResult {
  const lines = createLiuyaoHexagram(
    Array.from({ length: LIUYAO_LINE_COUNT }, generateCoinCastLine),
  )

  return {
    lines,
    movingLineIndexes: deriveMovingLineIndexes(lines),
  }
}

export type { FormattedLiuyaoResult, LiuyaoFormattingOptions, LiuyaoResultLabels }

export type {
  LiuyaoHexagram,
  LiuyaoHexagramResult,
  LiuyaoLine,
  LiuyaoLineValue,
  LiuyaoMode,
} from './types'
