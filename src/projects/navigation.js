import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from "react-redux";
import {rebase} from '../index';
import {setLayout} from '../redux/actions';
import {testing} from '../helperFunctions';

import Sidebar from './Sidebar';
import ErrorMessages from 'components/errorMessages';
import PageHeader from '../components/PageHeader';
import SelectPage from '../components/SelectPage';
import List from './list';
import TagList from './tags'

class Navigation extends Component {
	constructor(props){
		super(props);
		this.setLayout.bind(this);
	}

	setLayout(layout){
		rebase.updateDoc('/users/'+this.props.currentUser.id, {generalLayout:layout})
		this.props.setLayout(layout);
	}

	render() {
		if((this.props.currentUser.userData===null||this.props.currentUser.userData.role.value < 1)&&!testing){
			return (
				<div>
					<div className="page-header">
						<div className="center-ver row center flex">
							<SelectPage />
								<PageHeader {...this.props}
									setLayout={this.setLayout.bind(this)}
									layout={this.props.layout}
									showLayoutSwitch={true}
									settings={[{title:'Tags',link:'tags'}]}
									/>
						</div>
					</div>
					<div className="row center center-ver h-100vh">
						<div className="main">
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
							<PageHeader {...this.props}
								setLayout={this.setLayout.bind(this)}
								layout={this.props.layout}
								showLayoutSwitch={true}
								settings={[{title:'Tags',link:'tags'}]}
								/>
					</div>
				</div>

				<div className="row center center-ver h-100vh">
						<Sidebar {...this.props} />
					<div className="main">
						<Route exact path="/projects/errorMessages" component={ErrorMessages} />
						<Route exact path='/projects/:projectID/:milestoneID' component={List} />
						<Route exact path='/projects/:projectID/:milestoneID/edit/:taskID' component={List} />
						<Route exact path='/projects/settings/tags' component={TagList} />
	          <Route exact path='/projects/settings/tags/:id' component={TagList} />
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ userReducer, appReducer }) => {
	return { layout:appReducer.layout, currentUser:userReducer };
};

export default connect(mapStateToProps, { setLayout })(Navigation);
