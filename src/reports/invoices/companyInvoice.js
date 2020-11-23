import React, {
  Component
} from 'react';
import {
  timestampToString
} from 'helperFunctions';

export default function CompanyReports( props ) {
  let invoice = props.invoice;
  return (
    <div className="p-20">
			<h2>Fakturačný výkaz firmy</h2>
			{/*Company Info*/}
			<div className="flex-row m-b-30">
				<div>
					Firma {invoice.invoicedCompany.title}
					<br/>
					{`Obdobie od ${timestampToString(parseInt(invoice.fromDate))} do: ${timestampToString(parseInt(invoice.toDate))}`}
				</div>
				<div className="m-l-10">
					Počet prác vrámci paušálu: {invoice.pausalCounts.subtasks}
					<br/>
					Počet výjazdov vrámci paušálu: {invoice.pausalCounts.trips}
				</div>
			</div>
			{/*Pausal*/}
			<div className="m-b-30">
				<h3 className="m-b-10">Práce a výjazdy vrámci paušálu</h3>
				<h2>Práce</h2>
				<hr />
				<table className="table m-b-10">
					<thead>
						<tr>
							<th>ID</th>
							<th>Názov úlohy</th>
							<th>Zadal</th>
							<th>Rieši</th>
							<th>Status</th>
							<th>Close date</th>
							<th>Popis práce</th>
							<th style={{width:'150px'}}>Typ práce</th>
							<th style={{width:'50px'}}>Hodiny</th>
						</tr>
					</thead>
					<tbody>
						{ invoice.pausalTasks.filter( (pausalTask) => pausalTask.subtasks.length !== 0 ).map((pausalTask)=>
							<tr key={pausalTask.task.id}>
								<td>{pausalTask.task.id}</td>
								<td>{pausalTask.task.title}</td>
								<td>{pausalTask.task.requester.fullName}</td>
								<td>
									{pausalTask.task.assignedTo.map( (assignedTo) =>
										<p key={assignedTo.id}>{assignedTo.fullName}</p>
									)}
								</td>
								<td>
									<span className="label label-info" style={{backgroundColor:pausalTask.task.status.color}}>
										{pausalTask.task.status.title}
									</span>
								</td>
								<td>{timestampToString(parseInt(pausalTask.task.closeDate))}</td>
								<td colSpan="3">
									<table className="table-borderless full-width">
										<tbody>
											{pausalTask.subtasks.map((subtaskData)=>
												<tr key={subtaskData.subtask.id}>
													<td key={subtaskData.subtask.id+ '-title'} style={{paddingLeft:0}}>{subtaskData.subtask.title}</td>
													<td key={subtaskData.subtask.id+ '-type'} style={{width:'150px', paddingLeft:0}}>{subtaskData.type}</td>
													<td key={subtaskData.subtask.id+ '-time'} style={{width:'50px', paddingLeft:0}}>{subtaskData.quantity}</td>
												</tr>
											)}
										</tbody>
									</table>
								</td>
							</tr>
						)}
					</tbody>
				</table>

				<p className="m-0">
					Spolu počet hodín: {invoice.pausalCounts.subtasks}
				</p>
				<p className="m-0">
					{
						`Spolu počet hodín mimo pracovný čas: ${invoice.pausalCounts.subtasksAfterHours}
						( Čísla úloh: ${invoice.pausalCounts.subtasksAfterHoursTaskIds.toString()} )`
					}
				</p>
				<p className="m-0 m-b-10">
					Spolu prirážka za práce mimo pracovných hodín: {invoice.pausalCounts.subtasksAfterHoursPrice} eur
				</p>

				<h2>Výjazdy</h2>
				<hr />
				<table className="table m-b-10">
					<thead>
						<tr>
							<th>ID</th>
							<th>Názov úlohy</th>
							<th>Zadal</th>
							<th>Rieši</th>
							<th>Status</th>
							<th>Close date</th>
							<th style={{width:'150px'}}>Výjazd</th>
							<th style={{width:'50px'}}>Mn.</th>
						</tr>
					</thead>
					<tbody>
						{ invoice.pausalTasks.filter( (pausalTask) => pausalTask.trips.length !== 0 ).map( (pausalTask) =>
							<tr key={pausalTask.task.id}>
								<td>{pausalTask.task.id}</td>
								<td>{pausalTask.task.title}</td>
								<td>{pausalTask.task.requester.fullName}</td>
								<td>
									{pausalTask.task.assignedTo.map((assignedTo)=>
										<p key={assignedTo.id}>{assignedTo.fullName}</p>
									)}
								</td>
								<td>
									<span className="label label-info" style={{backgroundColor:pausalTask.task.status.color}}>
										{pausalTask.task.status.title}
									</span>
								</td>
								<td>{timestampToString(parseInt(pausalTask.task.closeDate))}</td>
								<td colSpan="3">
									<table className="table-borderless full-width">
										<tbody>
											{pausalTask.trips.map((tripData) =>
												<tr key={tripData.trip.id}>
													<td key={tripData.trip.id+ '-title'} style={{width:'150px',paddingLeft:0}}>{tripData.type}</td>
													<td key={tripData.trip.id+ '-time'} style={{width:'50px',paddingLeft:0}}>{tripData.quantity}</td>
												</tr>
											)}
										</tbody>
									</table>
								</td>
							</tr>
						)}
					</tbody>
				</table>

				<p className="m-0">
					Spolu počet výjazdov: {invoice.pausalCounts.trips}
				</p>
				<p className="m-0">
					{
						`Spolu počet hodín mimo pracovný čas: ${invoice.pausalCounts.tripsAfterHours}
						( Čísla úloh: ${invoice.pausalCounts.tripsAfterHoursTaskIds.toString()} )`
					}
				</p>
				<p className="m-0 m-b-10">
					Spolu prirážka za výjazdov mimo pracovných hodín: {invoice.pausalCounts.tripsAfterHoursPrice} eur
				</p>
			</div>
			{/*Over Pausal*/}
			<div className="m-b-30">
				<h3 className="m-b-10">Práce a výjazdy nad rámec paušálu</h3>
				<h2>Práce</h2>
				<hr />
				<table className="table m-b-10">
					<thead>
						<tr>
							<th>ID</th>
							<th>Názov úlohy</th>
							<th>Zadal</th>
							<th>Rieši</th>
							<th>Status</th>
							<th>Close date</th>
							<th>Popis práce</th>
							<th style={{width:'150px'}}>Typ práce</th>
							<th style={{width:'50px'}}>Hodiny</th>
							<th style={{width:'70px'}}>Cena/hodna</th>
							<th style={{width:'70px'}}>Cena spolu</th>
						</tr>
					</thead>
					<tbody>
						{ invoice.overPausalTasks.filter( (opTask) => opTask.subtasks.length !== 0 ).map( (opTask) =>
							<tr key={opTask.task.id}>
								<td>{opTask.task.id}</td>
								<td>{opTask.task.title}</td>
								<td>{opTask.task.requester.fullName}</td>
								<td>
									{opTask.task.assignedTo.map((assignedTo)=>
										<p key={assignedTo.id}>{assignedTo.fullName}</p>
									)}
								</td>
								<td>
									<span className="label label-info" style={{backgroundColor:opTask.task.status.color}}>
										{opTask.task.status.title}
									</span>
								</td>
								<td>{timestampToString(parseInt(opTask.task.closeDate))}</td>
								<td colSpan="5">
									<table className="table-borderless full-width">
										<tbody>
											{opTask.subtasks.map((subtaskData)=>
												<tr key={subtaskData.subtask.id}>
													<td key={`${subtaskData.subtask.id}-title`} style={{paddingLeft:0}}>{subtaskData.subtask.title}</td>
													<td key={`${subtaskData.subtask.id}-type`} style={{width:'150px'}}>{subtaskData.type}</td>
													<td key={`${subtaskData.subtask.id}-time`} style={{width:'50px'}}>{subtaskData.quantity}</td>
													<td key={`${subtaskData.subtask.id}-pricePerUnit`} style={{width:'70px'}}>{subtaskData.price}</td>
													<td key={`${subtaskData.subtask.id}-totalPrice`} style={{width:'70px'}}>{subtaskData.price * subtaskData.quantity}</td>
												</tr>
											)}
										</tbody>
									</table>
								</td>
							</tr>
						)}
					</tbody>
				</table>

				<p className="m-0">
					Spolu počet hodín: {invoice.overPausalCounts.subtasks}
				</p>
				<p className="m-0">
					{
						`Spolu počet hodín mimo pracovný čas: ${invoice.overPausalCounts.subtasksAfterHours}
						( Čísla úloh: ${invoice.overPausalCounts.subtasksAfterHoursTaskIds.toString()} )`
					}
				</p>
				<p className="m-0">Spolu prirážka za práce mimo pracovných hodín: {invoice.overPausalCounts.subtasksAfterHoursPrice} eur
				</p>
				<p className="m-0">Spolu cena bez DPH: {invoice.overPausalCounts.subtasksTotalPriceWithoutDPH} eur
				</p>
				<p className="m-0">Spolu cena s DPH: {invoice.overPausalCounts.subtasksTotalPriceWithDPH} eur
				</p>

				<h2>Výjazdy</h2>
				<hr />
				<table className="table m-b-10">
					<thead>
						<tr>
							<th>ID</th>
							<th>Názov úlohy</th>
							<th>Zadal</th>
							<th>Rieši</th>
							<th>Status</th>
							<th>Close date</th>
							<th style={{width:'150px'}}>Výjazd</th>
							<th style={{width:'50px'}}>Mn.</th>
							<th style={{width:'50px'}}>Cena/ks</th>
							<th style={{width:'50px'}}>Cena spolu</th>
						</tr>
					</thead>
					<tbody>
						{	invoice.overPausalTasks.filter( (opTask) => opTask.trips.length !== 0 ).map( (opTask) =>
							<tr key={opTask.task.id}>
								<td>{opTask.task.id}</td>
								<td>{opTask.task.title}</td>
								<td>{opTask.task.requester.fullName}</td>
								<td>
									{opTask.task.assignedTo.map((assignedTo)=>
										<p key={assignedTo.id}>{assignedTo.fullName}</p>
									)}
								</td>
								<td>
									<span className="label label-info" style={{backgroundColor:opTask.task.status.color}}>
										{opTask.task.status.title}
									</span>
								</td>
								<td>{timestampToString(parseInt(opTask.task.closeDate))}</td>
								<td colSpan="5">
									<table className="table-borderless full-width">
										<tbody>
											{opTask.trips.map( (tripData) =>
												<tr key={tripData.trip.id}>
													<td key={`${tripData.trip.id}-title`} style={{width:'150px',paddingLeft:0}}>{tripData.type}</td>
													<td key={`${tripData.trip.id}-time`} style={{width:'50px'}}>{tripData.quantity}</td>
													<td key={`${tripData.trip.id}-unitPrice`} style={{width:'50px'}}>{tripData.price}</td>
													<td key={`${tripData.trip.id}-totalPrice`} style={{width:'50px'}}>{ tripData.quantity * tripData.price }</td>
												</tr>
											)}
										</tbody>
									</table>
								</td>
							</tr>
						)}
					</tbody>
				</table>

				<p className="m-0">Spolu počet výjazdov: {invoice.overPausalCounts.trips}
				</p>
				<p className="m-0">
					{
						`Spolu počet výjazdov mimo pracovný čas: ${invoice.overPausalCounts.tripsAfterHours}
						( Čísla úloh: ${invoice.overPausalCounts.tripsAfterHours.toString()} )`
					}
				</p>
				<p className="m-0">Spolu prirážka za výjazdov mimo pracovných hodín: {invoice.overPausalCounts.tripsAfterHoursPrice} eur
				</p>
				<p className="m-0">Spolu cena bez DPH: {invoice.overPausalCounts.tripsTotalPriceWithoutDPH} eur
				</p>
				<p className="m-0">Spolu cena s DPH: {invoice.overPausalCounts.tripsTotalPriceWithDPH} eur
				</p>
			</div>
			{/*Project*/}
			<div className="m-b-30">
				<h3 className="m-b-10">Projektové práce a výjazdy</h3>
				<h2>Práce</h2>
				<hr />
				<table className="table m-b-10">
					<thead>
						<tr>
							<th>ID</th>
							<th>Názov úlohy</th>
							<th>Zadal</th>
							<th>Rieši</th>
							<th>Status</th>
							<th>Close date</th>
							<th>Popis práce</th>
							<th style={{width:'150px'}}>Typ práce</th>
							<th style={{width:'50px'}}>Hodiny</th>
							<th style={{width:'70px'}}>Cena/hodna</th>
							<th style={{width:'70px'}}>Cena spolu</th>
						</tr>
					</thead>
					<tbody>
						{ invoice.projectTasks.filter( ( projectTask ) => projectTask.subtasks.length !== 0 ).map( (projectTask) =>
							<tr key={projectTask.task.id}>
								<td>{projectTask.task.id}</td>
								<td>{projectTask.task.title}</td>
								<td>{projectTask.task.requester.fullName}</td>
								<td>
									{projectTask.task.assignedTo.map((assignedTo)=>
										<p key={assignedTo.id}>{assignedTo.fullName}</p>
									)}
								</td>
								<td>
									<span className="label label-info" style={{backgroundColor:projectTask.task.status.color}}>
										{projectTask.task.status.title}
									</span>
								</td>
								<td>{timestampToString(parseInt(projectTask.task.closeDate))}</td>
								<td colSpan="5">
									<table className="table-borderless full-width">
										<tbody>
											{projectTask.subtasks.map( (subtaskData) =>
												<tr key={subtaskData.subtask.id}>
													<td key={subtaskData.subtask.id+ '-title'} style={{paddingLeft:0}}>{subtaskData.subtask.title}</td>
													<td key={subtaskData.subtask.id+ '-type'} style={{width:'150px'}}>{subtaskData.type}</td>
													<td key={subtaskData.subtask.id+ '-time'} style={{width:'50px'}}>{subtaskData.quantity}</td>
													<td key={subtaskData.subtask.id+ '-pricePerUnit'} style={{width:'70px'}}>{subtaskData.price}</td>
													<td key={subtaskData.subtask.id+ '-totalPrice'} style={{width:'70px'}}>{ subtaskData.quantity * subtaskData.price }</td>
												</tr>
											)}
										</tbody>
									</table>
								</td>
							</tr>
						) }
					</tbody>
				</table>
				<p className="m-0">Spolu počet hodín: {invoice.projectCounts.subtasks}
				</p>
				<p className="m-0">{
						`Spolu počet hodín mimo pracovný čas: ${invoice.projectCounts.subtasksAfterHours}
						( Čísla úloh: ${invoice.projectCounts.subtasksAfterHoursTaskIds.toString()} )`
					}
				</p>
				<p className="m-0">Spolu prirážka za práce mimo pracovných hodín: {invoice.projectCounts.subtasksAfterHoursPrice} eur
				</p>
				<p className="m-0">Spolu cena bez DPH: {invoice.projectCounts.subtasksTotalPriceWithoutDPH} eur
				</p>
				<p className="m-0">Spolu cena s DPH: {invoice.projectCounts.subtasksTotalPriceWithDPH} eur
				</p>

				<h2>Výjazdy</h2>
				<hr />
				<table className="table m-b-10">
					<thead>
						<tr>
							<th>ID</th>
							<th>Názov úlohy</th>
							<th>Zadal</th>
							<th>Rieši</th>
							<th>Status</th>
							<th>Close date</th>
							<th style={{width:'150px'}}>Výjazd</th>
							<th style={{width:'50px'}}>Mn.</th>
							<th style={{width:'50px'}}>Cena/ks</th>
							<th style={{width:'50px'}}>Cena spolu</th>
						</tr>
					</thead>
					<tbody>
						{	invoice.projectTasks.filter( ( projectTask ) => projectTask.trips.length !== 0 ).map((projectTask) =>
							<tr key={projectTask.task.id}>
								<td>{projectTask.task.id}</td>
								<td>{projectTask.task.title}</td>
								<td>{projectTask.task.requester.fullName}</td>
								<td>
									{projectTask.task.assignedTo.map((assignedTo)=>
										<p key={assignedTo.id}>{assignedTo.fullName}</p>
									)}
								</td>
								<td>
									<span className="label label-info" style={{backgroundColor:projectTask.task.status.color}}>
										{projectTask.task.status.title}
									</span>
								</td>
								<td>{timestampToString(parseInt(projectTask.task.closeDate))}</td>
								<td colSpan="5">
									<table className="table-borderless full-width">
										<tbody>
											{projectTask.trips.map((tripData)=>
												<tr key={tripData.trip.id}>
													<td key={tripData.trip.id+ '-title'} style={{width:'150px',paddingLeft:0}}>{tripData.type}</td>
													<td key={tripData.trip.id+ '-time'} style={{width:'50px'}}>{tripData.quantity}</td>
													<td key={tripData.trip.id+ '-unitPrice'} style={{width:'50px'}}>{tripData.price}</td>
													<td key={tripData.trip.id+ '-totalPrice'} style={{width:'50px'}}>{ tripData.quantity * tripData.price }</td>
												</tr>
											)}
										</tbody>
									</table>
								</td>
							</tr>
						)}
					</tbody>
				</table>

				<p className="m-0">Spolu počet výjazdov: {invoice.projectCounts.trips}
				</p>
				<p className="m-0">{
						`Spolu počet hodín mimo pracovný čas: ${invoice.projectCounts.tripsAfterHours}
						( Čísla úloh: ${invoice.projectCounts.tripsAfterHoursTaskIds.toString()} )`
					}
				</p>
				<p className="m-0">Spolu prirážka za výjazdov mimo pracovných hodín: {invoice.projectCounts.tripsAfterHoursPrice} eur
				</p>
				<p className="m-0">Spolu cena bez DPH: {invoice.projectCounts.tripsTotalPriceWithoutDPH} eur
				</p>
				<p className="m-0">Spolu cena s DPH: {invoice.projectCounts.tripsTotalPriceWithDPH} eur
				</p>
			</div>
			{/*Materials*/}
			<div className="m-b-30">
				<h3>Materiále a voľné položky</h3>
				<hr />
				<table className="table m-b-10">
					<thead>
						<tr>
							<th>ID</th>
							<th style={{ width: '20%' }}>Name</th>
							<th>Zadal</th>
							<th>Riesi</th>
							<th>Status</th>
							<th>Status date</th>
							<th style={{width:'150px',paddingLeft:0}}>Material</th>
							<th style={{width:'50px'}}>Mn.</th>
							<th style={{width:'100px'}}>Cena/Mn.</th>
							<th style={{width:'100px'}}>Cena spolu</th>
						</tr>
					</thead>
					<tbody>
						{ invoice.materialTasks.map((materialTask) =>
							<tr key={materialTask.task.id}>
								<td>{materialTask.task.id}</td>
								<td>{materialTask.task.title}</td>
								<td>{materialTask.task.requester.fullName}</td>
								<td>
									{materialTask.task.assignedTo.map((assignedTo)=>
										<p key={assignedTo.id}>{assignedTo.fullName}</p>
									)}
								</td>
								<td>
									<span className="label label-info" style={{backgroundColor:materialTask.task.status.color}}>
										{materialTask.task.status.title}
									</span>
								</td>
								<td>{timestampToString(parseInt(materialTask.task.closeDate))}</td>
								<td colSpan="4">
									<table className="table-borderless full-width">
										<tbody>
											{	materialTask.materials.map((materialData) =>
												<tr key={materialData.material.id}>
													<td key={materialData.material.id+ '-title'} style={{width:'150px',paddingLeft:0}}>{materialData.title}</td>
													<td key={materialData.material.id+ '-quantity'} style={{width:'50px'}}>{materialData.quantity}</td>
													<td key={materialData.material.id+ '-unitPrice'} style={{width:'100px'}}>{materialData.price}</td>
													<td key={materialData.material.id+ '-totalPrice'} style={{width:'100px'}}>{ materialData.quantity * materialData.price }</td>
												</tr>
											)}

											{materialTask.customItems.map((customItemData) =>
												<tr key={customItemData.customItem.id}>
													<td key={customItemData.customItem.id+ '-title'} style={{width:'150px',paddingLeft:0}}>{customItemData.title}</td>
													<td key={customItemData.customItem.id+ '-quantity'} style={{width:'50px'}}>{customItemData.quantity}</td>
													<td key={customItemData.customItem.id+ '-unitPrice'} style={{width:'100px'}}>{customItemData.price}</td>
													<td key={customItemData.customItem.id+ '-totalPrice'} style={{width:'100px'}}>{ customItemData.quantity * customItemData.price }</td>
												</tr>
											)}
										</tbody>
									</table>
								</td>
							</tr>
						)}
					</tbody>
				</table>
				<p className="m-0">Spolu cena bez DPH: {invoice.totalMaterialAndCustomItemPriceWithDPH} EUR</p>
				<p className="m-0">Spolu cena s DPH: {invoice.totalMaterialAndCustomItemPriceWithoutDPH} EUR</p>
			</div>
			{/*Rents*/}
			<div className="m-b-30">
				<h3>Mesačný prenájom služieb a harware</h3>
				<hr />
				<table className="table m-b-10">
					<thead>
						<tr>
							<th>ID</th>
							<th>Názov</th>
							<th>Mn.</th>
							<th>Cena/ks/mesiac</th>
							<th>Cena spolu/mesiac</th>
						</tr>
					</thead>
					<tbody>
						{	invoice.invoicedCompany.companyRents.map( (rentedItem) =>
							<tr key={rentedItem.id}>
								<td>{rentedItem.id}</td>
								<td>{rentedItem.title}</td>
								<td>{rentedItem.quantity}</td>
								<td>{rentedItem.price}</td>
								<td>{rentedItem.quantity * rentedItem.price}</td>
							</tr>
						)}
					</tbody>
				</table>
				<p className="m-0">Spolu cena bez DPH: {invoice.companyRentsCounts.totalWithoutDPH} EUR</p>
				<p className="m-0">Spolu cena s DPH: {invoice.companyRentsCounts.totalWithDPH} EUR</p>
			</div>
		</div>
  );
}