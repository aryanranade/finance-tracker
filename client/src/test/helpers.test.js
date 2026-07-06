import { describe, test, expect } from 'vitest'
import {
  formatCurrency,
  clampPercent,
  getHealthScoreLabel,
  getHealthScoreColor,
  getLast6Months,
  CATEGORIES,
} from '../utils/helpers'

describe('formatCurrency', () => {
  test('formats dollars with two decimals', () => {
    expect(formatCurrency(1234.5)).toBe('$1,234.50')
    expect(formatCurrency(0)).toBe('$0.00')
  })
})

describe('clampPercent', () => {
  test('computes percentage of total', () => {
    expect(clampPercent(50, 100)).toBe(50)
  })
  test('clamps to 100 when over', () => {
    expect(clampPercent(250, 100)).toBe(100)
  })
  test('returns 0 for zero total (no divide-by-zero)', () => {
    expect(clampPercent(50, 0)).toBe(0)
  })
})

describe('health score helpers', () => {
  test('labels map to expected ranges', () => {
    expect(getHealthScoreLabel(90)).toBe('Excellent')
    expect(getHealthScoreLabel(70)).toBe('Good')
    expect(getHealthScoreLabel(50)).toBe('Fair')
    expect(getHealthScoreLabel(20)).toBe('Needs Work')
  })
  test('colors are valid hex', () => {
    expect(getHealthScoreColor(90)).toMatch(/^#[0-9a-f]{6}$/i)
    expect(getHealthScoreColor(10)).toMatch(/^#[0-9a-f]{6}$/i)
  })
})

describe('getLast6Months', () => {
  test('returns 6 ascending YYYY-MM strings ending this month', () => {
    const months = getLast6Months()
    expect(months).toHaveLength(6)
    months.forEach((m) => expect(m).toMatch(/^\d{4}-\d{2}$/))
    expect(months[5]).toBe(new Date().toISOString().slice(0, 7))
  })
})

describe('CATEGORIES', () => {
  test('contains the core categories', () => {
    expect(CATEGORIES).toContain('Food & Dining')
    expect(CATEGORIES).toContain('Salary')
  })
})
