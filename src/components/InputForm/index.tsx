import { BirthDateInput } from './BirthDateInput'
import { BirthHourSelect } from './BirthHourSelect'
import { GenderSelect } from './GenderSelect'

interface InputFormProps {
  birthDate: string
  birthHour: number
  gender: 'male' | 'female'
  onBirthDateChange: (value: string) => void
  onBirthHourChange: (value: number) => void
  onGenderChange: (value: 'male' | 'female') => void
  onNext: () => void
}

export function InputForm({
  birthDate,
  birthHour,
  gender,
  onBirthDateChange,
  onBirthHourChange,
  onGenderChange,
  onNext,
}: InputFormProps) {
  return (
    <div className="card max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">輸入您的基本資料</h2>

      <div className="space-y-4">
        <BirthDateInput value={birthDate} onChange={onBirthDateChange} />
        <BirthHourSelect value={birthHour} onChange={onBirthHourChange} />
        <GenderSelect value={gender} onChange={onGenderChange} />

        <button
          onClick={onNext}
          disabled={!birthDate}
          className="w-full py-3 bg-water text-white rounded-lg font-medium hover:bg-water-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          下一步：選擇占卜方式
        </button>
      </div>
    </div>
  )
}

export { BirthDateInput } from './BirthDateInput'
export { BirthHourSelect } from './BirthHourSelect'
export { GenderSelect } from './GenderSelect'
