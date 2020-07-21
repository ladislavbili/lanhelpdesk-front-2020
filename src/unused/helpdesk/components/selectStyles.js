export const selectStyle = {
	control: base => ({
		...base,
		minHeight: 30,
		backgroundColor: 'white'
	}),
	dropdownIndicator: base => ({
		...base,
		padding: 4,
	}),
	clearIndicator: base => ({
		...base,
		padding: 4,
	}),
	multiValue: base => ({
		...base,
		backgroundColor: 'white',
	}),
	valueContainer: base => ({
		...base,
		padding: '0px 6px',
	}),
	input: base => ({
		...base,
		margin: 0,
		padding: 0,
		backgroundColor: 'white',
	}),
	indicatorSeparator: base => ({
		...base,
		width: 0,
	}),

};

export const invisibleSelectStyle = {
	control: (base,state) => ({
		...base,
		minHeight: 30,
		backgroundColor: state.isFocused?'white':'inherit',
		borderWidth:0
	}),
	dropdownIndicator: base => ({
		...base,
		padding: 4,
	}),
	clearIndicator: base => ({
		...base,
		padding: 4,
	}),
	multiValue: base => ({
		...base,
		backgroundColor: 'white',
	}),
	valueContainer: base => ({
		...base,
		padding: '0px 6px',
	}),
	input: base => ({
		...base,
		margin: 0,
		padding: 0,
		backgroundColor: 'white',
	}),
	indicatorSeparator: base => ({
		...base,
		width: 0,
	}),

};
