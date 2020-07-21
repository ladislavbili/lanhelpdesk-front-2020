import React, { Component } from 'react';
import { ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import {rebase} from '../../index';
import Permits from '../../components/permissions';

export default class FolderEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title: this.props.folder.title,
      description: this.props.folder.description,
      saving:false,
      opened:false
    }
    this.remove.bind(this);
  }

  remove(){

  }

  render(){
    return (
      <div>
            <ModalBody>
              <ModalHeader>
                Edit folder
              </ModalHeader>
              <FormGroup>
                <Label>Folder name</Label>
                <Input type="text" className="form-control" placeholder="Enter folder name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
              </FormGroup>
              <FormGroup>
                <Label>Folder description</Label>
                <Input type="textarea" className="form-control" placeholder="Enter folder description" value={this.state.description} onChange={(e)=>this.setState({description:e.target.value})} />
              </FormGroup>

              <Permits id={this.props.folder.id} view={this.props.folder.view} edit={this.props.folder.edit} permissions={this.props.folder.permissions} db="pass-folders" />


              </ModalBody>
              <ModalFooter>
              <Button className="mr-auto btn-link" disabled={this.state.saving} onClick={() => this.props.close()}>
                Close
              </Button>

              <Button
                className="btn"
                disabled={this.state.saving||this.state.title===""}
                onClick={()=> {
                  this.setState({saving:true});
                  rebase.updateDoc(`/pass-folders/${this.props.folder.id}`, {title: this.state.title, description: this.state.description})
                    .then(() => {
                      this.setState({title:'',description:'',saving:false});
                      this.props.close();
                    });
                }}>
                {this.state.saving?'Saving...':'Save changes'}
              </Button>
            </ModalFooter>
          </div>
    );
  }
}
