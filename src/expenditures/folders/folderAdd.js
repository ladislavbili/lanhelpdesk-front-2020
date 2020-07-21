import React, { Component } from 'react';
import { ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import {rebase} from '../../index';

export default class ProjectAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      note:'',
      saving:false,
      opened:false
    }
  }

  render(){
    return (
      <div>
        <ModalHeader>
          Add folder
        </ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label>Title</Label>
            <Input type="text" className="form-control" placeholder="Enter folder name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label>Note</Label>
            <Input type="textarea" className="form-control" placeholder="Enter folder note" value={this.state.note} onChange={(e)=>this.setState({note:e.target.value})} />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button className="mr-auto btn-link" disabled={this.state.saving} onClick={() => this.props.close()}>
            Close
          </Button>
          <Button className="btn" disabled={this.state.saving||this.state.title===""} onClick={()=>{
              this.setState({saving:true});
              rebase.addToCollection('/expenditures-folders', {title:this.state.title, note:this.state.note})
                .then(()=>{this.setState({title:'',note:'',saving:false}); this.props.close();});
            }}>{this.state.saving?'Adding...':'Add folder'}</Button>
        </ModalFooter>
      </div>
    );
  }
}
