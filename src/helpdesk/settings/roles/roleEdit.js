import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/react-hooks";
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
    }
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

  const generalRights = [
    {
      state: React.useState( false ),
      key: 'login',
      label: "Login to system"
    },
    {
      state: React.useState( false ),
      key: 'testSections',
      label: "Test sections - Navody, CMDB, Hesla, Naklady, Projekty, Monitoring"
    },
    {
      state: React.useState( false ),
      key: 'mailViaComment',
      label: "Send mail via comments"
    },
    {
      state: React.useState( false ),
      key: 'vykazy',
      label: "Výkazy"
    },
    {
      state: React.useState( false ),
      key: 'publicFilters',
      label: "Public Filters"
    },
    {
      state: React.useState( false ),
      key: 'addProjects',
      label: "Add projects"
    },
    {
      state: React.useState( false ),
      key: 'viewVykaz',
      label: "View vykaz"
    },
    {
      state: React.useState( false ),
      key: 'viewRozpocet',
      label: "View rozpocet"
    },
    {
      state: React.useState( false ),
      key: 'viewErrors',
      label: "View errors"
    },
    {
      state: React.useState( false ),
      key: 'viewInternal',
      label: "Internal messages"
    }
  ];
  const settings = [
    {
      state: React.useState( false ),
      key: 'users',
      label: "Users"
    },
    {
      state: React.useState( false ),
      key: 'companies',
      label: "Companies"
    },
    {
      state: React.useState( false ),
      key: 'pausals',
      label: "Pausals"
    },
    {
      state: React.useState( false ),
      key: 'projects',
      label: "Projects"
    },
    {
      state: React.useState( false ),
      key: 'statuses',
      label: "Statuses"
    },
    {
      state: React.useState( false ),
      key: 'units',
      label: "Units"
    },
    {
      state: React.useState( false ),
      key: 'prices',
      label: "Prices"
    },
    {
      state: React.useState( false ),
      key: 'suppliers',
      label: "Suppliers"
    },
    {
      state: React.useState( false ),
      key: 'tags',
      label: "Tags"
    },
    {
      state: React.useState( false ),
      key: 'invoices',
      label: "Invoices"
    },
    {
      state: React.useState( false ),
      key: 'roles',
      label: "Roles"
    },
    {
      state: React.useState( false ),
      key: 'taskTypes',
      label: "Task types"
    },
    {
      state: React.useState( false ),
      key: 'tripTypes',
      label: "Trip types"
    },
    {
      state: React.useState( false ),
      key: 'imaps',
      label: "IMAPs"
    },
    {
      state: React.useState( false ),
      key: 'smtps',
      label: "SMTPs"
    },
  ];

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
        <Button className="btn" disabled={saving || currentUserLevel === null || currentUserLevel >= level} onClick={updateRoleFunc}>{saving?'Saving...':'Save'}</Button>
        <Button className="btn-red m-l-5" disabled={saving || theOnlyOneLeft || currentUserLevel === null || currentUserLevel >= level } onClick={ () => setDeleteOpen(true) }>Delete</Button>
        {props.close &&
          <Button className="btn-link"
            onClick={()=>{props.close()}}>Cancel</Button>
        }
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