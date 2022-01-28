import React from 'react';
import {
  useTranslation
} from "react-i18next";

export default function AddManualErrors( props ) {
  const {
    title,
    body,
    show,
  } = props;
  const {
    t
  } = useTranslation();

  const noTitle = title.length < 1;
  const noBody = body.length < 1;

  if ( ( !noTitle && !noBody ) || !show ) {
    return null;
  }

  return (
    <div className="full-width m-b-20">
      { noTitle &&
        <div className="error-message m-t-5">
          {`${t('title')} ${t('isRequiredButEmpty')}!`}
        </div>
      }
      { noBody &&
        <div className="warning-message m-t-5">
          {`${t('cmdbManualMissingContent')}!`}
        </div>
        }
    </div>
  );
}