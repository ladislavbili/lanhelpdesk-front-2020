import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';

import Select from 'react-select';
import {selectStyle} from "configs/components/select";

import {  GET_TASK_TYPES } from '../index';

let typeOptions = [{label:'Z paušálu',value:'prepaid'},{label:'Samostatný projekt',value:'project'}]

export default class TaskTypeAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title: '',
      order: 0,
      saving: false
    }
  }

  render(){
    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">

        <FormGroup>
          <Label for="name">Task type name</Label>
          <Input type="text" name="name" id="name" placeholder="Enter task type name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
        </FormGroup>

        <FormGroup>
          <Label for="order">Order</Label>
          <Input type="number" name="order" id="order" placeholder="Lower means first" value={this.state.order} onChange={(e)=>this.setState({order:e.target.value})} />
        </FormGroup>

        <Button className="btn" disabled={this.state.saving} onClick={this.addTaskType.bind(this)}>{this.state.saving?'Adding...':'Add task type'}</Button>
    </div>
    );
  }

  addTaskType(){
    const { client } = this.props;

    this.setState({saving: true});
    let order = this.state.order!==''?parseInt(this.state.order):0;
    if(isNaN(order)){
      order=0;
    }
    this.props.addTaskType({ variables: {
      title: this.state.title,
      order: parseInt(this.state.order),
    } }).then( ( response ) => {
      const allTaskTypes = client.readQuery({query: GET_TASK_TYPES}).taskTypes;
      const newTaskType = {...response.data.addTaskType, __typename: "TaskType"};
      client.writeQuery({ query: GET_TASK_TYPES, data: {taskTypes: [...allTaskTypes, newTaskType ] } });
      this.props.history.push('/helpdesk/settings/taskTypes/' + newTaskType.id)
    }).catch( (err) => {
      console.log(err.message);
    });
    this.setState({saving: false});
  }
}
