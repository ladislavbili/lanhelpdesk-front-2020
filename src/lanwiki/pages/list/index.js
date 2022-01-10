import React from 'react';
import {
  useQuery,
} from "@apollo/client";

import {
  useTranslation
} from "react-i18next";

import Loading from 'components/loading';
import PagesList from './list';
import {
  setLGlobalStringFilter,
  setLLocalStringFilter,
  clearLLocalStringFilter,
} from 'apollo/localSchema/actions';
import {
  L_SIDEBAR_TAG,
  L_SIDEBAR_FOLDER,
  L_LOCAL_STRING_FILTER,
  L_GLOBAL_STRING_FILTER,
} from 'apollo/localSchema/queries';

import {
  GET_PAGES,
} from 'lanwiki/pages/queries';


export default function LanwikiPagesLoader( props ) {
  const {
    match,
  } = props;
  const {
    t
  } = useTranslation();

  const page = match.params.page ? parseInt( match.params.page ) : 1;
  const limit = 30;

  const {
    data: sidebarTagData,
  } = useQuery( L_SIDEBAR_TAG );
  const {
    data: sidebarFolderData,
  } = useQuery( L_SIDEBAR_FOLDER );
  const {
    data: localStringFilterData,
  } = useQuery( L_LOCAL_STRING_FILTER );
  const {
    data: globalStringFilterData,
  } = useQuery( L_GLOBAL_STRING_FILTER );

  const folder = (
    sidebarFolderData.lSidebarFolder == null ? {
      id: null,
      title: t( 'allFolders' )
    } :
    sidebarFolderData.lSidebarFolder
  );

  const tag = (
    sidebarTagData.lSidebarTag == null ? {
      id: null,
      title: t( 'allTags' )
    } :
    sidebarTagData.lSidebarTag
  );

  const tagId = tag.id;
  const folderId = folder.id;
  const localStringFilter = localStringFilterData.lLocalStringFilter;
  const globalStringFilter = globalStringFilterData.lGlobalStringFilter;

  const {
    data: pagesData,
    loading: pagesLoading,
    refetch: pagesRefetch,
  } = useQuery( GET_PAGES, {
    variables: {
      tagId,
      folderId,
      page: match.params.page ? parseInt( match.params.page ) : 1,
      limit,
      stringFilter: globalStringFilter,
    },
    fetchPolicy: 'network-only',
  } );

  const pagesRefetchFunc = () => {
    pagesRefetch( {
      variables: {
        tagId,
        folderId,
        page: match.params.page ? parseInt( match.params.page ) : 1,
        limit,
        stringFilter: globalStringFilter,
      }
    } )
  };

  React.useEffect( () => {
    pagesRefetch( {
      variables: {
        tagId,
        folderId,
        page: match.params.page ? parseInt( match.params.page ) : 1,
        limit,
        stringFilter: globalStringFilter,
      }
    } )
  }, [ tagId, folderId, match.params.page, globalStringFilter ] );



  const pages = pagesLoading ? [] : pagesData.lanwikiPages.pages;
  const count = pagesLoading ? 0 : pagesData.lanwikiPages.count;

  return (
    <PagesList
      {...props}
      loading={pagesLoading}
      pages={pages}
      pagesRefetch={pagesRefetchFunc}
      count={count}
      page={page}
      limit={limit}
      folderId={folderId}
      tagId={tagId}
      tag={tag}
      folder={folder}
      setGlobalStringFilter={setLGlobalStringFilter}
      setLocalStringFilter={setLLocalStringFilter}
      clearLocalStringFilter={clearLLocalStringFilter}
      localStringFilter={localStringFilter}
      globalStringFilter={globalStringFilter}

      />
  );
}