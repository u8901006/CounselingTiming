interface ProgressBarProps {
  currentStep: number
  totalSteps?: number
}

export function ProgressBar({ currentStep, totalSteps = 3 }: ProgressBarProps) {
  return (
    <div className="flex justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1
        const isActive = stepNumber === currentStep
        
        return (
          <div
            key={stepNumber}
            className={`w-3 h-3 rounded-full transition-colors ${
              isActive ? 'bg-water' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            aria-label={`Step ${stepNumber}${isActive ? ' (current)' : ''}`}
          />
        )
      })}
    </div>
  )
}
