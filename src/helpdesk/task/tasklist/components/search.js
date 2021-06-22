import React, {
  Component
} from 'react';
import classnames from "classnames";
import {
  Button
} from 'reactstrap';
import Loading from 'components/loading';
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
    loading,
    taskSearch,
    setLocalProject,
    setLocalMilestone,
    setLocalTaskSearch,
    setGlobalTaskSearch,
  } = props;

  return (
    <div
      className={classnames( "search-row" )}
      style={{ maxWidth: 700 }}
      >
      <div className="search">
        <input
          type="text"
          className="form-control search-text"
          value={taskSearch}
          onChange={(e)=>setLocalTaskSearch(e.target.value)}
          onKeyPress={(e)=>{
            if( e.key === 'Enter' && !loading ){
              setGlobalTaskSearch()
            }
          }}
          placeholder="Search in id and task title"
          />
        <button className="search-btn" type="button">
          <i className={`fa fa-${loading ? 'spinner' : 'search'} flip`} />
        </button>
      </div>

      <Button
        disabled={loading}
        className="btn-link center-hor m-l-10"
        onClick={() => {
          setLocalTaskSearch("");
          setGlobalTaskSearch();
        }}
        >
        <i className="fa fa-times" />
      </Button>
      <Button
        disabled={loading}
        className="btn-link center-hor m-l-10"
        onClick={setGlobalTaskSearch}
        >
        Backend
      </Button>
      <Button
        className="btn-link center-hor m-l-10"
        disabled={loading}
        onClick={()=>{
          setLocalMilestone(allMilestones);
          setLocalProject(dashboard);
          setGlobalTaskSearch();
          history.push(`/helpdesk/taskList/i/all`)
        }}
        >
        Global
      </Button>
    </div>
  );
}