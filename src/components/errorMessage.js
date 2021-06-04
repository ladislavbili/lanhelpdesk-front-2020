import React, {
  Component
} from 'react';
import classnames from 'classnames';

export default class ErrorMessage extends Component {
  render() {
    const {
      show,
      message,
      inLabel,
      height,
      className
    } = this.props;
    const giveMargin = ( inLabel === null || inLabel === undefined ) ? true : inLabel;
    if ( show === undefined ) {
      return <div className={`error-message ${className ? className : ''}`}>{`DEFINE PARAMETER SHOW - add to the component parameter show={true/false condition}`}</div>
    }
    if ( !show ) {
      return null
    }
    return (
      <div className={`error-message ${className ? className : ''}`}>
        <i className="fa fa-exclamation-triangle" /> { message ? message : 'No message defined!' }
      </div>
    )
  }
}