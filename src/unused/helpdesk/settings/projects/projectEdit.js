import React, { Component } from 'react';
import { Button, FormGroup, Label,Input,Alert } from 'reactstrap';
import {rebase} from '../../../index';

export default class ProjectEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      projectName:'',
      loading:true,
      saving:false
    }
    this.setData.bind(this);
    rebase.get('help-projects/'+this.props.match.params.id, {
      context: this,
    }).then((project)=>this.setData(project));
  }

  setData(data){
    this.setState({projectName:data.title,loading:false})
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      rebase.get('help-projects/'+props.match.params.id, {
        context: this,
      }).then((project)=>this.setData(project));
    }
  }

  render(){
    return (
      <div className="full-height card-box scrollable fit-with-header-and-commandbar">
        <div className="m-t-20">
          {
            this.state.loading &&
            <Alert color="success">
              Loading data...
            </Alert>
          }
          <FormGroup>
            <Label for="name">Project name</Label>
            <Input type="text" name="name" id="name" placeholder="Enter project name" value={this.state.projectName} onChange={(e)=>this.setState({projectName:e.target.value})} />
          </FormGroup>
          <Button className="btn" disabled={this.state.saving} onClick={()=>{
              this.setState({saving:true});
              rebase.updateDoc('/help-projects/'+this.props.match.params.id, {title:this.state.projectName})
                .then(()=>{this.setState({saving:false})});
            }}>{this.state.saving?'Saving project...':'Save project'}</Button>
          <Button className="btn btn-link" disabled={this.state.saving} onClick={()=>{
                if(window.confirm("Are you sure?")){
                  rebase.removeDoc('/help-projects/'+this.props.match.params.id).then(()=>{
                    this.props.history.goBack();
                  });
                }
                }}>Delete</Button>
        </div>
      </div>
    );
  }
}
