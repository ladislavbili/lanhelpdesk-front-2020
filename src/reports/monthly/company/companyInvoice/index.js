import React from 'react';
import {
  useQuery,
} from "@apollo/client";

import {
  localFilterToValues,
} from 'helperFunctions';
import {
  getEmptyGeneralFilter
} from 'configs/constants/filter';

import Loading from 'components/loading';
import CompanyInvoice from './companyInvoice';

import {
  GET_TASKS,
} from 'helpdesk/task/queries/listQueries.js';

import {
  GET_REPORTS_FROM_DATE,
  GET_REPORTS_TO_DATE,
} from 'apollo/localSchema/queries';

export default function CompanyInvoiceLoader( props ) {
  const {
    company,
  } = props;

  const {
    data: tasksData,
    loading: tasksLoading,
    refetch: tasksRefetch,
  } = useQuery( GET_TASKS, {
    variables: {
      filter: {
        ...localFilterToValues( getEmptyGeneralFilter() ),
        companies: [ company.id ],
      },
      sort: {
        asc: false,
        key: 'title'
      },
      page: 1,
      limit: 20,
    },
    notifyOnNetworkStatusChange: true,
  } );

  const {
    data: fromDateData,
  } = useQuery( GET_REPORTS_FROM_DATE );
  const {
    data: toDateData,
  } = useQuery( GET_REPORTS_TO_DATE );

  React.useEffect( () => {
    tasksRefetch( {
      variables: {
        filter: {
          ...localFilterToValues( getEmptyGeneralFilter() ),
          companies: [ company.id ],
        },
        sort: {
          asc: false,
          key: 'title'
        },
        page: 1,
        limit: 20,
      },
    } );
  }, [ company ] );

  if ( tasksLoading ) {
    return (
      <Loading />
    );
  }

  const generateRandomArray = () => {
    const randomLimit = Math.floor( Math.random() * 4 );
    let array = [];
    for ( let i = 0; i < randomLimit; i++ ) {
      array.push( i );
    }
    return array;
  }

  const generateRandomDate = () => {
    const start = new Date( 2012, 0, 1 );
    const end = new Date();
    return ( new Date( start.getTime() + Math.random() * ( end.getTime() - start.getTime() ) ) )
      .valueOf()
      .toString();
  }

  const fakeTaskData = {
    ...tasksData.tasks,
    tasks: tasksData.tasks.tasks.map( ( task ) => ( {
      ...task,
      closeDate: generateRandomDate(),
      subtasks: task.subtasks.map( ( subtask, index ) => ( {
        ...subtask,
        type: {
          title: `Task type ${index}`
        },
        price: parseFloat( ( Math.floor( Math.random() * 15 ) )
          .toFixed() ),
      } ) ),
      workTrips: generateRandomArray()
        .map( ( index ) => ( {
          id: index,
          type: {
            title: `Trip type ${index}`
          },
          quantity: parseFloat( ( Math.floor( Math.random() * 15 ) )
            .toFixed() ),
          price: parseFloat( ( Math.floor( Math.random() * 15 ) )
            .toFixed() ),
        } ) ),
      materials: generateRandomArray()
        .map( ( index ) => ( {
          id: index,
          title: `Material ${index}`,
          quantity: parseFloat( ( Math.floor( Math.random() * 15 ) )
            .toFixed() ),
          price: parseFloat( ( Math.floor( Math.random() * 15 ) )
            .toFixed() ),
          totalPrice: parseFloat( ( Math.floor( Math.random() * 150 ) )
            .toFixed() ),
        } ) ),
    } ) )
  }

  return (
    <CompanyInvoice
      tasksData={fakeTaskData}
      company={company}
      fromDate={fromDateData.reportsFromDate}
      toDate={toDateData.reportsToDate}
      />
  );
}