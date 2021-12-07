import React from 'react';
import {
  Label
} from 'reactstrap';
import {
  timestampToString,
  getLocation,
} from 'helperFunctions';
import {
  useTranslation
} from "react-i18next";

export default function ErrorInfo( props ) {
  const {
    history,
    errorMessage
  } = props;

  const {
    t
  } = useTranslation();

  const getEditURL = () => {
    switch ( errorMessage.type ) {
      case 'smtp_email': {
        return `${getLocation(history)}/settings/smtps/${errorMessage.sourceId}`
      }
      default: {
        return getLocation( history );
      }
    }
  }

  const error = errorMessage;
  return (
    <div className="">
      <div className="lanwiki-note scroll-visible fit-with-header">
        <div>
          <Label>{t('type')}</Label>
          {` ${error.type}`}
        </div>
        <div>
          <Label>{t('createdAt')}</Label>
          {` ${timestampToString(parseInt(error.createdAt))} ${error.user ? t('by') + error.user.email : ""}`}
        </div>
        <div>
          <Label>{t('errorSource')}</Label>
          {` ${error.source}`}
        </div>
        {
          error.sourceID !== null &&
          <div>
            <Label>{t('relatedID')}</Label>
            {` ${error.sourceId} `}
            <Label className="clickable" onClick={ ()=> history.push(getEditURL()) }>{t('openRelated')}</Label>
          </div>
        }
        <div>
          <Label>{t('errorMessage')}</Label>
          {` ${error.errorMessage}`}
        </div>
      </div>
    </div>
  );
}