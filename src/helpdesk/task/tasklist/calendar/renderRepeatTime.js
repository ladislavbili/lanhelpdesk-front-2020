import React from 'react';
import Empty from 'components/Empty';

export default function CalendarRenderRepeatTime( repeatTime, time ) {
  const task = repeatTime.task;
  const repeat = repeatTime.repeat;
  const repeatTemplate = repeat.repeatTemplate;

  return (
    <div id={`calendar-repeatTime-${repeatTime.id}-${time}`}>
      { task &&
        <p className="m-0" style={{ color: 'white' }}>
          <span className="m-l-3" style={{lineHeight: 1.2 }}>{`${ task.title } | #${ task.id }`}</span>
        </p>
      }
      { !task &&
        <Empty>
          <p className="m-l-3 m-b-3" style={{ color: 'white' }}>
            {`Repeat: ${ repeatTemplate.title }`}
          </p>
          <p className="m-l-3" style={{ color: 'white' }}>
            {`Every ${ repeat.repeatEvery } ${ repeat.repeatInterval }`}
          </p>
        </Empty>
      }
    </div>
  )
}