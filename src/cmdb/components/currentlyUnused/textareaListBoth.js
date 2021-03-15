import React, { Component } from 'react';
import { Button, Input } from 'reactstrap';
import { calculateTextAreaHeight} from '../../helperFunctions';

export default class TextareaList extends Component{
  constructor(props){
    super(props);
    this.state={
      editID:null,
      editFake:null,
      editLabel:'',
      editLabelHeight:29,
      editText:'',
      editTextHeight:29,
      newID:0,
    }

    this.onFocus.bind(this);

  }

  onBlur(){
    let body={
      id:this.state.editID,
      fake:this.state.editFake,
      label:this.state.editLabel,
      labelHeight: this.state.editLabelHeight,
      text:this.state.editText,
      textHeight: this.state.editTextHeight,
    }
    let newData = [...this.props.items];
    newData[newData.findIndex((item)=>item.id===body.id)]=body;
    this.props.onChange(newData);
    this.setState({ editID: null });
  }

  onFocus(item){
    this.setState({
      editID: item.id,
      editFake: item.fake,
      editLabel: item.label,
      editLabelHeight: item.labelHeight,
      editText: item.text,
      editTextHeight: item.textHeight,
    });
  }

  render(){
    return (
      <div>
        {
          this.props.items.map((item)=>
          <div className="row" key={item.id} style={{marginBottom: "10px"}}>
            <div style={{width: (this.props.width ? this.props.width : 150)}}>
              <Input
                type="textarea"
                style={{height:item.id === this.state.editID?this.state.editLabelHeight:item.labelHeight}}
                value={item.id === this.state.editID
                  ? this.state.editLabel
                  : item.label}
                  onChange={e =>{
                  this.setState({
                    editLabel: e.target.value,
                    editLabelHeight: calculateTextAreaHeight(e),
                   })}}
                onBlur={this.onBlur.bind(this)}
                onFocus={()=>this.onFocus(item)}
                />
              </div>

          <div style={{width: this.props.width ? 1000-this.props.width-20 : 150}}>
            <Input
              type="textarea"
              style={{height:item.id === this.state.editID?this.state.editTextHeight:item.textHeight}}
              value={
                item.id === this.state.editID
                  ? this.state.editText
                  : item.text
                }
              onBlur={this.onBlur.bind(this)}
              onFocus={()=>this.onFocus(item)}
              onChange={e =>{
                this.setState({
                  editText: e.target.value,
                  editTextHeight: calculateTextAreaHeight(e),
                 });}
              }
              />
            </div>
            <div>
              <Button outline color="danger" size="sm" style={{border: "0px"}} onClick={()=>{this.props.removeItem(item.id);}}><i className="fa fa-times" style={{color: "rgb(178, 34, 34)"}} /></Button>
            </div>
          </div>
        )}
        <Button color="primary" onClick={()=>{
            this.props.onChange(
              [ ...this.props.items,
                {
                  id: this.state.newID,
                  fake:true,
                  text:"",
                  textHeight: 29,
                  label: '',
                  labelHeight: 29,
                }
            ]);
              this.setState({newID:this.state.newID+1})}}>{this.props.addLabel}</Button>

      </div>
    );
  }
}
