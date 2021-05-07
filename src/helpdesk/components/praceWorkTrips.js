import React, {
  Component
} from 'react';
import {
  Input
} from 'reactstrap';
import Select from 'react-select';
import {
  pickSelectStyle
} from 'configs/components/select';
import {
  sameStringForms
} from '../../helperFunctions';

export default class PraceWorkTrips extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      showAddSubtask: false,

      editedSubtaskTitle: "",
      editedSubtaskType: null,
      editedSubtaskQuantity: 0,
      editedSubtaskDiscount: 0,
      focusedSubtask: null,
      selectedIDs: [],

      newSubtaskTitle: '',
      newSubtaskType: this.props.defaultType,
      newSubtaskAssigned: this.props.taskAssigned.length > 0 ? this.props.taskAssigned[ 0 ] : null,
      newSubtaskQuantity: 0,
      newSubtaskDiscount: 0,

      //trips
      showAddTrip: false,

      focusedTrip: null,
      editedTripQuantity: 0,
      editedTripDiscount: 0,

      newTripType: this.props.tripTypes.length > 0 ? this.props.tripTypes[ 0 ] : null,
      newTripAssignedTo: this.props.taskAssigned.length > 0 ? this.props.taskAssigned[ 0 ] : null,
      newTripQuantity: 1,
      newTripDiscount: 0,
    }
    this.onFocusWorkTrip.bind( this );
    this.onFocusSubtask.bind( this );
    this.getTotalPrice.bind( this );
    this.getTotalDiscountedPrice.bind( this );
    this.getDPH.bind( this );
  }

  componentWillReceiveProps( props ) {
    if ( this.props.taskID !== props.taskID ) {
      this.setState( {
        focusedSubtask: null,
        showAddSubtask: false,
        newSubtaskTitle: '',
        newSubtaskType: props.defaultType,
        newSubtaskQuantity: 0,
        newSubtaskDiscount: 0,
        newSubtaskAssigned: props.taskAssigned.length > 0 ? props.taskAssigned[ 0 ] : null,

        focusedTrip: null,
        showAddTrip: false,
        newTripType: props.tripTypes.length > 0 ? props.tripTypes[ 0 ] : null,
        newTripAssignedTo: props.taskAssigned.length > 0 ? props.taskAssigned[ 0 ] : null,
        newTripQuantity: 1,
        newTripDiscount: 0,
      } )
    } else if ( !sameStringForms( this.props.defaultType, props.defaultType ) ) {
      this.setState( {
        newSubtaskType: props.defaultType,
      } )
    }

    if ( !sameStringForms( this.props.taskAssigned, props.taskAssigned ) ) {
      if ( !props.taskAssigned.some( ( item ) => item.id === ( this.state.newSubtaskAssigned ? this.state.newSubtaskAssigned.id : null ) ) ) {
        if ( props.taskAssigned.length > 0 ) {
          this.setState( {
            newSubtaskAssigned: props.taskAssigned[ 0 ],
            newTripAssignedTo: props.taskAssigned[ 0 ]
          } );
        } else {
          this.setState( {
            newSubtaskAssigned: null,
            newTripAssignedTo: null
          } );
        }
      }
    }
  }

  getCreationError() {
    let noType = this.state.newSubtaskType === null;
    let noAssigned = this.state.newSubtaskAssigned === null;
    let noCompany = this.props.company === null;
    if ( !noType && !noAssigned && !noCompany ) {
      return ''
    }
    if ( noType && noAssigned && noCompany ) {
      return 'You must first assign the task to someone, pick task type and company!';
    }
    if ( !noType && noAssigned && noCompany ) {
      return 'You must first assign the task to someone and pick company!';
    }
    if ( !noType && !noAssigned && noCompany ) {
      return 'You must first pick company!';
    }
    if ( !noType && noAssigned && !noCompany ) {
      return 'You must first assign the task to someone!';
    }
    if ( noType && !noAssigned && noCompany ) {
      return 'You must first pick task type and company!';
    }
    if ( noType && !noAssigned && !noCompany ) {
      return 'You must first pick task type!';
    }
    if ( noType && noAssigned && !noCompany ) {
      return 'You must first assign the task to someone and pick task type!';
    }
  }

  onFocusWorkTrip( trip ) {
    this.setState( {
      editedTripQuantity: trip.quantity,
      editedTripDiscount: trip.discount,
      focusedTrip: trip.id
    } )
  }

  onFocusSubtask( subtask ) {
    this.setState( {
      editedSubtaskTitle: subtask.title,
      editedSubtaskQuantity: subtask.quantity ? subtask.quantity : '',
      editedSubtaskType: subtask.type,
      editedSubtaskDiscount: subtask.discount,
      focusedSubtask: subtask.id
    } );
  }

  getPrice( type ) {
    if ( !type ) {
      return NaN;
    }
    let price = ( this.props.company.pricelist ? type.prices.find( ( price ) => price.pricelist === this.props.company.pricelist.id ) : undefined );
    if ( price === undefined ) {
      price = NaN;
    } else {
      price = price.price;
    }
    return parseFloat( parseFloat( price )
      .toFixed( 2 ) );
  }

  getTotalPrice( item ) {
    return parseFloat( this.getPrice( item.type ) * parseInt( item.quantity )
      .toFixed( 2 ) )
  }

  getTotalDiscountedPrice( item ) {
    return parseFloat( parseFloat( this.getTotalPrice( item ) * ( 100 - parseInt( item.discount ) ) / 100 )
      .toFixed( 2 ) )
  }

  getDPH() {
    let dph = 20;
    if ( this.props.company && this.props.company.dph > 0 ) {
      dph = this.props.company.dph;
    }
    return ( 100 + dph ) / 100;
  }

  render() {
    //const afterHours= this.props.company && this.state.newExtraWork ? this.props.company.pricelist.afterHours : 0;
    return (
      <div className="row m-b-30">
					<div className="col-md-12">
						<div>
							<div className="" style={{color: "#FF4500", height: "20px"}}>
								{this.getCreationError()}
							</div>
							<table className="table m-t--30">
								<thead>
									<tr>
										{ this.props.showColumns.includes(0) && <th width="25" className="col-form-label p-l-0">Práce</th>}
										{ this.props.showColumns.includes(1) && <th>{/* Typ / Nazov */}</th>}
										{ this.props.showColumns.includes(2) && <th style={{fontSize: "12px", fontFamily: "Segoe UI", fontWeight: "500", color: "#333"}} width="170">Rieši</th>}
										{ this.props.showColumns.includes(3) && <th width="100">Typ</th>}
										{ this.props.showColumns.includes(4) && <th width="100">Mn.</th>}
										{ this.props.showColumns.includes(5) && <th width="100" className="table-highlight-background">Cena/Mn.</th>}
										{ this.props.showColumns.includes(6) && <th width="100" className="table-highlight-background">Zlava</th>}
										{ this.props.showColumns.includes(7) && <th width="130" className="table-highlight-background">Spolu</th>}
										{ this.props.showColumns.includes(8) && <th className="t-a-c" width="100"></th>}
									</tr>
								</thead>
								<tbody>
									{
										this.props.subtasks.map((subtask)=>
										<tr key={subtask.id}>
											{ this.props.showColumns.includes(0) && <td className="table-checkbox p-l-0">
												<label className="custom-container">
													<Input type="checkbox"
														checked={subtask.done}
														disabled={this.props.disabled}
														onChange={()=>{
															this.props.updateSubtask(subtask.id,{done:!subtask.done})
															}} />
													<span className="checkmark" style={{ marginTop: "-3px"}}> </span>
												</label>
											</td>}
											{ this.props.showColumns.includes(1) && <td>
												<div>
													<input
														disabled={this.props.disabled}
														className="form-control hidden-input"
														value={
															subtask.id === this.state.focusedSubtask
															? this.state.editedSubtaskTitle
															: subtask.title
														}
														onBlur={() => {
															this.props.updateSubtask(subtask.id,{title:this.state.editedSubtaskTitle})
															this.setState({ focusedSubtask: null });
														}}
														onFocus={() => {
															this.onFocusSubtask(subtask);
														}}
														onChange={e =>{
															this.setState({ editedSubtaskTitle: e.target.value })}
														}
														/>
												</div>
											</td>}

											{ this.props.showColumns.includes(2) && <td>
												<Select
													isDisabled={this.props.disabled}
													value={subtask.assignedTo}
													onChange={(assignedTo)=>{
														this.props.updateSubtask(subtask.id,{assignedTo:assignedTo.id})
													}}
													options={this.props.taskAssigned}
													styles={pickSelectStyle([ 'invisible', ])}
													/>
											</td> }

											{ this.props.showColumns.includes(3) && <td>
												<Select
													isDisabled={this.props.disabled}
													value={subtask.type}
													onChange={(type)=>{
														this.props.updateSubtask(subtask.id,{type:type.id})
													}}
													options={this.props.workTypes}
													styles={pickSelectStyle([ 'invisible', ])}
													/>
											</td>}

											{ this.props.showColumns.includes(4) && <td>
												<input
													disabled={this.props.disabled}
													type="number"
													className="form-control hidden-input h-30"
													value={
														subtask.id === this.state.focusedSubtask
														? this.state.editedSubtaskQuantity
														: subtask.quantity
													}
													onBlur={() => {
														this.props.updateSubtask(subtask.id,{quantity:isNaN(parseInt(this.state.editedSubtaskQuantity))?0:parseInt(this.state.editedSubtaskQuantity)})
														this.setState({ focusedSubtask: null });
													}}
													onFocus={() => {
														this.onFocusSubtask(subtask);
													}}
													onChange={e =>{
														this.setState({ editedSubtaskQuantity: e.target.value })}
													}
													/>
											</td>}

											{ this.props.showColumns.includes(5) && <td className="table-highlight-background">
												{ isNaN(this.getPrice(subtask.type))?
													'No price'
													:
													this.getPrice(subtask.type)
												}
											</td>}

											{ this.props.showColumns.includes(6) && <td className="table-highlight-background">
												<input
													disabled={this.props.disabled}
													type="number"
													className="form-control hidden-input h-30"
													value={
														parseInt(subtask.id === this.state.focusedSubtask ?
															this.state.editedSubtaskDiscount :
															subtask.discount)
													}
													onBlur={() => {
														this.props.updateSubtask(subtask.id,{discount:isNaN(parseInt(this.state.editedSubtaskDiscount))?0:parseInt(this.state.editedSubtaskDiscount)})
														this.setState({ focusedSubtask: null });
													}}
													onFocus={() => {
														this.onFocusSubtask(subtask);
													}}
													onChange={e =>{
														this.setState({ editedSubtaskDiscount: e.target.value })}
													}
												/>
											</td>}

											{ this.props.showColumns.includes(7) && <td className="table-highlight-background">
												{isNaN(this.getTotalDiscountedPrice(subtask))?
													'No price'
													:
													this.getTotalDiscountedPrice(subtask)}
											</td>}

											{ this.props.showColumns.includes(8) && <td className="t-a-r">
												<button className="btn-link" disabled={this.props.disabled}>
													<i className="fa fa-arrow-up"  />
												</button>
												<button className="btn-link" disabled={this.props.disabled}>
														<i className="fa fa-arrow-down"  />
												</button>
												<button className="btn-link" disabled={this.props.disabled}
													onClick={()=>{
														if(window.confirm('Are you sure?')){
															this.props.removeSubtask(subtask.id);
														}
													}}>
													<i className="fa fa-times" />
												</button>
											</td>}
										</tr>
										)
									}
									{/* END OF GENERATED Works*/}
									{
										this.props.workTrips.map((trip)=>
										<tr key={trip.id}>
											{ this.props.showColumns.includes(0) && <td className="table-checkbox">
												<label className="custom-container">
													<Input type="checkbox"
														checked={trip.done}
														disabled={this.props.disabled}
														onChange={()=>{
															this.props.updateTrip(trip.id,{done:!trip.done})
															}} />
														<span className="checkmark" style={{ marginTop: "-3px"}}> </span>
												</label>
											</td>}
											{ this.props.showColumns.includes(1) && <td>
												<Select
													isDisabled={this.props.disabled}
													value={trip.type}
													onChange={(type)=>{
														this.props.updateTrip(trip.id,{type:type.id})
													}}
													options={this.props.tripTypes}
													styles={pickSelectStyle([ 'invisible', ])}
													/>
											</td>}
											{ this.props.showColumns.includes(2) && <td>
												<Select
													isDisabled={this.props.disabled}
													value={trip.assignedTo}
													onChange={(assignedTo)=>{
														this.props.updateTrip(trip.id,{assignedTo:assignedTo.id})
													}}
													options={this.props.taskAssigned}
													styles={pickSelectStyle([ 'invisible', ])}
													/>
											</td>}
											{ this.props.showColumns.includes(3) && <td>Výjazd</td>}
											{ this.props.showColumns.includes(4) && <td>
												<input
													disabled={this.props.disabled}
													type="number"
													className="form-control hidden-input h-30"
													value={
														trip.id === this.state.focusedTrip
														? this.state.editedTripQuantity
														: trip.quantity
													}
													onBlur={() => {
														this.props.updateTrip(trip.id,{quantity:isNaN(parseInt(this.state.editedTripQuantity))?0:parseInt(this.state.editedTripQuantity)})
														this.setState({ focusedTrip: null });
													}}
													onFocus={() => {
														this.onFocusWorkTrip(trip);
													}}
													onChange={e =>{
														this.setState({ editedTripQuantity: e.target.value })}
													}
													/>
											</td>}
											{ this.props.showColumns.includes(5) && <td className="table-highlight-background">
												{isNaN(this.getPrice(trip.type))?
													'No price'
													:
													this.getPrice(trip.type)}
											</td>}
											{ this.props.showColumns.includes(6) && <td className="table-highlight-background">
												<input
													disabled={this.props.disabled}
													type="number"
													className="form-control hidden-input h-30"
													value={
														trip.id === this.state.focusedTrip
														? this.state.editedTripDiscount
														: trip.discount
													}
													onBlur={() => {
														this.props.updateTrip(trip.id,{discount:isNaN(parseInt(this.state.editedTripDiscount))?0:parseInt(this.state.editedTripDiscount)})
														this.setState({ focusedTrip: null });
													}}
													onFocus={() => {
														this.onFocusWorkTrip(trip);
													}}
													onChange={e =>{
														this.setState({ editedTripDiscount: e.target.value })}
													}
													/>
											</td>}
											{ this.props.showColumns.includes(7) && <td className="table-highlight-background">
												{isNaN(this.getTotalDiscountedPrice(trip))?
													'No price'
													:
													this.getTotalDiscountedPrice(trip)}
											</td>}
											{ this.props.showColumns.includes(8) && <td className="t-a-r">
												<button className="btn-link" disabled={this.props.disabled}>
													<i className="fa fa-arrow-up"  />
												</button>
												<button className="btn-link" disabled={this.props.disabled}>
														<i className="fa fa-arrow-down"  />
												</button>
												<button className="btn-link" disabled={this.props.disabled}
													onClick={()=>{
														if(window.confirm('Are you sure?')){
															this.props.removeTrip(trip.id);
														}
													}}>
													<i className="fa fa-times" />
												</button>
											</td>}
										</tr>
									)}
									{/* END OF GENERATED Work trips*/}
									{/* ADD work form*/}
									{this.state.showAddSubtask && !this.props.disabled &&
										<tr>
											{ this.props.showColumns.includes(1) && <td colSpan={this.props.showColumns.includes(0)?2:1}>
												<input
													disabled={this.props.disabled}
													type="text"
													className="form-control"
													id="inlineFormInput"
													placeholder=""
													value={this.state.newSubtaskTitle}
													onChange={(e)=>this.setState({newSubtaskTitle:e.target.value})}
													/>
											</td>}
											{ this.props.showColumns.includes(2) && <td>
												<Select
													isDisabled={this.props.disabled}
													value={this.state.newSubtaskAssigned}
													onChange={(newSubtaskAssigned)=>{
														this.setState({newSubtaskAssigned})
														}
													}
													options={this.props.taskAssigned}
													styles={pickSelectStyle()}
													/>
											</td>}
											{ this.props.showColumns.includes(3) && <td>
												<Select
													isDisabled={this.props.disabled}
													value={this.state.newSubtaskType}
													options={this.props.workTypes}
													onChange={(type)=>{
														this.setState({newSubtaskType:type})
														}
													}
													styles={pickSelectStyle()}
													/>
											</td>}
											{ this.props.showColumns.includes(4) && <td>
												<input
													disabled={this.props.disabled}
													type="number"
													value={this.state.newSubtaskQuantity}
													onChange={(e)=>this.setState({newSubtaskQuantity:e.target.value})}
													className="form-control h-30"
													id="inlineFormInput"
													placeholder=""
													/>
											</td>}
											{ this.props.showColumns.includes(5) && <td className="table-highlight-background">
												{isNaN(this.getPrice(this.state.newSubtaskType))?
													'No price'
													:
													this.getPrice(this.state.newSubtaskType)
												}
											</td>}
											{ this.props.showColumns.includes(6) && <td className="table-highlight-background">
												<input
													disabled={this.props.disabled}
													type="number"
													value={this.state.newSubtaskDiscount}
													onChange={(e)=>this.setState({newSubtaskDiscount:e.target.value})}
													className="form-control input h-30"
													id="inlineFormInput"
													placeholder=""
													/>
											</td>}
											{ this.props.showColumns.includes(7) && <td className="table-highlight-background">
												{isNaN(this.getTotalDiscountedPrice({discount:this.state.newSubtaskDiscount,quantity:this.state.newSubtaskQuantity,type:this.state.newSubtaskType}))?
													'No price'
													:
													this.getTotalDiscountedPrice({discount:this.state.newSubtaskDiscount,quantity:this.state.newSubtaskQuantity,type:this.state.newSubtaskType})
												}
											</td>}
											{ this.props.showColumns.includes(8) && <td className="t-a-r">
											<button className="btn-link"
												disabled={this.state.newSubtaskType===null||this.props.disabled|| this.state.newSubtaskAssigned===null}
												onClick={()=>{
													let body={
														done:false,
														title:this.state.newSubtaskTitle,
														type: this.state.newSubtaskType.id,
														quantity:this.state.newSubtaskQuantity!==''?parseInt(this.state.newSubtaskQuantity):0,
														discount:this.state.newSubtaskDiscount!==''?parseInt(this.state.newSubtaskDiscount):0,
														assignedTo:this.state.newSubtaskAssigned?this.state.newSubtaskAssigned.id:null
													}
													this.setState({
														newSubtaskTitle:'',
														newSubtaskQuantity:0,
														newSubtaskDiscount:0,
														assignedTo:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null,
														showAddSubtask: false,
													});
													this.props.submitService(body);
													}
												}
												>
												<i className="fa fa-plus" />
											</button>
											<button className="btn-link"
												disabled={this.props.disabled}
												onClick={()=>{
													this.setState({showAddSubtask: false})
												}}>
												<i className="fa fa-times"  />
												</button>
										</td>}
										</tr>
									}
									{/* ADD trip form*/}
									{this.state.showAddTrip && !this.props.disabled &&
										<tr>
											{ this.props.showColumns.includes(1) && <td colSpan={this.props.showColumns.includes(0)?2:1}>
												<Select
													isDisabled={this.props.disabled}
													value={this.state.newTripType}
													onChange={(newTripType)=>{
															this.setState({newTripType})
														}
													}
													options={this.props.tripTypes}
													styles={pickSelectStyle()}
													/>
											</td>}
											{ this.props.showColumns.includes(2) && <td>
												<Select
													isDisabled={this.props.disabled}
													value={this.state.newTripAssignedTo}
													onChange={(newTripAssignedTo)=>{
														this.setState({newTripAssignedTo})
														}
													}
													options={this.props.taskAssigned}
													styles={pickSelectStyle()}
													/>
											</td>}
											{ this.props.showColumns.includes(3) && <td>Výjazd</td>}
											{ this.props.showColumns.includes(4) && <td>
												<input
													disabled={this.props.disabled}
													type="number"
													value={this.state.newTripQuantity}
													onChange={(e)=>this.setState({newTripQuantity:e.target.value})}
													className="form-control h-30"
													id="inlineFormInput"
													placeholder="Quantity"
													/>
											</td>}
											{ this.props.showColumns.includes(5) && <td className="table-highlight-background">
												{isNaN(this.getPrice(this.state.newTripType))?
													'No price'
													:
													this.getPrice(this.state.newTripType)
												}
											</td>}
											{ this.props.showColumns.includes(6) && <td className="table-highlight-background">
												<input
													disabled={this.props.disabled}
													type="number"
													value={this.state.newTripDiscount}
													onChange={(e)=>this.setState({newTripDiscount:e.target.value})}
													className="form-control h-30"
													id="inlineFormInput"
													placeholder="Discount"
													/>
											</td>}
											{ this.props.showColumns.includes(7) && <td className="table-highlight-background">
												{isNaN(this.getTotalDiscountedPrice({discount:this.state.newTripDiscount,quantity:this.state.newTripQuantity,type:this.state.newTripType}))?
													'No price'
													:
													this.getTotalDiscountedPrice({discount:this.state.newTripDiscount,quantity:this.state.newTripQuantity,type:this.state.newTripType})
												}
											</td>}
											{ this.props.showColumns.includes(8) && <td className="t-a-r">
												<button className="btn-link"
													disabled={this.state.newTripType===null||isNaN(parseInt(this.state.newTripQuantity))||this.props.disabled|| this.state.newTripAssignedTo===null}
													onClick={()=>{
														let body={
															type:this.state.newTripType?this.state.newTripType.id:null,
															assignedTo: this.state.newTripAssignedTo?this.state.newTripAssignedTo.id:null,
															quantity: this.state.newTripQuantity!==''?this.state.newTripQuantity:0,
															discount: this.state.newTripDiscount!==''?this.state.newTripDiscount:0,
															done: false,
														}

														this.setState({
															newTripAssignedTo:this.props.taskAssigned.length>0?this.props.taskAssigned[0]:null,
															newTripQuantity:1,
															newTripDiscount:0,
															showAddTrip:false
														});
														this.props.submitTrip(body);
														}
													}
													>
													<i className="fa fa-plus" />
												</button>
												<button className="btn-link"
													disabled={this.props.disabled}
													onClick={()=>{
														this.setState({showAddTrip: false,showAddSubtask:false})
													}}>
													<i className="fa fa-times"  />
													</button>
											</td>}
										</tr>}
									{/* Add buttons */}
									{!this.state.showAddSubtask && !this.state.showAddTrip && !this.props.disabled &&
										<tr >
											<td colSpan={this.props.showColumns.length}>
												{!this.state.showAddSubtask && <button className="btn btn-table-add-item"
													disabled={this.props.disabled}
													onClick={()=>{
														this.setState({showAddSubtask: true});
													}}>
													+ Práca
												</button>}
												{!this.state.showAddTrip && <button className="btn btn-table-add-item"
													disabled={this.props.disabled}
													onClick={()=>{
														this.setState({showAddTrip: true});
													}}>
													+ Výjazd
												</button>}
											</td>
										</tr>
									}
								</tbody>
							</table>
						</div>
						{/* Totals */}
						{this.props.showTotals &&
							(this.props.workTrips.length + this.props.subtasks.length > 0) &&
							<div className="row">
								<div className="text-right ml-auto m-r-5">
									<b>Cena bez DPH: </b>
									{this.props.subtasks.concat(this.props.workTrips).reduce((acc, cur)=> acc+(isNaN(this.getTotalPrice(cur))?0:this.getTotalPrice(cur)),0).toFixed(2)}
								</div>
								<div className="text-right m-r-5">
									<b>DPH: </b>
									{this.getDPH()}
								</div>
								<div className="text-right">
									<b>Cena s DPH: </b>
									{this.props.subtasks.concat(this.props.workTrips).reduce((acc, cur)=> acc+(isNaN(this.getTotalPrice(cur))?0:this.getTotalPrice(cur)*this.getDPH()),0).toFixed(2)}
								</div>
							</div>}

						{false &&
							this.props.showTotals &&
							<div className="row">
							<p className="text-right" style={{marginTop: (((this.state.showAddSubtask||this.state.showAddTrip) || this.props.disabled) ? "" : "")}}>
								<b>Zľava: </b>
								{this.props.subtasks.concat(this.props.workTrips).reduce((acc, cur)=> acc+(isNaN(this.getTotalPrice(cur)*(cur.discount))?0:this.getTotalPrice(cur)*(cur.discount)/100),0).toFixed(2)}
							</p>
						</div>}
						{false &&
							this.props.showTotals && <div>
							<p className="text-right" style={{marginTop: (((this.state.showAddSubtask||this.state.showAddTrip) || this.props.disabled) ? "" : "")}}>
								<b>Cena bez DPH po zlave: </b>
								{this.props.subtasks.concat(this.props.workTrips).reduce((acc, cur)=> acc+(isNaN(this.getTotalDiscountedPrice(cur))?0:this.getTotalDiscountedPrice(cur)),0).toFixed(2)}
							</p>
						</div>}

						{false &&
							this.props.showTotals && <div>
							<p className="text-right" style={{marginTop: (((this.state.showAddSubtask||this.state.showAddTrip) || this.props.disabled) ? "" : "")}}>
								<b>Cena s DPH po zlave: </b>
								{this.props.subtasks.concat(this.props.workTrips).reduce((acc, cur)=> acc+(isNaN(this.getTotalDiscountedPrice(cur))?0:this.getTotalDiscountedPrice(cur)*this.getDPH()),0).toFixed(2)}
							</p>
						</div>}

						<div className="row justify-content-end">
							<div className="col-md-6">
							</div>
						</div>
					</div>
				</div>
    );
  }
}