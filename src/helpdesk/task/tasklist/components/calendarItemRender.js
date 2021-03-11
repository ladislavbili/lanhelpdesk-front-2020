import React from 'react';

export default function CalendarItemRender( props ) {
  const {
    task,
    showEvent,
  } = props;

  return (
    <div style={ showEvent ? { backgroundColor:'#eaf6ff', borderRadius:5 } : {} }>
      <p className="m-0">
        {showEvent && <span className="label-event">
          Event
        </span>}
        <span className="label-info" style={{backgroundColor:task.status && task.status.color?task.status.color:'white'}}>
          {task.status?task.status.title:'Neznámy status'}
        </span>
        <span className="attribute-label m-l-3">#{task.id} | {task.title}</span>
      </p>
    </div>
  )
}