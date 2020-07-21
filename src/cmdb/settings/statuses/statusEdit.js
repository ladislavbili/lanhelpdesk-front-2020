import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import {rebase} from '../../../index';

export default class StatusEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      loading:true,
      saving:false
    }

    this.setData.bind(this);
    if(this.props.id!==null){
      rebase.get('cmdb-statuses/'+this.props.id, {
        context: this,
      }).then((status)=>this.setData(status));
    }
  }

  setData(data){
    this.setState({title:data.title,loading:false})
  }

  componentWillReceiveProps(props){
    if(this.props.id!==props.id && props.id!==null){
      this.setState({loading:true})
      rebase.get('cmdb-statuses/'+props.id, {
        context: this,
      }).then((status)=>this.setData(status));
    }
  }


  render(){
    return (
      <Modal isOpen={this.props.opened} toggle={this.props.toggle} >
          <ModalHeader>Edit status</ModalHeader>
          <ModalBody>
            <FormGroup>
                <Label for="name">Status name</Label>
                <Input type="text" name="name" id="name" placeholder="Enter status name" disabled={this.state.loading} value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button className="mr-auto btn-link" disabled={this.state.saving} onClick={this.props.toggle}>
                Close
              </Button>

              <Button className="btn" disabled={this.state.saving||this.state.loading} onClick={()=>{
                  this.setState({saving:true});
                  rebase.updateDoc('/cmdb-statuses/'+this.props.id, {title:this.state.title})
                  .then(()=>{this.setState({saving:false})});
                }}>
                {this.state.saving?'Saving...':'Save status'}
              </Button>
            </ModalFooter>
          </Modal>
    );
  }
}
