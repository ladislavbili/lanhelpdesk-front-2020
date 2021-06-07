import React from 'react';
import {
  useQuery,
  useSubscription,
  useMutation,
} from "@apollo/client";
import {
  GET_PROJECT_GROUPS,
  PROJECT_GROUPS_SUBSCRIPTION,
  ADD_USER_TO_PROJECT_GROUP,
} from './queries';
import {
  toSelArr,
} from 'helperFunctions';
import Select from 'react-select';
import {
  FormGroup,
  Label,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import {
  pickSelectStyle
} from "configs/components/select";
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import Loading from 'components/loading';


export default function AddUserToGroup( props ) {
  const {
    projectID,
    user,
    finish,
    disabled,
  } = props;

  const {
    data: projectGroupsData,
    loading: projectGroupsLoading,
    refetch: projectGroupsRefetch,
  } = useQuery( GET_PROJECT_GROUPS, {
    variables: {
      id: projectID
    },
    fetchPolicy: 'network-only'
  } );


  const [ addUserToProjectGroup ] = useMutation( ADD_USER_TO_PROJECT_GROUP );

  useSubscription( PROJECT_GROUPS_SUBSCRIPTION, {
    variables: {
      projectId: projectID
    },
    onSubscriptionData: () => {
      projectGroupsRefetch();
    }
  } );

  const [ group, setGroup ] = React.useState( null );
  const [ saving, setSaving ] = React.useState( null );

  React.useEffect( () => {
    if ( user ) {
      setGroup( null );
    }
  }, [ user ] );

  if ( projectGroupsLoading ) {
    return ( <Loading /> );
  }

  const addUserToProjectGroupFunc = () => {
    setSaving( true );
    addUserToProjectGroup( {
        variables: {
          id: group.id,
          userId: user.id,
        }
      } )
      .then( ( response ) => {
        setSaving( false );
        setGroup( null );
        finish();
      } )
      .catch( ( err ) => addLocalError( err ) )
  }

  const projectGroups = toSelArr( projectGroupsData.projectGroups )
    .sort( ( group1, group2 ) => group1.order > group2.order ? -1 : 1 );

  return (
    <Modal isOpen={user && !disabled } className="modal-without-borders" >
      <ModalHeader>
        Add user to project group
      </ModalHeader>
      <ModalBody>
        <div className="p-20">
          <FormGroup>
            <Label for="role">User group</Label>
            <Select
              styles={ pickSelectStyle() }
              options={ projectGroups }
              value={ group }
              onChange={ group => setGroup(group) }
              />
          </FormGroup>
          <div className="form-buttons-row">
            <button className="btn" onClick={finish}>
              Skip
            </button>
            <button className="btn ml-auto" disabled={ group === null } onClick={addUserToProjectGroupFunc}>
              {saving?'Adding...':'Add user to project group'}
            </button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}