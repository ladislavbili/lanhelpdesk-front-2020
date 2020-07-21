import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import Select from 'react-select';
import {selectStyle} from "configs/components/select";
import {rebase} from '../../../index';

let typeOptions = [{label:'Paušál hodín',value:'work'},{label:'Paušál výjazdov',value:'trip'}]

export default class WorkTypeAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      saving:false,
      type:typeOptions[0],
    }
  }

  render(){
    return (
      <div className="p-20 scrollable fit-with-header-and-commandbar">
          <FormGroup>
            <Label for="name">WorkType name</Label>
            <Input type="text" name="name" id="name" placeholder="Enter work type name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="actionIfSelected">Type of work</Label>
            <Select
              id="actionIfSelected"
              name="Action"
              styles={selectStyle}
              options={typeOptions}
              value={this.state.type}
              onChange={e =>{ this.setState({ type: e }); }}
                />
          </FormGroup>
          <Button className="btn" disabled={this.state.saving} onClick={()=>{
              this.setState({saving:true});
              rebase.addToCollection('/help-work_types', {title:this.state.title,type:this.state.type.value})
                .then(()=>{this.setState({title:'',type:typeOptions[0],saving:false})});
            }}>{this.state.saving?'Adding...':'Add work type'}</Button>
      </div>
    );
  }
}
