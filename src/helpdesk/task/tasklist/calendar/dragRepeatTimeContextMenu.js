import React from 'react';
import {
  Popover,
  PopoverHeader,
  PopoverBody,
} from 'reactstrap';

export default function DragRepeatContextMenu( props ) {
  const {
    repeatTimeEvent,
    closeContextMenu,
    openRepeat,
    updateRepeatTime,
    repeatTimesRefetch,
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
          updateRepeatTime( {
            variables: {
              id: repeatTime.id,
              triggersAt: newDate.toString(),
            }
          }).then((response) => {
            repeatTimesRefetch();
          })
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