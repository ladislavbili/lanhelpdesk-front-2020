import React from 'react';
import {
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import {
  useTranslation
} from "react-i18next";

export default function SettingsInput( props ) {
  //data
  const {
    id,
    className,
    label,
    labelClassName,
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

  const {
    t
  } = useTranslation();

  return (
    <FormGroup className={ className ? className : '' }>
      <Label className={`row ${ labelClassName ? labelClassName : '' }`} htmlFor={ id }>
        { label }
        { required && <span className="warning-big m-l-5">*</span> }
        { error && <span className="ml-auto message error-message m-r-0">{errorMessage}</span> }
      </Label>
      <div className='row'>
        <div className='flex'>
          <Input
            autoComplete="off"
            id={ id }
            type={ type }
            placeholder={ placeholder ? placeholder : `${t('enter')} ${label.toLowerCase()}` }
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