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
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import classnames from 'classnames';
import ManualForm from 'cmdb/manuals/form';
import {
  useTranslation
} from "react-i18next";

import {
  REST_URL,
} from 'configs/restAPI';

import {
  ADD_MANUAL,
  UPDATE_MANUAL,
} from 'cmdb/manuals/queries';

export default function ManualAddContainer( props ) {
  const {
    match,
    history,
  } = props;
  const companyId = parseInt( match.params.companyID );

  const {
    t
  } = useTranslation();

  //mutations
  const [ addManual ] = useMutation( ADD_MANUAL );
  const [ updateManual ] = useMutation( UPDATE_MANUAL );

  return (
    <ManualForm
      edit={false}
      addManual={(data, setSaving) => {
        setSaving(true);
        const separatedData = extractImages(data.body);
        data.body = separatedData.value;
        addManual({variables: {...data, companyId}}).then((response1) => {
          const id = response1.data.addCmdbManual.id;
          if(separatedData.files.length > 0){
            const formData = new FormData();
            separatedData.files.forEach( ( file ) => formData.append( `file`, file ) );
            formData.append( "token", `Bearer ${sessionStorage.getItem( "acctok" )}` );
            formData.append( "id", id );
            formData.append( "type", "manual" );
            axios.post( `${REST_URL}/cmdb-upload-text-images`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            } ).then((response2) => {
              if(!response2.data.ok){
                console.log(response.data);
                setSaving(false);
                return;
              }
              const newBody = replacePlaceholdersWithLinks(separatedData.value, response2.data.attachments, 'get-cmdb-file');
              updateManual({variables: { id, body: newBody, title: data.title }}).then(() => {
                setSaving(false);
                history.push(`/cmdb/manuals/${companyId}/${id}`);
              }).catch((e) => {
                console.log(e);
                setSaving(false);
              })
            })
          }else{
            setSaving(false);
            history.push(`/cmdb/manuals/${companyId}/${id}`);
          }
        }).catch((e) => {
          console.log(e);
          setSaving(false);
        })
      }}
      close={(() => history.goBack() )}
      />
  );

}