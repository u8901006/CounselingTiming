import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useAppStore } from './store/useAppStore'
import { useHistoryStore } from './store/useHistoryStore'
import { useThemeEffect } from './utils/theme'

import ErrorBoundary from './components/ErrorBoundary'
import { Header, Footer, ProgressBar } from './components/Layout'
import { InputForm } from './components/InputForm'
import MethodSelector from './components/MethodSelector'
import {
  ZiweiResult, BaziResult, IChingResult, TarotResult,
  TimingScore, WuxingDisplay, TherapyRecommendation, OverallAdvice
} from './components/Results'
import ExportButton from './components/ExportButton'
import ThemeToggle from './components/ThemeToggle'
import LanguageSwitcher from './components/LanguageSwitcher'

import TherapyDetailPage from './pages/TherapyDetail'

import { ELEMENT_NAMES } from './data/wuxing-therapy'
import {
  analyzeTiming,
  matchCounselingOrientation,
  generateFullRecommendation,
  ElementScores,
  TimingFactor,
} from './analysis/orientation'
import { coinDivination, analyzeTimingFromHexagram } from './modules/iching'
import { drawCards, interpretReading, getTimingScoreFromTarot, fetchAllCards, TarotCard } from './modules/tarot'
import { getZiweiResult, getBaziResult, getZiweiTimingFactors } from './modules/ziwei'

import './i18n'

