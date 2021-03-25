import React from 'react';
import {
  Spinner
} from 'reactstrap';
import classnames from 'classnames';

export default function Loading( props ) {
  const {
    noPos,
    size
  } = props;
  return (
    <div style={ noPos ? { backgroundColor: 'inherit' } : { height: '100vh', backgroundColor: 'inherit' } }>
      <div
        className={ classnames({ 'center-hor': !noPos, "center-ver": !noPos, "p-t-17p": !noPos }, "row") }
        style={ noPos ? {} : { width: 'fit-content' }}
        >
        <Spinner color="primary" style={{ width: `${size ? size : 3 }rem`, height: `${size ? size : 3 }rem` }} className="m-r-10" />
        <div className="center-hor">
            Loading data...
        </div>
      </div>
    </div>
  );
}