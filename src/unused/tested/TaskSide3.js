import React, { Component } from 'react';
import Select from 'react-select';
import Comments from '../components/comments.js';
import Subtasks from '../components/subtasks';

export default class TaskSide3 extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openAddStatusModal: false,
			openAddTaskModal: false,
			isColumn: false,
			search: '',
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
			<div className="content-page">
				<div className="content" style={{ padding: 0 }}>
					<div className="commandbar" style={{ padding: 0 }}>
						<div className="row">
							<div className="col-xl-12" style={{ height: 38 }}>
								<div
									className=""
									style={{
										borderRadius: 0,
										height: 38,
										backgroundColor: 'white',
										padding: '5px 0px 10px 10px',
									}}
								>
									<button type="button" className="btn btn-link waves-effect" style={{ paddingLeft: 0 }}>
										<i
											className="fas fa-arrow-left"
											style={{
												color: '#4a81d4',
												fontSize: '1.2em',
											}}
										/>
									</button>
									<button type="button" className="btn btn-link waves-effect">
										<i
											className="fas fa-print"
											style={{
												color: '#4a81d4',
												fontSize: '1.2em',
											}}
										/>
									</button>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-xl-12">
								<div className="card-box" style={{ borderRadius: 0, background: '#F9F9F9' }}>
									<div className="row">
										<div className="col-xl-9" style={{ paddingRight: 20 }}>
											<h1># 143 Nefunguje klavesnica</h1>
											<div className="m-b-20">
												<strong>Tagy: </strong>
												<span className="label label-info m-r-5">Mimo pracovných hodín</span>
												<span className="label label-success m-r-5">Telefonovať</span>
											</div>
											<label className="">Popis</label>
											<textarea className="form-control" rows="2" />
											<Subtasks />
											<Comments />
										</div>

										<div className="col-xl-3" style={{}}>
											<div className="form-group m-b-10">
												<label>Status</label>
												<Select options={statuses} styles={selectStyle} />
											</div>
											<div className="form-group m-b-10">
												<label>Projekt</label>
												<Select options={statuses} styles={selectStyle} />
											</div>
											<div className="form-group m-b-10">
												<label>Zadal</label>
												<Select options={statuses} styles={selectStyle} />
											</div>
											<div className="form-group m-b-10">
												<label>Firma</label>
												<Select options={statuses} styles={selectStyle} />
											</div>
											<div className="form-group m-b-10">
												<label>Riesi</label>
												<Select options={statuses} styles={selectStyle} />
											</div>
											<div className="form-group m-b-10">
												<label>Pripomienka</label>
												<Select options={statuses} styles={selectStyle} />
											</div>
											<div className="form-group m-b-10">
												<label>Deadline </label>
												<Select options={statuses} styles={selectStyle} />
											</div>
											<div className="form-group m-b-10">
												<label>Opakovanie </label>
												<Select options={statuses} styles={selectStyle} />
											</div>
											<div className="form-group m-b-10">
												<label>Paušal/projekt</label>
												<Select options={statuses} styles={selectStyle} />
											</div>
											<div className="form-group m-b-10">
												<label>Mimo pracovných hodín </label>
												<Select options={statuses} styles={selectStyle} />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
