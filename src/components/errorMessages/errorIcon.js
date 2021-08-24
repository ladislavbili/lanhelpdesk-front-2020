import React from 'react';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";
import classnames from 'classnames';
import {
  getMyData,
} from 'helperFunctions';
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
    data: errorMessageCountData,
    loading: errorMessageCountLoading,
    refetch: errorMessageCountRefetch,
  } = useQuery( GET_ERROR_MESSAGES_COUNT );

  useSubscription( ERROR_MESSAGE_COUNT_SUBSCRIPTION, {
    onSubscriptionData: () => {
      errorMessageCountRefetch();
    }
  } );
  const currentUser = getMyData();
  if (
    !currentUser ||
    errorMessageCountLoading
  ) {
    return null;
  }
  const accessRights = currentUser.role.accessRights;
  if ( !accessRights.viewErrors ) {
    return null;
  }

  return (
    <div className="header-icon center-hor header-with-text clickable" id="page-header-notifications" onClick={() => history.push(`${location}/errorMessages/`)}>
      <i className={classnames({ "color-danger": errorMessageCountData.errorMessageCount > 0 }, "fas fa-exclamation-triangle header-icon-with-text m-l-5" )}/>
      <span className="m-l-2 header-icon-text">{ errorMessageCountData.errorMessageCount }</span>
    </div>
  );
}