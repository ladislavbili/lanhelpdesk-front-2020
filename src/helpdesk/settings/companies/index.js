import React from 'react';
import {
  useQuery
} from "@apollo/client";

import {
  Button
} from 'reactstrap';
import CompanyAdd from './companyAdd';
import CompanyEdit from './companyEdit';
import Loading from 'components/loading';
import classnames from 'classnames';
import {
  GET_COMPANIES
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
              <Button
                className="btn-link center-hor"
                onClick={()=>history.push('/helpdesk/settings/companies/add')}>
                <i className="fa fa-plus p-l-5 p-r-5"/> Company
              </Button>
            </div>

            <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <div className="row">
                <h2 className=" p-l-10 p-b-10 ">
    							Companies
    						</h2>
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
              </div>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Monthly</th>
                  </tr>
                </thead>
                <tbody>
                    {
                      COMPANIES.filter((item) => {
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
            </div>
          </div>
          <div className="col-lg-8">
            {
              match.params.id && match.params.id==='add' && <CompanyAdd {...props}/>
            }
            {
              loading && match.params.id && match.params.id!=='add' && <Loading />
            }
            {
              match.params.id && match.params.id!=='add' && COMPANIES.some((item)=>item.id===parseInt(match.params.id)) && <CompanyEdit {...{history, match}} />
            }
          </div>
        </div>
      </div>
  );
}