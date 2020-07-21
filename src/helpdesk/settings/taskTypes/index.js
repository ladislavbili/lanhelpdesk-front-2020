import React, { Component } from 'react';

import {Button } from 'reactstrap';
import TaskTypeAdd from './taskTypeAdd';
import TaskTypeEdit from './taskTypeEdit';

import { connect } from "react-redux";
import {storageHelpTaskTypesStart} from '../../../redux/actions';
import {sameStringForms} from '../../../helperFunctions';

class TaskTypesList extends Component{
  constructor(props){
    super(props);
    this.state={
      taskTypes:[],
      taskTypeFilter:''
    }
  }

  componentWillReceiveProps(props){
    if(!sameStringForms(props.taskTypes,this.props.taskTypes)){
      this.setState({taskTypes:props.taskTypes})
    }
  }

  componentWillMount(){
    if(!this.props.taskTypesActive){
      this.props.storageHelpTaskTypesStart();
    }
    this.setState({taskTypes:this.props.taskTypes});
  }

  render(){
    return (
      <div className="content">
        <div className="row m-0 p-0 taskList-container">
          <div className="col-lg-4">
            <div className="commandbar">
              <div className="search-row">
                <div className="search">
                  <button className="search-btn" type="button">
                    <i className="fa fa-search" />
                  </button>
                  <input
                    type="text"
                    className="form-control search-text"
                    value={this.state.taskTypeFilter}
                    onChange={(e)=>this.setState({taskTypeFilter:e.target.value})}
                    placeholder="Search"
                    />
                </div>
              </div>
              <Button
                className="btn-link center-hor"
                onClick={()=>this.props.history.push('/helpdesk/settings/taskTypes/add')}>
                <i className="fa fa-plus p-l-5 p-r-5"/> Work type
              </Button>
            </div>
            <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <h2 className=" p-l-10 p-b-10 ">
  							Work types
  						</h2>
              <table className="table table-hover">
                <tbody>
                  {this.state.taskTypes.filter((item)=>item.title.toLowerCase().includes(this.state.taskTypeFilter.toLowerCase())).map((taskType)=>
                    <tr key={taskType.id}
                      className={"clickable" + (this.props.match.params.id === taskType.id ? " active":"")}
                      onClick={()=>this.props.history.push('/helpdesk/settings/taskTypes/'+taskType.id)}>
                      <td>
                        {taskType.title}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="commandbar"></div>
            {
              this.props.match.params.id && this.props.match.params.id==='add' && <TaskTypeAdd />
            }
            {
              this.props.match.params.id && this.props.match.params.id!=='add' && this.state.taskTypes.some((item)=>item.id===this.props.match.params.id) && <TaskTypeEdit match={this.props.match} history={this.props.history} />
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageHelpTaskTypes}) => {
  const { taskTypesActive, taskTypes } = storageHelpTaskTypes;
  return { taskTypesActive, taskTypes };
};

export default connect(mapStateToProps, { storageHelpTaskTypesStart })(TaskTypesList);
