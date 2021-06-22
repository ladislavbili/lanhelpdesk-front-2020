import React from 'react';
import {
  Popover,
  PopoverHeader,
  PopoverBody,
} from 'reactstrap';
import {
  GET_REPEAT_TIMES,
} from './querries';

export default function DragRepeatContextMenu( props ) {
  const {
    repeatTimeEvent,
    closeContextMenu,
    openRepeat,
    updateRepeatTime,
    repeatTimesRefetch,
    setFakeEvents,
    fakeEvents,
    client,
    repeatTimesVariables,
    expandRepeatTimeEvent,
    createEventFromRepeatTime,
  } = props;

  if ( !repeatTimeEvent ) {
    return null;
  }
  const {
    repeatTime,
    time,
    newDate,
  } = repeatTimeEvent;

  const repeat = repeatTime.repeat;

  if ( !repeatTime.canEdit ) {
    return null;
  }

  return (
    <Popover trigger="legacy" placement="auto" isOpen={ repeatTimeEvent !== null } target={`calendar-repeatTime-${repeatTime.id}-${time}`} toggle={closeContextMenu}>
      <PopoverHeader>Repeat options:</PopoverHeader>
      <PopoverBody style={{ fontSize: '1.2em' }}>
        <div>
          <button
            className="btn btn-link"
            onClick={() => {
              openRepeat({...repeatTime.repeat, newDate });
              closeContextMenu();
            }}
            >
            Edit repeat template to this time
          </button>
        </div>
        <div>
          <button
            className="btn btn-link"
            onClick={() => {
              closeContextMenu();
              if(fakeEvents.some((event) => event.type === 'repeatTime' && event.repeatTime.id === repeatTime.id )){
                setFakeEvents([
                  ...fakeEvents.filter((event) => event.type !== 'repeatTime' || event.repeatTime.id !== repeatTime.id),
                  expandRepeatTimeEvent( createEventFromRepeatTime( {
                    ...fakeEvents.find((event) => event.type === 'repeatTime' && event.repeatTime.id === repeatTime.id).repeatTime,
                    triggersAt: newDate.toString(),
                  } ) )
                ])
              }else{
                const repeatTimes = client.readQuery( {
                  query: GET_REPEAT_TIMES,
                  variables: repeatTimesVariables
                } )
                .repeatTimes;
                client.writeQuery( {
                  query: GET_REPEAT_TIMES,
                  variables: repeatTimesVariables,
                  data: {
                    repeatTimes: [
                      ...repeatTimes.filter( ( originalRepeatTime ) => originalRepeatTime.id !== repeatTime.id ),
                      {
                        ...repeatTimes.find( ( originalRepeatTime ) => originalRepeatTime.id === repeatTime.id ),
                        triggersAt: newDate.toString(),
                      }
                    ]
                  },
                } );
              }
              updateRepeatTime( {
                variables: {
                  id: repeatTime.id,
                  triggersAt: newDate.toString(),
                }
              }).catch( ( err ) => {
                if(fakeEvents.some((event) => event.type === 'repeatTime' && event.repeatTime.id === repeatTime.id )){
                  setFakeEvents([
                    ...fakeEvents.filter((event) => event.type !== 'repeatTime' || event.repeatTime.id !== repeatTime.id),
                    expandRepeatTimeEvent( createEventFromRepeatTime( {
                      ...fakeEvents.find((event) => event.type === 'repeatTime' && event.repeatTime.id === repeatTime.id).repeatTime,
                      triggersAt: repeatTime.triggersAt,
                    } ) )
                  ])
                }else{
                  const repeatTimes = client.readQuery( {
                    query: GET_REPEAT_TIMES,
                    variables: repeatTimesVariables
                  } )
                  .repeatTimes;
                  client.writeQuery( {
                    query: GET_REPEAT_TIMES,
                    variables: repeatTimesVariables,
                    data: {
                      repeatTimes: [
                        ...repeatTimes.filter( ( originalRepeatTime ) => originalRepeatTime.id !== repeatTime.id ),
                        {
                          ...repeatTimes.find( ( originalRepeatTime ) => originalRepeatTime.id === repeatTime.id ),
                          triggersAt: repeatTime.triggersAt,
                        }
                      ]
                    },
                  } );
                }
                console.log( 'err' );
                addLocalError( err );
              } );
            }}
            >
            Move only this event here
          </button>
        </div>
        <hr/>
        <div className="h5 bolder">
          Repeat details:
        </div>
        <div>
          {`Repeat id: ${repeat.id}`}
        </div>
        <div>
          {`Repeated every ${repeat.repeatEvery} ${repeat.repeatInterval}`}
        </div>
        <div>
          {`Task title will be named ${repeat.repeatTemplate.title}`}
        </div>
      </PopoverBody>
    </Popover>
  )
}