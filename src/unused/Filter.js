import React, { Component } from 'react';
import Select from 'react-select';

export default class Filter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openAddStatusModal: false,
			openAddTaskModal: false,
			isColumn: false,
			search: '',
			taskListType: 'option2',
			filterView: 'false',
		};
	}
	render() {
		const statuses = [
			{ value: 'new', label: 'New' },
			{ value: 'open', label: 'Open' },
			{ value: 'pending', label: 'Closed' },
		];

		const selectStyle = {
			control: base => ({
				...base,
				minHeight: 30,
				backgroundColor: 'white',
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
		};
		return (
			<div className="card" style={{ height: '100%', background: 'white' }}>
				<div className="form-group" style={{ margin: 10 }} >
					<label>Status</label>
					<Select options={statuses} styles={selectStyle} />
				</div>
				<div className="form-group" style={{ margin: 10 }} >
					<label>Vytvoril</label>
					<Select options={statuses} styles={selectStyle} />
				</div>
				<div className="form-group" style={{ margin: 10 }} >
					<label>Ziadatel</label>
					<Select options={statuses} styles={selectStyle} />
				</div>
				<div className="form-group" style={{ margin: 10 }} >
					<label>Firma</label>
					<Select options={statuses} styles={selectStyle} />
				</div>
				<div className="form-group" style={{ margin: 10 }} >
					<label>Riesitel</label>
					<Select options={statuses} styles={selectStyle} />
				</div>
				<div className="form-group" style={{ margin: 10 }} >
					<label>Typ práce</label>
					<Select options={statuses} styles={selectStyle} />
				</div>
				<div className="form-group" style={{ margin: 10 }} >
					<label>Tag</label>
					<Select options={statuses} styles={selectStyle} />
				</div>
				<div className="form-group" style={{ margin: 10 }} >
					<div className="row">
						<div className="col-xl-6">
							<label>Vytvorene</label>
							<input
								type="text"
								className="form-control mb-2"
								id="inlineFormInput"
								placeholder="Od"
								style={{height:30}}
							/>

						</div>
						<div className="col-xl-6">
							<label></label>
							<input
								type="text"
								className="form-control mb-2 mt-2"
								id="inlineFormInput"
								placeholder="Od"
								style={{height:30}}
							/>
						</div>
					</div>
				</div>
				<div className="form-group" style={{ margin: 10 }} >
					<div className="row">
						<div className="col-xl-6">
							<label>Pripomienka</label>
							<input
								type="text"
								className="form-control mb-2"
								id="inlineFormInput"
								placeholder="Od"
								style={{height:30}}
							/>

						</div>
						<div className="col-xl-6">
							<label></label>
							<input
								type="text"
								className="form-control mb-2 mt-1"
								id="inlineFormInput"
								placeholder="Od"
								style={{height:30}}
							/>
						</div>
					</div>
				</div>
				<div className="form-group" style={{ margin: 10 }} >
					<div className="row">
						<div className="col-xl-6">
							<label>Deadline</label>
							<input
								type="text"
								className="form-control mb-2"
								id="inlineFormInput"
								placeholder="Od"
								style={{height:30}}
							/>

						</div>
						<div className="col-xl-6">
							<label></label>
							<input
								type="text"
								className="form-control mb-2 mt-1"
								id="inlineFormInput"
								placeholder="Od"
								style={{height:30}}
							/>
						</div>
					</div>
				</div>
				<div className="form-group" style={{ margin: 10 }} >
					<div className="row">
						<div className="col-xl-6">
							<label>Status date</label>
							<input
								type="text"
								className="form-control mb-2"
								id="inlineFormInput"
								placeholder="Od"
								style={{height:30}}
							/>

						</div>
						<div className="col-xl-6">
							<label></label>
							<input
								type="text"
								className="form-control mb-2 mt-1"
								id="inlineFormInput"
								placeholder="Od"
								style={{height:30}}
							/>
						</div>
					</div>
				</div>
			</div >
		);
	}
}
