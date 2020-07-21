import React, {Component} from 'react';
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle} from 'reactstrap';
import {Link} from 'react-router-dom';
import {connect} from "react-redux";
import firebase from 'firebase';
import classnames from 'classnames';
import {rebase} from 'index';
import { deleteUserData, storageHelpTasksStart, storageErrorMessagesStart } from 'redux/actions';
import {testing} from 'helperFunctions';

class PageHeader extends Component {
  constructor() {
    super();
    this.state = {
      companies: [],
      notificationsOpen: false,
      settingsOpen: false
    };
    this.processNotifications.bind(this);
    this.getLocation.bind(this);
  }

  componentWillMount() {
    if (!this.props.tasksActive) {
      this.props.storageHelpTasksStart();
    }
    if (!this.props.errorMessagesActive) {
      this.props.storageErrorMessagesStart();
    }
  }

  getLocation() {
    let url = this.props.history.location.pathname;
    if (url.includes('cmdb')) {
      return '/cmdb';
    } else if (url.includes('helpdesk')) {
      return '/helpdesk';
    } else if (url.includes('passmanager')) {
      return '/passmanager';
    } else if (url.includes('expenditures')) {
      return '/expenditures';
    } else if (url.includes('projects')) {
      return '/projects';
    } else if (url.includes('reports')) {
      return '/reports';
    } else if (url.includes('monitoring')) {
      return '/monitoring';
    } else {
      return '/lanwiki';
    }
  }

