import React from 'react';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";
import classnames from 'classnames';

import Empty from 'components/Empty';
import SettingLoading from '../components/settingLoading';
import SettingListContainer from '../components/settingListContainer';
import PublicFilterAdd from './publicFilterAdd';
import PublicFilterEdit from './publicFilterEdit';

import {
  itemAttributesFullfillsString
} from '../components/helpers';
import {
  textIncluded,
  orderArr,
  toSelArr
} from 'helperFunctions';

import {
  GET_BASIC_ROLES,
  ROLES_SUBSCRIPTION,
} from 'helpdesk/settings/roles/queries';

import {
  GET_PUBLIC_FILTERS,
  FILTERS_SUBSCRIPTION,
} from './queries';

export default function PublicFilterList( props ) {
  const {
    history,
    match
  } = props;

  const {
    data: publicFiltersData,
    loading: publicFilterLoading,
    refetch: publicFilterRefetch,
  } = useQuery( GET_PUBLIC_FILTERS, {
    fetchPolicy: 'network-only',
  } );

  useSubscription( FILTERS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      publicFilterRefetch();
    }
  } );

  const {
    data: rolesData,
    loading: rolesLoading,
    refetch: rolesRefetch,
  } = useQuery( GET_BASIC_ROLES, {
    fetchPolicy: 'network-only',
  } );

  useSubscription( ROLES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      rolesRefetch();
    }
  } );

  // state
  const [ search, setSearch ] = React.useState( "" );
  const [ roleFilter, setRoleFilter ] = React.useState( "all" );

  const dataLoading = ( publicFilterLoading || rolesLoading );

  if ( dataLoading ) {
    return ( <SettingLoading match={match} /> );
  }

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

  const PublicFiltersSort = (
    <div className="d-flex flex-row align-items-center ml-auto">
      <div className="color-basic m-r-5 m-l-5">
        Sort by
      </div>
      <select
        value={roleFilter}
        className="invisible-select font-bold text-highlight"
        onChange={ (e) => setRoleFilter(e.target.value) }
        >
        <option value='all'>All filters</option>
        { orderArr(toSelArr(rolesData.basicRoles)).map((role) => (
          <option value={role.id} key={role.id}>{role.title}</option>
        ))}
        <option value='none'>Without role</option>
      </select>
    </div>
  );

  const RightSideComponent = (
    <Empty>
      { match.params.id &&
        match.params.id === 'add' &&
        <PublicFilterAdd {...{history}} />
      }

      { match.params.id &&
        match.params.id!=='add' &&
        publicFiltersData.publicFilters.some((item)=>item.id === parseInt(match.params.id)) &&
        <PublicFilterEdit {...{history, match}}/>
      }
    </Empty>
  )

  return (
    <SettingListContainer
      header="Public Filters"
      filter={search}
      setFilter={setSearch}
      history={history}
      addURL="/helpdesk/settings/publicFilters/add"
      addLabel="Public Filter"
      RightFilterComponent={PublicFiltersSort}
      RightSideComponent={RightSideComponent}
      >
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Title</th>
            <th>Order</th>
          </tr>
        </thead>
        <tbody>
          { getFilteredFilters().map( (filter) => (
              <tr
                key={filter.id}
                className={classnames (
                  "clickable",
                  {
                    "active": parseInt(match.params.id) === filter.id
                  }
                )}
                style={{whiteSpace: "nowrap",  overflow: "hidden"}}
                onClick={ () => history.push(`/helpdesk/settings/publicFilters/${filter.id.toString()}`) }>
                <td
                  style={{maxWidth: "300px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }} >
                  {filter.title}
                </td>
                <td
                  style={{maxWidth: "300px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }} >
                  {filter.order}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </SettingListContainer>
  )
}