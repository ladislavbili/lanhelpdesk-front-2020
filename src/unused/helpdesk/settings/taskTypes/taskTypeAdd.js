import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import {rebase} from '../../../index';

export default class TaskTypeAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      saving:false
    }
  }

  render(){
    return (
      <div className="full-height card-box scrollable fit-with-header-and-commandbar">
        <div className="m-t-20">

        <FormGroup>
          <Label for="name">Task type name</Label>
          <Input type="text" name="name" id="name" placeholder="Enter task type name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
        </FormGroup>

        <Button className="btn" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.addToCollection('/help-task_types', {title:this.state.title})
              .then((response)=>{
                this.setState({title:'',saving:false})
              });
          }}>{this.state.saving?'Adding...':'Add task type'}</Button>
        </div>
    </div>
    );
  }
}
