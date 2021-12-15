import React from 'react';
import {
  Popover,
  PopoverHeader,
  PopoverBody,
} from 'reactstrap';
import {
  useTranslation
} from "react-i18next";
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
    createEventFromRepeatTime,
  } = props;

  const {
    t
  } = useTranslation();

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
      <PopoverHeader>{t('repeatOptions')}:</PopoverHeader>
      <PopoverBody style={{ fontSize: '1.2em' }}>
        <div>
        <button
          className="btn btn-link"
          onClick={() => {
            openRepeat({...repeat, newDate });
            closeContextMenu();
          }}
          >
          {t('moveOnlyThisEventHere')}
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
              createEventFromRepeatTime( {
                id: newFakeID,
                originalTrigger: time.toString(),
                triggersAt: newDate.toString(),
                canEdit: false,
                task: null,
                repeat,
                type: 'repeatTime',
              } )
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
              setFakeEvents( [ ...fakeEvents.filter( ( event ) => event.id !== newFakeID ), createEventFromRepeatTime( response.data.addRepeatTime ) ] );
              repeatsRefetch();
            } )
            .catch( ( err ) => {
              setFakeEvents( fakeEvents.filter( ( event ) => event.id !== newFakeID ) )
              addLocalError( err );
            } );
        }}
        >
        {t('editRepeatTemplateOfThisEvent')}
      </button>
    </div>
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