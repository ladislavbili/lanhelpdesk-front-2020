import React from 'react';
import {
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";
import {
  timestampToString
} from 'helperFunctions';
import {
  useTranslation
} from "react-i18next";
import {
  GET_TASK_CHANGES,
  TASK_HISTORY_SUBSCRIPTION,
} from './queries';
import Loading from 'components/loading';

export default function TaskHistory( props ) {
  const {
    task,
    fromInvoice,
  } = props;

  const {
    t
  } = useTranslation();

  const {
    data: taskChangesData,
    loading: taskChangesLoading,
    refetch: taskChangesRefetch,
    error: taskChangesError,
  } = useQuery( GET_TASK_CHANGES, {
    variables: {
      taskId: task.id,
      fromInvoice,
    },
    fetchPolicy: 'network-only'
  } );

  useSubscription( TASK_HISTORY_SUBSCRIPTION, {
    variables: {
      taskId: task.id,
    },
    onSubscriptionData: () => {
      taskChangesRefetch( {
        variables: {
          task: task.id,
          fromInvoice,
        }
      } );
    }
  } );


  React.useEffect( () => {
    taskChangesRefetch( {
      variables: {
        taskId: task.id,
        fromInvoice,
      }
    } );
  }, [ task.id ] );

  const groupHistory = () => {
    let groupedHistory = [];
    let group = {
      user: {
        id: null
      },
      events: []
    };
    getHistory()
      .forEach( ( event ) => {
        const newEvent = {
          createdAt: event.createdAt,
          messages: event.messages,
          id: event.id,
        };
        if ( group.user.id === event.user.id ) {
          group.events.push( newEvent )
        } else {
          groupedHistory.push( group );
          group = {
            user: event.user,
            id: event.id,
            events: [
            newEvent
          ]
          }
        }
      } )
    groupedHistory.push( group );
    return groupedHistory.splice( 1, groupedHistory.length );
  }

  const getHistory = () => {
    return ( taskChangesError ? [] : taskChangesData.taskChanges )
      .map( ( taskChange ) => {
        let event = {
          user: taskChange.user ? taskChange.user : {
            fullName: t( 'unknownUser' ),
            id: -1
          },
          createdAt: parseInt( taskChange.createdAt ),
          id: taskChange.id
        }
        if ( taskChange.taskChangeMessages.length === 0 ) {
          event.messages = [ t( 'unspecifiedChangeMessage' ) ]
        } else {
          event.messages = taskChange.taskChangeMessages.map( ( taskChangeMessage ) => taskChangeMessage.message )
        }
        return event;
      } )
  }

  const renderMultipleMessages = ( event ) => {
    return (
      <div style={{ marginBottom: '1rem' }} className="row" key={event.id}>
        <p className="color-muted m-b-0">
          {timestampToString(event.createdAt)}
        </p>
        <div className="m-l-5">
          {event.messages.map((message,index) => (
            <p className="m-b-0" key={index}>
              {message}
            </p>
          ))}
        </div>
      </div>
    )
  }

  const renderSingleMessage = ( event ) => {
    return (
      <p>
        <span className="color-muted">
          {timestampToString(event.createdAt)}
        </span>
        <span className="p-l-5">
          {event.messages[0]}
        </span>
      </p>
    )
  }

  if ( taskChangesLoading ) {
    return <Loading />
  }

  return (
    <div>
      <h3>{t('history')}</h3>
      <ListGroup>
        { groupHistory().map( (eventGroup, index) => (
          <ListGroupItem key={index}>
            <p>
              {t('changesMadeBy')}: <span className="bolder">{eventGroup.user.fullName}</span>
          </p>
          {eventGroup.events.map( (event) =>
            renderMultipleMessages(event)
          )}
        </ListGroupItem>
      ))}
    </ListGroup>
    {	getHistory().length===0 && <div>{t('historyIsEmpty')}.</div>	}
  </div>
  )
}