import DatePicker from 'react-datepicker';
import datePickerConfig from 'configs/components/datepicker';
import datePickerNoTimeConfig from 'configs/components/datepickerNoTime';
import moment from 'moment';
import React from 'react';

export default function MomentDatePicker( props ) {
  const {
    onChange,
    selected,
    hideTime,
    ...rest
  } = props;

  const configToUse = ( hideTime ? datePickerNoTimeConfig : datePickerConfig );

  const config = {
    ...configToUse,
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