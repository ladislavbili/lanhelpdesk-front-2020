import React, { Component } from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import {rebase} from '../../index';

export default class ProjectAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title: this.props.milestone.title,
      description: this.props.milestone.description,
      od: this.props.milestone.od ? new Date(this.props.milestone.od).toISOString().replace('Z', '') : '' ,
      do: this.props.milestone.do ? new Date(this.props.milestone.do).toISOString().replace('Z', '') : '' ,
      saving:false,
      opened:false
    }
    this.submit.bind(this);
    this.remove.bind(this);
  }

  submit(){
      this.setState({saving:true});
      let milestone = {
        title: this.state.title,
        description: this.state.description,
        od:  isNaN(new Date(this.state.od).getTime()) ? null : (new Date(this.state.od).getTime()),
        do:  isNaN(new Date(this.state.do).getTime()) ? null : (new Date(this.state.do).getTime()),
      };
      rebase.updateDoc(`/proj-milestones/${this.props.milestone.id}`, milestone)
        .then(() => {
          this.props.close();
        }).catch(err => {
        //handle error
      });

  }

  remove(){
    rebase.get(`proj-tasks`, {
      context: this,
      query: (ref) => ref.where('milestone', '==', this.props.milestone.id),
      withIds: true,
      }).then(data => {
        data.forEach(datum => {
          rebase.updateDoc(`/proj-tasks/${datum.id}`, {...datum, milestone: null})
        }
        );
        rebase.removeDoc(`/proj-milestones/${this.props.milestone.id}`).then(() => {
          this.props.close();
          this.props.history.push(`/projects/${this.props.milestone.project}/all`);
        }
        );
      }).catch(err => {
          rebase.removeDoc(`/proj-milestones/${this.props.milestone.id}`).then(() => {
            this.props.close();
            this.props.history.push(`/projects/${this.props.milestone.project}/all`);
          });
      })
  }

  render(){
    return (
      <div className="m-t-15 m-b-15">

        <FormGroup>
          <Label>Milestone name</Label>
          <Input type="text" placeholder="Enter project name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
        </FormGroup>

        <FormGroup>
          <Label className="text-slim">Od</Label>
          <Input type="datetime-local" placeholder="Enter deadline" value={this.state.od} onChange={(e) => this.setState({ od: e.target.value })} />
        </FormGroup>

        <FormGroup>
          <Label className="text-slim">Do</Label>
          <Input type="datetime-local" placeholder="Enter deadline" value={this.state.do} onChange={(e) => this.setState({ do: e.target.value })} />
        </FormGroup>

        <FormGroup>
          <Label>Milestone description</Label>
          <Input type="textarea" placeholder="Enter project description" value={this.state.description} onChange={(e) => this.setState({description:e.target.value})} />
        </FormGroup>


        <Button className="pull-right btn" disabled={this.state.saving||this.state.title===""} onClick={() => this.submit()}>{this.state.saving?'Saving...':'Save changes'}</Button>


        <Button className="btn-red pull-right m-r-5" disabled={this.state.saving} onClick={() => {
            if (window.confirm('Are you sure you want to delete this mielstone? Note: task in this milestone will not be deleted')) {
              this.remove()
            }
          }}>
          Delete
        </Button>

        <Button className="mr-auto btn-link" disabled={this.state.saving} onClick={() => this.props.close()}>
          Close
        </Button>

      </div>
    );
  }
}
