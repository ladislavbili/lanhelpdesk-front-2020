import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import {rebase} from '../../index';
import Permits from "../../components/permissions";

export default class WorkTypeEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      loading:true,
      saving:false
    }
    this.setData.bind(this);
    rebase.get('proj-tags/'+this.props.match.params.id, {
      context: this,
    }).then((workType)=>this.setData(workType));
  }

  setData(data){
    this.setState({
      title:data.title,
      loading:false,
      view: data.view,
      edit: data.edit,
      permissions: data.permissions,
    })
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      rebase.get('proj-tags/'+props.match.params.id, {
        context: this,
      }).then((tag)=>this.setData(tag));
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
            <Label for="name">Tag name</Label>
            <Input type="text" name="name" id="name" placeholder="Enter tag name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
          </FormGroup>

          <Permits id={this.props.match.params.id} view={this.state.view} edit={this.state.edit} permissions={this.state.permissions} db="proj-tags" />


          <Button className="btn m-t-30" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.updateDoc('/proj-tags/'+this.props.match.params.id, {title:this.state.title})
              .then(()=>{this.setState({saving:false})});
          }}>{this.state.saving?'Saving tag...':'Save tag'}</Button>
          <Button className="btn-link  m-t-30" disabled={this.state.saving} onClick={()=>{
              if(window.confirm("Are you sure?")){
                rebase.removeDoc('/proj-tags/'+this.props.match.params.id).then(()=>{
                  this.props.history.goBack();
                });
              }
              }}>Delete</Button>
        </div>
      </div>
    );
  }
}
