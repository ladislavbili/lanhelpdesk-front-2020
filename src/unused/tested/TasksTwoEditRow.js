import React, { Component } from 'react';
import TasksTwoEdit from '../task/TasksTwoEdit';

export default class TasksTwoEditRow extends Component {
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
					<div className="commandbar" style={{ maxWidth: 1000, margin: 'auto' }}>
						<div className="row">
							<div className="col-lg-12">
								<TasksTwoEdit />
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
