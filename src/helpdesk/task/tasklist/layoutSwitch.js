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
  } = props;

  const taskID = match.params.taskID;

  const link = `/helpdesk/taskList/i/${match.params.listID ? match.params.listID : 'all' }`;

  const [ showStatistics, setShowStatistics ] = React.useState( false );

  const generalProps = {
    ...props,
    showStatistics: showStatistics,
    setShowStatistics: setShowStatistics,
    link
  }

  return (
    <div className="content-page">
      <div className="content" style={{ paddingTop: 0 }}>
        <div className="row m-0">
          { showStatistics &&
            <div className='col-xl-12'>
              <Statistics {...generalProps} />
            </div>
          }
          { false &&
            <div className='col-xl-12'>
              <ColumnList {...generalProps} />
            </div>
          }

          {( [ 0, 1 ].includes(tasklistLayout)  || ([ 2, 4 ].includes(tasklistLayout) && localProject.id === null ) || (tasklistLayout === 3 && !canViewCalendar ) ) && !showStatistics &&
            <div className="flex" >
              { taskID && <TaskEdit match={match} columns={false} history={history} /> }
              { !taskID &&
                <TableList {...generalProps} />
              }
            </div>
          }

          {tasklistLayout === 2 && localProject.id && !showStatistics &&
            <div className="col-xl-12" >
              {taskID && <TaskEdit match={match} columns={false} history={history} />}
              {!taskID &&
                <DnDList {...generalProps} />
              }
            </div>
          }
          {tasklistLayout === 3 && canViewCalendar && !showStatistics &&
            <div className='col-xl-12'>
              {taskID && <TaskEdit match={match} columns={false} history={history} />}
              {!taskID &&
                <Calendar {...generalProps} />
              }
            </div>
          }
          {tasklistLayout === 4 && localProject.id && !showStatistics &&
            <div className="col-xl-12" >
              {taskID && <TaskEdit match={match} columns={false} history={history} />}
              {!taskID &&
                <GanttList {...generalProps} />
              }
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