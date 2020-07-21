import React, { Component } from 'react';
import Select from 'react-select';
import Comments from '../components/comments.js';
import Subtasks from '../components/subtasks';
import Items from '../components/taskMaterials';

export default class TaskSideLeft extends Component {
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
						<div className="row m-b-20">
							<div className="col-lg-8">
								<div className="button-list">
									<button className="btn btn-icon waves-effect btn-default ">
										{' '}
										<i className="fa fa-arrow-left" />{' '}
									</button>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-lg-4">
								<div className="card-box">
									<h1># 142 Nefunguje klavesnica</h1>
									<hr />

									<div className="m-b-20">
										<strong>Tagy: </strong>
										<span className="label label-info m-r-5">Mimo pracovných hodín</span>
										<span className="label label-success m-r-5">Telefonovať</span>
									</div>
									<div className="form-group m-b-10">
										<label>Status</label>
										<Select options={statuses} styles={selectStyle} />
									</div>
									<div className="form-group m-b-10">
										<label className="">Popis</label>
										<textarea className="form-control" rows="2" />
									</div>

									<Subtasks />

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
									<Items />
								</div>
							</div>
							<div className="col-lg-8">
								<div className="card-box">
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
