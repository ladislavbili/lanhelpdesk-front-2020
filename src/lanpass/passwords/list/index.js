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
  setLGlobalStringFilter,
  setLLocalStringFilter,
  clearLLocalStringFilter,
} from 'apollo/localSchema/actions';
/*
import {
  L_SIDEBAR_FOLDER,
  L_LOCAL_STRING_FILTER,
  L_GLOBAL_STRING_FILTER,
} from 'apollo/localSchema/queries';

import {
  GET_PAGES,
  PAGES_SUBSCRIPTION,
} from 'lanwiki/passwords/queries';
*/

export default function LanwikiPasswordsLoader( props ) {
  const {
    match,
  } = props;
  const {
    t
  } = useTranslation();

  const password = match.params.password ? parseInt( match.params.password ) : 1;
  const limit = 30;
/*
  const {
    data: sidebarFolderData,
  } = useQuery( L_SIDEBAR_FOLDER );
  const {
    data: localStringFilterData,
  } = useQuery( L_LOCAL_STRING_FILTER );
  const {
    data: globalStringFilterData,
  } = useQuery( L_GLOBAL_STRING_FILTER );
*/
  const folder = {
    id: null,
    title: t( 'allFolders' )
  };
  /*(
    sidebarFolderData.lSidebarFolder == null ? {
      id: null,
      title: t( 'allFolders' )
    } :
    sidebarFolderData.lSidebarFolder
  );
  */

  const folderId = folder.id;
  const localStringFilter = {}; //localStringFilterData.lLocalStringFilter;
  const globalStringFilter = {}; // globalStringFilterData.lGlobalStringFilter;

/*
  const {
    data: passwordsData,
    loading: passwordsLoading,
    refetch: passwordsRefetch,
  } = useQuery( GET_PAGES, {
    variables: {
      folderId,
      archived: folderId === null ? false : folder.archived,
      password: match.params.password ? parseInt( match.params.password ) : 1,
      limit,
      stringFilter: globalStringFilter,
    },
    fetchPolicy: 'network-only',
  } );

  useSubscription( PAGES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      passwordsRefetch( {
        variables: {
          folderId,
          password: match.params.password ? parseInt( match.params.password ) : 1,
          limit,
          stringFilter: globalStringFilter,
        }
      } )
    }
  } );

  React.useEffect( () => {
    passwordsRefetch( {
      variables: {
        folderId,
        password: match.params.password ? parseInt( match.params.password ) : 1,
        limit,
        stringFilter: globalStringFilter,
      }
    } )
  }, [ folderId, match.params.password, globalStringFilter ] );
*/


  const passwords = []; // passwordsLoading ? [] : passwordsData.lanwikiPasswords.passwords;
  const count = 0; //passwordsLoading ? 0 : passwordsData.lanwikiPasswords.count;

  return (
    <PasswordsList
      {...props}
      loading={false}
      passwords={passwords}
      count={count}
      password={password}
      limit={limit}
      folderId={folderId}
      folder={folder}
      passwordsRefetch={() => {
        passwordsRefetch( {
          variables: {
            folderId,
            password: match.params.password ? parseInt( match.params.password ) : 1,
            limit,
            stringFilter: globalStringFilter,
          }
        } );
      }}
      setGlobalStringFilter={setLGlobalStringFilter}
      setLocalStringFilter={setLLocalStringFilter}
      clearLocalStringFilter={clearLLocalStringFilter}
      localStringFilter={localStringFilter}
      globalStringFilter={globalStringFilter}

      />
  );
}
