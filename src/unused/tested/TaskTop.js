import React, { Component } from 'react';
import Comments from '../components/comments.js';
import Subtasks from '../components/subtasks';
import Items from '../components/taskMaterials';

const tableStyle = {
	border: 'none',
	paddingLeft: '0',
};

export default class TaskTop extends Component {
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

										<div className="col-lg-12 m-b-20">
											<strong>Tagy: </strong>
											<span className="label label-info m-r-5">Mimo pracovných hodín</span>
											<span className="label label-success m-r-5">Telefonovať</span>
										</div>

										<div className="col-lg-12">
											<div className="table-responsive">
												<table className="table table-borderless">
													<tbody>
														<tr style={{ Width: '33%' }}>
															<td style={tableStyle}>
																<label>Status:</label>
															</td>
															<td style={tableStyle}>	<span className="label label-pink">Opakovanie</span></td>
															<td style={tableStyle}>
																<label>Zadal:</label>
															</td>
															<td style={tableStyle}>Branislav Susta</td>
															<td style={tableStyle}>
																<label>Pripomienka:</label>
															</td>
															<td style={tableStyle}>14:00 25.11.2018</td>
														</tr>
														<tr>
															<td style={tableStyle}>
																<label>Projekt:</label>
															</td>
															<td style={tableStyle}>hotline@lansystems.sk</td>
															<td style={tableStyle}><label>Firma:</label></td>
															<td style={tableStyle}>LAN Systems s.r.o.</td>
															<td style={tableStyle}>
																<label>Deadline:</label>
															</td>
															<td style={tableStyle}>15:00 26.11.2018</td>
														</tr>
														<tr>
															<td style={tableStyle}>
																<label>Typ prace:</label>
															</td>
															<td style={tableStyle}>Servis IT</td>
															<td style={tableStyle}><label>Riesi:</label></td>
															<td style={tableStyle}>Patrik Patoprsty</td>
															<td style={tableStyle}>
																<label>Opakovanie:</label>
															</td>
															<td style={tableStyle}>None</td>
														</tr>
														<tr>
															<td style={tableStyle}>
																<label>Mimo pracovných hodín:</label>
															</td>
															<td style={tableStyle}>Nie</td>
															<td style={tableStyle}><label>Pausal/projekt:</label></td>
															<td style={tableStyle}>Pausal</td>

														</tr>
													</tbody>
												</table>
											</div>
										</div>
{/*
										<div className="col-lg-4">
											<div className="m-t-20">
												<p>
													<label>Status:</label>
													<span className="label label-pink">Opakovanie</span>
												</p>

												<p className="m-t-10">
													<label>Projekt:</label>
													hotline@lansystems.sk
												</p>
												<p className="m-t-10">
													<strong>Typ práce: </strong>
													none{' '}
												</p>
											</div>
											<p className="m-t-10">
												<strong>Mimo pracovných hodín:</strong>
												nie{' '}
											</p>
										</div>
										<div className="col-lg-4">
											<div className="m-t-20">
												<p>
													<strong>Zadal: </strong>
													hotline@lansystems.sk
												</p>
												<p className="m-t-10">
													<strong>Firma: </strong>
													LAN Systems s.r.o.{' '}
												</p>
												<p className="m-t-10">
													<strong>Riesi: </strong>
													hotline@lansystems.sk
												</p>
												<p className="m-t-10">
													<strong>Pausal/Projekt: </strong>
													nie{' '}
												</p>
											</div>
										</div>

										<div className="col-lg-4">
											<div className="m-t-20">
												<p>
													<strong>Pripomienka: </strong>
													none
												</p>
												<p className="m-t-10">
													<strong>Deadline: </strong>
													hotline@lansystems.sk{' '}
												</p>
												<p className="m-t-10">
													<strong>Opakovanie: </strong>
													none{' '}
												</p>
											</div>
										</div>
										 */}
									</div>

									<label className="">Popis</label>
									<textarea className="form-control" rows="2" />
									<p />
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
