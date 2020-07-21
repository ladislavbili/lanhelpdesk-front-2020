import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import Select from 'react-select';
import InvoiceItems from './invoiceItems';
import {rebase} from '../../../index';
import {toSelArr, sameStringForms} from '../../../helperFunctions';
import {selectStyle} from "configs/components/select";

import { connect } from "react-redux";
import {storageHelpUnitsStart, storageHelpSuppliersStart, storageHelpInvoiceItemsStart, storageHelpSupplierInvoicesStart, storageHelpStoredItemsStart} from '../../../redux/actions';

class SupplierInvoiceEdit extends Component{
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
    this.fetchInvoiceItems.bind(this);
    this.setData.bind(this);
  }

  storageLoaded(props){
    return props.unitsLoaded &&
     props.suppliersLoaded &&
     props.invoiceItemsLoaded &&
     props.supplierInvoicesLoaded &&
     props.storedItemsLoaded
  }


  componentWillReceiveProps(props){
    if(!this.storageLoaded(this.props) && this.storageLoaded(props)){
      this.setData(props);
    }
    if(!sameStringForms(props.units,this.props.units)||
      !sameStringForms(props.suppliers,this.props.suppliers)||
      !sameStringForms(props.invoiceItems,this.props.invoiceItems)||
      !sameStringForms(props.supplierInvoices,this.props.supplierInvoices)||
      !sameStringForms(props.storedItems,this.props.storedItems)
    ){
      if(this.storageLoaded(props)){
        this.setData(props);
        }
      }
      if(this.props.match.params.id!==props.match.params.id){
        this.setState({loading:true})
        if(this.storageLoaded(props)){
          this.setData(props);
        }
      }
    }

  componentWillMount(){
    if(!this.props.unitsActive){
      this.props.storageHelpUnitsStart();
    }
    if(!this.props.suppliersActive){
      this.props.storageHelpSuppliersStart();
    }
    if(!this.props.invoiceItemsActive){
      this.props.storageHelpInvoiceItemsStart();
    }
    if(!this.props.supplierInvoicesActive){
      this.props.storageHelpSupplierInvoicesStart();
    }
    if(!this.props.storedItemsLoaded){
      this.props.storageHelpStoredItemsStart();
    }
    if(this.storageLoaded(this.props)){
      this.setData(this.props);
    };
  }

  fetchInvoiceItems(){
    this.setState({invoiceItems:this.props.invoiceItems.filter((item)=>item.invoice===this.props.match.params.id)});
  }

  setData(props){
    let units=toSelArr(props.units);
    let suppliers=toSelArr(props.suppliers);
    let invoiceItems=props.invoiceItems.filter((item)=>item.invoice===props.match.params.id);
    let supplierInvoice=props.supplierInvoices.find((item)=>item.id===props.match.params.id);
    let date=new Date().toISOString();
    if(supplierInvoice.date){
       date = new Date(supplierInvoice.date).toISOString();
    }
    date=date.substring(0,date.indexOf('.'));
    this.setState({
        units,
        suppliers,
        invoiceItems,
        loading:false,
        identifier:supplierInvoice.identifier,
        supplier:suppliers.find((supplier)=>supplier.id===supplierInvoice.supplier),
        date,
        note:supplierInvoice.note
      })
  }

  render(){
    return (

      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
          {
            this.state.loading &&
            <Alert color="success">
              Loading data...
            </Alert>
          }
          <FormGroup>
            <Label for="name">Invoice indetifier</Label>
            <Input type="text" name="identifier" id="identifier" placeholder="Enter identifier" value={this.state.identifier} onChange={(e)=>this.setState({identifier:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="name">Supplier</Label>
              <Select
                value={this.state.supplier}
                styles={selectStyle}
                onChange={(supplier)=>this.setState({supplier})}
                options={this.state.suppliers}
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
          addItem={(newItem)=>{
            rebase.addToCollection('/help-invoice_items', {
              title:newItem.title,
              unit:newItem.unit,
              quantity:parseFloat(newItem.quantity),
              price:parseFloat(newItem.price),
              sn:newItem.sn,
              invoice:this.props.match.params.id
            }).then((response)=>{
              this.fetchInvoiceItems();
              rebase.addToCollection('/help-stored_items', {
                invoiceItem:response.id,
                quantity:parseFloat(newItem.quantity),
              });
            });
          }}
          deleteItem={(id)=>{
            rebase.removeDoc('/help-invoice_items/'+id).then(()=>{
              this.fetchInvoiceItems();
                let data=this.props.storedItems.find((item)=>item.invoiceItem===id);
                if(data.length===1){
                  rebase.removeDoc('/help-stored_items/'+data[0].id);
                }
          });
          }}
          editItem={(newItem)=>{
            let quantityDifference=newItem.quantity-this.state.invoiceItems.find((item)=>item.id===newItem.id).quantity;
            rebase.updateDoc('/help-invoice_items/'+newItem.id, {
              title:newItem.title,
              unit:newItem.unit,
              quantity:parseFloat(newItem.quantity),
              price:parseFloat(newItem.price),
              sn:newItem.sn
            }).then((response)=>{
              this.fetchInvoiceItems();
                let data=this.props.storedItems.find((item)=>item.invoiceItem===newItem.id);
                if(data.length===1){
                  rebase.updateDoc('/help-stored_items/'+data[0].id, {quantity:data[0].quantity+quantityDifference});
              }
          })}}
          disabled={this.state.saving||this.state.loading}
          newItemID={this.state.newItemID}
          />

        <div className="row">
            <Button className="btn" disabled={this.state.saving||this.state.loading||this.state.supplier===undefined} onClick={()=>{
                this.setState({saving:true});
                rebase.updateDoc('/help-supplier_invoices/'+this.props.match.params.id, {supplier:this.state.supplier.id,identifier:this.state.identifier,note:this.state.note,date:this.state.date!==null?(new Date(this.state.date)).getTime():0})
                  .then((response)=>{
                    this.setState({ saving:false});
                  });
              }}>{this.state.saving?'Saving...':'Save supplier'}</Button>

            <Button className="btn-red m-l-5" disabled={this.state.saving} onClick={()=>{
                  if(window.confirm("Are you sure?")){
                    this.state.invoiceItems.forEach((invoiceItem)=>{
                      rebase.removeDoc('/help-invoice_items/'+invoiceItem.id).then(()=>{
                          let data=this.props.storedItems.find((item)=>item.invoiceItem===invoiceItem.id);
                          if(data.length===1){
                            rebase.removeDoc('/help-stored_items/'+data[0].id);
                          }
                      });
                    });
                    rebase.removeDoc('/help-supplier_invoices/'+this.props.match.params.id).then(()=>{
                      this.props.history.goBack();
                    });
                  }
              }}>Delete</Button>
          </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageHelpUnits, storageHelpSuppliers, storageHelpInvoiceItems, storageHelpSupplierInvoices, storageHelpStoredItems }) => {
  const { unitsActive, units, unitsLoaded } = storageHelpUnits;
  const { suppliersActive, suppliers, suppliersLoaded } = storageHelpSuppliers;
  const { invoiceItemsActive, invoiceItems, invoiceItemsLoaded } = storageHelpInvoiceItems;
  const { supplierInvoicesActive, supplierInvoices, supplierInvoicesLoaded } = storageHelpSupplierInvoices;
  const { storedItemsActive, storedItems, storedItemsLoaded } = storageHelpStoredItems;
  return {
    unitsActive, units, unitsLoaded,
    suppliersActive, suppliers, suppliersLoaded,
    invoiceItemsActive, invoiceItems, invoiceItemsLoaded,
    supplierInvoicesActive, supplierInvoices, supplierInvoicesLoaded,
    storedItemsActive, storedItems, storedItemsLoaded,
   };
};

export default connect(mapStateToProps, { storageHelpUnitsStart, storageHelpSuppliersStart, storageHelpInvoiceItemsStart, storageHelpSupplierInvoicesStart,storageHelpStoredItemsStart })(SupplierInvoiceEdit);
