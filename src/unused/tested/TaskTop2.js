import React, { Component } from 'react';
import Select from 'react-select';
import Comments from '../components/comments.js';
import Subtasks from '../components/subtasks';
import Items from '../components/taskMaterials';

export default class TaskTop2 extends Component {
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
			control: styles => ({ ...styles, backgroundColor: 'white', maxHeight: 30 }),
		};

		return (
			<div className="content-page">
				<div className="content">
					<div className="commandbar">
						<div className="row">
							<div className="col-lg-12">
							<div className="card-box" style={{ maxWidth: 1284, margin: 'auto' }}>
									<div className="row">
										<div className="col-lg-12">
											<h1># 142 Nefunguje klavesnica</h1>
											<hr />
										</div>
										<div className="col-lg-1">
											<strong>Tagy: </strong>
											<span className="label label-info m-r-5">Mimo pracovných hodín</span>
											<span className="label label-success m-r-5">Telefonovať</span>
										</div>
										<div className="col-lg-12 p-0">
											<div className="col-lg-4">
												<div className="m-t-20">
													<div className="form-group m-b-10">
														<label>Status</label>
														<Select options={statuses} styles={selectStyle} />
													</div>
													<div className="form-group m-b-10">
														<label>Projekt</label>
														<Select options={statuses} styles={selectStyle} />
													</div>
													<div className="form-group m-b-10">
														<label>Typ prace</label>
														<Select options={statuses} styles={selectStyle} />
													</div>
													<div className="form-group m-b-10">
														<label>Odpracovaný čas</label>
														<Select options={statuses} styles={selectStyle} />
													</div>
												</div>
											</div>
											<div className="col-lg-4">
												<div className="m-t-20">
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
														<label>Mimo pracovných hodín</label>
														<Select options={statuses} styles={selectStyle} />
													</div>
												</div>
											</div>

											<div className="col-lg-4">
												<div className="m-t-20">
													<div className="form-group m-b-10">
														<label>Pripomienka</label>
														<Select options={statuses} styles={selectStyle} />
													</div>
													<div className="form-group m-b-10">
														<label>Deadline</label>
														<Select options={statuses} styles={selectStyle} />
													</div>
													<div className="form-group m-b-10">
														<label>Opakovanie</label>
														<Select options={statuses} styles={selectStyle} />
													</div>
													<div className="form-group m-b-10">
														<label>Pausal/Projekt</label>
														<Select options={statuses} styles={selectStyle} />
													</div>
												</div>
											</div>
										</div>
									</div>

									<label className="">Popis</label>
									<textarea className="form-control" rows="2" />
									<Subtasks />
									<Items />
									<Comments />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
