import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import {rebase} from '../../../index';

export default class ProjectAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      projectName:'',
      saving:false
    }
  }

  render(){
    return (
      <div className="full-height card-box scrollable fit-with-header-and-commandbar">
        <div className="m-t-20">
          <FormGroup>
            <Label for="name">Project name</Label>
            <Input type="text" name="name" id="name" placeholder="Enter project name" value={this.state.projectName} onChange={(e)=>this.setState({projectName:e.target.value})} />
          </FormGroup>
          <Button className="btn" disabled={this.state.saving} onClick={()=>{
              this.setState({saving:true});
              rebase.addToCollection('/help-projects', {title:this.state.projectName})
                .then(()=>{this.setState({projectName:'',saving:false})});
            }}>{this.state.saving?'Adding...':'Add project'}</Button>
        </div>
      </div>
    );
  }
}
