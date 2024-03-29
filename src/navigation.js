import React from 'react';
import {
  BrowserRouter,
  Route,
  Switch
} from 'react-router-dom';
import {
  GET_MY_DATA,
  USER_DATA_SUBSCRIPTION,
} from 'apollo/globalQueries';
import {
  useQuery,
  useMutation,
  useSubscription,
} from "@apollo/client";
import {
  getMyData,
} from 'helperFunctions';
import i18n from "i18next";

import Loading from 'components/loading';
import Reroute from 'reroute';
import HelpdeskNavigation from 'helpdesk/navigation';
import InvoicesNavigation from 'invoices/navigation';
import LanwikiNavigation from 'lanwiki/navigation';
import LanpassNavigation from 'lanpass/navigation';
import CMDBNavigation from 'cmdb/navigation';

import {
  LOGOUT_USER
} from 'components/queries';

export default function Navigation( props ) {

  const {
    data: userDataData,
    loading: userDataLoading,
    refetch: userDataRefetch,
  } = useQuery( GET_MY_DATA, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( USER_DATA_SUBSCRIPTION, {
    onSubscriptionData: () => {
      userDataRefetch()
    }
  } );

  const [ logoutUser ] = useMutation( LOGOUT_USER );

  const currentUser = getMyData();
  React.useEffect( () => {
    if ( currentUser ) {
      i18n.changeLanguage( currentUser.language );
    }
  }, [ currentUser, currentUser ? currentUser.language : null ] );
  if ( !userDataLoading && currentUser === null ) {
    logoutUser()
      .then( () => {
        location.reload( false );
      } );
    return null;
  }
  if ( userDataLoading ) {
    return <Loading/>;
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Reroute} />
        <Route path='/helpdesk' component={HelpdeskNavigation} />
        <Route path='/invoices' component={InvoicesNavigation} />
        { userDataData.getMyData.role.accessRights.lanwiki && <Route path='/lanwiki' component={LanwikiNavigation} />}
        { userDataData.getMyData.role.accessRights.pass && <Route path='/lanpass' component={LanpassNavigation} />}
        { userDataData.getMyData.role.accessRights.cmdb && <Route path='/cmdb' component={CMDBNavigation} />}
      </Switch>
    </BrowserRouter>
  )
}
