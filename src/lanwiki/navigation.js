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
import ListNotes from './Notes';

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
		if((this.props.currentUser.userData===null||this.props.currentUser.userData.role.value < 1 )&&!testing){
			return (
				<div>
					<div className="page-header">
						<div className="center-ver row center flex">
							<SelectPage />
							<PageHeader {...this.props}
								setLayout={this.setLayout.bind(this)}
								layout={this.props.layout}
								showLayoutSwitch={true}
								/>
						</div>
					</div>

					<div className="row center center-ver">
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
							/>
					</div>
				</div>

				<div className="row center center-ver">
						<Sidebar {...this.props} />
					<div className="main">
						<Route exact path="/lanwiki/errorMessages" component={ErrorMessages} />
						<Route exact path='/lanwiki' component={ListNotes} />
            <Route exact path='/lanwiki/i/:listID' component={ListNotes} />
						<Route exact path='/lanwiki/i/:listID/:noteID' component={ListNotes} />
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
