import React, { Component } from 'react';
import { Button, FormGroup, Label, Input } from 'reactstrap';
import {rebase} from "../../index";
import Select from 'react-select';
import {selectStyle} from 'configs/components/select';
import {isEmail, toMillisec} from "../../helperFunctions";

export default class MailServerAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title: "",
      company: null,
      testEmail: "",
      numberOfTests: null,
      repeatNumber: null,
      note: "",
      success: true,

      saving:false,
    }
    this.submit.bind(this);
  }

  componentWillMount(){
		rebase.get("companies", {
			 context: this,
			 withIds: true,
		 }).then(data => {
			 let newCompanies = data.map(com => {return {value: com.id, label: com.title}});
			 this.setState({
				 companies: newCompanies,
			 });
		 }).catch(err => {
			 //handle error
		 })
	}

  submit(){
    this.setState({
      saving: true,
    })
    let data = {
      title: this.state.title,
      company: this.state.company ? this.state.company.value : null,
      testEmail: this.state.testEmail,
      numberOfTests: this.state.numberOfTests ? parseInt(this.state.numberOfTests) : 0,
      repeatNumber: this.state.repeatNumber ? toMillisec(this.state.repeatNumber, "minutes") : 15,
      note: this.state.note ? this.state.note : null,
      success: this.state.success
    };
    rebase.addToCollection('/monitoring-servers', data)
    .then(() => {
      this.setState({
        saving: false,
      });
      this.props.history.goBack();
    }).catch(err => {
  });
  }

  render(){
    return (
      <div className="flex">
				<div className="commandbar p-2">
				</div>

					<div className={"card-box p-t-15 scrollable fit-with-header-and-commandbar " + (!this.props.columns ? " center-ver w-50" : "")}>
            <div className="row">
            <h2 className="flex">Add mail server</h2>
              <Button
                className={this.state.success ? "btn-success" : "btn-danger"}
                onClick={() => this.setState({success: !this.state.success})}
              > {this.state.success ? "working" : "failed"}
              </Button>

            </div>

              <FormGroup>
                <Label>Title *</Label>
                <Input type="text" placeholder="Enter mailserver name" value={this.state.title} onChange={(e)=>this.setState({title: e.target.value})} />
              </FormGroup>

              <FormGroup>
                <Label>Company</Label>
                <Select
                  value={this.state.company}
                  onChange={(company)=>this.setState({company})}
                  options={this.state.companies}
                  styles={selectStyle}
                  />
              </FormGroup>

              <FormGroup>
                <Label>Test e-mail *</Label>
                <Input type="text" className={(this.state.testEmail.length > 0 && !isEmail(this.state.testEmail)) ? "form-control-warning" : ""} placeholder="Enter test mail" value={this.state.testEmail} onChange={(e)=>this.setState({testEmail: e.target.value})} />
                { this.state.testEmail.length > 0 &&
                  !isEmail(this.state.testEmail) &&
                  <Label className="pull-right warning">This mail address is invalid.</Label>
                }
              </FormGroup>

              <FormGroup>
                <Label>Number of tests for fail *</Label>
                <Input type="number" className={(this.state.numberOfTests < 0 ) ? "form-control-warning" : ""} placeholder="Enter number of tests for fail" value={this.state.numberOfTests} onChange={(e)=>this.setState({numberOfTests: (e.target.value.length > 0 && isNaN(parseInt(e.target.value)) ? 0 : e.target.value)})}/>
                { this.state.numberOfTests &&
                  this.state.numberOfTests < 0 &&
                  <Label className="pull-right warning">This value must be non-negative.</Label>
                }
             </FormGroup>

              <FormGroup>
                <Label>Repeat test every ... minutes *</Label>
                <Input type="number" className={(this.state.repeatNumber < 15 ) ? "form-control-warning" : ""} placeholder="Enter the interval between tests" value={this.state.repeatNumber} onChange={(e)=>this.setState({repeatNumber: e.target.value.length > 0 && isNaN(parseInt(e.target.value)) ? 0 : e.target.value})}  />
                { this.state.repeatNumber &&
                  this.state.repeatNumber < 0 &&
                  <Label className="pull-right warning">This value must be non-negative.</Label>
                }
                { this.state.repeatNumber &&
                  this.state.repeatNumber >= 0 &&
                  this.state.repeatNumber < 15 &&
                  <Label className="pull-right warning">The minimum time to repeat a test is 15 minutes.</Label>
                }
              </FormGroup>

              <FormGroup>
                <Label>Note</Label>
                <textarea className="form-control b-r-0" placeholder="Enter note" value={this.state.note} onChange={(e)=>this.setState({note: e.target.value})}  />
              </FormGroup>

              <Button
    						className="btn pull-right"
                disabled={this.state.saving
                  || this.state.title === ""
                  || !isEmail(this.state.testEmail)
                  || !this.state.repeatNumber
                  || !this.state.numberOfTests
                  || this.state.repeatNumber < 15
                  || this.state.numberOfTests < 0
                }
                onClick={() => this.submit()}
    					> { this.state.saving ? "Adding..." : "Add mail server"}
              </Button>
              <Button
                className="btn-link m-r-10"
                onClick={()=>this.props.history.goBack()}
              > Back
              </Button>

    				</div>
			</div>
    );
  }
}
