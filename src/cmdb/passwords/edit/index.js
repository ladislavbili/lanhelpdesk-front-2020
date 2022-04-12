import React from 'react';
import {
  useQuery,
  useMutation,
} from "@apollo/client";
import PasswordForm from 'cmdb/passwords/form';
import Loading from 'components/loading';
import {
  useTranslation
} from "react-i18next";

import {
  GET_PASSWORD,
  UPDATE_PASSWORD,
  DELETE_PASSWORD,
} from 'cmdb/passwords/queries';

export default function PasswordEditContainer( props ) {
  const {
    match,
    history,
  } = props;
  const passwordId = parseInt( match.params.passwordID );

  const {
    t
  } = useTranslation();

  const {
    data: passwordData,
    loading: passwordLoading,
    refetch: passwordRefetch,
  } = useQuery( GET_PASSWORD, {
    variables: {
      id: passwordId
    },
    fetchPolicy: 'network-only'
  } );


  //mutations
  const [ updatePassword ] = useMutation( UPDATE_PASSWORD );
  const [ deletePassword ] = useMutation( DELETE_PASSWORD );
  const [ showEdit, setShowEdit ] = React.useState( false );
  const [ saving, setSaving ] = React.useState( false );

  const loading = (
    passwordLoading
  );

  if ( loading ) {
    return ( <Loading/> )
  }
  const password = passwordData.cmdbPassword;

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
              if(window.confirm(t('comfirmDeletingCMDBPassword'))){
                setSaving(true);
                deletePassword({variables: {id: passwordId }}).then(() => {
                  setSaving(false);
                  history.goBack();
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
      <PasswordForm
        edit={true}
        disabled={!showEdit}
        close={(() => setShowEdit(false) )}
        savePassword={(data, setSaving) => {
          setSaving(true);
            updatePassword({variables: {...data, id: passwordId}}).then(() => {
              setSaving(false);
              setShowEdit(false);
            }).catch((e) => {
              console.log(e);
              setSaving(false);
            })
          }}
        passwordData={password}
        />
    </div>
  );

}