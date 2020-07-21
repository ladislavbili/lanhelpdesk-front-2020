import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import Select from 'react-select';
import firebase from 'firebase';
import {rebase, database} from '../../../index';
import {snapshotToArray, isEmail} from '../../../helperFunctions';

import {selectStyle} from "configs/components/select";

export default class UserEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      username:'',
      name:'',
      surname:'',
      email:'',
      company:null,
      loading:true,
      saving:false,
      passReseted:false,
      passResetEnded:true,
      companies:[]
    }
    this.setData.bind(this);

    Promise.all(
      [
        database.collection('companies').get(),
        rebase.get('users/'+this.props.match.params.id, {
          context: this,
        })
    ]).then(([ companiesData,user])=>{
      let companies = snapshotToArray(companiesData);
      let company;
      if(companies.length===0){
        company=null;
      }else{
        company=companies.find((item)=>item.id===user.company);
        if(company){
          company= {...company,label:company.title,value:company.id};
        }else{
          company=null;
        }
      }
      this.setData(user);
      this.setState({companies,company});
    });
  }

  setData(data){
    this.setState({
      username:data.username,
      name:data.name,
      surname:data.surname,
      email:data.email,
      loading:false
    })
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      rebase.get('users/'+props.match.params.id, {
        context: this,
      }).then((user)=>this.setData(user));
    }
  }

  render(){
    return(
      <div className="full-height card-box scrollable fit-with-header-and-commandbar">
        <div className="m-t-20">
          {
            this.state.loading &&
            <Alert color="success">
              Loading data...
            </Alert>
          }
          <FormGroup>
            <Label for="username">Username</Label>
            <Input type="text" name="username" id="username" placeholder="Enter username" value={this.state.username} onChange={(e)=>this.setState({username:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input type="text" name="name" id="name" placeholder="Enter name" value={this.state.name} onChange={(e)=>this.setState({name:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="surname">Surname</Label>
            <Input type="text" name="surname" id="surname" placeholder="Enter surname" value={this.state.surname} onChange={(e)=>this.setState({surname:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="email">E-mail</Label>
            <Input type="email" name="email" id="email" disabled={true} placeholder="Enter email" value={this.state.email} onChange={(e)=>this.setState({email:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="company">Company</Label>
            <Select
              styles={selectStyle}
              options={
                this.state.companies.map(company => {
                company.label = company.title;
                company.value = company.id;
                return company;
                })}
              value={this.state.company}
              onChange={e =>{ this.setState({ company: e }); }}
              />
          </FormGroup>

          <Button className="btn" disabled={this.state.saving|| this.state.companies.length===0||!isEmail(this.state.email)} onClick={()=>{
            this.setState({saving:true});
            rebase.updateDoc('/users/'+this.props.match.params.id, {username:this.state.username,name:this.state.name,surname:this.state.surname,email:this.state.email,company:this.state.company.id})
              .then(()=>{
                this.setState({saving:false})});
              }}>{this.state.saving?'Saving user...':'Save user'}</Button>

          <Button disabled={true} onClick={()=>{
                if(window.confirm("Are you sure?")){
                  rebase.removeDoc('/users/'+this.props.match.params.id).then(()=>{
                    this.props.history.goBack();
                  });
                }
              }}
              >Delete</Button>
            <Button className="btn-link"  disabled={this.state.saving||this.state.passReseted} onClick={()=>{
                this.setState({passReseted:true,passResetEnded:false})
                firebase.auth().sendPasswordResetEmail(this.state.email).then(()=>{
                  this.setState({passResetEnded:true})
                })
              }}
              >{this.state.passResetEnded?(this.state.passReseted?'Password reseted!':"Reset user's password"):"Resetting..."}</Button>
        </div>
      </div>
    );
  }
}
