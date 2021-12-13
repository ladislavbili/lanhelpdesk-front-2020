export const actions = [ {
    label: 'None (nothing happens)',
    value: 'None',
    labelId: 'actionNone'
  },
  {
    label: 'Open (none is open)',
    value: 'IsOpen',
    labelId: 'actionIsOpen'
  },
  {
    label: 'New (none is new)',
    value: 'IsNew',
    labelId: 'actionIsNew'
  },
  {
    label: 'Close (set close date as current, can be invoiced)',
    value: 'CloseDate',
    labelId: 'actionCloseDate'
  },
  {
    label: `Close Invalid (set close date as current, can't be invoiced)`,
    value: 'CloseInvalid',
    labelId: 'actionCloseInvalid'
  },
  {
    label: 'Pending (set pending date to 24 hour)',
    value: 'PendingDate',
    labelId: 'actionPendingDate'
  },
]