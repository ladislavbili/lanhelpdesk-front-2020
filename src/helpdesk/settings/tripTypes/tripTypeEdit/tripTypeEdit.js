import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import Loading from 'components/loading';

import {  GET_TRIP_TYPES } from '../index';

export default class TripTypeEdit extends Component{

  constructor(props){
    super(props);
    this.state={
      title:'',
      order: 0,

      loading:true,
      saving:false
    }
    this.setData.bind(this);
    this.storageLoaded.bind(this);
  }

  storageLoaded(props){
    return !props.tripTypeData.loading
  }

  componentWillReceiveProps(props){
    if ((this.storageLoaded(props) && !this.storageLoaded(this.props))
        ||
        (this.props.match.params.id !== props.match.params.id)){
      this.setData(props);
    }
  }

  componentWillMount(){
    if(this.storageLoaded(this.props)){
      this.setData(this.props);
    }
  }

  setData(props){
    if( props.tripTypeData.data ){
      const tripType = props.tripTypeData.data.tripType;
      this.setState({
        title: tripType.title,
        order: tripType.order,
      })
    }
  }


  render(){
    const { loading, data } = this.props.tripTypeData;
    const { client } = this.props;
    let id = null;
    if (!loading){
      id = data.tripType.id;
    }

    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
          {
            loading &&
            <Loading />
          }
            <FormGroup>
              <Label for="name">Task type name</Label>
              <Input type="text" name="name" id="name" placeholder="Enter trip type" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
            </FormGroup>
            <FormGroup>
              <Label for="order">Order</Label>
              <Input type="number" name="order" id="order" placeholder="Lower means first" value={this.state.order} onChange={(e)=>this.setState({order:e.target.value})} />
            </FormGroup>
          <div className="row">
            <Button className="btn" disabled={this.state.saving} onClick={()=>{
                this.setState({saving:true});
                let order = this.state.order!==''?parseInt(this.state.order):0;
                if(isNaN(order)){
                  order=0;
                }
                this.props.updateTripType({ variables: {
                  id,
                  title: this.state.title,
                  order: parseInt(this.state.order),
                } }).then( ( response ) => {
                }).catch( (err) => {
                  console.log(err.message);
                });
                this.setState({saving:false});
              }}>{this.state.saving?'Saving trip type...':'Save trip type'}</Button>

            <Button className="btn-red m-l-5"  disabled={this.state.saving} onClick={()=>{
                  if(window.confirm("Are you sure?")){
                    this.props.deleteTripType({ variables: {
                      id,
                    } }).then( ( response ) => {
                      const allTripTypes = client.readQuery({query: GET_TRIP_TYPES}).tripTypes;
                      client.writeQuery({ query: GET_TRIP_TYPES, data: {tripTypes: allTripTypes.filter( tripType => tripType.id !== id )} });
                      this.props.history.goBack();
                    }).catch( (err) => {
                      console.log(err.message);
                    });
                  }
              }}>Delete</Button>
          </div>
      </div>
    );
  }
}
