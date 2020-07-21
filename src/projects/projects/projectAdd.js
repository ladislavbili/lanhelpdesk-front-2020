import React, { Component } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import {rebase} from '../../index';

export default class ProjectAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      description:'',
      saving:false,
      opened:false
    }
  }

  toggle(){
    this.setState({opened:!this.state.opened})
  }
  render(){
    return (
      <div>
        <Button
          block
          onClick={this.toggle.bind(this)}
          className="btn-link t-a-l">
          <i className="fa fa-plus sidebar-plus"  /> Project
        </Button>

        <Modal isOpen={this.state.opened}>
            <ModalHeader>Add project</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label>Project name</Label>
                <Input type="text" placeholder="Enter project name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
              </FormGroup>
              <FormGroup>
                <Label>Project description</Label>
                <Input type="textarea" placeholder="Enter project description" value={this.state.description} onChange={(e)=>this.setState({description:e.target.value})} />
              </FormGroup>

              </ModalBody>
              <ModalFooter>
              <Button className="mr-auto btn-link" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
                Close
              </Button>
              <Button className="btn" disabled={this.state.saving||this.state.title===""} onClick={()=>{
                  this.setState({saving:true});
                  rebase.addToCollection('/proj-projects', {title:this.state.title,description:this.state.description})
                    .then(()=>{this.setState({title:'',description:'',saving:false})});
                }}>{this.state.saving?'Adding...':'Add project'}</Button>
            </ModalFooter>
          </Modal>
          </div>
    );
  }
}
