import React, { Component } from 'react';
import { Button, Modal, Badge, InputGroup, Glyphicon, FormControl, DropdownButton, MenuItem } from 'react-bootstrap';
import TasksBoard from './TasksBoard';
import TasksRow from './TasksRow';
import Filter from './Filter';
import TasksTwo from './TasksTwo';

const sortTypes = [{ id: 0, name: 'Name' }, { id: 1, name: 'Created' }, { id: 2, name: 'Deadline' }];

export default class SettingsList extends Component {
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
				<div className="content">
					<div className="commandbar">
						<div className="row">
							<div className="col-sm-6">
								<h2 className="page-title">Settings</h2>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
