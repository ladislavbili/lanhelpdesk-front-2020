import React from 'react';
import {
  useQuery,
  useMutation,
  useSubscription,
} from "@apollo/client";
import LanpassPasswordForm from 'lanpass/passwords/form';
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

/*
import {
  GET_FOLDERS,
  FOLDERS_SUBSCRIPTION,
} from 'lanpass/folders/queries';

import {
  GET_PAGE,
  UPDATE_PAGE,
  DELETE_PAGE,
} from 'lanpass/passwords/queries';
*/

export default function PasswordEditContainer( props ) {
  const {
    match,
  } = props;

  const {
    t
  } = useTranslation();
/*
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
    data: passwordData,
    loading: passwordLoading,
    refetch: passwordRefetch,
  } = useQuery( GET_PAGE, {
    variables: {
      id: parseInt( match.params.passwordID )
    },
    fetchPolicy: 'network-only'
  } );
*/

  //mutations
  /*const [ updatePassword ] = useMutation( UPDATE_PAGE );
  const [ deletePassword ] = useMutation( DELETE_PAGE );*/
  const [ showEdit, setShowEdit ] = React.useState( false );
  const [ saving, setSaving ] = React.useState( false );

  const loading = (
    foldersLoading ||
    passwordLoading
  );

  if ( loading ) {
    return ( <Loading/> )
  }

  const folders = []; // foldersData.lanpassFolders;
  const password = {}; // passwordData.lanpassPassword;
  const myRights = {}; // password.myRights;

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
                if(window.confirm(t('comfirmDeletingLanpassPassword'))){
                  setSaving(true);
                  deletePassword({variables: {id: password.id }}).then(() => {
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
      <LanpassPasswordForm
        id={password.id}
        edit={true}
        disabled={!myRights.write || password.folder.archived || !showEdit}
        close={(() => setShowEdit(false) )}
        savePassword={(data, setSaving, afterUpdate) => {
          setSaving(true);
          data.deletedImages = getDeletedImages(data.body, password.images, 'get-lw-file');
          const separatedData = extractImages(data.body);
          if(separatedData.files.length > 0){
            const formData = new FormData();
            separatedData.files.forEach( ( file ) => formData.append( `file`, file ) );
            formData.append( "token", `Bearer ${sessionStorage.getItem( "acctok" )}` );
            formData.append( "lanpassId", data.id );
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
              /*
              updatePassword({variables: data}).then(() => {
                setSaving(false);
                afterUpdate();
              }).catch((e) => {
                console.log(e);
                setSaving(false);
              })
              */
            })
          }else{
            /*
            updatePassword({variables: data}).then(() => {
              setSaving(false);
              afterUpdate();
            }).catch((e) => {
              console.log(e);
              setSaving(false);
            })
            */
          }
        }}
        deletePassword={(setSaving) => {
          if(window.confirm(t('comfirmDeletingLanpassPassword'))){
            setSaving(true);
            /*
            deletePassword({variables: {id: password.id }}).then(() => {
              setSaving(false);
              history.back();
            }).catch((e) => {
              setSaving(false);
              console.log(e);
            })
            */
          }
        }}
        allFolders={toSelArr(folders)}
        password={password}
        />
    </div>
  );

}
