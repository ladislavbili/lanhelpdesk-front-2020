import React from 'react';
import {
  useQuery
} from "@apollo/react-hooks";
import gql from "graphql-tag";

import {
  Button
} from 'reactstrap';
import TripTypeAdd from './tripTypeAdd';
import TripTypeEdit from './tripTypeEdit';
import Loading from 'components/loading';
import {
  orderArr
} from 'helperFunctions';

export const GET_TRIP_TYPES = gql `
query {
  tripTypes {
    title
    id
    order
  }
}
`;

export default function TripTypeListContainer( props ) {
  // state
  const [ tripTypeFilter, setTripTypeFilter ] = React.useState( "" );

  //data
  const {
    history,
    match
  } = props;
  const {
    data,
    loading
  } = useQuery( GET_TRIP_TYPES );

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
                  value={tripTypeFilter}
                  onChange={(e) => setTripTypeFilter(e.target.value)}
                  placeholder="Search"
                  />
              </div>
            </div>
            <Button
              className="btn-link center-hor"
              onClick={ () => history.push('/helpdesk/settings/tripTypes/add') }>
              <i className="fa fa-plus p-l-5 p-r-5"/> Trip type
            </Button>
          </div>
          <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
            <h2 className=" p-l-10 p-b-10 ">
              Trip type
            </h2>
            <table className="table table-hover">
              <tbody>
                  { (loading || !data ? [] : orderArr(data.tripTypes)).filter((item)=>item.title.toLowerCase().includes(tripTypeFilter.toLowerCase())).map((tripType)=>
                  <tr key={tripType.id}
                    className={"clickable" + (match.params.id === tripType.id ? " active":"")}
                    onClick={()=>history.push('/helpdesk/settings/tripTypes/'+tripType.id)}>
                    <td>
                      {tripType.title}
                    </td>
                    <td>
                      {tripType.order?tripType.order:0}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            { loading &&
              <Loading />
            }
          </div>
        </div>
        <div className="col-lg-8">
          <div className="commandbar"></div>
          {
            match.params.id && match.params.id==='add' && <TripTypeAdd history={history} />
          }
          {
            loading && match.params.id && match.params.id!=='add' && <Loading />
          }
          {
            !loading && match.params.id && match.params.id!=='add' && data.tripTypes.some((item)=> item.id.toString() === match.params.id) && <TripTypeEdit {...{history, match}} />
          }
        </div>
      </div>
    </div>
  )
}