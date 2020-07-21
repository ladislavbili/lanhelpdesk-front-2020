import React, { Component } from 'react';
import {Button } from 'reactstrap';
import {rebase} from '../../../index';
import SupplierAdd from './supplierAdd';
import SupplierEdit from './supplierEdit';

export default class SuppliersList extends Component{
  constructor(props){
    super(props);
    this.state={
      suppliers:[]
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/help-suppliers', {
      context: this,
      withIds: true,
      then:content=>{this.setState({suppliers:content, supplierFilter:''})},
    });
  }

  componentWillUnmount(){
    rebase.removeBinding(this.ref);
  }

  render(){
    return (
      <div className="content-page">
				<div className="content" style={{ paddingTop: 0 }}>
					<div className="commandbar">
						<div className="row align-items-center">
              <div className="p-2" >
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control search"
                    value={this.state.supplierFilter}
                    onChange={(e)=>this.setState({supplierFilter:e.target.value})}
                    placeholder="Search"
                  />
                  <div className="input-group-append">
                    <button className="search-btn" type="button">
                      <i className="fa fa-search" />
                    </button>
                  </div>
                </div>
              </div>

              <Button
                className="btn-link t-a-l"
                onClick={()=>this.props.history.push('/helpdesk/settings/suppliers/add')}>
               <i className="fa fa-plus m-r-5 m-l-5 "/> Supplier
              </Button>

            </div>
          </div>

          <div className="row m-0 p-0 taskList-container">
            <div className="col-lg-4 p-0 scrollable fit-with-header-and-commandbar">
              <table className="table table-hover p-5">
                <thead>
                  <tr className="clickable">
                    <th>Supplier name</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.suppliers.filter((item)=>item.title.toLowerCase().includes(this.state.supplierFilter.toLowerCase())).map((supplier)=>
                    <tr
                      key={supplier.id}
                      className={"clickable" + (this.props.match.params.id === supplier.id ? " sidebar-item-active":"")}
                      onClick={()=>this.props.history.push('/helpdesk/settings/suppliers/'+supplier.id)}>
                      <td className={(this.props.match.params.id === supplier.id ? "text-highlight":"")}>
                        {supplier.title}
                      </td>
                    </tr>
                  )}
                  </tbody>
                </table>
                </div>
                <div className="col-lg-8 p-0">
                  {
                    this.props.match.params.id && this.props.match.params.id==='add' && <SupplierAdd />
                  }
                  {
                    this.props.match.params.id && this.props.match.params.id!=='add' && this.state.suppliers.some((item)=>item.id===this.props.match.params.id) && <SupplierEdit match={this.props.match} history={this.props.history}/>
                  }
                </div>
              </div>
            </div>
          </div>
    );
  }
}
