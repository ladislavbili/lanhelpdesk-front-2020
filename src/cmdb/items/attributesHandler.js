import React, { Component } from 'react';
import { Input, Label } from 'reactstrap';
import Select from 'react-select';
import {selectStyle} from "configs/components/select";

export default class AttributesHandler extends Component{
  constructor(props){
    super(props);
    this.state={
      editID:null,
      editValue:''
    }
    this.drawAttribute.bind(this);

  }

  drawAttribute(attribute){
    switch (attribute.type.id) {
      case 'input':{
        return <Input type="text" value={this.props.values[attribute.id]} onChange={(e)=>this.props.setValue(attribute.id,e.target.value)}/>
      }
      case 'textarea':{
        return <Input type="textarea" value={this.props.values[attribute.id]} onChange={(e)=>this.props.setValue(attribute.id,e.target.value)}/>
      }
      case 'select':{
        return <Select options={attribute.options}  value={this.props.values[attribute.id]} styles={selectStyle} onChange={(item)=>this.props.setValue(attribute.id,item)} />
      }
      default:
        return <p>{attribute.type.id} of {attribute.title}</p>
    }
  }

  render(){
    return (
      <div className="m-t-10">
        {
          this.props.attributes.sort((item1,item2)=>item1.order-item2.order).map((item)=>
          <div key={item.id} className="row m-b-10 col-lg-6 cmdb-selects-info">
            <div className="w-30">
              <Label>{item.title.length > 0 ? item.title : "Untitled"}:</Label>
            </div>
            <div className="flex">
              {this.drawAttribute(item)}
            </div>
          </div>
        )}
      </div>
    );
  }
}
