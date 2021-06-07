import React from 'react';
import {
  useMutation,
  useQuery,
  useSubscription,
} from "@apollo/client";
import {
  ListGroupItem,
  Label
} from 'reactstrap';
import Select from 'react-select';
import classnames from 'classnames';
import Loading from 'components/loading';
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import {
  pickSelectStyle
} from 'configs/components/select';
import NotificationInfo from './notificationInfo';

import {
  timestampToString,
  getLocation,
} from 'helperFunctions';

import {
  GET_USER_NOTIFICATIONS,
  SET_USER_NOTIFICATION_READ,
  SET_ALL_USER_NOTIFICATIONS_READ,
  DELETE_ALL_USER_NOTIFICATIONS,
  DELETE_SELECTED_USER_NOTIFICATIONS,
  USER_NOTIFICATIONS_SUBSCRIPTION,
} from './queries';

const noTypeFilter = {
  value: null,
  label: 'All types'
};
const readTypeFilter = {
  value: 'read',
  label: 'Read'
};
const unreadTypeFilter = {
  value: 'unread',
  label: 'Unread'
};

export default function NotificationList( props ) {
  const {
    history,
    match
  } = props;

  const notificationID = match.params.notificationID ? parseInt( match.params.notificationID ) : null;
  const URL = getLocation( history );
  const {
    data: notificationsData,
    loading: notificationsLoading,
    refetch: notificationsRefetch,
  } = useQuery( GET_USER_NOTIFICATIONS, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( USER_NOTIFICATIONS_SUBSCRIPTION, {
    onSubscriptionData: () => {
      notificationsRefetch();
    }
  } );

  const [ setUserNotificationRead ] = useMutation( SET_USER_NOTIFICATION_READ );
  const [ setAllUserNotificationsRead ] = useMutation( SET_ALL_USER_NOTIFICATIONS_READ );
  const [ deleteAllUserNotifications ] = useMutation( DELETE_ALL_USER_NOTIFICATIONS );
  const [ deleteSelectedUserNotifications ] = useMutation( DELETE_SELECTED_USER_NOTIFICATIONS );


  const [ searchFilter, setSearchFilter ] = React.useState( '' );
  const [ type, setType ] = React.useState( noTypeFilter );

  const setNotificationReadFunc = ( notification ) => {
    if ( !notification.read ) {
      setUserNotificationRead( {
          variables: {
            id: notification.id,
            read: true,
          }
        } )
        .catch( ( err ) => {
          addLocalError( err );
        } );
    }
  }

  const markAllAsRead = () => {
    if ( window.confirm( 'Ste si istý že chcete všetky správy označiť ako prečítané?' ) ) {
      setAllUserNotificationsRead( {
          variables: {
            read: true,
          }
        } )
        .catch( ( err ) => {
          addLocalError( err );
        } );
    }
  }

  const deleteAll = () => {
    if ( window.confirm( 'Ste si istý že chcete všetky správy vymazať?' ) ) {
      deleteAllUserNotifications()
        .catch( ( err ) => {
          addLocalError( err );
        } );
    }
  }

  const deleteRead = () => {
    if ( window.confirm( 'Ste si istý že chcete všetky prečítané správy vymazať?' ) ) {
      const userNotifications = notificationsData.userNotifications.filter( notification => notification.read )
        .map( notification => notification.id );
      deleteSelectedUserNotifications( {
          variables: {
            ids: userNotifications,
          }
        } )
        .catch( ( err ) => {
          addLocalError( err );
        } );
    }
  }

  if ( notificationsLoading ) {
    return <Loading />
  }


  const filterNotifications = () => {
    let search = searchFilter.toLowerCase();
    return notificationsData.userNotifications.filter( ( notification ) => (
        (
          type.value === null ||
          ( type.value === 'read' && notification.read ) ||
          ( type.value === 'unread' && !notification.read )
        ) && (
          ( timestampToString( notification.createdAt )
            .includes( search ) ) ||
          ( notification.message && notification.message.toLowerCase()
            .includes( search ) ) ||
          ( notification.task && notification.task.title.toLowerCase()
            .includes( search ) ) ||
          ( notification.task && notification.task.id.toLowerCase()
            .includes( search ) )
        )
      ) )
      .sort( ( notification1, notification2 ) => notification1.createdAt > notification2.createdAt ? -1 : 1 )
  }

  const getTypes = () => {
    let typeFilter = [ noTypeFilter, readTypeFilter, unreadTypeFilter ];
    return typeFilter;
  }

  const notifications = filterNotifications();
  return (
    <div className="lanwiki-content row">
      <div className="col-lg-4">

        <div className="scroll-visible fit-with-header lanwiki-list">
          <h1>
            Notifications
          </h1>

          <div className="row">
            <div className="search-row" style={{width: "60%"}}>
              <div className="search">
                <input
                  type="text"
                  className="form-control search-text"
                  value={searchFilter}
                  onChange={(e) => setSearchFilter( e.target.value )}
                  placeholder="Search"
                  />
                <button className="search-btn" type="button">
                  <i className="fa fa-search" />
                </button>
              </div>
            </div>
            <span className="center-hor ml-auto" style={{width: "30%", backgroundColor: "white"}}>
              <Select
                value={type}
                onChange={(type) => setType( type ) }
                options={getTypes()}
                styles={pickSelectStyle([ 'invisible', ])}
                />
            </span>
          </div>

          <div>
            <button
              type="button"
              className="btn-link btn-distance"
              onClick={markAllAsRead}
              disabled={notifications.every((notification)=>notification.read)}>
              Označit všetky ako prečítané
            </button>
            <button
              type="button"
              className="btn-link btn-distance"
              onClick={deleteAll}
              disabled={notifications.length === 0}>
              Vymazať všetky
            </button>
            <button
              type="button"
              className="btn-link"
              onClick={deleteRead}
              disabled={ !notifications.some( (notification) => notification.read) }>
              Vymazať prečítané
            </button>
          </div>
          <div>
            { notifications.map((notification) =>
              <li
                key={notification.id}
                className={classnames({ 'notification-read': notification.read,
                  'notification-not-read': !notification.read,
                  'sidebar-item-active': notificationID === notification.id },
                  "clickable")}
                  onClick={() => {
                    setNotificationReadFunc(notification);
                    history.push(`${URL}/notifications/${notification.id}`);
                   }}
                  >
                  <div className={(notificationID === notification.id ? "text-highlight":"")}>
                    <i className={classnames({ 'far fa-envelope-open': notification.read, 'fas fa-envelope': !notification.read })} />
                    {notification.task ? `${notification.task.id}:${notification.task.title}` : `Task no longer exists.`}
                    <div className="row">
                      <div>
                        <Label className="p-r-5">User:</Label>
                        {notification.fromUser ? notification.fromUser.fullName : "no user"}
                      </div>
                      <div className="ml-auto">
                        {timestampToString(parseInt(notification.createdAt))}
                      </div>
                    </div>
                    <Label className="p-r-5">Subject:</Label>
                    {notification.subject}
                  </div>
                </li>
              )
            }
            {
              notifications.length === 0 &&
              <ListGroupItem>There are no notifications!</ListGroupItem>
            }
          </div>

        </div>
      </div>
      <div className="col-lg-8">
        { notificationID !== null && notifications.some((notification) => notification.id === notificationID ) &&
          <NotificationInfo notification={ notifications.find((notification) => notification.id === notificationID )} history={history} />
        }
        { notificationID === null &&
          <div className="fit-with-header" style={{backgroundColor: "white"}}></div>
        }
      </div>
    </div>
  );
}