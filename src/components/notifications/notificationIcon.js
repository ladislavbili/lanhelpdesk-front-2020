import React from 'react';
import {
  useQuery,
  useMutation,
  useSubscription,
} from "@apollo/client";
import GeneralPopover from 'components/generalPopover';
import classnames from 'classnames';
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import {
  useTranslation
} from "react-i18next";
import Empty from '../Empty';
import {
  GET_USER_NOTIFICATIONS_COUNT,
  GET_USER_NOTIFICATIONS,
  SET_USER_NOTIFICATION_READ,
  USER_NOTIFICATIONS_SUBSCRIPTION,
  USER_NOTIFICATIONS_COUNT_SUBSCRIPTION,
} from './queries';

export default function NotificationIcon( props ) {

  const {
    history,
    location
  } = props;

  const {
    t
  } = useTranslation();

  const {
    data: userNotificationsCountData,
    loading: userNotificationsCountLoading,
    refetch: userNotificationsCountRefetch,
  } = useQuery( GET_USER_NOTIFICATIONS_COUNT );

  const {
    data: userNotificationsData,
    loading: userNotificationsLoading,
    refetch: userNotificationsRefetch,
  } = useQuery( GET_USER_NOTIFICATIONS, {
    variables: {
      limit: 5
    }
  } );

  useSubscription( USER_NOTIFICATIONS_COUNT_SUBSCRIPTION, {
    onSubscriptionData: () => {
      userNotificationsCountRefetch();
    }
  } );

  useSubscription( USER_NOTIFICATIONS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      userNotificationsRefetch();
    }
  } );

  const [ setUserNotificationRead ] = useMutation( SET_USER_NOTIFICATION_READ );

  const [ notificationsOpen, setNotificationsOpen ] = React.useState( false );

  if (
    userNotificationsCountLoading ||
    userNotificationsLoading
  ) {
    return null;
  }

  const count = userNotificationsCountData.userNotificationsCount;
  const notifications = userNotificationsData.userNotifications;

  return (
    <Empty>
      <div className="header-icon center-hor header-with-text clickable" id="page-header-notifications" onClick={() => setNotificationsOpen(!notificationsOpen)}>
        <i className="fa fa-envelope header-icon-with-text m-l-5"/>
        <span className="m-l-2 header-icon-text clickable">{count > 99 ? '99+' : count }</span>
      </div>
      <GeneralPopover
        placement="bottom-start"
        className="overflow-auto max-height-600"
        headerClassName="header-font custom-popover-header"
        target="page-header-notifications"
        header={t('notifications')}
        useLegacy
        reset={() => {}}
        submit={() => {}}
        open={ notificationsOpen }
        closeOnly
        hideButtons
        close={() => setNotificationsOpen(false)}
        >
        {notifications.length === 0 && <div className="segoe-semi-text custom-popover-item">{t('noNotifications')}</div>}
        { notifications.map( (notification) =>
          <div
            key={notification.id}
            onClick={ () => {
              if (!notification.read) {
                setUserNotificationRead( {
                  variables: {
                    id: notification.id,
                    read: true,
                  }
                } )
                .then( ( response ) => {
                  history.push(`${location}/notifications/${notification.id}` )
                  setNotificationsOpen(false);
                }).catch((err) => {
                  addLocalError(err);
                })
              }else{
                history.push(`${location}/notifications/${notification.id}` )
                setNotificationsOpen(false);
              }
            }}
            className={classnames({
              'notification-read-small': notification.read,
              'notification-not-read-small': !notification.read,
            }, 'segoe-semi-text clickable custom-popover-item')}
            >
            <div>
              <i className={classnames({
                  'far fa-envelope-open': notification.read,
                  'fas fa-envelope': !notification.read
                })}
                />
              {notification.subject}
            </div>
            <div style={{
                overflowX: 'hidden',
                maxWidth: 250
              }}
              >
              {notification.task ? `${notification.task.id}:${notification.task.title}` : t('noTask')}
            </div>
          </div>
        )}
        <hr/>
        <div onClick={() => history.push('/helpdesk/notifications/')} className="segoe-semi-text clickable custom-popover-item">
          <span style={{ fontWeight: 'bold' }} >{t('goToNotifications')}</span>
          { (count && count > 5) ? <span className='p-l-3'>{` ${count - 5} ${t('moreUnread')}...`}</span> : null }
        </div>
      </GeneralPopover>
    </Empty>
  )
}