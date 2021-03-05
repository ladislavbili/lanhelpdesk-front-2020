import React, {
  Component
} from 'react';
import {
  Button
} from 'reactstrap';
import classnames from "classnames";
import {
  useQuery
} from "@apollo/client";
import {
  GET_TASK_SEARCH,
} from 'apollo/localSchema/queries';
import {
  dashboard,
  allMilestones,
} from 'configs/constants/sidebar';

import {
  setMilestone,
  setProject,
  setTaskSearch,
} from 'apollo/localSchema/actions';

export default function Search( props ) {
  const {
    link,
    layout,
    isTask,
    history,
    //setFilter
  } = props;

  const {
    data: taskSearchData,
    loading: taskSearchLoading
  } = useQuery( GET_TASK_SEARCH );


  return (
    <div
      className={classnames(
        {"m-l-30": !link.includes("settings")},
        "search-row"
      )}
      >
      <div className="search">
        <input
          type="text"
          className="form-control search-text"
          value={taskSearchData.taskSearch}
          onChange={(e)=>setTaskSearch(e.target.value)}
          placeholder="Search"
          />
        <button className="search-btn" type="button">
          <i className="fa fa-search flip" />
        </button>
      </div>

      { isTask &&
        <Button
          className="btn-link center-hor m-l-10"
          onClick={()=>{
            setMilestone(allMilestones);
            setProject(dashboard);
            history.push(`/helpdesk/taskList/i/all`)
          }}
          >
          Global
        </Button>
      }
    </div>
  );
}