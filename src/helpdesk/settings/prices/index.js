import React from 'react';
import {
  useQuery
} from "@apollo/react-hooks";
import gql from "graphql-tag";

import {
  Button
} from 'reactstrap';
import PriceAdd from './priceAdd';
import PriceEdit from './priceEdit';
import Loading from 'components/loading';

export const GET_PRICELISTS = gql `
query {
  pricelists {
    title
    id
    order
    def
  }
}
`;

export default function PricelistsList( props ) {
  // state
  const [ pricelistFilter, setPricelistFilter ] = React.useState( "" );

  //data
  const {
    history,
    match
  } = props;
  const {
    data,
    loading
  } = useQuery( GET_PRICELISTS );
  const PRICELISTS = ( loading || !data ? [] : data.pricelists );

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
                      className="form-control search-text search"
                      value={pricelistFilter}
                      onChange={(e)=>setPricelistFilter(e.target.value)}
                      placeholder="Search"
                      />
                  </div>
                </div>
                <Button
                  className="btn-link center-hor"
                  onClick={()=>history.push('/helpdesk/settings/pricelists/add')}>
                  <i className="fa fa-plus p-l-5 p-r-5"/> Price list
                  </Button>
                </div>
              <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
                <h2 className=" p-l-10 p-b-10 ">
    							Price lists
    						</h2>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Default</th>
                      <th> Order </th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRICELISTS.filter((item)=>item.title.toLowerCase().includes(pricelistFilter.toLowerCase())).map((pricelist)=>
                      <tr key={pricelist.id}
                        className={"clickable" + (parseInt(match.params.id) === pricelist.id ? " active":"")}
                        onClick={()=>{history.push('/helpdesk/settings/pricelists/'+pricelist.id)}}>
                        <td>
                          {pricelist.title}
                        </td>
                        <td width="10%">
                          {pricelist.def ? "Default" : ""}
                        </td>
                        <td>
                          {pricelist.order}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="commandbar">
              </div>
              <div className="p-20 scroll-visible fit-with-header-and-commandbar">
                {
                  match.params.id && match.params.id==='add' && <PriceAdd {...props} />
                }
                {
                  loading && match.params.id && match.params.id!=='add' && <Loading />
                }
                {
                  match.params.id && match.params.id!=='add' && PRICELISTS.some((item)=>item.id===parseInt(match.params.id)) && <PriceEdit {...{history, match}} />
                }
              </div>
            </div>
          </div>
        </div>
  );
}