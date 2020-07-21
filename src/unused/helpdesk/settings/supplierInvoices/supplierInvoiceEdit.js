import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import Select from 'react-select';
import InvoiceItems from './invoiceItems';
import {rebase, database} from '../../../index';
import {toSelArr, snapshotToArray} from '../../../helperFunctions';
import {selectStyle} from "configs/components/select";

export default class SupplierInvoiceAdd extends Component{
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
    this.fetchData.bind(this);
    this.fetchInvoiceItems.bind(this);
    this.setData.bind(this);
    this.fetchData(this.props.match.params.id);
  }

  fetchInvoiceItems(){
    database.collection('help-invoice_items').where("invoice", "==", this.props.match.params.id).get().then((response)=>{
      this.setState({invoiceItems:snapshotToArray(response)});
    })
  }

  fetchData(id){
    Promise.all([
    database.collection('help-units').get(),
    database.collection('help-suppliers').get(),
    database.collection('help-invoice_items').where("invoice", "==", id).get(),
    rebase.get('help-supplier_invoices/'+id, {
      context: this
    })
    ])
    .then(([units,suppliers,invoiceItems,supplierInvoice])=>this.setData(toSelArr(snapshotToArray(units)),toSelArr(snapshotToArray(suppliers)),snapshotToArray(invoiceItems),supplierInvoice));
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      this.fetchData(props.match.params.id);
    }
  }

  setData(units,suppliers,invoiceItems, supplierInvoice){
    let date=new Date().toISOString();
    if(supplierInvoice.date){
       date = new Date(supplierInvoice.date).toISOString();
    }
    date=date.substring(0,date.indexOf('.'));
    this.setState({units,suppliers, invoiceItems,loading:false, identifier:supplierInvoice.identifier,supplier:suppliers.find((supplier)=>supplier.id===supplierInvoice.supplier),date,note:supplierInvoice.note})
  }

  render(){
    return (

      <div className="full-height card-box scrollable fit-with-header-and-commandbar">
        <div className="m-t-20">
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
              database.collection('help-stored_items').where("invoiceItem", "==", id).get().then((item)=>{
                let data=snapshotToArray(item);
                if(data.length===1){
                  rebase.removeDoc('/help-stored_items/'+data[0].id);
                }
              })
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
              database.collection('help-stored_items').where("invoiceItem", "==", newItem.id).get().then((item)=>{
                let data=snapshotToArray(item);
                if(data.length===1){
                  rebase.updateDoc('/help-stored_items/'+data[0].id, {quantity:data[0].quantity+quantityDifference});
              }
            });
          })}}
          disabled={this.state.saving||this.state.loading}
          newItemID={this.state.newItemID}
          />
        
        <Button className="btn" disabled={this.state.saving||this.state.loading||this.state.supplier===undefined} onClick={()=>{
            this.setState({saving:true});
            rebase.updateDoc('/help-supplier_invoices/'+this.props.match.params.id, {supplier:this.state.supplier.id,identifier:this.state.identifier,note:this.state.note,date:this.state.date!==null?(new Date(this.state.date)).getTime():0})
              .then((response)=>{
                this.setState({ saving:false});
              });
          }}>{this.state.saving?'Saving...':'Save supplier'}</Button>
        <Button className="btn-link" disabled={this.state.saving} onClick={()=>{
              if(window.confirm("Are you sure?")){
                this.state.invoiceItems.forEach((invoiceItem)=>{
                  rebase.removeDoc('/help-invoice_items/'+invoiceItem.id).then(()=>{
                    database.collection('help-stored_items').where("invoiceItem", "==", invoiceItem.id).get().then((item)=>{
                      let data=snapshotToArray(item);
                      if(data.length===1){
                        rebase.removeDoc('/help-stored_items/'+data[0].id);
                      }
                    })
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
