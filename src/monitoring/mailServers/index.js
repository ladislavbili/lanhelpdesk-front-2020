import React, { Component } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { connect } from "react-redux";

import classnames from 'classnames';
import Container from './container';
import Empty from '../empty';
import {rebase, database} from "../../index";
import {snapshotToArray} from "../../helperFunctions";

class MailServerList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			companies: [],
			search:'',

			filterByTitle: "",
			filterByCompany: "",
			filterByTestMail: "",
			filterByStatus: "",
			filterByLastResp: "",

			saving:false,
			openedID:null,

			editOpened:false
		};
	}

	componentWillMount(){
		this.ref1 = rebase.listenToCollection('monitoring-servers', {
    context: this,
		withIds: true,
    then(data) {
	     this.setState({
				 data
			 });
    },
    onFailure(err) {
      //handle error
    }
  });
		this.ref2 = rebase.listenToCollection('companies', {
		context: this,
		withIds: true,
		then(companies) {
			 this.setState({
				 companies
			 });
		},
		onFailure(err) {
			//handle error
		}
	});
	}

	componentWillUnmount(){
		rebase.removeBinding(this.ref1);
		rebase.removeBinding(this.ref2);
	}

	removeItem(id){
		rebase.removeDoc(`monitoring-servers/${id}`)
				.then(() => {
					database.collection("monitoring-servers_results")
				    .where("server", "==", id)
				    .get()
						.then((col) => {
							let data = snapshotToArray(col);
							data.forEach(d => {
								rebase.removeDoc(`monitoring-servers_results/${d.id}`);
							});
						})

					this.props.history.push(`/monitoring/mail-servers`);
				}).catch(err => {
				//handle error
			});

	}

	render() {
		let ITEMS = this.state.data.map(datum => {
			let company = this.state.companies.find(comp => comp.id === datum.company);
			return {
				id: datum.id ? datum.id : "none",
				title: datum.title ? datum.title : "none",
				company: company ? company.title : "none",
				testEmail: datum.testEmail ? datum.testEmail : "none",
				success: (datum.success !== null && datum.success !== undefined) ? (datum.success ? "OK" : "FAILED") : "unknown",
				lastResp: datum.lastResp ? datum.lastResp : "none",
			}
		}).filter(item =>
					item.title.toLowerCase().includes(this.state.filterByTitle.toLowerCase())
					&& item.company.toLowerCase().includes(this.state.filterByCompany.toLowerCase())
					&& item.testEmail.toLowerCase().includes(this.state.filterByTestMail.toLowerCase())
					&& item.success.toLowerCase().includes(this.state.filterByStatus.toLowerCase())
					&& item.lastResp.toLowerCase().includes(this.state.filterByLastResp.toLowerCase())
				);


	return (
				<div>
					<div className="commandbar p-l-20">
						<div className="search-row">
							<div className="search">
								<button className="search-btn" type="button">
									<i className="fa fa-search" />
								</button>
									<input
										type="text"
										value={this.state.search}
										className="form-control search-text"
										onChange={(e)=>this.setState({search:e.target.value})}
										placeholder="Search" />
							</div>

							<Button className="btn-link center-hor">
								Global
							</Button>
						</div>

						<Button className="btn-link center-hor" onClick={() => this.props.history.push("/monitoring/mail-servers/add")}>
							<i className="fa fa-plus"/> Mail server
						</Button>

					</div>

				<div className="fit-with-header-and-commandbar row">
					<div className="p-t-20 p-b-20 p-l-15 p-r-15 scrollable golden-ratio-618" style={this.props.layout===1?{flex:'auto'}:{}}>

						<table  className="table">
								<thead>
									<tr>
										<th>Title</th>
										<th>Company</th>
										<th>Test email</th>
										<th>Status</th>
										<th>Last response</th>
										<th>Action</th>
									</tr>
								</thead>
								<tbody>
									<tr>
										<td>
											<input
											type="text"
											value={this.state.filterByTitle}
											className="form-control"
											onChange={(e)=>this.setState({filterByTitle:e.target.value})}
											placeholder="Filter by title" />
										</td>
										<td>
											<input
											type="text"
											value={this.state.filterByCompany}
											className="form-control"
											onChange={(e)=>this.setState({filterByCompany:e.target.value})}
											placeholder="Filter by company" />
										</td>
										<td>
											<input
											type="text"
											value={this.state.filterByTestMail}
											className="form-control"
											onChange={(e)=>this.setState({filterByTestMail:e.target.value})}
											placeholder="Filter by test mail" />
										</td>
										<td>
											<input
											type="text"
											value={this.state.filterByStatus}
											className="form-control"
											onChange={(e)=>this.setState({filterByStatus:e.target.value})}
											placeholder="Filter by status" />
										</td>
										<td>
											<input
											type="text"
											value={this.state.filterByLastResp}
											className="form-control"
											onChange={(e)=>this.setState({filterByLastResp:e.target.value})}
											placeholder="Filter by last response" />
										</td>
										<td>
										</td>
									</tr>
									{
										ITEMS.map(item =>
													<tr
														className={classnames({ 'active': this.props.match.params.itemID === item.id.toString(), clickable:true })}
														key={item.id}
														onClick={()=>{
															if(this.props.layout===1){
																this.setState({editOpened:true, openedID:item.id});

															}else{
																this.props.history.push(`/monitoring/mail-servers/edit/${item.id}`);
															}
														}}>
														<td>{item.title}</td>
														<td>{item.company}</td>
														<td>{item.testEmail}</td>
														<td>{item.success}</td>
														<td>{item.lastResp}</td>
														<td>
															<Button className="btn-link" onClick={() => this.removeItem(item.id)}>
																<i className="fa fa-trash"/>
															</Button>
														</td>
													</tr>
												)
									}
								</tbody>
							</table>
					</div>

					{!this.props.match.params.itemID && this.props.layout === 0 && <Empty />}

					{this.props.match.params.itemID && this.props.layout === 0 && <Container id={this.props.match.params.itemID} isModal={false}/>}

					</div>
					<Modal cisOpen={this.state.editOpened} >
						<ModalHeader>
              Edit
            </ModalHeader>
		        <ModalBody>
		          <Container id={this.state.openedID} isModal={true} />
		        </ModalBody>
		        <ModalFooter>
		          <Button className="btn-link mr-auto" onClick={() => this.setState({editOpened:!this.state.editOpened})}>
		            Close
		          </Button>
		        </ModalFooter>
		      </Modal>

				</div>
			);
		}
	}

	const mapStateToProps = ({ appReducer }) => {
		return { layout:appReducer.layout };
	};

	export default connect(mapStateToProps, { })(MailServerList);
