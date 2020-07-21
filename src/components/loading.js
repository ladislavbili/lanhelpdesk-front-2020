import React, { Component } from 'react';
import { Alert } from 'reactstrap';

export default class Loading extends Component{
  render(){
    return (
      <div className="content">
        <Alert color="primary centerHor centerVer">
            Loading data...
        </Alert>
      </div>
    );
  }
}
