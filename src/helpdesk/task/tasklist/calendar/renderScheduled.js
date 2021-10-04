import React from 'react';
import Checkbox from 'components/checkbox';

import {
  getDateClock,
} from 'helperFunctions';

export default function CalendarRenderScheduled( task, start, end, canEdit, done, update ) {

  return (
    <div>
      <div className="m-0">
        <Checkbox
          className = "p-l-0 min-width-20 m-t-5 m-l-5"
          value = { done }
          disableLabel
          disabled={ !canEdit }
          onChange={ () => {
            update(!done);
          } }
          labelClassName="color-white text-normal"
          label={`${ task.title } | #${ task.id }`}
          />
      </div>
      { start && end &&
        <div className="m-l-3 m-t-5">
          { `${getDateClock(start)} - ${getDateClock(end)}` }
        </div>
      }
    </div>
  )
}