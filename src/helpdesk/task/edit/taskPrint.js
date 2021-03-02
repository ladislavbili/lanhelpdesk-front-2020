import React, {
  Component
} from 'react';
import ReactToPrint from 'react-to-print';
import VykazyTablePrint from 'helpdesk/components/vykazyTablePrint';
import {
  intervals
} from 'configs/constants/repeat';
import {
  timestampToString
} from 'helperFunctions';

export default class TaskPrint extends Component {
  constructor( props ) {
    super( props );
    this.state = {};
  }

  render() {
    return (
      <div className="display-inline">
					<ReactToPrint
						trigger={() =>
							<button className="btn-link btn-distance" disabled={!this.props.isLoaded}>
								<i
									className="fas fa-print"
									/> Print
							</button>
						}
						content={() => this.componentRef}
					/>

				<div style={{display: "none"}}>
					<TaskInfo ref={el => (this.componentRef = el)} {...this.props}/>
				</div>
			</div>
    )
  }
}

class TaskInfo extends Component {

  render() {
    if ( !this.props.isLoaded ) {
      return null;
    }


    let workTrips = this.props.workTrips.map( ( trip ) => {
      let type = this.props.tripTypes.find( ( item ) => item.id === trip.type );
      let assignedTo = trip.assignedTo ? this.props.users.find( ( item ) => item.id === trip.assignedTo ) : null

      return {
        ...trip,
        type,
        assignedTo: assignedTo ? assignedTo : null
      }
    } );

    let taskWorks = this.props.taskWorks.map( ( work ) => {
      let assignedTo = work.assignedTo ? this.props.users.find( ( item ) => item.id === work.assignedTo ) : null
      return {
        ...work,
        type: this.props.taskTypes.find( ( item ) => item.id === work.type ),
        assignedTo: assignedTo ? assignedTo : null
      }
    } );
    let taskMaterials = this.props.taskMaterials.map( ( material ) => {
      let finalUnitPrice = ( parseFloat( material.price ) * ( 1 + parseFloat( material.margin ) / 100 ) );
      let totalPrice = ( finalUnitPrice * parseFloat( material.quantity ) )
        .toFixed( 3 );
      finalUnitPrice = finalUnitPrice.toFixed( 3 );
      return {
        ...material,
        unit: this.props.units.find( ( unit ) => unit.id === material.unit ),
        finalUnitPrice,
        totalPrice
      }
    } );

    let repeatInterval = ( this.props.repeat ? intervals.find( ( interval ) => interval.title === this.props.repeat.repeatInterval ) : null );


    return (
      <div className="m-100">
					<div className="row flex">
						<h2 className="center-hor text-extra-slim">{`${this.props.taskID}: ${this.props.title}`}</h2>

						<div className="ml-auto center-hor">
							<p className="m-b-0 task-info">
								<span className="text-muted">
									{this.props.createdBy?"Created by ":""}
								</span>
								{this.props.createdBy? (this.props.createdBy.name + " " +this.props.createdBy.surname) :''}
								<span className="text-muted">
									{this.props.createdBy?' at ':'Created at '}
									{this.props.createdAt?(timestampToString(this.props.createdAt)):''}
								</span>
							</p>
							<p className="m-b-0">
								{(()=>{
									if(this.props.status && this.props.status.action==='pending'){
										return (
											<span className="text-muted task-info m-r--40">
												<span className="center-hor">
													{`Pending date: ${this.props.pendingDate}`}
												</span>
											</span>)
								}else if(this.props.status && (this.props.status.action==='close'||this.props.status.action==='invoiced'||this.props.status.action==='invalid')){
									return (
										<span className="text-muted task-info m-r--40">
											<span className="center-hor">
												{`Closed at: ${this.props.closeDate}`}
												Closed at:
											</span>
										</span>)
									}else{
										return (
											<span className="task-info ">
												<span className="center-hor text-muted">
													{this.props.statusChange ? ('Status changed at ' + timestampToString(this.props.statusChange) ) : ""}
												</span>
											</span>
										)
									}
								})()}
							</p>
						</div>
					</div>

					<hr className="m-b-10"/>
						<div>
							<div className="col-lg-12 row"> {/*Project, Assigned*/}
								<div className="col-lg-4"> {/*Project*/}
									{`Projetkt: ${this.props.project ? this.props.project.label : "None"}`}
								</div>
								{ this.props.defaultFields.assignedTo.show &&
									<div className="col-lg-8"> {/*Assigned*/}
										{`Assigned: ${this.props.assignedTo.length > 0 ? this.props.assignedTo.map(a => a.label).join(" ") : "None"}`}
								</div>}
							</div>

							<div className="col-lg-12"> {/*Attributes*/}
								<div className="col-lg-4">
									{`Status: ${this.props.status ? this.props.status.label : "None"}`}

									{ this.props.defaultFields.type.show &&
										<div className=""> {/*Type*/}
											{`Type: ${this.props.type ? this.props.type.label : "None"}`}
										</div>}

									{`Milestone: ${this.props.milestone ? this.props.milestone.label : "None"}`}
								</div>

								<div className="col-lg-4">
									{ this.props.defaultFields.requester.show &&
										<div className=""> {/*Requester*/}
											{`Zadal: ${this.props.requester ? this.props.requester.label : "None"}`}
										</div>
									 }
									{ this.props.defaultFields.company.show &&
										<div className="row p-r-10"> {/*Company*/}
											{`Company: ${this.props.company ? this.props.company.label : "None"}`}
										</div>}

									{this.props.defaultFields.pausal.show &&
										<div className="form-group row"> {/*Pausal*/}
											{`Pausal: ${this.props.pausal ? this.props.pausal.label : "None"}`}
										</div>}
								</div>

								<div className="col-lg-4">
									<div className="row p-r-10"> {/*Deadline*/}
										{`Deadline: ${this.props.deadline ? this.props.deadline.label : "None"}`}
									</div>
									<div>{/*Repeat*/}
										{`Repeat: ${this.props.repeat?("Opakovať každý "+ parseInt(this.props.repeat.repeatEvery/repeatInterval.value) + ' ' + repeatInterval.title) :"No repeat"}`}
									</div>
									{this.props.defaultFields.overtime.show &&
										<div className="form-group row"> {/*Overtime*/}
											{`Mimp PH: ${this.props.overtime ? this.props.overtime.label : "None"}`}
									</div>}
								</div>
							</div>
						</div>


					<label className="m-t-5  text-slim">Popis</label>
					{(this.props.description && this.props.description.length !== 0 ?
						<div className="" dangerouslySetInnerHTML={{__html:this.props.description }} /> :
							<div className="">Úloha nemá popis</div>
					)}

					<VykazyTablePrint
						showColumns={ (this.props.viewOnly ? [0,1,2,3,4,5,6,7,8] : [0,1,2,3,4,5,6,7,8,9]) }

						showTotals={false}
						disabled={this.props.viewOnly}
						company={this.props.company}
						match={this.props.match}
						taskID={this.props.match.params.taskID}
						taskAssigned={this.props.assignedTo}

						subtasks={taskWorks}
						defaultType={this.props.type}
						workTypes={this.props.taskTypes}
						workTrips={workTrips}
						tripTypes={this.props.tripTypes}

						materials={taskMaterials}
						units={this.props.units}
						defaultUnit={this.props.defaultUnit}
						/>

				</div>
    );
  }
}