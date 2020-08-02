import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import Select from 'react-select';
import {selectStyle} from "configs/components/select";

import {isEmail, sameStringForms, toSelArr} from 'helperFunctions';
import Checkbox from 'components/checkbox';

import {  GET_USERS } from '../index';

export default class UserAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      id: 0,
      createdAt: "",
      updatedAt: "",
      active: true,
      username: "",
      email: "",
      name: "",
      surname: "",
      password: "",
      receiveNotifications: false,
      signature: "",
      role: null,
      company: null,

      roles: [],
      companies: [],

      signatureChanged:false,
      saving:false,
    }
    this.setData.bind(this);
    this.storageLoaded.bind(this);
  }

  storageLoaded(props){
    return !props.rolesData.loading &&
    !props.companiesData.loading
  }

  componentWillReceiveProps(props){
    if ((this.storageLoaded(props) && !this.storageLoaded(this.props))
        ||
        (this.props.match.params.id !== props.match.params.id)){
      this.setData(props);
    }
  }

  componentWillMount(){
    if(this.storageLoaded(this.props)){
      this.setData(this.props);
    }
  }

  setData(props){
    if( props.rolesData.data && props.companiesData.data ){
      const roles = toSelArr(props.rolesData.data.roles);
      const companies = toSelArr(props.companiesData.data.companies);

      this.setState({
        roles,
        companies,
        loading: false,
      })
    }
  }

  cannotAddUser(){
    let cond1 = this.state.saving || (this.state.companies ? this.state.companies.length === 0 : false)  ;
    let cond2 = !this.state.username || !this.state.name || !this.state.surname || !isEmail(this.state.email) || this.state.password.length < 6 || !this.state.role || !this.state.company;
    return cond1 || cond2;
  }

  render(){
    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
          <FormGroup>
            <Label for="role">Role</Label>
            <Select
              styles={selectStyle}
              options={this.state.roles /*roles.filter( (role) => role.value <= this.props.role )*/}
              value={this.state.role}
              onChange={role => this.setState({ role })}
              />
          </FormGroup>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input type="text" name="username" id="username" placeholder="Enter username" value={this.state.username} onChange={(e)=>this.setState({username:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input type="text" name="name" id="name" placeholder="Enter name" value={this.state.name} onChange={(e)=>{
                if(this.state.signatureChanged){
                  this.setState({name:e.target.value})
                }else{
                  this.setState({ name:e.target.value, signature: `${e.target.value} ${this.state.surname}, ${(this.state.company? this.state.company.title :'')}` });
                }
            }} />
          </FormGroup>
          <FormGroup>
            <Label for="surname">Surname</Label>
            <Input type="text" name="surname" id="surname" placeholder="Enter surname" value={this.state.surname} onChange={(e)=>{
              if(this.state.signatureChanged){
                this.setState({surname:e.target.value})
              }else{
                this.setState({ surname:e.target.value, signature: `${this.state.name} ${e.target.value}, ${this.state.company? this.state.company.title :''}` });
              }
              }} />
          </FormGroup>
          <FormGroup>
            <Label for="email">E-mail</Label>
            <Input type="email" name="email" id="email" placeholder="Enter email" value={this.state.email} onChange={(e)=>this.setState({email:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" name="password" id="password" placeholder="Enter password" value={this.state.password} onChange={(e)=>this.setState({password:e.target.value})} />
          </FormGroup>

          <Checkbox
            className = "m-b-5 p-l-0"
            value = { this.state.mailNotifications }
            label = "Receive e-mail notifications"
            onChange={()=>{
              this.setState({mailNotifications:!this.state.mailNotifications})
            }}
            />

          <FormGroup>
            <Label for="company">Company</Label>
            <Select
              styles={selectStyle}
              options={this.state.companies}
              value={this.state.company}
              onChange={company =>{
                if(this.state.signatureChanged){
                  this.setState({ company });
                }else{
                  this.setState({ company, signature: `${this.state.name} ${this.state.surname}, ${company? company.title :''}` });
                }
            }}
              />
          </FormGroup>
          <FormGroup>
            <Label for="signature">Signature</Label>
            <Input type="textarea" name="signature" id="signature" placeholder="Enter signature" value={this.state.signature} onChange={(e)=>this.setState({signature:e.target.value,signatureChanged:true})} />
          </FormGroup>

          <Button
            className="btn"
            disabled={this.cannotAddUser()}
            onClick={this.addUser.bind(this)}
            >
            {this.state.saving?'Adding...':'Add user'}
          </Button>

          {this.props.close &&
          <Button className="btn-link"
            onClick={()=>{this.props.close()}}>Cancel</Button>
          }
      </div>
    );
  }

  addUser(){
    console.log(this.state.company);
      this.setState({saving:true});
      this.props.registerUser({ variables: {
        active: this.state.active,
        username: this.state.username,
        email: this.state.email,
        name: this.state.name,
        surname: this.state.surname,
        password: this.state.password,
        receiveNotifications: this.state.receiveNotifications,
        signature: (this.state.signature ? this.state.signature : null),
        roleId: this.state.role.id,
        companyId: this.state.company.id,
      } }).then( ( response ) => {
        const { client } = this.props;
        const allUsers = client.readQuery({query: GET_USERS}).users;
        let newUser = {...response.data.registerUser,  __typename: "User"}
        client.writeQuery({ query: GET_USERS, data: {users: [...allUsers, newUser]} });
        this.props.history.push('/helpdesk/settings/users/' + newUser.id)
      }).catch( (err) => {
        console.log(err.message);
      });
      this.setState({saving: false});
  }
}
