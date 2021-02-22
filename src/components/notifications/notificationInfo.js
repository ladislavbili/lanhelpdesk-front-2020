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
    <div>
      <div className="commandbar"></div>
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
        <div>
          <Label className="m-r-5">User:</Label>
          {` ${notification.fromUser.fullName}`}
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
        <div className="clickable" onClick={() => history.push(`/helpdesk/taskList/i/all/${notification.task.id}`) }>
          <Label className="m-r-5">Task:</Label>
          {`${notification.task.id}:${notification.task.title}`}
        </div>
        <button className="btn btn-link" onClick={() => {}}>
          Cancel notifications
        </button>
      </div>
    </div>
  );
}