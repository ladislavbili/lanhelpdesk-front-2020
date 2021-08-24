import React from 'react';
import {
  useQuery
} from "@apollo/client";

import Loading from 'components/loading';
import classnames from 'classnames';

import {
  intervals
} from 'configs/constants/repeat';

import Repeat from './repeatFormModal';

import {
  GET_PROJECT,
  GET_MILESTONE,
} from 'apollo/localSchema/queries';

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
    data: projectData,
    loading: projectLoading
  } = useQuery( GET_PROJECT );

  const {
    data: milestoneData,
    loading: milestoneLoading
  } = useQuery( GET_MILESTONE );

  const {
    data: repeatsData,
    loading: repeatsLoading
  } = useQuery( GET_REPEATS, {
    variables: {
      projectId: projectData.localProject.id,
      milestoneId: milestoneData.localMilestone.id,
    },
    fetchPolicy: 'network-only',
  } );

  if ( repeatsLoading ) {
    return ( <Loading /> )
  }

  /*  */
  return (
    <div className="content-page">
      <div className="content" style={{ paddingTop: 0 }}>
        <div className="row m-0">
          <div className="flex" >

            <div className="task-list-commandbar p-l-30">
              <div className="breadcrum-bar center-hor">
                <div className="breadcrumbs">
                  <h2>
                    Repeats
                  </h2>
                </div>
              </div>
            </div>

            <div className="full-width scroll-visible fit-with-header-and-commandbar-list task-container">

              <div className={classnames("d-flex", "h-60", "flex-row")}>
                <div
                  className={classnames(
                    "m-l-30",
                    "search-row",
                  )}
                  >
                  <div className="search">
                    <button className="search-btn" type="button">
                      <i className="fa fa-search flip" />
                    </button>
                    <input
                      type="text"
                      className="form-control search-text"
                      value={repeatFilter}
                      onChange={(e)=>setRepeatFilter(e.target.value)}
                      placeholder="Search"
                      />
                  </div>
                </div>
              </div>

              <table className = "table" >
                <thead>
                  <tr>
                    <th width="5%">Status</th>
                    <th>Title</th>
                    <th >Repeat timing</th>
                    <th >Project</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    repeatsData.repeats.filter( ( repeat ) => repeat.repeatTemplate.title.toLowerCase()
                    .includes( repeatFilter.toLowerCase() ) )
                    .map( ( repeat ) =>
                    <tr key={repeat.id}
                      className="clickable"
                      onClick={()=>{ setOpenRepeat(repeat) }}
                      >
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
                      <td>
                        {repeat.repeatTemplate.title}
                      </td>
                      <td>
                        {("Opakovať každý " + repeat.repeatEvery + ' ' + intervals.find((interval) => interval.value === repeat.repeatInterval ).title)}
                      </td>
                      <td>
                        {repeat.repeatTemplate.project.title}
                      </td>
                    </tr>
                  )
                }
              </tbody>
            </table>
            <Repeat
              isOpen={openRepeat !== null}
              repeat={openRepeat}
              closeModal={ () => setOpenRepeat( null ) }
              />
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}