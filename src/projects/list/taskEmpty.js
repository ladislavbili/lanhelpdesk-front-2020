import React, { Component } from 'react';

export default class TaskEmpty extends Component {

	render() {
		return (
			<div className="flex card-box">
				<div className="fit-with-header-and-commandbar row">
						<div className=" center-ver center-hor">
							Vyberte task zo zoznamu vlavo.
						</div>
				</div>
			</div>
		);
	}
}
