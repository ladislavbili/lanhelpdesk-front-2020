import React, { Component } from 'react';
import { Input} from 'reactstrap';
import {rebase,database} from '../../../index';
import {snapshotToArray} from '../../../helperFunctions';

import "../../../scss/unused/CRMMertel.scss";

export default class Subtasks extends Component{
  constructor(props){
    super(props);
    this.state={
      newSubtask:'',
      subtasks:[],
      editedSubtaskTitle:'',
      focusedSubtask:null,
    }
    this.submitSubtask.bind(this);
    this.deleteSubtask.bind(this);
    this.getData.bind(this);
    this.getData(this.props.id);
  }

  getData(id){
      database.collection('proj-subtasks').where("task", "==", id).get()
    .then((subtasks)=>{
      this.setState({subtasks:snapshotToArray(subtasks)})
    });
  }

  canSave(){
    return this.state.title!=='' && this.state.project!==null && !this.state.loading
  }

  deleteSubtask(id){
    if(window.confirm("Are you sure?")){
      rebase.removeDoc('proj-subtasks/'+id).then(()=>{this.getData(this.props.id )})
    }
  }

  submitSubtask(){
    if(this.state.newSubtask===''){
      return;
    }
    this.setState({saving:true});
    let body={
      done:false,
      title:this.state.newSubtask,
      task:this.props.id
    }
    rebase.addToCollection('/proj-subtasks',body).then(()=>{this.setState({saving:false,newSubtask:''});this.getData(this.props.id)})
  }

  render(){
    return (
      <div>
        <table className="table table-borderless">
          <thead>
            <tr>
              <th colSpan={3} style={{paddingLeft: 40}}>Subtasks</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.subtasks.map((item,index)=>
              <tr key={item.id}>
                <td className="table-checkbox">
                  <label className="custom-container">
                    <Input type="checkbox"
                      checked={item.done}
                      onChange={()=>{
                      let newData=[...this.state.subtasks];
                      newData[index].done=!newData[index].done;
                      rebase.updateDoc('proj-subtasks/'+item.id,{done:item.done});
                      this.setState({subtasks:newData});
                    }} />
                    <span className="checkmark"> </span>
                  </label>
                </td>
                <td>
                  <Input
                      type="text"
                      className="input"
                      style={{borderRadius: "3px", marginLeft: "-40px"}}
                      value={this.state.focusedSubtask===item.id?this.state.editedSubtaskTitle:item.title}
                      onBlur={() => {
                      rebase.updateDoc('proj-subtasks/'+item.id,{title:this.state.editedSubtaskTitle});
                      let newSubtasks=[...this.state.subtasks];
                      newSubtasks[index].title=this.state.editedSubtaskTitle;
                      this.setState({ focusedSubtask: null, subtasks:newSubtasks });
                      }}
                      onFocus={() => {
                        this.setState({
                          editedSubtaskTitle: item.title,
                          focusedSubtask: item.id
                        });
                      }}
                      onChange={e =>{
                        this.setState({ editedSubtaskTitle: e.target.value })}
                      }/>
                </td>
                <td className="w-20px">
                  <button
                    className="btn-link"
                    type="button"
                    onClick={()=>this.deleteSubtask(item.id)}
                    >
                    X
                  </button>
                </td>
              </tr>
            )
          }
            <tr>
              <td>
              </td>
              <td >
                <Input
                  type="text"
                  style={{marginLeft: "-40px"}}
                  className="input-visible"
                  value={this.state.newSubtask}
                  onChange={(e)=>this.setState({newSubtask:e.target.value})} />
              </td>
              <td>
                <button
                  className="btn"
                  type="button"
                  onClick={this.submitSubtask.bind(this)}
                >
                  +
                </button>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    );
  }
}
