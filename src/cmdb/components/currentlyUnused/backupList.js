import React, { Component } from 'react';
import { Input } from 'reactstrap';
import {calculateTextAreaHeight} from '../../helperFunctions';


export default class BackupList extends Component{
  constructor(props){
    super(props);
    this.state={
      editTitle:'',
      editTitleHeight:29,
      editServer:'',
      editServerHeight:29,
      editTool:'',
      editToolHeight:29,
      editWhat:'',
      editWhatHeight:29,
      editWhere:'',
      editWhereHeight:29,
      editWhen:'',
      editWhenHeight:29,
      editLength:'',
      editLengthHeight:29,
      editRotation:'',
      editRotationHeight:29,
      editItemID: null,
      editItemIDHeight:29,

      newTitle:'',
      newTitleHeight:29,
      newServer:'',
      newServerHeight:29,
      newTool:'',
      newToolHeight:29,
      newWhat:'',
      newWhatHeight:29,
      newWhere:'',
      newWhereHeight:29,
      newWhen:'',
      newWhenHeight:29,
      newLength:'',
      newLengthHeight:29,
      newRotation:'',
      newRotationHeight:29,
      newItemID:0,
      newItemIDHeight:29,
    }

  }

  onBlur(item,index){
    let body={
      title:this.state.editTitle,
      server:this.state.editServer,
      tool:this.state.editTool,
      what:this.state.editWhat,
      where:this.state.editWhere,
      when:this.state.editWhen,
      length:this.state.editLength,
      rotation:this.state.editRotation,

      titleHeight:this.state.editTitleHeight,
      serverHeight:this.state.editServerHeight,
      toolHeight:this.state.editToolHeight,
      whatHeight:this.state.editWhatHeight,
      whereHeight:this.state.editWhereHeight,
      whenHeight:this.state.editWhenHeight,
      lengthHeight:this.state.editLengthHeight,
      rotationHeight:this.state.editRotationHeight,
    }
    let newData = [...this.props.items];
    newData[index]=body;
    this.props.onChange(newData);
    this.setState({ editItemID: null });
  }

  onFocus(item,index){
    this.setState({
      editTitle:item.title,
      editServer:item.server,
      editTool:item.tool,
      editWhat:item.what,
      editWhere:item.where,
      editWhen:item.when,
      editLength:item.length,
      editRotation:item.rotation,
      editItemID:item.id,

      editTitleHeight:item.titleHeight?item.titleHeight:29,
      editServerHeight:item.serverHeight?item.serverHeight:29,
      editToolHeight:item.toolHeight?item.toolHeight:29,
      editWhatHeight:item.whatHeight?item.whatHeight:29,
      editWhereHeight:item.whereHeight?item.whereHeight:29,
      editWhenHeight:item.whenHeight?item.whenHeight:29,
      editLengthHeight:item.lengthHeight?item.lengthHeight:29,
      editRotationHeight:item.rotationHeight?item.rotationHeight:29
    });
  }

