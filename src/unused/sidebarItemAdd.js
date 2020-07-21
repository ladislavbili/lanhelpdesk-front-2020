import React, { Component } from 'react';
import { Button,  FormGroup, Label, Input, FormText } from 'reactstrap';
import { Modal } from 'react-bootstrap';
import Select from "react-select";
import {rebase} from '../index';

const availableAttributes=[{label:'Title',value:'title'},{label:'IP',value:'ip'},{label:'status',value:'status'},{label:'Company',value:'company'}];

export default class StatusEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      attributes:[{label:'Title',value:'title'}],
      attributesToDisplay:[{label:'Title',value:'title'}],
      saving:false
    }
  }


  render(){
    return (
      <Modal className="show" show={this.props.opened} size="lg" aria-labelledby="example-modal-sizes-title-lg" >
        <Modal.Header>
          <h1 className="modal-header">Add sidebar item</h1>
          <button type="button" className="close ml-auto" aria-label="Close" onClick={this.props.toggle}><span aria-hidden="true">×</span></button>
        </Modal.Header>
        <Modal.Body>
          <FormGroup>
            <Label>Item name</Label>
            <Input type="text" placeholder="Enter status name" disabled={this.state.loading} value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label>Select attributes</Label>
            <Select
              className="fullWidth"
              options={availableAttributes}
              value={this.state.attributes}
              isMulti
              onChange={e => {
                let newAttributes=this.state.attributesToDisplay.filter((item)=>e.find((item2)=>item2.value===item.value)!==undefined);
                this.setState({attributes:e,attributesToDisplay:newAttributes});
              }}
              />
          </FormGroup>
          <FormGroup>
            <Label>Select attributes to display</Label>
            <Select
              className="fullWidth"
              options={this.state.attributes}
              value={this.state.attributesToDisplay}
              isMulti
              onChange={e => {
                this.setState({attributesToDisplay:e});
              }}
              />
          </FormGroup>
        </Modal.Body>

        <Modal.Footer>
          <Button color="danger" className="mr-auto" disabled={this.state.saving} onClick={this.props.toggle}>
            Close
          </Button>

          <Button color="primary" disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            rebase.addToCollection('/cmdb-sidebar', {title:this.state.title,attributes:this.state.attributes.map((item)=>item.value),attributesToDisplay:this.state.attributesToDisplay.map((item)=>item.value)})
              .then(()=>{
                this.setState({
                  title:'',
                  attributes:[{label:'Title',value:'title'}],
                  attributesToDisplay:[{label:'Title',value:'title'}],
                  saving:false
                });

              });
            }}>
            {this.state.saving?'Adding...':'Add sidebar item'}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
