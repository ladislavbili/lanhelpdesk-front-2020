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
import ErrorMessage from 'components/errorMessage';
import DeleteReplacement from 'components/deleteReplacement';
import {
  toSelArr,
  getMyData,
} from 'helperFunctions';
import Loading from 'components/loading';
import RightRow from './rightRow';

import {
  GET_ROLES,
  GET_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
} from './queries';

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
    fetchPolicy: 'network-only',
  } );

  const [ updateRole ] = useMutation( UPDATE_ROLE );
  const [ deleteRole, {
    client
  } ] = useMutation( DELETE_ROLE );
  const allRoles = toSelArr( client.readQuery( {
      query: GET_ROLES
    } )
    .roles );

  const currentUser = getMyData();
  const currentUserLevel = currentUser ? currentUser.role.level : null;
  const filteredRoles = allRoles.filter( role => role.id !== parseInt( match.params.id ) );
  const theOnlyOneLeft = allRoles.length === 0;

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ order, setOrder ] = React.useState( 0 );
  const [ level, setLevel ] = React.useState( 0 );

  const [ dataChanged, setDataChanged ] = React.useState( false );

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
      key: 'viewErrors',
      label: "View errors"
    },
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
      key: 'prices',
      label: "Prices"
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

    setTitle( data.role.title );
    setOrder( data.role.order );
    setLevel( data.role.level );
    [ ...generalRights, ...settings ].forEach( ( right ) => right.state[ 1 ]( data.role.accessRights[ right.key ] ) );
    setDataChanged( false );
  }

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
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
    setDataChanged( false );
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
    <div>
      <div className="commandbar a-i-c p-l-20">
        { !disabled &&
          dataChanged &&
          <div className="message error-message">
            Save changes before leaving!
          </div>
        }
        { !disabled && !dataChanged &&
          <div className="message success-message">
            Saved
          </div>
        }
        <ErrorMessage show={ currentUserLevel === null || level <= currentUserLevel } message={`You don't have the right to edit this role. Targets role can't be lower or same as yours(${currentUserLevel})!`} />
      </div>


      <div className="p-t-10 p-l-20 p-r-20 p-b-20 scroll-visible fit-with-header-and-commandbar">
        <h2 className="m-b-20" >
          Edit role
        </h2>
        <FormGroup>
          <Label for="role">Role <span className="warning-big">*</span></Label>
          <Input
            name="name"
            id="name"
            type="text"
            placeholder="Enter role name"
            disabled={disabled}
            value={title}
            onChange={ (e) => {
              setTitle(e.target.value);
              setDataChanged( true );
            } }
            />
        </FormGroup>

        <FormGroup>
          <Label for="role">Order</Label>
          <Input
            name="name"
            id="name"
            type="number"
            placeholder="Enter role name"
            disabled={disabled}
            value={order}
            onChange={ (e) => {
              setOrder(e.target.value);
              setDataChanged( true );
            }}
            />
        </FormGroup>

        <FormGroup>
          <div className="row">
            <Label for="role">Level <span className="warning-big">*</span></Label>
          </div>
          <Input
            name="name"
            id="name"
            type="number"
            placeholder="Enter role name"
            disabled={disabled}
            value={level}
            onChange={ (e) => {
              setLevel(e.target.value);
              setDataChanged( true );
            }}
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
                  onChange={(e) => {
                    right.state[1](e);
                    setDataChanged( true );
                  }}
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
                  onChange={(e) => {
                    right.state[1](e);
                    setDataChanged( true );
                  }}
                  label={right.label}
                  disabled={disabled}
                  value={right.state[0]}
                  />
              )}
            </tbody>
          </table>
        </div>

        <div className="form-buttons-row">
          {props.close &&
            <button className="btn-link btn-distance"
              onClick={()=>{props.close()}}>Cancel</button>
          }
          <button className="btn-red" disabled={saving || theOnlyOneLeft || currentUserLevel === null || currentUserLevel >= level } onClick={ () => setDeleteOpen(true) }>Delete</button>
          <button className="btn ml-auto" disabled={saving || currentUserLevel === null || currentUserLevel >= level} onClick={updateRoleFunc}>{saving?'Saving...':'Save'}</button>
        </div>
        <DeleteReplacement
          isOpen={deleteOpen}
          label="role"
          options={filteredRoles}
          close={()=>setDeleteOpen(false)}
          finishDelete={deleteRoleFunc}
          />
      </div>
    </div>

  );
}