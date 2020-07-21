import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import {rebase, database} from '../../../index';
import {snapshotToArray} from '../../../helperFunctions';


export default class SMTPAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      host: "",
      port: 465,
      secure: true,
      user: '',
      pass: '',
      rejectUnauthorized: false,
      def:false,

      saving:false,
      showPass:false
    }
  }

  canSave(){
    return this.state.title!=='' &&
      this.state.host!=='' &&
      this.state.port!=='' &&
      this.state.user!==''
  }

  render(){
    return (
      <div className="full-height card-box scrollable fit-with-header-and-commandbar">
        <div className="m-t-20">

        <FormGroup check className="m-b-5">
          <Input type="checkbox" id="defCheck" checked={this.state.def} onChange={(e)=>this.setState({def:!this.state.def})}/>
          <Label htmlFor="defCheck" check>
            Default
          </Label>
        </FormGroup>

        <FormGroup>
          <Label for="name">Title</Label>
          <Input type="text" name="name" id="name" placeholder="Enter title" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
        </FormGroup>
        <FormGroup>
          <Label for="name">Host</Label>
          <Input type="text" name="name" id="host" placeholder="Enter host" value={this.state.host} onChange={(e)=>this.setState({host:e.target.value})} />
        </FormGroup>
        <FormGroup>
          <Label for="name">Port</Label>
          <Input type="number" name="name" id="port" placeholder="Enter port" value={this.state.port} onChange={(e)=>this.setState({port:e.target.value})} />
        </FormGroup>
        <FormGroup check className="m-b-5">
          <Input type="checkbox" id="checkSec" checked={this.state.secure} onChange={(e)=>this.setState({secure:!this.state.secure})}/>
          <Label htmlFor="checkSec" check>
            Secure
          </Label>
        </FormGroup>
        <FormGroup>
          <Label for="name">Username</Label>
          <Input type="text" name="name" id="user" placeholder="Enter user" value={this.state.user} onChange={(e)=>this.setState({user:e.target.value})} />
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <InputGroup>
            <Input type={this.state.showPass?'text':"password"} className="from-control" placeholder="Enter password" value={this.state.pass} onChange={(e)=>this.setState({pass:e.target.value})} />
            <InputGroupAddon addonType="append" className="clickable" onClick={()=>this.setState({showPass:!this.state.showPass})}>
              <InputGroupText>
                <i className={"mt-auto mb-auto "+ (!this.state.showPass ?'fa fa-eye':'fa fa-eye-slash')}/>
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>
        <FormGroup check className="m-b-5">
          <Input type="checkbox" id="checkAuth" checked={this.state.rejectUnauthorized} onChange={(e)=>this.setState({rejectUnauthorized:!this.state.rejectUnauthorized})}/>
          <Label htmlFor="checkAuth" check>
            Reject unauthorized
          </Label>
        </FormGroup>

        <Button className="btn" disabled={this.state.saving || !this.canSave()} onClick={()=>{
            this.setState({saving:true});
            Promise.all([database.collection('smtps').get(),
            rebase.addToCollection('/smtps', {
              title:this.state.title,
              host:this.state.host ,
              port:this.state.port ,
              secure:this.state.secure ,
              user:this.state.user ,
              pass:this.state.pass ,
              rejectUnauthorized:this.state.rejectUnauthorized ,
              def:this.state.def,
            })])
              .then(([smtps,response])=>{
                if(this.state.def){
                  snapshotToArray(smtps).filter((smtp)=>smtp.id!==response.id && smtp.def).forEach((item)=>{
                    rebase.updateDoc('/smtps/'+item.id,{def:false})
                  })
                }
                this.setState({
                  title:'',
                  host: "",
                  port: 465,
                  secure: true,
                  user: '',
                  pass: '',
                  rejectUnauthorized: false,
                  def:false,
                  saving:false
                })
              });
          }}>{this.state.saving?'Adding...':'Add SMTP'}</Button>
        </div>
    </div>
    );
  }
}
