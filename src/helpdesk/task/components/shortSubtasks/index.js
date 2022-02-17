import React from 'react';
import {
  updateArrayItem,
} from 'helperFunctions';
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import {
  useMutation,
} from "@apollo/client";
import ShortSubtasks from './shortSubtasks';
import {
  useTranslation
} from "react-i18next";
import {
  ADD_SHORT_SUBTASK,
  UPDATE_SHORT_SUBTASK,
  DELETE_SHORT_SUBTASK,
} from '../../queries';

import {
  ADD_SHORT_SUBTASK as REPEAT_ADD_SHORT_SUBTASK,
  UPDATE_SHORT_SUBTASK as REPEAT_UPDATE_SHORT_SUBTASK,
  DELETE_SHORT_SUBTASK as REPEAT_DELETE_SHORT_SUBTASK,
} from 'helpdesk/components/repeat/queries';

let fakeID = -1;

export default function ShortSubtasksLoader( props ) {
  const {
    edit,
    repeat,
    repeatID,
    taskID,
    disabled,
    fromInvoice,
    setSaving,
    updateCasheStorage,
    shortSubtasks,
    setShortSubtasks,
  } = props;

  const {
    t
  } = useTranslation();

  const [ addShortSubtask ] = useMutation( repeat ? REPEAT_ADD_SHORT_SUBTASK : ADD_SHORT_SUBTASK );
  const [ updateShortSubtask ] = useMutation( repeat ? REPEAT_UPDATE_SHORT_SUBTASK : UPDATE_SHORT_SUBTASK );
  const [ deleteShortSubtask ] = useMutation( repeat ? REPEAT_DELETE_SHORT_SUBTASK : DELETE_SHORT_SUBTASK );

  const addShortSubtaskFunc = ( shortSubtask ) => {
    if ( edit ) {
      setSaving( true );
      let body = shortSubtask;
      if ( repeat ) {
        body.repeatTemplate = repeatID;
      } else {
        body.task = taskID;
        body.fromInvoice = fromInvoice;
      }
      addShortSubtask( {
          variables: body
        } )
        .then( ( response ) => {
          if ( repeat ) {
            setShortSubtasks( [ ...shortSubtasks, {
              ...shortSubtask,
              id: response.data.addRepeatTemplateShortSubtask.id
            } ] );
            updateCasheStorage( response.data.addRepeatTemplateShortSubtask, 'shortSubtasks', 'ADD' );
          } else {
            updateCasheStorage( response.data.addShortSubtask, 'shortSubtasks', 'ADD' );
          }
        } )
        .catch( ( err ) => {
          addLocalError( err );
        } );

      setSaving( false );
    } else {
      shortSubtask.id = fakeID--;
      setShortSubtasks( [ ...shortSubtasks, shortSubtask ] )
    }
  }

  const updateShortSubtaskFunc = ( shortSubtask ) => {
    if ( edit ) {
      setSaving( true );

      updateShortSubtask( {
          variables: {
            id: shortSubtask.id,
            title: shortSubtask.title,
            done: shortSubtask.done,
            fromInvoice,
          }
        } )
        .then( ( response ) => {
          if ( repeat ) {
            setShortSubtasks( updateArrayItem( shortSubtasks, shortSubtask ) );
            updateCasheStorage( response.data.updateRepeatTemplateShortSubtask, 'shortSubtasks', 'UPDATE' );
          } else {
            updateCasheStorage( response.data.updateShortSubtask, 'shortSubtasks', 'UPDATE' );
          }
        } )
        .catch( ( err ) => {
          addLocalError( err );
        } );

      setSaving( false );
    } else {
      setShortSubtasks( updateArrayItem( shortSubtasks, shortSubtask ) );
    }
  }

  const deleteShortSubtaskFunc = ( shortSubtask ) => {
    if ( edit ) {
      deleteShortSubtask( {
          variables: {
            id: shortSubtask.id,
            fromInvoice,
          }
        } )
        .then( ( response ) => {
          if ( repeat ) {
            setShortSubtasks( shortSubtasks.filter( ( shortSubtask2 ) => shortSubtask2.id !== shortSubtask.id ) );
          }
          updateCasheStorage( shortSubtask, 'shortSubtasks', 'DELETE' );
        } )
        .catch( ( err ) => {
          addLocalError( err );
        } );
    } else {
      setShortSubtasks( shortSubtasks.filter( ( shortSubtask2 ) => shortSubtask2.id !== shortSubtask.id ) );
    }
  }

  return (
    <ShortSubtasks
      {...props}
      submitItem={addShortSubtaskFunc}
      onChange={updateShortSubtaskFunc}
      deleteItem={deleteShortSubtaskFunc}
      disabled={disabled}
      items={shortSubtasks}
      placeholder={t('shortSubtaskTitle')}
      newPlaceholder={t('newShortSubtaskTitle')}
      label={t('shortSubtask')}
      />
  );
}