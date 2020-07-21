import React, { Component } from 'react';
import TasksBoard from './TasksBoard';
import TasksRow from './TasksRow';
import TasksTwo from './TasksTwo';
import {Button} from 'reactstrap';
import { connect } from "react-redux";
import {setSearch, setFilter} from '../../redux/actions';


class TaskListContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			openAddStatusModal: false,
			openAddTaskModal: false,
			isColumn: false,
			search: this.props.search,
			taskListType: 'option3',
			filterView: false,
			sortType: 0,
		};
	}
	render() {
		return (
			<div className="content-page">

				<div className="content" >

					<div className="commandbar">

						<div className="d-flex">
							{this.state.filterView && (
								<div >
									<div className="button-list" style={{ marginRight: 10 }}>
										<button type="button" className="btn waves-effect">
											Apply
									</button>
										<button type="button" className="btn waves-effect">
											Save
									</button>
										<button type="button" className="btn waves-effect">
											Delete
									</button>
									</div>
								</div>
							)}

							<div className="center-hor input-group search-case">
									<input
										type="text"
										className="search"
										value={this.state.search}
										onChange={(e)=>this.setState({search:e.target.value})}
										placeholder="Search task name"
										style={{ width: 200 }}
									/>
										<button className="search-btn" type="button" onClick={()=>this.props.setSearch(this.state.search)}>
											<i className="fa fa-search" />
										</button>
							</div>
							<div className="center-hor">
								<Button
									className="btn-link"
									onClick={()=>{
										let body={
											requester:null,
											company:null,
											assigned:null,
											workType:null,
											status:null,
							        statusDateFrom:'',
							        statusDateTo:'',
							        updatedAt:(new Date()).getTime()
							      }
							      this.props.setFilter(body);
									}}
									>
									Global
								</Button>
							</div>
							<div className="ml-auto">
								{' '}
								<button type="button" className="btn-link waves-effect">
									<i
										className="fas fa-copy icon-S"
									/> COPY
								</button>
							</div>
							<div className="center-hor">
								{' '}
								<button type="button" className="btn-link waves-effect">
									<i
										className="fas fa-print icon-S"
									/> SERVISNY LIST
								</button>
							</div>
							<div className="center-hor">
								{' '}
								<button type="button" className="btn-link waves-effect">
									<i
										className="fas fa-print icon-S"
									/> CENOVA PONUKA
								</button>
							</div>
							<div className="center-hor">
								<div className="btn-group btn-group-toggle" data-toggle="buttons">
									<label
										className={
											'btn btn-link btn-outline-blue waves-effect' +
											(this.state.taskListType === 'option1' ? ' active' : '')
										}
									>
										<input
											type="radio"
											name="options"
											id="option1"
											autoComplete="off"
											checked={this.state.taskListType === 'option1'}
											onChange={() => this.setState({ taskListType: 'option1' })}
										/>
										<i className="fa fa-list" />
									</label>
									<label
										className={
											'btn btn-link btn-outline-blue waves-effect' +
											(this.state.taskListType === 'option2' ? ' active' : '')
										}
									>
										<input
											type="radio"
											name="options"
											id="option2"
											autoComplete="off"
											onChange={() => this.setState({ taskListType: 'option2' })}
											checked={this.state.taskListType === 'option2'}
										/>
										<i className="fa fa-map" />
									</label>

									<label
										className={
											'btn btn-link btn-outline-blue waves-effect' +
											(this.state.taskListType === 'option3' ? ' active' : '')
										}
									>
										<input
											type="radio"
											name="options"
											id="option3"
											autoComplete="off"
											onChange={() => this.setState({ taskListType: 'option3' })}
											checked={this.state.taskListType === 'option3'}
										/>
										<i className="fa fa-columns" />
									</label>
								</div>
							</div>
						</div>
					</div>

					<div className="row">
						{this.state.taskListType === 'option2' && (
							<div className={'' + (this.state.filterView ? 'col-xl-9' : 'col-xl-12')}>
								<TasksRow history={this.props.history} match={this.props.match}/>{' '}
							</div>
						)}

						{this.state.taskListType === 'option1' && (
							<div className={'' + (this.state.filterView ? 'col-xl-9' : 'col-xl-12')}>
								<TasksBoard history={this.props.history} match={this.props.match}/>
							</div>
						)}

						{this.state.taskListType === 'option3' && (
							<div className={'' + (this.state.filterView ? 'col-xl-9' : 'col-xl-12')}>
								<TasksTwo history={this.props.history} match={this.props.match}/>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ filterReducer }) => {
	return { search:filterReducer.search };
};

export default connect(mapStateToProps, { setSearch, setFilter })(TaskListContainer);
