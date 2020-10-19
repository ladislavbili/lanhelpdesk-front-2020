import React from 'react';
import {
  useQuery
} from "@apollo/react-hooks";

import {
  Button
} from 'reactstrap';
import TaskTypeAdd from './taskTypeAdd';
import TaskTypeEdit from './taskTypeEdit';
import Loading from 'components/loading';
import {
  orderArr
} from 'helperFunctions';

import {
  GET_TASK_TYPES,
} from './querries';


export default function TaskTypeList( props ) {
  // state
  const [ taskTypeFilter, setTaskTypeFilter ] = React.useState( "" );

  //data
  const {
    history,
    match
  } = props;
  const {
    data,
    loading
  } = useQuery( GET_TASK_TYPES );

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
                  value={taskTypeFilter}
                  onChange={(e)=>setTaskTypeFilter(e.target.value)}
                  placeholder="Search"
                  />
              </div>
            </div>
            <Button
              className="btn-link center-hor"
              onClick={()=>history.push('/helpdesk/settings/taskTypes/add')}>
              <i className="fa fa-plus p-l-5 p-r-5"/> Work type
            </Button>
          </div>
          <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
            <h2 className=" p-l-10 p-b-10 ">
              Work types
            </h2>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th></th>
                  <th> Order </th>
                </tr>
              </thead>
              <tbody>
                { (loading || !data ? [] : orderArr(data.taskTypes)).filter((item)=>item.title.toLowerCase().includes(taskTypeFilter.toLowerCase())).map((taskType)=>
                  <tr key={taskType.id}
                    className={"clickable" + (parseInt(match.params.id) === taskType.id ? " active":"")}
                    onClick={()=>history.push('/helpdesk/settings/taskTypes/'+taskType.id)}>
                    <td>
                      {taskType.title}
                    </td>
                    <td>
                      {taskType.order}
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
            match.params.id && match.params.id==='add' && <TaskTypeAdd {...props}  />
          }
          {
            loading && match.params.id && match.params.id!=='add' && <Loading />
          }
          {
            !loading && match.params.id && match.params.id!=='add' && data.taskTypes.some((item)=>item.id.toString() ===match.params.id) && <TaskTypeEdit {...{history, match}} />
          }
        </div>
      </div>
    </div>
  )
}