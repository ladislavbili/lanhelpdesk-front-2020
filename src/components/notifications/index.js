import React from 'react';
import {
  useMutation,
  useQuery,
  useApolloClient
} from "@apollo/client";
import {
  ListGroupItem,
  Label
} from 'reactstrap';
import Select from 'react-select';
import classnames from 'classnames';
import Loading from 'components/loading';
import {
  pickSelectStyle
} from 'configs/components/select';
import NotificationInfo from './notificationInfo';

import {
  timestampToString
} from 'helperFunctions';

import {
  GET_USER_NOTIFICATIONS,
  SET_USER_NOTIFICATION_READ,
  SET_ALL_USER_NOTIFICATIONS_READ,
  DELETE_ALL_USER_NOTIFICATIONS,
  DELETE_SELECTED_USER_NOTIFICATIONS,
  GET_USER_NOTIFICATIONS_COUNT,
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
    history
  } = props;

  const {
    data: notificationsData,
    loading: notificationsLoading,
  } = useQuery( GET_USER_NOTIFICATIONS );

  const {
    data: notificationCountData,
    loading: notificationCountLoading
  } = useQuery( GET_USER_NOTIFICATIONS_COUNT );

  const [ setUserNotificationRead ] = useMutation( SET_USER_NOTIFICATION_READ );
  const [ setAllUserNotificationsRead ] = useMutation( SET_ALL_USER_NOTIFICATIONS_READ );
  const [ deleteAllUserNotifications ] = useMutation( DELETE_ALL_USER_NOTIFICATIONS );
  const [ deleteSelectedUserNotifications ] = useMutation( DELETE_SELECTED_USER_NOTIFICATIONS );


  const [ searchFilter, setSearchFilter ] = React.useState( '' );
  const [ selectedNotificationID, setSelectedNotificationID ] = React.useState( null );
  const [ type, setType ] = React.useState( noTypeFilter );

  const client = useApolloClient();

  const writeDataToCache = ( newData ) => {
    client.writeQuery( {
      query: GET_USER_NOTIFICATIONS,
      data: {
        userNotifications: newData,
      }
    } );
  }

  const setNotificationReadFunc = ( notification ) => {
    setSelectedNotificationID( notification.id );

    if ( !notification.read ) {
      setUserNotificationRead( {
          variables: {
            id: notification.id,
            read: true,
          }
        } )
        .then( ( response ) => {
          const allNotifications = client.readQuery( {
              query: GET_USER_NOTIFICATIONS
            } )
            .userNotifications;
          const newData = allNotifications.map( originalNotification => originalNotification.id !== notification.id ? ( {
            ...originalNotification
          } ) : ( {
            ...originalNotification,
            read: true
          } ) );
          writeDataToCache( newData );
          client.writeQuery( {
            query: GET_USER_NOTIFICATIONS_COUNT,
            data: {
              userNotificationsCount: notificationCountData.userNotificationsCount - 1,
            }
          } );
        } )
        .catch( ( err ) => {
          console.log( err.message );
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
        .then( ( response ) => {
          const userNotifications = client.readQuery( {
              query: GET_USER_NOTIFICATIONS
            } )
            .userNotifications;
          const newData = userNotifications.map( notification => ( {
            ...notification,
            read: true
          } ) );
          writeDataToCache( newData );
          client.writeQuery( {
            query: GET_USER_NOTIFICATIONS_COUNT,
            data: {
              userNotificationsCount: 0,
            }
          } );
        } )
        .catch( ( err ) => {
          console.log( err.message );
        } );
    }
  }

  const deleteAll = () => {
    if ( window.confirm( 'Ste si istý že chcete všetky správy vymazať?' ) ) {
      deleteAllUserNotifications()
        .then( ( response ) => {
          writeDataToCache( [] );
          setSelectedNotificationID( null );
          client.writeQuery( {
            query: GET_USER_NOTIFICATIONS_COUNT,
            data: {
              userNotificationsCount: 0,
            }
          } );
        } )
        .catch( ( err ) => {
          console.log( err.message );
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
        .then( ( response ) => {
          const allNotifications = client.readQuery( {
              query: GET_USER_NOTIFICATIONS
            } )
            .userNotifications;
          const newData = allNotifications.filter( notification => !notification.read );
          writeDataToCache( newData );
          setSelectedNotificationID( null );
        } )
        .catch( ( err ) => {
          console.log( err.message );
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
                  {
                    notifications.map((notification) =>
                    <li
                      key={notification.id}
                      className={classnames({ 'notification-read': notification.read,
                        'notification-not-read': !notification.read,
                        'sidebar-item-active': selectedNotificationID === notification.id },
                        "clickable")}
                        onClick={() => setNotificationReadFunc(notification)}
                        >
                        <div className={(selectedNotificationID === notification.id ? "text-highlight":"")}>
                          <i className={classnames({ 'far fa-envelope-open': notification.read, 'fas fa-envelope': !notification.read })} />
                          {`${notification.task.id}:${notification.task.title}`}
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
          {
            selectedNotificationID !== null &&
            <NotificationInfo notification={ notifications.find((notification) => notification.id === selectedNotificationID )} history={history} />
          }
          {
            selectedNotificationID === null &&
            <div className="fit-with-header" style={{backgroundColor: "white"}}></div>
          }
        </div>
    </div>
  );
}