import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import {rebase} from '../../../index';
import { SketchPicker } from "react-color";

export default class StatusAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      color: "FFF",
      icon: '',
      order:0,
      saving:false
    }
  }

  render(){
    return (
      <div className="full-height card-box scrollable fit-with-header-and-commandbar">
        <div className="m-t-20">
          <FormGroup>
            <Label for="name">Status name</Label>
            <Input type="text" name="name" id="name" placeholder="Enter status name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="icon">Icon</Label>
            <Input type="text" name="icon" id="icon" placeholder="fas fa-arrow-left" value={this.state.icon} onChange={(e)=>this.setState({icon:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="order">Order</Label>
            <Input type="number" name="order" id="order" placeholder="Lower means first" value={this.state.order} onChange={(e)=>this.setState({order:e.target.value})} />
          </FormGroup>
          <SketchPicker
            id="color"
            color={this.state.color}
            onChangeComplete={value => this.setState({ color: value.hex })}
          />
          <Button className="btn" disabled={this.state.saving} onClick={()=>{
              this.setState({saving:true});
              let order = this.state.order!==''?parseInt(this.state.order):0;
              if(isNaN(order)){
                order=0;
              }
              rebase.addToCollection('/help-statuses', {title:this.state.title, color:this.state.color, icon: this.state.icon, order})
                .then(()=>{this.setState({title:'',saving:false})});
            }}>{this.state.saving?'Adding...':'Add status'}</Button>
        </div>
      </div>
    );
  }
}
