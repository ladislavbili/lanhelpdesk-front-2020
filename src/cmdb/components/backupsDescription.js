import React, { Component } from 'react';
import { Input } from 'reactstrap';
import {calculateTextAreaHeight} from '../../helperFunctions';


export default class Backups extends Component{
  constructor(props){
    super(props);
    this.state={
      editText:'',
      editID:null,
      editFake:null,
      newID:0,

      editTextHeight:29,
    }
  }

  render(){
    return (
        <div className="flex">
          <Input
            className="no-scrolling"
            style={{height: this.state.editText === "" ? this.props.item.textHeight : this.state.editTextHeight, /*width: this.props.width ? 958-this.props.width-20 : 150*/}}
            type="textarea"
            value={
              this.state.editText === ""
                ? this.props.item.text
                : this.state.editText
              }
              onBlur={() => {
                let body={
                  text:this.state.editText,
                  fake:this.state.editFake,
                  textHeight:this.state.editTextHeight
                }
                this.props.onChange(body);
                this.setState({ editText: "", });
              }}
              onFocus={() => {
                this.setState({
                  editText:this.props.item.text,
                  editFake:this.props.item.fake,
                  editTextHeight:this.props.item.textHeight
                });
              }}
              onChange={e =>{
                this.setState({ editText: e.target.value, editTextHeight:calculateTextAreaHeight(e) })}
              }
              />
        </div>
    );
  }
}
