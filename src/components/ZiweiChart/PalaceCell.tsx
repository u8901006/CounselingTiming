import type { StarInfo } from '../../modules/ziwei'
import { StarBadge } from './StarBadge'
import { BODY_PALACE_LABEL } from './constants'

interface PalaceCellProps {
  name: string
  index: number
  majorStars: StarInfo[]
  minorStars: StarInfo[]
  heavenlyStem: string
  earthlyBranch: string
  isBodyPalace: boolean
  isActive?: boolean
  onClick?: () => void
}

export function PalaceCell({
  name,
  majorStars,
  minorStars,
  heavenlyStem,
  earthlyBranch,
  isBodyPalace,
  isActive,
  onClick,
}: PalaceCellProps) {
  return (
    <div
      className={`
        relative flex flex-col h-full min-h-[100px] p-1.5
        border border-gray-300 dark:border-gray-600
        bg-white dark:bg-gray-800
        ${isActive ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}
        ${onClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''}
        transition-colors
      `}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
          {name}
        </span>
        {isBodyPalace && (
          <span className="text-[10px] px-1 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded">
            {BODY_PALACE_LABEL}
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-wrap content-start gap-0.5 overflow-hidden">
        {majorStars.map((star, idx) => (
          <StarBadge
            key={`major-${idx}`}
            name={star.name}
            brightness={star.brightness}
            mutagen={star.mutagen}
            size="sm"
          />
        ))}
        {minorStars.length > 0 && majorStars.length > 0 && (
          <span className="w-full h-0.5 my-0.5 bg-gray-200 dark:bg-gray-700" />
        )}
        {minorStars.map((star, idx) => (
          <StarBadge
            key={`minor-${idx}`}
            name={star.name}
            brightness={star.brightness}
            mutagen={star.mutagen}
            size="sm"
          />
        ))}
      </div>

      <div className="mt-auto pt-1 text-[10px] text-gray-500 dark:text-gray-400 flex justify-between">
        <span>{heavenlyStem}</span>
        <span>{earthlyBranch}</span>
      </div>
    </div>
  )
}

export function EmptyCell({ branch }: { branch: string }) {
  return (
    <div className="flex items-center justify-center h-full min-h-[100px] border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
      <span className="text-lg font-bold text-gray-300 dark:text-gray-600">{branch}</span>
    </div>
  )
}

export function CenterCell() {
  return (
    <div className="col-span-2 row-span-2 flex items-center justify-center border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <div className="text-2xl font-bold text-gray-400 dark:text-gray-600">紫微</div>
        <div className="text-sm text-gray-400 dark:text-gray-600">斗數</div>
      </div>
    </div>
  )
}
