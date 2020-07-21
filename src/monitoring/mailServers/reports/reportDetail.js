import React, { Component } from 'react';
import {rebase} from "../../../index";
import {arraySelectToString} from "../../../helperFunctions";


export default class ReportDetail extends Component{
  constructor(props){
    super(props);
    this.state={
      datum: {},
    }
  }

	componentWillMount(){
		rebase.get(`monitoring-servers_results/${this.props.id}`, {
			context: this,
			withIds: true,
		}).then(datum => {
  				 this.setState({
  					 datum
  				 });
			});
	}

  render(){
		const FROM = this.state.datum && this.state.datum.email ? arraySelectToString(Object.values(this.state.datum.email.from).map(val => val.address)) : "no senders";

      return (
        <div className="flex">

					<div className="row">
						<div className="m-r-5">
							<strong>Received: </strong>
						</div>
						<div>
						{this.state.datum &&
							(new Date(this.state.datum.receiveDate).toLocaleString())}
						</div>
					</div>

					<div className="row">
						<div className="m-r-5">
							<strong>From:</strong>
						</div>
						<div>
							{FROM}
						</div>
					</div>

					<div className="row">
						<div className="m-r-5">
							<strong>Subject: </strong>
						</div>
						<div>
						{this.state.datum &&
							this.state.datum.email &&
							this.state.datum.email.subject}
						</div>
					</div>

					<div className="row">
						<div className="m-r-5">
							<strong>Body: </strong>
						</div>
						<div>
							{this.state.datum &&
							this.state.datum.email &&
							this.state.datum.email.text}
						</div>
			  	</div>



  			</div>
      )
  }
}
