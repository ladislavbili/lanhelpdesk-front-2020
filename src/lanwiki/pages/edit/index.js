import React from 'react';
import {
  useQuery,
  useMutation,
  useSubscription,
} from "@apollo/client";
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import classnames from 'classnames';
import LanwikiPageForm from 'lanwiki/pages/form';
import Loading from 'components/loading';
import {
  useTranslation
} from "react-i18next";
import {
  toSelArr
} from 'helperFunctions';

import {
  GET_TAGS,
  TAGS_SUBSCRIPTION,
} from 'lanwiki/tags/queries';

import {
  GET_FOLDERS,
  FOLDERS_SUBSCRIPTION,
} from 'lanwiki/folders/queries';

import {
  GET_PAGE,
  UPDATE_PAGE,
  DELETE_PAGE,
} from 'lanwiki/pages/queries';

export default function PageEditContainer( props ) {
  const {
    match,
  } = props;

  const {
    t
  } = useTranslation();


  const {
    data: tagsData,
    loading: tagsLoading,
    refetch: tagsRefetch,
  } = useQuery( GET_TAGS, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( TAGS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      tagsRefetch();
    }
  } );

  const {
    data: foldersData,
    loading: foldersLoading,
    refetch: foldersRefetch,
  } = useQuery( GET_FOLDERS, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( FOLDERS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      foldersRefetch();
    }
  } );

  const {
    data: pageData,
    loading: pageLoading,
    refetch: pageRefetch,
  } = useQuery( GET_PAGE, {
    variables: {
      id: parseInt( match.params.pageID )
    },
    fetchPolicy: 'network-only'
  } );


  //mutations
  const [ updatePage ] = useMutation( UPDATE_PAGE );
  const [ deletePage ] = useMutation( DELETE_PAGE );

  const loading = (
    tagsLoading ||
    foldersLoading ||
    pageLoading
  );

  if ( loading ) {
    return ( <Loading/> )
  }
  const tags = tagsData.lanwikiTags;
  const folders = foldersData.lanwikiFolders;
  const page = pageData.lanwikiPage;
  const myRights = page.myRights;

  return (
    <LanwikiPageForm
      id={page.id}
      edit={true}
      disabled={!myRights.write}
      close={(() => history.back() )}
      savePage={(data, setSaving, afterUpdate) => {
        setSaving(true);
        updatePage({variables: data}).then(() => {
          setSaving(false);
          afterUpdate();
        }).catch((e) => {
          console.log(e);
          setSaving(false);
        })
      }}
      deletePage={(setSaving) => {
        if(window.confirm(t('comfirmDeletingLanwikiPage'))){
          setSaving(true);
          deletePage({variables: {id: page.id }}).then(() => {
            setSaving(false);
            history.back();
          }).catch((e) => {
            setSaving(false);
            console.log(e);
          })
        }
      }}
      allTags={toSelArr(tags)}
      allFolders={toSelArr(folders)}
      page={page}
      />
  );

}