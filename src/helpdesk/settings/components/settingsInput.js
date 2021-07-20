import React from 'react';
import {
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

export default function SettingsInput( props ) {
  //data
  const {
    id,
    label,
    type,
    error,
    errorMessage,
    placeholder,
    required,
    disabled,
    value,
    onChange,
    inputProps,
    inputClassName,
    children,
  } = props;

  return (
    <FormGroup>
      <Label className="row" htmlFor={ id }>
        { label }
        { required && <span className="warning-big">*</span> }
        { error && <span className="ml-auto message error-message m-r-0">{errorMessage}</span> }
      </Label>
      <div className='row'>
        <div className='flex'>
          <Input
            id={ id }
            type={ type }
            placeholder={ placeholder ? placeholder : `Enter ${label.toLowerCase()}` }
            value={ value }
            disabled={disabled}
            onChange={ onChange }
            className={` ${ inputClassName ? inputClassName : '' }`}
            { ...( inputProps ? inputProps : {} ) }
            />
        </div>
        { children }
      </div>
    </FormGroup>
  )
}