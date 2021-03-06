import React from 'react';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";

import RoleAdd from './roleAdd';
import RoleEdit from './roleEdit';
import Loading from 'components/loading';
import {
  orderArr
} from 'helperFunctions';
import classnames from 'classnames';

import {
  GET_ROLES,
  ROLES_SUBSCRIPTION,
} from './queries';

export default function RolesList( props ) {
  // state
  const [ roleFilter, setRoleFilter ] = React.useState( "" );

  //data
  const {
    history,
    match
  } = props;
  const {
    data,
    loading,
    refetch,
  } = useQuery( GET_ROLES, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( ROLES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      refetch();
    }
  } );

  const ROLES = ( loading || !data ? [] : orderArr( data.roles ) );

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
                  value={roleFilter}
                  onChange={(e)=>setRoleFilter(e.target.value)}
                  placeholder="Search"
                  />
              </div>
            </div>
            <button
              className="btn-link center-hor"
              onClick={()=> history.push('/helpdesk/settings/roles/add')}>
              <i className="fa fa-plus p-l-5 p-r-5"/> Role
              </button>
            </div>
            <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <div className="row p-l-10 p-b-10">
                <h2 className="">
                  Roles
                </h2>
              </div>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th> Level </th>
                    <th> Order </th>
                  </tr>
                </thead>
                <tbody>
                  {ROLES.map((role)=>
                    <tr
                      key={role.id}
                      className={classnames (
                        "clickable",
                        {
                          "active": parseInt(match.params.id) === role.id
                        }
                      )}
                      style={{whiteSpace: "nowrap",  overflow: "hidden"}}
                      onClick={()=>history.push('/helpdesk/settings/roles/'+role.id)}>
                      <td
                        style={{maxWidth: "300px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }}  >
                        {role.title}
                      </td>
                      <td>
                        {role.level?role.level:0}
                      </td>
                      <td>
                        {role.order?role.order:0}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-8">
            {
              match.params.id && match.params.id==='add' && <RoleAdd {...props}/>
          }
          {
            loading && match.params.id && match.params.id!=='add' && <Loading />
        }
        {
          match.params.id &&
          match.params.id!=='add' &&
          ROLES.some( (role) => role.id === parseInt(match.params.id) ) &&
          <RoleEdit {...{history, match}} />
        }
        {
          !loading && !match.params.id && <div className="commandbar"></div>
        }
      </div>
    </div>
  </div>
  );
}