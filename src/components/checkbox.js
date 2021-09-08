import React from 'react';
import classnames from 'classnames';

export default function Checkbox( props ) {

  const {
    right,
    id,
    centerHor,
    centerVer,
    highlighted,
    className,
    style,
    labelClassName,
    label,
    addition,
    value,
    disabled,
    blocked,
    onChange,
  } = props;

  const [ ID ] = React.useState( Math.floor( Math.random() * 100000 ) );
  const name = `checkbox-${ID}`;

  return (
    <div className={`${ blocked ? 'checkbox-blocked-container' : 'checkbox-container' } ${ className ? className : null }`} style={style}>
      <input
        type="checkbox"
        className="checkbox-input"
        checked={ value || blocked === true }
        disabled={ disabled || blocked }
        onChange={ blocked ? () => {} : onChange }
        id={ id ? id : name }
        />
      <label
        htmlFor={ id ? id : name }
        className={classnames(
          {
            'center-hor': centerHor,
            'center-ver': centerVer,
            'checkbox-mark-grey': disabled && !blocked,
            'checkbox-blocked': blocked,
            'checkbox-mark': !highlighted,
            'checkbox-highlighted': highlighted,
            "clickable": !blocked,
          },
          labelClassName ? labelClassName : '',
          "noselect"
        )}
        />
      <label
        htmlFor={ id ? id : name }
        className={classnames(
          {
            'm-l-5': !right && label && label.length > 0,
            'm-r-5': right && label && label.length > 0,
            'm-0': label === null || label === undefined || label.length === 0,
            'center-hor': centerHor,
            'center-ver': centerVer,
            "clickable": !blocked,
          },
          labelClassName ? labelClassName : '',
          "noselect"
        )}
        >
        { label ? label : '' }
        { addition ? addition : "" }
      </label>
    </div>
  );
}