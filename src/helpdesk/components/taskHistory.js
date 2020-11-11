import React from 'react';
import {
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import {
  timestampToString
} from 'helperFunctions';

export default function TaskHistory( props ) {
  const {
    task
  } = props;

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
          messages: event.messages
        };
        if ( group.user.id === event.user.id ) {
          group.events.push( newEvent )
        } else {
          groupedHistory.push( group );
          group = {
            user: event.user,
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
    if ( !task ) {
      []
    }
    return task.taskChanges.map( ( taskChange ) => {
      let event = {
        user: taskChange.user ? taskChange.user : {
          fullName: 'Unknown user',
          id: -1
        },
        createdAt: parseInt( taskChange.createdAt )
      }
      if ( taskChange.taskChangeMessages.length === 0 ) {
        event.messages = [ 'Unspecified change was made.' ]
      } else {
        event.messages = taskChange.taskChangeMessages.map( ( taskChangeMessage ) => taskChangeMessage.message )
      }
      return event;
    } )
  }

  const renderMultipleMessages = ( event ) => {
    return (
      <div style={{ marginBottom: '1rem' }} className="row">
        <p className="text-muted m-b-0">
          {timestampToString(event.createdAt)}
        </p>
        <div className="m-l-5">
        {event.messages.map((message) => (
          <p className="m-b-0">
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
        <span className="text-muted">
          {timestampToString(event.createdAt)}
        </span>
        <span className="p-l-5">
          {event.messages[0]}
        </span>
      </p>
    )
  }

  return (
    <div>
      <h3>História</h3>
      <ListGroup>
        { groupHistory().map( (eventGroup, index) => (
          <ListGroupItem key={index}>
            <p>
              Changes made by: <span className="bolder">{eventGroup.user.fullName}</span>
            </p>
            {eventGroup.events.map( (event) =>
              renderMultipleMessages(event)
             )}
          </ListGroupItem>
        ))}
      </ListGroup>
      {	getHistory().length===0 && <div>História je prázdna.</div>	}
    </div>
  )
}