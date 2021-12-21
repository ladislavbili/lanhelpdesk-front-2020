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
import {
  useTranslation
} from "react-i18next";
import {
  testing,
} from 'configs/restAPI';

import UserProfile from 'helpdesk/settings/users/userProfile';

import {
  LOGOUT_USER
} from './queries';

export default function PageHeader( props ) {
  //data & queries
  const {
    match,
    history,
  } = props;
  const {
    t
  } = useTranslation();

  const [ logoutUser ] = useMutation( LOGOUT_USER );

  const client = useApolloClient();
  //state
  const [ layoutOpen, setLayoutOpen ] = React.useState( false );
  const [ modalUserProfileOpen, setModalUserProfileOpen ] = React.useState( false );

  const currentUser = getMyData();
  const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};

  const URL = getLocation( history );
  return (
    <div className={classnames("page-header flex m-l-30")}>
      <div className="d-flex full-height">
        { testing &&
        <div className="center-hor">
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
            {t('lanWiki')}
          </Link>
        </div>
        }
        { false &&
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
              {t('tasks')}
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
                  {t('invoices')}
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
                  {t('cmdb')}
                </Link>
              </Empty>
            }
          </div>
        }
        <div className="ml-auto center-hor row m-r-30">
          <div className=" header-icon center-hor clickable" onClick={() => setModalUserProfileOpen(true)}>
            { !currentUser ? `${t('loading')}...` : `${currentUser.name} ${currentUser.surname}`}
            <i className="fas fa-user m-l-5"/>
          </div>

          <LocalErrors />
          { accessRights.viewErrors &&
            <ErrorIcon history={history} location={URL} />
          }

          <NotificationIcon history={history} location={URL} />
          <i
            className="header-icon clickable fa fa-sign-out-alt center-hor"
            onClick={() => {
              if (window.confirm(t('logoutConfirmation'))) {
                logoutUser().then(() => {
                  history.push('/helpdesk/taskList/i/all');
                  location.reload(false);
                } );
              }
            }}
            />
        </div>
      </div>

      <Modal style={{width: "800px"}} isOpen={modalUserProfileOpen}>
        <ModalHeader>
          {t('userProfile')}
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