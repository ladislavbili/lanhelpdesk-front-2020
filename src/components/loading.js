import React from 'react';
import { Alert } from 'reactstrap';

export default function Loading(props){

  return (
    <div className="content">
      <Alert color="primary centerHor centerVer">
          Loading data...
      </Alert>
    </div>
  );
}
