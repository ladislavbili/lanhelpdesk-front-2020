import React from 'react';
import {
  useQuery
} from "@apollo/client";

import Multiselect from 'components/multiselect';
import {
  toSelArr
} from 'helperFunctions';

import UserAdd from './userAdd';
import UserEdit from './userEdit';
import Loading from 'components/loading';
import classnames from 'classnames';
import {
  GET_USERS,
} from './queries';

import {
  GET_ROLES,
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
  } = useQuery( GET_USERS );
  const {
    data: roleData,
    loading: roleLoading
  } = useQuery( GET_ROLES );

  const USERS = ( usersLoading ? [] : usersData.users );
  const ROLES = ( roleLoading ? [] : toSelArr( roleData.roles ) );
  const dataLoading = (
    usersLoading ||
    roleLoading
  )
  // state
  const [ userFilter, setUserFilter ] = React.useState( "" );
  const [ selectedRoles, setSelectedRoles ] = React.useState( ROLES );

  //data
  const FILTERED_USERS = USERS.filter( user => selectedRoles.some( sr => sr.id === user.role.id ) );

  const allRolesSelected = selectedRoles.length === ROLES.length;

  // sync
  React.useEffect( () => {
    if ( !roleLoading ) {
      setSelectedRoles( toSelArr( roleData.roles ) );
    }
  }, [ roleLoading ] );

  return (
    <div className="content">
      <div className="row m-0 p-0 taskList-container">
        <div className="col-lg-4">
          <div className="commandbar">
            <div className="search-row">
              <div className="search">
                <button className="search-btn" type="button">
                  <i className="fa fa-search" />
                </button>
                <input
                  type="text"
                  className="form-control search-text"
                  value={userFilter}
                  onChange={(e)=>setUserFilter(e.target.value)}
                  placeholder="Search"
                  />
              </div>
            </div>
            <button
              className="btn-link center-hor"
              onClick={()=> history.push('/helpdesk/settings/users/add')}>
              <i className="fa fa-plus p-l-5 p-r-5"/> User
              </button>
            </div>
            <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <div className="row p-l-10 p-b-10">
                <h2 className="">
                  Users
                </h2>
                <div className="ml-auto">
                  <Multiselect
                    className="ml-auto m-r-10"
                    options={ [{ id:'All', label: 'All'}, ...ROLES] }
                    value={ allRolesSelected ? [{ id:'All', label: 'All'}, ...ROLES] : selectedRoles }
                    label={ "Filter users by roles" }
                    onChange={ ( role ) => {
                      let selected = [ ...selectedRoles ];
                      if (role.id === 'All' && !allRolesSelected ){
                        selected = [...ROLES];
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
                </div>
              </div>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Company</th>
                  </tr>
                </thead>
                <tbody>
                  {FILTERED_USERS.filter((item)=>item.email.toLowerCase().includes(userFilter.toLowerCase())).sort((user1,user2)=>user1.email>user2.email?1:-1).map((user)=>
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
                      <td  className={(match.params.id === user.id ? " active":"") }
                        style={{maxWidth: "200px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }} >
                        { (user.company ? user.company.title  : "NEZARADENÉ")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-8">
            {
              !dataLoading && match.params.id && match.params.id==='add' && <UserAdd  history={history}/>
          }
          {
            usersLoading && match.params.id && match.params.id!=='add' && <Loading />
        }
        {
          !dataLoading && match.params.id && match.params.id!=='add' && FILTERED_USERS.some((item)=>item.id.toString() === match.params.id) && <UserEdit {...{history, match}} />
      }
      {
        !dataLoading && !match.params.id && match.params.id!=='add' && <div className="commandbar"></div>
      }
    </div>
  </div>
</div>
  )
}