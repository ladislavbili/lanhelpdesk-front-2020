import React, { Component } from 'react';
import {rebase, database} from '../../index';
import { Button } from 'reactstrap';
import {toSelArr,snapshotToArray} from '../../helperFunctions';

import ViewPassword from './viewPassword';
import EditPassword from './editPassword';

import classnames from "classnames";

export default class ContainerViewEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      openView: true,

      folders:[],
      displayPasswordConfirm:false,
      displayPassword:false,
      passwordConfirm:'',
      folder:null,
      title:'',
      login:'',
      URL:'',
      password:'',
      expire:'',
      note:'',
    }
    this.setData.bind(this);
    this.getData.bind(this);
    this.updateData.bind(this);
    this.getData(this.props.match.params.passID);
  }

  getData(id){
    Promise.all([
      rebase.get('pass-passwords/'+id, {
        context: this,
      }),
      database.collection('pass-folders').get()
    ])
    .then(([pass,folders])=>{
      this.setData(pass,toSelArr(snapshotToArray(folders)));
    });
  }

  setData(pass, folders){
    let folder=folders.find((item)=>item.id=== pass.folder);
    if(folder===undefined){
        folder=null;
      }
    this.setState({
      folders,
      passwordConfirm:pass.password,
      folder,
      title:pass.title,
      login:pass.login,
      URL:pass.URL,
      password:pass.password,
      expire:pass.expire,
      note:pass.note,
      loading:false,

      openView: true,
    });
  }

  updateData(pass){
    this.setData(pass, this.state.folders);
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.passID !== props.match.params.passID){
      this.getData(props.match.params.passID);
    }
  }

  render(){
    return (
      <div className="flex">
          <div className={classnames("p-2", {"commandbar-small": this.props.columns}, {"commandbar": !this.props.columns})}>
            <div className="d-flex flex-row align-items-center p-l-18">
              <Button className="btn btn-link-reversed" onClick={() => {this.setState({openView: !this.state.openView})}}>{this.state.openView ? "Show edit" : "Show overview"}</Button>
            </div>
          </div>

        <div className="flex">

          {this.state.openView &&
            <ViewPassword {...this.props} password={{id: this.props.match.params.passID, ...this.state}} />
          }

          {!this.state.openView &&
            <EditPassword {...this.props} folders={this.state.folders} password={{id: this.props.match.params.passID, ...this.state}} updateData={this.updateData.bind(this)}/>
          }

        </div>
      </div>
    );
  }
}
