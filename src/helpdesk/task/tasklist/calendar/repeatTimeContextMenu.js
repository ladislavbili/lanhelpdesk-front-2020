import React from 'react';
import {
  Popover,
  PopoverHeader,
  PopoverBody,
} from 'reactstrap';

export default function RepeatTimeContextMenu( props ) {
  const {
    repeatTimeEvent,
    closeContextMenu,
    openRepeat,
    openCreatedTask,
    triggerRepeat,
    repeatsRefetch,
    repeatTimesRefetch,
    tasksRefetch,
  } = props;

  if ( !repeatTimeEvent ) {
    return null;
  }

  const {
    repeatTime,
    time
  } = repeatTimeEvent;

  const repeat = repeatTime.repeat;

  if ( !repeatTime.canEdit ) {
    return null;
  }

  return (
    <Popover trigger="legacy" placement="auto" isOpen={ repeatTimeEvent !== null } target={`calendar-repeatTime-${repeatTime.id}-${time}`} toggle={closeContextMenu}>
      <PopoverHeader>Repeat time options:</PopoverHeader>
      <PopoverBody style={{ fontSize: '1.2em' }}>
        <div>
          <button
            className="btn btn-link"
            onClick={() => {
              openRepeat(repeatTime.repeat);
              closeContextMenu();
            }}
            >
            Open repeat template
          </button>
        </div>
        { repeatTime.task && repeatTime.triggered &&
          <div>
            <button
              className="btn btn-link"
              onClick={() => {
                openCreatedTask(repeatTime.task.id);
              }}
              >
              Open repeat task
            </button>
          </div>
        }
        { !repeatTime.task && !repeatTime.triggered &&
          <div>
            <button
              className="btn btn-link"
              onClick={() => {
              closeContextMenu();
                triggerRepeat( {
                    variables: {
                      repeatId: repeat.id,
                      repeatTimeId: repeatTime.id,
                      originalTrigger: repeatTime.originalTrigger,
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
          </div>
        }
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
          {`Task title ${ repeatTime.task ? `was originally named` : `will be`} named ${repeat.repeatTemplate.title}`}
        </div>
      </PopoverBody>
    </Popover>
  )
}