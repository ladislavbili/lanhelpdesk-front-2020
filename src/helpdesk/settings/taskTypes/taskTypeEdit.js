import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/client";
import {
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import Loading from 'components/loading';
import {
  toSelArr
} from 'helperFunctions';
import DeleteReplacement from 'components/deleteReplacement';
import {
  GET_TASK_TYPE,
  UPDATE_TASK_TYPE,
  DELETE_TASK_TYPE,
  GET_TASK_TYPES,
} from './queries';
import {
  addLocalError,
} from 'apollo/localSchema/actions';

export default function TaskTypeEdit( props ) {
  //data
  const {
    history,
    match
  } = props;
  const {
    data,
    loading,
    refetch
  } = useQuery( GET_TASK_TYPE, {
    variables: {
      id: parseInt( props.match.params.id )
    },
    fetchPolicy: 'network-only',
  } );
  const [ updateTaskType ] = useMutation( UPDATE_TASK_TYPE );
  const [ deleteTaskType, {
    client
  } ] = useMutation( DELETE_TASK_TYPE );
  const allTaskTypes = toSelArr( client.readQuery( {
      query: GET_TASK_TYPES
    } )
    .taskTypes );
  const filteredTaskTypes = allTaskTypes.filter( taskType => taskType.id !== parseInt( match.params.id ) );
  const theOnlyOneLeft = allTaskTypes.length < 2;

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ saving, setSaving ] = React.useState( false );
  const [ deleteOpen, setDeleteOpen ] = React.useState( false );

  const [ dataChanged, setDataChanged ] = React.useState( false );

  // sync
  React.useEffect( () => {
    if ( !loading ) {
      setData();
    }
  }, [ loading ] );

  React.useEffect( () => {
    refetch( {
        variables: {
          id: parseInt( match.params.id )
        }
      } )
      .then( setData );
  }, [ match.params.id ] );

  // functions
  const setData = () => {
    if ( loading ) {
      return;
    }
    setTitle( data.taskType.title );
    setOrder( data.taskType.order );
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

    if ( window.confirm( "Are you sure?" ) ) {
      deleteTaskType( {
          variables: {
            id: parseInt( match.params.id ),
            newId: parseInt( replacement.id ),
          }
        } )
        .then( ( response ) => {
          history.push( '/helpdesk/settings/taskTypes/add' );
        } )
        .catch( ( err ) => {
          addLocalError( err );
        } );
    }
  };

  if ( loading ) {
    return <Loading />
  }

  return (
    <div>
      <div className="commandbar a-i-c p-l-20">
        { dataChanged &&
          <div className="message error-message">
            Save changes before leaving!
          </div>
        }
        { !dataChanged &&
          <div className="message success-message">
            Saved
          </div>
        }
      </div>

      <h2 className="p-l-20 m-t-10" >
        Edit task type
      </h2>

      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
        <FormGroup>
          <Label for="name">Task type name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="Enter task type name"
            value={title}
            onChange={(e)=>{
              setTitle(e.target.value);
              setDataChanged( true );
            }}
            />
        </FormGroup>

        <FormGroup>
          <Label for="order">Order</Label>
          <Input
            type="number"
            name="order"
            id="order"
            placeholder="Lower means first"
            value={order}
            onChange={(e)=>{
              setOrder(e.target.value);
              setDataChanged( true );
            }}
            />
        </FormGroup>

        <div className="form-buttons-row">
          <button
            className="btn-red"
            disabled={saving || theOnlyOneLeft}
            onClick={() => {
              setDeleteOpen(true);
              setDataChanged( true );
            }}
            >
            Delete
          </button>
          <button className="btn ml-auto" disabled={saving} onClick={updateTaskTypeFunc}>{saving?'Saving task type...':'Save task type'}</button>
        </div>
        <DeleteReplacement
          isOpen={deleteOpen}
          label="task type"
          options={filteredTaskTypes}
          close={()=>setDeleteOpen(false)}
          finishDelete={deleteTaskTypeFunc}
          />
      </div>
    </div>

  )
}