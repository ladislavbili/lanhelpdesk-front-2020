import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import Loading from 'components/loading';
import Select from 'react-select';
import {selectStyle} from "configs/components/select";

import { isEmail, toSelArr } from 'helperFunctions';
import Checkbox from 'components/checkbox';

import { REST_URL } from 'configs/restAPI';

import {  GET_USERS } from '../index';


export default class UserEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      id: 0,
      createdAt: "",
      updatedAt: "",
      active: false,
      username: "",
      email: "",
      name: "",
      surname: "",
      fullName: "",
      receiveNotifications: false,
      signature: "",
      role: null,
      company: null,

      roles: [],
      companies: [],

      loading:true,
      saving:false,
      deletingUser:false,
      deactivatingUser: false,

      passReseted: false,
      passResetEnded: true,
    }
    this.setData.bind(this);
    this.storageLoaded.bind(this);
  }

  storageLoaded(props){
    return !props.userData.loading &&
    !props.rolesData.loading &&
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
    if( props.userData.data && props.rolesData.data && props.companiesData.data ){
      const user = props.userData.data.user;
      const roles = toSelArr(props.rolesData.data.roles);
      const companies = toSelArr(props.companiesData.data.companies);

      let signature = user.signature;
      if(!signature){
        signature = `${user.name} ${user.surname}, ${user.company.title}`;
      }
      this.setState({
        id: user.id,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        active: user.active,
        username: user.username,
        email: user.email,
        name: user.name,
        surname: user.surname,
        fullName: user.fullName,
        receiveNotifications: user.receiveNotifications,
        signature: signature,
        role: {...user.role, label: user.role.title, value: user.role.id},
        company: {...user.company, label: user.company.title, value: user.company.id},

        roles,
        companies,

        loading: false,
      })
    }
  }

  render(){
    const { loading: userLoading } = this.props.userData;
    const { loading: rolesLoading } = this.props.rolesData;
    const { loading: companiesLoading } = this.props.companiesData;
    const { client } = this.props;

    return(
      <div className="scroll-visible p-20 fit-with-header-and-commandbar">
        {
          userLoading &&
          rolesLoading &&
          companiesLoading &&
          <Loading />
        }
          <FormGroup>
            <Label for="role">Role</Label>
            <Select
              styles={selectStyle}
              isDisabled={ true/*this.state.role.value > this.props.role */}
              options={this.state.roles /*this.state.role.value > this.props.role? roles : roles.filter( (role) => role.value <= this.props.role )*/}
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
            <Input type="text" name="name" id="name" placeholder="Enter name" value={this.state.name} onChange={(e)=>this.setState({name:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="surname">Surname</Label>
            <Input type="text" name="surname" id="surname" placeholder="Enter surname" value={this.state.surname} onChange={(e)=>this.setState({surname:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label for="email">E-mail</Label>
            <Input type="email" name="email" id="email" disabled={false} placeholder="Enter email" value={this.state.email} onChange={(e)=>this.setState({email:e.target.value})} />
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
              isDisabled={true}
              options={this.state.companies}
              value={this.state.company}
              onChange={e =>{ this.setState({ company: e }); }}
              />
          </FormGroup>

          <FormGroup>
            <Label for="signature">Signature</Label>
            <Input type="textarea" name="signature" id="signature" placeholder="Enter signature" value={this.state.signature} onChange={(e)=>this.setState({signature:e.target.value,signatureChanged:true})} />
          </FormGroup>

          <div className="row">
            <Button
              className="btn m-r-5"
              disabled={ this.state.saving || ( this.state.companies ? this.state.companies.length === 0 : false) || !isEmail(this.state.email) }
              onClick={ this.updateUser.bind(this) }
              >
              { this.state.saving ? 'Saving user...' : 'Save user' }
            </Button>
              { false && this.state.role.level === 0 &&
                  <Button
                    className={ this.state.active ? "btn-grey" : "btn-green"}
                    disabled={/*this.state.role.level !== 0 || - current user*/ this.state.deactivatingUser}
                    onClick={this.deactivateUser.bind(this)}
                    >
                    {this.state.active ? 'Deactivate user' : 'Activate user'}
                  </Button>
                }
                { false && this.state.role.level === 0 &&
                  <Button
                    className="btn-red m-l-5"
                    disabled={/*this.state.role.level !== 0 || - current user*/  this.state.deletingUser}
                    onClick={this.deleteUser.bind(this)}
                    >
                    Delete
                  </Button>
                }

              <Button
                className="btn-link"
                disabled={this.state.saving || this.state.passReseted}
                onClick={()=>{
                  this.setState({passReseted:true,passResetEnded:false})
                  /*firebase.auth().sendPasswordResetEmail(this.state.email).then(()=>{
                    this.setState({passResetEnded:true})
                  })*/
                }}
                >{this.state.passResetEnded?(this.state.passReseted?'Password reseted!':"Reset user's password"):"Resetting..."}</Button>
          </div>
      </div>
    );
  }

  updateUser(){
    this.setState({saving:true});
    this.props.updateUser({ variables: {
      id: parseInt(this.state.id),
      active: this.state.active,
      username: this.state.username,
      email: this.state.email,
      name: this.state.name,
      surname: this.state.surname,
      receiveNotifications: this.state.receiveNotifications,
      signature: (this.state.signature ? this.state.signature : null),
      roleId: this.state.role.id,
      companyId: this.state.company.id,
    } }).then( ( response ) => {
      const { client } = this.props;
      const allUsers = client.readQuery({query: GET_USERS}).users;
      let newUser = {
        id: parseInt(this.state.id),
        username: this.state.username,
        email: this.state.email,
        role: this.state.role,
        company: this.state.company,
        __typename: "User"
      }
      client.writeQuery({ query: GET_USERS, data: {users: allUsers.map( user => (user.id !== this.state.id ? user : {...newUser}) )} });
    }).catch( (err) => {
      console.log(err.message);
    });
    this.setState({saving:false});
  }

  deleteUser(){
    if(!window.confirm("Are you sure you want to delete the user?")){
      const { client } = this.props;

      this.props.deleteUser({ variables: {
        id: this.state.id,
      } }).then( ( response ) => {
        const allUsers = client.readQuery({query: GET_USERS}).users;
        client.writeQuery({ query: GET_USERS, data: {users: allUsers.filter( user => user.id !== this.state.id,)} });
        this.props.history.goBack();
      }).catch( (err) => {
        console.log(err.message);
      });
    }
  }

  deactivateUser(){
    /*this.setState({ deletingUser: true })
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ /*true).then((token)=>{
      fetch(`${REST_URL}/deactivate-user`,{
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          token,
          userID: this.props.match.params.id,
        }),
      }).then((response)=>response.json().then((response)=>{
        this.setState({ deletingUser: false, deactivated: response.deactivated })
        console.log(response);
      })).catch((error)=>{
        this.setState({ deletingUser: false })
        console.log(error);
      })
    })*/
  }
}
