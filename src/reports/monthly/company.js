import React from 'react';

import {
	useQuery,
	useLazyQuery,
	useApolloClient
} from "@apollo/react-hooks";

import moment from 'moment';
import Select from 'react-select';

import {
	toSelArr,
	orderArr
} from 'helperFunctions';

import MonthSelector from '../components/monthSelector';
import Loading from 'components/loading';

import {
	selectStyleColored
} from 'configs/components/select';

import { months } from '../components/constants';

import {
  GET_INVOICE_COMPANIES,
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

	const onTrigger = (newFrom, newTo) => {
		fetchInvoiceCompanies({
	    variables: {
	      fromDate: newFrom ? newFrom.valueOf().toString() : fromDate.valueOf().toString(),
				toDate: newTo ? newTo.valueOf().toString() : toDate.valueOf().toString(),
				statuses: chosenStatuses.map(status => status.id)
	    }
		});
	}

	const [ pickedTasks, setPickedTasks ] = React.useState( [] );
	const [ allTasks, setAllTasks ] = React.useState( [] );
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

	const invoiceTasks = () => {

	}

	const loading = statusesLoading || invoiceCompaniesLoading;

	const STATUSES = statusesData && statusesData.statuses ?  toSelArr( orderArr( statusesData.statuses ) ) : [];
	const INVOICE_COMPANIES = invoiceCompaniesData && invoiceCompaniesData.getInvoiceCompanies ? invoiceCompaniesData.getInvoiceCompanies : [];

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
									onClick={()=>{}}
									>
									{pickedTasks.length === allTasks.filter((task) => showCompany && task.company.id === showCompany.id && statusIDs.includes(task.status.id)).length ? "Odznačiť všetky" : "Označiť všetky"}
								</Button>
								<Button
									className="btn-danger m-l-5 center-hor"
									onClick={invoiceTasks}
									>
									Faktúrovať
								</Button>
							</div>
						}
				</div>
			}
		</div>
	);
}
