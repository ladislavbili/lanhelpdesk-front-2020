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

import {
  GET_FOLDERS,
  FOLDERS_SUBSCRIPTION,
} from 'lanpass/folders/queries';

import {
  ADD_PASSWORD,
  UPDATE_PASSWORD,
} from 'lanpass/passwords/queries';


export default function PasswordAddContainer( props ) {
  const {
    folderId,
  } = props;

  const {
    t
  } = useTranslation();

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
  const [ addPassword ] = useMutation( ADD_PASSWORD );
  const [ updatePassword ] = useMutation( UPDATE_PASSWORD );

  //state
  const [ open, setOpen ] = React.useState( false );

  const folders = foldersLoading ? [] : foldersData.passFolders;

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
                addPassword({
                  variables: {
                    ...data
                  }
                }).then((response1) => {
                      setSaving(false);
                      afterAdd();
                }).catch((e) => {
                  console.log(e);
                  setSaving(false);
                })
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
