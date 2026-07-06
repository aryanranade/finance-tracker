import { describe, test, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Wallet, Inbox } from 'lucide-react'
import StatCard from '../components/StatCard'
import EmptyState from '../components/ui/EmptyState'

describe('StatCard', () => {
  test('renders title and trend label', () => {
    render(
      <StatCard title="Net Balance" amount={1200} icon={Wallet} trendLabel="This month" />
    )
    expect(screen.getByText('Net Balance')).toBeInTheDocument()
    expect(screen.getByText('This month')).toBeInTheDocument()
  })

  test('shows skeleton when loading', () => {
    const { container } = render(
      <StatCard title="Net Balance" amount={0} icon={Wallet} loading />
    )
    expect(container.querySelector('.skeleton')).toBeTruthy()
    expect(screen.queryByText('Net Balance')).not.toBeInTheDocument()
  })
})

describe('EmptyState', () => {
  test('renders title, description and working action', () => {
    const onClick = vi.fn()
    render(
      <EmptyState
        icon={Inbox}
        title="No transactions yet"
        description="Add your first transaction."
        action={<button onClick={onClick}>Add one</button>}
      />
    )
    expect(screen.getByText('No transactions yet')).toBeInTheDocument()
    expect(screen.getByText('Add your first transaction.')).toBeInTheDocument()
    fireEvent.click(screen.getByText('Add one'))
    expect(onClick).toHaveBeenCalledOnce()
  })
})
