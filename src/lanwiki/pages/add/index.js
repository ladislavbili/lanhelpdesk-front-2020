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
import LanwikiPageForm from 'lanwiki/pages/form';
import {
  useTranslation
} from "react-i18next";

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
  ADD_PAGE,
  UPDATE_PAGE,
} from 'lanwiki/pages/queries';

export default function PageAddContainer( props ) {
  const {
    folderId,
    tagId,
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

  //mutations
  const [ addPage ] = useMutation( ADD_PAGE );
  const [ updatePage ] = useMutation( UPDATE_PAGE );

  //state
  const [ open, setOpen ] = React.useState( false );

  const loading = (
    tagsLoading ||
    foldersLoading
  );
  const tags = tagsLoading ? [] : tagsData.lanwikiTags;
  const folders = foldersLoading ? [] : foldersData.lanwikiFolders;

  return (
    <Empty>
      <button
        className="btn sidebar-btn"
        onClick={() => {
          setOpen(true);
        }}
        >
        <i className="fa fa-plus"/>
        {`${t('page')}`}
      </button>
      <Modal isOpen={open} className="task-add-container" modalClassName="overflow-x-auto" >
        <ModalBody>
          { open &&
            <LanwikiPageForm
              edit={false}
              addPage={(data, setSaving, afterAdd) => {
                setSaving(true);
                const separatedData = extractImages(data.body);
                data.body = separatedData.value;
                addPage({variables: data}).then((response1) => {
                  const id = response1.data.addLanwikiPage.id;
                  if(separatedData.files.length > 0){
                    const formData = new FormData();
                    separatedData.files.forEach( ( file ) => formData.append( `file`, file ) );
                    formData.append( "token", `Bearer ${sessionStorage.getItem( "acctok" )}` );
                    formData.append( "lanwikiId", id );
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
                        updatePage({variables: { id, body: newBody, title: data.title }}).then(() => {
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
              }}
              close={(() => setOpen(false) )}
              allTags={toSelArr(tags)}
              allFolders={toSelArr(folders)}
              folderId={folderId}
              tagId={tagId}
              />
          }
        </ModalBody>
      </Modal>
    </Empty>
  );

}