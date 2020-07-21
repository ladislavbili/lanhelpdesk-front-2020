import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import {rebase} from '../../../index';
import Select from 'react-select';
import {selectStyle} from "configs/components/select";
let typeOptions = [{label:'Z paušálu',value:'prepaid'},{label:'Samostatný projekt',value:'project'}]

export default class TaskTypeAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      type:typeOptions[0],
      saving:false
    }
  }

  render(){
    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">

        <FormGroup>
          <Label for="name">Task type name</Label>
          <Input type="text" name="name" id="name" placeholder="Enter task type name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
        </FormGroup>
        {false && <FormGroup>
          <Label for="actionIfSelected">Type of task</Label>
          <Select
            id="actionIfSelected"
            name="Action"
            styles={selectStyle}
            options={typeOptions}
            value={this.state.type}
            onChange={e =>{ this.setState({ type: e }); }}
              />
          </FormGroup>}
        <Button className="btn" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.addToCollection('/help-task_types', {title:this.state.title,type:this.state.type.value})
              .then((response)=>{
                this.setState({title:'',type:typeOptions[0],saving:false})
              });
          }}>{this.state.saving?'Adding...':'Add task type'}</Button>
    </div>
    );
  }
}
