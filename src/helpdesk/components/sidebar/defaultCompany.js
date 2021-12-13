import React from 'react';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";
import classnames from 'classnames';

import {
  NavItem
} from 'reactstrap';
import {
  Link
} from 'react-router-dom';
import {
  GET_DEF_COMPANY,
  COMPANIES_SUBSCRIPTION,
} from 'helpdesk/settings/companies/queries';
import {
  useTranslation
} from "react-i18next";

export default function DefaultCompany( props ) {
  //data & queries
  const {
    location
  } = props;

  const {
    t
  } = useTranslation();

  const {
    data: companyData,
    loading: companyLoading,
    refetch: companyRefetch
  } = useQuery( GET_DEF_COMPANY, {
    fetchPolicy: 'network-only',
  } );

  useSubscription( COMPANIES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      companyRefetch();
    }
  } );

  if ( !companyLoading && !companyData ) {
    return null;
  }

  const company = companyLoading ? null : companyData.defCompany;

  return (
    <NavItem key='defCompany'>
      <Link
        className={classnames("sidebar-menu-item" , {"active" : location.pathname.includes('settings/company')})}
        to={{ pathname:`/helpdesk/settings${ companyLoading ? '' : `/company/${company.id}`}` }}>
        Helpdesk {t('company')}
      </Link>
    </NavItem>
  );
}