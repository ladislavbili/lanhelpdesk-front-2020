import React, {
  Component
} from 'react';
import classnames from "classnames";
import {
  Button
} from 'reactstrap';
import {
  dashboard,
  allMilestones,
} from 'configs/constants/sidebar';


export default function Search( props ) {
  const {
    link,
    layout,
    isTask,
    history,
    taskSearch,
    setLocalProject,
    setLocalMilestone,
    setLocalTaskSearch,
    setGlobalTaskSearch,
  } = props;

  return (
    <div
      className={classnames( "search-row" )}
      >
      <div className="search">
        <input
          type="text"
          className="form-control search-text"
          value={taskSearch}
          onChange={(e)=>setLocalTaskSearch(e.target.value)}
          onKeyPress={(e)=>{
            if( e.key === 'Enter' ){
              setGlobalTaskSearch()
            }
          }}
          placeholder="Search in id and task title"
          />
        <button className="search-btn" type="button">
          <i className="fa fa-search flip" />
        </button>
      </div>

      <Button
        className="btn-link center-hor m-l-10"
        onClick={()=>{
          setLocalMilestone(allMilestones);
          setLocalProject(dashboard);
          history.push(`/helpdesk/taskList/i/all`)
        }}
        >
        Global search
      </Button>
      <Button
        className="btn-link center-hor m-l-10"
        onClick={setGlobalTaskSearch}
        >
        Search through tasks
      </Button>
    </div>
  );
}