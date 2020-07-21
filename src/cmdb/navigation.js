import React, { Component } from 'react';
import { Route } from 'react-router-dom';

import { connect } from "react-redux";
import {testing} from '../helperFunctions';
import Sidebar from './Sidebar';
import ErrorMessages from 'components/errorMessages';
import PageHeader from '../components/PageHeader';
import SelectPage from '../components/SelectPage';

import SidebarItemAdd from './settings/sidebarItemAdd';
import SidebarItemEdit from './settings/sidebarItemEdit';
import StatusList from './settings/statuses';
import ItemList from './items';
import ItemAdd from './items/itemAdd';
import ItemContainer from './items/itemContainer';

class Navigation extends Component {
	render() {
		if((this.props.currentUser.userData===null||this.props.currentUser.userData.role.value < 1 )&&!testing){
			return (
				<div>
				<div className="row">
					<div className="main">
						<PageHeader {...this.props} settings={[{link:'statuses', title:'Statuses'}]} />
					</div>
				</div>
			</div>
		)
		}
		return (
			<div>
				<div className="page-header">
					<div className="center-ver row center flex">
						<SelectPage />
						<PageHeader {...this.props} settings={[{link:'statuses', title:'Statuses'}]} />
					</div>
				</div>

				<div className="row center center-ver">
						<Sidebar {...this.props} />
					<div className="main">
						<Route exact path="/cmdb/errorMessages" component={ErrorMessages} />
						<Route exact path='/cmdb/add' component={SidebarItemAdd} />
						<Route exact path='/cmdb/edit/:sidebarID' component={SidebarItemEdit} />
						<Route exact path='/cmdb/i/:sidebarID' component={ItemList} />
						<Route exact path='/cmdb/i/:sidebarID/i/add' component={ItemAdd} />
						<Route exact path='/cmdb/i/:sidebarID/:itemID' component={ItemContainer} />


						<Route exact path='/cmdb/settings/statuses' component={StatusList} />
						<Route exact path='/cmdb/settings/status/add' component={StatusList} />
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ userReducer}) => {
	return { currentUser:userReducer };
};

export default connect(mapStateToProps, {  })(Navigation);
