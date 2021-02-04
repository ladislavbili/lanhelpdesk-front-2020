import DatePicker from 'react-datepicker';
import datePickerConfig from 'configs/components/datepicker';
import moment from 'moment';
import React from 'react';

export default function MomentDatePicker( props ) {
  const {
    onChange,
    selected,
    ...rest
  } = props;
  const config = {
    ...datePickerConfig,
    ...rest
  }
  return (
    <DatePicker
        {...config}
        value = {
          selected ? (config.showTimeSelect ? selected.format( 'DD.MM.YYYY HH:mm' ) : selected.format( 'DD.MM.YYYY' ) ) : null
        }
        onChange = {( date ) => {
          if ( onChange ) {
            onChange( moment( date ) )
          } else {
            console.log( moment( date ) );
          }
        }}
        />
  )
}