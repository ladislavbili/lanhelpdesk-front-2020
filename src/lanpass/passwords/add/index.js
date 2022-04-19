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
import LanpassPasswordForm from 'lanpass/passwords/form';
import {
  useTranslation
} from "react-i18next";

import {
  REST_URL,
} from 'configs/restAPI';
/*
import {
  GET_FOLDERS,
  FOLDERS_SUBSCRIPTION,
} from 'lanpass/folders/queries';

import {
  ADD_PAGE,
  UPDATE_PAGE,
} from 'lanpass/passwords/queries';
*/

export default function PasswordAddContainer( props ) {
  const {
    folderId,
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
    fetchPolicy: 'network-only',
    variables: {
      archived: false,
    }
  } );

  useSubscription( FOLDERS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      foldersRefetch();
    }
  } );
*/
  //mutations
  /*
  const [ addPassword ] = useMutation( ADD_PAGE );
  const [ updatePassword ] = useMutation( UPDATE_PAGE );
*/
  //state
  const [ open, setOpen ] = React.useState( false );

  const folders = []; // foldersLoading ? [] : foldersData.lanpassFolders;

  return (
    <Empty>
      <button
        className="btn sidebar-btn"
        onClick={() => {
          setOpen(true);
        }}
        >
        <i className="fa fa-plus"/>
        {`${t('password')}`}
      </button>
      <Modal isOpen={open} className="task-add-container" modalClassName="overflow-x-auto" >
        <ModalBody>
          { open &&
            <LanpassPasswordForm
              edit={false}
              addPassword={(data, setSaving, afterAdd) => {
                setSaving(true);
                const separatedData = extractImages(data.body);
                data.body = separatedData.value;
                /*
                addPassword({variables: data}).then((response1) => {
                  const id = response1.data.addLanpassPassword.id;
                  if(separatedData.files.length > 0){
                    const formData = new FormData();
                    separatedData.files.forEach( ( file ) => formData.append( `file`, file ) );
                    formData.append( "token", `Bearer ${sessionStorage.getItem( "acctok" )}` );
                    formData.append( "lanpassId", id );
                    axios.post( `${REST_URL}/lw-upload-text-images`, formData, {
                        headers: {
                          'Content-Type': 'multipart/form-data'
                        }
                      } ).then((response2) => {
                        if(!response2.data.ok){
                          console.log(response.data);
                          setSaving(false);
                          return;
                        }
                        const newBody = replacePlaceholdersWithLinks(separatedData.value, response2.data.attachments, 'get-lw-file');
                        updatePassword({variables: { id, body: newBody, title: data.title }}).then(() => {
                          setSaving(false);
                          afterAdd();
                        }).catch((e) => {
                          console.log(e);
                          setSaving(false);
                        })
                      })
                    }else{
                      setSaving(false);
                      afterAdd();
                    }
                }).catch((e) => {
                  console.log(e);
                  setSaving(false);
                })
                */
              }}
              close={(() => setOpen(false) )}
              allFolders={toSelArr(folders)}
              folderId={folderId}
              />
          }
        </ModalBody>
      </Modal>
    </Empty>
  );

}
