import React from 'react';
import {
  useQuery,
  useMutation,
  useApolloClient,
} from "@apollo/client";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import {
  Link
} from 'react-router-dom';
import Empty from 'components/Empty';
import GeneralPopover from 'components/generalPopover';
import ErrorIcon from 'components/errorMessages/errorIcon';
import NotificationIcon from 'components/notifications/notificationIcon';
import LocalErrors from 'components/localErrors';
import classnames from 'classnames';
import {
  getLocation,
  getMyData,
} from 'helperFunctions';

import UserProfile from 'helpdesk/settings/users/userProfile';

import {
  LOGOUT_USER
} from './queries';

export default function PageHeader( props ) {
  //data & queries
  const {
    match,
    history,
    settings,
  } = props;

  const [ logoutUser ] = useMutation( LOGOUT_USER );

  const client = useApolloClient();
  //state
  const [ layoutOpen, setLayoutOpen ] = React.useState( false );
  const [ settingsOpen, setSettingsOpen ] = React.useState( false );
  const [ modalUserProfileOpen, setModalUserProfileOpen ] = React.useState( false );

  const currentUser = getMyData();
  const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};
  const filteredSettings = settings.filter( ( setting ) => accessRights[ setting.value ] );

  const URL = getLocation( history );
  return (
    <div className={classnames("page-header flex m-l-30")}>
      <div className="d-flex full-height">
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
          { accessRights.vykazy &&
            <Empty>
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
              <Link
                to={{ pathname: `/lanwiki` }}
                className={
                  "header-link" +
                  (
                    URL.includes("lanwiki") ?
                    " header-link-active" :
                    ""
                  )
                }
                >
                LanWiki
              </Link>
              <Link
                to={{ pathname: `/cmdb` }}
                className={
                  "header-link" +
                  (
                    URL.includes("cmdb") ?
                    " header-link-active" :
                    ""
                  )
                }
                >
                CMDB
              </Link>
            </Empty>
          }
        </div>
        <div className="ml-auto center-hor row m-r-30">
          <div className=" header-icon center-hor clickable" onClick={() => setModalUserProfileOpen(true)}>
            { !currentUser ? `Loading...` : `${currentUser.name} ${currentUser.surname}`}
            <i className="fas fa-user m-l-5"/>
          </div>

          <LocalErrors />
          { accessRights.viewErrors &&
            <ErrorIcon history={history} location={URL} />
          }

          <NotificationIcon history={history} location={URL} />

          { currentUser &&
            filteredSettings &&
            filteredSettings.length > 0 &&
            <Empty>
              <div className="header-icon center-hor clickable" id="page-header-settings" onClick={() => setSettingsOpen(!settingsOpen)}>
                  <i className="header-icon fa fa-cog m-l-5"/>
              </div>
              <GeneralPopover
                placement="bottom-start"
                className="overflow-auto"
                headerClassName="segoe-semi-header custom-popover-header"
                target="page-header-settings"
                header="Settings"
                reset={() => {}}
                submit={() => {}}
                open={ settingsOpen }
                closeOnly
                hideButtons
                close={() => setSettingsOpen(false)}
                >
                {filteredSettings.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      history.push(getLocation(history) + '/settings/' + item.link);
                      setSettingsOpen(false);
                    }}
                    className="segoe-semi-text clickable custom-popover-item"
                    >
                    {item.title}
                  </div>
                ))}
              </GeneralPopover>
            </Empty>
          }
          <i
            className="header-icon clickable fa fa-sign-out-alt center-hor"
            onClick={() => {
              if (window.confirm('Are you sure you want to log out?')) {
                logoutUser().then(() => {
                  location.reload(false);
                } );
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