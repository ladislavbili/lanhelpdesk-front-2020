import React from 'react';
import {
  useQuery
} from "@apollo/client";

import {
  Button
} from 'reactstrap';
import Loading from 'components/loading';
import classnames from 'classnames';

import {
  intervals
} from 'configs/constants/repeat';

import Repeat from './repeatFormModal';


import {
  GET_REPEATS
} from './queries';

export default function RepeatList( props ) {
  // state
  const [ repeatFilter, setRepeatFilter ] = React.useState( "" );
  const [ openRepeat, setOpenRepeat ] = React.useState( null );

  //data
  const {
    history,
    match
  } = props;
  const {
    data: repeatsData,
    loading: repeatsLoading
  } = useQuery( GET_REPEATS, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  } );

  if ( repeatsLoading ) {
    return ( <Loading /> )
  }

  return (
    <div className="content">
      <div className="row m-0 p-0 taskList-container">
        <div className="commandbar">
          <div className="m-l-20 search-row">
            <div className="search">
              <button className="search-btn" type="button">
                <i className="fa fa-search" />
              </button>
              <input
                type="text"
                className="form-control search-text search"
                value={repeatFilter}
                onChange={(e)=>setRepeatFilter(e.target.value)}
                placeholder="Search"
                />
            </div>
          </div>
        </div>
        <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar full-width">
          <h2 className=" p-l-10 p-b-10 ">
            Repeats
          </h2>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Title</th>
                <th>Repeat timing</th>
                <th>Project</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {repeatsData.repeats.filter( (repeat) => repeat.repeatTemplate.title.toLowerCase().includes(repeatFilter.toLowerCase())).map((repeat) =>
                <tr key={repeat.id}
                  className={classnames (
                    "clickable",
                  )}
                  onClick={()=>{ setOpenRepeat(repeat) }}>
                  <td>
                    {repeat.repeatTemplate.title}
                  </td>
                  <td width="10%">
                    {("Opakovať každý " + repeat.repeatEvery + ' ' + intervals.find((interval) => interval.value === repeat.repeatInterval ).title)}
                  </td>
                  <td>
                    {repeat.repeatTemplate.project.title}
                  </td>
                  <td>
                    <span
                      className="label label-info"
                      style={{
                        backgroundColor: repeat.repeatTemplate.status
                        ? repeat.repeatTemplate.status.color
                        : "white"
                      }}
                      >
                      {
                        repeat.repeatTemplate.status
                        ? repeat.repeatTemplate.status.title
                        : "No status"
                      }
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Repeat
        isOpen={openRepeat !== null}
        repeat={ openRepeat }
        closeModal={() => setOpenRepeat(null)}
        />
    </div>
  );
}