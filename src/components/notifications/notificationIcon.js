import React from 'react';
import {
  useQuery,
  useMutation
} from "@apollo/client";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
import classnames from 'classnames';
import Empty from '../Empty';
import {
  GET_USER_NOTIFICATIONS_COUNT,
  GET_USER_NOTIFICATIONS,
  SET_USER_NOTIFICATION_READ,
} from './queries';

export default function NotificationIcon( props ) {

  const {
    history,
    location
  } = props;

  const {
    data: userNotificationsCountData,
    loading: userNotificationsCountLoading
  } = useQuery( GET_USER_NOTIFICATIONS_COUNT );

  const {
    data: userNotificationsData,
    loading: userNotificationsLoading
  } = useQuery( GET_USER_NOTIFICATIONS, {
    variables: {
      limit: 5
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
      <Dropdown className="center-hor" isOpen={notificationsOpen} toggle={() => setNotificationsOpen(!notificationsOpen)}>
        <DropdownToggle className="header-dropdown">
          <i className="header-icon-with-text fa fa fa-envelope"/>
          <span className="m-l-8 header-icon-text clickable">{count}</span>
        </DropdownToggle>
        <DropdownMenu right>
          <DropdownItem header={true}>Notifications</DropdownItem>
          <DropdownItem divider={true}/> {notifications.length === 0 && <DropdownItem>You have no notifications!</DropdownItem>}
            { notifications.map( (notification) =>
              <DropdownItem
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
                      }).error((err) => {
                        console.log(err);
                      })
                  }else{
                    history.push(`${location}/notifications/${notification.id}` )
                  }
                }}
                className={classnames({
                  'notification-read-small': notification.read,
                  'notification-not-read-small': !notification.read
                })}
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
                  {notification.task.id}: {notification.task.title}
                </div>
              </DropdownItem>
            )
          }
          <DropdownItem divider={true}/>
          <DropdownItem onClick={() => history.push('/helpdesk/notifications/')}>
            <span style={{ fontWeight: 'bold' }} >Go to notifications</span>
            { (count && count > 5) ? <span className='p-l-3'> ` ${count - 5} more unread...`</span> : null }
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </Empty>
  )
}