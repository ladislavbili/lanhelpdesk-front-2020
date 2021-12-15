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
    repeatTimeEvent,
    closeContextMenu,
    openRepeat,
    updateRepeatTime,
    repeatTimesRefetch,
    setFakeEvents,
    fakeEvents,
    client,
    repeatTimesVariables,
    createEventFromRepeatTime,
  } = props;

  const {
    t
  } = useTranslation();

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
      <PopoverHeader>{t('repeatOptions')}:</PopoverHeader>
      <PopoverBody style={{ fontSize: '1.2em' }}>
        <div>
          <button
            className="btn btn-link"
            onClick={() => {
              openRepeat({...repeatTime.repeat, newDate });
              closeContextMenu();
            }}
            >
            {t('editRepeatTemplateToThisTime')}
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
                   createEventFromRepeatTime( {
                    ...fakeEvents.find((event) => event.type === 'repeatTime' && event.repeatTime.id === repeatTime.id).repeatTime,
                    triggersAt: newDate.toString(),
                  } )
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
                    createEventFromRepeatTime( {
                      ...fakeEvents.find((event) => event.type === 'repeatTime' && event.repeatTime.id === repeatTime.id).repeatTime,
                      triggersAt: repeatTime.triggersAt,
                    } )
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
                addLocalError( err );
              } );
            }}
            >
            {t('moveOnlyThisEventHere')}
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