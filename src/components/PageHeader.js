import React from 'react';
import {
  useQuery,
  useMutation
} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from 'reactstrap';
import {
  writeCleanCashe
} from 'apollo/createClient';
import {
  Link
} from 'react-router-dom';
import classnames from 'classnames';

const GET_MY_DATA = gql `
query {
  getMyData{
    id
    tasklistLayout
    role {
      accessRights {
        publicFilters
        users
        companies
        pausals
        projects
        statuses
        units
        prices
        suppliers
        tags
        invoices
        roles
        taskTypes
        tripTypes
        imaps
        smtps
      }
    }
  }
}
`;

const LOGOUT_USER = gql `
mutation logoutUser{
  logoutUser: Boolean
}
`;

export default function PageHeader( props ) {
  //data & queries
  const {
    history,
    settings,
    showLayoutSwitch,
    dndLayout,
    calendarLayout
  } = props;
  const {
    data,
    client
  } = useQuery( GET_MY_DATA );
  //state
  const [ notificationsOpen, setNotificationsOpen ] = React.useState( false );
  const [ layoutOpen, setLayoutOpen ] = React.useState( false );
  const [ settingsOpen, setSettingsOpen ] = React.useState( false );
  const [ errorMessages /*, setErrorMessages*/ ] = React.useState( [] );
  const [ unreadNotifications /*, setUnreadNotifications */ ] = React.useState( [] );

  const currentUser = data ? data.getMyData : {};
  const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};

  const getLocation = () => {
    let url = history.location.pathname;
    if ( url.includes( 'cmdb' ) ) {
      return '/cmdb';
    } else if ( url.includes( 'helpdesk' ) ) {
      return '/helpdesk';
    } else if ( url.includes( 'passmanager' ) ) {
      return '/passmanager';
    } else if ( url.includes( 'expenditures' ) ) {
      return '/expenditures';
    } else if ( url.includes( 'projects' ) ) {
      return '/projects';
    } else if ( url.includes( 'reports' ) ) {
      return '/reports';
    } else if ( url.includes( 'monitoring' ) ) {
      return '/monitoring';
    } else {
      return '/lanwiki';
    }
  }

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

  const setTasklistLayout = ( value ) => {

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

  /*    const errorMessages = props.errorMessages.filter((message) => !message.read )
      let unreadNotifications = [...props.currentUser.notifications].splice(5, props.currentUser.notifications.length - 1).filter((notification) => !notification.read);*/
  const URL = getLocation();

  return ( <div className="page-header flex">
      <div className="d-flex full-height p-l-10">
        <div className="center-hor">
          <Link to={{
              pathname: `/helpdesk/taskList/i/all`
            }} className={"header-link" + (
              URL.includes("helpdesk/taskList")
              ? " header-link-active"
              : "")}>
            Úlohy
          </Link>
          {
            (true) && <Link to={{
                  pathname: `/reports`
                }} className={"header-link" + (
                  URL.includes("reports")
                  ? " header-link-active"
                  : "")}>
                Vykazy
              </Link>
          }
        </div>
        <div className="ml-auto center-hor row">
          <i
            className={classnames({ "danger-color": errorMessages.length > 0 }, "header-icon fas fa-exclamation-triangle center-hor clickable")}
            style={{marginRight: 6}}
            onClick={() => history.push(`${this.getLocation()}/errorMessages/`)}
            />
          <span className={classnames({ "danger-color": errorMessages.length > 0 },"header-icon-text clickable")}>{errorMessages.length}</span>

          { showLayoutSwitch &&
            <Dropdown className="center-hor"
              isOpen={layoutOpen}
              toggle={() => setLayoutOpen(!layoutOpen)}>
              <DropdownToggle className="header-dropdown">
                <i className={"header-icon fa " + getLayoutIcon()}/>
              </DropdownToggle>
              <DropdownMenu right>
                <div className="btn-group-vertical" data-toggle="buttons">
                  <label className={classnames({'active':currentUser.tasklistLayout === 0}, "btn btn-link btn-outline-blue waves-effect waves-light")}>
                    <input type="radio" name="options" onChange={() => setTasklistLayout(0)} checked={currentUser.tasklistLayout === 0}/>
                    <i className="fa fa-columns"/>
                  </label>
                  <label className={classnames({'active':currentUser.tasklistLayout === 1}, "btn btn-link btn-outline-blue waves-effect waves-light")}>
                    <input type="radio" name="options" checked={currentUser.tasklistLayout === 1} onChange={() => setTasklistLayout(1)}/>
                    <i className="fa fa-list"/>
                  </label>
                  { dndLayout &&
                    <label className={classnames({'active':currentUser.tasklistLayout === 2}, "btn btn-link btn-outline-blue waves-effect waves-light")}>
                      <input type="radio" name="options" onChange={() => setTasklistLayout(2)} checked={currentUser.tasklistLayout === 2}/>
                      <i className="fa fa-map"/>
                    </label>
                  }

                  { calendarLayout &&
                    <label className={classnames({'active':currentUser.tasklistLayout === 3}, "btn btn-link btn-outline-blue waves-effect waves-light")}>
                      <input type="radio" name="options" onChange={() => setTasklistLayout(3)} checked={currentUser.tasklistLayout === 3}/>
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
                processNotifications().splice(0, 5).map((notification) => <DropdownItem key={notification.id} onClick={() => {
                    history.push('/helpdesk/notifications/' + notification.id + '/' + notification.task.id)
                    if (!notification.read) {
                  //    rebase.updateDoc('user_notifications/' + notification.id, {read: true});
                    }
                  }} className={classnames({
                    'notification-read-small': notification.read,
                    'notification-not-read-small': !notification.read
                  })}>
                  <div>
                    <i className={classnames({
                        'far fa-envelope-open': notification.read,
                        'fas fa-envelope': !notification.read
                      })}/> {notification.message}
                  </div>
                  <div style={{
                      overflowX: 'hidden',
                      maxWidth: 250
                    }}>{notification.task.id}: {notification.task.title}
                  </div>
                </DropdownItem>)
              }
              <DropdownItem divider={true}/>
              <DropdownItem onClick={() => history.push('/helpdesk/notifications/')}>
                <span style={{
                    fontWeight: 'bold'
                  }}>Go to notifications</span>
                {
                  unreadNotifications.length > 0
                    ? (' ' + unreadNotifications.length + ' more unread...')
                    : ''
                }
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <span className="header-icon-text clickable">{unreadNotifications.length}</span>

          {
            (currentUser) && settings && settings.length > 0 && <Dropdown className="center-hor" isOpen={settingsOpen} toggle={() =>setSettingsOpen(!settingsOpen)}>
                <DropdownToggle className="header-dropdown">
                  <i className="header-icon fa fa-cog"/>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem header={true}>Settings</DropdownItem>
                  <DropdownItem divider={true} /> {
                      settings.filter((setting) => accessRights[setting.value]
                    ).map((item, index) =>
                    <DropdownItem
                      key={index}
                      onClick={() => history.push(getLocation() + '/settings/' + item.link)}>{item.title}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
          }
          <i className="header-icon clickable fa fa-sign-out-alt center-hor" onClick={() => {
              if (window.confirm('Are you sure you want to log out?')) {
                localStorage.removeItem("acctok");
                writeCleanCashe();
                client.writeData({ data: { isLoggedIn: false } });
              }
            }}/>
        </div>
      </div>
    </div> );
}
/*
const mapStateToProps = ({userReducer, storageHelpTasks, storageErrorMessages}) => {
  const {tasksActive, tasks} = storageHelpTasks;
  const { errorMessagesActive, errorMessages } = storageErrorMessages;
  return {
    currentUser: userReducer,
    tasksActive, tasks,
    errorMessagesActive, errorMessages,
  };
};*/