import React from 'react';
import classnames from 'classnames';
import renderScheduled from './renderScheduled';

import {
  lightenDarkenColor,
} from 'helperFunctions';

export default function RenderTaskStackItemRender( props ) {
  const {
    task,
    showEvent,
    setDraggedTask,
    path,
    history,
    scheduledUserId,
  } = props;
  const cantBeAdded = ( !task.rights.assignedWrite || !task.usersWithRights.some( ( userWithRights ) => userWithRights.user.id === scheduledUserId && userWithRights.assignable ) );

  const backgroundColor = (
    !task.status ?
    'white' :
    ( cantBeAdded ? lightenDarkenColor( 0.3, task.status.color ) : task.status.color )
  );

  const secondaryTextColor = cantBeAdded ? lightenDarkenColor( -0.5, '#BDBDBD' ) : '#BDBDBD';

  return (
    <div
      className={classnames(
        {
          'not-allowed': cantBeAdded,
          'grabbable': !cantBeAdded
        },
        "stack-item"
      )}
      style={{ backgroundColor }}
      draggable={!cantBeAdded}
      onDragStart={() => {
        setDraggedTask({
          task,
          title: renderScheduled(task),
          propsGetter: () => {
            const status = task.status;
            if ( status ) {
              return {
                className: "",
                style: {
                  backgroundColor: status.color,
                  borderColor: lightenDarkenColor( -0.3, status.color )
                }
              };
            }
            return {
              className: "",
              style: {}
            };
          },
         })
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
      <span className="m-l-3" style={{ color: secondaryTextColor }}>
        {`#${task.id} | `}
        <span style={{ color: task.status ? 'white' : secondaryTextColor }}>
          {task.title}
        </span>
      </span>
      { cantBeAdded &&
        <div className="m-l-3" style={{ color: secondaryTextColor }} >
          User can't be assigned!
        </div>
      }
    </div>
  )
}