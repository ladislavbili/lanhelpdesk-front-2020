import React, { Component } from 'react';

export default class TasksBoard extends Component {
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
		return (
			<div className="row">
				<div className="col-lg-3">
					<div className="task-box" style={{ marginTop: '0' }}>
						<div className="task-box-heading" style={{ backgroundColor: '#1976d2' }}>
							<h4 className="text-white header-title m-t-0">New</h4>
						</div>
						<div className="task-box-list">
							<ul className="sortable-list taskList list-unstyled" id="upcoming">
								<li className="task-new" id="task1">
									<div className="checkbox checkbox-primary">
										<input type="checkbox" aria-label="Single checkbox Two" />
										<label>#142 Nefunguje klavesnica</label>
									</div>
									<span className="label label-info m-r-5">Tag 1</span>
									<span className="label label-success m-r-5">Tag 2</span>
									<div className="m-t-5">
										<p className="pull-right m-b-0">
											<i className="fa fa-clock-o" />{' '}
											<span title="15/06/2016 12:56">15/06/2016</span>
										</p>
										<p className="text-muted m-b-0 font-13">
											<span className="font-bold">Zadal: Petey Cruiser</span>
										</p>
										<p className="text-muted m-b-10 font-13">
											<span className="font-bold">Riesi: Petey Cruiser</span>
										</p>
									</div>
								</li>
							</ul>
						</div>
						<div className="row m-l-10 m-r-10">
							<div className="col-7">Showing 1 - 10 of 289</div>
							<div className="col-5 m-b-10">
								<div className="btn-group pull-right">
									<button type="button" className="btn btn-sm btn-default waves-effect">
										<i className="fa fa-chevron-left" />
									</button>
									<button type="button" className="btn btn-sm btn-default waves-effect">
										<i className="fa fa-chevron-right" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="col-lg-3">
					<div className="task-box" style={{ marginTop: '0' }}>
						<div className="task-box-heading" style={{ backgroundColor: '#32CD32' }}>
							<h4 className="text-white header-title m-t-0">Open</h4>
						</div>
						<div className="task-box-list">
							<ul className="sortable-list taskList list-unstyled" id="upcoming">
								<li className="task-new" id="task1">
									<div className="checkbox checkbox-primary">
										<input type="checkbox" aria-label="Single checkbox Two" />
										<label>#142 Nefunguje klavesnica</label>
									</div>
									<span className="label label-info m-r-5">Tag 1</span>
									<span className="label label-success m-r-5">Tag 2</span>
									<div className="m-t-5">
										<p className="pull-right m-b-0">
											<i className="fa fa-clock-o" />{' '}
											<span title="15/06/2016 12:56">15/06/2016</span>
										</p>
										<p className="text-muted m-b-0 font-13">
											<span className="font-bold">Zadal: Petey Cruiser</span>
										</p>
										<p className="text-muted m-b-10 font-13">
											<span className="font-bold">Riesi: Petey Cruiser</span>
										</p>
									</div>
								</li>
							</ul>
						</div>
						<div className="row m-l-10 m-r-10">
							<div className="col-7">Showing 1 - 10 of 289</div>
							<div className="col-5 m-b-10">
								<div className="btn-group pull-right">
									<button type="button" className="btn btn-sm btn-default waves-effect">
										<i className="fa fa-chevron-left" />
									</button>
									<button type="button" className="btn btn-sm btn-default waves-effect">
										<i className="fa fa-chevron-right" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="col-lg-3">
					<div className="task-box" style={{ marginTop: '0' }}>
						<div className="task-box-heading" style={{ backgroundColor: '#F5A623' }}>
							<h4 className="text-white header-title m-t-0">Pending</h4>
						</div>
						<div className="task-box-list">
							<ul className="sortable-list taskList list-unstyled" id="upcoming">
								<li className="task-new" id="task1">
									<div className="checkbox checkbox-primary">
										<input type="checkbox" aria-label="Single checkbox Two" />
										<label>#142 Nefunguje klavesnica</label>
									</div>
									<span className="label label-info m-r-5">Tag 1</span>
									<span className="label label-success m-r-5">Tag 2</span>
									<div className="m-t-5">
										<p className="pull-right m-b-0">
											<i className="fa fa-clock-o" />{' '}
											<span title="15/06/2016 12:56">15/06/2016</span>
										</p>
										<p className="text-muted m-b-0 font-13">
											<span className="font-bold">Zadal: Petey Cruiser</span>
										</p>
										<p className="text-muted m-b-10 font-13">
											<span className="font-bold">Riesi: Petey Cruiser</span>
										</p>
									</div>
								</li>
							</ul>
						</div>
						<div className="row m-l-10 m-r-10">
							<div className="col-7">Showing 1 - 10 of 289</div>
							<div className="col-5 m-b-10">
								<div className="btn-group pull-right">
									<button type="button" className="btn btn-sm btn-default waves-effect">
										<i className="fa fa-chevron-left" />
									</button>
									<button type="button" className="btn btn-sm btn-default waves-effect">
										<i className="fa fa-chevron-right" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="col-lg-3">
					<div className="task-box" style={{ marginTop: '0' }}>
						<div className="task-box-heading" style={{ backgroundColor: '#A9A9A9' }}>
							<h4 className="text-white header-title m-t-0">Closed</h4>
						</div>
						<div className="task-box-list">
							<ul className="sortable-list taskList list-unstyled" id="upcoming">
								<li className="task-new" id="task1">
									<div className="checkbox checkbox-primary">
										<input type="checkbox" aria-label="Single checkbox Two" />
										<label>#142 Nefunguje klavesnica</label>
									</div>
									<span className="label label-info m-r-5">Tag 1</span>
									<span className="label label-success m-r-5">Tag 2</span>
									<div className="m-t-5">
										<p className="pull-right m-b-0">
											<i className="fa fa-clock-o" />{' '}
											<span title="15/06/2016 12:56">15/06/2016</span>
										</p>
										<p className="text-muted m-b-0 font-13">
											<span className="font-bold">Zadal: Petey Cruiser</span>
										</p>
										<p className="text-muted m-b-10 font-13">
											<span className="font-bold">Riesi: Petey Cruiser</span>
										</p>
									</div>
								</li>
							</ul>
						</div>
						<div className="row m-l-10 m-r-10">
							<div className="col-7">Showing 1 - 10 of 289</div>
							<div className="col-5 m-b-10">
								<div className="btn-group pull-right">
									<button type="button" className="btn btn-sm btn-default waves-effect">
										<i className="fa fa-chevron-left" />
									</button>
									<button type="button" className="btn btn-sm btn-default waves-effect">
										<i className="fa fa-chevron-right" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
