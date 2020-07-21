import React, { Component } from 'react';
import { Modal, ModalBody } from 'reactstrap';
import {getItemDisplayValue} from '../../helperFunctions';
import CommandBar from './commandBar';
import ListHeader from './listHeader';
import { connect } from "react-redux";
import {setShowDataFilter } from '../../redux/actions';
import Checkbox from '../checkbox';

import MultipleTaskEdit from '../../helpdesk/task/multipleTaskEdit';

class List extends Component {

	constructor(props) {
		super(props);
		this.state = {
			checkedAll: false,
			editOpen: false,
		};
		this.clearFilter.bind(this);
	}

	clearFilter(){
		if(window.confirm("Are you sure you want to clear the filter?")){
			let defaultFilter={};
			this.props.displayValues.forEach((display)=>{
				defaultFilter[display.value]=''
			})
			this.props.setShowDataFilter(this.props.filterName,defaultFilter);
		}
	}

	render() {
		let filter = this.props.filter[this.props.filterName];

		return (
				<div>
					<CommandBar {...this.props.commandBar} listName={this.props.listName}/>
					<div className="full-width scroll-visible fit-with-header-and-commandbar task-container">
						<ListHeader {...this.props.commandBar} listName={this.props.listName} statuses={this.props.statuses} setStatuses={this.props.setStatuses} allStatuses={this.props.allStatuses} />
						<table className="table">
							<thead>
									<tr>
										{
											this.props.displayValues.map((display,index)=> {
												if(display.type==='important') {
													return null;
												}else if (display.type === 'checkbox'){
													return <th key={display.value} className="row" colSpan={'1'} style={{color: '#0078D4', paddingLeft: "1px", paddingRight: "1px"}}>
														 <div
															 onClick={() => {
																 if( !this.props.data.some( (item) => item.checked ) ){
																	 window.alert('Please first pick tasks to delete!');
																	 return;
																 }
																 if (window.confirm("Are you sure you want to delete checked tasks?")){
																	 this.props.deleteTask()
																 }
															 }}>
																<i className="far fa-trash-alt clickable"	/>
															</div>
															<div
																className="ml-auto"
																onClick={() => {
																	if( !this.props.data.some( (item) => item.checked ) ){
 																	 window.alert('Please first pick tasks to edit!');
 																	 return;
 																 }
																	this.setState({
																		editOpen: true,
																	})
																}}>
																<i	className="fas fa-pen clickable"/>
															</div>
													 	</th>
												}
												return (
													<th
														style={(display.value === "createdAt" || display.value === "deadline" ? {textAlign: "right"} : {})}
														colSpan={((index===0 || index ===1 || this.props.displayValues[index-1].type!=='important') && display.value !== "deadline")?'1':'2'}
														key={display.value}
														width={display.value === 'title' ? "30%" : ((display.value === "id") ? "50px" : '')}>
														{display.label}
													</th>
												)
											}
										)}
									</tr>
								</thead>

								<tbody>
									<tr>
										{
											this.props.displayValues.map((display,index)=>{
												if(display.type==='important'){
													return null;
												}else if (display.type === 'checkbox'){
													return <th key={display.value} colSpan={'1'} >
														<Checkbox
															className = "m-l-7 m-t-3 p-l-0"
															value = { this.state.checkedAll }
															label = ""
															onChange={(e)=> {this.props.checkTask('all', e.target.checked); this.setState({ checkedAll: !this.state.checkedAll })}}
															highlighted={false}
															/>
													</th>
												}else {
													return <th key={display.value} colSpan={((index===0 || index ===1 || this.props.displayValues[index-1].type!=='important') )?'1':'2'} >
														<div className={(display.value === "deadline" ? "row" : "")}>

															<div style={{width: "80%"}}>
																<input
																	type="text"
																	value={filter[display.value]}
																	className="form-control hidden-input"
																	style={{fontSize: "12px", marginRight: "10px"}}
																	onChange={(e) => {
																		let newFilterData={};
																		newFilterData[display.value]=e.target.value;
																		this.props.setShowDataFilter(this.props.filterName,newFilterData);
																	}}/>
																</div>
														{display.value === "deadline" &&
															<div>
																<button type="button" className="btn btn-link waves-effect" onClick={this.clearFilter.bind(this)}>
																	<i
																		className="fas fa-times commandbar-command-icon m-l-8 text-highlight"
																		/>
																</button>
															</div>
														}
													</div>
														</th>
												}
											}
										)}
									</tr>
									{
										this.props.data
										.filter((item) =>
										{
											return this.props.displayValues
														.every((display)=> {
															let value = getItemDisplayValue(item,display);
															if(display.value === "assignedTo"){
																value = item["assignedTo"].map(item => `${item.name} ${item.surname} (${item.email})`).toString();
															}
															if(display.value === "status"){
																value = item["status"] ? item["status"].title.toString() : "";
															}
															if(display.value === "tags"){
																value = item["tags"].map(item => `${item.title}`).toString();
															}
															if(display.value === "URL"){
																value = item["URL"];
															}
															if(display.value === "password"){
																value = item["password"];
															}
															if(display.value === 'important'){
																return true;
															}
															return value.toString().toLowerCase().includes(filter[display.value].toLowerCase());
														});
										}).map((item)=>
											<tr
												key={item.id}
												className="clickable">
												{ this.props.displayValues
													.map((display,index)=>
													<td
														colSpan={(index===this.props.displayValues.length-1)?"2":"1"}
														style={(display.value === "createdAt" || display.value === "deadline" ? {textAlign: "right"} : {})}
														key={display.value}
														className={display.value}
														onClick={(e)=>{
															if (display.type !== 'checkbox'){
																this.props.history.push(this.props.link+'/'+item.id);
															}
														}}
														>
														{	display.type !== 'checkbox' &&
															getItemDisplayValue(item,display)
														}
														{ display.type === 'checkbox' &&
															<Checkbox
																className = "p-l-0"
																value = { item.checked }
																label = ""
																disabled = { item.viewOnly === true }
																onChange={(e)=> this.props.checkTask(item.id, e.target.checked)}
																highlighted={false}
																/>
														}
													</td>
												)}
											</tr>
									)}
								</tbody>
							</table>
					</div>


					<Modal isOpen={this.state.editOpen}  >
							<ModalBody className="scrollable" >
		            <MultipleTaskEdit tasks={this.props.data.filter(d => d.checked)} close={() => this.setState({editOpen: false})} />
							</ModalBody>
						</Modal>

				</div>
		);
	}
}

const mapStateToProps = ({ showDataReducer }) => {
	return { filter:showDataReducer.filter  };
};

export default connect(mapStateToProps, { setShowDataFilter })(List);
