import React, {
  Component
} from 'react';
import {
  Alert
} from 'reactstrap';
import classnames from 'classnames';

export default class Error extends Component {
  render() {
    const {
      show,
      message,
      inLabel
    } = this.props;
    const giveMargin = ( inLabel === null || inLabel === undefined ) ? true : inLabel;
    console.log( giveMargin );
    if ( show === undefined ) {
      return <div className="error-style center-hor">{`DEFINE PARAMETER SHOW - add to the component parameter show={true/false condition}`}</div>
    }
    if ( !show ) {
      return null
    }
    return (
      <div className={classnames("error-style center-hor", { "p-b-0": giveMargin, "p-t-0": giveMargin })}>
        <i className="fa fa-exclamation-triangle" /> { message ? message : 'No message defined!' }
      </div>
    )
  }
}