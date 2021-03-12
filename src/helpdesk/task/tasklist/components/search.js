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
    setTaskSearch,
  } = props;

  const [ search, setSearch ] = React.useState( taskSearch );

  return (
    <div
      className={classnames( "search-row" )}
      >
      <div className="search">
        <input
          type="text"
          className="form-control search-text"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          onKeyPress={(e)=>{
            if( e.key === 'Enter' ){
              setTaskSearch(search)
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
        Global
      </Button>
    </div>
  );
}