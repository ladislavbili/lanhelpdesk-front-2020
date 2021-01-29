import React from 'react';
import {
  useQuery,
  useMutation,
  useApolloClient,
} from "@apollo/client";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import {
  Link
} from 'react-router-dom';
import {
  setIsLoggedIn
} from 'apollo/localSchema/actions';
import ErrorIcon from 'components/errorMessages/errorIcon'
import classnames from 'classnames';

import {
  getLocation,
} from 'helperFunctions';


import UserProfile from 'helpdesk/settings/users/userProfile';

import {
  GET_MY_DATA,
  LOGOUT_USER
} from './queries';

export default function PageHeader( props ) {
  //data & queries
  const {
    history,
    setLayout,
    settings,
    showLayoutSwitch,
    dndLayout,
    calendarLayout
  } = props;

  const {
    data: myData
  } = useQuery( GET_MY_DATA );

  const [ logoutUser ] = useMutation( LOGOUT_USER );

  const client = useApolloClient();
  //state
  const [ notificationsOpen, setNotificationsOpen ] = React.useState( false );
  const [ layoutOpen, setLayoutOpen ] = React.useState( false );
  const [ settingsOpen, setSettingsOpen ] = React.useState( false );
  const [ unreadNotifications /*, setUnreadNotifications */ ] = React.useState( [] );
  const [ modalUserProfileOpen, setModalUserProfileOpen ] = React.useState( false );

  const currentUser = myData ? myData.getMyData : {};
  const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};


  const getLayoutIcon = () => {
    switch ( currentUser.tasklistLayout ) {
      case 0:
        return "fa-columns";
      case 1:
        return "fa-list";
      case 2:
        return "fa-map";
      case 3:
        return "fa-calendar-alt";
      default:
        return "fa-cog";
    }
  }



  const processNotifications = () => {
    return [];
    /*
    return data.getMyData.notifications.map((notification) => {
      let task = props.tasks.find((task) => task.id === notification.task);
      return {
        ...notification,
        task: task !== undefined
          ? task
          : {
            id: notification.task,
            title: 'Unknown task'
          }
      }
    })*/
  }

  const URL = getLocation( history );

  return (
    <div className="page-header flex">
      <div className="d-flex full-height p-l-10">
        <div className="center-hor">
          <Link
            to={{ pathname: `/helpdesk/taskList/i/all` }}
            className={
              "header-link" +
              (
                URL.includes("helpdesk/taskList") ?
                " header-link-active" :
                ""
              )
            }
            >
            Úlohy
          </Link>
          {
            accessRights.vykazy &&
            <Link
              to={{ pathname: `/reports` }}
              className={
                "header-link" +
                (
                  URL.includes("reports") ?
                  " header-link-active" :
                  ""
                )
              }
              >
              Vykazy
            </Link>
          }
        </div>
        <div className="ml-auto center-hor row">
          <div className=" header-icon center-hor clickable" onClick={() => setModalUserProfileOpen(true)}>{`${currentUser.name} ${currentUser.surname}`} <i className="fas fa-user m-l-5"/></div>

          { accessRights.viewErrors &&
            <ErrorIcon history={history} location={URL} />
          }

          {
            showLayoutSwitch &&
            <Dropdown className="center-hor"
              isOpen={layoutOpen}
              toggle={() => setLayoutOpen(!layoutOpen)}
              >
              <DropdownToggle className="header-dropdown">
                <i className={"header-icon fa " + getLayoutIcon()}/>
              </DropdownToggle>
              <DropdownMenu right>
                <div className="btn-group-vertical" data-toggle="buttons">
                  <label className={classnames({'active':currentUser.tasklistLayout === 0}, "btn btn-link btn-outline-blue waves-effect waves-light")}>
                    <input type="radio" name="options" onChange={() => setLayout(0)} checked={currentUser.tasklistLayout === 0}/>
                    <i className="fa fa-columns"/>
                  </label>
                  <label className={classnames({'active':currentUser.tasklistLayout === 1}, "btn btn-link btn-outline-blue waves-effect waves-light")}>
                    <input type="radio" name="options" checked={currentUser.tasklistLayout === 1} onChange={() => setLayout(1)}/>
                    <i className="fa fa-list"/>
                  </label>
                  {
                    dndLayout &&
                    <label className={classnames({'active':currentUser.tasklistLayout === 2}, "btn btn-link btn-outline-blue waves-effect waves-light")}>
                      <input type="radio" name="options" onChange={() => setLayout(2)} checked={currentUser.tasklistLayout === 2}/>
                      <i className="fa fa-map"/>
                    </label>
                  }

                  {
                    calendarLayout &&
                    <label className={classnames({'active':currentUser.tasklistLayout === 3}, "btn btn-link btn-outline-blue waves-effect waves-light")}>
                      <input type="radio" name="options" onChange={() => setLayout(3)} checked={currentUser.tasklistLayout === 3}/>
                      <i className="fa fa-calendar-alt"/>
                    </label>
                  }
                </div>
              </DropdownMenu>
            </Dropdown>
          }

          <Dropdown className="center-hor" isOpen={notificationsOpen} toggle={() => setNotificationsOpen(!notificationsOpen)}>
            <DropdownToggle className="header-dropdown">
              <i className="header-icon-with-text fa fa fa-envelope"/>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem header={true}>Notifications</DropdownItem>
              <DropdownItem divider={true}/> {currentUser.notifications && currentUser.notifications.length === 0 && <DropdownItem>You have no notifications!</DropdownItem>}
                {
                  processNotifications().splice(0, 5).map( (notification) =>
                  <DropdownItem
                    key={notification.id}
                    onClick={ () => {
                      history.push('/helpdesk/notifications/' + notification.id + '/' + notification.task.id)
                      if (!notification.read) {
                        //    rebase.updateDoc('user_notifications/' + notification.id, {read: true});
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
                      {notification.message}
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
                {
                  unreadNotifications.length > 0 ?
                  (' ' + unreadNotifications.length + ' more unread...') :
                  ''
                }
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <span className="header-icon-text clickable">{unreadNotifications.length}</span>

          {
            (currentUser) &&
            settings &&
            settings.length > 0 &&
            <Dropdown className="center-hor" isOpen={settingsOpen} toggle={() =>setSettingsOpen(!settingsOpen)}>
              <DropdownToggle className="header-dropdown">
                <i className="header-icon fa fa-cog"/>
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem header={true}>Settings</DropdownItem>
                <DropdownItem divider={true} />
                {settings.filter((setting) => accessRights[setting.value]).map((item, index) =>
                  <DropdownItem
                    key={index}
                    onClick={() => history.push(getLocation(history) + '/settings/' + item.link)}
                    >
                    {item.title}
                  </DropdownItem>
                )}
            </DropdownMenu>
          </Dropdown>
        }
        <i
          className="header-icon clickable fa fa-sign-out-alt center-hor"
          onClick={() => {
            if (window.confirm('Are you sure you want to log out?')) {
              logoutUser();
              localStorage.removeItem("acctok");
              setIsLoggedIn(false);
              client.cache.reset()
            }
          }}
          />
      </div>
    </div>

    <Modal style={{width: "800px"}} isOpen={modalUserProfileOpen}>
      <ModalHeader>
        User profile
      </ModalHeader>
        <ModalBody>
          <UserProfile
            closeModal={() => setModalUserProfileOpen(false)}
            />
        </ModalBody>
      </Modal>
  </div>
  );
}