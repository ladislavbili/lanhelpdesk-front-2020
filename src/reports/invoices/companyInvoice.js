import React, { Component } from 'react';
import { timestampToString } from '../../helperFunctions';

export default class CompanyInvoice extends Component {
	render() {
		let invoice=this.props.invoice;
		return (
						<div className="p-20">
							<h2>Fakturačný výkaz firmy</h2>
							<div className="flex-row m-b-30">
								<div>
									Firma {invoice.company.title} <br/>
									{`Obdobie od ${timestampToString(invoice.from)} do: ${timestampToString(invoice.to)}`}
								</div>
								<div className="m-l-10">
									Počet prác vrámci paušálu: {invoice.totalPausalWorks}
									<br/>
									Počet výjazdov vrámci paušálu: {invoice.totalPausalTrips}

								</div>
							</div>
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
										{
											invoice.pausalTasks.map((task)=>
											<tr key={task.id}>
												<td>{task.id}</td>
												<td>{task.title}</td>
												<td>{task.requester}</td>
												<td>
													{task.assignedTo.map((assignedTo)=>
														<p key={assignedTo}>{assignedTo}</p>
													)}
												</td>
												<td>
													<span className="label label-info" style={{backgroundColor:task.status.color}}>
														{task.status.title}
													</span>
												</td>
												<td>{timestampToString(task.closeDate)}</td>
												<td colSpan="3">
													<table className="table-borderless full-width">
														<tbody>
															{task.works.map((work)=>
																<tr key={work.id}>
																	<td key={work.id+ '-title'} style={{paddingLeft:0}}>{work.title}</td>
																	<td key={work.id+ '-type'} style={{width:'150px', paddingLeft:0}}>{work.type}</td>
																	<td key={work.id+ '-time'} style={{width:'50px', paddingLeft:0}}>{work.quantity}</td>
																</tr>
															)}
														</tbody>
													</table>
												</td>
											</tr>
										)
									}
								 </tbody>
								</table>

								<p className="m-0">Spolu počet hodín: {invoice.pausalInfo.worksTotalTime}
								</p>
								<p className="m-0">Spolu počet hodín mimo pracovný čas: {invoice.pausalInfo.worksTotalOvertime} ( Čísla úloh:
										{invoice.pausalInfo.worksOvertimeTasks.reduce((acc,task)=>{return acc+=task + ','}," ").slice(0,-1)+" )"}
								</p>
								<p className="m-0 m-b-10">Spolu prirážka za práce mimo pracovných hodín: {invoice.pausalInfo.worksExtraPay} eur
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
										{
											invoice.pausalTasks.map((task)=>
											<tr key={task.id}>
												<td>{task.id}</td>
												<td>{task.title}</td>
												<td>{task.requester}</td>
												<td>
													{task.assignedTo.map((assignedTo)=>
														<p key={assignedTo}>{assignedTo}</p>
													)}
												</td>
												<td>
													<span className="label label-info" style={{backgroundColor:task.status.color}}>
														{task.status.title}
													</span>
												</td>
												<td>{timestampToString(task.closeDate)}</td>
												<td colSpan="3">
													<table className="table-borderless full-width">
														<tbody>
															{task.trips.map((trip)=>
																<tr key={trip.id}>
																	<td key={trip.id+ '-title'} style={{width:'150px',paddingLeft:0}}>{trip.title}</td>
																	<td key={trip.id+ '-time'} style={{width:'50px',paddingLeft:0}}>{trip.quantity}</td>
																</tr>
															)}
														</tbody>
													</table>
												</td>
											</tr>
										)
									}
								 </tbody>
								</table>

								<p className="m-0">Spolu počet výjazdov: {invoice.pausalInfo.tripsTotalTime}
								</p>
								<p className="m-0">Spolu počet výjazdov mimo pracovný čas: {invoice.pausalInfo.tripsTotalOvertime} ( Čísla úloh:
										{invoice.pausalInfo.tripsOvertimeTasks.reduce((acc,task)=> acc+=task + ',' ," ").slice(0,-1)+" )"}
								</p>
								<p className="m-0 m-b-10">Spolu prirážka za výjazdov mimo pracovných hodín: {invoice.pausalInfo.tripsExtraPay} eur
								</p>
							</div>

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
										{
											invoice.pausalExtraTasks.map((task)=>
											<tr key={task.id}>
												<td>{task.id}</td>
												<td>{task.title}</td>
												<td>{task.requester}</td>
												<td>
													{task.assignedTo.map((assignedTo)=>
														<p key={assignedTo}>{assignedTo}</p>
													)}
												</td>
												<td>
													<span className="label label-info" style={{backgroundColor:task.status.color}}>
														{task.status.title}
													</span>
												</td>
												<td>{timestampToString(task.closeDate)}</td>
												<td colSpan="5">
													<table className="table-borderless full-width">
														<tbody>
															{task.works.map((work)=>
																<tr key={work.id}>
																	<td key={work.id+ '-title'} style={{paddingLeft:0}}>{work.title}</td>
																	<td key={work.id+ '-type'} style={{width:'150px'}}>{work.type}</td>
																	<td key={work.id+ '-time'} style={{width:'50px'}}>{work.quantity}</td>
																	<td key={work.id+ '-pricePerUnit'} style={{width:'70px'}}>{work.unitPrice}</td>
																	<td key={work.id+ '-totalPrice'} style={{width:'70px'}}>{work.totalPrice}</td>
																</tr>
															)}
														</tbody>
													</table>
												</td>
											</tr>
										)
									}
								 </tbody>
								</table>

								<p className="m-0">Spolu počet hodín: {invoice.pausalExtraInfo.worksTotalTime}
								</p>
								<p className="m-0">Spolu počet hodín mimo pracovný čas: {invoice.pausalExtraInfo.worksTotalOvertime} ( Čísla úloh:
										{
										invoice.pausalExtraInfo.worksOvertimeTasks.reduce((acc,task)=>{
											return acc+=task + ','
										}," ").slice(0,-1)+" )"}
								</p>
								<p className="m-0">Spolu prirážka za práce mimo pracovných hodín: {invoice.pausalExtraInfo.worksExtraPay} eur
								</p>
								<p className="m-0">Spolu cena bez DPH: {invoice.pausalExtraInfo.worksPriceWithoutDPH} eur
								</p>
								<p className="m-0">Spolu cena s DPH: {invoice.pausalExtraInfo.worksPriceWithDPH} eur
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
										{
											invoice.pausalExtraTasks.map((task)=>
											<tr key={task.id}>
												<td>{task.id}</td>
												<td>{task.title}</td>
												<td>{task.requester}</td>
												<td>
													{task.assignedTo.map((assignedTo)=>
														<p key={assignedTo}>{assignedTo}</p>
													)}
												</td>
												<td>
													<span className="label label-info" style={{backgroundColor:task.status.color}}>
														{task.status.title}
													</span>
												</td>
												<td>{timestampToString(task.closeDate)}</td>
												<td colSpan="5">
													<table className="table-borderless full-width">
														<tbody>
															{task.trips.map((trip)=>
																<tr key={trip.id}>
																	<td key={trip.id+ '-title'} style={{width:'150px',paddingLeft:0}}>{trip.title}</td>
																	<td key={trip.id+ '-time'} style={{width:'50px'}}>{trip.quantity}</td>
																	<td key={trip.id+ '-unitPrice'} style={{width:'50px'}}>{trip.unitPrice}</td>
																	<td key={trip.id+ '-totalPrice'} style={{width:'50px'}}>{trip.totalPrice}</td>
																</tr>
															)}
														</tbody>
													</table>
												</td>
											</tr>
										)
									}
								 </tbody>
								</table>

								<p className="m-0">Spolu počet výjazdov: {invoice.pausalExtraInfo.tripsTotalTime}
								</p>
								<p className="m-0">Spolu počet výjazdov mimo pracovný čas: {invoice.pausalExtraInfo.tripsTotalOvertime} ( Čísla úloh:
										{invoice.pausalExtraInfo.tripsOvertimeTasks
										.reduce((acc,task)=>{
											return acc+=task + ','
										}," ").slice(0,-1)+" )"}
								</p>
								<p className="m-0">Spolu prirážka za výjazdov mimo pracovných hodín: {invoice.pausalExtraInfo.tripsExtraPay} eur
								</p>
								<p className="m-0">Spolu cena bez DPH: {invoice.pausalExtraInfo.tripsPriceWithoutDPH} eur
								</p>
								<p className="m-0">Spolu cena s DPH: {invoice.pausalExtraInfo.tripsPriceWithDPH} eur
								</p>
							</div>

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
										{
											invoice.projectTasks.map((task)=>
											<tr key={task.id}>
												<td>{task.id}</td>
												<td>{task.title}</td>
												<td>{task.requester}</td>
												<td>
													{task.assignedTo.map((assignedTo)=>
														<p key={assignedTo}>{assignedTo}</p>
													)}
												</td>
												<td>
													<span className="label label-info" style={{backgroundColor:task.status.color}}>
														{task.status.title}
													</span>
												</td>
												<td>{timestampToString(task.closeDate)}</td>
												<td colSpan="5">
													<table className="table-borderless full-width">
														<tbody>
															{task.works.map((work)=>
																<tr key={work.id}>
																	<td key={work.id+ '-title'} style={{paddingLeft:0}}>{work.title}</td>
																	<td key={work.id+ '-type'} style={{width:'150px'}}>{work.type}</td>
																	<td key={work.id+ '-time'} style={{width:'50px'}}>{work.quantity}</td>
																	<td key={work.id+ '-pricePerUnit'} style={{width:'70px'}}>{work.unitPrice}</td>
																	<td key={work.id+ '-totalPrice'} style={{width:'70px'}}>{work.totalPrice}</td>
																</tr>
															)}
														</tbody>
													</table>
												</td>
											</tr>
										)
									}
								 </tbody>
								</table>

								<p className="m-0">Spolu počet hodín: {invoice.projectInfo.worksTotalTime}
								</p>
								<p className="m-0">Spolu počet hodín mimo pracovný čas: {invoice.projectInfo.worksTotalOvertime} ( Čísla úloh:
										{invoice.projectInfo.worksOvertimeTasks
										.reduce((acc,task)=>{
											return acc+=task + ','
										}," ").slice(0,-1)+" )"}
								</p>
								<p className="m-0">Spolu prirážka za práce mimo pracovných hodín: {invoice.projectInfo.worksExtraPay} eur
								</p>
								<p className="m-0">Spolu cena bez DPH: {invoice.projectInfo.worksPriceWithoutDPH} eur
								</p>
								<p className="m-0">Spolu cena s DPH: {invoice.projectInfo.worksPriceWithDPH} eur
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
										{
											invoice.projectTasks.map((task)=>
											<tr key={task.id}>
												<td>{task.id}</td>
												<td>{task.title}</td>
												<td>{task.requester}</td>
												<td>
													{task.assignedTo.map((assignedTo)=>
														<p key={assignedTo}>{assignedTo}</p>
													)}
												</td>
												<td>
													<span className="label label-info" style={{backgroundColor:task.status.color}}>
														{task.status.title}
													</span>
												</td>
												<td>{timestampToString(task.closeDate)}</td>
												<td colSpan="5">
													<table className="table-borderless full-width">
														<tbody>
															{task.trips.map((trip)=>
																<tr key={trip.id}>
																	<td key={trip.id+ '-title'} style={{width:'150px',paddingLeft:0}}>{trip.title}</td>
																	<td key={trip.id+ '-time'} style={{width:'50px'}}>{trip.quantity}</td>
																	<td key={trip.id+ '-unitPrice'} style={{width:'50px'}}>{trip.unitPrice}</td>
																	<td key={trip.id+ '-totalPrice'} style={{width:'50px'}}>{trip.totalPrice}</td>
																</tr>
															)}
														</tbody>
													</table>
												</td>
											</tr>
										)
									}
								 </tbody>
								</table>

								<p className="m-0">Spolu počet výjazdov: {invoice.projectInfo.tripsTotalTime}
								</p>
								<p className="m-0">Spolu počet výjazdov mimo pracovný čas: {invoice.projectInfo.tripsTotalOvertime} ( Čísla úloh:
										{invoice.projectInfo.tripsOvertimeTasks
										.reduce((acc,task)=>{
											return acc+=task + ','
										}," ").slice(0,-1)+" )"}
								</p>
								<p className="m-0">Spolu prirážka za výjazdov mimo pracovných hodín: {invoice.projectInfo.tripsExtraPay} eur
								</p>
								<p className="m-0">Spolu cena bez DPH: {invoice.projectInfo.tripsPriceWithoutDPH} eur
								</p>
								<p className="m-0">Spolu cena s DPH: {invoice.projectInfo.tripsPriceWithDPH} eur
								</p>
							</div>

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
										<th style={{width:'100px'}}>Jednotka</th>
										<th style={{width:'100px'}}>Cena/Mn.</th>
										<th style={{width:'100px'}}>Cena spolu</th>
									</tr>
								</thead>
								<tbody>
									{
										invoice.materialTasks.map((task, index)=>
										<tr key={index}>
											<td>{task.id}</td>
											<td>{task.title}</td>
											<td>{task.requester}</td>
											<td>
												{task.assignedTo.map((assignedTo)=>
													<p key={assignedTo}>{assignedTo}</p>
												)}
											</td>
											<td>
												<span className="label label-info" style={{backgroundColor:task.status.color}}>
													{task.status.title}
												</span>
											</td>
											<td>{timestampToString(task.closeDate)}</td>
											<td colSpan="5">
												<table className="table-borderless full-width">
													<tbody>
														{task.materials.map((material)=>
															<tr key={material.id}>
																<td key={material.id+ '-title'} style={{width:'150px',paddingLeft:0}}>{material.title}</td>
																<td key={material.id+ '-quantity'} style={{width:'50px'}}>{material.quantity}</td>
																<td key={material.id+ '-unit'} style={{width:'100px'}}>{material.unit}</td>
																<td key={material.id+ '-unitPrice'} style={{width:'100px'}}>{material.unitPrice}</td>
																<td key={material.id+ '-totalPrice'} style={{width:'100px'}}>{material.totalPrice}</td>
															</tr>
														)}

														{(task.customItems?task.customItems:[]).map((customItem)=>
															<tr key={customItem.id}>
																<td key={customItem.id+ '-title'} style={{width:'150px',paddingLeft:0}}>{customItem.title}</td>
																<td key={customItem.id+ '-quantity'} style={{width:'50px'}}>{customItem.quantity}</td>
																<td key={customItem.id+ '-unit'} style={{width:'100px'}}>{customItem.unit}</td>
																<td key={customItem.id+ '-unitPrice'} style={{width:'100px'}}>{customItem.unitPrice}</td>
																<td key={customItem.id+ '-totalPrice'} style={{width:'100px'}}>{customItem.totalPrice}</td>
															</tr>
														)}

													</tbody>
												</table>
											</td>
										</tr>
									)}
								</tbody>
							</table>
							<p className="m-0">Spolu cena bez DPH: {invoice.materialInfo.priceWithoutDPH} EUR</p>
							<p className="m-0">Spolu cena s DPH: {invoice.materialInfo.priceWithDPH} EUR</p>
						</div>
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
									{
										invoice.rented.map((rentedItem)=>
										<tr key={rentedItem.id}>
											<td>{rentedItem.id}</td>
											<td>{rentedItem.title}</td>
											<td>{rentedItem.quantity}</td>
											<td>{rentedItem.unitPrice}</td>
											<td>{rentedItem.totalPrice}</td>
										</tr>
									)}
								</tbody>
							</table>
							<p className="m-0">Spolu cena bez DPH: {invoice.rentedInfo.priceWithoutDPH} EUR</p>
							<p className="m-0">Spolu cena s DPH: {invoice.rentedInfo.priceWithDPH} EUR</p>
						</div>
					</div>
		);
	}
}
