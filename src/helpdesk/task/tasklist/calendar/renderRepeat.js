import React from 'react';
import Empty from 'components/Empty';

export default function CalendarRenderRepeatTime( repeat, start ) {
  const repeatTime = repeat.repeatTime;
  const repeatTemplate = repeat.repeatTemplate;
  const task = repeatTime ? repeatTime.task : null;

  return (
    <div id={`calendar-repeat-${repeat.id}-${start}`}>
      { task &&
        <p className="m-0" style={{ color: 'white' }}>
          <i className="fa fa-sync-alt" />
          <span className="m-l-3" style={{lineHeight: 1.2 }}>{`${ task.title } | #${ task.id }`}</span>
        </p>
      }
      { !task &&
        <Empty>
          <p className="m-l-3 m-b-3" style={{ color: 'white' }}>
            <i className="fa fa-sync-alt" />
            {`${ repeatTemplate.title }`}
          </p>
          <p className="m-l-3" style={{ color: 'white' }}>
            {`Every ${ repeat.repeatEvery } ${ repeat.repeatInterval }`}
          </p>
        </Empty>
      }
    </div>
  )
}