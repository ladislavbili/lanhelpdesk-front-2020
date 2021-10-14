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
import AgentInvoice from './agentInvoice';

import {
  GET_TASKS,
} from 'helpdesk/task/queries/listQueries.js';

import {
  GET_REPORTS_FROM_DATE,
  GET_REPORTS_TO_DATE,
} from 'apollo/localSchema/queries';

export default function AgentInvoiceLoader( props ) {
  const {
    agent,
  } = props;

  const {
    data: tasksData,
    loading: tasksLoading,
    refetch: tasksRefetch,
  } = useQuery( GET_TASKS, {
    variables: {
      filter: {
        ...localFilterToValues( getEmptyGeneralFilter() ),
        assignedTos: [ agent.id ],
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
          assignedTos: [ agent.id ],
        },
        sort: {
          asc: false,
          key: 'title'
        },
        page: 1,
        limit: 20,
      },
    } );
  }, [ agent ] );

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

  let fakeTaskTypes = [
    {
      id: 1,
      title: 'Task type 1',
      quantity: ( Math.floor( Math.random() * 150 ) ),
    },
    {
      id: 2,
      title: 'Task type 2',
      quantity: ( Math.floor( Math.random() * 150 ) ),
    },
    {
      id: 3,
      title: 'Task type 3',
      quantity: ( Math.floor( Math.random() * 150 ) ),
    },
  ];

  let fakeTripTypes = [
    {
      id: 1,
      title: 'Trip type 1',
      quantity: ( Math.floor( Math.random() * 150 ) ),
    },
    {
      id: 2,
      title: 'Trip type 2',
      quantity: ( Math.floor( Math.random() * 150 ) ),
    },
    {
      id: 3,
      title: 'Trip type 3',
      quantity: ( Math.floor( Math.random() * 150 ) ),
    },
  ];

  return (
    <AgentInvoice
      tasksData={fakeTaskData}
      agent={agent}
      fromDate={fromDateData.reportsFromDate}
      toDate={toDateData.reportsToDate}
      fakeTaskTypes={fakeTaskTypes}
      fakeTripTypes={fakeTripTypes}
      />
  );
}