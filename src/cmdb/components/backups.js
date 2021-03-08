import React, { Component } from 'react';
import { Button, Label, Input } from 'reactstrap';
import {calculateTextAreaHeight} from '../../helperFunctions';
import BackupList from './backupList';


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
      <div>

        {
          this.props.items.map((item,index)=>
          <div key={item.id} >
              <Label>
                <div dangerouslySetInnerHTML ={{__html:this.props.label}}/>
              </Label>

            <div className="flex">
              <Input
                className="no-scrolling"
                style={{height: item.id === this.state.editID ? this.state.editTextHeight : item.textHeight, /*width: this.props.width ? 958-this.props.width-20 : 150*/}}
                type="textarea"
                value={
                  item.id === this.state.editID
                    ? this.state.editText
                    : item.text
                  }
                  onBlur={() => {
                    let body={
                      text:this.state.editText,
                      id:this.state.editID,
                      fake:this.state.editFake,
                      textHeight:this.state.editTextHeight
                    }
                    let newData = [...this.props.items];
                    newData[index]=body;
                    this.props.onChange(newData);
                    this.setState({ editID: null, });
                  }}
                  onFocus={() => {
                    this.setState({
                      editText:item.text,
                      editFake:item.fake,
                      editID:item.id,
                      editTextHeight:item.textHeight
                    });
                  }}
                  onChange={e =>{
                    this.setState({ editText: e.target.value, editTextHeight:calculateTextAreaHeight(e) })}
                  }
                  />
            </div>

            {false &&
                <BackupList id={item.id} items={item.backupList?item.backupList:[]}
                  onChange={(items)=>{
                    let newData = [...this.props.items];
                    newData[index].backupList=items;
                    this.props.onChange(newData);
                  }}
                />
            }
          {
            !item.def &&
           <Button className="btn-link" onClick={()=>{this.props.removeItem(item.id);}}>Remove</Button>
          }
          </div>
        )}
        <Button className="btn pull-right" onClick={()=>{this.props.onChange([{id:this.state.newID,text:"",textHeight:29,fake:true,backupList:[]},...this.props.items]);this.setState({newID:this.state.newID+1})}}>{this.props.addLabel}</Button>
        <div></div>
    </div>
    );
  }
}
