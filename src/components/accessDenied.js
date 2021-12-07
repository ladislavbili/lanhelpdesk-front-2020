import React from 'react';
import {
  useTranslation
} from "react-i18next";

export default function AccessDenied( props ) {
  const {
    t
  } = useTranslation();
  //TODO: add back button or back to main page
  return (
    <div className="content">
      <div className="centerHor centerVer m-t-20 m-l-20">
          {t('notPermittedToView')}
      </div>
      { props.children }
    </div>
  );
}