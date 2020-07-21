import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import { SketchPicker } from "react-color";
import {rebase} from '../../../index';

export default class TagAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      color: "FFF",
      saving:false
    }
  }

  render(){
    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
          <FormGroup>
            <Label for="name">Tag name</Label>
            <Input type="text" name="name" id="name" placeholder="Enter tag name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
          </FormGroup>
          <SketchPicker
            id="color"
            color={this.state.color}
            onChangeComplete={value => this.setState({ color: value.hex })}
          />
        <Button className="btn m-t-5"  disabled={this.state.saving} onClick={()=>{
              this.setState({saving:true});
              rebase.addToCollection('/help-tags', {title:this.state.title,color:this.state.color})
                .then(()=>{this.setState({title:'',saving:false})});
            }}>{this.state.saving?'Adding...':'Add tag'}</Button>
    </div>
    );
  }
}
