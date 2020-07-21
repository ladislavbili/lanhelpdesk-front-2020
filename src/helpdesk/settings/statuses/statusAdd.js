import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import Select from 'react-select';
import {rebase} from '../../../index';
import { SketchPicker } from "react-color";
import {selectStyle} from "configs/components/select";
import { actions } from 'configs/constants/statuses';

export default class StatusAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      color: "FFF",
      icon: '',
      order:0,
      saving:false,
      action:actions[0]
    }
  }

  render(){
    return (
      <div className="scroll-visible p-20 fit-with-header-and-commandbar">
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
          <FormGroup>
            <Label for="actionIfSelected">Action if selected</Label>
            <Select
              id="actionIfSelected"
              name="Action"
              styles={selectStyle}
              options={actions}
              value={this.state.action}
              onChange={e =>{ this.setState({ action: e }); }}
                />
          </FormGroup>
          <SketchPicker
            id="color"
            color={this.state.color}
            onChangeComplete={value => this.setState({ color: value.hex })}
          />
        <Button className="btn m-t-5" disabled={this.state.saving} onClick={()=>{
              this.setState({saving:true});
              let order = this.state.order!==''?parseInt(this.state.order):0;
              if(isNaN(order)){
                order=0;
              }
              rebase.addToCollection('/help-statuses', {title:this.state.title, color:this.state.color, icon: this.state.icon, order,action:this.state.action.value})
                .then(()=>{this.setState({title:'',saving:false})});
            }}>{this.state.saving?'Adding...':'Add status'}</Button>
      </div>
    );
  }
}
