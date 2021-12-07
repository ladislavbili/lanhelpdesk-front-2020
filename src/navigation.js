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
  useSubscription,
} from "@apollo/client";
import {
  getMyData,
} from 'helperFunctions';
import i18n from "i18next";

import Reroute from 'reroute';
import HelpdeskNavigation from 'helpdesk/navigation';
import InvoicesNavigation from 'invoices/navigation';
import LanwikiNavigation from 'lanwiki/navigation';
import CMDBNavigation from 'cmdb/navigation';

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


  const currentUser = getMyData();
  React.useEffect( () => {
    if ( currentUser ) {
      i18n.changeLanguage( currentUser.language );
    }
  }, [ currentUser, currentUser ? currentUser.language : null ] );
  if ( !userDataLoading && currentUser === null ) {
    location.reload( false );
  }

  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Reroute} />
        <Route path='/helpdesk' component={HelpdeskNavigation} />
        <Route path='/invoices' component={InvoicesNavigation} />
        <Route path='/lanwiki' component={LanwikiNavigation} />
        <Route path='/cmdb' component={CMDBNavigation} />
      </Switch>
    </BrowserRouter>
  )
}