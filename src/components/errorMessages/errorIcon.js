import React from 'react';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";
import classnames from 'classnames';
import Empty from 'components/Empty';
import {
  GET_MY_DATA,
} from '../queries';
import {
  GET_ERROR_MESSAGES_COUNT,
  ERROR_MESSAGE_COUNT_SUBSCRIPTION,
} from './queries';

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
    loading: errorMessageCountLoading,
    refetch: errorMessageCountRefetch,
  } = useQuery( GET_ERROR_MESSAGES_COUNT );

  useSubscription( ERROR_MESSAGE_COUNT_SUBSCRIPTION, {
    onSubscriptionData: () => {
      errorMessageCountRefetch();
    }
  } );

  if (
    userDataLoading ||
    errorMessageCountLoading
  ) {
    return null;
  }
  const accessRights = userData.getMyData.role.accessRights;
  return (
    <Empty>
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
    } </Empty>
  );
}