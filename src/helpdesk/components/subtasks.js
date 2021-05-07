import React, {
  Component
} from 'react';
import Select from 'react-select';
import {
  TabContent,
  TabPane,
  Input
} from 'reactstrap';
import {
  pickSelectStyle
} from 'configs/components/select';


export default class Subtasks extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      editedTitle: "",
      focused: null,
      activeTab: "1",

      newTitle: '',
      //newAssigned:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null
    }
    this.onFocus.bind( this );
  }

  onFocus( subtask ) {
    this.setState( {
      editedTitle: subtask.title,
      focused: subtask.id
    } );
  }

  componentWillReceiveProps( props ) {
    if ( this.props.match.params.taskID !== props.match.params.taskID ) {
      this.setState( {
        newTitle: '',
      } )
    }
    /*if(this.props.taskAssigned.length!==props.taskAssigned.length || (props.taskAssigned.length>0 && props.taskAssigned[0].id!==this.props.taskAssigned[0].id) ){
    	if(!props.taskAssigned.some((item)=>item.id===(this.state.newAssigned?this.state.newAssigned.id:null))){
    		if(props.taskAssigned.length>0){
    			this.setState({newAssigned:props.taskAssigned[0]});
    		}else{
    			this.setState({newAssigned:null});
    		}
    	}
    }*/
  }

  render() {
    return (
      <div className="m-t-10">
				<div className="row">
					<div className="full-width">
				{/*		<Nav tabs className="b-0">
							<NavItem>
								<NavLink
									className={classnames({ active: this.state.activeTab === '1'}, "clickable", "")}
								>
									Podúlohy
								</NavLink>
							</NavItem>
						</Nav>*/}
						<TabContent activeTab={this.state.activeTab}>
							<TabPane tabId="1">
								<div className="row">
									<div className="col-md-12">
										<div >
											<table className="table">
												<thead >
													<tr  className="tr-no-lines">
														<th width="25">
															<label className="custom-container">
																<Input type="checkbox"
																	checked={false}
																	onChange={()=>{}}  />
																	<span className="checkmark" style={{ marginTop: "-8px"}}> </span>
															</label>
														</th>
														<th className="t-a-l p-l-15">Subtask</th>
														{false && <th width="170">Rieši</th>}
														<th className="t-a-r" width="124"></th>
													</tr>
												</thead>
												<tbody>
													{
														this.props.subtasks.map((subtask)=>
														<tr key={subtask.id}  className="tr-no-lines">
															<td className="custom-table-checkbox">
																	<label className="custom-container">
								                    <Input type="checkbox"
																			checked={subtask.done}
																			onChange={()=>{
																					this.props.updateSubtask(subtask.id,{done:!subtask.done});
																				}}  />
																			<span className="checkmark"> </span>
								                  </label>
																</td>
																<td>
																	<div>
																		<input
																			className="form-control hidden-input"
																			value={
																				subtask.id === this.state.focused
																				? this.state.editedTitle
																				: subtask.title
																			}
																			onBlur={() => {
																				//submit
																				this.props.updateSubtask(subtask.id,{title:this.state.editedTitle})
																				this.setState({ focused: null });
																			}}
																			onFocus={() => this.onFocus(subtask)}
																			onChange={e =>{
																				this.setState({ editedTitle: e.target.value })}
																			}
																			/>
																	</div>
																</td>
																{false && <td>
																	<Select
																		value={subtask.assignedTo}
																		onChange={(assignedTo)=>{
																			this.props.updateSubtask(subtask.id,{assignedTo:assignedTo.id})
																		}}
																		options={this.props.taskAssigned}
																		styles={pickSelectStyle([ 'invisible', ])}
																		/>
																</td>}
																<td className="t-a-r">
																	<button className="btn-link" onClick={()=>{
																			if(window.confirm('Are you sure?')){
																				this.props.removeSubtask(subtask.id);
																			}
																		}}>
																		<i className="fa fa-times"  />
																	</button>
																</td>
															</tr>
														)
													}

											{!this.state.showAddItem &&
												<tr >
													<td>
													</td>
													<td>
														<button className="btn-link"
															onClick={()=>{
															 this.setState({showAddItem: true});
															}}>
															+ Add New Item
														</button>
													</td>
												</tr>
											}

								{this.state.showAddItem &&
													<tr>
														<td>
															<button className="btn-link" onClick={()=>{
																	this.setState({showAddItem: false})
																}}>
																<i className="fa fa-times"  />
																</button>
														</td>
														<td className="row" style={{border: "none"}}>
															<div className="w-50">
																<input
																	type="text"
																	className="form-control"
																	id="inlineFormInput"
																	placeholder=""
																	value={this.state.newTitle}
																	onChange={(e)=>this.setState({newTitle:e.target.value})}
																	/>
															</div>
														{false && <td>
															<Select
																value={this.state.newAssigned}
																onChange={(newAssigned)=>{
																	this.setState({newAssigned})
																}
															}
															options={this.props.taskAssigned}
															styles={pickSelectStyle()}
															/>
													</td>}
													<div>
														<button className="btn-link"
															disabled={this.state.newTitle===''}
															onClick={()=>{
																let body={
																	title:this.state.newTitle,
																	//assignedTo:this.state.newAssigned?this.state.newAssigned.id:null,
																	done:false
																}
																this.setState({
																	newTitle:'',
																	//assignedTo:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null
																});
																this.props.submitService(body);
																	}
																}
																>
																<i className="fa fa-plus" />
															</button>
														</div>
												 </td>
												 <td></td>
												</tr>
											}
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</TabPane>
						</TabContent>
					</div>
				</div>
			</div>

    );
  }
}