import React from 'react';
import {
  useQuery,
  useMutation,
  useSubscription,
} from "@apollo/client";
import ItemForm from 'cmdb/items/form';
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
  GET_BASIC_COMPANIES,
  COMPANIES_SUBSCRIPTION,
} from 'helpdesk/settings/companies/queries';

import {
  GET_CATEGORIES,
  CATEGORIES_SUBSCRIPTION,
} from 'cmdb/categories/queries';

import {
  GET_ITEM,
  UPDATE_ITEM,
  DELETE_ITEM,
} from 'cmdb/items/queries';

export default function ItemEditContainer( props ) {
  const {
    match,
  } = props;

  const {
    t
  } = useTranslation();


  const {
    data: companiesData,
    loading: companiesLoading,
    refetch: companiesRefetch,
  } = useQuery( GET_BASIC_COMPANIES, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( COMPANIES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      companiesRefetch();
    }
  } );

  const {
    data: categoriesData,
    loading: categoriesLoading,
    refetch: categoriesRefetch,
  } = useQuery( GET_CATEGORIES, {
    fetchPolicy: 'network-only',
  } );

  useSubscription( CATEGORIES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      categoriesRefetch();
    }
  } );

  const {
    data: itemData,
    loading: itemLoading,
    refetch: itemRefetch,
  } = useQuery( GET_ITEM, {
    variables: {
      id: parseInt( match.params.itemID )
    },
    fetchPolicy: 'network-only'
  } );


  //mutations
  const [ updateItem ] = useMutation( UPDATE_ITEM );
  const [ deleteItem ] = useMutation( DELETE_ITEM );
  const [ showEdit, setShowEdit ] = React.useState( false );
  const [ saving, setSaving ] = React.useState( false );

  const loading = (
    companiesLoading ||
    categoriesLoading ||
    itemLoading
  );

  if ( loading ) {
    return ( <Loading/> )
  }
  const companies = companiesData.basicCompanies;
  const categories = categoriesData.cmdbCategories;
  const item = itemData.cmdbItem;

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
              if(window.confirm(t('comfirmDeletingCmdbItem'))){
                setSaving(true);
                deleteItem({variables: {id: item.id }}).then(() => {
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
      <ItemForm
        id={item.id}
        edit={true}
        saveItem={async (data, setSaving, afterUpdate) => {
          setSaving(true);
          data.deletedImages = [
            ...getDeletedImages(data.description, item.descriptionImages, 'get-cmdb-file'),
            ...getDeletedImages(data.backup, item.backupImages, 'get-cmdb-file'),
            ...getDeletedImages(data.monitoring, item.monitoringImages, 'get-cmdb-file'),
          ];
          const separatedDescriptionData = extractImages(data.description);
          const separatedBackupData = extractImages(data.backup);
          const separatedMonitoringData = extractImages(data.monitoring);
          let allFileUploads = [];
          if(separatedDescriptionData.files.length > 0){
            allFileUploads.push({type: 'descriptionFile' , location: 'description', text: separatedDescriptionData.value , files: separatedDescriptionData.files  })
          };
          if(separatedBackupData.files.length > 0){
            allFileUploads.push({type: 'backupFile' , location: 'backup', text: separatedBackupData.value , files: separatedBackupData.files  })
          };
          if(separatedMonitoringData.files.length > 0){
            allFileUploads.push({type: 'monitoringFile' , location: 'monitoring', text: separatedMonitoringData.value , files: separatedMonitoringData.files  })
          };
          if(allFileUploads.length > 0){
            let responses = null;
            try {
              responses = await Promise.all(
                allFileUploads.map((fileUpload) => {
                  const formData = new FormData();
                  fileUpload.files.forEach( ( file ) => formData.append( `file`, file ) );
                  formData.append( "token", `Bearer ${sessionStorage.getItem( "acctok" )}` );
                  formData.append( "id", data.id );
                  formData.append( "type", fileUpload.type );
                  return axios.post( `${REST_URL}/cmdb-upload-text-images`, formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  } );
                })
              );
            }catch(e){
              console.log(e);
              return;
            }
            if(responses.some( (response) => !response.data.ok )){
              responses.forEach((response, index) => {
                if(!response.data.ok){
                  console.log( allFileUploads[index].type  ,response.data);
                }
              })
              setSaving(false);
              return;
            };
            let changedCKTexts = {
              description: separatedDescriptionData.value,
              backup: separatedBackupData.value,
              monitoring: separatedMonitoringData.value,
            };
            responses.forEach((response, index) => {
              const fileUpload = allFileUploads[index];
              changedCKTexts[fileUpload.location] = replacePlaceholdersWithLinks(fileUpload.text, response.data.attachments, 'get-cmdb-file');
            });
            data = {
              ...data,
              ...changedCKTexts,
            };
            updateItem({variables: data}).then(() => {
              setSaving(false);
              afterUpdate();
            }).catch((e) => {
              console.log(e);
              setSaving(false);
            })
          }else{
            updateItem({variables: data}).then(() => {
              setSaving(false);
              afterUpdate();
            }).catch((e) => {
              console.log(e);
              setSaving(false);
            })
          }
        }}
        disabled={!showEdit}
        close={(() => setShowEdit(false) )}
        companies={toSelArr(companies)}
        categories={toSelArr(categories)}
        item={item}
        />
    </div>
  );

}