import React from 'react';
import {
  useQuery,
  useMutation,
} from "@apollo/client";
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import classnames from 'classnames';
import ManualForm from 'cmdb/manuals/form';
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
  GET_MANUAL,
  UPDATE_MANUAL,
  DELETE_MANUAL,
} from 'cmdb/manuals/queries';

export default function ManualEditContainer( props ) {
  const {
    match,
    history,
  } = props;
  const manualId = parseInt( match.params.manualID );

  const {
    t
  } = useTranslation();

  const {
    data: manualData,
    loading: manualLoading,
    refetch: manualRefetch,
  } = useQuery( GET_MANUAL, {
    variables: {
      id: manualId
    },
    fetchPolicy: 'network-only'
  } );


  //mutations
  const [ updateManual ] = useMutation( UPDATE_MANUAL );
  const [ deleteManual ] = useMutation( DELETE_MANUAL );
  const [ showEdit, setShowEdit ] = React.useState( false );
  const [ saving, setSaving ] = React.useState( false );

  const loading = (
    manualLoading
  );

  if ( loading ) {
    return ( <Loading/> )
  }
  const manual = manualData.cmdbManual;

  return (
    <div>
      { !showEdit &&
        <div className="task-add-layout row">
          <button
            type="button"
            disabled={saving}
            className="btn-link task-add-layout-button btn-distance"
            onClick={() => {
              history.goBack();
            }}
            >
            <i className="fas fa-arrow-left commandbar-command-icon" />
            {t('back')}
          </button>
          <button
            type="button"
            disabled={saving}
            className="btn-link task-add-layout-button btn-distance"
            onClick={() => { setShowEdit(true) }}
            >
            <i className="fa fa-pen" />
            {t('edit')}
          </button>
          <button
            type="button"
            className="btn-link task-add-layout-button btn-distance"
            onClick={() => {
              if(window.confirm(t('comfirmDeletingCMDBManual'))){
                setSaving(true);
                deleteManual({variables: {id: manualId }}).then(() => {
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
        </div>
      }
      <ManualForm
        edit={true}
        disabled={!showEdit}
        close={(() => setShowEdit(false) )}
        saveManual={(data, setSaving) => {
          data.id = manualId;
          setSaving(true);
          data.deletedImages = getDeletedImages(data.body, manual.images, 'get-cmdb-file');
          const separatedData = extractImages(data.body);
          if(separatedData.files.length > 0){
            const formData = new FormData();
            separatedData.files.forEach( ( file ) => formData.append( `file`, file ) );
            formData.append( "token", `Bearer ${sessionStorage.getItem( "acctok" )}` );
            formData.append( "id", manualId );
            formData.append( "type", "manual" );
            axios.post( `${REST_URL}/cmdb-upload-text-images`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            } ).then((response) => {
              if(!response.data.ok){
                console.log(response.data);
                setSaving(false);
                return;
              }
              const newBody = replacePlaceholdersWithLinks(separatedData.value, response.data.attachments, 'get-cmdb-file');
              data.body = newBody;
              updateManual({variables: data}).then(() => {
                setSaving(false);
                setShowEdit(false);
              }).catch((e) => {
                console.log(e);
                setSaving(false);
              })
            })
          }else{
            updateManual({variables: data}).then(() => {
              setSaving(false);
              setShowEdit(false);
            }).catch((e) => {
              console.log(e);
              setSaving(false);
            })
          }
        }}
        manual={manual}
        />
    </div>
  );

}