function AppContent() {
  const { t } = useTranslation()
  useThemeEffect()

  const {
    step, setStep,
    birthDate, birthHour, gender,
    setBirthDate, setBirthHour, setGender,
    selectedMethods, toggleMethod,
    result, setResult,
    divinationResults, setDivinationResults,
    isLoading, setIsLoading,
    reset
  } = useAppStore()

  const { addRecord } = useHistoryStore()

  const handleAnalyze = async () => {
    setIsLoading(true)

    try {
      const timingFactors: TimingFactor[] = []
      let allTarotCards: TarotCard[] = []

      if (selectedMethods.includes('tarot')) {
        try {
          allTarotCards = await fetchAllCards()
        } catch (e) {
          console.error('Failed to fetch tarot cards:', e)
        }
      }

      let ziweiResult = null
      let baziResult = null
      let elementScores: ElementScores = {
        wood: 20, fire: 20, water: 20, earth: 20, metal: 20
      }

      if (selectedMethods.includes('ziwei') || selectedMethods.includes('bazi')) {
        baziResult = getBaziResult(birthDate, birthHour)
        ziweiResult = getZiweiResult(birthDate, birthHour, gender)

        if (baziResult) {
          elementScores = {
            wood: baziResult.wuxingScores.wood || 0,
            fire: baziResult.wuxingScores.fire || 0,
            water: baziResult.wuxingScores.water || 0,
            earth: baziResult.wuxingScores.earth || 0,
            metal: baziResult.wuxingScores.metal || 0,
          }
        }
      }

      if (selectedMethods.includes('bazi') && baziResult) {
        timingFactors.push({
          source: 'bazi',
          factor: '五行分析',
          impact: baziResult.wuxingScores[baziResult.dominantWuxing] > 35 ? 10 : 5,
          description: `五行${ELEMENT_NAMES[baziResult.dominantWuxing]}氣較強`,
        })
        if (baziResult.wuxingScores[baziResult.deficientWuxing] < 15) {
          timingFactors.push({
            source: 'bazi',
            factor: '五行失衡',
            impact: 10,
            description: `五行${ELEMENT_NAMES[baziResult.deficientWuxing]}氣偏弱，需要平衡`,
          })
        }
      }

      if (selectedMethods.includes('ziwei') && ziweiResult) {
        const ziweiFactors = getZiweiTimingFactors(ziweiResult)
        timingFactors.push(...ziweiFactors.map(f => ({
          source: 'ziwei' as const,
          ...f,
        })))
      }

      let ichingDivResult = null
      if (selectedMethods.includes('iching')) {
        ichingDivResult = coinDivination()
        const ichingTiming = analyzeTimingFromHexagram(ichingDivResult)
        timingFactors.push(...ichingTiming.factors.map(f => ({
          source: 'iching' as const,
          factor: f,
          impact: ichingTiming.score > 50 ? 10 : 5,
          description: f,
        })))
      }

      let tarotReading = null
      if (selectedMethods.includes('tarot') && allTarotCards.length > 0) {
        const drawnCards = drawCards(allTarotCards, 3)
        tarotReading = interpretReading(drawnCards, 'three')
        const tarotTiming = getTimingScoreFromTarot(tarotReading)
        timingFactors.push(...tarotTiming.factors.map(f => ({
          source: 'tarot' as const,
          factor: f,
          impact: tarotTiming.score > 50 ? 10 : 5,
          description: f,
        })))
      }

      const ziweiTraits = ziweiResult?.majorStars ? ['深層探索'] : []
      const timing = analyzeTiming(timingFactors)
      const orientation = matchCounselingOrientation(elementScores, ziweiTraits)
      const recommendation = generateFullRecommendation(timing, orientation)

      setResult(recommendation)
      setDivinationResults({
        iching: ichingDivResult,
        tarot: tarotReading,
        ziwei: ziweiResult,
        bazi: baziResult,
      })

      addRecord({
        birthDate,
        birthHour,
        gender,
        selectedMethods,
        result: recommendation,
        divinationResults: {
          iching: ichingDivResult,
          tarot: tarotReading,
          ziwei: ziweiResult,
          bazi: baziResult,
        },
      })

      setStep(3)
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('分析過程發生錯誤，請稍後再試')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStep1 = () => (
    <InputForm
      birthDate={birthDate}
      birthHour={birthHour}
      gender={gender}
      onBirthDateChange={setBirthDate}
      onBirthHourChange={setBirthHour}
      onGenderChange={setGender}
      onNext={() => setStep(2)}
    />
  )

  const renderStep2 = () => (
    <MethodSelector
      selectedMethods={selectedMethods}
      onToggle={toggleMethod}
      onBack={() => setStep(1)}
      onAnalyze={handleAnalyze}
      isLoading={isLoading}
    />
  )

  const renderStep3 = () => {
    if (!result) return null

    const { timing, orientation, overallAdvice } = result

    return (
      <div id="result-content" className="max-w-2xl mx-auto space-y-6">
        {isLoading && (
          <div className="card text-center py-8 dark:text-gray-200">
            <div className="text-lg">正在進行占卜分析...</div>
          </div>
        )}

        {selectedMethods.includes('ziwei') && divinationResults.ziwei && (
          <ZiweiResult ziwei={divinationResults.ziwei} />
        )}

        {selectedMethods.includes('bazi') && divinationResults.bazi && (
          <BaziResult bazi={divinationResults.bazi} />
        )}

        {selectedMethods.includes('iching') && divinationResults.iching && (
          <IChingResult result={divinationResults.iching} />
        )}

        {selectedMethods.includes('tarot') && divinationResults.tarot && (
          <TarotResult reading={divinationResults.tarot} />
        )}

        <TimingScore
          score={timing.score}
          level={timing.level}
          factors={timing.factors}
        />

        <WuxingDisplay
          elementScores={orientation.elementScores as unknown as Record<string, number>}
          dominant={orientation.dominantElement}
          deficient={orientation.deficientElement}
        />

        <TherapyRecommendation therapies={orientation.therapies} />

        <OverallAdvice advice={overallAdvice} />

        <div className="flex gap-2 justify-center">
          <ExportButton targetId="result-content" />
        </div>

        <button
          onClick={reset}
          className="w-full py-3 border border-gray-300 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-200"
        >
          {t('result.restart')}
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <Header title={t('app.title')} subtitle={t('app.subtitle')} />

      <div className="flex justify-center gap-2 mb-8">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>

      <ProgressBar currentStep={step} totalSteps={3} />

      <main>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </main>

      <Footer
        disclaimer={t('footer.disclaimer')}
        reference={t('footer.reference')}
      />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/therapy/:id" element={<TherapyDetailPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
