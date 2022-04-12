import React from 'react';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";

import {
  useTranslation
} from "react-i18next";

import Loading from 'components/loading';
import PasswordsList from './list';
import {
  setCmdbPasswordGlobalStringFilter,
  setCmdbPasswordLocalStringFilter,
  clearCmdbPasswordLocalStringFilter,
} from 'apollo/localSchema/actions';
import {
  CMDB_SIDEBAR_COMPANY,
  CMDB_PASSWORD_LOCAL_STRING_FILTER,
  CMDB_PASSWORD_GLOBAL_STRING_FILTER,
} from 'apollo/localSchema/queries';

import {
  CMDB_PASSWORDS,
  PASSWORDS_SUBSCRIPTION
} from 'cmdb/passwords/queries';


export default function CMDBPasswordsLoader( props ) {
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
  } = useQuery( CMDB_PASSWORD_LOCAL_STRING_FILTER );
  const {
    data: globalStringFilterData,
  } = useQuery( CMDB_PASSWORD_GLOBAL_STRING_FILTER );

  const [ sort, setSort ] = React.useState( {
    id: 'id',
    value: 'id',
    label: t( 'id' ),
    title: t( 'id' ),
  } );

  const company = sidebarCompanyData.cmdbSidebarCompany;
  const companyId = match.params.companyID === 'all' ? null : parseInt( match.params.companyID );
  const localStringFilter = localStringFilterData.cmdbPasswordLocalStringFilter;
  const globalStringFilter = globalStringFilterData.cmdbPasswordGlobalStringFilter;

  const {
    data: passwordsData,
    loading: passwordsLoading,
    refetch: passwordsRefetch
  } = useQuery( CMDB_PASSWORDS, {
    variables: {
      companyId,
      order: sort.id,
      page: match.params.page ? parseInt( match.params.page ) : 1,
      limit,
      stringFilter: globalStringFilter,
    },
    fetchPolicy: 'network-only'
  } );

  useSubscription( PASSWORDS_SUBSCRIPTION, {
    variables: {
      companyId,
    },
    onSubscriptionData: () => {
      passwordsRefetch( {
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
    passwordsRefetch( {
      variables: {
        companyId,
        order: sort.id,
        page: match.params.page ? parseInt( match.params.page ) : 1,
        limit,
        stringFilter: globalStringFilter,
      },
    } );
  }, [ companyId, match.params.page, globalStringFilter ] );



  const passwords = passwordsLoading ? [] : passwordsData.cmdbPasswords.passwords;
  const count = passwordsLoading ? 0 : passwordsData.cmdbPasswords.count;

  return (
    <PasswordsList
      {...props}
      loading={passwordsLoading}
      passwords={passwords}
      count={count}
      page={page}
      limit={limit}
      company={company}
      sort={sort}
      setSort={setSort}
      passwordsRefetch={() => {
        passwordsRefetch( {
          variables: {
            companyId,
            order: sort,
            page: match.params.page ? parseInt( match.params.page ) : 1,
            limit,
            stringFilter: globalStringFilter,
          },
        } );
      }}
      setGlobalStringFilter={setCmdbPasswordGlobalStringFilter}
      setLocalStringFilter={setCmdbPasswordLocalStringFilter}
      clearLocalStringFilter={clearCmdbPasswordLocalStringFilter}
      localStringFilter={localStringFilter}
      globalStringFilter={globalStringFilter}

      />
  );
}