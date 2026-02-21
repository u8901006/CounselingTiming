import { useTranslation } from 'react-i18next'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'zh-TW' ? 'en' : 'zh-TW')
  }
  
  return (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 text-sm border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
    >
      {i18n.language === 'zh-TW' ? 'EN' : '中文'}
    </button>
  )
}
