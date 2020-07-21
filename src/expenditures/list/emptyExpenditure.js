import React, { Component } from 'react';

export default class EmptyExpenditure extends Component {

	render() {
		return (
			<div className="flex">
				<div className="commandbar">
					<div className="d-flex flex-row align-items-center">
					</div>
				</div>
				<div className="card-box row fit-with-header">
						<div className=" center-ver center-hor">
							Vyberte náklad zo zoznamu vlavo.
						</div>
				</div>
			</div>
		);
	}
}
