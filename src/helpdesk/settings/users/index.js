import React from 'react';
import {
  useQuery,
  useSubscription
} from "@apollo/client";

import Multiselect from 'components/multiselect';
import {
  toSelArr
} from 'helperFunctions';

import UserAdd from './userAdd';
import UserEdit from './userEdit';
import Loading from 'components/loading';
import Empty from 'components/Empty';
import SettingListContainer from '../components/settingListContainer';
import classnames from 'classnames';
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
  //data
  const {
    history,
    match
  } = props;
  const {
    data: usersData,
    loading: usersLoading,
    refetch: usersRefetch
  } = useQuery( GET_USERS, {
    fetchPolicy: 'network-only'
  } );
  const {
    data: rolesData,
    loading: rolesLoading,
    refetch: rolesRefetch
  } = useQuery( GET_ROLES, {
    fetchPolicy: 'network-only'
  } );


  // sync
  React.useEffect( () => {
    if ( !rolesLoading ) {
      setSelectedRoles( toSelArr( rolesData.roles ) );
    }
  }, [ rolesLoading ] );


  const dataLoading = (
    usersLoading ||
    rolesLoading
  )

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

  useSubscription( ROLES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      rolesRefetch()
    }
  } );

  // state
  const [ userFilter, setUserFilter ] = React.useState( "" );
  const [ selectedRoles, setSelectedRoles ] = React.useState( [] );


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
  const users = usersData.users.filter( user => selectedRoles.some( sr => sr.id === user.role.id ) );
  const roles = toSelArr( rolesData.roles );

  //data
  const allRolesSelected = selectedRoles.length === roles.length;

  const UserRoleFilter = (
    <Multiselect
      className="ml-auto"
      options={ [{ id:'All', label: 'All'}, ...roles] }
      value={ allRolesSelected ? [{ id:'All', label: 'All'}, ...roles] : selectedRoles }
      label={ "Filter users by roles" }
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
      header="Users"
      filter={userFilter}
      setFilter={setUserFilter}
      history={history}
      addURL="/helpdesk/settings/users/add"
      addLabel="User"
      RightFilterComponent={UserRoleFilter}
      RightSideComponent={RightSideComponent}
      >
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
          </tr>
        </thead>
        <tbody>
          {users.filter((item)=>item.email.toLowerCase().includes(userFilter.toLowerCase())).sort((user1,user2)=>user1.email>user2.email?1:-1).map((user)=>
            <tr
              key={user.id}
              className={classnames (
                "clickable",
                {
                  "active": parseInt(match.params.id) === user.id
                }
              )}
              style={{whiteSpace: "nowrap",  overflow: "hidden"}}
              onClick={()=>history.push('/helpdesk/settings/users/'+user.id)}>
              <td
                style={{maxWidth: "300px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }}  >
                {user.username}
              </td>
              <td className={(match.params.id === user.id ? " active":"") }
                style={{maxWidth: "200px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }} >
                { (user.company ? user.company.title  : "NEZARADENÉ")}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </SettingListContainer>
  )
}