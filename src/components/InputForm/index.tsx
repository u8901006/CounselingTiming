import { useTranslation } from 'react-i18next'

import { BirthDateInput } from './BirthDateInput'
import { BirthHourSelect } from './BirthHourSelect'
import { GenderSelect } from './GenderSelect'
import { LocationInput } from '../../store/useAppStore'

const TAIWAN_CITY_OPTIONS: Array<LocationInput & { key: string }> = [
  { key: 'taipei', city: '台北市', lat: 25.033, lng: 121.5654 },
  { key: 'newTaipei', city: '新北市', lat: 25.0122, lng: 121.4654 },
  { key: 'taoyuan', city: '桃園市', lat: 24.9936, lng: 121.301 },
  { key: 'taichung', city: '台中市', lat: 24.1477, lng: 120.6736 },
  { key: 'tainan', city: '台南市', lat: 22.9999, lng: 120.2269 },
  { key: 'kaohsiung', city: '高雄市', lat: 22.6273, lng: 120.3014 },
]

interface InputFormProps {
  birthDate: string
  birthHour: number
  gender: 'male' | 'female'
  name: string
  location: LocationInput
  onBirthDateChange: (value: string) => void
  onBirthHourChange: (value: number) => void
  onGenderChange: (value: 'male' | 'female') => void
  onNameChange: (value: string) => void
  onLocationChange: (value: LocationInput) => void
  onNext: () => void
}

export function InputForm({
  birthDate,
  birthHour,
  gender,
  name,
  location,
  onBirthDateChange,
  onBirthHourChange,
  onGenderChange,
  onNameChange,
  onLocationChange,
  onNext,
}: InputFormProps) {
  const { t } = useTranslation()
  const isStep1Complete = Boolean(birthDate && name.trim() && location.city)

  return (
    <div className="card max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">{t('input.title')}</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t('input.name')}</label>
          <input
            type="text"
            value={name}
            onChange={(event) => onNameChange(event.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-water"
            placeholder={t('input.namePlaceholder')}
          />
        </div>

        <BirthDateInput value={birthDate} onChange={onBirthDateChange} label={t('input.birthDate')} />
        <BirthHourSelect value={birthHour} onChange={onBirthHourChange} label={t('input.birthHour')} />
        <GenderSelect value={gender} onChange={onGenderChange} label={t('input.gender')} />

        <div>
          <label className="block text-sm font-medium mb-2">{t('input.location')}</label>
          <select
            value={location.city}
            onChange={(event) => {
              const selectedLocation = TAIWAN_CITY_OPTIONS.find(
                (option) => option.city === event.target.value,
              )

              if (selectedLocation) {
                onLocationChange(selectedLocation)
              }
            }}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-water"
          >
            <option value="">{t('input.locationPlaceholder')}</option>
            {TAIWAN_CITY_OPTIONS.map((option) => (
              <option key={option.city} value={option.city}>
                {t(`input.cityOptions.${option.key}`, { defaultValue: option.city })}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onNext}
          disabled={!isStep1Complete}
          className="w-full py-3 bg-water text-white rounded-lg font-medium hover:bg-water-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('input.nextStep')}
        </button>
      </div>
    </div>
  )
}

export { BirthDateInput } from './BirthDateInput'
export { BirthHourSelect } from './BirthHourSelect'
export { GenderSelect } from './GenderSelect'
