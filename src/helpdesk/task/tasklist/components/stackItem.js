import React from 'react';
import classnames from 'classnames';

export default function TaskStackItemRender( props ) {
  const {
    task,
    showEvent,
    setDraggedTask,
    path,
    history,
    renderScheduled,
    scheduledUserId,
  } = props;
  const cantBeAdded = ( !task.rights.assignedWrite || !task.usersWithRights.some( ( userWithRights ) => userWithRights.user.id === scheduledUserId && userWithRights.assignable ) );

  return (
    <div
      className={classnames(
        {
          'not-allowed': cantBeAdded,
          'grabbable': !cantBeAdded
        },
        "stack-item"
      )}
      style={{ backgroundColor: task.status ? task.status.color : 'white' }}
      draggable={!cantBeAdded}
      onDragStart={() => {
        setDraggedTask({ task, title: renderScheduled(task) })
      }}
      >
      <button
        className="btn btn-link"
        style={{color: 'white'}}
        onClick={() => {
          history.push(`${ path }/${ task.id }`);
        }}
        >
        <i
          className="fa fa-external-link-alt"
          />
      </button>
      <span className="attribute-label m-l-3">
        {`#${task.id} | `}
        <span style={{ color: task.status?.color ? 'white' : '#BDBDBD' }}>
          {task.title}
        </span>
      </span>
      { cantBeAdded &&
        <div className="attribute-label m-l-3">
          Can't add to calendar to current user
        </div>
      }
    </div>
  )
}