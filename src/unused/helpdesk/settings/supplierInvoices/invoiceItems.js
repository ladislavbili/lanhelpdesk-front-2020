import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Select from 'react-select';
import {selectStyle} from "configs/components/select";

export default class InvoiceItems extends Component{
  constructor(props){
    super(props);
    this.state={
      addOpened:false,
      editedID:null,
      editOpened:false,
      title:'',
      unit:null,
      quantity:0,
      price:0,
      sn:''
    }
  }

  render(){
    return (
        <div className="container-padding bkg-white b-1 b-cl-form p-10  m-b-15 m-t-15">
          <table className="table">
            <thead>
              <tr>
                <th>Item name</th>
                <th>Unit</th>
                <th>Quantity</th>
                <th>Price (no TAX)</th>
                <th>SN</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.props.invoiceItems.map((item)=>
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{this.props.units.some((unit)=>unit.id===item.unit)?this.props.units.find((unit)=>unit.id===item.unit).title:'Unknown unit'}</td>
                  <td>{item.quantity}</td>
                  <td>{item.price}</td>
                  <td>{item.sn}</td>
                  <td>
                    <Button className="btn-link" onClick={()=>{
                        this.setState({
                          editOpened:!this.state.editOpened,
                          editedID:item.id,
                          title:item.title,
                          unit:this.props.units.some((unit)=>unit.id===item.unit)?this.props.units.find((unit)=>unit.id===item.unit):null,
                          quantity:item.quantity,
                          price:item.price,
                          sn:item.sn,
                        });
                    }}>
                      <i className="fa fa-edit" />
                    </Button>
                    <Button className="btn-link" onClick={()=>{
                        if(window.confirm('Are you sure?')){
                            this.props.deleteItem(item.id);
                        }
                      }}>
                      <i className="fa fa-trash" /></Button>
                </td>
                </tr>
              )}
            </tbody>
          </table>

          <Button className="btn t-a-l" onClick={()=>this.setState({addOpened:!this.state.addOpened})} >Add invoice item</Button>

          <Modal isOpen={this.state.addOpened} toggle={()=>this.setState({addOpened:!this.state.addOpened})} >
              <ModalHeader toggle={()=>this.setState({addOpened:!this.state.addOpened})}></ModalHeader>
              <ModalBody>
              <div>
                <FormGroup>
                  <Label for="title">Name</Label>
                  <Input type="text" name="title" id="title" placeholder="Enter title" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label for="quantity">Quantity</Label>
                  <Input type="text" name="quantity" id="quantity" placeholder="Enter quantity" value={this.state.quantity} onChange={(e)=>this.setState({quantity:e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label for="unit">Unit</Label>
                  <Select
                    value={this.state.unit}
                    styles={selectStyle}
                    onChange={(unit)=>this.setState({unit})}
                    options={this.props.units}
                    />
                </FormGroup>
                <FormGroup>
                  <Label for="price">Price</Label>
                  <Input type="text" name="price" id="price" placeholder="Enter price" value={this.state.price} onChange={(e)=>this.setState({price:e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label for="sn">SN</Label>
                  <Input type="text" name="sn" id="sn" placeholder="Enter SN" value={this.state.sn} onChange={(e)=>this.setState({sn:e.target.value})} />
                </FormGroup>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button className="btn"
                disabled={this.props.disabled||this.state.unit===null}
                onClick={()=>{
                  this.props.addItem({id:this.props.newItemID,title:this.state.title,unit:this.state.unit.id,quantity:this.state.quantity,price:this.state.price,sn:this.state.sn});
                  this.setState({
                    addOpened:false,
                    title:'',
                    quantity:0,
                    price:0,
                    sn:''
                  });
                }}>Add
              </Button>

                <Button className="btn-link" onClick={()=>this.setState({addOpened:!this.state.addOpened})}>Close</Button>
              </ModalFooter>
            </Modal>

            <Modal isOpen={this.state.editOpened} toggle={()=>this.setState({editOpened:!this.state.editOpened})} >
              <ModalHeader toggle={()=>this.setState({editOpened:!this.state.editOpened})}></ModalHeader>
              <ModalBody>
              <div>
                <FormGroup>
                  <Label for="title">Name</Label>
                  <Input type="text" name="title" id="title" placeholder="Enter title" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label for="quantity">Quantity</Label>
                  <Input type="text" name="quantity" id="quantity" placeholder="Enter quantity" value={this.state.quantity} onChange={(e)=>this.setState({quantity:e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label for="unit">Unit</Label>
                  <Select
                    value={this.state.unit}
                    styles={selectStyle}
                    onChange={(unit)=>this.setState({unit})}
                    options={this.props.units}
                    />
                </FormGroup>
                <FormGroup>
                  <Label for="price">Price</Label>
                  <Input type="text" name="price" id="price" placeholder="Enter price" value={this.state.price} onChange={(e)=>this.setState({price:e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label for="sn">SN</Label>
                  <Input type="text" name="sn" id="sn" placeholder="Enter SN" value={this.state.sn} onChange={(e)=>this.setState({sn:e.target.value})} />
                </FormGroup>
              </div>
            </ModalBody>
            <ModalFooter>

              <Button className="btn" disabled={this.props.disabled||this.state.unit===null} onClick={()=>{
                  this.props.editItem({id:this.state.editedID,title:this.state.title,unit:this.state.unit.id,quantity:this.state.quantity,price:this.state.price,sn:this.state.sn});
                  this.setState({
                    editOpened:false,
                    title:'',
                    quantity:0,
                    price:0,
                    sn:''
                  });
                }}>Edit</Button>
              <Button className="btn-link" onClick={()=>this.setState({editOpened:!this.state.editOpened})}>Close</Button>
              </ModalFooter>
            </Modal>
      </div>
    );
  }
}
