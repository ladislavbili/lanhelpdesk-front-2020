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
  setPGlobalStringFilter,
  setPLocalStringFilter,
  clearPLocalStringFilter,
} from 'apollo/localSchema/actions';

import {
  P_SIDEBAR_FOLDER,
  P_LOCAL_STRING_FILTER,
  P_GLOBAL_STRING_FILTER,
} from 'apollo/localSchema/queries';

import {
  GET_PASSWORDS,
  PASSWORDS_SUBSCRIPTION,
} from 'lanpass/passwords/queries';


export default function LanpassPasswordsLoader( props ) {
  const {
    match,
  } = props;
  const {
    t
  } = useTranslation();

  const password = match.params.password ? parseInt( match.params.password ) : 1;
  const limit = 30;
  const order = "id";
  const page = match.params.page ? parseInt( match.params.page ) : 1;

  const {
    data: sidebarFolderData,
  } = useQuery( P_SIDEBAR_FOLDER );
  const {
    data: localStringFilterData,
  } = useQuery( P_LOCAL_STRING_FILTER );
  const {
    data: globalStringFilterData,
  } = useQuery( P_GLOBAL_STRING_FILTER );

  const folder = (
    sidebarFolderData.pSidebarFolder == null ? {
      id: null,
      title: t( 'allFolders' )
    } :
    sidebarFolderData.pSidebarFolder
  );

  const folderId = folder.id;
  const localStringFilter = localStringFilterData.pLocalStringFilter;
  const globalStringFilter = globalStringFilterData.pGlobalStringFilter;

  const {
    data: passwordsData,
    loading: passwordsLoading,
    refetch: passwordsRefetch,
  } = useQuery( GET_PASSWORDS, {
    variables: {
      folderId,
      order,
      password: match.params.password ? parseInt( match.params.password ) : 1,
      limit,
      page,
      stringFilter: globalStringFilter,
    },
    fetchPolicy: 'network-only',
  } );

  useSubscription( PASSWORDS_SUBSCRIPTION, {
    variables: {
      folderId,
    },
    onSubscriptionData: () => {
      passwordsRefetch({
          folderId,
          order,
          password: match.params.password ? parseInt( match.params.password ) : 1,
          limit,
          page,
          stringFilter: globalStringFilter,
        })
    }
  } );

  React.useEffect( () => {
    passwordsRefetch( {
        folderId,
        order,
        password: match.params.password ? parseInt( match.params.password ) : 1,
        limit,
        page,
        stringFilter: globalStringFilter,
      })
  }, [ folderId, match.params.password, globalStringFilter ] );

  const passwords = passwordsLoading ? [] : passwordsData.passEntries.passwords;
  const count = passwordsLoading ? 0 : passwordsData.passEntries.count;

  return (
    <PasswordsList
      {...props}
      loading={false}
      passwords={passwords}
      count={count}
      password={password}
      limit={limit}
      page={page}
      folderId={folderId}
      folder={folder}
      passwordsRefetch={() => {
        passwordsRefetch( {
            folderId,
            password: match.params.password ? parseInt( match.params.password ) : 1,
            limit,
            stringFilter: globalStringFilter,
          });
      }}
      setGlobalStringFilter={setPGlobalStringFilter}
      setLocalStringFilter={setPLocalStringFilter}
      clearLocalStringFilter={clearPLocalStringFilter}
      localStringFilter={localStringFilter}
      globalStringFilter={globalStringFilter}

      />
  );
}
