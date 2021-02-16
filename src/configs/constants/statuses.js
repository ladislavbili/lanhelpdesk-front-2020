export const actions = [ {
    label: 'None (nothing happens)',
    value: 'None'
  },
  {
    label: 'Open (none is open)',
    value: 'IsOpen'
  },
  {
    label: 'New (none is new)',
    value: 'IsNew'
  },
  {
    label: 'Close (set close date as current, can be invoiced)',
    value: 'CloseDate'
  },
  {
    label: `Close Invalid (set close date as current, can't be invoiced)`,
    value: 'CloseInvalid'
  },
  {
    label: 'Pending (set pending date to 24 hour)',
    value: 'PendingDate'
  },
]