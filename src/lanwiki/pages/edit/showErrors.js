import React from 'react';
import {
  useTranslation
} from "react-i18next";

export default function AddPageErrors( props ) {
  const {
    title,
    folder,
    body,
    show,
  } = props;
  const {
    t
  } = useTranslation();

  const noTitle = title.length < 1;
  const noFolder = !folder || !folder.id;
  const noBody = body.length < 1;

  if ( !noTitle && !noFolder && !noBody && !show ) {
    return null;
  }

  return (
    <div className="full-width m-b-20">
      { noTitle &&
        <div className="error-message m-t-5">
          {`${t('title')} ${t('isRequiredButEmpty')}!`}
        </div>
      }
      { noFolder &&
        <div className="error-message m-t-5">
          {`${t('folder')} ${t('isRequiredButEmpty')}!`}
        </div>
      }
      { noBody &&
        <div className="warning-message m-t-5">
          {`${t('lanwikiPageMissingContent')}!`}
        </div>
        }
    </div>
  );
}