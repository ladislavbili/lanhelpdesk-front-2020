import React, { Component } from 'react';
import { Button } from 'reactstrap';
import Reports from "./reports"
import {rebase} from "../../index";
import {fromMillisec} from "../../helperFunctions";

export default class MailServerInfo extends Component{
  constructor(props){
    super(props);
    this.state={
			title: "",
			company: "",
			testEmail: "",
      numberOfTests: "",
      repeatNumber: "",
			note: "",
      success: false,

      saving: false,
    }
		this.fetch.bind(this);
		this.fetch(this.props.id);
  }

	componentWillReceiveProps(props){
		if (this.props.id !== props.id){
			this.fetch(props.id);
		}
	}

	fetch(id){
		rebase.get(`monitoring-servers/${id}`, {
			context: this,
			withIds: true,
		}).then(datum => {
      rebase.get(`companies`, {
  			context: this,
  			withIds: true,
  		}).then(companies => {
          let company = companies.find(comp => comp.id === datum.company);
  				 this.setState({
  					 title: datum.title ? datum.title : "no title",
  		 			 company: company ? company.title : "no company",
  		 			 testEmail: datum.testEmail ? datum.testEmail : "no test mail",
             numberOfTests: datum.numberOfTests ? datum.numberOfTests : "0",
             repeatNumber: datum.repeatNumber ? fromMillisec(datum.repeatNumber, "minutes") + " min." : "15",
  					 note: datum.note ? datum.note : "no notes",
             success: datum.success,
  				 });
  			});
			});
	}

  render(){
      return (
        <div className="flex">
					<div className="row m-b-30">
						<div >
							<h2>{this.state.title}</h2>
						</div>
            <div className="mr-auto m-l-15 p-t-5">
              <span
                style={{backgroundColor: this.state.success ? 'lime' :'red', color: "white", padding: "3px"}}
                > {this.state.success ? "working" : "failed"}
              </span>
						</div>
						<div className="pull-right">
							<Button
	              className="btn-link"
	              onClick={() => this.props.toggleEdit()}
	            > Edit
	            </Button>
						</div>
					</div>

					<div className="row">
						<div className="mr-auto">
							<strong>Title:</strong>
						</div>
						<div className="pull-right">
							{this.state.title}
						</div>
					</div>

					<div className="row">
						<div className="mr-auto">
							<strong>Company:</strong>
						</div>
						<div className="pull-right">
							{this.state.company}
						</div>
					</div>

					<div className="row">
						<div className="mr-auto">
							<strong>Test email:</strong>
						</div>
						<div className="pull-right">
							{this.state.testEmail}
						</div>
					</div>

          <div className="row">
						<div className="mr-auto">
							<strong>Number of tests for fail:</strong>
						</div>
						<div className="pull-right">
							{this.state.numberOfTests}
						</div>
					</div>

          <div className="row">
						<div className="mr-auto">
							<strong>Repeating tests every:</strong>
						</div>
						<div className="pull-right">
							{this.state.repeatNumber}
						</div>
					</div>

					<hr className="m-t-15 m-b-15"/>

					<div>
						<div className="mr-auto">
							<strong>Note</strong>
						</div>
							{this.state.note}
					</div>

					<hr className="m-t-15 m-b-15"/>

					<Reports id={this.props.id}/>

  			</div>
      )
  }
}
