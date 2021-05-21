import React from 'react';
import {
  Label
} from 'reactstrap';
import {
  timestampToString,
  getLocation,
} from 'helperFunctions';

export default function NotificationInfo( props ) {
  const {
    history,
    notification
  } = props;

  return (
    <div style={{backgroundColor: "white"}}>
      <div className="p-20 scroll-visible fit-with-header">
        <div>
          <Label className="m-r-5">User:</Label>
          {` ${notification.fromUser ? notification.fromUser.fullName : 'System message'}`}
        </div>
        <div>
          <Label className="m-r-5">Subject:</Label>
          {notification.subject}
        </div>
        <div>
          <Label className="m-r-5">Body:</Label>
          <div
            className="m-l-10 m-b-15 font-13"
            dangerouslySetInnerHTML={{__html: notification.message.replace(/(?:\r\n|\r|\n)/g, '<br>') }}
            />
        </div>
        <div
          className="clickable"
          onClick={() => {
            if(notification.task){
              history.push(`/helpdesk/taskList/i/all/${notification.task.id}`);
            }
           } }
             >
          <Label className="m-r-5">Task:</Label>
          {notification.task ? `${notification.task.id}:${notification.task.title}` : `Task no longer exists.`}
        </div>
        <button className="btn-link" onClick={() => {}}>
          Cancel notifications
        </button>
      </div>
    </div>
  );
}