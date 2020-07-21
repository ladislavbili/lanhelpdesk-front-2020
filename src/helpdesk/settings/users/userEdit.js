import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert } from 'reactstrap';
import Select from 'react-select';
import firebase from 'firebase';

import {rebase} from '../../../index';
import { isEmail} from '../../../helperFunctions';
import {selectStyle} from "configs/components/select";

import { connect } from "react-redux";
import {storageCompaniesStart,storageUsersStart, setUserData} from '../../../redux/actions';
import {toSelArr} from '../../../helperFunctions';
import Checkbox from '../../../components/checkbox';
import { REST_URL } from 'configs/restAPI';

let roles=[
  {label:'Guest',value:-1},
  {label:'User',value:0},
  {label:'Agent',value:1},
  {label:'Manager',value:2},
  {label:'Admin',value:3},
]

class UserEdit extends Component{
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
      companies:[],
      role:roles[0],
      mailNotifications:false,
      signature:'',
      deactivated: false,

      deletingUser:false,
      deactivatingUser: false,
    }
    this.setData.bind(this);
  }

  storageLoaded(props){
    return props.companiesLoaded &&
    props.usersLoaded
  }

  componentWillReceiveProps(props){
    if(this.storageLoaded(props) && !this.storageLoaded(this.props)){
      this.setData(props);
    }
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      if(this.storageLoaded(props)){
        this.setData(props);
      }
    }
  }

  componentWillMount(){
    if(!this.props.companiesActive){
      this.props.storageCompaniesStart();
    }
    if(!this.props.usersActive){
      this.props.storageUsersStart();
    }
    if(this.storageLoaded(this.props)){
      this.setData(this.props);
    };
  }

  deleteUser(){
    if(!window.confirm("Are you sure you want to delete the user?")){
      return;
    }

    this.setState({ deletingUser: true })
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((token)=>{
      fetch(`${REST_URL}/delete-user`,{
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          token,
          userID: this.props.match.params.id,
        }),
      }).then((response)=>response.json().then((response)=>{
        this.setState({ deletingUser: false })
        console.log(response);
      })).catch((error)=>{
        this.setState({ deletingUser: false })
        console.log(error);
      })
    })
  }

  deactivateUser(){
    this.setState({ deletingUser: true })
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((token)=>{
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
    })
  }

  setData(props){
    let user = props.users.find((item)=>item.id===props.match.params.id);
    let companies = toSelArr(props.companies);
    let company;
    if(companies.length===0){
      company=null;
    }else{
      company=companies.find((item)=>item.id===user.company);
      if(!company){
        company=companies.filter(comp => comp.title === "NEZARADENÉ")[0];
      }
    }
    let role = user.role;
    if(role===undefined){
      role=roles[0];
    }
    let signature = user.signature;
    if(!signature){
      signature = `${user.name} ${user.surname}, ${ company ? company.title : '' }`;
    }

    this.setState({
      company,
      companies,
      username:user.username,
      name:user.name,
      surname:user.surname,
      email:user.email,
      role,
      mailNotifications: user.mailNotifications === true,
      signature,
      loading:false,
      deactivated: user.deactivated || false,
    })
  }

  render(){
    return(
      <div className="scroll-visible p-20 fit-with-header-and-commandbar">
          {
            this.state.loading &&
            <Alert color="success">
              Loading data...
            </Alert>
          }
          <FormGroup>
            <Label for="role">Role</Label>
            <Select
              styles={selectStyle}
              isDisabled={this.state.role.value > this.props.role }
              options={this.state.role.value > this.props.role? roles : roles.filter( (role) => role.value <= this.props.role )}
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
            <Input type="email" name="email" id="email" disabled={true} placeholder="Enter email" value={this.state.email} onChange={(e)=>this.setState({email:e.target.value})} />
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
              onChange={e =>{ this.setState({ company: e }); }}
              />
          </FormGroup>

          <FormGroup>
            <Label for="signature">Signature</Label>
            <Input type="textarea" name="signature" id="signature" placeholder="Enter signature" value={this.state.signature} onChange={(e)=>this.setState({signature:e.target.value,signatureChanged:true})} />
          </FormGroup>

          <div className="row">
            <Button className="btn m-r-5" disabled={this.state.saving|| this.state.companies.length===0||!isEmail(this.state.email)} onClick={()=>{
              this.setState({saving:true});
              let body = {
                username:this.state.username,
                name:this.state.name,
                surname:this.state.surname,
                email:this.state.email,
                company:this.state.company.id,
                role:this.state.role,
                mailNotifications:this.state.mailNotifications,
                signature:this.state.signature,
              }
              rebase.updateDoc('/users/'+this.props.match.params.id, body)
                .then(()=>{
                  if(this.props.match.params.id === this.props.currentUser.id){
                    this.props.setUserData(body);
                  }
                  this.setState({saving:false})});
                }}>{this.state.saving?'Saving user...':'Save user'}</Button>
                { this.props.role === 3 &&
                  <Button
                    className={ this.state.deactivated ? "btn-green" : "btn-grey"}
                    disabled={this.props.role !== 3 || this.state.deactivatingUser}
                    onClick={this.deactivateUser.bind(this)}
                    >
                    {this.state.deactivated ? 'Activate user':'Deactivate user'}
                  </Button>
                }
                { this.props.role === 3 &&
                  <Button
                    className="btn-red m-l-5"
                    disabled={this.props.role !== 3 || this.state.deletingUser}
                    onClick={this.deleteUser.bind(this)}
                    >
                    Delete
                  </Button>
                }

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

const mapStateToProps = ({ storageCompanies, storageUsers, userReducer}) => {
  const { companiesActive, companies, companiesLoaded } = storageCompanies;
  const { usersActive, users, usersLoaded } = storageUsers;
  const role = userReducer.userData ? userReducer.userData.role.value : 0;
  return { companiesActive, companies, companiesLoaded, usersActive, users, usersLoaded, currentUser:userReducer, role };
};

export default connect(mapStateToProps, { storageCompaniesStart,storageUsersStart,setUserData })(UserEdit);
