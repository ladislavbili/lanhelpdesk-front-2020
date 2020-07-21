import React, { Component } from 'react';
//import TaskEdit from './taskEdit';

export default class TaskAddContainer extends Component{
  render(){
  	  return (
        <div className="flex">
          <TaskEdit {...this.props} listView={!this.props.columns} />
        </div>
      );
  }
}
