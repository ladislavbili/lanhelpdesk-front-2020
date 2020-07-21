import React, { Component } from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import {rebase} from '../../index';

export default class ProjectAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      description:'',
      od: "",
      do: "",
      saving:false,
      opened:false
    }
    this.submit.bind(this);
  }

  submit(){
      this.setState({saving:true});
      let milestone = {
        title:this.state.title,
        description:this.state.description,
        od:  isNaN(new Date(this.state.od).getTime()) ? null : (new Date(this.state.od).getTime()),
        do:  isNaN(new Date(this.state.do).getTime()) ? null : (new Date(this.state.do).getTime()),
        project: this.props.project ? this.props.project.id : null,
      };
      rebase.addToCollection('/proj-milestones', milestone)
        .then((mil) => {
          this.setState({
            title:'',
            description:'',
            od: null,
            do: null,
            saving:false}, () => this.props.addMilestone({id: mil.id, value: mil.id, label: milestone.title, project: milestone.project}));
      });

  }

  render(){
    return (
      <div>

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


        <Button className="pull-right btn" disabled={this.state.saving||this.state.title===""} onClick={() => this.submit()}>{this.state.saving?'Adding...':'Add milestone'}</Button>

        <Button className="mr-auto btn-link" disabled={this.state.saving} onClick={() => this.props.close()}>
          Close
        </Button>

      </div>
    );
  }
}
