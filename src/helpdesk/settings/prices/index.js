 import React, { Component } from 'react';
import PriceAdd from './priceAdd';
import PriceEdit from './priceEdit';
import {Button } from 'reactstrap';

import { connect } from "react-redux";
import {storageHelpPricelistsStart} from '../../../redux/actions';
import {sameStringForms} from '../../../helperFunctions';


class PriceList extends Component{
  constructor(props){
    super(props);
    this.state={
      pricelist:[],
      pricelistFilter:''
    }
  }

  componentWillReceiveProps(props){
    if(!sameStringForms(props.pricelists,this.props.pricelists)){
      this.setState({pricelists:props.pricelists})
    }
  }

  componentWillMount(){
    if(!this.props.pricelistsActive){
      this.props.storageHelpPricelistsStart();
    }
    this.setState({pricelists:this.props.pricelists});
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
                      className="form-control search-text search"
                      onChange={(e)=>this.setState({pricelistFilter:e.target.value})}
                      placeholder="Search"
                      />
                  </div>
                </div>
                <Button
                  className="btn-link center-hor"
                  onClick={()=>this.props.history.push('/helpdesk/settings/pricelists/add')}>
                  <i className="fa fa-plus p-l-5 p-r-5"/> Price list
                  </Button>
                </div>
              <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
                <h2 className=" p-l-10 p-b-10 ">
    							Price lists
    						</h2>
                <table className="table table-hover">
                  <tbody>
                    {this.state.pricelists.filter((item)=>item.title.toLowerCase().includes(this.state.pricelistFilter.toLowerCase())).map((pricelist)=>
                      <tr key={pricelist.id}
                        className={"clickable" + (this.props.match.params.id === pricelist.id ? " active":"")}
                        onClick={()=>{this.props.history.push('/helpdesk/settings/pricelists/'+pricelist.id)}}>
                        <td>
                          {pricelist.title}
                        </td>
                        <td width="10%">
                          {pricelist.def ? "Default" : ""}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="commandbar">
              </div>
              <div className="p-20 scroll-visible fit-with-header-and-commandbar">
                {
                  this.props.match.params.id && this.props.match.params.id==='add' && <PriceAdd />
                }
                {
                  this.props.match.params.id && this.props.match.params.id!=='add' && this.state.pricelists.some((item)=>item.id===this.props.match.params.id) && <PriceEdit match={this.props.match} history={this.props.history}/>
                }
              </div>
            </div>
          </div>
        </div>
    );
  }
}

const mapStateToProps = ({ storageHelpPricelists}) => {
  const { pricelistsActive, pricelists } = storageHelpPricelists;
  return { pricelistsActive, pricelists };
};

export default connect(mapStateToProps, { storageHelpPricelistsStart })(PriceList);
