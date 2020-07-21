import React, { Component } from 'react';
import {Button } from 'reactstrap';
import SupplierAdd from './supplierAdd';
import SupplierEdit from './supplierEdit';

import { connect } from "react-redux";
import {storageHelpSuppliersStart} from '../../../redux/actions';
import {sameStringForms} from '../../../helperFunctions';

class SuppliersList extends Component{
  constructor(props){
    super(props);
    this.state={
      suppliers:[],
      supplierFilter:''
    }
  }

  componentWillReceiveProps(props){
    if(!sameStringForms(props.suppliers,this.props.suppliers)){
      this.setState({suppliers:props.suppliers})
    }
  }

  componentWillMount(){
    if(!this.props.suppliersActive){
      this.props.storageHelpSuppliersStart();
    }
    this.setState({suppliers:this.props.suppliers});
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
                    value={this.state.supplierFilter}
                    onChange={(e)=>this.setState({supplierFilter:e.target.value})}
                    placeholder="Search"
                    />
                </div>
              </div>
              <Button
                className="btn-link center-hor"
                onClick={()=>this.props.history.push('/helpdesk/settings/suppliers/add')}>
                <i className="fa fa-plus p-l-5 p-r-5"/> Supplier
              </Button>
            </div>
            <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <h2 className=" p-l-10 p-b-10 ">
    						Supplier name
    					</h2>
                <table className="table table-hover">
                  <tbody>
                  {this.state.suppliers.filter((item)=>item.title.toLowerCase().includes(this.state.supplierFilter.toLowerCase())).map((supplier)=>
                    <tr
                      key={supplier.id}
                      className={"clickable" + (this.props.match.params.id === supplier.id ? " active":"")}
                      onClick={()=>this.props.history.push('/helpdesk/settings/suppliers/'+supplier.id)}>
                      <td>
                        {supplier.title}
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
              this.props.match.params.id && this.props.match.params.id==='add' && <SupplierAdd />
            }
            {
              this.props.match.params.id && this.props.match.params.id!=='add' && this.state.suppliers.some((item)=>item.id===this.props.match.params.id) && <SupplierEdit match={this.props.match} history={this.props.history}/>
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageHelpSuppliers}) => {
  const { suppliersActive, suppliers } = storageHelpSuppliers;
  return { suppliersActive, suppliers };
};

export default connect(mapStateToProps, { storageHelpSuppliersStart })(SuppliersList);
