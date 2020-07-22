import React, { Component } from 'react';
import {Button } from 'reactstrap';
import UserAdd from './userAdd';
import UserEdit from './userEdit';
import Loading from 'components/loading';

import Multiselect from 'components/multiselect';
import { toSelArr } from 'helperFunctions';

export default class UsersList extends Component{
  constructor(props){
    super(props);
    this.state={
      userFilter:'',
      selectedRoles: [],
    }
  }

  componentWillMount(){
    if ( !this.props.roleData.loading ){
      this.setState({
        selectedRoles: toSelArr(this.props.roleData.data.roles),
      })
    }
  }

  componentWillReceiveProps( props ){
    if ( this.props.roleData.loading && !props.roleData.loading ){
      this.setState({
        selectedRoles: toSelArr(props.roleData.data.roles),
      })
    }
  }

  render(){
    const { data: userData, loading: userLoading, error: userError } = this.props.userData;
    const { data: roleData, loading: roleLoading, error: rolerError } = this.props.roleData;
    const USERS = ( userLoading ? [] : userData.users);
    const ROLES = ( roleLoading ? [] : toSelArr(roleData.roles) );
    const FILTERED_USERS = USERS.filter( user => this.state.selectedRoles.some(sr => sr.id === user.role.id) );

    const allRolesSelected = this.state.selectedRoles.length === ROLES.length;

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
                    options={ [{ id:'All', label: 'All'}, ...ROLES] }
                    value={ allRolesSelected ? [{ id:'All', label: 'All'}, ...ROLES] : this.state.selectedRoles }
                    label={ "Filter users by roles" }
                    onChange={ ( role ) => {
                      let selectedRoles = [ ...this.state.selectedRoles ];
                      if (role.id === 'All' && !allRolesSelected ){
                          selectedRoles = [...ROLES];
                      } else {
                        if ( selectedRoles.some(sr => sr.id === role.id) ){
                          selectedRoles = selectedRoles.filter( sr => sr.id !== role.id );
                        } else {
                          selectedRoles = [...selectedRoles, role];
                        }
                      }
                      this.setState({
                        selectedRoles,
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
                        {user.username}
                      </td>
                      <td  className={(this.props.match.params.id === user.id ? " active":"") }
                        style={{maxWidth: "200px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }} >
                        { (user.company ? user.company.title  : "NEZARADENÉ")}
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
              this.props.match.params.id && this.props.match.params.id==='add' && <UserAdd  {...this.props }/>
            }
            {
              userLoading && this.props.match.params.id && this.props.match.params.id!=='add' && <Loading />
            }
            {
              !userLoading && this.props.match.params.id && this.props.match.params.id!=='add' && FILTERED_USERS.some((item)=>item.id.toString() === this.props.match.params.id) && <UserEdit {...this.props } />
            }
          </div>
        </div>
      </div>
    );
  }
}
