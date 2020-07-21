import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import {rebase} from '../../../index';
import Checkbox from '../../../components/checkbox';

import { connect } from "react-redux";
import {storageSmtpsStart} from '../../../redux/actions';
import {sameStringForms} from '../../../helperFunctions';

class SMTPEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      loading:true,
      saving:false,
      smtps:[],
      isDefault:false,
      showPass:false,

      title:'',
      host: "",
      port: 465,
      secure: true,
      user: '',
      pass: '',
      rejectUnauthorized: false,
      def:false,
    }
    this.setData.bind(this);
  }

  canSave(){
    return this.state.title!=='' &&
      this.state.host!=='' &&
      this.state.port!=='' &&
      this.state.user!=='' &&
      this.props.smtpsLoaded
  }

  componentWillReceiveProps(props){
    if(!sameStringForms(props.smtps,this.props.smtps)){
      this.setState({smtps:props.smtps})
    }
    if(!this.props.smtpsLoaded && props.smtpsLoaded){
      this.setData(props.smtps,props.match.params.id);
    }
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      if(props.smtpsLoaded){
        this.setData(props.smtps,props.match.params.id);
      }
    }
  }

  componentWillMount(){
    if(!this.props.smtpsActive){
      this.props.storageSmtpsStart();
    }
    if(this.props.smtpsLoaded){
      this.setData(this.props.smtps,this.props.match.params.id);
    }
  }

  setData(smtps,id){
    let smtp=smtps.find((item)=>item.id===id);
    this.setState({
      loading:false,
      smtps,
      isDefault:smtp.def,
      showPass:false,

      title: smtp.title,
      host: smtp.host ,
      port: smtp.port ,
      secure: smtp.secure ,
      user: smtp.user ,
      pass: smtp.pass ,
      rejectUnauthorized: smtp.rejectUnauthorized,
      def:smtp.def,
      })
  }

  render(){
    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
        {
          this.state.loading &&
          <Alert color="success">
            Loading data...
          </Alert>
        }

        <Checkbox
          className = "m-b-5 p-l-0"
          value = { this.state.def }
          onChange={()=>{
            this.setState({def:!this.state.def})
          }}
          label = "Default"
          />

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
        <Checkbox
          className = "m-b-5 p-l-0"
          value = { this.state.secure }
          onChange={()=>{
            this.setState({secure:!this.state.secure})
          }}
          label = "Secure"
          />
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
        <Checkbox
          className = "m-b-5 p-l-0"
          value = { this.state.rejectUnauthorized }
          onChange={()=>{
            this.setState({rejectUnauthorized:!this.state.rejectUnauthorized})
          }}
          label = "Reject unauthorized"
          />

        <div className="row">
            <Button className="btn" disabled={this.state.saving|| !this.canSave()} onClick={()=>{
              this.setState({saving:true});
              rebase.updateDoc('/smtps/'+this.props.match.params.id, {
                title:this.state.title,
                host:this.state.host ,
                port:this.state.port ,
                secure:this.state.secure ,
                user:this.state.user ,
                pass:this.state.pass ,
                rejectUnauthorized:this.state.rejectUnauthorized ,
                def:this.state.def,
              }).then((response)=>{
                if(this.state.def && !this.state.isDefault){
                  this.state.smtps.filter((smtp)=>smtp.id!==this.props.match.params.id && smtp.def).forEach((item)=>{
                    rebase.updateDoc('/smtps/'+item.id,{def:false})
                  })
                }
                this.setState({saving:false});
              });
            }}>{this.state.saving?'Saving SMTP...':'Save SMTP'}</Button>

          <Button className="btn-red m-l-5" disabled={this.state.saving} onClick={()=>{
              if(window.confirm("Are you sure?")){
                rebase.removeDoc('/smtps/'+this.props.match.params.id).then(()=>{
                  this.props.history.goBack();
                });
              }
              }}>Delete</Button>
          </div>
        </div>
    );
  }
}

const mapStateToProps = ({ storageSmtps }) => {
  const { smtpsActive, smtps, smtpsLoaded } = storageSmtps;
  return { smtpsActive, smtps, smtpsLoaded };
};

export default connect(mapStateToProps, { storageSmtpsStart })(SMTPEdit);
