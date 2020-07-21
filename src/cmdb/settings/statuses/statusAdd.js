import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {rebase} from '../../../index';

export default class StatusAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
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
        <Button className="btn-link" onClick={()=>{
            this.setState({opened:true});
          }}>
          <i className="fa fa-plus" /> Status
        </Button>

        <Modal isOpen={this.state.opened} >
            <ModalHeader>
              Add status
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for="name">Status name</Label>
                <Input type="text" name="name" id="name" placeholder="Enter status name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button className="mr-auto btn-link" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
                Close
              </Button>

              <Button className="btn" disabled={this.state.saving} onClick={()=>{
                  this.setState({saving:true});
                  rebase.addToCollection('/cmdb-statuses', {title:this.state.title})
                  .then(()=>{this.setState({title:'',saving:false})});
                }}>
                {this.state.saving?'Adding...':'Add status'}
              </Button>
            </ModalFooter>
          </Modal>
          </div>
    );
  }
}
