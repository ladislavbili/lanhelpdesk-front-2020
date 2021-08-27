import React from 'react';
import TaskEdit from 'helpdesk/task/edit';

import ColumnList from './column';
import TableList from './table';
import DnDList from './dnd';
import Calendar from './calendar';
import GanttList from './gantt';
import Statistics from './statistics';

import moment from 'moment';


export default function TasklistSwitch( props ) {
  const {
    history,
    match,
    taskSearch,
    tasks,
    checkTask,
    orderBy,
    setOrderBy,
    ascending,
    setAscending,
    statuses,
    setStatuses,
    deleteTask,
    tasklistLayout,
    setTasklistLayout,
    localProject,
    canViewCalendar,
    currentUser,
  } = props;

  const taskID = match.params.taskID;

  const link = `/helpdesk/taskList/i/${match.params.listID ? match.params.listID : 'all' }`;

  const generalProps = {
    ...props,
    link
  }

  const myRights = currentUser.role.accessRights;

  let layout = 1;
  if ( tasklistLayout === 2 && localProject.id && myRights.tasklistLayout ) {
    layout = 2;
  } else if ( tasklistLayout === 3 && canViewCalendar && myRights.tasklistCalendar ) {
    layout = 3;
  } else if ( tasklistLayout === 4 && localProject.id && myRights.tasklistLayout ) {
    layout = 4;
  } else if ( tasklistLayout === 5 && localProject.id && myRights.tasklistLayout ) {
    layout = 5;
  }

  return (
    <div className="content-page">
      <div className="content" style={{ paddingTop: 0 }}>
        <div className="row m-0">
          { false &&
            <div className='col-xl-12'>
              <ColumnList {...generalProps} />
            </div>
          }

          { layout === 1 &&
            <div className="flex" >
              { taskID && <TaskEdit match={match} columns={false} history={history} /> }
              { !taskID &&
                <TableList {...generalProps} />
              }
            </div>
          }

          {layout === 2 &&
            <div className="col-xl-12" >
              {taskID && <TaskEdit match={match} columns={false} history={history} />}
              {!taskID &&
                <DnDList {...generalProps} />
              }
            </div>
          }
          {layout === 3 &&
            <div className='col-xl-12'>
              {taskID && <TaskEdit match={match} columns={false} history={history} />}
              {!taskID &&
                <Calendar {...generalProps} />
              }
            </div>
          }
          {layout === 4 &&
            <div className="col-xl-12" >
              {taskID && <TaskEdit match={match} columns={false} history={history} />}
              {!taskID &&
                <GanttList {...generalProps} />
              }
            </div>
          }
          {layout === 5 &&
            <div className='col-xl-12'>
              <Statistics {...generalProps} />
            </div>
          }
        </div>
      </div>
    </div>
  );
}

/*
const filterTasks = () => {
if ( taskSearch === "" ) {
return tasks;
}
return tasks.filter( ( task ) => {
return `${task.id} ${task.title}`.toLowerCase()
.includes( taskSearch.toLowerCase() );
} )
}

*/