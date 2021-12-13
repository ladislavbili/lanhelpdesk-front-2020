import React from 'react';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";
import classnames from 'classnames';

import Empty from 'components/Empty';
import SettingLoading from '../components/settingLoading';
import SettingListContainer from '../components/settingListContainer';
import {
  itemAttributesFullfillsString
} from '../components/helpers';

import PausalEdit from './pausalEdit';

import {
  GET_BASIC_COMPANIES,
  COMPANIES_SUBSCRIPTION,
} from '../companies/queries';

import {
  useTranslation
} from "react-i18next";

export default function CompaniesList( props ) {
  const {
    history,
    match
  } = props;

  const {
    t
  } = useTranslation();

  const {
    data: basicCompaniesData,
    loading: basicCompaniesLoading,
    refetch: basicCompaniesRefetch,
  } = useQuery( GET_BASIC_COMPANIES, {
    fetchPolicy: 'network-only'
  } );

  // state
  const [ companyFilter, setCompanyFilter ] = React.useState( "" );

  useSubscription( COMPANIES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      basicCompaniesRefetch();
    }
  } );

  if ( basicCompaniesLoading ) {
    return ( <SettingLoading match={match} /> );
  }

  const companies = basicCompaniesData.basicCompanies;
  const RightSideComponent = (
    <Empty>
      { match.params.id && companies.some((item)=>item.id === parseInt(match.params.id)) &&
        <PausalEdit match={match} history={history} />
      }
    </Empty>
  )

  return (
    <SettingListContainer
      header={t('slas')}
      filter={companyFilter}
      setFilter={setCompanyFilter}
      history={history}
      RightSideComponent={RightSideComponent}
      noAdd
      >
      <table className="table table-hover">
        <thead>
          <tr>
            <th>{t('companyTitle')}</th>
          </tr>
        </thead>
        <tbody>
          { companies
            .filter(item => (
              item.monthly &&
              itemAttributesFullfillsString(item, companyFilter, ['title'])
            ) )
            .map((company) => (
              <tr
                key={company.id}
                className={classnames (
                  "clickable",
                  {
                    "active": parseInt(match.params.id) === company.id
                  }
                )}
                onClick={() => history.push(`/helpdesk/settings/pausals/${company.id}`) }>
                <td>
                  {company.title}
                </td>
                <td>
                  {company.taskWorkPausal}
                </td>
                <td>
                  {company.taskTripPausal}
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </SettingListContainer>
  );
}