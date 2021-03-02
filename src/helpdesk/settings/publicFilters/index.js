import React from 'react';
import {
  useQuery
} from "@apollo/client";

import PublicFilterAdd from './publicFilterAdd';
import PublicFilterEdit from './publicFilterEdit';
import {
  textIncluded,
  orderArr,
  toSelArr
} from 'helperFunctions';
import Loading from 'components/loading';
import classnames from 'classnames';

import {
  GET_BASIC_ROLES
} from 'helpdesk/settings/roles/queries';

import {
  GET_PUBLIC_FILTERS
} from './queries';

export default function PublicFilterList( props ) {
  // state
  const [ search, setSearch ] = React.useState( "" );
  const [ roleFilter, setRoleFilter ] = React.useState( "all" );

  //data
  const {
    history,
    match
  } = props;
  const {
    data: publicFiltersData,
    loading: publicFilterLoading
  } = useQuery( GET_PUBLIC_FILTERS );
  const {
    data: rolesData,
    loading: rolesLoading
  } = useQuery( GET_BASIC_ROLES );

  const getFilteredFilters = () => {
    if ( publicFilterLoading ) {
      return [];
    }
    return publicFiltersData.publicFilters.filter( ( filter ) => (
      textIncluded( filter.title, search ) &&
      (
        roleFilter === 'all' ||
        ( roleFilter === 'none' && ( filter.roles === undefined || filter.roles.length === 0 ) ) ||
        ( filter.roles !== undefined && filter.roles.some( ( role ) => roleFilter === role.id ) )
      )
    ) );
  }

  const dataLoading = ( publicFilterLoading || rolesLoading );
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
                  value={search}
                  onChange={(e)=> setSearch(e.target.value)}
                  placeholder="Search"
                  />
              </div>
            </div>
            <button
              className="btn-link center-hor"
              onClick={()=> history.push('/helpdesk/settings/publicFilters/add')}>
              <i className="fa fa-plus p-l-5 p-r-5"/> Public Filter
            </button>
          </div>
          <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
            <div className="row p-l-10 p-b-10">
              <h2 className="">
  							Public Filters
  						</h2>
              <div className="d-flex flex-row align-items-center ml-auto">
                <div className="text-basic m-r-5 m-l-5">
    							Sort by
    						</div>
                <select
  								value={roleFilter}
  								className="invisible-select text-bold text-highlight"
  								onChange={(e)=>setRoleFilter(e.target.value)}>
  									<option value='all'>All filters</option>
                    { (rolesLoading ? [] : orderArr(toSelArr(rolesData.basicRoles))).map((role) =>
                      <option value={role.id} key={role.id}>{role.title}</option>
                    )}
                    <option value='none'>Without role</option>
  							</select>
              </div>
            </div>
            {
              dataLoading ?
              (
                <Loading />
              ):
              (
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Order</th>
                    </tr>
                  </thead>
                  <tbody>
                    { getFilteredFilters().map( (filter) =>
                      <tr
                        key={filter.id}
                        className={classnames (
                          "clickable",
                          {
                            "active": parseInt(match.params.id) === filter.id
                          }
                        )}
                        style={{whiteSpace: "nowrap",  overflow: "hidden"}}
                        onClick={()=>history.push('/helpdesk/settings/publicFilters/'+filter.id.toString())}>
                        <td
                          style={{maxWidth: "300px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }}  >
                          {filter.title}
                        </td>
                        <td
                          style={{maxWidth: "300px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }}  >
                          {filter.order}
                        </td>
                      </tr>
                    ) }
                  </tbody>
                </table>
              )
            }
          </div>
        </div>
        <div className="col-lg-8">
          {
            match.params.id &&
            match.params.id==='add' &&
            <PublicFilterAdd {...{history}} />
          }

          {
            !dataLoading &&
            match.params.id &&
            match.params.id!=='add' &&
            publicFiltersData.publicFilters.some((item)=>item.id === parseInt(match.params.id)) &&
            <PublicFilterEdit {...{history, match}}/>
          }
          {
            !dataLoading && !match.params.id && <div className="commandbar"></div>
          }
        </div>
      </div>
    </div>
  );
}