import React, { Component } from 'react';

export default class PassEmpty extends Component {

	render() {
		return (
			<div className="flex">
				{false &&
					<div className="commandbar">
						<div className="d-flex flex-row align-items-center">
						</div>
					</div>
				}
				<div className="card-box row fit-with-header-and-commandbar">
						<div className=" center-ver center-hor">
							Vyberte heslo zo zoznamu vlavo.
						</div>
				</div>
			</div>
		);
	}
}
