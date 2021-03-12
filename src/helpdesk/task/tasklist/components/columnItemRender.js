import React from 'react';
import {
  timestampToString
} from 'helperFunctions';

export default function ColumnItemRender( props ) {
  const {
    task
  } = props;
  return (
    <li>
      <div className="taskCol-title">
        <span className="attribute-label">#{task.id} | </span> {task.title}
        </div>
        <div className="taskCol-body">
          <p className="pull-right m-0">
            <span className="label-info" style={{backgroundColor:task.status && task.status.color?task.status.color:'white'}}>
              {task.status?task.status.title:'Neznámy status'}
            </span>
          </p>
          <p>
            <span>
              <span className="attribute-label">Requested by: </span>
              {task.requester?(" " + task.requester.fullName):' Neznámy používateľ '}
            </span>
          </p>
          <p className="pull-right">
            <span>
              <span className="attribute-label">	<i className="fa fa-star-of-life" /> </span>
              {task.createdAt?timestampToString(task.createdAt):'None'}
            </span>
          </p>
          <p>
            <span>
              <span className="attribute-label">From </span>
              {task.company ? task.company.title : " Unknown"}
            </span>
          </p>

          <p className="pull-right">
            <span>
              <i
                className="fas fa-exclamation-triangle attribute-label m-r-3"
                />
              {task.deadline?timestampToString(task.deadline):'No deadline'}
            </span>
          </p>
          <p >
            <span style={{textOverflow: 'ellipsis'}}>
              <span className="attribute-label">Assigned: </span>
              {task.assignedTo?task.assignedTo.reduce((total,user)=>total+=user.fullName+', ','').slice(0,-2):'Neznámy používateľ'}</span>
          </p>
        </div>

        { task.tags.length > 0 &&
          <div className="taskCol-tags">
            {task.tags.map((tag)=>
              <span key={tag.id} className="label-info m-r-5" style={{backgroundColor: tag.color, color: "white"}}>{tag.title}</span>
            )}
          </div>
        }
      </li>
  )
}