import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useJournalFilters from '../components/hooks/useJournalFilters'

const mockEntries = [
  { date: '2026-03-07', entries: ['morning light', 'coffee'], tags: ['Rest'] },
  { date: '2026-03-06', entries: ['finished a project'], tags: ['Work'] },
  { date: '2026-03-05', entries: ['a stranger smiled'], tags: ['Joy', 'Rest'] },
]

describe('useJournalFilters', () => {
  it('returns all entries when no filters are active', () => {
    const { result } = renderHook(() => useJournalFilters(mockEntries))
    expect(result.current.filtered).toHaveLength(3)
  })

  it('filters by search term against entry text', () => {
    const { result } = renderHook(() => useJournalFilters(mockEntries))
    act(() => result.current.setSearch('coffee'))
    expect(result.current.filtered).toHaveLength(1)
    expect(result.current.filtered[0].date).toBe('2026-03-07')
  })

  it('filters by active tag', () => {
    const { result } = renderHook(() => useJournalFilters(mockEntries))
    act(() => result.current.setActiveTag('Rest'))
    expect(result.current.filtered).toHaveLength(2)
  })

  it('filters by selected calendar date', () => {
    const { result } = renderHook(() => useJournalFilters(mockEntries))
    act(() => result.current.setCalDate('2026-03-06'))
    expect(result.current.filtered).toHaveLength(1)
  })

  it('returns empty array when no entries match the search', () => {
    const { result } = renderHook(() => useJournalFilters(mockEntries))
    act(() => result.current.setSearch('xyz123notreal'))
    expect(result.current.filtered).toHaveLength(0)
  })

  it('updates filtered when entries prop changes (regression: stale closure)', () => {
    let entries = []
    const { result, rerender } = renderHook(
      ({ e }) => useJournalFilters(e),
      { initialProps: { e: entries } }
    )
    expect(result.current.filtered).toHaveLength(0)
    rerender({ e: mockEntries })
    expect(result.current.filtered).toHaveLength(3)
  })
})