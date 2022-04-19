import React from 'react';
import {
  useMutation,
  useQuery,
  useApolloClient,
} from "@apollo/client";
import classnames from "classnames";

import {
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import ErrorMessage from 'components/errorMessage';
import SettingsInput from '../components/settingsInput';
import RightRow from './rightRow';

import {
  addLocalError,
} from 'apollo/localSchema/actions';
import {
  useTranslation
} from "react-i18next";
import {
  getMyData,
} from 'helperFunctions';

import {
  GET_ROLES,
  ADD_ROLE
} from './queries';

export default function RoleAdd( props ) {
  const {
    history,
    match
  } = props;

  const {
    t
  } = useTranslation();

  const client = useApolloClient();

  const currentUser = getMyData();

  const [ addRole ] = useMutation( ADD_ROLE );
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
    {
      state: React.useState( false ),
      key: 'pass',
      label: t( 'lanpass' ),
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

  const [ saving, setSaving ] = React.useState( false );

  //functions
  const addRoleFunc = () => {
    setSaving( true );
    let accessRights = {};
    [ ...generalRights, ...settings, ...helpdesk ].forEach( ( right ) => accessRights[ right.key ] = right.state[ 0 ] );
    addRole( {
        variables: {
          title,
          level: (
            level !== '' ?
            parseInt( level ) :
            0
          ),
          order: (
            order !== '' ?
            parseInt( order ) :
            0
          ),
          accessRights
        }
      } )
      .then( ( response ) => {
        history.push( `/helpdesk/settings/roles/${response.data.addRole.id}` )
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );
    setSaving( false );
  }

  const currentUserLevel = currentUser ? currentUser.role.level : null;

  const cannotSave = () => (
    currentUserLevel === null ||
    currentUserLevel >= level ||
    title.length === 0
  );

  return (
    <div className="scroll-visible p-20 fit-with-header">
      <h2 className="m-b-20" >
        {`${t('add')} ${t('role').toLowerCase()}`}
      </h2>

      <SettingsInput
        required
        id="title"
        label={t('roleTitle')}
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        />

      <SettingsInput
        id="order"
        label={t('order')}
        value={order}
        onChange={(e) => {
          setOrder(e.target.value);
        }}
        />

      <SettingsInput
        id="level"
        label={t('level')}
        type="number"
        error={ currentUserLevel === null || level <= currentUserLevel }
        errorMessage={`${t('targerRoleCantBeLowerOrSameThanYours')}(${currentUserLevel})!`}
        value={level}
        onChange={(e) => {
          setLevel(e.target.value);
        }}
        />

      <div>
        <h2>{t('generalRights')}</h2>
        <table className="table">
          <thead>
            <tr>
              <th width={"90%"} key={1}>
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
                onChange={right.state[1]}
                label={right.label}
                disabled={false}
                value={right.state[0]}
                />
            ))}
          </tbody>
        </table>
      </div>

      <div>
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
                onChange={right.state[1]}
                label={right.label}
                disabled={false}
                value={right.state[0]}
                />
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>{t('helpdeskRights')}</h2>
        <table className="table">
          <thead>
            <tr>
              <th width={"90%"} key={1}>
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
                onChange={right.state[1]}
                label={right.label}
                disabled={false}
                value={right.state[0]}
                />
            ))}
          </tbody>
        </table>
      </div>

      <div className="form-buttons-row">
        { props.close &&
          <button className="btn-link" onClick={() => {
              props.close()
            }}
            >
            {t('cancel')}
          </button>
        }

        { cannotSave() &&
          <div className="message error-message ml-auto m-r-14">
            {t('fillAllRequiredInformation')}
          </div>
        }

        <button
          className={classnames(
            "btn",
            {"ml-auto": !cannotSave()}
          )}
          disabled={cannotSave()}
          onClick={addRoleFunc}
          >
          { saving ? `${t('adding')}...` : `${t('add')} ${t('role').toLowerCase()}` }
        </button>
      </div>
    </div>
  );
}
