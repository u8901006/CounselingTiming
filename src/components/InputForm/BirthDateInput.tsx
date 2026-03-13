interface BirthDateInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
}

export function BirthDateInput({ value, onChange, label }: BirthDateInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-water"
      />
    </div>
  )
}
