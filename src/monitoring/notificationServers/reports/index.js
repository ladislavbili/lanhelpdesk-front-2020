import React, { Component } from 'react';
import { Modal, Button, ModalBody, ModalFooter, ModalHeader, FormGroup, Label, Input  } from 'reactstrap';
import ReportDetail from "./reportDetail";
import {database} from "../../../index";
import {snapshotToArray} from "../../../helperFunctions";

export default class Reports extends Component{
  constructor(props){
    super(props);
    this.state={
			testResults: [],

      seeAll: false,

      opendedModal: false,
      saving:false,
    }
    this.createListener.bind(this);
    this.handleListenerChange.bind(this);
  }

	componentWillMount(){
    this.createListener(this.props.id);
	}

  componentWillReceiveProps(props){
    if (props.id !== this.props.id){
      if (this.ref) {
        this.ref();
      }
      this.createListener(props.id);
    }
  }

	componentWillUnmount(){
    this.ref();
	}

  createListener(id){
    this.ref = database.collection("monitoring-notifications_results")
    .where("notification", "==", id)
    .orderBy("receiveDate", "desc")
    .limit(50)
    .onSnapshot((doc) => {
        let data = snapshotToArray(doc);
        this.setState({
          testResults: data
        });
    });
  }

  handleListenerChange(){
    if(this.ref) {
      this.ref();
    }
    if (this.state.seeAll) {
      this.ref = database.collection("monitoring-notifications_results")
      .where("notification", "==", this.props.id)
      .orderBy("receiveDate", "desc")
      .onSnapshot((doc) => {
          let data = snapshotToArray(doc);
          this.setState({
            testResults: data
          });
      });
    } else {
      this.createListener(this.props.id);
    }
  }

  render(){
      return (
        <div className="flex">
          <FormGroup className="row">
            <div className="m-r-10">
              <Label >See all results</Label>
            </div>
            <div className="m-l-15">
              <Input  type="checkbox" style={{position: "relative"}} checked={this.state.seeAll} onChange={(e)=> {
                  this.setState({seeAll: !this.state.seeAll}, () => this.handleListenerChange());
                }} />
            </div>
            <div className="m-l-15">{this.state.seeAll ? "YES" : "NO"}</div>
          </FormGroup>

					<table className="table">
							<thead>
								<tr>
									<th>Receive date</th>
									<th>Subject</th>
									<th>Status</th>
								</tr>
							</thead>
							<tbody>
								{
									this.state.testResults.map(item =>
										<tr
											className="clickable"
											key={item.id}
											onClick={()=>{
												this.setState({
													openedModal: true,
													reportID: item.id
												})
											}}>
											<td>{new Date(item.receiveDate).toLocaleString()}</td>
											<td>{item.subject}</td>
											<td>{item.success ? "OK" : "Failed"}</td>
										</tr>
									)
								}
							</tbody>
						</table>

						<Modal isOpen={this.state.openedModal} >
              <ModalHeader>
              Reports
              </ModalHeader>
			        <ModalBody>
			          <ReportDetail id={this.state.reportID} isModal={true} />
			        </ModalBody>
			        <ModalFooter>
			          <Button className="btn-link mr-auto" onClick={() => this.setState({openedModal:!this.state.openedModal})}>
			            Close
			          </Button>
			        </ModalFooter>
			      </Modal>


  			</div>
      )
  }
}
