import React from 'react';
import {
  useQuery
} from "@apollo/client";

import PausalEdit from './pausalEdit';

import {
  GET_COMPANIES
} from '../companies/querries';

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
    loading
  } = useQuery( GET_COMPANIES );
  const COMPANIES = ( loading || !data ? [] : data.companies );

  return (
    <div className="content">
      <div className="row m-0 p-0 taskList-container">
        <div className="col-lg-4">
          <div className="commandbar">
            <div className="search-row">
              <div className="search">
                <button className="search-btn" type="button">
                  <i className="fa fa-search" />
                </button>
                  <input
                    type="text"
                    className="form-control search-text"
                    value={companyFilter}
                    onChange={(e)=>setCompanyFilter(e.target.value)}
                    placeholder="Search"
                  />
              </div>
            </div>
          </div>

          <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
            <h2 className=" p-b-10 p-l-10">
              Service level agreements
						</h2>
            <table className="table table-hover">
              <tbody>
                {
                  COMPANIES.filter(item => item.monthly)
                    .filter((item) => item.title.toLowerCase().includes(companyFilter.toLowerCase())
                    || (item.taskWorkPausal).toLowerCase().includes(companyFilter.toLowerCase())
                    || (item.taskTripPausal).toLowerCase().includes(companyFilter.toLowerCase()))
                    .map((company)=>
                      <tr
                        key={company.id}
                        className={"clickable" + (match.params.id === company.id ? " active":"")}
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
          </div>
        </div>
        <div className="col-lg-8">
          <div className="commandbar"></div>
          {
          match.params.id && COMPANIES.some((item)=>item.id===parseInt(match.params.id)) && <PausalEdit match={match} history = {history} />
          }
        </div>
      </div>
      </div>
  );
}