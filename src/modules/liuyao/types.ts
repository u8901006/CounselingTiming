export type LiuyaoMode = 'manual' | 'auto'

export type LiuyaoLineValue = 'yin' | 'yang'

export interface LiuyaoLine {
  value: LiuyaoLineValue
  isMoving: boolean
}

export type LiuyaoHexagram = [
  LiuyaoLine,
  LiuyaoLine,
  LiuyaoLine,
  LiuyaoLine,
  LiuyaoLine,
  LiuyaoLine,
]

export interface LiuyaoHexagramResult {
  lines: LiuyaoHexagram
  movingLineIndexes: number[]
}
