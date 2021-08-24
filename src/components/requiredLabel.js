import React from 'react';
import {
  Label,
} from 'reactstrap';

export default function RequiredLabel( props ) {
  const {
    className,
    children,
  } = props;

  return (
    <Label className={ className ? className : '' }>
      {children}
      <span className="warning-big m-l-5">*</span>
  </Label>
  )
}