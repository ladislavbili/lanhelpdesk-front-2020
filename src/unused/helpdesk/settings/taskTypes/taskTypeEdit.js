import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import {rebase} from '../../../index';

export default class TaskTypeEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      loading:true,
      saving:false
    }
    this.setData.bind(this);
    rebase.get('help-task_types/'+this.props.match.params.id, {
      context: this,
    }).then((unit)=>this.setData(unit));
  }

  setData(data){
    this.setState({title:data.title,loading:false})
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      rebase.get('help-task_types/'+props.match.params.id, {
        context: this,
      }).then((unit)=>this.setData(unit));
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
              <Label for="name">Task type name</Label>
              <Input type="text" name="name" id="name" placeholder="Enter task type name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
            </FormGroup>

            <Button className="btn" disabled={this.state.saving} onClick={()=>{
                this.setState({saving:true});
                rebase.updateDoc('/help-task_types/'+this.props.match.params.id, {title:this.state.title})
                  .then(()=>{this.setState({saving:false})});
              }}>{this.state.saving?'Saving task type...':'Save task type'}</Button>
            <Button className="btn-link"  disabled={this.state.saving} onClick={()=>{
                  if(window.confirm("Are you sure?")){
                    rebase.removeDoc('/help-task_types/'+this.props.match.params.id).then(()=>{
                      this.props.history.goBack();
                    });
                  }
              }}>Delete</Button>
          </div>
      </div>
    );
  }
}
