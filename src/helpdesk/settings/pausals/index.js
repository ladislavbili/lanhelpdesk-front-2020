import React from 'react';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";
import Empty from 'components/Empty';
import SettingListContainer from '../components/settingListContainer';

import PausalEdit from './pausalEdit';
import classnames from 'classnames';

import {
  GET_COMPANIES,
  COMPANIES_SUBSCRIPTION,
} from '../companies/queries';

export default function CompaniesList( props ) {
  // state
  const [ companyFilter, setCompanyFilter ] = React.useState( "" );

  //data
  const {
    history,
    match
  } = props;

  const {
    data,
    loading,
    refetch,
  } = useQuery( GET_COMPANIES, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( COMPANIES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      refetch();
    }
  } );

  const COMPANIES = ( loading || !data ? [] : data.companies );

  const RightSideComponent = (
    <Empty>
      {
      match.params.id && COMPANIES.some((item)=>item.id===parseInt(match.params.id)) && <PausalEdit match={match} history = {history} />
      }
    </Empty>
  )

  return (
    <SettingListContainer
      header="Service level agreements"
      filter={companyFilter}
      setFilter={setCompanyFilter}
      history={history}
      RightSideComponent={RightSideComponent}
      noAdd
      >
      <table className="table table-hover">
              <thead>
                <tr>
                  <th>Title</th>
                </tr>
              </thead>
              <tbody>
                {
                  COMPANIES.filter(item => item.monthly)
                    .filter((item) => item.title.toLowerCase().includes(companyFilter.toLowerCase())
                    || (item.taskWorkPausal).toLowerCase().includes(companyFilter.toLowerCase())
                    || (item.taskTripPausal).toLowerCase().includes(companyFilter.toLowerCase()))
                    .map((company)=>
                      <tr
                        key={company.id}
                        className={classnames (
                          "clickable",
                          {
                            "active": parseInt(match.params.id) === company.id
                          }
                        )}
                        onClick={()=>history.push('/helpdesk/settings/pausals/'+company.id)}>
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
                  )
              }
              </tbody>
            </table>
    </SettingListContainer>
  );
}