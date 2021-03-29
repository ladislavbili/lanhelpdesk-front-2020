import React from 'react';

export default function TaskStackItemRender( props ) {
  const {
    task,
    showEvent,
  } = props;

  return (
    <div className="stack-item" style={{ backgroundColor: task.status?.color ? task.status.color : 'white' }}>
        {showEvent && <span className="label-event">
          Event
        </span>}
        <span className="attribute-label m-l-3">#{task.id} | <span style={{ color: task.status?.color ? 'white' : '#BDBDBD' }}>{task.title}</span></span>
    </div>
  )
}