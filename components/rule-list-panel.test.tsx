import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { RuleListPanel } from './rule-list-panel'
import type { Rule } from '@/lib/types'

const mockRules: Rule[] = [
  {
    id: '1',
    name: 'Rule 1',
    status: 'active',
    priority: 1,
    customers: [],
    taskTypes: [],
    locationTypes: [],
    itemGroups: [],
    triggers: {
      zeroStock: false,
      lowStock: false,
      lowStockThreshold: 0,
      exception: false,
      exceptionTypes: [],
    },
    execution: {
      countMethod: 'smart',
      defaultAssignee: 'Unassigned',
      instantCount: false,
      allowSkip: true,
      preventDuplicates: true,
    },
  },
  {
    id: '2',
    name: 'Rule 2',
    status: 'disabled',
    priority: 2,
    customers: [],
    taskTypes: [],
    locationTypes: [],
    itemGroups: [],
    triggers: {
      zeroStock: false,
      lowStock: false,
      lowStockThreshold: 0,
      exception: false,
      exceptionTypes: [],
    },
    execution: {
      countMethod: 'smart',
      defaultAssignee: 'Unassigned',
      instantCount: false,
      allowSkip: true,
      preventDuplicates: true,
    },
  },
]

describe('RuleListPanel', () => {
  it('should call onToggleStatus with the correct arguments when a rule status is changed', () => {
    const onToggleStatusMock = vi.fn()

    render(
      <RuleListPanel
        rules={mockRules}
        selectedRuleId={null}
        onSelectRule={() => {}}
        onNewRule={() => {}}
        onMoveUp={() => {}}
        onMoveDown={() => {}}
        onToggleStatus={onToggleStatusMock}
      />
    )

    const rule1 = mockRules[0]
    const rule2 = mockRules[1]

    // Find the switches. There's one per rule.
    const switches = screen.getAllByRole('switch')
    const rule1Switch = switches[0]
    const rule2Switch = switches[1]
    
    // Test toggling Rule 1 from active to disabled
    fireEvent.click(rule1Switch)
    expect(onToggleStatusMock).toHaveBeenCalledWith(rule1.id, 'disabled')

    // Test toggling Rule 2 from disabled to active
    fireEvent.click(rule2Switch)
    expect(onToggleStatusMock).toHaveBeenCalledWith(rule2.id, 'active')
  })
})
