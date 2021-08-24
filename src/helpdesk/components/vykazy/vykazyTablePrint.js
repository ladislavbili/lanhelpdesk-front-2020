import React, {
  Component
} from 'react';
import {
  Input,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import Select from 'react-select';
import {
  pickSelectStyle
} from 'configs/components/select';
import {
  sameStringForms,
} from 'helperFunctions';

export default class Rozpocet extends Component {
  constructor( props ) {
    super( props );
    const newMargin = this.props.company && this.props.company.pricelist ? this.props.company.pricelist.materialMargin : 0;
    const newUnit = this.props.units.find( ( item ) => item.id === this.props.defaultUnit );

    this.state = {
      toggleTab: "1",

      //prace
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

      //Materials
      showAddMaterial: false,

      editedMaterialTitle: "",
      editedMaterialQuantity: "0",
      editedMaterialUnit: null,
      editedMaterialMargin: null,
      editedMaterialPrice: null,
      focusedMaterial: null,
      //	selectedIDs:[],

      newTitle: '',
      newQuantity: 1,
      newUnit: newUnit ? newUnit : null,
      newMargin,
      newPrice: 0,
      marginChanged: false,
    }
    this.onFocusWorkTrip.bind( this );
    this.onFocusSubtask.bind( this );
    this.getPrice.bind( this );
    this.getTotalPrice.bind( this );
    this.getTotalDiscountedPrice.bind( this );
    this.getDPH.bind( this );
  }

  componentWillReceiveProps( props ) {
    if ( this.props.taskID !== props.taskID ) {
      let newUnit = props.units[ 0 ];
      if ( props.defaultUnit !== null ) {
        newUnit = props.units.find( ( item ) => item.id === props.defaultUnit )
      }
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

        newTitle: '',
        newQuantity: 1,
        newUnit,
        newMargin: props.company && props.company.pricelist ? props.company.pricelist.materialMargin : 0,
        newPrice: 0,
        marginChanged: false,
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

    if ( ( this.props.company === null && props.company !== null ) ||
      ( this.props.company && props.company && props.company.id !== this.props.company.id ) ) {
      this.setState( {
        newMargin: ( props.company && props.company.pricelist ? props.company.pricelist.materialMargin : 0 )
      } );
    }

    if ( this.props.units && props.units && this.props.units.length !== props.units.length ) {
      let newUnit = props.units[ 0 ];
      if ( props.defaultUnit !== null ) {
        newUnit = props.units.find( ( item ) => item.id === props.defaultUnit )
      }
      this.setState( {
        newUnit
      } );
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
    let editedFinalUnitPrice = 0;
    if ( this.state.focusedMaterial !== null ) {
      editedFinalUnitPrice = ( parseFloat( this.state.editedMaterialPrice ) * ( 1 + parseFloat( this.state.editedMaterialMargin ) / 100 ) )
    }

    return (
      <div className="vykazyTable">
					<table className="table">
						<thead>
							<tr>
								<th colSpan={this.props.showColumns.includes(0) ? 2 : 1} width="300">
										<Nav tabs className="no-border m-0">
											<NavItem>
											<NavLink
												className="active"
											>
												Rozpočet
											</NavLink>
										</NavItem>
									</Nav>
								</th>
								{this.props.showColumns.includes(5) && <th width="70" className="table-highlight-background text-right">Nákup</th> }
								{this.props.showColumns.includes(7) && <th width="70" className="table-highlight-background text-right">Cena</th>}
								{this.props.showColumns.includes(2) && <th width="130">Rieši</th> }
								{this.props.showColumns.includes(3) && <th width="130">Typ</th> }
								{this.props.showColumns.includes(4) && <th width="50" className="text-right">Mn.</th> }
							</tr>
						</thead>
						<tbody>
							{
								this.props.subtasks.map((subtask)=>
								<tr key={subtask.id}>
									{this.props.showColumns.includes(0) &&
										<td className="table-checkbox p-l-0">
											<label className="custom-container">
												<Input type="checkbox"
													checked={subtask.done}/>
												<span className="checkmark" style={{ marginTop: "-3px"}}> </span>
											</label>
									</td>}
									{this.props.showColumns.includes(1) &&
										<td className=""> {/* //name*/}
										<input
											disabled={this.props.disabled}
											className="form-control hidden-input"
											value={
												subtask.id === this.state.focusedSubtask
												? this.state.editedSubtaskTitle
												: subtask.title
											}/>
									</td>}

									{this.props.showColumns.includes(5) &&
										<td className=""></td>}	{/* //nákup - cennik/nakup*/}


											{this.props.showColumns.includes(7) &&
												<td className="p-t-15 p-l-8 p-r-8 text-right"> {/* //cena*/}
												</td>
											}

									{this.props.showColumns.includes(2) &&
										<td> 	{/* //riesi*/}
											{subtask.assignedTo ? subtask.assignedTo.label : ""}
									 </td>}

									{this.props.showColumns.includes(3) &&
										<td>{/* 	//typ*/}
											{subtask.type ? subtask.type.label : ""}
										</td>}

									{this.props.showColumns.includes(4) &&
										<td>{/* 	//mn.*/}
										<input
											disabled={this.props.disabled}
											type="number"
											className="form-control hidden-input h-30"
											value={
												subtask.id === this.state.focusedSubtask
												? this.state.editedSubtaskQuantity
												: subtask.quantity
											}/>
									</td>}

								</tr>
)}
							{/* END OF GENERATED Works*/}
							{
								this.props.workTrips.map((trip)=>
								<tr key={trip.id}>
									{this.props.showColumns.includes(0) &&
										<td className="table-checkbox">
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
									{this.props.showColumns.includes(1) &&
										<td className="">{/* 	//name*/}
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


									{this.props.showColumns.includes(5) &&
										<td className=""></td>}	{/* //nákup - cennik/nakup*/}


									{this.props.showColumns.includes(7) &&
										<td className="p-t-15 p-l-8 p-r-8 text-right">	{/* //cena*/}
										</td>}

									{this.props.showColumns.includes(2) &&
										<td className="p-l-8 p-t-25">{/* 	//riesi*/}
										<Select
											isDisabled={this.props.disabled}
											value={trip.assignedTo}
											onChange={(assignedTo)=>{
												this.props.updateTrip(trip.id,{assignedTo:assignedTo.id})
											}}
											options={this.props.taskAssigned}
											styles={invisibleSelectStyle}
											/>
									</td>}

									{this.props.showColumns.includes(3) &&
										<td className="p-l-8 p-t-25">Výjazd</td>}{/* 	//typ*/}

											{this.props.showColumns.includes(4) &&
												<td>{/* 	//mn.*/}
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
								</tr>
							)}
							{/* END OF GENERATED Work trips*/}
							{
								this.props.materials.map((material)=>
								<tr key={material.id}>
									{this.props.showColumns.includes(0) &&
										<td></td>}
									{this.props.showColumns.includes(1) &&
										<td className="">{/* 	//name*/}
											<input
												disabled={this.props.disabled}
												className="form-control hidden-input"
												value={
													material.id === this.state.focusedMaterial
													? this.state.editedMaterialTitle
													: material.title
												}
												onBlur={() => {
													//submit
													this.props.updateMaterial(material.id,{title:this.state.editedMaterialTitle})
													this.setState({ focusedMaterial: null });
												}}
												onFocus={() => {
													this.setState({
														editedMaterialTitle:material.title,
														editedMaterialQuantity:material.quantity,
														editedMaterialUnit:material.unit,
														editedMaterialMargin:material.margin,
														editedMaterialPrice:material.price,
														focusedMaterial: material.id
													});
												}}
												onChange={e =>{
													this.setState({ editedMaterialTitle: e.target.value })}
												}
												/>
										</td>}

										{this.props.showColumns.includes(5) &&
											<td className="table-highlight-background p-l-8">	{/* //nákup - cennik/nakup*/}
											<span className="text" style={{float: "right"}}>
												<div style={{float: "right"}} className="p-t-8 p-r-8">
													€
											</div>
													<input
													disabled={this.props.disabled}
													type="number"
													style={{display: "inline", width: "70%", float: "right"}}
													className="form-control hidden-input h-30"
													value={
														material.id === this.state.focusedMaterial
														? this.state.editedMaterialPrice
														: material.price
													}
													onBlur={() => {
														//submit
														this.props.updateMaterial(material.id,{price:this.state.editedMaterialPrice})
														this.setState({ focusedMaterial: null });
													}}
													onFocus={() => {
														this.setState({
															editedMaterialTitle:material.title,
															editedMaterialQuantity:material.quantity,
															editedMaterialUnit:material.unit,
															editedMaterialMargin:material.margin,
															editedMaterialPrice:material.price,
															focusedMaterial: material.id
														});
													}}
													onChange={e =>{
														this.setState({ editedMaterialPrice: e.target.value })}
													}
													/>

										</span>
											</td>}

										{this.props.showColumns.includes(7) &&
											this.state.toggleTab === "2" &&
											<td className="table-highlight-background p-l-8 p-t-15 p-r-8 text-right">{/* 	//cena*/}
												{
													(
													(parseFloat(material.id === this.state.focusedMaterial
															? editedFinalUnitPrice
															: material.finalUnitPrice))*
													parseInt(material.id === this.state.focusedMaterial?(this.state.editedMaterialQuantity===''?0:this.state.editedMaterialQuantity):material.quantity)
													)
													.toFixed(2) + " €"
												}
										</td>}

										{this.props.showColumns.includes(2) &&
												<td>	{/* //riesi*/}
										</td>}

										{this.props.showColumns.includes(3) &&
											<td className="p-l-8 p-t-15">	{/* //typ*/}
											Materiál
										</td>}

										{this.props.showColumns.includes(4) &&
											<td>	{/* //mn.*/}
										<input
											disabled={this.props.disabled}
											type="number"
											className="form-control hidden-input h-30"
											value={
												material.id === this.state.focusedMaterial
												? this.state.editedMaterialQuantity
												: material.quantity
											}
											onBlur={() => {
												//submit
												this.props.updateMaterial(material.id,{quantity:this.state.editedMaterialQuantity})
												this.setState({ focusedMaterial: null });
											}}
											onFocus={() => {
												this.setState({
													editedMaterialTitle:material.title,
													editedMaterialQuantity:material.quantity,
													editedMaterialUnit:material.unit,
													editedMaterialMargin:material.margin,
													editedMaterialPrice:material.price,
													focusedMaterial: material.id
												});
											}}
											onChange={e =>{
												this.setState({ editedMaterialQuantity: e.target.value })}
											}
											/>
									</td>}

								</tr>
								)
							}
							{/* END OF GENERATED Materials*/}

						</tbody>
					</table>
						{(this.props.workTrips.length + this.props.subtasks.length + this.props.materials.length > 0) &&
						<div className="row">
							<div className="text-right ml-auto m-r-5">
								<b>Cena bez DPH: </b>
								{(this.props.subtasks.concat(this.props.workTrips).reduce((acc, cur)=> acc+(isNaN(this.getTotalPrice(cur))?0:this.getTotalPrice(cur)),0)
									+ this.props.materials.reduce((acc, cur)=> acc+(isNaN(parseInt(cur.totalPrice))? 0 : parseInt(cur.totalPrice)),0)).toFixed(2)}
							</div>
							<div className="text-right m-r-5">
								<b>DPH: </b>
								{this.getDPH()}
							</div>
							<div className="text-right">
								<b>Cena s DPH: </b>
								{(this.props.subtasks.concat(this.props.workTrips).reduce((acc, cur)=> acc+(isNaN(this.getTotalPrice(cur))?0:this.getTotalPrice(cur)*this.getDPH()),0)
									+ this.props.materials.reduce((acc, cur)=> acc+(isNaN(parseInt(cur.totalPrice))? 0 : (parseInt(cur.totalPrice)*this.getDPH())),0)).toFixed(2)}
							</div>
						</div>}
				</div>
    );
  }
}