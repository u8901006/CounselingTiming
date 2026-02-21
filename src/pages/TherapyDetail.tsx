import { useParams, useNavigate } from 'react-router-dom'
import { getTherapyById } from '../data/therapy-details'
import { ELEMENT_NAMES } from '../data/wuxing-therapy'

export default function TherapyDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const therapy = getTherapyById(id || '')

  if (!therapy) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4 dark:text-white">找不到此治療取向</h1>
          <button onClick={() => navigate(-1)} className="text-blue-500 hover:underline">
            返回
          </button>
        </div>
      </div>
    )
  }

  const wuxingColors: Record<string, string> = {
    wood: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    fire: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
    water: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    earth: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
    metal: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
  }

  const wuxingBorders: Record<string, string> = {
    wood: 'border-l-green-500',
    fire: 'border-l-red-500',
    water: 'border-l-blue-500',
    earth: 'border-l-yellow-500',
    metal: 'border-l-gray-500',
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <button 
          onClick={() => navigate(-1)} 
          className="mb-4 text-blue-500 hover:underline flex items-center gap-1"
        >
          <span>←</span> 返回
        </button>
        
        <div className={`card border-l-4 ${wuxingBorders[therapy.wuxing]}`}>
          <div className="mb-6">
            <span className={`text-sm px-2 py-1 rounded ${wuxingColors[therapy.wuxing]}`}>
              {ELEMENT_NAMES[therapy.wuxing]}行取向
            </span>
            <h1 className="text-2xl font-bold mt-2 dark:text-white">{therapy.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{therapy.enName}</p>
          </div>
          
          <section className="mb-6">
            <h2 className="font-bold mb-2 dark:text-white">簡介</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{therapy.description}</p>
          </section>
          
          <section className="mb-6">
            <h2 className="font-bold mb-2 dark:text-white">適用狀況</h2>
            <div className="flex flex-wrap gap-2">
              {therapy.suitableFor.map((item, i) => (
                <span 
                  key={i} 
                  className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>
          
          <section className="mb-6">
            <h2 className="font-bold mb-2 dark:text-white">如何運作</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{therapy.howItWorks}</p>
          </section>
          
          <section className="mb-6">
            <h2 className="font-bold mb-2 dark:text-white">進行方式</h2>
            <p className="text-gray-700 dark:text-gray-300">{therapy.sessionFormat}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              <span className="font-medium">預計療程：</span>{therapy.duration}
            </p>
          </section>
          
          {therapy.references.length > 0 && (
            <section>
              <h2 className="font-bold mb-2 dark:text-white">參考資料</h2>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                {therapy.references.map((ref, i) => (
                  <li key={i}>{ref}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          本資訊僅供參考，選擇治療方式時應諮詢專業人士
        </div>
      </div>
    </div>
  )
}
