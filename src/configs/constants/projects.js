import booleanSelects from './boolSelect';
export const noDef = {
  status: {
    def: false,
    fixed: false,
    value: null,
    required: true
  },
  tag: {
    def: false,
    fixed: false,
    value: [],
    required: true
  },
  assignedTo: {
    def: false,
    fixed: false,
    value: [],
    required: true
  },
  taskType: {
    def: false,
    fixed: false,
    value: null,
    required: true
  },
  requester: {
    def: false,
    fixed: false,
    value: null,
    required: true
  },
  company: {
    def: false,
    fixed: false,
    value: null,
    required: true
  },
  pausal: {
    def: false,
    fixed: false,
    value: booleanSelects[ 0 ],
    required: true
  },
  overtime: {
    def: false,
    fixed: false,
    value: booleanSelects[ 0 ],
    required: true
  },
}

export const defList = {
  fixed: false,
  def: false,
  required: false,
  value: []
}
export const defBool = {
  fixed: false,
  def: false,
  required: false,
  value: {
    value: false,
    label: 'No'
  }
}
export const defItem = {
  fixed: false,
  def: false,
  required: false,
  value: null,
}

export const emptyUserValue = {
  id: null,
  value: null,
  label: 'Task Creator',
  title: 'Task Creator'
}

export const emptyCompanyValue = {
  id: null,
  value: null,
  label: "Task Creator's company",
  title: "Task Creator's company"
}

export const emptyStatus = {
  title: 'New (first with new action)',
  id: null,
  label: 'New (first with new action)',
  value: null,
  color: 'green'
};