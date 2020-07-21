import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import { connect } from "react-redux";
import firebase from 'firebase';
import {rebase} from './index';
import {setUserID,deleteUserData, setUserData, startUsersNotifications, setUserFilterStatuses } from './redux/actions';

import Reroute from './reroute';
import HelpdeskNavigation from './helpdesk/navigation';
import CMDBNavigation from './cmdb/navigation';
import LanWikiNavigation from './lanwiki/navigation';
import PassManagerNavigation from './passmanager/navigation';
import ExpendituresNavigation from './expenditures/navigation';
import ProjectsNavigation from './projects/navigation';
import ReportsNavigation from './reports/navigation';
import MonitoringNavigation from './monitoring/navigation';
import Login from './login';
import Test from './test';

class Navigation extends Component {
  constructor(props){
    super(props);
      firebase.auth().onAuthStateChanged((user) => {
      if(user!==null){
        rebase.get('users/'+user.uid, {
          context: this,
        }).then((userData)=>{this.props.setUserData(userData);this.props.setUserFilterStatuses(userData.statuses)});
        this.props.setUserID(user.uid);
        this.props.startUsersNotifications(user.uid);
      }else{
        this.props.deleteUserData();
      }
    });
  }
  render(){
    if(this.props.loggedIn){
      return(
        <div>
          <Route exact path='/' component={Reroute} />
          <Route exact path='/test' component={Test} />
          <Route path='/helpdesk' component={HelpdeskNavigation} />
          <Route path='/cmdb' component={CMDBNavigation} />
          <Route path='/lanwiki' component={LanWikiNavigation} />
          <Route path='/reports' component={ReportsNavigation} />
          <Route path='/passmanager' component={PassManagerNavigation} />
          <Route path='/expenditures' component={ExpendituresNavigation} />
          <Route path='/projects' component={ProjectsNavigation} />
          <Route path='/monitoring' component={MonitoringNavigation} />
        </div>
      )
    }else{
      return(
        <div>
          <Route path='/' component={Login} />
        </div>
      )
    }
  }
}

const mapStateToProps = ({ userReducer }) => {
	const { loggedIn } = userReducer;
	return { loggedIn };
};

export default connect(mapStateToProps, {setUserID,deleteUserData, setUserData, startUsersNotifications, setUserFilterStatuses })(Navigation);
