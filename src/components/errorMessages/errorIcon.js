import React from 'react';
import {
  useQuery,
} from "@apollo/client";
import classnames from 'classnames';
import {
  GET_MY_DATA,
  GET_ERROR_MESSAGES_COUNT,
} from '../queries';

export default function ErrorIcon( props ) {

  const {
    history,
    location
  } = props;

  const {
    data: userData,
    loading: userDataLoading
  } = useQuery( GET_MY_DATA );

  const {
    data: errorMessageCountData,
    loading: errorMessageCountLoading
  } = useQuery( GET_ERROR_MESSAGES_COUNT );

  if (
    userDataLoading ||
    errorMessageCountLoading
  ) {
    return null;
  }
  const accessRights = userData.getMyData.role.accessRights;
  return (
      <>
      {
        accessRights.viewErrors &&
        <i
          className={classnames({ "danger-color": errorMessageCountData.errorMessageCount > 0 }, "header-icon fas fa-exclamation-triangle center-hor clickable")}
          style={{marginRight: 6}}
          onClick={() => history.push(`${location}/errorMessages/`)}
          />
    } {
      accessRights.viewErrors &&
        <span
          onClick={() => history.push(`${location}/errorMessages/`)}
          className={classnames({ "danger-color": errorMessageCountData.errorMessageCount > 0 },"header-icon-text clickable")}
          >
          {errorMessageCountData.errorMessageCount}
        </span>
    } <
    />
);
}