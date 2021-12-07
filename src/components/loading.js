import React from 'react';
import {
  Spinner
} from 'reactstrap';
import classnames from 'classnames';
import {
  useTranslation
} from "react-i18next";


export default function Loading( props ) {
  const {
    noPos,
    size,
    flex,
  } = props;
  const {
    t
  } = useTranslation();

  let divStyle = {
    backgroundColor: 'inherit'
  }

  if ( !flex ) {
    divStyle = {
      ...divStyle,
      height: '100vh'
    }
  } else {
    divStyle = {
      ...divStyle,
      flex: 1
    }
  }

  return (
    <div className="noselect" style={ divStyle }>
      <div
        className={ classnames({ 'center-hor': !noPos, "center-ver": !noPos, "p-t-17per": !noPos }, "row") }
        style={ noPos ? {} : { width: 'fit-content' }}
        >
        <Spinner color="primary" style={{ width: `${size ? size : 3 }rem`, height: `${size ? size : 3 }rem` }} className="m-r-10" />
        <div className="center-hor">
            {t('loadingData')}...
        </div>
      </div>
    </div>
  );
}