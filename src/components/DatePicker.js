import DatePicker from 'react-datepicker';
import createDateConfig from 'configs/components/datepicker';
import moment from 'moment';
import React from 'react';

export default function MomentDatePicker( props ) {
  const {
    onChange,
    selected,
    hideTime,
    minDate,
    maxDate,
    ...rest
  } = props;

  const config = {
    ...createDateConfig( !hideTime ),
    ...rest
  }

  return (
    <DatePicker
        {...config}
        selected = {
          selected ? ( selected.toDate() ) : null
        }
        minDate={ minDate ? minDate.toDate() : null }
        maxDate={ maxDate ? maxDate.toDate() : null }
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