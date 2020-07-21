import React, { Component } from 'react';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
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

        <Button onClick={this.toggle.bind(this)} className="btn-link t-a-l">
          <i className="fa fa-plus sidebar-plus"  /> Folder
        </Button>

        <Modal isOpen={this.state.opened}>
            <ModalHeader>
              Add folder
            </ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label>Folder name</Label>
                <Input type="text" placeholder="Enter folder name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
              </FormGroup>
              <FormGroup>
                <Label>Folder description</Label>
                <Input type="textarea" placeholder="Enter folder description" value={this.state.description} onChange={(e)=>this.setState({description:e.target.value})} />
              </FormGroup>

              </ModalBody>
              <ModalFooter>
              <Button className="mr-auto btn-link" disabled={this.state.saving} onClick={this.toggle.bind(this)}>
                Close
              </Button>


              <Button
                className="btn"
                disabled={this.state.saving||this.state.title===""}
                onClick={()=>{
                  this.setState({saving:true});
                  rebase.addToCollection('/pass-folders', {title: this.state.title, description: this.state.description})
                    .then(()=> {
                      this.setState({title:'',description:'',saving:false});
                      this.toggle();
                    });
                }}>{this.state.saving?'Adding...':'Add folder'}</Button>
            </ModalFooter>
          </Modal>
          </div>
    );
  }
}
