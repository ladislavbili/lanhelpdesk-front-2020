import React from 'react';
import {
  Label
} from 'reactstrap';
import {
  timestampToString,
  getLocation,
} from 'helperFunctions';
import {
  useTranslation
} from "react-i18next";

export default function NotificationInfo( props ) {
  const {
    history,
    notification
  } = props;

  const {
    t
  } = useTranslation();

  return (
    <div style={{backgroundColor: "white"}}>
      <div className="p-20 scroll-visible fit-with-header">
        <div>
          <Label className="m-r-5">{t('user')}:</Label>
          {` ${notification.fromUser ? notification.fromUser.fullName : t('systemMessage')}`}
        </div>
        <div>
          <Label className="m-r-5">{t('subject')}:</Label>
          {notification.subject}
        </div>
        <div>
          <Label className="m-r-5">{t('body')}:</Label>
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
          <Label className="m-r-5">{t('task')}:</Label>
          {notification.task ? `${notification.task.id}: ${notification.task.title}` : t('noTask')}
        </div>
        <button className="btn-link" onClick={() => {}}>
          {t('cancelNotifications')} - WIP
        </button>
      </div>
    </div>
  );
}