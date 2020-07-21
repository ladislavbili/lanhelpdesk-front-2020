import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import Select from 'react-select';
import InvoiceItems from './invoiceItems';
import {rebase} from '../../../index';
import {toSelArr, sameStringForms} from '../../../helperFunctions';
import {selectStyle} from "configs/components/select";

import { connect } from "react-redux";
import {storageHelpSuppliersStart, storageHelpUnitsStart} from '../../../redux/actions';

class SupplierInvoiceAdd extends Component{
  constructor(props){
    super(props);
    let date = new Date().toISOString();
    this.state={
      loading:true,
      units:[],
      suppliers:[],
      supplier:null,
      identifier:0,
      note:'',
      date:date.substring(0,date.indexOf('.')),
      saving:false,
      invoiceItems:[],
      newItemID:0
    }
    this.setData.bind(this);
  }

  storageLoaded(props){
    return props.suppliersLoaded &&
      props.unitsLoaded
  }

  componentWillReceiveProps(props){
    if(!this.storageLoaded(this.props) && this.storageLoaded(props)){
      this.setData(props);
    }
    if(!sameStringForms(props.units,this.props.units)||
      !sameStringForms(props.suppliers,this.props.suppliers)){
        if(this.storageLoaded(props)){
          this.setData(props);
        }
      }
  }

  componentWillMount(){
    if(!this.props.suppliersActive){
      this.props.storageHelpSuppliersStart();
    }
    if(!this.props.unitsActive){
      this.props.storageHelpUnitsStart();
    }
    if(this.storageLoaded(this.props)){
      this.setData(this.props);
    };
  }

  setData(props){
    let units = toSelArr(props.units);
    let suppliers = toSelArr(props.suppliers);

    let supplier = null;
    if(suppliers.length>0){
      supplier=suppliers[0];
    }
    this.setState({units,supplier,suppliers,loading:false})
  }

  render(){
    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
          <FormGroup>
            <Label for="name">Invoice indetifier</Label>
            <Input type="text" name="identifier" id="identifier" placeholder="Enter identifier" value={this.state.identifier} onChange={(e)=>this.setState({identifier:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="name">Supplier</Label>
              <Select
                value={this.state.supplier}
                onChange={(supplier)=>this.setState({supplier})}
                options={this.state.suppliers}
                styles={selectStyle}
                />
          </FormGroup>
          <FormGroup>
            <Label for="name">Date</Label>
            <Input type="datetime-local" name="date" id="date" placeholder="Enter date" value={this.state.date} onChange={(e)=>this.setState({date:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="name">Note</Label>
            <Input type="textarea" name="note" id="note" placeholder="Enter note" value={this.state.note} onChange={(e)=>this.setState({note:e.target.value})} />
          </FormGroup>

        <InvoiceItems
          units={this.state.units}
          invoiceItems={this.state.invoiceItems}
          addItem={(newItem)=>this.setState({invoiceItems:[...this.state.invoiceItems, newItem],newItemID:this.state.newItemID+1})}
          deleteItem={(id)=>this.setState({invoiceItems:this.state.invoiceItems.filter((item)=>item.id!==id)})}
          editItem={(newItem)=>this.setState({invoiceItems:[...this.state.invoiceItems.filter((item)=>item.id!==newItem.id),newItem]})}
          disabled={this.state.saving||this.state.loading}
          newItemID={this.state.newItemID}
          />

        <Button className="btn"  disabled={this.state.saving||this.state.loading} onClick={()=>{
            this.setState({saving:true});
            rebase.addToCollection('/help-supplier_invoices', {supplier:this.state.supplier.id,identifier:this.state.identifier,note:this.state.note,date:this.state.date!==null?(new Date(this.state.date)).getTime():0})
              .then((response)=>{
                this.state.invoiceItems.map((invoiceItem)=>{
                  rebase.addToCollection('/help-invoice_items', {
                    title:invoiceItem.title,
                    unit:invoiceItem.unit,
                    quantity:invoiceItem.quantity,
                    price:invoiceItem.price,
                    sn:invoiceItem.sn,
                    invoice:response.id
                  }).then((response)=>{
                    rebase.addToCollection('/help-stored_items', {
                      invoiceItem:response.id,
                      quantity:invoiceItem.quantity,
                    });
                  });
                  return null;
                })
                this.setState({ supplier:null,identifier:0,note:'',invoiceItems:[],saving:false});
              });
          }}>{this.state.saving?'Adding...':'Add invoice'}</Button>
      </div>
    );
  }
}

const mapStateToProps = ({ storageHelpSuppliers,storageHelpUnits }) => {
  const { suppliersActive, suppliers, suppliersLoaded } = storageHelpSuppliers;
  const { unitsActive, units, unitsLoaded } = storageHelpUnits;
  return { suppliersActive,suppliers, suppliersLoaded,unitsActive,units, unitsLoaded };
};

export default connect(mapStateToProps, { storageHelpSuppliersStart, storageHelpUnitsStart })(SupplierInvoiceAdd);
