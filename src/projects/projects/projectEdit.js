import React, { Component } from 'react';
import { ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import {rebase} from '../../index';
import Permits from "../../components/permissions";

export default class ProjectEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title: this.props.project.title,
      description: this.props.project.description,

      view: this.props.project.view,
      edit: this.props.project.edit,
      permissions: this.props.project.permissions,

      saving:false,
      opened:false
    }
    this.remove.bind(this);
  }

  remove(){
    rebase.get(`proj-tasks`, {
    context: this,
    query: (ref) => ref.where('project', '==', this.props.project.id),
    withIds: true,
    }).then(data => {
      data.forEach(datum => {
        rebase.removeDoc(`/proj-tasks/${datum.id}`);
      }
      );
    }).catch(err => {
      //handle error
    })
    rebase.removeDoc(`/proj-projects/${this.props.project.id}`).then(() => {
      this.props.close();
      this.props.history.push("/projects/all");
    }
    );
  }

  render(){
    return (
      <div>
            <ModalBody>
              <ModalHeader>
                Edit project
              </ModalHeader>
              <FormGroup>
                <Label>Project name</Label>
                <Input type="text" placeholder="Enter project name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
              </FormGroup>
              <FormGroup>
                <Label>Project description</Label>
                <Input type="textarea" placeholder="Enter project description" value={this.state.description} onChange={(e)=>this.setState({description:e.target.value})} />
              </FormGroup>

              <Permits id={this.props.project.id} view={this.props.project.view} edit={this.props.project.edit} permissions={this.props.project.permissions} db="lanwiki-tags"/>


              </ModalBody>

              <ModalFooter>



              <Button className="mr-auto btn-link" disabled={this.state.saving} onClick={() => this.props.close()}>
                Close
              </Button>

              <Button className="btn-red" disabled={this.state.saving} onClick={() => {
                  if (window.confirm('Are you sure you want to delete this project? WARNING: all asociated tasks will be deleted too')) {
                    this.remove();
                  }
                }}>
                Delete
              </Button>

              <Button className="btn" disabled={this.state.saving||this.state.title===""} onClick={()=>{
                  this.setState({saving:true});
                  rebase.updateDoc(`/proj-projects/${this.props.project.id}`, {title:this.state.title,description:this.state.description})
                    .then(()=>{this.setState({title:'',description:'',saving:false}, () => this.props.close())});
                }}>{this.state.saving?'Saving...':'Save changes'}</Button>
            </ModalFooter>

          </div>
    );
  }
}
