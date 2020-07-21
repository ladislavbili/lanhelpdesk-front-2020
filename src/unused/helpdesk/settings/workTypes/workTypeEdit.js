import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import {rebase} from '../../../index';

export default class WorkTypeEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      loading:true,
      saving:false
    }
    this.setData.bind(this);
    rebase.get('help-work_types/'+this.props.match.params.id, {
      context: this,
    }).then((workType)=>this.setData(workType));
  }

  setData(data){
    this.setState({title:data.title,loading:false})
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      rebase.get('help-work_types/'+props.match.params.id, {
        context: this,
      }).then((workType)=>this.setData(workType));
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
            <Label for="name">WorkType name</Label>
            <Input type="text" name="name" id="name" placeholder="Enter work type name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
          </FormGroup>

          <Button className="btn" disabled={this.state.saving} onClick={()=>{
              this.setState({saving:true});
              rebase.updateDoc('/help-work_types/'+this.props.match.params.id, {title:this.state.title})
                .then(()=>{this.setState({saving:false})});
            }}>{this.state.saving?'Saving work type...':'Save work type'}</Button>
          <Button className="btn-link" disabled={this.state.saving} onClick={()=>{
              if(window.confirm("Are you sure?")){
                rebase.removeDoc('/help-work_types/'+this.props.match.params.id).then(()=>{
                  this.props.history.goBack();
                });
              }
            }}>Delete</Button>
        </div>
      </div>
    );
  }
}
