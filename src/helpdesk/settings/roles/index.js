import React from 'react';
import {
  useQuery
} from "@apollo/client";

import {
  Button
} from 'reactstrap';
import RoleAdd from './roleAdd';
import RoleEdit from './roleEdit';
import Loading from 'components/loading';
import {
  orderArr
} from 'helperFunctions';

import {
  GET_ROLES
} from './querries';

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
    loading
  } = useQuery( GET_ROLES );
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
            <Button
              className="btn-link center-hor"
              onClick={()=> history.push('/helpdesk/settings/roles/add')}>
              <i className="fa fa-plus p-l-5 p-r-5"/> Role
              </Button>
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
                      className={"clickable" + (parseInt(match.params.id) === role.id ? " active":"")}
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
            <div className="commandbar"></div>
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
      </div>
    </div>
  </div>
  );
}