import React from 'react';
import {
  useQuery,
  useMutation,
  useSubscription,
} from "@apollo/client";
import {
  toSelArr,
} from 'helperFunctions';
import Empty from 'components/Empty';
import {
  Modal,
  ModalBody,
} from 'reactstrap';
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import classnames from 'classnames';
import LanwikiPageForm from 'lanwiki/pages/form';
import {
  useTranslation
} from "react-i18next";

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
    fetchPolicy: 'network-only'
  } );

  useSubscription( FOLDERS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      foldersRefetch();
    }
  } );

  //mutations
  const [ addPage ] = useMutation( ADD_PAGE );

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
        {`${t('add')} ${t('lanwikiPage').toLowerCase()}`}
      </button>
      <Modal isOpen={open} className="task-add-container" modalClassName="overflow-x-auto" >
        <ModalBody>
          { open &&
            <LanwikiPageForm
              edit={false}
              addPage={(data, setSaving, afterAdd) => {
                setSaving(true);
                addPage({variables: data}).then(() => {
                  setSaving(false);
                  afterAdd();
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