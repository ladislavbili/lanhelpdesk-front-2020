import React, { Component } from 'react';

const tableStyle = {
	border: 'none',
};

const tableStyleCenter = {
	textAlign: 'center',
};

const tableStyleCenterNoBorder = {
	textAlign: 'center',
	border: 'none',
};

export default class Items extends Component {
	render() {
		return (
			<div className="">
				<div className="row">
					<div className="col-md-12">
						<div className="table-responsive">
							<table className="table table-centered table-borderless table-hover mb-0">
								<thead className="thead-light">
									<tr>
										<th style={tableStyle} width="5%">#</th>
										<th style={tableStyle} width="70%">Material</th>
										<th style={tableStyle}>Pocet</th>
										<th style={tableStyle}>Nakup/ks</th>
										<th style={tableStyle}>Marza</th>
										<th style={tableStyle}>Predaj/ks</th>
										<th style={tableStyleCenterNoBorder}>Action</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<th style={tableStyle} width="5%">1</th>
										<td style={tableStyle}>LCD</td>
										<td style={tableStyle}>1</td>
										<td style={tableStyle}>300</td>
										<td style={tableStyle}>10%</td>
										<td style={tableStyle}>330</td>
										<td style={tableStyleCenter}>
											<button className="btn btn-link waves-effect">
												<i className="fa fa-times" />
											</button>
										</td>
									</tr>
									<tr>
										<th style={tableStyle} width="5%"></th>
										<td style={tableStyle}>
											<input
												type="text"
												className="form-control mb-2"
												id="inlineFormInput"
												placeholder="Name"
												style={{ height: 30 }}
											/>
										</td>
										<td style={tableStyle}>
											<input
												type="text"
												className="form-control mb-2"
												id="inlineFormInput"
												placeholder=""
												style={{ height: 30 }}
											/>
										</td>
										<td style={tableStyle}>
											<input
												type="text"
												className="form-control mb-2"
												id="inlineFormInput"
												placeholder=""
												style={{ height: 30 }}
											/>
										</td>
										<td style={tableStyle}>
											<input
												type="text"
												className="form-control mb-2"
												id="inlineFormInput"
												placeholder="10"
												style={{ height: 30 }}
											/>
										</td>
										<td style={tableStyle}>
											<input
												type="text"
												className="form-control mb-2"
												id="inlineFormInput"
												placeholder=""
												style={{ height: 30 }}
											/>
										</td>
										<td style={tableStyleCenterNoBorder}>
											<button className="btn btn-link waves-effect">
												<i className="fa fa-plus" />
											</button>
										</td>
									</tr>
								</tbody>
							</table>
						</div>
						<div className="row justify-content-end">
							<div className="col-md-3">
								<p className="text-right m-b-0">
									<b>Sub-total:</b> 2930.00
								</p>

							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
