import React from 'react';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";

import CompanyAdd from './companyAdd';
import CompanyEdit from './companyEdit';
import Loading from 'components/loading';
import Empty from 'components/Empty';
import SettingListContainer from '../components/settingListContainer';
import classnames from 'classnames';
import {
  GET_COMPANIES,
  COMPANIES_SUBSCRIPTION,
} from './queries';

export default function CompanysList( props ) {
  // state
  const [ companyFilter, setCompanyFilter ] = React.useState( "" );
  const [ sortBy, setSortBy ] = React.useState( "" );

  //data
  const {
    history,
    match
  } = props;

  const {
    data,
    loading,
    refetch
  } = useQuery( GET_COMPANIES, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( COMPANIES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      refetch();
    }
  } );

  const companies = ( loading || !data ? [] : data.companies );

  const CompanySort = (
    <div className="d-flex flex-row align-items-center ml-auto">
      <div className="text-basic m-r-5 m-l-5">
        Sort by
      </div>
      <select
        value={sortBy}
        className="invisible-select text-bold text-highlight"
        onChange={(e) => setSortBy(e.target.value)}>
        <option value={0} key={0}>All</option>
        <option value={1} key={1}>Contracted</option>
        <option value={2} key={2}>Non-contracted</option>
      </select>
    </div>
  );

  const RightSideComponent = (
    <Empty>
      { match.params.id && match.params.id==='add' &&
        <CompanyAdd {...props}/>
      }
      { loading && match.params.id && match.params.id!=='add' &&
        <Loading />
      }
      { match.params.id && match.params.id!=='add' && companies.some((item)=>item.id===parseInt(match.params.id)) &&
        <CompanyEdit {...{history, match}} />
      }
    </Empty>
  )

  return (
    <SettingListContainer
      header="Companies"
      filter={companyFilter}
      setFilter={setCompanyFilter}
      history={history}
      addURL="/helpdesk/settings/companies/add"
      addLabel="Company"
      RightFilterComponent={CompanySort}
      RightSideComponent={RightSideComponent}
      >
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Title</th>
            <th>Monthly</th>
          </tr>
        </thead>
        <tbody>
          {
            companies.filter((item) => {
              let cond = true;
              if (sortBy === "1"){
                cond = item.monthly;
              } else if (sortBy === "2"){
                cond = !item.monthly;
              }

              return cond && item.title.toLowerCase().includes(companyFilter.toLowerCase());
            })
            .map((company)=>
            <tr
              key={company.id}
              className={classnames (
                "clickable",
                {
                  "active": parseInt(match.params.id) === company.id
                }
              )}
              onClick={()=>history.push('/helpdesk/settings/companies/'+company.id)}>
              <td>
                {company.title}
              </td>
              <td width="10%">
                {company.monthly  ? "Zmluvný" : "Nezmluvný"}
              </td>
            </tr>
          )
        }
      </tbody>
      </table>
    </SettingListContainer>
  )
}