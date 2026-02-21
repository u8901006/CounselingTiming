export const STAR_COLORS: Record<string, string> = {
  '紫微': '#8b5cf6',
  '天機': '#8b5cf6',
  '太陽': '#ef4444',
  '武曲': '#eab308',
  '天同': '#22c55e',
  '廉貞': '#ec4899',
  '天府': '#eab308',
  '太陰': '#3b82f6',
  '貪狼': '#f97316',
  '巨門': '#6b7280',
  '天相': '#14b8a6',
  '天梁': '#06b6d4',
  '七殺': '#dc2626',
  '破軍': '#b91c1c',
  '左輔': '#22c55e',
  '右弼': '#22c55e',
  '文昌': '#3b82f6',
  '文曲': '#3b82f6',
  '天魁': '#f59e0b',
  '天鉞': '#f59e0b',
  '祿存': '#22c55e',
  '擎羊': '#ef4444',
  '陀羅': '#ef4444',
  '火星': '#f97316',
  '鈴星': '#f97316',
  '地空': '#6b7280',
  '地劫': '#6b7280',
}

export const BRIGHTNESS_OPACITY: Record<string, number> = {
  '廟': 1.0,
  '旺': 0.9,
  '得': 0.8,
  '利': 0.7,
  '平': 0.6,
  '不': 0.5,
  '陷': 0.4,
}

export const MUTAGEN_COLORS: Record<string, string> = {
  '祿': '#22c55e',
  '權': '#eab308',
  '科': '#3b82f6',
  '忌': '#ef4444',
}

export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

export const PALACE_GRID_POSITIONS: { branch: string; row: number; col: number }[] = [
  { branch: '巳', row: 0, col: 0 },
  { branch: '午', row: 0, col: 1 },
  { branch: '未', row: 0, col: 2 },
  { branch: '申', row: 0, col: 3 },
  { branch: '辰', row: 1, col: 0 },
  { branch: '酉', row: 1, col: 3 },
  { branch: '卯', row: 2, col: 0 },
  { branch: '戌', row: 2, col: 3 },
  { branch: '寅', row: 3, col: 0 },
  { branch: '丑', row: 3, col: 1 },
  { branch: '子', row: 3, col: 2 },
  { branch: '亥', row: 3, col: 3 },
]

export const BODY_PALACE_LABEL = '身'
