import React from 'react';

import {
	useQuery
} from "@apollo/react-hooks";

import moment from 'moment';
import Select from 'react-select';

import {
	toSelArr,
	orderArr
} from '../../helperFunctions';

import MonthSelector from '../components/monthSelector';
import Loading from 'components/loading';

import {
	selectStyleColored
} from 'configs/components/select';


import {
  GET_INVOICE_COMPANIES,
	GET_STATUSES
} from '../querries';

export default function  MothlyReportsCompany (props) {
	const {
    data: statusesData,
    loading: statusesLoading
  } = useQuery( GET_STATUSES );

	const [ fromDate, setFromDate ] = React.useState( moment({ year: moment().year(), month: moment().month(), day: 1}) );
	const [ toDate, setToDate ] = React.useState( moment({ year: moment().year(), month: moment().month(), day: moment().daysInMonth()}) );
	const [ chosenStatuses, setChosenStatuses ] = React.useState( [] );

	const {
    data: invoiceCompaniesData,
    loading: invoiceCompaniesLoading,
		refetch: invoiceCompaniesRefetch
  } = useQuery( GET_INVOICE_COMPANIES, {
    variables: {
      fromDate: fromDate.valueOf().toString(),
			toDate: toDate.valueOf().toString(),
			statuses: chosenStatuses.map(s => s.id)
    }
  });

	const refetchInvoices = () => {
		invoiceCompaniesRefetch();
	}

	//const [ pickedTasks, setPickedTasks ] = React.useState( [] );
	//const [ showCompany, setShowCompany ] = React.useState( null );

	React.useEffect( () => {
		if ( !statusesLoading ) {
			setChosenStatuses( 	statusesData && statusesData.statuses ? toSelArr( orderArr( statusesData.statuses.filter( (status) => status.action === 'CloseDate') ) ) : []);
		}
	}, [ statusesLoading ] );

	React.useEffect( () => {
		if (chosenStatuses.length > 0){
			refetchInvoices();
		}
	}, [ chosenStatuses ] );

	const loading = statusesLoading || invoiceCompaniesLoading;

	if (loading) {
		return ( <Loading /> );
	}

	const STATUSES = statusesData && statusesData.statuses ?  toSelArr( orderArr( statusesData.statuses ) ) : [];
	const INVOICE_COMPANIES = invoiceCompaniesData && invoiceCompaniesData.getInvoiceCompanies ? invoiceCompaniesData.getInvoiceCompanies : [];

	return (
		<div className="scrollable fit-with-header">
			<h2 className="m-l-20 m-t-20">Firmy</h2>
			<div style={{maxWidth:500}}>
				<MonthSelector
					fromDate={fromDate}
					setFromDate={setFromDate}
					toDate={toDate}
					setToDate={setToDate}
					refetchInvoices={refetchInvoices}
					 />
				<div className="p-20">
					<Select
						value={chosenStatuses}
						placeholder="Vyberte statusy"
						isMulti
						onChange={(e)=>setChosenStatuses(e)}
						options={STATUSES}
						styles={selectStyleColored}
						/>
				</div>
			</div>

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
							<tr key={inv.company.id} className="clickable" onClick={()=>{}}>
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
			</div>
		</div>
	);
}
