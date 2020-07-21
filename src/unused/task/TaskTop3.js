import React, { Component } from 'react';
import Select from 'react-select';
import Comments from '../components/comments.js';
import Subtasks from '../components/subtasks';
import Items from '../components/taskMaterials';

export default class TaskTop3 extends Component {
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
			<div>
				<div className="row" style={{ marginLeft: 240 }}>
					<div className="col-lg-12">
						<div
							className="card-box"
							style={{
								maxWidth: 1284,
								margin: 'auto',
								background: '#F9F9F9',
								marginTop: 50,
								paddingTop: 0,
							}}
						>
							<div className="d-flex flex-row">
								<div className="p-2 align-self-center" style={{}}>
									{' '}
									<button type="button" className="btn btn-link waves-effect" style={{ paddingLeft: 0 }}>
										<i
											className="fas fa-arrow-left"
											style={{
												color: '#4a81d4',
												fontSize: '1.2em',
											}}
										/>
									</button>
								</div>
								<div className="p-2">
									<h1># 143 Nefunguje klavesnica</h1>
								</div>
								<div className="ml-auto p-2 align-self-center">
									{' '}
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

							<div className="row">
								<div className="col-lg-12">
									<strong>Tagy: </strong>
									<span className="label label-info m-r-5">Mimo pracovných hodín</span>
									<span className="label label-success m-r-5">Telefonovať</span>
								</div>
								<div className="col-lg-12 p-0">
									<div className="col-lg-6">
										<div className="m-t-20">
											<div className="form-group m-b-10 row">
												<label className="col-4 col-form-label">Status</label>
												<div className="col-8">
													<Select options={statuses} styles={selectStyle} isMulti/>
												</div>
											</div>
											<div className="form-group m-b-10 row">
												<label className="col-4 col-form-label">Projekt</label>
												<div className="col-8">
													<Select options={statuses} styles={selectStyle} />
												</div>
											</div>
											<div className="form-group m-b-10 row">
												<label className="col-4 col-form-label">Zadal</label>
												<div className="col-8">
													<Select options={statuses} styles={selectStyle} />
												</div>
											</div>
											<div className="form-group m-b-10 row">
												<label className="col-4 col-form-label">Firma</label>
												<div className="col-8">
													<Select options={statuses} styles={selectStyle} />
												</div>
											</div>
											<div className="form-group m-b-10 row">
												<label className="col-4 col-form-label">Riesi</label>
												<div className="col-8">
													<Select options={statuses} styles={selectStyle} />
												</div>
											</div>
											<div className="form-group m-b-10 row">
												<label className="col-4 col-form-label">Typ prace</label>
												<div className="col-8">
													<Select options={statuses} styles={selectStyle} />
												</div>
											</div>
										</div>
									</div>
									<div className="col-lg-6">
										<div className="m-t-20">
											<div className="form-group m-b-10 row">
												<label className="col-4 col-form-label">Pripomienka</label>
												<div className="col-8">
													<Select options={statuses} styles={selectStyle} />
												</div>
											</div>
											<div className="form-group m-b-10 row">
												<label className="col-4 col-form-label">Deadline</label>
												<div className="col-8">
													<Select options={statuses} styles={selectStyle} />
												</div>
											</div>
											<div className="form-group m-b-10 row">
												<label className="col-4 col-form-label">Opakovanie</label>
												<div className="col-8">
													<Select options={statuses} styles={selectStyle} />
												</div>
											</div>
											<div className="form-group m-b-10 row">
												<label className="col-4 col-form-label">Pausal/Projekt</label>
												<div className="col-8">
													<Select options={statuses} styles={selectStyle} />
												</div>
											</div>
											<div className="form-group m-b-10 row">
												<label className="col-4 col-form-label">Hodiny</label>
												<div className="col-8">
													<Select options={statuses} styles={selectStyle} />
												</div>
											</div>
											<div className="form-group m-b-10 row">
												<label className="col-4 col-form-label">Po pracovnej dobe</label>
												<div className="col-8">
													<Select options={statuses} styles={selectStyle} />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<label className="">Popis</label>
							<textarea className="form-control" rows="1" />

							<Subtasks />
							<Items />
							<Comments />
						</div>
					</div>
				</div>
			</div>
		);
	}
}
