import React, { Component } from 'react';
import { Label } from 'reactstrap';
import { timestampToString } from 'helperFunctions';

export default class Attachments extends Component {

	getLocation() {
    let url = this.props.history.location.pathname;
    if (url.includes('cmdb')) {
      return '/cmdb';
    } else if (url.includes('helpdesk')) {
      return '/helpdesk';
    } else if (url.includes('passmanager')) {
      return '/passmanager';
    } else if (url.includes('expenditures')) {
      return '/expenditures';
    } else if (url.includes('projects')) {
      return '/projects';
    } else if (url.includes('reports')) {
      return '/reports';
    } else if (url.includes('monitoring')) {
      return '/monitoring';
    } else {
      return '/lanwiki';
    }
  }

	getEditURL(){
		switch (this.props.errorMessage.type) {
			case 'smtps':{
				return `${this.getLocation()}/settings/smtps/${this.props.errorMessage.sourceID}`
			}
			case 'imaps':{
				return `${this.getLocation()}/settings/imaps/${this.props.errorMessage.sourceID}`
			}
			default:{
				return this.getLocation();
			}


		}
	}

	render() {
		const error = this.props.errorMessage;
		return (
			<div>
				<div className="commandbar"></div>
			<div className="p-20 scroll-visible fit-with-header-and-commandbar">
				<div>
				<Label>Type:</Label>
				{` ${error.type}`}
				</div>
				<div>
				<Label>Created at:</Label>
				{` ${timestampToString(error.createdAt)}`}
				</div>
				<div>
				<Label>Error message:</Label>
				{` ${error.errorMessage}`}
				</div>
				<div>
				<Label>Source of the error:</Label>
				{` ${error.source}`}
				</div>
				{ error.sourceID !== null &&
				<div>
					<Label>Related ID:</Label>
					{` ${error.sourceID} `}<Label className="clickable" onClick={ ()=> this.props.history.push(this.getEditURL()) }>Open related item</Label>
				</div>
				}
				{ error.sourceItem !== null &&
					<div>
						<Label>Source of the error - data:</Label>
						<div className="ml-5 mt-2">
						{Object.keys(error.sourceItem).map((key)=>
								<div key={key}>
									<Label>{key}</Label>
									{`: ${ key !== 'password' ? error.sourceItem[key]  : 'hidden'}`}
								</div>
							)}
						</div>
					</div>
				}
				<div>
					<Label>Full error data:</Label>
					<div className="ml-5 mt-2">
					{Object.keys(error.error).filter((key) => error.error[key] !== null ).map((key)=>
							<div key={key}>
								<Label>{key}</Label>
								{`: ${ error.error[key] }`}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
		);
	}
}
