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

import CompanyAdd from './companyAdd';
import CompanyEdit from './companyEdit';
import {
  GET_COMPANIES,
  COMPANIES_SUBSCRIPTION,
} from './queries';

export default function CompaniesList( props ) {
  const {
    history,
    match
  } = props;

  const {
    data: companiesData,
    loading: companiesLoading,
    refetch: companiesRefetch,
  } = useQuery( GET_COMPANIES, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( COMPANIES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      companiesRefetch();
    }
  } );

  // state
  const [ companyFilter, setCompanyFilter ] = React.useState( "" );
  const [ sortBy, setSortBy ] = React.useState( "" );

  if ( companiesLoading ) {
    return ( <SettingLoading match={match} /> );
  }

  const companies = companiesData.companies;

  const CompanySort = (
    <div className="d-flex flex-row align-items-center ml-auto">
      <div className="color-basic m-r-5 m-l-5">
        Sort by
      </div>
      <select
        value={sortBy}
        className="invisible-select font-bold text-highlight"
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
      { companiesLoading && match.params.id && match.params.id!=='add' &&
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
      addURL={`.${match.params.id === undefined ? '/companies' : '' }/add`}
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
          { companies.filter((item) => {
            let cond = true;
            if (sortBy === "1"){
              cond = item.monthly;
            } else if (sortBy === "2"){
              cond = !item.monthly;
            }
            return cond && itemAttributesFullfillsString(item, companyFilter, ['title']);
          })
          .map((company) => (
            <tr
              key={company.id}
              className={classnames(
                "clickable",
                {
                  "active": parseInt(match.params.id) === company.id
                }
              )}
              onClick={ () => history.push(`.${match.params.id === undefined ? '/companies' : '' }/${company.id}`) }>
              <td>
                {company.title}
              </td>
              <td width="10%">
                {company.monthly  ? "Zmluvný" : "Nezmluvný"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SettingListContainer>
  )
}