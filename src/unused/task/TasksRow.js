import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
								<table className="table table-hover m-0">
									<thead>
										<tr>
											<th>
												<div>
													<input id="action-checkbox" type="checkbox" />
													<label for="action-checkbox" />
												</div>
											</th>
											<th>
												ID{' '}
												<span>
													<i className="fa fa-arrow-down" />
												</span>
											</th>
											<th>
												Status{' '}
												<span>
													<i className="fa fa-arrow-down" />
												</span>
											</th>
											<th style={{ width: '35%' }}>
												Name{' '}
												<span>
													<i className="fa fa-arrow-down" />
												</span>
											</th>
											<th>
												{' '}
												Zadal{' '}
												<span>
													<i className="fa fa-arrow-down" />
												</span>
											</th>
											<th>
												Firma{' '}
												<span>
													<i className="fa fa-arrow-down" />
												</span>
											</th>
											<th>
												Riesi{' '}
												<span>
													<i className="fa fa-arrow-down" />
												</span>
											</th>
											<th>
												Created{' '}
												<span>
													<i className="fa fa-arrow-down" />
												</span>
											</th>
											<th>
												Deadline{' '}
												<span>
													<i className="fa fa-arrow-down" />
												</span>
											</th>
										</tr>
									</thead>

									<tbody>
										<tr className="h-30">
											<td>
												<div>
													<input id="checkbox2" type="checkbox" checked="" />
													<label for="checkbox2" />
												</div>
											</td>
											<td>152</td>
											<td>New</td>
											<td>
												{' '}
												<Link className="link" to={{ pathname: `/helpdesk/taskTop3` }}>
												Task top two collums whit inline labels and grey background
												</Link>
											</td>
											<td>Branislav Šusta</td>
											<td>LAN Systems s.r.o.</td>
											<td>Patrik Patoprsty</td>
											<td>15.04 2.10.2018</td>
											<td>15.05 2.11.2018</td>
										</tr>
										<tr className="h-30">
											<td>
												<div>
													<input id="checkbox2" type="checkbox" checked="" />
													<label for="checkbox2" />
												</div>
											</td>
											<td>152</td>
											<td>New</td>
											<td>
												{' '}
												<Link className="link" to={{ pathname: `/helpdesk/taskSide3` }}>
													Editácia task z atribútmi na lavom boku
												</Link>
											</td>
											<td>Branislav Šusta</td>
											<td>LAN Systems s.r.o.</td>
											<td>Patrik Patoprsty</td>
											<td>15.04 2.10.2018</td>
											<td>15.05 2.11.2018</td>
										</tr>
										<tr className="h-30">
											<td>
												<div>
													<input id="checkbox2" type="checkbox" checked="" />
													<label for="checkbox2" />
												</div>
											</td>
											<td>152</td>
											<td>New</td>
											<td>
												{' '}
												<Link className="link" to={{ pathname: `/helpdesk/TaskTopChiptask` }}>
													Editácia tasku ako chiptask
												</Link>
											</td>
											<td>Branislav Šusta</td>
											<td>LAN Systems s.r.o.</td>
											<td>Patrik Patoprsty</td>
											<td>15.04 2.10.2018</td>
											<td>15.05 2.11.2018</td>
										</tr>
									</tbody>
								</table>
								<div className="d-flex justify-content-between">
									<div>
										<p>Page 1 of 0 ｜ Task number: 0 </p>
									</div>
									<div>
										<p>0</p>
									</div>
									<div>
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
