import React from 'react';

import {
	useQuery,
	useLazyQuery,
	useMutation,
	useApolloClient
} from "@apollo/client";

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
  setReportsChosenStatuses,
	setReportsFromDate,
	setReportsToDate,
	setReportsYear,
	setReportsMonth
} from 'apollo/localSchema/actions';

import {
  GET_INVOICE_COMPANIES,
	GET_COMPANY_INVOICE_DATA,
	GET_STATUSES,
	GET_LOCAL_CACHE,
	CREATE_TASK_INVOICE
} from './querries';

export default function  MothlyReportsCompany (props) {
	const {
		data: localCache
	} = useQuery( GET_LOCAL_CACHE );

	const {
    data: statusesData,
    loading: statusesLoading
  } = useQuery( GET_STATUSES );

  const [ createTaskInvoiceFunc ] = useMutation( CREATE_TASK_INVOICE );

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

	const onClickTask = (taskId) => {
		console.log("clicked!");
	}

	const [ showCompany, setShowCompany ] = React.useState( null );

	React.useEffect( () => {
		if ( !statusesLoading ) {
			const statuses = statusesData && statusesData.statuses ?
			toSelArr( orderArr( statusesData.statuses.filter( (status) => status.action === 'CloseDate') ) ) :
			[];
			setChosenStatuses( statuses );
			setReportsChosenStatuses( statuses.map(status => status.id) );
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
				},
		//		options: { fetchPolicy: 'network-only' }
			});
		}
	}, [ showCompany ] );

	const invoiceTasks = () => {
		let pausalTasks = currentInvoiceData.pausalTasks.map(task => ({id: task.id, title: task.title}));
		let ids = pausalTasks.map(task => id);

		let overPausalTasks = currentInvoiceData.overPausalTasks.filter(task => !ids.includes(task.id));
		ids.concat( overPausalTasks.map(task => id) );
		let allTasks = pausalTasks.concat( overPausalTasks.map(task => ({id: task.id, title: task.title})) );

		let projectTasks = currentInvoiceData.projectTasks.filter(task => !ids.includes(task.id));
		ids.concat( projectTasks.map(task => id) );
		allTasks = pausalTasks.concat( projectTasks.map(task => ({id: task.id, title: task.title})) );

		let materialTasks = currentInvoiceData.materialTasks.filter(task => !ids.includes(task.id));
		ids.concat( materialTasks.map(task => id) );
		allTasks = pausalTasks.concat( materialTasks.map(task => ({id: task.id, title: task.title})) );

		allTasks.forEach((task) => {
			createTaskInvoice( {
	        variables: {
						fromDate: fromDate.valueOf().toString(),
						toDate: toDate.valueOf().toString(),
						statuses: chosenStatuses.map(status => status.id),
						companyId: showCompany.id,
						title: task.title
	        }
	      } )
	      .then( ( response ) => {
	      } )
	      .catch( ( err ) => {
	        console.log( err.message );
					console.log( task.id, task.title );
	      } );
		});



	}

	const loading = statusesLoading || invoiceCompaniesLoading;

	const statuses = statusesData && statusesData.statuses ?  toSelArr( orderArr( statusesData.statuses ) ) : [];
	const INVOICE_COMPANIES = invoiceCompaniesData && invoiceCompaniesData.getInvoiceCompanies ? invoiceCompaniesData.getInvoiceCompanies : [];

 const statusIDs = chosenStatuses.map(status => status.id);

	const currentInvoiceData = companyInvoiceData ? companyInvoiceData.getCompanyInvoiceData : {};

	console.log(currentInvoiceData);

	return (
		<div className="scrollable fit-with-header">
			<h2 className="m-l-20 m-t-20">Firmy</h2>
			<div style={{maxWidth:500}}>
				<MonthSelector
					blockedShow={chosenStatuses.length === 0}
					fromDate={fromDate}
					onChangeFromDate={(date) => {
						setFromDate(date);
						setReportsFromDate( date.valueOf() );
					}}
					toDate={toDate}
					onChangeToDate={(date) => {
						setToDate(date);
						setReportsToDate( date.valueOf() );
					}}
					year={year}
					onChangeYear={(yr) => {
						setYear(yr);
						setReportsYear( yr.value);
					}}
					month={month}
					onChangeMonth={(mn) => {
						setMonth(mn);
						setReportsMonth( mn.value );
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
							setReportsChosenStatuses( newChosenStatuses.map(status => status.id) );
						}}
						options={statuses}
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
									className="btn-danger m-l-5 center-hor"
									onClick={invoiceTasks}
									>
									Faktúrovať
								</Button>
							</div>
						}

						{
							showCompany !== null &&
							Object.keys(currentInvoiceData).length === 0 &&
							<Loading />
						}

						{showCompany !== null &&
							Object.keys(currentInvoiceData).length > 0 &&
							<div className="p-20">
								<h2>Fakturačný výkaz firmy</h2>
								<div className="flex-row m-b-30">
									<div>
										Firma {showCompany.title} <br/>
									Obdobie od: {timestampToDate(fromDate)} do: {timestampToDate(toDate)}
									</div>
									<div className="m-l-10">
										Počet prác vrámci paušálu: {currentInvoiceData && currentInvoiceData.pausalCounts && currentInvoiceData.pausalCounts.subtasks ?
										currentInvoiceData.pausalCounts.subtasks : 0}
										<br/>
										Počet výjazdov vrámci paušálu: {currentInvoiceData && currentInvoiceData.pausalCounts && currentInvoiceData.pausalCounts.trips ?
										currentInvoiceData.pausalCounts.trips : 0}
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
												currentInvoiceData.pausalTasks.filter(invoiceTask =>
													invoiceTask.subtasks.length > 0
												).map(invoiceTask =>
												({
													...invoiceTask.task,
													subtasks: invoiceTask.subtasks,
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
											onClickTask={onClickTask}
											/>

									<p className="m-0">Spolu počet hodín: {
											currentInvoiceData &&
											currentInvoiceData.pausalCounts &&
											currentInvoiceData.pausalCounts.subtasks ?
											currentInvoiceData.pausalCounts.subtasks.toFixed(2) : 0
										}
									</p>
									<p className="m-0">Spolu počet hodín mimo pracovný čas: {
											currentInvoiceData &&
											currentInvoiceData.pausalCounts &&
											currentInvoiceData.pausalCounts.subtasksAfterHours ?
											currentInvoiceData.pausalCounts.subtasksAfterHours.toFixed(2) : 0
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
											currentInvoiceData.pausalCounts.subtasksAfterHoursPrice.toFixed(2) :
										0
									} eur
									</p>

									<h4>Výjazdy</h4>
									<hr />
										<ReportsTable
											tasks={
												currentInvoiceData &&
												currentInvoiceData.pausalTasks ?
												currentInvoiceData.pausalTasks.filter(invoiceTask =>
													invoiceTask.trips.length > 0
												).map(invoiceTask =>
												({
													...invoiceTask.task,
													workTrips: invoiceTask.trips,
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
											onClickTask={onClickTask}
											/>
											<p className="m-0">Spolu počet výjazdov: {
													currentInvoiceData &&
													currentInvoiceData.pausalCounts &&
													currentInvoiceData.pausalCounts.trips ?
													currentInvoiceData.pausalCounts.trips.toFixed(2) : 0
												}
											</p>
											<p className="m-0">Spolu počet výjazdov mimo pracovný čas: {
													currentInvoiceData &&
													currentInvoiceData.pausalCounts &&
													currentInvoiceData.pausalCounts.tripsAfterHours ?
													currentInvoiceData.pausalCounts.tripsAfterHours.toFixed(2) : 0
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
													currentInvoiceData.pausalCounts.tripsAfterHoursPrice.toFixed(2) :
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
										currentInvoiceData.overPausalTasks.filter(invoiceTask =>
											invoiceTask.subtasks.length > 0
										).map(invoiceTask => {
											return {
											...invoiceTask.task,
											subtasks: invoiceTask.subtasks,
										}
									}) :
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
									onClickTask={onClickTask}
									/>

									<p className="m-0">Spolu počet hodín: {
											currentInvoiceData &&
											currentInvoiceData.overPausalCounts &&
											currentInvoiceData.overPausalCounts.subtasks ?
											currentInvoiceData.overPausalCounts.subtasks.toFixed(2) :
											0
										}
									</p>
									<p className="m-0">Spolu počet hodín mimo pracovný čas: {
											currentInvoiceData &&
											currentInvoiceData.overPausalCounts &&
											currentInvoiceData.overPausalCounts.subtasksAfterHours ?
											currentInvoiceData.overPausalCounts.subtasksAfterHours.toFixed(2) :
											0
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
											currentInvoiceData.overPausalCounts.subtasksAfterHoursPrice.toFixed(2) :
										0
									} eur
									</p>
									<p className="m-0">Spolu cena bez DPH: {
											currentInvoiceData &&
											currentInvoiceData.overPausalCounts &&
											currentInvoiceData.overPausalCounts.subtasksTotalPriceWithoutDPH ?
											currentInvoiceData.overPausalCounts.subtasksTotalPriceWithoutDPH.toFixed(2) :
											0
										} eur
									</p>
									<p className="m-0">Spolu cena s DPH: {
											currentInvoiceData &&
											currentInvoiceData.overPausalCounts &&
											currentInvoiceData.overPausalCounts.subtasksTotalPriceWithDPH ?
											currentInvoiceData.overPausalCounts.subtasksTotalPriceWithDPH.toFixed(2) :
											0
										} eur
									</p>

							<h4>Výjazdy</h4>
							<hr />
							<ReportsTable
								tasks={
									currentInvoiceData &&
									currentInvoiceData.overPausalTasks ?
									currentInvoiceData.overPausalTasks.filter(invoiceTask =>
										invoiceTask.trips.length > 0
									).map(invoiceTask =>
									({
										...invoiceTask.task,
										workTrips: invoiceTask.trips,
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
								onClickTask={onClickTask}
								/>

								<p className="m-0">Spolu počet výjazdov: {
										currentInvoiceData &&
										currentInvoiceData.overPausalCounts &&
										currentInvoiceData.overPausalCounts.trips ?
										currentInvoiceData.overPausalCounts.trips.toFixed(2) : 0
									}
								</p>
								<p className="m-0">Spolu počet výjazdov mimo pracovný čas: {
										currentInvoiceData &&
										currentInvoiceData.overPausalCounts &&
										currentInvoiceData.overPausalCounts.tripsAfterHours ?
										currentInvoiceData.overPausalCounts.tripsAfterHours.toFixed(2) : 0
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
										currentInvoiceData.overPausalCounts.tripsAfterHoursPrice.toFixed(2) :
									0
								} eur
								</p>
								<p className="m-0">Spolu cena bez DPH: {
										currentInvoiceData &&
										currentInvoiceData.overPausalCounts &&
										currentInvoiceData.overPausalCounts.tripsTotalPriceWithoutDPH ?
										currentInvoiceData.overPausalCounts.tripsTotalPriceWithoutDPH.toFixed(2) :
										0
									} eur
								</p>
								<p className="m-0">Spolu cena s DPH: {
										currentInvoiceData &&
										currentInvoiceData.overPausalCounts &&
										currentInvoiceData.overPausalCounts.tripsTotalPriceWithDPH ?
										currentInvoiceData.overPausalCounts.tripsTotalPriceWithDPH.toFixed(2) :
										0
									} eur
								</p>
							</div>

							<div className="m-b-30">
								<h3 className="m-b-10">Projektové práce a výjazdy</h3>
								<h4>Práce</h4>
								<hr />
									<ReportsTable
										tasks={
											currentInvoiceData &&
											currentInvoiceData.projectTasks ?
											currentInvoiceData.projectTasks.filter(invoiceTask =>invoiceTask.subtasks.length > 0
											).map(invoiceTask =>
											({
												...invoiceTask.task,
												subtasks: invoiceTask.subtasks,
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
										onClickTask={onClickTask}
										/>

								<p className="m-0">Spolu počet hodín: {
										currentInvoiceData &&
										currentInvoiceData.projectCounts &&
										currentInvoiceData.projectCounts.subtasks ?
										currentInvoiceData.projectCounts.subtasks.toFixed(2) :
										0
									}
								</p>
								<p className="m-0">Spolu počet hodín mimo pracovný čas: {
										currentInvoiceData &&
										currentInvoiceData.projectCounts &&
										currentInvoiceData.projectCounts.subtasksAfterHours ?
										currentInvoiceData.projectCounts.subtasksAfterHours.toFixed(2) :
										0
									} ( Čísla úloh: {
												currentInvoiceData &&
												currentInvoiceData.projectCounts &&
												currentInvoiceData.projectCounts.subtasksAfterHoursTaskIds ? currentInvoiceData.projectCounts.subtasksAfterHoursTaskIds.join(",") :
												""
											}) eur
								</p>
								<p className="m-0">Spolu prirážka za práce mimo pracovných hodín: {
										currentInvoiceData &&
										currentInvoiceData.projectCounts &&
										currentInvoiceData.projectCounts.subtasksAfterHoursPrice ?
										currentInvoiceData.projectCounts.subtasksAfterHoursPrice.toFixed(2) :
										0
									} eur
								</p>
								<p className="m-0">Spolu cena bez DPH: {
										currentInvoiceData &&
										currentInvoiceData.projectCounts &&
										currentInvoiceData.projectCounts.subtasksTotalPriceWithoutDPH ?
										currentInvoiceData.projectCounts.subtasksTotalPriceWithoutDPH.toFixed(2) :
										0
									} eur
								</p>
								<p className="m-0">Spolu cena s DPH: {
										currentInvoiceData &&
										currentInvoiceData.projectCounts &&
										currentInvoiceData.projectCounts.subtasksTotalPriceWithDPH ?
										currentInvoiceData.projectCounts.subtasksTotalPriceWithDPH.toFixed(2) :
										0
									} eur
								</p>

								<h4>Výjazdy</h4>
								<hr />
									<ReportsTable
										tasks={
											currentInvoiceData &&
											currentInvoiceData.projectTasks ?
											currentInvoiceData.projectTasks.filter(invoiceTask =>
												invoiceTask.trips.length > 0
											).map(invoiceTask =>
											({
												...invoiceTask.task,
												workTrips: invoiceTask.trips,
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
										onClickTask={onClickTask}
										/>

								<p className="m-0">Spolu počet výjazdov: {
										currentInvoiceData &&
										currentInvoiceData.projectCounts &&
										currentInvoiceData.projectCounts.trips ?
										currentInvoiceData.projectCounts.trips.toFixed(2) :
										0
									}
								</p>
								<p className="m-0">Spolu počet výjazdov mimo pracovný čas: {
										currentInvoiceData &&
										currentInvoiceData.projectCounts &&
										currentInvoiceData.projectCounts.tripsAfterHours ?
										currentInvoiceData.projectCounts.tripsAfterHours.toFixed(2) :
										0
									} ( Čísla úloh: {
												currentInvoiceData &&
												currentInvoiceData.projectCounts &&
												currentInvoiceData.projectCounts.tripsAfterHoursTaskIds ? currentInvoiceData.projectCounts.tripsAfterHoursTaskIds.join(",") :
												""
											}) eur
								</p>
								<p className="m-0">Spolu prirážka za výjazdov mimo pracovných hodín: {
										currentInvoiceData &&
										currentInvoiceData.projectCounts &&
										currentInvoiceData.projectCounts.tripsAfterHoursPrice ?
										currentInvoiceData.projectCounts.tripsAfterHoursPrice.toFixed(2) :
										0
									} eur
								</p>
								<p className="m-0">Spolu cena bez DPH: {
										currentInvoiceData &&
										currentInvoiceData.projectCounts &&
										currentInvoiceData.projectCounts.tripsTotalPriceWithoutDPH ?
										currentInvoiceData.projectCounts.tripsTotalPriceWithoutDPH.toFixed(2) :
										0
									} eur
								</p>
								<p className="m-0">Spolu cena s DPH: {
										currentInvoiceData &&
										currentInvoiceData.projectCounts &&
										currentInvoiceData.projectCounts.tripsTotalPriceWithDPH ?
										currentInvoiceData.projectCounts.tripsTotalPriceWithDPH.toFixed(2) :
										0
									} eur
								</p>
							</div>
							<div className="m-b-30">
								<h3>Materiále a voľné položky</h3>
								<hr />

									<ReportsTable
										tasks={
											currentInvoiceData &&
											currentInvoiceData.materialTasks ?
											currentInvoiceData.materialTasks.filter(invoiceMaterial =>
												invoiceMaterial.materials.length + invoiceMaterial.customItems.length > 1
											).map(invoiceMaterial =>
											({
												...invoiceMaterial.task,
												materials: invoiceMaterial.materials,
												customItems: invoiceMaterial.customItems
											})) :
											[]
										}
										columnsToShow={[
											'id',
											'title',
											'requester',
											'assignedTo',
											'status',
											'statusChange',
											'material',
											'quantity',
											'unit',
											'pricePerQuantity',
											'totalPrice'
										]}
										onClickTask={onClickTask}
										/>

									<p className="m-0">Spolu cena bez DPH: {
											currentInvoiceData &&
											currentInvoiceData.totalMaterialAndCustomItemPriceWithoutDPH ?
											currentInvoiceData.totalMaterialAndCustomItemPriceWithoutDPH.toFixed(2) :
											0
										} eur</p>
								<p className="m-0">Spolu cena s DPH: {
										currentInvoiceData &&
										currentInvoiceData.totalMaterialAndCustomItemPriceWithDPH ?
										currentInvoiceData.totalMaterialAndCustomItemPriceWithDPH.toFixed(2) :
										0
									} eur</p>
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
										{currentInvoiceData &&
											currentInvoiceData.company &&
											currentInvoiceData.company.companyRents &&
											currentInvoiceData.company.companyRents.map((rentedItem)=>
											<tr key={rentedItem.id}>
												<td>{rentedItem.id}</td>
												<td>{rentedItem.title}</td>
												<td>{rentedItem.quantity}</td>
												<td>{rentedItem.price}</td>
												<td>{rentedItem.total}</td>
											</tr>
										)}
									</tbody>
								</table>
								<p className="m-0">Spolu cena bez DPH: {
										currentInvoiceData &&
										currentInvoiceData.companyRentsCounts &&
										currentInvoiceData.companyRentsCounts.totalWithoutDPH ?
										currentInvoiceData.companyRentsCounts.totalWithoutDPH :
										0
										} eur </p>
								<p className="m-0">Spolu cena s DPH: {
										currentInvoiceData &&
										currentInvoiceData.companyRentsCounts &&
										currentInvoiceData.companyRentsCounts.totalWithDPH ?
										currentInvoiceData.companyRentsCounts.totalWithDPH :
										0
										} eur</p>
							</div>

						</div>}

						<Modal isOpen={false} toggle={()=>{}} >
							<ModalHeader toggle={()=>{}}>{}</ModalHeader>
							<ModalBody>
								{ /*false &&
									<TaskEdit inModal={true} columns={true}  closeModal={()=>{}}/>
								*/}
							</ModalBody>
						</Modal>

				</div>
			}
		</div>
	);
}
