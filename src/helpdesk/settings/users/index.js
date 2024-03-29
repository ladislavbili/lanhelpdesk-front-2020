import React from 'react';
import {
  useQuery,
  useSubscription
} from "@apollo/client";
import classnames from 'classnames';

import Multiselect from 'components/multiselect';
import UserAdd from './userAdd';
import UserEdit from './userEdit';
import Loading from 'components/loading';
import Empty from 'components/Empty';
import SettingListContainer from '../components/settingListContainer';

import {
  toSelArr
} from 'helperFunctions';
import {
  useTranslation
} from "react-i18next";

import {
  GET_USERS,
  USERS_SUBSCRIPTION,
} from './queries';
import {
  COMPANIES_SUBSCRIPTION,
} from '../companies/queries';

import {
  GET_ROLES,
  ROLES_SUBSCRIPTION
} from '../roles/queries';

export default function UserListContainer( props ) {
  const {
    history,
    match
  } = props;

  const {
    t
  } = useTranslation();

  const {
    data: usersData,
    loading: usersLoading,
    refetch: usersRefetch
  } = useQuery( GET_USERS, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( USERS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      usersRefetch()
    }
  } );

  useSubscription( COMPANIES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      usersRefetch()
    }
  } );

  const {
    data: rolesData,
    loading: rolesLoading,
    refetch: rolesRefetch
  } = useQuery( GET_ROLES, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( ROLES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      rolesRefetch()
    }
  } );

  // state
  const [ userFilter, setUserFilter ] = React.useState( "" );
  const [ selectedRoles, setSelectedRoles ] = React.useState( [] );

  const dataLoading = (
    usersLoading ||
    rolesLoading
  )

  // sync
  React.useEffect( () => {
    if ( !rolesLoading ) {
      setSelectedRoles( toSelArr( rolesData.roles ) );
    }
  }, [ rolesLoading ] );

  if ( dataLoading ) {
    return (
      <div className="content">
        <div className="row m-0 p-0 taskList-container">
          <div className="col-lg-4">
            <Loading />
          </div>
          <div className="col-lg-8">
            {
              match.params.id &&
              <Loading />
            }
          </div>
        </div>
      </div>
    )
  }

  const users = usersData.users.filter( user => selectedRoles.some( selectedRole => ( selectedRole.id === user.role.id ) ) );
  const roles = toSelArr( rolesData.roles );

  //data
  const allRolesSelected = selectedRoles.length === roles.length;

  const UserRoleFilter = (
    <Multiselect
      className="ml-auto"
      options={ [{ id:'All', label: t('all')}, ...roles] }
      value={ allRolesSelected ? [{ id:'All', label: t('all')}, ...roles] : selectedRoles }
      label={t('filterByRoles')}
      onChange={ ( role ) => {
        let selected = [ ...selectedRoles ];
        if (role.id === 'All' && !allRolesSelected ){
          selected = [...roles];
        } else {
          if ( selected.some(sr => sr.id === role.id) ){
            selected = selected.filter( sr => sr.id !== role.id );
          } else {
            selected = [...selected, role];
          }
        }
        setSelectedRoles(selected);
      } }
      />
  );

  const RightSideComponent = (
    <Empty>
      { !dataLoading && match.params.id && match.params.id==='add' &&
        <UserAdd  history={history}/>
      }
      { usersLoading && match.params.id && match.params.id!=='add' &&
        <Loading />
      }
      { !dataLoading && match.params.id && match.params.id!=='add' && users.some((item)=>item.id.toString() === match.params.id) &&
        <UserEdit {...{history, match}} />
      }
    </Empty>
  )

  return (
    <SettingListContainer
      header={t('users')}
      filter={userFilter}
      setFilter={setUserFilter}
      history={history}
      addURL={`.${match.params.id === undefined ? '/users' : '' }/add`}
      addLabel={t('user')}
      RightFilterComponent={UserRoleFilter}
      RightSideComponent={RightSideComponent}
      >
      <table className="table table-hover">
        <thead>
          <tr>
            <th>{t('nameAndEmail')}</th>
            <th>{t('company')}</th>
          </tr>
        </thead>
        <tbody>
          { users.filter( (item) => item.email.toLowerCase().includes( userFilter.toLowerCase() ) || item.fullName.toLowerCase().includes( userFilter.toLowerCase() ) )
            .sort( ( user1, user2 ) => user1.email > user2.email ? 1 : -1 )
            .map( (user) => (
              <tr
                key={user.id}
                className={classnames (
                  "clickable",
                  {
                    "active": parseInt(match.params.id) === user.id
                  }
                )}
                style={{whiteSpace: "nowrap",  overflow: "hidden"}}
                onClick={ () => history.push(`.${match.params.id === undefined ? '/users' : '' }/${user.id}`) }>
                <td
                  style={{maxWidth: "300px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }}  >
                  <div>{user.fullName}</div>
                  <div>{user.email}</div>
                </td>
                <td className={(match.params.id === user.id ? " active":"") }
                  style={{maxWidth: "200px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }} >
                  { (user.company ? user.company.title  : t('none'))}
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </SettingListContainer>
  )
}