import React from 'react';
import {
  useQuery,
  useMutation,
  useSubscription,
} from "@apollo/client";
import {
  toSelArr,
  extractImages,
  replacePlaceholdersWithLinks,
} from 'helperFunctions';
import axios from 'axios';
import Empty from 'components/Empty';
import {
  Modal,
  ModalBody,
} from 'reactstrap';
import ItemForm from 'cmdb/items/form';
import {
  useTranslation
} from "react-i18next";

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
  ADD_ITEM,
  UPDATE_ITEM,
} from 'cmdb/items/queries';

export default function ItemAddContainer( props ) {
  const {
    companyId,
    categoryId,
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

  //mutations
  const [ addItem ] = useMutation( ADD_ITEM );
  const [ updateItem ] = useMutation( UPDATE_ITEM );

  //state
  const [ open, setOpen ] = React.useState( false );

  const loading = (
    companiesLoading ||
    categoriesLoading
  );
  const companies = companiesLoading ? [] : companiesData.basicCompanies;
  const categories = categoriesLoading ? [] : categoriesData.cmdbCategories;

  return (
    <Empty>
      <button
        className="btn sidebar-btn"
        disabled={companies.length === 0 || categories.length === 0}
        onClick={() => {
          setOpen(true);
        }}
        >
        <i className="fa fa-plus"/>
        {`${t('cmdbItem')}`}
      </button>
      <Modal isOpen={open} className="task-add-container" modalClassName="overflow-x-auto" >
        <ModalBody>
          { open &&
            <ItemForm
              edit={false}
              addItem={ (data, setSaving, afterAdd) => {
                setSaving(true);
                const separatedDescriptionData = extractImages(data.description);
                const separatedBackupData = extractImages(data.backup);
                const separatedMonitoringData = extractImages(data.monitoring);
                data.description = separatedDescriptionData.value;
                data.backup = separatedBackupData.value;
                data.monitoring = separatedMonitoringData.value;
                addItem({variables: data}).then( async (response1) => {
                  const id = response1.data.addCmdbItem.id;
                  //filter only with files, process them pararelly
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
                          formData.append( "id", id );
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

                    updateItem({variables: {
                      id,
                      title: data.title,
                      active: data.active,
                      location: data.location,
                      ...changedCKTexts,
                    }}).then(() => {
                      setSaving(false);
                      afterAdd();
                    }).catch((e) => {
                      console.log(e);
                      setSaving(false);
                    });
                  }else{
                    setSaving(false);
                    afterAdd();
                  }
                }).catch((e) => {
                  console.log(e);
                  setSaving(false);
                })
              }}
              close={(() => setOpen(false) )}
              companies={toSelArr(companies)}
              categories={toSelArr(categories)}
              companyId={companyId}
              categoryId={categoryId}
              />
          }
        </ModalBody>
      </Modal>
    </Empty>
  );

}