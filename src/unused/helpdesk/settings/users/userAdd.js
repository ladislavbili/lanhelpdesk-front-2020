import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import Select from 'react-select';
import firebase from 'firebase';
import {rebase, database} from '../../../index';
import {snapshotToArray, isEmail} from '../../../helperFunctions';
import {selectStyle} from "configs/components/select";

export default class UserAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      username:'',
      name:'',
      surname:'',
      email:'',
      company:null,
      saving:false,
      password:'',
      companies:[]
    }
    database.collection('companies').get().then((data)=>{
      let companies=snapshotToArray(data);
      this.setState({companies,company:companies.length===0 ? null :{...companies[0],label:companies[0].title,value:companies[0].id}});
    });
  }

  render(){
    return (
      <div className="full-height card-box scrollable fit-with-header-and-commandbar">
        <div className="m-t-20">
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
            <Input type="email" name="email" id="email" placeholder="Enter email" value={this.state.email} onChange={(e)=>this.setState({email:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" name="password" id="password" placeholder="Enter password" value={this.state.password} onChange={(e)=>this.setState({password:e.target.value})} />
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

          <Button className="btn" disabled={this.state.saving|| this.state.companies.length===0||!isEmail(this.state.email)||this.state.password.length < 6 } onClick={()=>{
              this.setState({saving:true});
              firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((user)=>{
                rebase.addToCollection('/users', {username:this.state.username,name:this.state.name,surname:this.state.surname,email:this.state.email,company:this.state.company.id},user.user.uid)
                .then(()=>{
                  let company = {...this.state.companies[0],label:this.state.companies[0].title,value:this.state.companies[0].id};
                  this.setState({
                    username:'',
                    name:'',
                    surname:'',
                    email:'',
                    company,
                    saving:false
                  });
                });
              });
            }}>{this.state.saving?'Adding...':'Add user'}</Button>
        </div>
      </div>
    );
  }
}
