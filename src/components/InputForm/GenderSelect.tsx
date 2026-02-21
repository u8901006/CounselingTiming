interface GenderSelectProps {
  value: 'male' | 'female'
  onChange: (value: 'male' | 'female') => void
  label?: string
}

export function GenderSelect({ value, onChange, label = '性別' }: GenderSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => onChange('male')}
          className={`flex-1 py-2 rounded-lg border ${
            value === 'male'
              ? 'bg-blue-100 border-blue-500 text-blue-700'
              : 'border-gray-300'
          }`}
        >
          男
        </button>
        <button
          type="button"
          onClick={() => onChange('female')}
          className={`flex-1 py-2 rounded-lg border ${
            value === 'female'
              ? 'bg-pink-100 border-pink-500 text-pink-700'
              : 'border-gray-300'
          }`}
        >
          女
        </button>
      </div>
    </div>
  )
}
