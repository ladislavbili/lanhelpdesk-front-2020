import React from 'react';
import classnames from 'classnames';
import {
  useTranslation
} from "react-i18next";

export default function ErrorMessage( props ) {
  const {
    show,
    message,
    inLabel,
    height,
    className
  } = props;
  const {
    t
  } = useTranslation();

  const giveMargin = ( inLabel === null || inLabel === undefined ) ? true : inLabel;
  if ( show === undefined ) {
    return <div className={`error-message ${className ? className : ''}`}>{`noErrorMessageDefined`}</div>
  }
  if ( !show ) {
    return null
  }
  return (
    <div className={`error-message ${className ? className : ''}`}>
      <i className="fa fa-exclamation-triangle" /> { message ? message : 'errorDefineShow' }
    </div>
  )
}