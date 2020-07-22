import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import Loading from 'components/loading';
import Select from 'react-select';
import {selectStyle} from "configs/components/select";

import {  GET_TASK_TYPES } from '../index';

let typeOptions = [{label:'Z paušálu',value:'prepaid'},{label:'Samostatný projekt',value:'project'}]

export default class TaskTypeEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      id: null,
      title:'',
      order: 0,

      loading:true,
      saving:false
    }
    this.setData.bind(this);
    this.storageLoaded.bind(this);
  }

  storageLoaded(props){
    return !props.taskTypeData.loading
  }

  componentWillReceiveProps(props){
    if ((this.storageLoaded(props) && !this.storageLoaded(this.props))
        ||
        (this.props.match.params.id !== props.match.params.id)){
      this.setData(props);
    }
  }

  componentWillMount(){
    if(this.storageLoaded(this.props)){
      this.setData(this.props);
    }
  }

  setData(props){
    if( props.taskTypeData.data ){
      const taskType = props.taskTypeData.data.taskType;
      this.setState({
        id: taskType.id,
        title: taskType.title,
        order: taskType.order,
      })
    }  }

  render(){
    const { loading, data } = this.props.taskTypeData;
    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
        {
          loading &&
          <Loading />
        }
        <FormGroup>
          <Label for="name">Task type name</Label>
          <Input type="text" name="name" id="name" placeholder="Enter task type name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
        </FormGroup>

        <FormGroup>
          <Label for="order">Order</Label>
          <Input type="number" name="order" id="order" placeholder="Lower means first" value={this.state.order} onChange={(e)=>this.setState({order:e.target.value})} />
        </FormGroup>

          <div className="row">
            <Button className="btn" disabled={this.state.saving} onClick={this.updateTaskType.bind(this)}>{this.state.saving?'Saving task type...':'Save task type'}</Button>
            <Button className="btn-red m-l-5"  disabled={this.state.saving} onClick={this.deleteTaskType.bind(this)}>Delete</Button>
          </div>
      </div>
    );
  }

  updateTaskType(){
    this.setState({saving:true});
    let order = this.state.order !== '' ? parseInt(this.state.order) : 0;
    if(isNaN(order)){
      order = 0;
    }
    this.props.updateTaskType({ variables: {
      id: this.state.id,
      title: this.state.title,
      order: parseInt(this.state.order),
    } }).then( ( response ) => {
    }).catch( (err) => {
      console.log(err.message);
    });
    this.setState({saving:false});
  }

  deleteTaskType(){
    if(window.confirm("Are you sure?")){
      const { client } = this.props;

      this.props.deleteTaskType({ variables: {
        id: this.state.id,
      } }).then( ( response ) => {
        const allTaskTypes = client.readQuery({query: GET_TASK_TYPES}).taskTypes;
        client.writeQuery({ query: GET_TASK_TYPES, data: {taskTypes: allTaskTypes.filter( taskType => taskType.id !== this.state.id, )} });
        this.props.history.goBack();
      }).catch( (err) => {
        console.log(err.message);
      });
    }
  }
}
