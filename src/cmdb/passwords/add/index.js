import React from 'react';
import {
  useMutation,
} from "@apollo/client";
import PasswordForm from 'cmdb/passwords/form';
import {
  useTranslation
} from "react-i18next";

import {
  ADD_PASSWORD,
  UPDATE_PASSWORD,
} from 'cmdb/passwords/queries';

export default function PasswordAddContainer( props ) {
  const {
    match,
    history,
  } = props;
  const companyId = match.params.companyID === 'all' ? null : parseInt( match.params.companyID );

  const {
    t
  } = useTranslation();

  //mutations
  const [ addPassword ] = useMutation( ADD_PASSWORD );
  const [ updatePassword ] = useMutation( UPDATE_PASSWORD );

  return (
    <PasswordForm
      edit={false}
      addPassword={(data, setSaving) => {
        setSaving(true);
        addPassword({variables: {...data, companyId}}).then((response1) => {
          const id = response1.data.addCmdbPassword.id;
            setSaving(false);
            history.push(`/cmdb/passwords/${companyId === null ? 'all' : companyId}/p/1/${id}`);
          }).catch((e) => {
          console.log(e);
          setSaving(false);
        })
      }}
      close={(() => history.goBack() )}
      />
  );

}