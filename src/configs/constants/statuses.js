export const actions = [ {
    label: 'None (nothing happens when status is selected)',
    value: 'None'
  },
  {
    label: 'None (is open)',
    value: 'IsOpen'
  },
  {
    label: 'None (is new)',
    value: 'IsNew'
  },
  {
    label: 'Set close date (sets close date as current)',
    value: 'CloseDate'
  },
  {
    label: 'Set close invalid (sets close date as current)',
    value: 'CloseInvalid'
  },
  {
    label: 'Set pending date (sets pending date as 1 day from now)',
    value: 'PendingDate'
  },
  {
    label: `Set task as invoiced (can't be edited again, used only while invoicing tasks)`,
    value: 'Invoice'
  },
]