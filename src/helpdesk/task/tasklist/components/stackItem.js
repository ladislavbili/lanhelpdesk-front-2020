import React from 'react';

export default function TaskStackItemRender( props ) {
  const {
    task,
    showEvent,
    setDraggedTask,
  } = props;
  return (
    <div
      className="stack-item clickable"
      style={{ backgroundColor: task.status ? task.status.color : 'white' }}
      draggable={task.rights.scheduledWrite}

      onDragStart={() => setDraggedTask(task) }
      >
      <span className="attribute-label m-l-3">
        {`#${task.id} | `}
        <span style={{ color: task.status?.color ? 'white' : '#BDBDBD' }}>
          {task.title}
        </span>
      </span>
      { !task.rights.scheduledWrite &&
        <div className="attribute-label m-l-3">
          Can't add to calendar
        </div>
      }
    </div>
  )
}