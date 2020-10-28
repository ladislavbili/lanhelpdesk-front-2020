import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/client";
import {
  Button,
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
} from './querries';

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
    notifyOnNetworkStatusChange: true,
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

  // sync
  React.useEffect( () => {
    if ( !loading ) {
      setTitle( data.taskType.title );
      setOrder( data.taskType.order );
    }
  }, [ loading ] );

  React.useEffect( () => {
    refetch( {
      variables: {
        id: parseInt( match.params.id )
      }
    } );
  }, [ match.params.id ] );

  // functions
  const updateTaskTypeFunc = () => {
    setSaving( true );

    updateTaskType( {
        variables: {
          id: parseInt( match.params.id ),
          title,
          order: ( order !== '' ? parseInt( order ) : 0 ),
        }
      } )
      .then( ( response ) => {} )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
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
          client.writeQuery( {
            query: GET_TASK_TYPES,
            data: {
              taskTypes: filteredTaskTypes
            }
          } );
          history.goBack();
        } )
        .catch( ( err ) => {
          console.log( err.message );
          console.log( err );
        } );
    }
  };

  return (
    <div className="p-20 scroll-visible fit-with-header-and-commandbar">
      {
        loading &&
        <Loading />
      }
      <FormGroup>
        <Label for="name">Task type name</Label>
        <Input type="text" name="name" id="name" placeholder="Enter task type name" value={title} onChange={(e)=>setTitle(e.target.value)} />
      </FormGroup>

      <FormGroup>
        <Label for="order">Order</Label>
        <Input type="number" name="order" id="order" placeholder="Lower means first" value={order} onChange={(e)=>setOrder(e.target.value)} />
      </FormGroup>

      <div className="row">
        <Button className="btn" disabled={saving} onClick={updateTaskTypeFunc}>{saving?'Saving task type...':'Save task type'}</Button>
        <Button
          className="btn-red m-l-5"
          disabled={saving || theOnlyOneLeft}
          onClick={() => setDeleteOpen(true)}
          >
          Delete
        </Button>
      </div>
      <DeleteReplacement
        isOpen={deleteOpen}
        label="task type"
        options={filteredTaskTypes}
        close={()=>setDeleteOpen(false)}
        finishDelete={deleteTaskTypeFunc}
        />
    </div>
  )
}