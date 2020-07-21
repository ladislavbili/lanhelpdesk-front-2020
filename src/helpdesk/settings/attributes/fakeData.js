export const ROLES = [
  {id: '0',
  title: 'Guest',
  value: '0',
  label: 'Guest',
},
{
  id: '1',
  title: 'User',
  value: '1',
  label: 'User',
},
{
  id: '2',
  title: 'Agent',
  value: '2',
  label: 'Agent',
},
{
  id: '3',
  title: 'Manager',
  value: '3',
  label: 'Manager',
},
{
  id: '4',
  title: 'Admin',
  value: '4',
  label: 'Admin',
}
];

export const ATTRIBUTES = [
  {label: 'Status', value:'1', static: true, title: 'Status', id: '1', view: [...ROLES], edit: [...ROLES], type: { id: '3', title: 'Select', value: '3', label: 'Select'}, selectValuesType: 'statuses'},
  {label: 'Projekt', value:'2', static: true, title: 'Projekt', id: '2', view: [...ROLES], edit: [...ROLES], type: { id: '3', title: 'Select', value: '3', label: 'Select'}, selectValuesType: 'projects'},
  {label: 'Zadal', value:'3', static: true, title: 'Zadal', id: '3', view: [...ROLES], edit: [...ROLES], type: { id: '3', title: 'Select', value: '3', label: 'Select'}, selectValuesType: 'users'},
  {label: 'Deadline', value:'4', static: true, title: 'Deadline', id: '4', view: [...ROLES], edit: [...ROLES], type: {id: '2',  title: 'Number', value: '2',  label: 'Number'}, defaultNumberValue: 0},
  {label: 'Milestone', value:'5', static: true, title: 'Milestone', id: '5', view: [...ROLES], edit: [...ROLES], type: { id: '3', title: 'Select', value: '3', label: 'Select'}},
  {label: 'Repeat', value:'6', static: true, title: 'Repeat', id: '6', view: [...ROLES], edit: [...ROLES], type: { id: '5', title: 'Date', value: '5', label: 'Date'}},
  {label: 'Typ', value:'7', static: false, title: 'Typ', id: '7', view: [...ROLES], edit: [...ROLES], type: { id: '3', title: 'Select', value: '3', label: 'Select'}, selectValuesType: 'taskTypes'},
  {label: 'Paušál', value:'8', static: false, title: 'Paušál', id: '8', view: [...ROLES], edit: [...ROLES], type: { id: '3', title: 'Select', value: '3', label: 'Select'}, selectValuesType: 'yesNo', selectValues: [{id: 1, title: "Yes"}, {id: 0, title: "No"}]},
  {label: 'Mimo PH', value:'9', static: false, title: 'Mimo PH', id: '9', view: [...ROLES], edit: [...ROLES], type: { id: '3', title: 'Select', value: '3', label: 'Select'}, selectValuesType: 'yesNo', selectValues: [{id: 1, title: "Yes"}, {id: 0, title: "No"}]},
];


export const TYPES = [
  {id: '0',
    title: 'Text',
    value: '0',
    label: 'Text',
  },
  {
    id: '1',
    title: 'Textarea',
    value: '1',
    label: 'Textarea',
  },
  {
    id: '2',
    title: 'Number',
    value: '2',
    label: 'Number',
  },
  {
    id: '3',
    title: 'Select',
    value: '3',
    label: 'Select',
  },
  {
    id: '4',
    title: 'Multiselect',
    value: '4',
    label: 'Multiselect',
  },
  {
    id: '5',
    title: 'Date',
    value: '5',
    label: 'Date',
  },
];
