import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';

import {  GET_TRIP_TYPES } from '../index';

export default class TripTypeAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      order:0,
      saving:false
    }
  }

  render(){
    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">

        <FormGroup>
          <Label for="name">Trip type</Label>
          <Input type="text" name="name" id="name" placeholder="Enter trip type" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
        </FormGroup>
        <FormGroup>
          <Label for="order">Order</Label>
          <Input type="number" name="order" id="order" placeholder="Lower means first" value={this.state.order} onChange={(e)=>this.setState({order:e.target.value})} />
        </FormGroup>
        <Button className="btn" disabled={this.state.saving} onClick={this.addTripType.bind(this)}>{this.state.saving?'Adding...':'Add trip type'}</Button>
    </div>
    );
  }

  addTripType(){
      const { client } = this.props;

      this.setState({saving: true});
      let order = this.state.order!==''?parseInt(this.state.order):0;
      if(isNaN(order)){
        order=0;
      }
      this.props.addTripType({ variables: {
        title: this.state.title,
        order: parseInt(this.state.order),
      } }).then( ( response ) => {
        const allTripTypes = client.readQuery({query: GET_TRIP_TYPES}).tripTypes;
        const newTripType = {...response.data.addTripType, __typename: "TripType"};
        client.writeQuery({ query: GET_TRIP_TYPES, data: {tripTypes: [...allTripTypes, newTripType ] } });
        this.props.history.push('/helpdesk/settings/tripTypes/' + newTripType.id)
      }).catch( (err) => {
        console.log(err.message);
      });
      this.setState({saving: false});
  }

}
