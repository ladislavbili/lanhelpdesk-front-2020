import React, { Component } from 'react';
import {Button } from 'reactstrap';
import {rebase} from '../../../index';
import UserAdd from './userAdd';
import UserEdit from './userEdit';

export default class UsersList extends Component{
  constructor(props){
    super(props);
    this.state={
      users:[],
      userFilter:''
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/users', {
      context: this,
      withIds: true,
      then:content=>{this.setState({users:content, userFilter:''})},
    });
  }

  componentWillUnmount(){
    rebase.removeBinding(this.ref);
  }

  render(){
    return (
      <div className="content-page">
				<div className="content" style={{ paddingTop: 0 }}>
					<div className="commandbar">
						<div className="row align-items-center">
              <div className="p-2">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control search"
                    value={this.state.userFilter}
                    onChange={(e)=>this.setState({userFilter:e.target.value})}
                    placeholder="Search"
                  />
                  <div className="input-group-append">
                    <button className="search-btn" type="button">
                      <i className="fa fa-search" />
                    </button>
                  </div>
                </div>
              </div>

                <Button
          				className="btn-link t-a-l"
          				onClick={()=>this.props.history.push('/helpdesk/settings/users/add')}>
          			 <i className="fa fa-plus m-r-5 m-l-5 "/> User
          			</Button>

            </div>
          </div>

          <div className="row m-0 p-0 taskList-container">
            <div className="col-lg-4 p-0 scrollable fit-with-header-and-commandbar">
              <table className="table table-hover p-5">
                <thead>
                  <tr>
                    <th>User name</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.users.filter((item)=>item.email.toLowerCase().includes(this.state.userFilter.toLowerCase())).map((user)=>
                    <tr
                      key={user.id}
                      className={"clickable" + (this.props.match.params.id === user.id ? " sidebar-item-active":"")}
                      onClick={()=>this.props.history.push('/helpdesk/settings/users/'+user.id)}>
                      <td className={(this.props.match.params.id === user.id ? "text-highlight":"")}>
                        {user.email}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="col-lg-8 p-0">
              {
                this.props.match.params.id && this.props.match.params.id==='add' && <UserAdd />
              }
              {
                this.props.match.params.id && this.props.match.params.id!=='add' && this.state.users.some((item)=>item.id===this.props.match.params.id) && <UserEdit match={this.props.match} history={this.props.history}/>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