  getLayoutIcon() {
    switch (this.props.layout) {
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

  processNotifications() {
    return this.props.currentUser.notifications.map((notification) => {
      let task = this.props.tasks.find((task) => task.id === notification.task);
      return {
        ...notification,
        task: task !== undefined
          ? task
          : {
            id: notification.task,
            title: 'Unknown task'
          }
      }
    })
  }

  render() {
    const errorMessages = this.props.errorMessages.filter((message) => !message.read )
    let unreadNotifications = [...this.props.currentUser.notifications].splice(5, this.props.currentUser.notifications.length - 1).filter((notification) => !notification.read);
    const URL = this.props.history.location.pathname;
    return (<div className="page-header flex">
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
            ((this.props.currentUser.userData && this.props.currentUser.userData.role.value > 0) || testing) && <Link to={{
                  pathname: `/lanwiki/i/all`
                }} className={"header-link" + (
                  URL.includes("lanwiki")
                  ? " header-link-active"
                  : "")}>
                Návody
              </Link>
          }
          {
            ((this.props.currentUser.userData && this.props.currentUser.userData.role.value > 0) || testing) && <Link to={{
                  pathname: `/cmdb/i/all`
                }} className={"header-link" + (
                  URL.includes("cmdb")
                  ? " header-link-active"
                  : "")}>
                CMDB
              </Link>
          }
          {
            ((this.props.currentUser.userData && this.props.currentUser.userData.role.value > 0) || testing) && <Link to={{
                  pathname: `/passmanager`
                }} className={"header-link" + (
                  URL.includes("passmanager")
                  ? " header-link-active"
                  : "")}>
                Heslá
              </Link>
          }
          {
            ((this.props.currentUser.userData && this.props.currentUser.userData.role.value > 1) || testing) && <Link to={{
                  pathname: `/expenditures`
                }} className={"header-link" + (
                  URL.includes("expenditures")
                  ? " header-link-active"
                  : "")}>
                Náklady
              </Link>
          }

          {
            ((this.props.currentUser.userData && this.props.currentUser.userData.role.value > 1) || testing) && <Link to={{
                  pathname: `/reports`
                }} className={"header-link" + (
                  URL.includes("reports")
                  ? " header-link-active"
                  : "")}>
                Vykazy
              </Link>
          }
          {
            ((this.props.currentUser.userData && this.props.currentUser.userData.role.value > 0) || testing) && <Link to={{
                  pathname: `/projects`
                }} className={"header-link" + (
                  URL.includes("projects")
                  ? " header-link-active"
                  : "")}>
                Projekty
              </Link>
          }
          {
            ((this.props.currentUser.userData && this.props.currentUser.userData.role.value > 0) || testing) && <Link to={{
                  pathname: `/monitoring`
                }} className={"header-link" + (
                  URL.includes("monitoring")
                  ? " header-link-active"
                  : "")}>
                Monitoring
              </Link>
          }
        </div>
        <div className="ml-auto center-hor row">
          <i
            className={classnames({ "danger-color": errorMessages.length > 0 }, "header-icon fas fa-exclamation-triangle center-hor clickable")}
            style={{marginRight: 6}}
            onClick={() => this.props.history.push(`${this.getLocation()}/errorMessages/`)}
            />
          <span className={classnames({ "danger-color": errorMessages.length > 0 },"header-icon-text clickable")}>{errorMessages.length}</span>

          { this.props.showLayoutSwitch &&
            <Dropdown className="center-hor"
              isOpen={this.state.layoutOpen}
              toggle={() => this.setState({
                layoutOpen: !this.state.layoutOpen
              })}>
              <DropdownToggle className="header-dropdown">
                <i className={"header-icon fa " + this.getLayoutIcon()}/>
              </DropdownToggle>
              <DropdownMenu right>
                <div className="btn-group-vertical" data-toggle="buttons">
                  <label className={classnames({'active':this.props.layout === 0}, "btn btn-link btn-outline-blue waves-effect waves-light")}>
                    <input type="radio" name="options" onChange={() => this.props.setLayout(0)} checked={this.props.layout === 0}/>
                    <i className="fa fa-columns"/>
                  </label>
                  <label className={classnames({'active':this.props.layout === 1}, "btn btn-link btn-outline-blue waves-effect waves-light")}>
                    <input type="radio" name="options" checked={this.props.layout === 1} onChange={() => this.props.setLayout(1)}/>
                    <i className="fa fa-list"/>
                  </label>
                  { this.props.dndLayout &&
                    <label className={classnames({'active':this.props.layout === 2}, "btn btn-link btn-outline-blue waves-effect waves-light")}>
                      <input type="radio" name="options" onChange={() => this.props.setLayout(2)} checked={this.props.layout === 2}/>
                      <i className="fa fa-map"/>
                    </label>
                  }

                  { this.props.calendarLayout &&
                    <label className={classnames({'active':this.props.layout === 3}, "btn btn-link btn-outline-blue waves-effect waves-light")}>
                      <input type="radio" name="options" onChange={() => this.props.setLayout(3)} checked={this.props.layout === 3}/>
                      <i className="fa fa-calendar-alt"/>
                    </label>
                  }
                </div>
              </DropdownMenu>
            </Dropdown>
          }

          <Dropdown className="center-hor" isOpen={this.state.notificationsOpen} toggle={() => this.setState({
              notificationsOpen: !this.state.notificationsOpen
            })}>
            <DropdownToggle className="header-dropdown">
              <i className="header-icon-with-text fa fa fa-envelope"/>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem header={true}>Notifications</DropdownItem>
              <DropdownItem divider={true}/> {this.props.currentUser.notifications.length === 0 && <DropdownItem>You have no notifications!</DropdownItem>}
              {
                this.processNotifications().splice(0, 5).map((notification) => <DropdownItem key={notification.id} onClick={() => {
                    this.props.history.push('/helpdesk/notifications/' + notification.id + '/' + notification.task.id)
                    if (!notification.read) {
                      rebase.updateDoc('user_notifications/' + notification.id, {read: true});
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
              <DropdownItem onClick={() => this.props.history.push('/helpdesk/notifications/')}>
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
            ((this.props.currentUser.userData && this.props.currentUser.userData.role.value > 0) || testing) && this.props.settings && this.props.settings.length > 0 && <Dropdown className="center-hor" isOpen={this.state.settingsOpen} toggle={() => this.setState({
                  settingsOpen: !this.state.settingsOpen
                })}>
                <DropdownToggle className="header-dropdown">
                  <i className="header-icon fa fa-cog"/>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem header={true}>Settings</DropdownItem>
                  <DropdownItem divider={true} /> {this.props.settings.filter((setting) => setting.minimalRole <= this.props.currentUser.userData.role.value).map((item, index) => <DropdownItem key={index} onClick={() => this.props.history.push(this.getLocation() + '/settings/' + item.link)}>{item.title}</DropdownItem>)}
                </DropdownMenu>
              </Dropdown>
          }
          <i className="header-icon clickable fa fa-sign-out-alt center-hor" onClick={() => {
              if (window.confirm('Are you sure you want to log out?')) {
                this.props.deleteUserData();
                firebase.auth().signOut();
              }
            }}/>
        </div>
      </div>
    </div>);
  }
}

const mapStateToProps = ({userReducer, storageHelpTasks, storageErrorMessages}) => {
  const {tasksActive, tasks} = storageHelpTasks;
  const { errorMessagesActive, errorMessages } = storageErrorMessages;
  return {
    currentUser: userReducer,
    tasksActive, tasks,
    errorMessagesActive, errorMessages,
  };
};

export default connect(mapStateToProps, {deleteUserData, storageHelpTasksStart, storageErrorMessagesStart})(PageHeader);
