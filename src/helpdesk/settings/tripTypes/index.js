import React, { Component } from 'react';

import {Button } from 'reactstrap';
import TripTypeAdd from './tripTypeAdd';
import TripTypeEdit from './tripTypeEdit';

import { connect } from "react-redux";
import {storageHelpTripTypesStart} from '../../../redux/actions';
import {sameStringForms} from '../../../helperFunctions';

class TripTypesList extends Component{
  constructor(props){
    super(props);
    this.state={
      tripTypes:[],
      tripTypeFilter:''
    }
  }

  componentWillReceiveProps(props){
    if(!sameStringForms(props.tripTypes,this.props.tripTypes)){
      this.setState({tripTypes:props.tripTypes})
    }
  }

  componentWillMount(){
    if(!this.props.tripTypesActive){
      this.props.storageHelpTripTypesStart();
    }
    this.setState({tripTypes:this.props.tripTypes});
  }

  render(){
    return (
      <div className="content">
        <div className="row m-0 p-0 taskList-container">
          <div className="col-lg-4">
            <div className="commandbar">
              <div className="search-row">
                <div className="search">
                  <button className="search-btn" type="button">
                    <i className="fa fa-search" />
                  </button>
                  <input
                    type="text"
                    className="form-control search-text"
                    value={this.state.tripTypeFilter}
                    onChange={(e)=>this.setState({tripTypeFilter:e.target.value})}
                    placeholder="Search"
                    />
                </div>
              </div>
              <Button
                className="btn-link center-hor"
                onClick={()=>this.props.history.push('/helpdesk/settings/tripTypes/add')}>
                <i className="fa fa-plus p-l-5 p-r-5"/> Trip type
              </Button>
            </div>
            <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <h2 className=" p-l-10 p-b-10 ">
  							Trip type
  						</h2>
              <table className="table table-hover">
                <tbody>
                  {this.state.tripTypes.filter((item)=>item.title.toLowerCase().includes(this.state.tripTypeFilter.toLowerCase())).map((tripType)=>
                    <tr key={tripType.id}
                      className={"clickable" + (this.props.match.params.id === tripType.id ? " active":"")}
                      onClick={()=>this.props.history.push('/helpdesk/settings/tripTypes/'+tripType.id)}>
                      <td>
                        {tripType.title}
                      </td>
                      <td>
                        {tripType.order?tripType.order:0}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="commandbar"></div>
            {
              this.props.match.params.id && this.props.match.params.id==='add' && <TripTypeAdd />
            }
            {
              this.props.match.params.id && this.props.match.params.id!=='add' && this.state.tripTypes.some((item)=>item.id===this.props.match.params.id) && <TripTypeEdit match={this.props.match} history={this.props.history} />
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageHelpTripTypes}) => {
  const { tripTypesActive, tripTypes } = storageHelpTripTypes;
  return { tripTypesActive, tripTypes };
};

export default connect(mapStateToProps, { storageHelpTripTypesStart })(TripTypesList);
