import React, { Component } from 'react';
import Select from 'react-select';
import Comments from '../components/comments.js';
import Subtasks from '../components/subtasks';

export default class TaskTop4 extends Component {
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
			control: styles => ({ ...styles, backgroundColor: 'white' }),
		};

		return (
			<div className="content-page">
				<div className="content">
					<div className="commandbar">
						<div className="row">
							<div className="col-lg-12">
								<div className="card-box">
									<div className="row">
										<div className="col-lg-12">
											<h1># 142 Nefunguje klavesnica</h1>
											<hr />
										</div>
										<div className="col-lg-12">
											<strong>Tagy: </strong>
											<span className="label label-info m-r-5">Mimo pracovných hodín</span>
											<span className="label label-success m-r-5">Telefonovať</span>
										</div>
										<div className="col-lg-12 p-0">
											<div className="col-lg-4">
												<div className="m-t-20">
													<div className="form-group m-b-10 row">
														<label className="col-3 col-form-label">Status</label>
														<div className="col-9">
															<Select options={statuses} styles={selectStyle} />
														</div>
													</div>
													<div className="form-group m-b-10 row">
														<label className="col-3 col-form-label">Projekt</label>
														<div className="col-9">
															<Select options={statuses} styles={selectStyle} />
														</div>
													</div>
													<div className="form-group m-b-10 row">
														<label className="col-3 col-form-label">Typ prace</label>
														<div className="col-9">
															<Select options={statuses} styles={selectStyle} />
														</div>
													</div>
													<div className="form-group m-b-10 row">
														<label className="col-3 col-form-label">Pausal</label>
														<div className="col-9">
															<Select options={statuses} styles={selectStyle} />
														</div>
													</div>
												</div>
											</div>
											<div className="col-lg-4">
												<div className="m-t-20">
													<div className="form-group m-b-10 row">
														<label className="col-3 col-form-label">Zadal</label>
														<div className="col-9">
															<Select options={statuses} styles={selectStyle} />
														</div>
													</div>
													<div className="form-group m-b-10 row">
														<label className="col-3 col-form-label">Firma</label>
														<div className="col-9">
															<Select options={statuses} styles={selectStyle} />
														</div>
													</div>
													<div className="form-group m-b-10 row">
														<label className="col-3 col-form-label">Riesi</label>
														<div className="col-9">
															<Select options={statuses} styles={selectStyle} />
														</div>
													</div>
												</div>
											</div>

											<div className="col-lg-4">
												<div className="m-t-20">
													<div className="form-group m-b-10 row">
														<label className="col-3 col-form-label">Pripomienka</label>
														<div className="col-9">
															<Select options={statuses} styles={selectStyle} />
														</div>
													</div>
													<div className="form-group m-b-10 row">
														<label className="col-3 col-form-label">Deadline</label>
														<div className="col-9">
															<Select options={statuses} styles={selectStyle} />
														</div>
													</div>
													<div className="form-group m-b-10 row">
														<label className="col-3 col-form-label">Opakovanie</label>
														<div className="col-9">
															<Select options={statuses} styles={selectStyle} />
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<label className="">Popis</label>
									<textarea className="form-control" rows="2" />
									<Subtasks />
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
