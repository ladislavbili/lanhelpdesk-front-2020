import React from 'react';
import {
  getDateClock,
} from 'helperFunctions';

export default function CalendarRenderScheduled( task, start, end ) {

  return (
    <div>
      <p className="m-0" style={{ color: 'white' }}>
        <span className="m-l-3" style={{lineHeight: 1.2 }}>{`${ task.title } | #${ task.id }`}</span>
      </p>
      { start && end &&
        <p className="m-l-3 m-t-5">
          { `${getDateClock(start)} - ${getDateClock(end)}` }
        </p>
      }
    </div>
  )
}