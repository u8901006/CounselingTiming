import { useMemo } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import * as numerologyModule from './modules/numerology'
import * as vedicAstroModule from './modules/vedic-astro'
import * as westernAstroModule from './modules/western-astro'
import {
  useAppStore,
  DivinationMethod,
  DivinationResults,
  LocationInput,
} from './store/useAppStore'
import { type HistoryRecord, useHistoryStore } from './store/useHistoryStore'
import { useThemeEffect } from './utils/theme'

import ErrorBoundary from './components/ErrorBoundary'
import HistoryList from './components/HistoryList'
import { Header, Footer, ProgressBar } from './components/Layout'
import { InputForm } from './components/InputForm'
import MethodSelector from './components/MethodSelector'
import {
  ZiweiResult, BaziResult, IChingResult, TarotResult,
  LiuyaoResult,
  WesternAstroResult, VedicAstroResult, NumerologyResult,
  TimingScore, WuxingDisplay, TherapyRecommendation, OverallAdvice, GPTIntegration,
  CopyAllResultsAction,
} from './components/Results'
import ExportButton from './components/ExportButton'
import ThemeToggle from './components/ThemeToggle'
import LanguageSwitcher from './components/LanguageSwitcher'
import { buildResultSummary } from './utils/resultSummary'

function Navigation() {
  const { t } = useTranslation()
  
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 mb-4">
      <div className="max-w-4xl mx-auto px-4 py-2">
        <div className="flex flex-wrap gap-2 justify-center">
          <Link 
            to="/" 
            className="px-3 py-1 text-sm rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 dark:text-gray-200"
          >
            {t('nav.home') || '首頁'}
          </Link>
          <Link 
            to="/numerology" 
            className="px-3 py-1 text-sm rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 dark:text-gray-200"
          >
            數字命理
          </Link>
          <Link 
            to="/western-astro" 
            className="px-3 py-1 text-sm rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 dark:text-gray-200"
          >
            西洋占星
          </Link>
          <Link 
            to="/vedic-astro" 
            className="px-3 py-1 text-sm rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 dark:text-gray-200"
          >
            吠陀占星
          </Link>
        </div>
      </div>
    </nav>
  )
}

import TherapyDetailPage from './pages/TherapyDetail'
import NumerologyPage from './pages/Numerology'
import WesternAstroPage from './pages/WesternAstro'
import VedicAstroPage from './pages/VedicAstro'

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

interface SupplementalAnalysisInput {
  birthDate: string
  birthHour: number
  name: string
  location: LocationInput
  selectedMethods: DivinationMethod[]
}

type SupplementalAnalysisResults = Pick<
  DivinationResults,
  'westernAstro' | 'vedicAstro' | 'numerology'
>

export function calculateSupplementalResults({
  birthDate,
  birthHour,
  name,
  location,
  selectedMethods,
}: SupplementalAnalysisInput): SupplementalAnalysisResults {
  const [year, month, day] = birthDate.split('-').map(Number)

  if (!year || !month || !day) {
    throw new Error('Invalid birth date')
  }

  const hasLocation = Boolean(location.city) && Number.isFinite(location.lat) && Number.isFinite(location.lng)
  const hasName = Boolean(name.trim())

  let westernAstroResult = null
  if (selectedMethods.includes('western-astro') && hasLocation) {
    try {
      westernAstroResult = westernAstroModule.calculateWesternAstrology(
        year,
        month,
        day,
        birthHour,
        0,
        location.lat,
        location.lng,
      )
    } catch (error) {
      console.error('Western astrology analysis failed:', error)
    }
  }

  let vedicAstroResult = null
  if (selectedMethods.includes('vedic-astro') && hasLocation) {
    try {
      vedicAstroResult = vedicAstroModule.calculateVedicAstrology(
        year,
        month,
        day,
        birthHour,
        0,
        location.lat,
        location.lng,
      )
    } catch (error) {
      console.error('Vedic astrology analysis failed:', error)
    }
  }

  let numerologyResult = null
  if (selectedMethods.includes('numerology') && hasName) {
    try {
      numerologyResult = numerologyModule.calculateNumerology(name, year, month, day)
    } catch (error) {
      console.error('Numerology analysis failed:', error)
    }
  }

  return {
    westernAstro: westernAstroResult,
    vedicAstro: vedicAstroResult,
    numerology: numerologyResult,
  }
}

