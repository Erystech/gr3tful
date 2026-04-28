// src/test/streakUtil.test.js
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { calcStreak } from '../components/utils/streakUtil'

describe('calcStreak', () => {
  beforeEach(() => {
    // Pin "today" to a known date so tests never go stale
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-07'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns 0 for an empty entries array', () => {
    expect(calcStreak([])).toBe(0)
  })

  it('returns 1 for a single entry today', () => {
    const entries = [{ date: '2026-03-07' }]
    expect(calcStreak(entries)).toBe(1)
  })

  it('counts consecutive days correctly', () => {
    const entries = [
      { date: '2026-03-07' },
      { date: '2026-03-06' },
      { date: '2026-03-05' },
    ]
    expect(calcStreak(entries)).toBe(3)
  })

  it('breaks the streak on a gap day', () => {
    const entries = [
      { date: '2026-03-07' },
      { date: '2026-03-06' },
      { date: '2026-03-04' }, // gap — March 5 missing
    ]
    expect(calcStreak(entries)).toBe(2)
  })

  it('does not double-count duplicate dates', () => {
    const entries = [
      { date: '2026-03-07' },
      { date: '2026-03-07' }, // duplicate
      { date: '2026-03-06' },
    ]
    expect(calcStreak(entries)).toBe(2)
  })

  it('returns 0 when the last entry is not today or yesterday', () => {
    const entries = [{ date: '2026-03-01' }]
    expect(calcStreak(entries)).toBe(0)
  })
})