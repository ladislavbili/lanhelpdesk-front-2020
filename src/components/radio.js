import React from 'react';
import {
  FormGroup,
  Input,
  Label
} from 'reactstrap';

export default function RadioButtons( props ) {

  const {
    name,
    options,
    disabled,
    onChange,
    className,
  } = props;

  return (
    <FormGroup tag="fieldset" className={`bkg-white ${ className ? className : '' }`} onChange={onChange}>
      { options.map((option) => (
        <FormGroup check className="p-b-10 p-t-10 clickable" key={option.key}>
          <Input
            type="radio"
            checked={option.value}
            disabled={disabled}
            onChange={ () => {} }
            className="center-hor"
            name={name}
            id={option.key}
            />
          <Label check className="center-hor m-l-5 clickable noselect" htmlFor={option.key} >
            {option.label}
          </Label>
        </FormGroup>
      ) )}
    </FormGroup>
  );
}