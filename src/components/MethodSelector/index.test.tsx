import { act, fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import '../../i18n'
import type { LiuyaoHexagramResult } from '../../modules/liuyao'
import { useAppStore } from '../../store/useAppStore'
import MethodSelector from './index'

const validLiuyaoDraft: LiuyaoHexagramResult = {
  lines: [
    { value: 'yang', isMoving: false },
    { value: 'yin', isMoving: true },
    { value: 'yang', isMoving: false },
    { value: 'yin', isMoving: false },
    { value: 'yang', isMoving: true },
    { value: 'yin', isMoving: false },
  ],
  movingLineIndexes: [2, 5],
}

describe('MethodSelector', () => {
  beforeEach(() => {
    useAppStore.getState().reset()
  })

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

  it('renders the liuyao input when liuyao is selected', () => {
    render(
      <MethodSelector
        selectedMethods={['liuyao']}
        onToggle={vi.fn()}
        onBack={vi.fn()}
        onAnalyze={vi.fn()}
        isLoading={false}
        question="Career direction"
        onQuestionChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: /六爻/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '手動輸入' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '自動起卦' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '上一步' })).toHaveAttribute('type', 'button')
    expect(screen.getByRole('button', { name: '開始分析' })).toHaveAttribute('type', 'button')
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

  it('keeps analyze disabled when liuyao is selected without a completed draft', () => {
    render(
      <MethodSelector
        selectedMethods={['liuyao']}
        onToggle={vi.fn()}
        onBack={vi.fn()}
        onAnalyze={vi.fn()}
        isLoading={false}
        question="Need clarity"
        onQuestionChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: '開始分析' })).toBeDisabled()

    fireEvent.click(screen.getByRole('button', { name: '自動起卦' }))
    fireEvent.click(screen.getByRole('button', { name: '產生卦稿' }))

    expect(screen.getByRole('button', { name: '開始分析' })).toBeEnabled()
  })

  it('disables analyze again when switching from a valid auto draft to incomplete manual mode', () => {
    render(
      <MethodSelector
        selectedMethods={['liuyao']}
        onToggle={vi.fn()}
        onBack={vi.fn()}
        onAnalyze={vi.fn()}
        isLoading={false}
        question="Need clarity"
        onQuestionChange={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: '自動起卦' }))
    fireEvent.click(screen.getByRole('button', { name: '產生卦稿' }))

    expect(screen.getByRole('button', { name: '開始分析' })).toBeEnabled()

    fireEvent.click(screen.getByRole('button', { name: '手動輸入' }))

    expect(screen.getByRole('button', { name: '開始分析' })).toBeDisabled()
  })

  it('disables analyze after liuyao is deselected and reselected with only a stale draft', () => {
    const state = useAppStore.getState()
    act(() => {
      state.toggleMethod('liuyao')
      state.setLiuyaoDraft(validLiuyaoDraft)
    })

    const { rerender } = render(
      <MethodSelector
        selectedMethods={useAppStore.getState().selectedMethods}
        onToggle={vi.fn()}
        onBack={vi.fn()}
        onAnalyze={vi.fn()}
        isLoading={false}
        question="Need clarity"
        onQuestionChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: '開始分析' })).toBeEnabled()

    act(() => {
      state.toggleMethod('liuyao')
    })
    rerender(
      <MethodSelector
        selectedMethods={useAppStore.getState().selectedMethods}
        onToggle={vi.fn()}
        onBack={vi.fn()}
        onAnalyze={vi.fn()}
        isLoading={false}
        question="Need clarity"
        onQuestionChange={vi.fn()}
      />,
    )

    act(() => {
      state.toggleMethod('liuyao')
    })
    rerender(
      <MethodSelector
        selectedMethods={useAppStore.getState().selectedMethods}
        onToggle={vi.fn()}
        onBack={vi.fn()}
        onAnalyze={vi.fn()}
        isLoading={false}
        question="Need clarity"
        onQuestionChange={vi.fn()}
      />,
    )

    expect(screen.getByRole('button', { name: '開始分析' })).toBeDisabled()
  })
})
