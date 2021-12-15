import React from 'react';
import {
  Popover,
  PopoverHeader,
  PopoverBody,
} from 'reactstrap';

import {
  useTranslation
} from "react-i18next";

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

  const {
    t
  } = useTranslation();

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
      <PopoverHeader>{t('repeatTimeOptions')}:</PopoverHeader>
      <PopoverBody style={{ fontSize: '1.2em' }}>
        <div>
          <button
            className="btn btn-link"
            onClick={() => {
              openRepeat(repeatTime.repeat);
              closeContextMenu();
            }}
            >
            {t('openRepeat')}
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
              {t('openRepeatTask')}
            </button>
          </div>
        }
        { !repeatTime.task && !repeatTime.triggered && repeatTime.canCreateTask &&
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
              {t('triggerRepeatCreateTask')}
            </button>
          </div>
        }
        <hr/>
        <div className="h5 bolder">
          {t('repeatDetails')}:
        </div>
        <div>
          {`${t('repeatId')}: ${repeat.id}`}
        </div>
        <div>
          {`${t('repeatedEvery')} ${repeat.repeatEvery} ${repeat.repeatInterval}`}
        </div>
        <div>
          {`${ repeatTime.task ? t('taskWasOriginallyNamed') : t('taskWillBeNamed')} ${repeat.repeatTemplate.title}`}
        </div>
      </PopoverBody>
    </Popover>
  )
}