import React from 'react';
import {
  useQuery,
  useMutation,
  useSubscription,
} from "@apollo/client";
import LanwikiPageForm from 'lanwiki/pages/form';
import Loading from 'components/loading';
import {
  useTranslation
} from "react-i18next";
import axios from 'axios';
import {
  toSelArr,
  extractImages,
  replacePlaceholdersWithLinks,
  getDeletedImages,
} from 'helperFunctions';

import {
  REST_URL,
} from 'configs/restAPI';

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
  const [ showEdit, setShowEdit ] = React.useState( false );
  const [ saving, setSaving ] = React.useState( false );

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
    <div>
      { !showEdit &&
        <div className="task-add-layout row">
          <button
            type="button"
            disabled={saving}
            className="btn-link task-add-layout-button btn-distance"
            onClick={() => {
              history.back();
            }}
            >
            <i className="fas fa-arrow-left commandbar-command-icon" />
            {t('back')}
          </button>
          { myRights.write &&
            <button
              type="button"
              disabled={saving}
              className="btn-link task-add-layout-button btn-distance"
              onClick={() => { setShowEdit(true) }}
              >
              <i className="fa fa-pen" />
              {t('edit')}
            </button>
          }
          { myRights.write &&
            <button
              type="button"
              className="btn-link task-add-layout-button btn-distance"
              onClick={() => {
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
              >
              <i className="far fa-trash-alt" />
              {t('delete')}
            </button>
          }
        </div>
      }
      <LanwikiPageForm
        id={page.id}
        edit={true}
        disabled={!myRights.write || page.folder.archived || !showEdit}
        close={(() => setShowEdit(false) )}
        savePage={(data, setSaving, afterUpdate) => {
          setSaving(true);
          data.deletedImages = getDeletedImages(data.body, page.images, 'get-lw-file');
          const separatedData = extractImages(data.body);
          if(separatedData.files.length > 0){
            const formData = new FormData();
            separatedData.files.forEach( ( file ) => formData.append( `file`, file ) );
            formData.append( "token", `Bearer ${sessionStorage.getItem( "acctok" )}` );
            formData.append( "lanwikiId", data.id );
            axios.post( `${REST_URL}/lw-upload-text-images`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            } ).then((response) => {
              if(!response.data.ok){
                console.log(response.data);
                setSaving(false);
                return;
              }
              const newBody = replacePlaceholdersWithLinks(separatedData.value, response.data.attachments, 'get-lw-file');
              data.body = newBody;
              updatePage({variables: data}).then(() => {
                setSaving(false);
                afterUpdate();
              }).catch((e) => {
                console.log(e);
                setSaving(false);
              })
            })
          }else{
            updatePage({variables: data}).then(() => {
              setSaving(false);
              afterUpdate();
            }).catch((e) => {
              console.log(e);
              setSaving(false);
            })
          }
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
    </div>
  );

}