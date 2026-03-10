import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import '../../i18n'
import MethodSelector from './index'

describe('MethodSelector', () => {
  it('renders question as a controlled field and exposes the new methods', () => {
    const onQuestionChange = vi.fn()

    render(
      <MethodSelector
        selectedMethods={[]}
        onToggle={vi.fn()}
        onBack={vi.fn()}
        onAnalyze={vi.fn()}
        isLoading={false}
        question="Career direction"
        onQuestionChange={onQuestionChange}
      />,
    )

    const questionInput = screen.getByDisplayValue('Career direction')
    fireEvent.change(questionInput, { target: { value: 'Relationship timing' } })

    expect(onQuestionChange).toHaveBeenCalledWith('Relationship timing')
    expect(screen.getByText('西洋占星')).toBeInTheDocument()
    expect(screen.getByText('吠陀占星')).toBeInTheDocument()
    expect(screen.getByText('數字命理')).toBeInTheDocument()
  })

  it('calls onToggle when a method option is activated', () => {
    const onToggle = vi.fn()

    render(
      <MethodSelector
        selectedMethods={[]}
        onToggle={onToggle}
        onBack={vi.fn()}
        onAnalyze={vi.fn()}
        isLoading={false}
        question="Career direction"
        onQuestionChange={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /西洋占星/i }))

    expect(onToggle).toHaveBeenCalledWith('western-astro')
  })

  it('keeps analyze disabled until both method and non-blank question are present', () => {
    const { rerender } = render(
      <MethodSelector
        selectedMethods={[]}
        onToggle={vi.fn()}
        onBack={vi.fn()}
        onAnalyze={vi.fn()}
        isLoading={false}
        question="   "
        onQuestionChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: '開始分析' })).toBeDisabled()

    rerender(
      <MethodSelector
        selectedMethods={['western-astro']}
        onToggle={vi.fn()}
        onBack={vi.fn()}
        onAnalyze={vi.fn()}
        isLoading={false}
        question="   "
        onQuestionChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: '開始分析' })).toBeDisabled()

    rerender(
      <MethodSelector
        selectedMethods={[]}
        onToggle={vi.fn()}
        onBack={vi.fn()}
        onAnalyze={vi.fn()}
        isLoading={false}
        question="Need clarity"
        onQuestionChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: '開始分析' })).toBeDisabled()

    rerender(
      <MethodSelector
        selectedMethods={['western-astro']}
        onToggle={vi.fn()}
        onBack={vi.fn()}
        onAnalyze={vi.fn()}
        isLoading={false}
        question="Need clarity"
        onQuestionChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: '開始分析' })).toBeEnabled()
  })
})
