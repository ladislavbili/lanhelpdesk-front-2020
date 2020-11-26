import React from 'react';
import Select from 'react-select';
import Loading from 'components/loading';
import MonthSelector from 'reports/components/monthSelector';
import UserInvoice from './userInvoice';
import {
  useQuery,
  useLazyQuery,
} from "@apollo/client";

import {
  selectStyleColored
} from 'configs/components/select';

import {
  orderArr,
  toSelArr,
} from 'helperFunctions';


import {
  setReportsAgentStatuses,
  setReportsFromDate,
  setReportsToDate
} from 'apollo/localSchema/actions';

import {
  GET_REPORTS_AGENT_STATUSES,
  GET_REPORTS_FROM_DATE,
  GET_REPORTS_TO_DATE,
} from 'apollo/localSchema/querries';

import {
  GET_INVOICE_USERS,
  GET_USER_INVOICE
} from './queries';

export default function MothlyReportsAssigned( props ) {
  //local
  const {
    data: chosenStatusesData,
    loading: chosenStatusesLoading
  } = useQuery( GET_REPORTS_AGENT_STATUSES );
  const {
    data: fromDateData,
    loading: fromDateLoading
  } = useQuery( GET_REPORTS_FROM_DATE );
  const {
    data: toDateData,
    loading: toDateLoading
  } = useQuery( GET_REPORTS_TO_DATE );

  //network
  const [ fetchInvoiceUsers, {
    loading: invoiceUsersLoading,
    data: invoiceUsersData,
  } ] = useLazyQuery( GET_INVOICE_USERS );

  const [ fetchUserInvoice, {
    loading: userInvoiceLoading,
    data: userInvoiceData,
  } ] = useLazyQuery( GET_USER_INVOICE );

  //reactions
  React.useEffect( () => {
    if ( chosenStatusesData.reportsAgentStatuses.length > 0 ) {
      fetchUsers();
    }
  }, [ chosenStatusesData.reportsAgentStatuses ] );

  //state
  //constants
  const loading = (
    chosenStatusesLoading ||
    fromDateLoading ||
    toDateLoading
  )
  const fromDate = fromDateData.reportsFromDate;
  const toDate = toDateData.reportsToDate;

  //functions
  const fetchUsers = ( newFrom, newTo ) => {
    fetchInvoiceUsers( {
      variables: {
        fromDate: newFrom ?
          newFrom.valueOf()
          .toString() : fromDate.valueOf()
          .toString(),
        toDate: newTo ?
          newTo.valueOf()
          .toString() : toDate.valueOf()
          .toString(),
      },
    } );
  }

  const fetchInvoice = ( id ) => {
    fetchUserInvoice( {
      variables: {
        fromDate: fromDate.valueOf()
          .toString(),
        toDate: toDate.valueOf()
          .toString(),
        userId: id
      },
    } );
  }

  //renders
  const InvoiceUsersList = () => {
    if ( !invoiceUsersLoading && !invoiceUsersData ) {
      return null;
    } else if ( invoiceUsersLoading && !invoiceUsersData ) {
      return ( <Loading /> )
    }
    return (
      <div className="p-20">
        <table className="table m-b-10">
          <thead>
            <tr>
              <th>Assigned to</th>
              <th>Work hours</th>
              <th>Trip hours</th>
            </tr>
          </thead>
          <tbody>
            {invoiceUsersData.getInvoiceUsers.map( (invoiceUser) =>
              <tr key={invoiceUser.user.id} className="clickable" onClick={() => fetchInvoice(invoiceUser.user.id) }>
                <td>{`${invoiceUser.user.fullName}(${invoiceUser.user.email})`}</td>
                <td>{invoiceUser.subtasksHours}</td>
                <td>{invoiceUser.tripsHours}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }

  const InvoiceRender = () => {
    console.log( 'what' );
    if ( !userInvoiceLoading && !userInvoiceData ) {
      return null;
    } else if ( userInvoiceLoading && !userInvoiceData ) {
      console.log( 'loading' );
      return ( <Loading /> )
    }
    console.log( 'render' );
    return (
      <UserInvoice invoice={userInvoiceData.getUserInvoice} />
    )
  }

  if ( loading ) {
    return <Loading />
  }

  return (
    <div className="scrollable fit-with-header">
      <h2 className="m-l-20 m-t-20">Agenti</h2>
      <div style={{maxWidth:500}}>
        <MonthSelector
          blockedShow={chosenStatusesData.reportsAgentStatuses.length === 0}
          fromDate={fromDate}
          onTrigger={() => fetchUsers()}
          onChangeFromDate={(date) => {
            setReportsFromDate( date );
          }}
          toDate={toDate}
          onChangeToDate={(date) => {
            setReportsToDate( date );
          }}
          fetchUsers={fetchUsers}
          />
      </div>
      <InvoiceUsersList />
      <InvoiceRender />
    </div>
  );
}