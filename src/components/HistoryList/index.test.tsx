import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import '../../i18n'
import HistoryList from './index'
import { type DivinationMethod } from '../../store/useAppStore'
import { useHistoryStore } from '../../store/useHistoryStore'

function makeHistoryRecord() {
  return {
    id: 'history-1',
    timestamp: Date.UTC(2026, 2, 14, 10, 30),
    birthDate: '1990-05-10',
    birthHour: 8,
    gender: 'male' as const,
    name: 'Taylor Swift',
    question: 'Should I start counseling now?',
    location: { city: 'Taipei', lat: 25.033, lng: 121.5654 },
    selectedMethods: ['ziwei', 'numerology'] as DivinationMethod[],
    result: null,
    divinationResults: {
      iching: null,
      liuyao: null,
      tarot: null,
      ziwei: null,
      bazi: null,
      westernAstro: null,
      vedicAstro: null,
      numerology: null,
    },
    summaryText: 'summary line 1\nsummary line 2\nsummary line 3',
  }
}

afterEach(() => {
  act(() => {
    useHistoryStore.setState({ records: [] })
  })
})

describe('HistoryList', () => {
  it('shows an empty state when there are no records', () => {
    render(<HistoryList />)

    expect(screen.getByText(/尚無分析記錄|No saved analyses yet/i)).toBeTruthy()
  })

  it('shows summary preview and methods for each record', () => {
    act(() => {
      useHistoryStore.setState({ records: [makeHistoryRecord()] })
    })

    render(<HistoryList onSelectRecord={vi.fn()} />)

    expect(screen.getByText(/Should I start counseling now/i)).toBeTruthy()
    expect(screen.getByText(/summary line 1/i)).toBeTruthy()
    expect(screen.getByText(/紫微|Zi Wei Dou Shu/i)).toBeTruthy()
  })

  it('calls onSelectRecord when a card is clicked', () => {
    const onSelectRecord = vi.fn()

    act(() => {
      useHistoryStore.setState({ records: [makeHistoryRecord()] })
    })

    render(<HistoryList onSelectRecord={onSelectRecord} />)

    fireEvent.click(screen.getByText(/Should I start counseling now/i))

    expect(onSelectRecord).toHaveBeenCalledTimes(1)
  })

  it('removes a record without triggering selection', () => {
    const onSelectRecord = vi.fn()

    act(() => {
      useHistoryStore.setState({ records: [makeHistoryRecord()] })
    })

    render(<HistoryList onSelectRecord={onSelectRecord} />)

    fireEvent.click(screen.getByRole('button', { name: /刪除|Delete/i }))

    expect(useHistoryStore.getState().records).toHaveLength(0)
    expect(onSelectRecord).not.toHaveBeenCalled()
  })

  it('clears all records when the clear button is clicked', () => {
    act(() => {
      useHistoryStore.setState({ records: [makeHistoryRecord()] })
    })

    render(<HistoryList />)

    fireEvent.click(screen.getByRole('button', { name: /清除所有記錄|Clear history/i }))

    expect(useHistoryStore.getState().records).toEqual([])
  })
})
