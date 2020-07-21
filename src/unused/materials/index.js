import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import classnames from 'classnames';
import Materials from './materials';
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
					<div className="col-md-12">

						<Nav tabs>
							<NavItem>
								<NavLink
									className={classnames({ active: this.state.activeTab === '1' })}
									onClick={() => { this.toggle('1'); }}
								>
									Materiál
            </NavLink>
							</NavItem>
							<NavItem>
								<NavLink
									className={classnames({ active: this.state.activeTab === '2' })}
									onClick={() => { this.toggle('2'); }}
								>
									Rozpocet
            </NavLink>
							</NavItem>
						</Nav>
						<TabContent activeTab={this.state.activeTab} style={{ padding: "0", backgroundColor: "rgb(249, 249, 249)" }}>
							<TabPane tabId="1">
								<Materials props = {...this.props} />
							</TabPane>
							<TabPane tabId="2">
								<Rozpocet props = {...this.props} />
							</TabPane>
						</TabContent>
					</div>
				</div>
			</div>
		);
	}
}
