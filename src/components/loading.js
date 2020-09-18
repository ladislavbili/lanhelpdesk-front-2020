import React from 'react';
import { Spinner } from 'reactstrap';

export default function Loading(props){

  return (
    <div style={{ height: '100vh' }}>
      <div className="center-hor center-ver row m-t-17p" style={{ width: 'fit-content' }}>
        <Spinner color="primary" style={{ width: '3rem', height: '3rem' }} className="m-r-10" />
        <div className="center-hor ">
            Loading data...
        </div>
      </div>
    </div>
  );
}
