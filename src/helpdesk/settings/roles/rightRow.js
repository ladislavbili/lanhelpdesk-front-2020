import React from 'react';
import Checkbox from '../../../components/checkbox';

export default function RightRow( props ) {
  const {
    onChange,
    label,
    disabled,
    value
  } = props;

  return (
    <tr
      onClick={() => {
        onChange(!value)
      }}
      >
      <td>{label}</td>
      <td>
        <Checkbox
          className = "m-b-5 p-l-0"
          centerVer
          centerHor
          highlighted
          disabled={disabled}
          value = { value }
          label = ""
          onChange={ (e) => {} }
          />
      </td>
    </tr>
  );
}