interface BirthHourSelectProps {
  value: number
  onChange: (value: number) => void
  label?: string
}

const HOUR_OPTIONS = [
  { value: 0, label: '23:00 - 00:59 (子時)' },
  { value: 2, label: '01:00 - 02:59 (丑時)' },
  { value: 4, label: '03:00 - 04:59 (寅時)' },
  { value: 6, label: '05:00 - 06:59 (卯時)' },
  { value: 8, label: '07:00 - 08:59 (辰時)' },
  { value: 10, label: '09:00 - 10:59 (巳時)' },
  { value: 12, label: '11:00 - 12:59 (午時)' },
  { value: 14, label: '13:00 - 14:59 (未時)' },
  { value: 16, label: '15:00 - 16:59 (申時)' },
  { value: 18, label: '17:00 - 18:59 (酉時)' },
  { value: 20, label: '19:00 - 20:59 (戌時)' },
  { value: 22, label: '21:00 - 22:59 (亥時)' },
]

export function BirthHourSelect({ value, onChange, label = '出生時辰' }: BirthHourSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-water"
      >
        {HOUR_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
