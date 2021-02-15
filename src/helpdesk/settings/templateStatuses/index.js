import React from 'react';
import {
  useQuery
} from "@apollo/client";

import {
  Button
} from 'reactstrap';
import StatusAdd from './statusAdd';
import StatusEdit from './statusEdit';
import {
  orderArr
} from 'helperFunctions';
import classnames from 'classnames';

import {
  GET_STATUS_TEMPLATES
} from './queries';

export default function StatusesList( props ) {
  // state
  const [ statusFilter, setStatusFilter ] = React.useState( "" );

  //data
  const {
    history,
    match
  } = props;
  const {
    data,
    loading
  } = useQuery( GET_STATUS_TEMPLATES );
  const statuses = ( loading || !data ? [] : orderArr( data.statusTemplates ) );

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
                    value={statusFilter}
                    onChange={ (e) => setStatusFilter(e.target.value) }
                    placeholder="Search"
                    />
                </div>
              </div>
              <Button
                className="btn-link center-hor"
                onClick={()=>history.push('/helpdesk/settings/statuses/add')}>
                <i className="fa fa-plus p-l-5 p-r-5"/>Status
              </Button>
            </div>
            <div className=" p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <h2 className=" p-l-10 p-b-10 ">
                Statuses
              </h2>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th> Order </th>
                  </tr>
                </thead>
                <tbody>
                  {statuses.filter((item)=>item.title.toLowerCase().includes(statusFilter.toLowerCase())).map((status)=>
                    <tr key={status.id}
                       className={classnames (
                         "clickable",
                         {
                           "active": parseInt(match.params.id) === status.id
                         }
                       )}
                       onClick={()=>history.push('/helpdesk/settings/statuses/'+status.id)}>
                      <td>
                        {status.title}
                      </td>
                      <td>
                        {status.order?status.order:0}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-8">
            {
              match.params.id && match.params.id==='add' && <StatusAdd  {...props}/>
            }
            {
              match.params.id && match.params.id!=='add' && statuses.some((item)=>item.id===parseInt(match.params.id)) && <StatusEdit {...{history, match}} />
            }
            {
              !match.params.id && match.params.id!=='add' && <div className="commandbar"></div>
            }
          </div>
        </div>
      </div>
  );
}