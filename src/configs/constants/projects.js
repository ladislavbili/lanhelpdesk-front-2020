import booleanSelects from './boolSelect';
export const noDef = {
	status:{def:false, fixed:false, value: null, show: true },
	tags:{def:false, fixed:false, value: [], show: true },
	assignedTo:{def:false, fixed:false, value: [], show: true },
	type:{def:false, fixed:false, value: null, show: true },
	requester:{def:false, fixed:false, value: null, show: true },
	company:{def:false, fixed:false, value: null, show: true },
	pausal:{def:false, fixed:false, value: booleanSelects[0], show: true },
	overtime:{def:false, fixed:false, value: booleanSelects[0], show: true },
}