function AppContent() {
  const { t, i18n } = useTranslation()
  useThemeEffect()

  const {
    step, setStep,
    birthDate, birthHour, gender, name, question, location,
    setBirthDate, setBirthHour, setGender, setName, setQuestion, setLocation,
    setSelectedMethods, selectedMethods, toggleMethod,
    liuyaoDraft, setLiuyaoDraft,
    result, setResult,
    divinationResults, setDivinationResults,
    isLoading, setIsLoading,
    reset
  } = useAppStore()

  const { addRecord } = useHistoryStore()

  const resultSummary = useMemo(
    () =>
      buildResultSummary({
        question,
        selectedMethods,
        divinationResults,
        result,
        t,
      }),
    [divinationResults, i18n.resolvedLanguage, question, result, selectedMethods, t],
  )

  const hasMeaningfulResultSummary = useMemo(() => {
    if (!result) {
      return false
    }

    if (selectedMethods.length > 0) {
      return true
    }

    return Boolean(result.overallAdvice.trim())
  }, [result, selectedMethods])

  const handleAnalyze = async () => {
    setIsLoading(true)

    try {
      const supplementalResults = calculateSupplementalResults({
        birthDate,
        birthHour,
        name,
        location,
        selectedMethods,
      })

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

      const liuyaoResult = selectedMethods.includes('liuyao') ? liuyaoDraft : null

      const ziweiTraits = ziweiResult?.majorStars ? ['深層探索'] : []
      const timing = analyzeTiming(timingFactors)
      const orientation = matchCounselingOrientation(elementScores, ziweiTraits)
      const recommendation = generateFullRecommendation(timing, orientation)

      const nextDivinationResults = {
        iching: ichingDivResult,
        liuyao: liuyaoResult,
        tarot: tarotReading,
        ziwei: ziweiResult,
        bazi: baziResult,
        westernAstro: supplementalResults.westernAstro,
        vedicAstro: supplementalResults.vedicAstro,
        numerology: supplementalResults.numerology,
      }

      const summaryText = buildResultSummary({
        question,
        selectedMethods,
        divinationResults: nextDivinationResults,
        result: recommendation,
        t,
      })

      setResult(recommendation)
      setDivinationResults(nextDivinationResults)

      addRecord({
        birthDate,
        birthHour,
        gender,
        name,
        question,
        location,
        selectedMethods,
        result: recommendation,
        divinationResults: nextDivinationResults,
        summaryText,
      })

      setStep(3)
    } catch (error) {
      console.error('Analysis failed:', error)
      alert('分析過程發生錯誤，請稍後再試')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectHistoryRecord = (record: HistoryRecord) => {
    setBirthDate(record.birthDate)
    setBirthHour(record.birthHour)
    setGender(record.gender)
    setName(record.name)
    setQuestion(record.question)
    setLocation(record.location)
    setSelectedMethods(record.selectedMethods)
    setLiuyaoDraft(record.divinationResults.liuyao)
    setResult(record.result)
    setDivinationResults(record.divinationResults)
    setStep(3)
  }

  const renderStep1 = () => (
    <InputForm
      birthDate={birthDate}
      birthHour={birthHour}
      gender={gender}
      name={name}
      location={location}
      onBirthDateChange={setBirthDate}
      onBirthHourChange={setBirthHour}
      onGenderChange={setGender}
      onNameChange={setName}
      onLocationChange={setLocation}
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
      question={question}
      onQuestionChange={setQuestion}
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

        {selectedMethods.includes('liuyao') && divinationResults.liuyao && (
          <LiuyaoResult result={divinationResults.liuyao} />
        )}

        {selectedMethods.includes('western-astro') && (
          <WesternAstroResult chart={divinationResults.westernAstro} />
        )}

        {selectedMethods.includes('vedic-astro') && (
          <VedicAstroResult chart={divinationResults.vedicAstro} />
        )}

        {selectedMethods.includes('numerology') && (
          <NumerologyResult result={divinationResults.numerology} />
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

        <GPTIntegration />

        <div className="flex gap-2 justify-center">
          <CopyAllResultsAction
            summaryText={resultSummary}
            hasMeaningfulContent={hasMeaningfulResultSummary}
          />
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

      <div className="flex justify-center gap-2 mb-4">
        <ThemeToggle />
        <LanguageSwitcher />
      </div>

      <Navigation />

      <ProgressBar currentStep={step} totalSteps={3} />

      <main className="space-y-6">
        <section className="max-w-2xl mx-auto">
          <HistoryList onSelectRecord={handleSelectHistoryRecord} maxDisplay={5} />
        </section>
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
          <Route path="/numerology" element={<NumerologyPage />} />
          <Route path="/western-astro" element={<WesternAstroPage />} />
          <Route path="/vedic-astro" element={<VedicAstroPage />} />
          <Route path="/therapy/:id" element={<TherapyDetailPage />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App
