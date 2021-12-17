import React from 'react';
import {
  FormGroup,
  Label,
  Input,
  InputGroupText,
  InputGroupAddon,
  InputGroup,
} from 'reactstrap';
import {
  randomPassword,
} from 'helperFunctions';
import {
  useTranslation
} from "react-i18next";

export default function SettingsHiddenInput( props ) {
  //data
  const {
    id,
    label,
    type,
    placeholder,
    required,
    value,
    onChange,
    inputProps,
    inputClassName,
    children,
    regeneratePassword,
  } = props;

  const {
    t
  } = useTranslation();

  const [ shown, setShown ] = React.useState( false );

  return (
    <FormGroup>
      <div className="row">
      <Label htmlFor={ id }>{ label }{ required && <span className="warning-big">*</span> }</Label>
      {regeneratePassword && <button className="btn-link ml-auto" onClick={()=> { onChange({target: {value: randomPassword()}}) }}>{t('regeneratePassword')}</button>}
      </div>
      <InputGroup>
        <Input
          id={ id }
          type={ shown ? type : "password" }
          placeholder={ placeholder ? placeholder : `${t('enter')} ${label.toLowerCase()}` }
          value={ value }
          onChange={ onChange }
          className={` ${ inputClassName ? inputClassName : '' }`}
          { ...( inputProps ? inputProps : {} ) }
          />
        <InputGroupAddon addonType="append" className="clickable" onClick={ () => setShown(!shown) }>
          <InputGroupText>
            <i className={"mt-auto mb-auto " + ( !shown ? 'fa fa-eye' : 'fa fa-eye-slash' )}/>
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
    </FormGroup>
  )
}