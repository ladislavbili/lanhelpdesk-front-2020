import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import Prace from './prace';
import Rozpocet from './rozpocet';



export default class Subtasks extends Component {

	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			activeTab: '1'
		};
	}

	toggle(tab) {
		if (this.state.activeTab !== tab) {
			this.setState({
				activeTab: tab
			});
		}
	}

	render() {
		return (
			<div className="m-t-30">
				<div className="row">
					<div className="full-width">

						<Nav tabs className="b-0">
							<NavItem>
								<NavLink
									className={classnames({ active: this.state.activeTab === '1'}, "clickable", "form-tab-end")}
									onClick={() => { this.toggle('1'); }}
								>
									Práce
            		</NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									className={classnames({ active: this.state.activeTab === '2' }, "clickable", "form-tab-end")}
									onClick={() => { this.toggle('2'); }}
								>
									Rozpocet
            </NavLink>
							</NavItem>
						</Nav>
						<TabContent activeTab={this.state.activeTab}>
							<TabPane tabId="1">
								<Prace {...this.props} />
							</TabPane>
							<TabPane tabId="2">
								<Rozpocet {...this.props} />
							</TabPane>
						</TabContent>
					</div>
				</div>
			</div>
		);
	}
}
