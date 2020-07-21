import React, { Component } from 'react';

import {Button } from 'reactstrap';
import {rebase} from '../../../index';
import TaskTypeAdd from './taskTypeAdd';
import TaskTypeEdit from './taskTypeEdit';

export default class TaskTypesList extends Component{
  constructor(props){
    super(props);
    this.state={
      taskTypes:[]
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/help-task_types', {
      context: this,
      withIds: true,
      then:content=>{this.setState({taskTypes:content, taskTypeFilter:''})},
    });
  }

  componentWillUnmount(){
    rebase.removeBinding(this.ref);
  }

  render(){
    return (
      <div className="content-page">
				<div className="content" style={{ paddingTop: 0 }}>
					<div className="commandbar">
						<div className="row align-items-center">
              <div className="p-2">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control search"
                    value={this.state.taskTypeFilter}
                    onChange={(e)=>this.setState({taskTypeFilter:e.target.value})}
                    placeholder="Search"
                  />
                  <div className="input-group-append">
                    <button className="search-btn" type="button">
                      <i className="fa fa-search" />
                    </button>
                  </div>
                </div>
              </div>

                <Button
          				className="btn-link t-a-l"
          				onClick={()=>this.props.history.push('/helpdesk/settings/taskTypes/add')}>
          			 <i className="fa fa-plus m-r-5 m-l-5 "/> Task type
          			</Button>

            </div>
          </div>

          <div className="row m-0 p-0 taskList-container">
            <div className="col-lg-4 p-0 scrollable fit-with-header-and-commandbar">
              <table className="table table-hover p-5">
                <thead>
                  <tr className="clickable">
                    <th>Task type name</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.taskTypes.filter((item)=>item.title.toLowerCase().includes(this.state.taskTypeFilter.toLowerCase())).map((taskType)=>
                    <tr key={taskType.id}
                      className={"clickable" + (this.props.match.params.id === taskType.id ? " sidebar-item-active":"")}
                      onClick={()=>this.props.history.push('/helpdesk/settings/taskTypes/'+taskType.id)}>
                      <td
                        className={(this.props.match.params.id === taskType.id ? "text-highlight":"")}>
                        {taskType.title}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="col-lg-8 p-0">
              {
                this.props.match.params.id && this.props.match.params.id==='add' && <TaskTypeAdd />
              }
              {
                this.props.match.params.id && this.props.match.params.id!=='add' && this.state.taskTypes.some((item)=>item.id===this.props.match.params.id) && <TaskTypeEdit match={this.props.match} history={this.props.history} />
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
