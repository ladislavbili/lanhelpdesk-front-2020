import React from 'react';
import {
  useQuery
} from "@apollo/react-hooks";
import gql from "graphql-tag";

import {
  Button
} from 'reactstrap';
//import PublicFilterAdd from './publicFilterAdd';
//import PublicFilterEdit from './publicFilterEdit';
//import Loading from 'components/loading';
import {
  filterIncludesText,
  orderArr
} from 'helperFunctions';

import {
  GET_ROLES
} from 'helpdesk/settings/roles';

export const GET_PUBLIC_FILTERS = gql `
query {
  publicFilters {
    title
    pub
    id
    order
  }
}
`;

export default function PublicFilterListContainer( props ) {
  // state
  const [ search, setSearch ] = React.useState( "" );
  const [ roleFilter, setRoleFilter ] = React.useState( "all" );

  //data
  const {
    history,
    match
  } = props;
  const {
    data,
    loading
  } = useQuery( GET_PUBLIC_FILTERS );
  const {
    data: rolesData,
    loading: rolesLoading
  } = useQuery( GET_ROLES );

  const getFilteredFilters = () => {
    console.log( data );
    let filters = ( loading || !data ? [] : orderArr( data.publicFilters ) );
    filters.filter( ( filter ) => (
      filter.pub &&
      filterIncludesText( filter.title, search ) && (
        roleFilter === 'all' ||
        ( roleFilter === 'none' && ( filter.roles === undefined || filter.roles.length === 0 ) ) ||
        ( filter.roles !== undefined && filter.roles.includes( roleFilter ) )
      )
    ) );
    return filters
  }

  console.log( rolesData );

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
            <Button
              className="btn-link center-hor"
              onClick={()=> history.push('/helpdesk/settings/publicFilters/add')}>
              <i className="fa fa-plus p-l-5 p-r-5"/> Public Filter
            </Button>
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
                    { (rolesLoading || !rolesData ? [] : orderArr(rolesData.roles)).map((role) =>
                      <option value={role.id} key={role.id}>{role.title}</option>
                    )}
                    <option value='none'>Without role</option>
  							</select>
              </div>
            </div>
            <table className="table table-hover">
              <tbody>
                {getFilteredFilters().map((filter)=>
                  <tr
                    key={filter.id}
                    className={"clickable" + (match.params.id === filter.id ? " active":"")}
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
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="commandbar"></div>
          {/*
            match.params.id && match.params.id==='add' && <PublicFilterAdd />
          }
          {
            loading && match.params.id && match.params.id!=='add' && <Loading />
          }
          {
            !loading &&
            match.params.id &&
            match.params.id!=='add' &&
            getFilteredFilters().some((item)=>item.id.toString()===match.params.id) &&
            <PublicFilterEdit {...{history, match}}/>
            */}
        </div>
      </div>
    </div>
  );
}