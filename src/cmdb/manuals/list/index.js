import React from 'react';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";

import {
  useTranslation
} from "react-i18next";

import Loading from 'components/loading';
import ManualsList from './list';
import {
  setCmdbManualGlobalStringFilter,
  setCmdbManualLocalStringFilter,
  clearCmdbManualLocalStringFilter,
} from 'apollo/localSchema/actions';
import {
  CMDB_SIDEBAR_COMPANY,
  CMDB_MANUAL_LOCAL_STRING_FILTER,
  CMDB_MANUAL_GLOBAL_STRING_FILTER,
} from 'apollo/localSchema/queries';

import {
  CMDB_MANUALS,
  MANUALS_SUBSCRIPTION
} from 'cmdb/manuals/queries';


export default function CMDBManualsLoader( props ) {
  const {
    match,
  } = props;
  const {
    t
  } = useTranslation();

  const page = match.params.page ? parseInt( match.params.page ) : 1;
  const limit = 30;

  const {
    data: sidebarCompanyData,
  } = useQuery( CMDB_SIDEBAR_COMPANY );
  const {
    data: localStringFilterData,
  } = useQuery( CMDB_MANUAL_LOCAL_STRING_FILTER );
  const {
    data: globalStringFilterData,
  } = useQuery( CMDB_MANUAL_GLOBAL_STRING_FILTER );

  const [ sort, setSort ] = React.useState( {
    id: 'id',
    value: 'id',
    label: t( 'id' ),
    title: t( 'id' ),
  } );

  const company = sidebarCompanyData.cmdbSidebarCompany;
  const companyId = parseInt( match.params.companyID );
  const localStringFilter = localStringFilterData.cmdbManualLocalStringFilter;
  const globalStringFilter = globalStringFilterData.cmdbManualGlobalStringFilter;

  const {
    data: manualsData,
    loading: manualsLoading,
    refetch: manualsRefetch
  } = useQuery( CMDB_MANUALS, {
    variables: {
      companyId,
      order: sort.id,
      page: match.params.page ? parseInt( match.params.page ) : 1,
      limit,
      stringFilter: globalStringFilter,
    },
    fetchPolicy: 'network-only'
  } );

  useSubscription( MANUALS_SUBSCRIPTION, {
    variables: {
      companyId,
    },
    onSubscriptionData: () => {
      manualsRefetch( {
        variables: {
          companyId,
          order: sort.id,
          page: match.params.page ? parseInt( match.params.page ) : 1,
          limit,
          stringFilter: globalStringFilter,
        },
      } );
    }
  } );

  React.useEffect( () => {
    manualsRefetch( {
      variables: {
        companyId,
        order: sort.id,
        page: match.params.page ? parseInt( match.params.page ) : 1,
        limit,
        stringFilter: globalStringFilter,
      },
    } );
  }, [ companyId, match.params.page, globalStringFilter ] );



  const manuals = manualsLoading ? [] : manualsData.cmdbManuals.manuals;
  const count = manualsLoading ? 0 : manualsData.cmdbManuals.count;

  return (
    <ManualsList
      {...props}
      loading={manualsLoading}
      manuals={manuals}
      count={count}
      page={page}
      limit={limit}
      company={company}
      sort={sort}
      setSort={setSort}
      manualsRefetch={() => {
        manualsRefetch( {
          variables: {
            companyId,
            order: sort,
            page: match.params.page ? parseInt( match.params.page ) : 1,
            limit,
            stringFilter: globalStringFilter,
          },
        } );
      }}
      setGlobalStringFilter={setCmdbManualGlobalStringFilter}
      setLocalStringFilter={setCmdbManualLocalStringFilter}
      clearLocalStringFilter={clearCmdbManualLocalStringFilter}
      localStringFilter={localStringFilter}
      globalStringFilter={globalStringFilter}

      />
  );
}