import React from 'react';
import classnames from 'classnames';

export default function Checkbox( props ) {

  const {
    right,
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
    onChange,
  } = props;

  const [ ID ] = React.useState( Math.floor( Math.random() * 100000 ) );
  const name = `checkbox-${ID}`;

  return (
    <div className={`checkbox-container ${ className ? className : null }`} style={style}>
      <input
        type="checkbox"
        className="checkbox-input"
        checked={ value }
        disabled={ disabled }
        onChange={ onChange }
        id={ name }
        />
      <label
        htmlFor={ name }
        className={classnames(
          {
            'center-hor': centerHor,
            'center-ver': centerVer,
            'checkbox-mark-grey': disabled,
            'checkbox-mark': !highlighted,
            'checkbox-highlighted': highlighted
          },
          labelClassName ? labelClassName : '',
          "clickable",
          "noselect"
        )}
        />
      <label
        htmlFor={ name }
        className={classnames(
          {
            'm-l-5': !right,
            'm-r-5': right,
            'center-hor': centerHor,
            'center-ver': centerVer,
          },
          labelClassName ? labelClassName : '',
          "clickable",
          "noselect"
        )}
        >
        { label ? label : '' }
        { addition ? addition : "" }
      </label>
    </div>
  );
}