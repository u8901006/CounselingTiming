import type { PalaceInfo } from '../../modules/ziwei'
import { PalaceCell, EmptyCell, CenterCell } from './PalaceCell'
import { PALACE_GRID_POSITIONS } from './constants'

interface ZiweiChartProps {
  palaces: PalaceInfo[]
  highlightPalace?: string
  onPalaceClick?: (palace: PalaceInfo) => void
}

export function ZiweiChart({ palaces, highlightPalace, onPalaceClick }: ZiweiChartProps) {
  const palaceByBranch = new Map<string, PalaceInfo>()
  for (const palace of palaces) {
    if (palace.earthlyBranch) {
      palaceByBranch.set(palace.earthlyBranch, palace)
    }
  }

  const grid: (PalaceInfo | null)[][] = Array.from({ length: 4 }, () =>
    Array.from({ length: 4 }, () => null)
  )

  for (const pos of PALACE_GRID_POSITIONS) {
    const palace = palaceByBranch.get(pos.branch)
    grid[pos.row][pos.col] = palace || null
  }

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="grid grid-cols-4 gap-0.5 bg-gray-200 dark:bg-gray-700 p-0.5 rounded-lg">
        {grid.map((row, rowIdx) =>
          row.map((palace, colIdx) => {
            if (rowIdx >= 1 && rowIdx <= 2 && colIdx >= 1 && colIdx <= 2) {
              if (rowIdx === 1 && colIdx === 1) {
                return <CenterCell key={`${rowIdx}-${colIdx}`} />
              }
              return null
            }

            const pos = PALACE_GRID_POSITIONS.find(
              (p) => p.row === rowIdx && p.col === colIdx
            )

            if (palace) {
              return (
                <PalaceCell
                  key={palace.index}
                  name={palace.name}
                  index={palace.index}
                  majorStars={palace.majorStars}
                  minorStars={palace.minorStars}
                  heavenlyStem={palace.heavenlyStem}
                  earthlyBranch={palace.earthlyBranch}
                  isBodyPalace={palace.isBodyPalace}
                  isActive={highlightPalace === palace.name}
                  onClick={onPalaceClick ? () => onPalaceClick(palace) : undefined}
                />
              )
            }

            return <EmptyCell key={`${rowIdx}-${colIdx}`} branch={pos?.branch || ''} />
          })
        )}
      </div>
    </div>
  )
}

export { StarBadge } from './StarBadge'
export { PalaceCell } from './PalaceCell'
export * from './constants'
