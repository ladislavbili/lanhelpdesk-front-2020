import React from 'react';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";
import classnames from 'classnames';

import Empty from 'components/Empty';
import SettingLoading from '../components/settingLoading';
import SettingListContainer from '../components/settingListContainer';
import RoleAdd from './roleAdd';
import RoleEdit from './roleEdit';

import {
  orderArr
} from 'helperFunctions';
import {
  itemAttributesFullfillsString
} from '../components/helpers';

import {
  GET_ROLES,
  ROLES_SUBSCRIPTION,
} from './queries';

export default function RolesList( props ) {
  const {
    history,
    match
  } = props;

  const {
    data: rolesData,
    loading: rolesLoading,
    refetch: rolesRefetch,
  } = useQuery( GET_ROLES, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( ROLES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      refetch();
    }
  } );

  // state
  const [ roleFilter, setRoleFilter ] = React.useState( "" );

  if ( rolesLoading ) {
    return ( <SettingLoading match={match} /> );
  }

  const roles = orderArr( rolesData.roles );

  const RightSideComponent = (
    <Empty>
      { match.params.id && match.params.id==='add' &&
        <RoleAdd {...props}/>
      }
      { match.params.id &&
        match.params.id !== 'add' &&
        roles.some( (role) => role.id === parseInt(match.params.id) ) &&
        <RoleEdit {...{history, match}} />
      }
    </Empty>
  );

  return (
    <SettingListContainer
      header="Roles"
      filter={roleFilter}
      setFilter={setRoleFilter}
      history={history}
      addURL="/helpdesk/settings/roles/add"
      addLabel="Role"
      RightSideComponent={RightSideComponent}
      >
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Title</th>
            <th>Level</th>
            <th>Order</th>
          </tr>
        </thead>
        <tbody>
          { roles
            .filter((role) => itemAttributesFullfillsString( role, roleFilter, ['title', 'level', 'order'] ))
            .map((role) => (
              <tr
                key={role.id}
                className={classnames (
                  "clickable",
                  {
                    "active": parseInt(match.params.id) === role.id
                  }
                )}
                style={{whiteSpace: "nowrap",  overflow: "hidden"}}
                onClick={ () => history.push(`/helpdesk/settings/roles/${role.id}`) }>
                <td
                  style={{maxWidth: "300px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }}  >
                  {role.title}
                </td>
                <td>
                  {role.level ? role.Level : 0}
                </td>
                <td>
                  {role.order ? role.order : 0}
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </SettingListContainer>
  )
}