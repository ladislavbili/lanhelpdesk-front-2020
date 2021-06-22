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
    repeatEvent,
    closeContextMenu,
    openRepeat,
    addRepeatTime,
    repeatsRefetch,
    client,
    getFakeID,
    fakeEvents,
    setFakeEvents,
    expandRepeatTimeEvent,
    createEventFromRepeatTime,
  } = props;

  if ( !repeatEvent ) {
    return null;
  }
  const {
    repeat,
    time,
    newDate,
  } = repeatEvent;

  if ( !repeat.canEdit ) {
    return null;
  }

  return (
    <Popover trigger="legacy" placement="auto" isOpen={ repeatEvent !== null } target={`calendar-repeat-${repeat.id}-${time}`} toggle={closeContextMenu}>
      <PopoverHeader>Repeat options:</PopoverHeader>
      <PopoverBody style={{ fontSize: '1.2em' }}>
        <div>
        <button
          className="btn btn-link"
          onClick={() => {
            openRepeat({...repeat, newDate });
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
          const newFakeID = getFakeID();
          setFakeEvents(
            [
              ...fakeEvents,
              expandRepeatTimeEvent( createEventFromRepeatTime( {
                id: newFakeID,
                originalTrigger: time.toString(),
                triggersAt: newDate.toString(),
                canEdit: false,
                task: null,
                repeat,
                type: 'repeatTime',
              } ) )
            ]
          );
          closeContextMenu();
          addRepeatTime( {
            variables: {
              repeatId: repeat.id,
              originalTrigger: time.toString(),
              triggersAt: newDate.toString(),
            }
          })
            .then( ( response ) => {
              setFakeEvents( [ ...fakeEvents.filter( ( event ) => event.id !== newFakeID ), expandRepeatTimeEvent( createEventFromRepeatTime( response.data.addRepeatTime ) ) ] );
              repeatsRefetch();
            } )
            .catch( ( err ) => {
              setFakeEvents( fakeEvents.filter( ( event ) => event.id !== newFakeID ) )
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