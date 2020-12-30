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
import ErrorMessage from 'components/errorMessage';
import DeleteReplacement from 'components/deleteReplacement';
import {
  toSelArr
} from 'helperFunctions';
import Loading from 'components/loading';
import RightRow from './rightRow';
import {
  generalRightsTemplate,
  settingsTemplate
} from 'configs/constants/roles';

import {
  GET_ROLES,
  GET_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
  GET_MY_DATA
} from './querries';

export default function RoleEdit( props ) {
  //data
  const {
    history,
    match
  } = props;
  const {
    data,
    loading,
    refetch
  } = useQuery( GET_ROLE, {
    variables: {
      id: parseInt( props.match.params.id )
    },
    notifyOnNetworkStatusChange: true,
  } );

  const [ updateRole ] = useMutation( UPDATE_ROLE );
  const [ deleteRole, {
    client
  } ] = useMutation( DELETE_ROLE );
  const allRoles = toSelArr( client.readQuery( {
      query: GET_ROLES
    } )
    .roles );

  const userDataQuery = useQuery( GET_MY_DATA );
  const currentUserLevel = ( userDataQuery.loading ? null : userDataQuery.data.getMyData.role.level );
  const filteredRoles = allRoles.filter( role => role.id !== parseInt( match.params.id ) );
  const theOnlyOneLeft = allRoles.length === 0;

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ level, setLevel ] = React.useState( 0 );

  const generalRights = generalRightsTemplate.map( ( template ) => ( {
    ...template,
    state: React.useState( false ),
  } ) );
  const settings = settingsTemplate.map( ( template ) => ( {
    ...template,
    state: React.useState( false ),
  } ) );

  const [ deleteOpen, setDeleteOpen ] = React.useState( false );
  const [ saving, setSaving ] = React.useState( false );

  // sync
  React.useEffect( () => {
    if ( !loading ) {
      setTitle( data.role.title );
      setOrder( data.role.order );
      setLevel( data.role.level );
      [ ...generalRights, ...settings ].forEach( ( right ) => right.state[ 1 ]( data.role.accessRights[ right.key ] ) );
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
  const updateRoleFunc = () => {
    setSaving( true );
    let accessRights = {};
    [ ...generalRights, ...settings ].forEach( ( right ) => accessRights[ right.key ] = right.state[ 0 ] );
    updateRole( {
        variables: {
          id: parseInt( match.params.id ),
          title,
          level: ( level !== '' ? parseInt( level ) : 0 ),
          order: ( order !== '' ? parseInt( order ) : 0 ),
          accessRights
        }
      } )
      .then( ( response ) => {
        let updatedRole = {
          ...response.data.updateRole,
          __typename: "Role"
        };
        client.writeQuery( {
          query: GET_ROLES,
          data: {
            roles: [ ...allRoles.filter( role => role.id !== parseInt( match.params.id ) ), updatedRole ]
          }
        } );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  };

  const deleteRoleFunc = ( replacement ) => {
    setDeleteOpen( false );

    if ( window.confirm( "Are you sure?" ) ) {
      deleteRole( {
          variables: {
            id: parseInt( match.params.id ),
            newId: parseInt( replacement.id ),
          }
        } )
        .then( ( response ) => {
          client.writeQuery( {
            query: GET_ROLES,
            data: {
              roles: filteredRoles
            }
          } );
          history.push( '/helpdesk/settings/roles/add' );
        } )
        .catch( ( err ) => {
          console.log( err.message );
          console.log( err );
        } );
    }
  };
  if ( loading ) {
    return <Loading />
  }

  const disabled = currentUserLevel === null || currentUserLevel >= data.role.level;

  return (
    <div className="p-20 scroll-visible fit-with-header-and-commandbar">
      <FormGroup>
        <Label for="role">Role</Label>
        <Input name="name" id="name" type="text" placeholder="Enter role name" disabled={disabled} value={title} onChange={ (e) => setTitle(e.target.value) }
          />
      </FormGroup>

      <FormGroup>
        <Label for="role">Order</Label>
        <Input name="name" id="name" type="number" placeholder="Enter role name" disabled={disabled} value={order} onChange={ (e) => setOrder(e.target.value) }
          />
      </FormGroup>

      <FormGroup>
          <Label for="role" className="row">
            Level
            <ErrorMessage show={ currentUserLevel === null || level <= currentUserLevel } message={`Targets role can't be lower or same as yours(${currentUserLevel})!`} />
          </Label>
        <Input name="name" id="name" type="number" placeholder="Enter role name" disabled={disabled} value={level} onChange={ (e) => setLevel(e.target.value) }
          />
      </FormGroup>

      <div className="">
        <h2>General rights</h2>
        <table className="table">
          <thead>
            <tr>
              <th  width={"90%"} key={1}>
                Name
              </th>
              <th className="t-a-c" key={2}>
                Granted
              </th>
            </tr>
          </thead>
          <tbody>
            { generalRights.map( (right) =>
              <RightRow
                key={[right.key,right.state[0]].toString()}
                onChange={right.state[1]}
                label={right.label}
                disabled={disabled}
                value={right.state[0]}
                />
            )}
          </tbody>
        </table>
      </div>

      <div className="">
        <h2>Specific rules</h2>
        <table className="table">
          <thead>
            <tr>
              <th width={"90%"} key={1}>
                Access
              </th>
              <th className="t-a-c" key={2}>
                View & Edit
              </th>
            </tr>
          </thead>
          <tbody>
            { settings.map( (right) =>
              <RightRow
                key={[right.key,right.state[0]].toString()}
                onChange={right.state[1]}
                label={right.label}
                disabled={disabled}
                value={right.state[0]}
                />
            )}
          </tbody>
        </table>
      </div>

      <div className="row">
        {props.close &&
          <Button className="btn-link"
            onClick={()=>{props.close()}}>Cancel</Button>
        }
        <Button className="btn-red m-l-5" disabled={saving || theOnlyOneLeft || currentUserLevel === null || currentUserLevel >= level } onClick={ () => setDeleteOpen(true) }>Delete</Button>
        <Button
          className="btn ml-auto"
          disabled={saving || currentUserLevel === null || currentUserLevel >= level || true}
           onClick={updateRoleFunc}>
           {saving?'Saving...':'Save'}
         </Button>
      </div>
      <DeleteReplacement
        isOpen={deleteOpen}
        label="role"
        options={filteredRoles}
        close={()=>setDeleteOpen(false)}
        finishDelete={deleteRoleFunc}
        />
    </div>
  );
}