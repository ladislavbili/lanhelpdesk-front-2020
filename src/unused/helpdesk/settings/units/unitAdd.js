import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import {rebase} from '../../../index';

export default class UnitAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      def:false,
      saving:false
    }
  }

  render(){
    return (
      <div className="full-height card-box scrollable fit-with-header-and-commandbar">
        <div className="m-t-20">

        <FormGroup check className="m-b-5">
          <Input type="checkbox" checked={this.state.def} onChange={(e)=>this.setState({def:!this.state.def})}/>
          <Label check>
            Default
          </Label>
        </FormGroup>

        <FormGroup>
          <Label for="name">Unit name</Label>
          <Input type="text" name="name" id="name" placeholder="Enter unit name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
        </FormGroup>

        <Button className="btn" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.addToCollection('/help-units', {title:this.state.title})
              .then((response)=>{
                if(this.state.def){
                  rebase.updateDoc('/metadata/0',{defaultUnit:response.id})
                }
                this.setState({title:'',saving:false})
              });
          }}>{this.state.saving?'Adding...':'Add unit'}</Button>
        </div>
    </div>
    );
  }
}
