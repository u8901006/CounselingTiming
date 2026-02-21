import { STAR_COLORS, BRIGHTNESS_OPACITY, MUTAGEN_COLORS } from './constants'

interface StarBadgeProps {
  name: string
  brightness?: string
  mutagen?: string
  size?: 'sm' | 'md'
}

export function StarBadge({ name, brightness, mutagen, size = 'sm' }: StarBadgeProps) {
  const color = STAR_COLORS[name] || '#6b7280'
  const opacity = brightness ? BRIGHTNESS_OPACITY[brightness] ?? 0.7 : 0.7
  const mutagenColor = mutagen ? MUTAGEN_COLORS[mutagen] : null

  const sizeClasses = size === 'sm' ? 'text-xs px-1 py-0.5' : 'text-sm px-1.5 py-1'

  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded ${sizeClasses} font-medium`}
      style={{
        color,
        opacity,
        ...(mutagenColor ? { border: `1.5px solid ${mutagenColor}`, backgroundColor: `${mutagenColor}15` } : {}),
      }}
    >
      {name}
      {mutagen && (
        <span
          className="text-[10px] font-bold"
          style={{ color: mutagenColor ?? undefined }}
        >
          {mutagen}
        </span>
      )}
    </span>
  )
}
