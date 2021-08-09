import React from 'react';
import Checkbox from 'components/checkbox';

import {
  getDateClock,
} from 'helperFunctions';

export default function CalendarRenderScheduled( task, start, end, canEdit, done, update ) {

  return (
    <div>
      <p className="m-0">
        <Checkbox
          className = "p-l-0 mw-20 m-t-5 m-l-5"
          value = { done }
          disabled={ !canEdit }
          onChange={ () => {
            update(!done);
          } }
          labelClassName="white-text normal-weight"
          label={`${ task.title } | #${ task.id }`}
          />
      </p>
      { start && end &&
        <p className="m-l-3 m-t-5">
          { `${getDateClock(start)} - ${getDateClock(end)}` }
        </p>
      }
    </div>
  )
}