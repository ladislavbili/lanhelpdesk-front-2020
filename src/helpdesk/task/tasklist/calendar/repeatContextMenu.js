import React from 'react';
import {
  Popover,
  PopoverHeader,
  PopoverBody,
} from 'reactstrap';

export default function RepeatContextMenu( props ) {
  const {
    repeatEvent,
    closeContextMenu,
    openRepeat,
    repeatsRefetch,
    repeatTimesRefetch,
    tasksRefetch,
    triggerRepeat,
    openCreatedTask,

  } = props;

  if ( !repeatEvent ) {
    return null;
  }
  const {
    repeat,
    time
  } = repeatEvent;

  if ( !repeat.canEdit ) {
    return null;
  }

  return (
    <Popover trigger="legacy" placement="auto" isOpen={ repeatEvent !== null } target={`calendar-repeat-${repeat.id}-${time}`} toggle={closeContextMenu}>
      <PopoverHeader>Repeat options:</PopoverHeader>
      <PopoverBody style={{ fontSize: '1.2em' }}>
        <button
          className="btn btn-link"
          onClick={() => {
            openRepeat(repeat);
            closeContextMenu();
          }}
          >
          Open repeat template
        </button>
        <button
          className="btn btn-link"
          onClick={() => {
            closeContextMenu();
            triggerRepeat( {
              variables: {
                repeatId: repeat.id,
                repeatTimeId: null,
                originalTrigger: time.toString(),
              }
            }).then((response) => {
              repeatsRefetch();
              repeatTimesRefetch();
              tasksRefetch();
              openCreatedTask(response.data.triggerRepeat.id);
            })
          }}
          >
          Trigger repeat and create task
        </button>
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