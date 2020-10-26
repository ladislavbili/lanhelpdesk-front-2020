import React from 'react';

import {
	useQuery,
	useLazyQuery,
	useApolloClient
} from "@apollo/react-hooks";

import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalHeader,
	FormGroup,
	Label
} from 'reactstrap';

import moment from 'moment';
import Select from 'react-select';

import {
	toSelArr,
	orderArr,
	timestampToDate
} from 'helperFunctions';

import MonthSelector from '../components/monthSelector';
import Loading from 'components/loading';

import {
	selectStyleColored
} from 'configs/components/select';

import { months } from '../components/constants';

import ReportsTable from './reportsTable';

import {
  GET_INVOICE_COMPANIES,
	GET_COMPANY_INVOICE_DATA,
	GET_STATUSES,
	GET_LOCAL_CACHE
} from './querries';

export default function  MothlyReportsCompany (props) {
	const {
		data: localCache
	} = useQuery( GET_LOCAL_CACHE );

	const {
    data: statusesData,
    loading: statusesLoading
  } = useQuery( GET_STATUSES );

	const [ fromDate, setFromDate ] = React.useState(
		moment().startOf('month')
		);
	const [ toDate, setToDate ] = React.useState(
		moment().endOf('month')
	);
	const [ year, setYear ] = React.useState( {
	      label: moment().year(),
	      value: moment().year()
	} );
  const [ month, setMonth ] = React.useState(
		months[moment().month()]
	);

	const client = useApolloClient();

	const [ chosenStatuses, setChosenStatuses ] = React.useState( [] );

	const [ fetchInvoiceCompanies, { loading: invoiceCompaniesLoading, data: invoiceCompaniesData }] = useLazyQuery(GET_INVOICE_COMPANIES);

	const [ fetchCompanyInvoice, { loading: companyInvoiceLoading, data: companyInvoiceData }] = useLazyQuery(GET_COMPANY_INVOICE_DATA);

	const onTrigger = (newFrom, newTo) => {
		fetchInvoiceCompanies({
	    variables: {
	      fromDate: newFrom ? newFrom.valueOf().toString() : fromDate.valueOf().toString(),
				toDate: newTo ? newTo.valueOf().toString() : toDate.valueOf().toString(),
				statuses: chosenStatuses.map(status => status.id)
	    }
		});
	}

	const onTriggerCheck = (taskId) => {
		if (pickedTasks.includes(taskId)){
			setPickedTasks( pickedTasks.filter(id => id !== taskId) );
		} else {
			setPickedTasks( [...pickedTasks, taskId] );
		}
	}

	const onClickTask = (taskId) => {
		console.log("clicked!");
	}

	const [ pickedTasks, setPickedTasks ] = React.useState( [] );
	const [ showCompany, setShowCompany ] = React.useState( null );

	React.useEffect( () => {
		if ( !statusesLoading ) {
			const statuses = statusesData && statusesData.statuses ?
			toSelArr( orderArr( statusesData.statuses.filter( (status) => status.action === 'CloseDate') ) ) :
			[];
			setChosenStatuses( statuses );
			client.writeData( {
				data: {
					reportsChosenStatuses: statuses.map(status => status.id),
				}
			} );
		}
	}, [ statusesLoading ] );

	React.useEffect( () => {
		if (chosenStatuses.length > 0){
			onTrigger();
		}
	}, [ chosenStatuses ] );

	React.useEffect( () => {
		if (showCompany !== null){
			fetchCompanyInvoice({
				variables: {
					fromDate: fromDate.valueOf().toString(),
					toDate: toDate.valueOf().toString(),
					statuses: chosenStatuses.map(status => status.id),
					companyId: showCompany.id
				}
			});
		}
	}, [ showCompany ] );

	const invoiceTasks = () => {

	}

	const loading = statusesLoading || invoiceCompaniesLoading;

	const STATUSES = statusesData && statusesData.statuses ?  toSelArr( orderArr( statusesData.statuses ) ) : [];
	const INVOICE_COMPANIES = invoiceCompaniesData && invoiceCompaniesData.getInvoiceCompanies ? invoiceCompaniesData.getInvoiceCompanies : [];

 const statusIDs = chosenStatuses.map(status => status.id);

	console.log(companyInvoiceData);
	const currentInvoiceData = companyInvoiceData ? companyInvoiceData.getCompanyInvoiceData : {};

	return (
		<div className="scrollable fit-with-header">
			<h2 className="m-l-20 m-t-20">Firmy</h2>
			<div style={{maxWidth:500}}>
				<MonthSelector
					blockedShow={chosenStatuses.length === 0}
					fromDate={fromDate}
					onChangeFromDate={(date) => {
						setFromDate(date);
						client.writeData( {
							data: {
								reportsFromDate: date.valueOf(),
							}
						} );
					}}
					toDate={toDate}
					onChangeToDate={(date) => {
						setToDate(date);
						client.writeData( {
							data: {
								reportsToDate: date.valueOf(),
							}
						} );
					}}
					year={year}
					onChangeYear={(yr) => {
						setYear(yr);
						client.writeData( {
							data: {
								reportsYear: yr.value,
							}
						} );
					}}
					month={month}
					onChangeMonth={(mn) => {
						setMonth(mn);
						client.writeData( {
							data: {
								reportsMonth: mn.value,
							}
						} );
					}}
					onTrigger={onTrigger}
					 />
				<div className="p-20">
					<Select
						value={chosenStatuses}
						placeholder="Vyberte statusy"
						isMulti
						onChange={(newChosenStatuses)=> {
							setChosenStatuses(newChosenStatuses);
							client.writeData( {
								data: {
									reportsChosenStatuses: newChosenStatuses.map(status => status.id),
								}
							} );
						}}
						options={STATUSES}
						styles={selectStyleColored}
						/>
				</div>
			</div>

			{
				loading &&
				<Loading />
			}
			{
				!loading &&
				<div className="p-20">
						<table className="table m-b-10">
							<thead>
								<tr>
									<th>Company name</th>
									<th>Work hours</th>
									<th>Materials</th>
									<th>Vlastné položky</th>
									<th>Trips</th>
									<th>Rented items</th>
								</tr>
							</thead>
								<tbody>
									{
										INVOICE_COMPANIES.map((inv)=>
										<tr
											key={inv.company.id}
											className="clickable"
											onClick={()=> setShowCompany(inv.company)}>
										<td>{inv.company.title}</td>
										<td>{inv.subtasksHours}</td>
										<td>{inv.materialsQuantity}</td>
										<td>{inv.customItemsQuantity}</td>
										<td>{inv.tripsHours}</td>
										<td>{inv.rentedItemsQuantity}</td>
										</tr>)
										}
								</tbody>
						</table>
						{
							showCompany !== null &&
							<div className="commandbar">
								<Button
									className="btn-primary center-hor"
									onClick={()=>{console.log("fakturovanie");}}
									>
									{currentInvoiceData &&
										currentInvoiceData.pausalTasks &&
										(pickedTasks.length === currentInvoiceData.pausalTasks.length)  ? "Odznačiť všetky" : "Označiť všetky"}
								</Button>
								<Button
									className="btn-danger m-l-5 center-hor"
									onClick={invoiceTasks}
									>
									Faktúrovať
								</Button>
							</div>
						}
						{showCompany !==null &&
							<div className="p-20">
								<h2>Fakturačný výkaz firmy</h2>
								<div className="flex-row m-b-30">
									<div>
										Firma {showCompany.title} <br/>
									Obdobie od: {timestampToDate(fromDate)} do: {timestampToDate(toDate)}
									</div>
									<div className="m-l-10">
										Počet prác vrámci paušálu: {currentInvoiceData && currentInvoiceData.pausalCounts && currentInvoiceData.pausalCounts.subtasks ?
										currentInvoiceData.pausalCounts.subtasks.length : 0}
										<br/>
										Počet výjazdov vrámci paušálu: {currentInvoiceData && currentInvoiceData.pausalCounts && currentInvoiceData.pausalCounts.trips ?
										currentInvoiceData.pausalCounts.trips.length : 0}
									</div>
								</div>

								<div className="m-b-30">
									<h3 className="m-b-10">Práce a výjazdy v rámci paušálu</h3>
									<h4>Práce</h4>
									<hr />
										<ReportsTable
											tasks={
												currentInvoiceData &&
												currentInvoiceData.pausalTasks ?
												currentInvoiceData.pausalTasks.map(task =>
												({
													...task,
													checked: pickedTasks.includes(task.id)
												})) :
												[]
											}
											columnsToShow={[
												'id',
												'title',
												'requester',
												'assignedTo',
												'status',
												'closeDate',
												'description',
												'taskType',
												'hours',
											]}
											onTriggerCheck={onTriggerCheck}
											onClickTask={onClickTask}
											/>

									<p className="m-0">Spolu počet hodín: {
											currentInvoiceData &&
											currentInvoiceData.pausalCounts &&
											currentInvoiceData.pausalCounts.subtasks ?
											currentInvoiceData.pausalCounts.subtasks : 0
										}
									</p>
									<p className="m-0">Spolu počet hodín mimo pracovný čas: {
											currentInvoiceData &&
											currentInvoiceData.pausalCounts &&
											currentInvoiceData.pausalCounts.subtasksAfterHours ?
											currentInvoiceData.pausalCounts.subtasksAfterHours : 0
										} ( Čísla úloh: {
												currentInvoiceData &&
												currentInvoiceData.pausalCounts &&
												currentInvoiceData.pausalCounts.subtasksAfterHoursTaskIds ? currentInvoiceData.pausalCounts.subtasksAfterHoursTaskIds.join(",") :
												""
											})
									</p>
									<p className="m-0 m-b-10">Spolu prirážka za práce mimo pracovných hodín: {
											currentInvoiceData &&
											currentInvoiceData.pausalCounts &&
											currentInvoiceData.pausalCounts.subtasksAfterHoursPrice ?
											currentInvoiceData.pausalCounts.subtasksAfterHoursPrice :
										0
									} eur
									</p>

									<h4>Výjazdy</h4>
									<hr />
										<ReportsTable
											tasks={
												currentInvoiceData &&
												currentInvoiceData.pausalTasks ?
												currentInvoiceData.pausalTasks.map(task =>
												({
													...task,
													checked: pickedTasks.includes(task.id)
												})) :
												[]
											}
											columnsToShow={[
												'id',
												'title',
												'requester',
												'assignedTo',
												'status',
												'closeDate',
												'tripType',
												'quantity',
											]}
											onTriggerCheck={onTriggerCheck}
											onClickTask={onClickTask}
											/>
											<p className="m-0">Spolu počet výjazdov: {
													currentInvoiceData &&
													currentInvoiceData.pausalCounts &&
													currentInvoiceData.pausalCounts.trips ?
													currentInvoiceData.pausalCounts.trips : 0
												}
											</p>
											<p className="m-0">Spolu počet výjazdov mimo pracovný čas: {
													currentInvoiceData &&
													currentInvoiceData.pausalCounts &&
													currentInvoiceData.pausalCounts.tripsAfterHours ?
													currentInvoiceData.pausalCounts.tripsAfterHours : 0
												} ( Čísla úloh: {
														currentInvoiceData &&
														currentInvoiceData.pausalCounts &&
														currentInvoiceData.pausalCounts.tripsAfterHoursTaskIds ? currentInvoiceData.pausalCounts.tripsAfterHoursTaskIds.join(",") :
														""
													})
											</p>
											<p className="m-0 m-b-10">Spolu prirážka za výjazdy mimo pracovných hodín: {
													currentInvoiceData &&
													currentInvoiceData.pausalCounts &&
													currentInvoiceData.pausalCounts.tripsAfterHoursPrice ?
													currentInvoiceData.pausalCounts.tripsAfterHoursPrice :
													0
												} eur
											</p>
							</div>
<div className="m-b-30">
							<h3 className="m-b-10">Práce a výjazdy nad rámec paušálu</h3>
							<h4>Práce</h4>
							<hr />
								<ReportsTable
									tasks={
										currentInvoiceData &&
										currentInvoiceData.overPausalTasks ?
										currentInvoiceData.overPausalTasks.map(task =>
										({
											...task,
											checked: pickedTasks.includes(task.id)
										})) :
										[]
									}
									columnsToShow={[
										'id',
										'title',
										'requester',
										'assignedTo',
										'status',
										'closeDate',
										'description',
										'taskType',
										'hours',
										'pricePerHour',
										'totalPrice'
									]}
									onTriggerCheck={onTriggerCheck}
									onClickTask={onClickTask}
									/>

									<p className="m-0">Spolu počet hodín: {
											currentInvoiceData &&
											currentInvoiceData.overPausalCounts &&
											currentInvoiceData.overPausalCounts.subtasks ?
											currentInvoiceData.overPausalCounts.subtasks : 0
										}
									</p>
									<p className="m-0">Spolu počet hodín mimo pracovný čas: {
											currentInvoiceData &&
											currentInvoiceData.overPausalCounts &&
											currentInvoiceData.overPausalCounts.subtasksAfterHours ?
											currentInvoiceData.overPausalCounts.subtasksAfterHours : 0
										} ( Čísla úloh: {
												currentInvoiceData &&
												currentInvoiceData.overPausalCounts &&
												currentInvoiceData.overPausalCounts.subtasksAfterHoursTaskIds ? currentInvoiceData.overPausalCounts.subtasksAfterHoursTaskIds.join(",") :
												""
											})
									</p>
									<p className="m-0">Spolu prirážka za práce mimo pracovných hodín: {
											currentInvoiceData &&
											currentInvoiceData.overPausalCounts &&
											currentInvoiceData.overPausalCounts.subtasksAfterHoursPrice ?
											currentInvoiceData.overPausalCounts.subtasksAfterHoursPrice :
										0
									} eur
									</p>
									<p className="m-0">Spolu cena bez DPH: {
											currentInvoiceData &&
											currentInvoiceData.overPausalCounts &&
											currentInvoiceData.overPausalCounts.subtasksTotalPriceWithoutDPH ?
											currentInvoiceData.overPausalCounts.subtasksTotalPriceWithoutDPH :
											0
										} eur
									</p>
									<p className="m-0">Spolu cena s DPH: {
											currentInvoiceData &&
											currentInvoiceData.overPausalCounts &&
											currentInvoiceData.overPausalCounts.subtasksTotalPriceWithDPH ?
											currentInvoiceData.overPausalCounts.subtasksTotalPriceWithDPH :
											0
										} eur
									</p>

							<h4>Výjazdy</h4>
							<hr />
							<ReportsTable
								tasks={
									currentInvoiceData &&
									currentInvoiceData.overPausalTasks ?
									currentInvoiceData.overPausalTasks.map(task =>
									({
										...task,
										checked: pickedTasks.includes(task.id)
									})) :
									[]
								}
								columnsToShow={[
									'id',
									'title',
									'requester',
									'assignedTo',
									'status',
									'closeDate',
									'tripType',
									'quantity',
									'pricePerUnit',
									'totalPrice'
								]}
								onTriggerCheck={onTriggerCheck}
								onClickTask={onClickTask}
								/>

								<p className="m-0">Spolu počet výjazdov: {
										currentInvoiceData &&
										currentInvoiceData.overPausalCounts &&
										currentInvoiceData.overPausalCounts.trips ?
										currentInvoiceData.overPausalCounts.trips : 0
									}
								</p>
								<p className="m-0">Spolu počet výjazdov mimo pracovný čas: {
										currentInvoiceData &&
										currentInvoiceData.overPausalCounts &&
										currentInvoiceData.overPausalCounts.tripsAfterHours ?
										currentInvoiceData.overPausalCounts.tripsAfterHours : 0
									} ( Čísla úloh: {
											currentInvoiceData &&
											currentInvoiceData.overPausalCounts &&
											currentInvoiceData.overPausalCounts.tripsAfterHoursTaskIds ? currentInvoiceData.overPausalCounts.tripsAfterHoursTaskIds.join(",") :
											""
										})
								</p>
								<p className="m-0">Spolu prirážka za výjazdy mimo pracovných hodín: {
										currentInvoiceData &&
										currentInvoiceData.overPausalCounts &&
										currentInvoiceData.overPausalCounts.tripsAfterHoursPrice ?
										currentInvoiceData.overPausalCounts.tripsAfterHoursPrice :
									0
								} eur
								</p>
								<p className="m-0">Spolu cena bez DPH: {
										currentInvoiceData &&
										currentInvoiceData.overPausalCounts &&
										currentInvoiceData.overPausalCounts.tripsTotalPriceWithoutDPH ?
										currentInvoiceData.overPausalCounts.tripsTotalPriceWithoutDPH :
										0
									} eur
								</p>
								<p className="m-0">Spolu cena s DPH: {
										currentInvoiceData &&
										currentInvoiceData.overPausalCounts &&
										currentInvoiceData.overPausalCounts.tripsTotalPriceWithDPH ?
										currentInvoiceData.overPausalCounts.tripsTotalPriceWithDPH :
										0
									} eur
								</p>

							</div>

						</div>}
				</div>
			}
		</div>
	);
}
