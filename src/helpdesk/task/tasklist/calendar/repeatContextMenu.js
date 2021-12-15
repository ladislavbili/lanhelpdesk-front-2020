import React from 'react';
import {
  Popover,
  PopoverHeader,
  PopoverBody,
} from 'reactstrap';

import {
  useTranslation
} from "react-i18next";

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

  const {
    t
  } = useTranslation();

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
      <PopoverHeader>{t('repeatOptions')}:</PopoverHeader>
      <PopoverBody style={{ fontSize: '1.2em' }}>
        <button
          className="btn btn-link"
          onClick={() => {
            openRepeat(repeat);
            closeContextMenu();
          }}
          >
          {t('openRepeat')}
        </button>
        { repeat.canCreateTask &&
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
            {t('triggerRepeatCreateTask')}
          </button>
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
          {`${t('taskWillBeNamed')} ${repeat.repeatTemplate.title}`}
        </div>
      </PopoverBody>
    </Popover>
  )
}