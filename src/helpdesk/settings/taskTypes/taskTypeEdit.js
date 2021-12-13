import React from 'react';
import {
  useMutation,
  useQuery,
  useApolloClient,
} from "@apollo/client";
import classnames from 'classnames';

import {
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import {
  useTranslation
} from "react-i18next";

import Loading from 'components/loading';
import DeleteReplacement from 'components/deleteReplacement';
import SettingsInput from '../components/settingsInput';

import {
  toSelArr
} from 'helperFunctions';
import {
  addLocalError,
} from 'apollo/localSchema/actions';

import {
  GET_TASK_TYPE,
  UPDATE_TASK_TYPE,
  DELETE_TASK_TYPE,
  GET_TASK_TYPES,
} from './queries';

export default function TaskTypeEdit( props ) {
  const {
    history,
    match
  } = props;

  const {
    t
  } = useTranslation();
  const client = useApolloClient();
  const allTaskTypes = toSelArr( client.readQuery( {
      query: GET_TASK_TYPES
    } )
    .taskTypes );
  const filteredTaskTypes = allTaskTypes.filter( taskType => taskType.id !== parseInt( match.params.id ) );
  const theOnlyOneLeft = allTaskTypes.length < 2;

  const {
    data: taskTypeData,
    loading: taskTypeLoading,
    refetch: taskTypeRefetch
  } = useQuery( GET_TASK_TYPE, {
    variables: {
      id: parseInt( props.match.params.id )
    },
    fetchPolicy: 'network-only',
  } );

  const [ updateTaskType ] = useMutation( UPDATE_TASK_TYPE );
  const [ deleteTaskType ] = useMutation( DELETE_TASK_TYPE );

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ saving, setSaving ] = React.useState( false );
  const [ deleteOpen, setDeleteOpen ] = React.useState( false );

  const [ dataChanged, setDataChanged ] = React.useState( false );

  // sync
  React.useEffect( () => {
    if ( !taskTypeLoading ) {
      setData();
    }
  }, [ taskTypeLoading ] );

  React.useEffect( () => {
    taskTypeRefetch( {
        variables: {
          id: parseInt( match.params.id )
        }
      } )
      .then( setData );
  }, [ match.params.id ] );

  // functions
  const setData = () => {
    if ( taskTypeLoading ) {
      return;
    }
    const taskType = taskTypeData.taskType;
    setTitle( taskType.title );
    setOrder( taskType.order );
    setDataChanged( false );
  }

  const updateTaskTypeFunc = () => {
    setSaving( true );

    updateTaskType( {
        variables: {
          id: parseInt( match.params.id ),
          title,
          order: ( order !== '' ? parseInt( order ) : 0 ),
        }
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );

    setSaving( false );
    setDataChanged( false );
  };

  const deleteTaskTypeFunc = ( replacement ) => {
    setDeleteOpen( false );

    if ( window.confirm( t( 'generalConfirmation' ) ) ) {
      deleteTaskType( {
          variables: {
            id: parseInt( match.params.id ),
            newId: parseInt( replacement.id ),
          }
        } )
        .then( ( response ) => {
          history.push( '/helpdesk/settings/taskTypes' );
        } )
        .catch( ( err ) => {
          addLocalError( err );
        } );
    }
  };

  if ( taskTypeLoading ) {
    return <Loading />
  }

  return (
    <div className="scroll-visible p-20 fit-with-header">

      <h2 className="m-b-20" >
        {`${t('edit')} ${t('taskType').toLowerCase()}`}
      </h2>

      <SettingsInput
        required
        label={t('taskTypeTitle')}
        id="title"
        value={title}
        onChange={(e)=> {
          setTitle(e.target.value);
          setDataChanged( true );
        }}
        />

      <SettingsInput
        label={t('order')}
        placeholder={t('lowerMeansFirst')}
        id="order"
        value={order}
        onChange={(e)=> {
          setOrder(e.target.value);
          setDataChanged( true );
        }}
        />

      <div className="form-buttons-row">
        <button
          className="btn-red"
          disabled={saving || theOnlyOneLeft}
          onClick={() => {
            setDeleteOpen(true);
            setDataChanged( true );
          }}
          >
          {t('delete')}
        </button>

        <div className="ml-auto message m-r-10">
          { dataChanged &&
            <div className="message error-message">
              {t('saveBeforeLeaving')}
            </div>
          }
          { !dataChanged &&
            <div className="message success-message">
              {t('saved')}
            </div>
          }
        </div>

        <button
          className="btn"
          disabled={saving}
          onClick={updateTaskTypeFunc}
          >
          { saving ? `${t('saving')}...` : `${t('save')} ${t('taskType').toLowerCase()}` }
        </button>
      </div>
      <DeleteReplacement
        isOpen={deleteOpen}
        label={t('taskType')}
        options={filteredTaskTypes}
        close={()=>setDeleteOpen(false)}
        finishDelete={deleteTaskTypeFunc}
        />
    </div>
  )
}