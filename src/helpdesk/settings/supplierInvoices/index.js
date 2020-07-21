import React, { Component } from 'react';
import {Button } from 'reactstrap';
import { connect } from "react-redux";
import {storageHelpSuppliersStart, storageHelpSupplierInvoicesStart} from '../../../redux/actions';

import {timestampToString, sameStringForms} from '../../../helperFunctions';
import SupplierInvoiceAdd from './supplierInvoiceAdd';
import SupplierInvoiceEdit from './supplierInvoiceEdit';

class SupplierInvoicesList extends Component{
  constructor(props){
    super(props);
    this.state={
      supplierInvoices:[],
      suppliers:[],
      supplierInvoiceFilter:''
    }
  }
  componentWillReceiveProps(props){
		if(!sameStringForms(props.supplierInvoices,this.props.supplierInvoices)){
			this.setState({supplierInvoices:props.supplierInvoices})
		}
    if(!sameStringForms(props.suppliers,this.props.suppliers)){
			this.setState({suppliers:props.suppliers})
		}
	}

  componentWillMount(){
    if(!this.props.suppliersActive){
      this.props.storageHelpSuppliersStart();
    }
    this.setState({supplierInvoices:this.props.supplierInvoices});

    if(!this.props.supplierInvoicesActive){
      this.props.storageHelpSupplierInvoicesStart();
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
                    value={this.state.supplierInvoiceFilter}
                    onChange={(e)=>this.setState({supplierInvoiceFilter:e.target.value})}
                    placeholder="Search"
                    />
                </div>
              </div>
              <Button
                className="btn-link center-hor"
                onClick={()=>this.props.history.push('/helpdesk/settings/supplierInvoices/add')}>
                <i className="fa fa-plus p-l-5 p-r-5"/> Invoice
              </Button>
            </div>
            <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <h2 className=" p-l-10 p-b-10 ">
  							Invoices
  						</h2>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Invoice identifier</th>
                    <th>Supplier</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.supplierInvoices.filter((item)=>item.identifier.toString().toLowerCase().includes(this.state.supplierInvoiceFilter.toLowerCase())).map((supplierInvoice)=>
                    <tr
                      key={supplierInvoice.id}
                      className={"clickable" + (this.props.match.params.id === supplierInvoice.id ? " active":"")}
                      onClick={()=>this.props.history.push('/helpdesk/settings/supplierInvoices/'+supplierInvoice.id)}>
                      <td>
                        {supplierInvoice.identifier}
                      </td>
                      <td>
                        {this.state.suppliers.some((supplier)=>supplier.id===supplierInvoice.supplier)?this.state.suppliers.find((supplier)=>supplier.id===supplierInvoice.supplier).title:'Unknown supplier'}
                      </td>
                      <td>
                        {timestampToString(supplierInvoice.date)}
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
              this.props.match.params.id && this.props.match.params.id==='add' && <SupplierInvoiceAdd />
            }
            {
              this.props.match.params.id && this.props.match.params.id!=='add' && this.state.supplierInvoices.some((item)=>item.id===this.props.match.params.id) && <SupplierInvoiceEdit match={this.props.match} history={this.props.history} />
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageHelpSuppliers,storageHelpSupplierInvoices }) => {
  const { suppliersActive, suppliers } = storageHelpSuppliers;
  const { supplierInvoicesActive, supplierInvoices } = storageHelpSupplierInvoices;
  return { suppliersActive,suppliers,supplierInvoicesActive,supplierInvoices };
};

export default connect(mapStateToProps, { storageHelpSuppliersStart, storageHelpSupplierInvoicesStart })(SupplierInvoicesList);
