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
  const [ openRepeat, setOpenRepeat ] = React.useState( null );

  const [ statusFilter, setStatusFilter ] = React.useState( '' );
  const [ repeatTemplateFilter, setRepeatTemplateFilter ] = React.useState( '' );
  const [ repeatingFilter, setRepeatingFilter ] = React.useState( '' );
  const [ projectFilter, setProjectFilter ] = React.useState( '' );

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

  const filterForRepeats = ( repeat ) => {
    return (
      (
        repeat.repeatTemplate.status ?
        repeat.repeatTemplate.status.title :
        "No status"
      )
      .toLowerCase()
      .includes( statusFilter.toLowerCase() ) &&

      repeat.repeatTemplate.title.toLowerCase()
      .includes( repeatTemplateFilter.toLowerCase() ) &&

      ( "Opakovať každý " + repeat.repeatEvery + ' ' + intervals.find( ( interval ) => interval.value === repeat.repeatInterval )
        .title )
      .toLowerCase()
      .includes( repeatingFilter.toLowerCase() ) &&

      repeat.repeatTemplate.project.title.toLowerCase()
      .includes( projectFilter.toLowerCase() )
    );
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
                    Repetitive tasks
                  </h2>
                </div>
              </div>
            </div>

            <div className="full-width scroll-visible fit-with-header-and-commandbar-list task-container">

              <table className = "table" >
                <thead>
                  <tr>
                    <th width="5%">Status</th>
                    <th>Title</th>
                    <th>Repeat timing</th>
                    <th>Project</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th width="5%">
                      <input
                        type="text"
                        value={ statusFilter }
                        className="form-control"
                        style={{fontSize: "12px", marginRight: "10px"}}
                        onChange={(e) => {
                          setStatusFilter(e.target.value);
                        }}
                        />
                    </th>
                    <th>
                      <input
                        type="text"
                        value={ repeatTemplateFilter }
                        className="form-control"
                        style={{fontSize: "12px", marginRight: "10px"}}
                        onChange={(e) => {
                          setRepeatTemplateFilter(e.target.value);
                        }}
                        />
                    </th>
                    <th >
                      <input
                        type="text"
                        value={ repeatingFilter }
                        className="form-control"
                        style={{fontSize: "12px", marginRight: "10px"}}
                        onChange={(e) => {
                          setRepeatingFilter(e.target.value);
                        }}
                        />
                    </th>
                    <th >
                      <input
                        type="text"
                        value={ projectFilter }
                        className="form-control"
                        style={{fontSize: "12px", marginRight: "10px"}}
                        onChange={(e) => {
                          setProjectFilter(e.target.value);
                        }}
                        />
                    </th>
                  </tr>
                  { repeatsData.repeats.filter( filterForRepeats ).map( ( repeat ) =>
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