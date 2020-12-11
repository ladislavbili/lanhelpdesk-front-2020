export const defaultVykazyChanges = {
  subtask: {
    ADD: [],
    EDIT: [],
    DELETE: []
  },
  trip: {
    ADD: [],
    EDIT: [],
    DELETE: []
  },
  material: {
    ADD: [],
    EDIT: [],
    DELETE: []
  },
  customItem: {
    ADD: [],
    EDIT: [],
    DELETE: []
  },
}
export const invoicedAttributes = {
  subtask: [
    'price',
    'quantity',
    'type',
    'assignedTo',
  ],
  trip: [
    'price',
    'quantity',
    'type',
    'assignedTo',
  ],
  material: [
    'title',
    'quantity',
    'price',
    'totalPrice',
    'margin',
  ],
  customItem: [
    'title',
    'quantity',
    'price',
    'totalPrice',
  ],
}
export const defaultCheckboxList = [ {
    id: 1,
    title: 'Test item 1',
    done: false,
  },
  {
    id: 2,
    title: 'Test item 2',
    done: true,
  },
  {
    id: 3,
    title: 'Test item 3',
    done: false,
  },
]

export const noTaskType = {
  label: 'No type',
  title: 'No type',
  value: null,
  id: null
}