  render(){
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Tool</th>
            <th>What</th>
            <th>Where</th>
            <th>When</th>
            <th>Time</th>
            <th>Rotation</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="no-scrolling backupList">
          { this.props.items.map((item,index)=>
            <tr key={index}>
              <td>
                <Input
                  className="hidden-input"
                  type="textarea"
                  style={{height:item.id===this.state.editItemID?this.state.editTitleHeight:(item.titleHeight?item.titleHeight:29)}}
                  value={
                    item.id === this.state.editItemID
                      ? this.state.editTitle
                      : item.title
                    }
                    onBlur={()=>this.onBlur(item,index)}
                    onFocus={() => this.onFocus(item,index)}
                    onChange={e =>{
                      this.setState({ editTitle: e.target.value, editTitleHeight:calculateTextAreaHeight(e)  })}
                    }
                    />
              </td>
              <td>
                <Input
                  className="hidden-input"
                  type="textarea"
                  style={{height:item.id===this.state.editItemID?this.state.editToolHeight:(item.toolHeight?item.toolHeight:29)}}
                  value={
                    item.id === this.state.editItemID
                      ? this.state.editTool
                      : item.tool
                    }
                    onBlur={()=>this.onBlur(item,index)}
                    onFocus={() => this.onFocus(item,index)}
                    onChange={e =>{
                      this.setState({ editTool: e.target.value, editToolHeight:calculateTextAreaHeight(e)  })}
                    }
                    />
              </td>
              <td>
                <Input
                  className="hidden-input"
                  type="textarea"
                  style={{height:item.id===this.state.editItemID?this.state.editWhatHeight:(item.whatHeight?item.whatHeight:29)}}
                  value={
                    item.id === this.state.editItemID
                      ? this.state.editWhat
                      : item.what
                    }
                    onBlur={()=>this.onBlur(item,index)}
                    onFocus={() => this.onFocus(item,index)}
                    onChange={e =>{
                      this.setState({ editWhat: e.target.value, editWhatHeight:calculateTextAreaHeight(e)  })}
                    }
                    />
              </td>
              <td>
                <Input
                  className="hidden-input"
                  type="textarea"
                  style={{height:item.id===this.state.editItemID?this.state.editWhereHeight:(item.whereHeight?item.whereHeight:29)}}
                  value={
                    item.id === this.state.editItemID
                      ? this.state.editWhere
                      : item.where
                    }
                    onBlur={()=>this.onBlur(item,index)}
                    onFocus={() => this.onFocus(item,index)}
                    onChange={e =>{
                      this.setState({ editWhere: e.target.value, editWhereHeight:calculateTextAreaHeight(e)  })}
                    }
                    />
              </td>
              <td>
                <Input
                  className="hidden-input"
                  type="textarea"
                  style={{height:item.id===this.state.editItemID?this.state.editWhenHeight:(item.whenHeight?item.whenHeight:29)}}
                  value={
                    item.id === this.state.editItemID
                      ? this.state.editWhen
                      : item.when
                    }
                    onBlur={()=>this.onBlur(item,index)}
                    onFocus={() => this.onFocus(item,index)}
                    onChange={e =>{
                      this.setState({ editWhen: e.target.value, editWhenHeight:calculateTextAreaHeight(e)  })}
                    }
                    />
              </td>
              <td>
                <Input
                  className="hidden-input"
                  type="textarea"
                  style={{height:item.id===this.state.editItemID?this.state.editLengthHeight:(item.lengthHeight?item.lengthHeight:29)}}
                  value={
                    item.id === this.state.editItemID
                      ? this.state.editLength
                      : item.length
                    }
                    onBlur={()=>this.onBlur(item,index)}
                    onFocus={() => this.onFocus(item,index)}
                    onChange={e =>{
                      this.setState({ editLength: e.target.value, editLengthHeight:calculateTextAreaHeight(e)  })}
                    }
                    />
              </td>
              <td>
                <Input
                  type="textarea"
                  className="hidden-input"
                  style={{height:item.id===this.state.editItemID?this.state.editRotationHeight:(item.rotationHeight?item.rotationHeight:29)}}
                  value={
                    item.id === this.state.editItemID
                      ? this.state.editRotation
                      : item.rotation
                    }
                    onBlur={()=>this.onBlur(item,index)}
                    onFocus={() => this.onFocus(item,index)}
                    onChange={e =>{
                      this.setState({ editRotation: e.target.value, editRotationHeight:calculateTextAreaHeight(e)  })}
                    }
                    />
              </td>
              <td>
                <button className="btn btn-link waves-effect"
                  onClick={()=>{
                    if(window.confirm('Are you sure?')){
                      let newData = [...this.props.items];
                      newData.splice(index,1);
                      this.props.onChange(newData);
                    }
                  }}
                  >
                  <i className="fa fa-times" />
                </button>
              </td>
            </tr>
            )
          }
          <tr>
            <td>
              <Input
                type="textarea"
                value={this.state.newTitle}
                onChange={(e)=>{this.setState({newTitle:e.target.value, newTitleHeight:calculateTextAreaHeight(e)});}}
                className="form-control"
                id="inlineFormInput"
                placeholder=""
                style={{ height: this.state.newTitleHeight }}
                />
            </td>
            <td>
              <Input
                type="textarea"
                value={this.state.newTool}
                onChange={(e)=>this.setState({newTool:e.target.value, newToolHeight:calculateTextAreaHeight(e)})}
                className="form-control"
                id="inlineFormInput"
                placeholder=""
                style={{ height: this.state.newToolHeight }}
                />
            </td>
            <td>
              <Input
                type="textarea"
                value={this.state.newWhat}
                onChange={(e)=>this.setState({newWhat:e.target.value, newWhatHeight:calculateTextAreaHeight(e)})}
                className="form-control"
                id="inlineFormInput"
                placeholder=""
                style={{ height: this.state.newWhatHeight }}
                />
            </td>
            <td>
              <Input
                type="textarea"
                value={this.state.newWhere}
                onChange={(e)=>this.setState({newWhere:e.target.value, newWhereHeight:calculateTextAreaHeight(e)})}
                className="form-control"
                id="inlineFormInput"
                placeholder=""
                style={{ height: this.state.newWhereHeight }}
                />
            </td>
            <td>
              <Input
                type="textarea"
                value={this.state.newWhen}
                onChange={(e)=>this.setState({newWhen:e.target.value, newWhenHeight:calculateTextAreaHeight(e)})}
                className="form-control"
                id="inlineFormInput"
                placeholder=""
                style={{ height: this.state.newWhenHeight }}
                />
            </td>
            <td>
              <Input
                type="textarea"
                value={this.state.newLength}
                onChange={(e)=>this.setState({newLength:e.target.value, newLengthHeight:calculateTextAreaHeight(e)})}
                className="form-control"
                id="inlineFormInput"
                placeholder=""
                style={{ height: this.state.newLengthHeight }}
                />
            </td>
            <td>
              <Input
                type="textarea"
                value={this.state.newRotation}
                onChange={(e)=>this.setState({newRotation:e.target.value, newRotationHeight:calculateTextAreaHeight(e)})}
                className="form-control"
                id="inlineFormInput"
                placeholder=""
                style={{ height: this.state.newRotationHeight }}
                />
            </td>
            <td>
              <button className="btn btn-link waves-effect"
                disabled={this.state.newIP===''}
                onClick={()=>{
                  let body={
                    title:this.state.newTitle,
                    server:this.state.newServer,
                    tool:this.state.newTool,
                    what:this.state.newWhat,
                    where:this.state.newWhere,
                    when:this.state.newWhen,
                    length:this.state.newLength,
                    rotation:this.state.newRotation,
                    titleHeight:this.state.newTitleHeight,
                    serverHeight:this.state.newServerHeight,
                    toolHeight:this.state.newToolHeight,
                    whatHeight:this.state.newWhatHeight,
                    whereHeight:this.state.newWhereHeight,
                    whenHeight:this.state.newWhenHeight,
                    lengthHeight:this.state.newLengthHeight,
                    rotationHeight:this.state.newRotationHeight,
                    id:this.state.newItemID,
                    fake:true
                  }
                  this.setState({
                    newTitle:'',
                    newServer:'',
                    newTool:'',
                    newWhat:'',
                    newWhere:'',
                    newWhen:'',
                    newLength:'',
                    newRotation:'',
                    newTitleHeight:29,
                    newServerHeight:29,
                    newToolHeight:29,
                    newWhatHeight:29,
                    newWhereHeight:29,
                    newWhenHeight:29,
                    newLengthHeight:29,
                    newRotationHeight:29,
                    newItemID:this.state.newItemID+1
                  });

                  this.props.onChange([...this.props.items,body]);
                  }
                }
                >
                <i className="fa fa-plus" />
              </button>
            </td>

          </tr>
        </tbody>

      </table>
    );
  }
}
