import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import i18n from '../../i18n'
import { useAppStore } from '../../store/useAppStore'
import LiuyaoInput from './index'

describe('LiuyaoInput', () => {
  afterEach(async () => {
    await act(async () => {
      await i18n.changeLanguage('zh-TW')
    })
  })

  beforeEach(() => {
    useAppStore.getState().reset()
  })

  it('switches between manual and auto modes', () => {
    render(<LiuyaoInput />)

    expect(screen.getByRole('button', { name: '手動輸入' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '自動起卦' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: '使用手動卦稿' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '自動起卦' }))

    expect(screen.getByRole('button', { name: '手動輸入' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: '自動起卦' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: '產生卦稿' })).toBeInTheDocument()
    expect(useAppStore.getState().liuyaoMode).toBe('auto')
  })

  it('blocks manual submission until all six lines are set', () => {
    render(<LiuyaoInput />)

    const submitButton = screen.getByRole('button', { name: '使用手動卦稿' })

    expect(submitButton).toBeDisabled()

    fireEvent.change(screen.getByLabelText('第 1 爻'), { target: { value: 'yang' } })
    fireEvent.change(screen.getByLabelText('第 2 爻'), { target: { value: 'yin' } })

    expect(submitButton).toBeDisabled()
    expect(useAppStore.getState().liuyaoDraft).toBeNull()
  })

  it('generates and rerolls a six-line auto draft', () => {
    render(<LiuyaoInput />)

    fireEvent.click(screen.getByRole('button', { name: '自動起卦' }))
    fireEvent.click(screen.getByRole('button', { name: '產生卦稿' }))

    let generatedDraft = screen.getByRole('list', { name: '已產生卦稿' })
    expect(within(generatedDraft).getAllByRole('listitem')).toHaveLength(6)
    expect(useAppStore.getState().liuyaoDraft?.lines).toHaveLength(6)

    fireEvent.click(screen.getByRole('button', { name: '重新起卦' }))

    generatedDraft = screen.getByRole('list', { name: '已產生卦稿' })
    expect(within(generatedDraft).getAllByRole('listitem')).toHaveLength(6)
    expect(useAppStore.getState().liuyaoDraft?.lines).toHaveLength(6)
  })

  it('renders localized English labels for liuyao input text', async () => {
    await act(async () => {
      await i18n.changeLanguage('en')
    })

    render(<LiuyaoInput />)

    expect(screen.getByRole('group', { name: 'Liuyao mode' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Manual input' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Auto cast' })).toBeInTheDocument()
    expect(screen.getByLabelText('Line 1')).toBeInTheDocument()
    expect(screen.getAllByRole('option', { name: 'Select line' })).toHaveLength(6)
    expect(screen.getAllByRole('option', { name: 'Yang' })).toHaveLength(6)
    expect(screen.getAllByRole('option', { name: 'Yin' })).toHaveLength(6)
    expect(screen.getAllByLabelText('Moving')).toHaveLength(6)
    expect(screen.getByRole('button', { name: 'Use manual draft' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Auto cast' }))

    expect(screen.getByRole('button', { name: 'Generate draft' })).toBeInTheDocument()
  })
})
