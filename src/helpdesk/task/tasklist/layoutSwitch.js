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

  return (
    <div className="content-page">
      <div className="content" style={{ paddingTop: 0 }}>
        <div className="row m-0">
          { false &&
            <div className='col-xl-12'>
              <ColumnList {...generalProps} />
            </div>
          }

          { tasklistLayout === 1 &&
            <div className="flex" >
              { taskID && <TaskEdit match={match} columns={false} history={history} /> }
              { !taskID &&
                <TableList {...generalProps} />
              }
            </div>
          }

          {tasklistLayout === 2 &&
            <div className="col-xl-12" >
              {taskID && <TaskEdit match={match} columns={false} history={history} />}
              {!taskID &&
                <DnDList {...generalProps} />
              }
            </div>
          }
          {tasklistLayout === 3 &&
            <div className='col-xl-12'>
              {taskID && <TaskEdit match={match} columns={false} history={history} />}
              {!taskID &&
                <Calendar {...generalProps} />
              }
            </div>
          }
          {tasklistLayout === 4 &&
            <div className="col-xl-12" >
              {taskID && <TaskEdit match={match} columns={false} history={history} />}
              {!taskID &&
                <GanttList {...generalProps} />
              }
            </div>
          }
          {tasklistLayout === 5 &&
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