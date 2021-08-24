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
import ErrorMessage from 'components/errorMessage';
import DeleteReplacement from 'components/deleteReplacement';
import SettingsInput from '../components/settingsInput';
import Loading from 'components/loading';
import RightRow from './rightRow';

import {
  toSelArr,
  getMyData,
} from 'helperFunctions';
import {
  addLocalError,
} from 'apollo/localSchema/actions';

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

  const client = useApolloClient();
  const allRoles = toSelArr( client.readQuery( {
      query: GET_ROLES
    } )
    .roles );
  const filteredRoles = allRoles.filter( role => role.id !== parseInt( match.params.id ) );
  const theOnlyOneLeft = allRoles.length === 0;

  const currentUser = getMyData();

  const {
    data: roleData,
    loading: roleLoading,
    refetch: roleRefetch
  } = useQuery( GET_ROLE, {
    variables: {
      id: parseInt( props.match.params.id )
    },
    fetchPolicy: 'network-only',
  } );

  const [ updateRole ] = useMutation( UPDATE_ROLE );
  const [ deleteRole ] = useMutation( DELETE_ROLE );


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

  const [ dataChanged, setDataChanged ] = React.useState( false );
  const [ deleteOpen, setDeleteOpen ] = React.useState( false );
  const [ saving, setSaving ] = React.useState( false );

  // sync
  React.useEffect( () => {
    if ( !roleLoading ) {
      setData();
    }
  }, [ roleLoading ] );

  React.useEffect( () => {
    roleRefetch( {
        variables: {
          id: parseInt( match.params.id )
        }
      } )
      .then( setData );
  }, [ match.params.id ] );

  // functions
  const setData = () => {
    if ( roleLoading ) {
      return;
    }
    const role = roleData.role;
    setTitle( role.title );
    setOrder( role.order );
    setLevel( role.level );
    [ ...generalRights, ...settings ].forEach( ( right ) => right.state[ 1 ]( role.accessRights[ right.key ] ) );
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
        addLocalError( err );
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
          addLocalError( err );
        } );
    }
  };
  if ( roleLoading ) {
    return <Loading />
  }

  const currentUserLevel = currentUser ? currentUser.role.level : null;
  const disabled = currentUserLevel === null || currentUserLevel >= roleData.role.level;

  return (
    <div className="scroll-visible p-20 fit-with-header">
      <h2 className="m-b-20" >
        Edit role
      </h2>

      <SettingsInput
        required
        id="title"
        label="Role name"
        disabled={disabled}
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setDataChanged( true );
        }}
        />


      <SettingsInput
        id="order"
        label="Order"
        disabled={disabled}
        value={order}
        onChange={(e) => {
          setOrder(e.target.value);
          setDataChanged( true );
        }}
        />

      <SettingsInput
        required
        id="level"
        label="Level"
        type="number"
        disabled={disabled}
        value={level}
        onChange={(e) => {
          setLevel(e.target.value);
          setDataChanged( true );
        }}
        />

      <div className="">
        <h2>General rights</h2>
        <table className="table">
          <thead>
            <tr>
              <th  width={"90%"} key={1}>
                Name
              </th>
              <th className="text-center" key={2}>
                Granted
              </th>
            </tr>
          </thead>
          <tbody>
            { generalRights.map( (right) => (
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
            ))}
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
              <th className="text-center" key={2}>
                View & Edit
              </th>
            </tr>
          </thead>
          <tbody>
            { settings.map( (right) => (
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
            ))}
          </tbody>
        </table>
      </div>

      <div className="form-buttons-row">
        {props.close &&
          <button className="btn-link btn-distance"
            onClick={() => {props.close()}}>Cancel</button>
        }

        <button
          className="btn-red"
          disabled={saving || theOnlyOneLeft || currentUserLevel === null || currentUserLevel >= level }
          onClick={ () => setDeleteOpen(true) }>
          Delete
        </button>
        <div className="ml-auto message m-r-10">
          { !disabled && dataChanged &&
            <div className="message error-message">
              Save changes before leaving!
            </div>
          }
          { !disabled && !dataChanged &&
            <div className="message success-message">
              Saved
            </div>
          }
          <ErrorMessage
            show={ currentUserLevel === null || level <= currentUserLevel }
            message={`You don't have the right to edit this role. Targets role can't be lower or same as yours(${currentUserLevel})!`}
            />
        </div>

        <button
          className="btn m-t-5"
          disabled={saving || currentUserLevel === null || currentUserLevel >= level}
          onClick={updateRoleFunc}>
          { saving ? 'Saving...' : 'Save' }
        </button>
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