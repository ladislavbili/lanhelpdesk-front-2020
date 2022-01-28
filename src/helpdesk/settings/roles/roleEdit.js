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
  useTranslation
} from "react-i18next";
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

  const {
    t
  } = useTranslation();

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
    notifyOnNetworkStatusChange: true,
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
      label: t( 'loginToSystem' ),
    },
    {
      state: React.useState( false ),
      key: 'vykazy',
      label: t( 'invoices' ),
    },
    {
      state: React.useState( false ),
      key: 'publicFilters',
      label: t( 'publicFilters' ),
    },
    {
      state: React.useState( false ),
      key: 'addProjects',
      label: t( 'addProjects' ),
    },
    {
      state: React.useState( false ),
      key: 'viewErrors',
      label: t( 'viewErrors' ),
    },
    {
      state: React.useState( false ),
      key: 'lanwiki',
      label: t( 'lanwiki' ),
    },
    {
      state: React.useState( false ),
      key: 'cmdb',
      label: t( 'cmdb' ),
    },
  ];
  const settings = [
    {
      state: React.useState( false ),
      key: 'users',
      label: t( 'users' )
    },
    {
      state: React.useState( false ),
      key: 'companies',
      label: t( 'companies' )
    },
    {
      state: React.useState( false ),
      key: 'pausals',
      label: t( 'pausals' )
    },
    {
      state: React.useState( false ),
      key: 'projects',
      label: t( 'projects' )
    },
    {
      state: React.useState( false ),
      key: 'statuses',
      label: t( 'statuses' )
    },
    {
      state: React.useState( false ),
      key: 'prices',
      label: t( 'pricelists' )
    },
    {
      state: React.useState( false ),
      key: 'roles',
      label: t( 'roles' )
    },
    {
      state: React.useState( false ),
      key: 'taskTypes',
      label: t( 'taskTypes' )
    },
    {
      state: React.useState( false ),
      key: 'tripTypes',
      label: t( 'tripTypes' )
    },
    {
      state: React.useState( false ),
      key: 'imaps',
      label: t( 'imaps' )
    },
    {
      state: React.useState( false ),
      key: 'smtps',
      label: t( 'smtps' )
    },
  ];
  const helpdesk = [
    {
      state: React.useState( false ),
      key: 'tasklistLayout',
      label: t( 'tasklistLayoutRight' ),
    },
    {
      state: React.useState( false ),
      key: 'tasklistCalendar',
      label: t( 'tasklistCalendarRight' ),
    },
    {
      state: React.useState( false ),
      key: 'tasklistPreferences',
      label: t( 'tasklistPreferencesRight' ),
    },
    {
      state: React.useState( false ),
      key: 'customFilters',
      label: t( 'customFiltersRight' ),
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
    } );
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
    [ ...generalRights, ...settings, ...helpdesk ].forEach( ( right ) => right.state[ 1 ]( role.accessRights[ right.key ] ) );
    setDataChanged( false );
  }

  const updateRoleFunc = () => {
    setSaving( true );
    let accessRights = {};
    [ ...generalRights, ...settings, ...helpdesk ].forEach( ( right ) => accessRights[ right.key ] = right.state[ 0 ] );
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

    if ( window.confirm( t( 'generalConfirm' ) ) ) {
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
        {`${t('edit')} ${t('role').toLowerCase()}`}
      </h2>

      <SettingsInput
        required
        id="title"
        label={t('roleTitle')}
        disabled={disabled}
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setDataChanged( true );
        }}
        />


      <SettingsInput
        id="order"
        label={t('order')}
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
        label={t('level')}
        type="number"
        disabled={disabled}
        value={level}
        onChange={(e) => {
          setLevel(e.target.value);
          setDataChanged( true );
        }}
        />

      <div className="">
        <h2>{t('generalRights')}</h2>
        <table className="table">
          <thead>
            <tr>
              <th  width={"90%"} key={1}>
                {t('title')}
              </th>
              <th className="text-center" key={2}>
                {t('granted')}
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
        <h2>{t('settings')}</h2>
        <table className="table">
          <thead>
            <tr>
              <th width={"90%"} key={1}>
                {t('access')}
              </th>
              <th className="text-center" key={2}>
                {t('viewAndEdit')}
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

      <div className="">
        <h2>{t('helpdeskRights')}</h2>
        <table className="table">
          <thead>
            <tr>
              <th  width={"90%"} key={1}>
                {t('title')}
              </th>
              <th className="text-center" key={2}>
                {t('granted')}
              </th>
            </tr>
          </thead>
          <tbody>
            { helpdesk.map( (right) => (
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
            onClick={() => {props.close()}}>
            {t('cancel')}
          </button>
        }

        <button
          className="btn-red"
          disabled={saving || theOnlyOneLeft || currentUserLevel === null || currentUserLevel >= level }
          onClick={ () => setDeleteOpen(true) }>
          {t('delete')}
        </button>
        <div className="ml-auto message m-r-10">
          { !disabled && dataChanged &&
            <div className="message error-message">
              {t('saveBeforeLeaving')}
            </div>
          }
          { !disabled && !dataChanged &&
            <div className="message success-message">
              {t('saved')}
            </div>
          }
          <ErrorMessage
            show={ currentUserLevel === null || level <= currentUserLevel }
            message={`${t('cantEditRole')}(${currentUserLevel})!`}
            />
        </div>

        <button
          className="btn m-t-5"
          disabled={saving || currentUserLevel === null || currentUserLevel >= level}
          onClick={updateRoleFunc}>
          { saving ? `${t('Saving')}...` : t('save') }
        </button>
      </div>
      <DeleteReplacement
        isOpen={deleteOpen}
        label={t('role')}
        options={filteredRoles}
        close={()=>setDeleteOpen(false)}
        finishDelete={deleteRoleFunc}
        />
    </div>
  );
}