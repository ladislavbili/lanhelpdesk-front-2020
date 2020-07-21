import React, { Component } from 'react';
import {Button } from 'reactstrap';
import UserAdd from './userAdd';
import UserEdit from './userEdit';

import Multiselect from '../../../components/multiselect';

import { connect } from "react-redux";
import {storageUsersStart, storageCompaniesStart} from '../../../redux/actions';
import {sameStringForms} from '../../../helperFunctions';

class UsersList extends Component{
  constructor(props){
    super(props);
    this.state={
      users:[],
      companies: [],
      userFilter:'',
      roles: [
        { id:'All', label: 'All', on: true },
        { id: "Guest", label:'Guest', on: false, value: -1},
        { id: "User", label:'User', on: false, value: 0},
        { id: "Agent", label:'Agent', on: false, value: 1},
        { id: "Manager", label:'Manager', on: false, value: 2},
        { id: "Admin", label:'Admin', on: false, value: 3}
      ]
    }
  }

  componentWillReceiveProps(props){
    if (!sameStringForms(props.users, this.props.users)){
      this.setState({users: props.users})
    }
    if (!sameStringForms(props.companies, this.props.companies)){
      this.setState({companies: props.companies})
    }
  }

  componentWillMount(){
    if(!this.props.usersActive){
      this.props.storageUsersStart();
    }
    if(!this.props.companiesActive){
      this.props.storageCompaniesStart();
    }
    this.setState({users:this.props.users, companies: this.props.companies});
  }

  render(){
    const FILTERED_USERS = this.state.users.filter(user => this.state.roles.find(r => r.id === "All").on || this.state.roles.find(r => r.id === user.role.label).on );
    return (
			<div className="content">
        <div className="row m-0 p-0 taskList-container">
          <div className="col-lg-4">
            <div className="commandbar">
              <div className="search-row">
                <div className="search">
                  <button className="search-btn" type="button">
                    <i className="fa fa-search" />
                  </button>
                  <input
                    type="text"
                    className="form-control search-text"
                    value={this.state.userFilter}
                    onChange={(e)=>this.setState({userFilter:e.target.value})}
                    placeholder="Search"
                    />
                </div>
              </div>
              <Button
                className="btn-link center-hor"
                onClick={()=> this.props.history.push('/helpdesk/settings/users/add')}>
                <i className="fa fa-plus p-l-5 p-r-5"/> User
              </Button>
            </div>
            <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <div className="row p-l-10 p-b-10">
                <h2 className="">
    							Users
    						</h2>
                <div className="ml-auto">
                  <Multiselect
                    className="ml-auto m-r-10"
                    options={ this.state.roles }
                    value={
                      this.state.roles.filter(role => role.on)
                    }
                    label={ "Filter users by roles" }
                    onChange={ (data) => {
                        let newRoles = this.state.roles.map(role => role.id !== data.id ? role : {...role, on: !role.on})
                        this.setState({
                          roles: newRoles,
                        })
                    } }
                    />
                </div>
              </div>
              <table className="table table-hover">
                <tbody>
                  {FILTERED_USERS.filter((item)=>item.email.toLowerCase().includes(this.state.userFilter.toLowerCase())).sort((user1,user2)=>user1.email>user2.email?1:-1).map((user)=>
                    <tr
                      key={user.id}
                      className={"clickable" + (this.props.match.params.id === user.id ? " active":"")}
                      style={{whiteSpace: "nowrap",  overflow: "hidden"}}
                      onClick={()=>this.props.history.push('/helpdesk/settings/users/'+user.id)}>
                      <td
                        style={{maxWidth: "300px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }}  >
                        {user.email}
                      </td>
                      <td  className={(this.props.match.params.id === user.id ? " active":"") }
                        style={{maxWidth: "200px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }} >
                        {(this.state.companies.filter(company => company.id === user.company)[0] ? this.state.companies.filter(company => company.id === user.company)[0].title  : "NEZARADENÉ")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="commandbar"></div>
            {
              this.props.match.params.id && this.props.match.params.id==='add' && <UserAdd />
            }
            {
              this.props.match.params.id && this.props.match.params.id!=='add' && this.state.users.some((item)=>item.id===this.props.match.params.id) && <UserEdit match={this.props.match} history={this.props.history}/>
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageUsers, storageCompanies}) => {
  const { usersActive, users } = storageUsers;
  const { companiesActive, companies } = storageCompanies;
  return { usersActive, users, companiesActive, companies };
};

export default connect(mapStateToProps, { storageUsersStart, storageCompaniesStart })(UsersList);
