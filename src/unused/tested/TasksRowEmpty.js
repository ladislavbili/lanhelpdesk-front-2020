import React, { Component } from 'react';

export default class TasksRow2 extends Component {
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
			<div>
				<div className="row">
					<div className="col-md-12">
						<div className="card-box">
							<div className="table-responsive">
								<table className="table table-hover mails m-0">
									<thead>
										<tr>
											<th>
												<div className="checkbox checkbox-primary checkbox-single m-r-15">
													<input id="action-checkbox" type="checkbox" />
													<label for="action-checkbox" />
												</div>
											</th>
											<th>
												ID
												<span className="tableArrow">
													<i className="fa fa-arrow-down" />
												</span>
											</th>
											<th>
												Status{' '}
												<span className="tableArrow">
													<i className="fa fa-arrow-down" />
												</span>
											</th>
											<th style={{ width: '35%' }}>
												Name{' '}
												<span className="tableArrow">
													<i className="fa fa-arrow-down" />
												</span>
											</th>
											<th>
												{' '}
												Zadal{' '}
												<span className="tableArrow">
													<i className="fa fa-arrow-down" />
												</span>
											</th>
											<th>
												Firma{' '}
												<span className="tableArrow">
													<i className="fa fa-arrow-down" />
												</span>
											</th>
											<th>
												Riesi{' '}
												<span className="tableArrow">
													<i className="fa fa-arrow-down" />
												</span>
											</th>
											<th>
												Created{' '}
												<span className="tableArrow">
													<i className="fa fa-arrow-down" />
												</span>
											</th>
											<th>
												Deadline{' '}
												<span className="tableArrow">
													<i className="fa fa-arrow-down" />
												</span>
											</th>
										</tr>
									</thead>

									<tbody>
										<tr className="">
											<td />
											<td />
											<td />
											<td style={{ color: 'red' }}>Vyhľadávaniu nezodpovedajú žiadne úlohy.</td>
										</tr>
									</tbody>
								</table>
								<div className="d-flex justify-content-between">
									<div className="p-2">
										<p>Page 1 of 0 ｜ Task number: 0 </p>
									</div>
									<div className="p-2">
										<p>0</p>
									</div>
									<div className="p-2">
										<p>Items per page: 20</p>
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
