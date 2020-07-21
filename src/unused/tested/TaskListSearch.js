import React, { Component } from 'react';

import TasksBoard from '../task/TasksBoard';
import TasksRowEmpty from './TasksRowEmpty';
import Filter from '../task/Filter';
import TasksTwo from '../task/TasksTwo';

export default class TaskListContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openAddStatusModal: false,
			openAddTaskModal: false,
			isColumn: false,
			search: '',
			taskListType: 'option2',
			filterView: true,
			sortType: 0,
		};
	}
	render() {
		return (
			<div className="content-page">
				<div className="content" style={{ paddingTop: 15 }}>
					<div className="commandbar">
						<div className="row">
							<div className="col-sm-6">
								<h4 className="page-title" style={{ fontSize: 24 }}>
									Global
								</h4>
							</div>
						</div>
						<div className="row m-t-10 m-b-10">
							<div className="d-flex flex-row align-items-center">
								<div className="p2" style={{ marginLeft: 10 }}>
									<button
										className="btn btn-success waves-effect  btn-sm"
										onClick={() => this.setState({ filterView: !this.state.filterView })}
									>
										Filter
									</button>
								</div>
								<div className="p-2">
									<div className="input-group">
										<input type="text" className="form-control" placeholder="Search string" />
										<div className="input-group-append">
											<button className="btn btn-white" type="button">
												<i className="fa fa-search" />
											</button>
										</div>
									</div>
								</div>
								<div className="p-2">
									<p className="m-0">Global</p>
								</div>
								<div className="p-2">
									<div
										className="checkbox form-check-inline"
										style={{ marginLeft: 38, marginRight: 30 }}
									>
										<input id="checkbox0" type="checkbox" />
										<label for="checkbox0">NEW</label>
									</div>
									<div className="checkbox form-check-inline" style={{ marginRight: 30 }}>
										<input id="checkbox0" type="checkbox" />
										<label for="checkbox0">OPEN</label>
									</div>
									<div className="checkbox form-check-inline" style={{ marginRight: 30 }}>
										<input id="checkbox0" type="checkbox" />
										<label for="checkbox0">PENDING</label>
									</div>
									<div className="checkbox form-check-inline" style={{ marginRight: 30 }}>
										<input id="checkbox0" type="checkbox" />
										<label for="checkbox0">CLOSED</label>
									</div>
								</div>
							</div>

							<div className="p-2 ml-auto">
								<div className="btn-group btn-group-toggle" data-toggle="buttons">
									<label
										className={
											'btn btn-outline-blue waves-effect ' +
											(this.state.taskListType === 'option1' ? ' active' : '')
										}
									>
										<input
											type="radio"
											name="options"
											id="option1"
											autoComplete="off"
											checked={this.state.taskListType === 'option1'}
											onChange={() => this.setState({ taskListType: 'option1' })}
										/>
										<i className="fa fa-list" />
									</label>
									<label
										className={
											'btn btn-outline-blue waves-effect ' +
											(this.state.taskListType === 'option2' ? ' active' : '')
										}
									>
										<input
											type="radio"
											name="options"
											id="option2"
											autoComplete="off"
											onChange={() => this.setState({ taskListType: 'option2' })}
											checked={this.state.taskListType === 'option2'}
										/>
										<i className="fa fa-map" />
									</label>

									<label
										className={
											'btn btn-outline-blue waves-effect ' +
											(this.state.taskListType === 'option3' ? ' active' : '')
										}
									>
										<input
											type="radio"
											name="options"
											id="option3"
											autoComplete="off"
											onChange={() => this.setState({ taskListType: 'option3' })}
											checked={this.state.taskListType === 'option3'}
										/>
										<i className="fa fa-columns" />
									</label>
								</div>
							</div>
						</div>
					</div>

					<div className="row m-0">
						{this.state.filterView && (
							<div className="col-xl-3">
								<Filter />
							</div>
						)}

						{this.state.taskListType === 'option2' && (
							<div className={'' + (this.state.filterView ? 'col-xl-9' : 'col-xl-12')}>
								<TasksRowEmpty />{' '}
							</div>
						)}

						{this.state.taskListType === 'option1' && (
							<div className={'' + (this.state.filterView ? 'col-xl-9' : 'col-xl-12')}>
								<TasksBoard />
							</div>
						)}

						{this.state.taskListType === 'option3' && (
							<div className={'' + (this.state.filterView ? 'col-xl-9' : 'col-xl-12')}>
								<TasksTwo />
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}
