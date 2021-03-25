import React from 'react';
import TaskEdit from 'helpdesk/task/edit';

import ColumnList from './columnList';
import TableList from './tableList';
import DnDList from './dndList';
import Calendar from './calendar';
import Statistics from './statistics';

import moment from 'moment';


export default function TasklistSwitch( props ) {
  const {
    history,
    match,
    taskSearch,
    tasks,
    checkTask,
    preference,
    setPreference,
    orderBy,
    setOrderBy,
    ascending,
    setAscending,
    statuses,
    setStatuses,
    deleteTask,
    tasklistLayout,
    setTasklistLayout,
  } = props;

  const displayValues = [
    {
      value: 'checked',
      label: '',
      type: 'checkbox',
      show: true
    },
    {
      value: 'id',
      label: 'ID',
      type: 'int',
      show: preference[ 'taskId' ],
      visKey: 'taskId'
    },
    {
      value: 'status',
      label: 'Status',
      type: 'object',
      show: preference[ 'status' ]
    },
    {
      value: 'important',
      label: 'Important',
      type: 'important',
      show: preference[ 'important' ]
    },
    {
      value: 'invoiced',
      label: 'Invoiced',
      type: 'invoiced',
      show: preference[ 'invoiced' ]
    },
    {
      value: 'title',
      label: 'Title',
      type: 'text',
      show: preference[ 'title' ]
    },
    {
      value: 'project',
      label: 'Project',
      type: 'object',
      show: preference[ 'project' ]
    },
    {
      value: 'milestone',
      label: 'Milestone',
      type: 'object',
      show: preference[ 'milestone' ]
    },
    {
      value: 'requester',
      label: 'Requester',
      type: 'user',
      show: preference[ 'requester' ]
    },
    {
      value: 'company',
      label: 'Company',
      type: 'object',
      show: preference[ 'company' ]
    },
    {
      value: 'assignedTo',
      label: 'Assigned',
      type: 'list',
      func: ( items ) => (
        <div>
          { items.map((item)=><div key={item.id}>{item.fullName}</div>) }
        </div>
      ),
      show: preference[ 'assignedTo' ]
    },
    {
      value: 'tags',
      label: 'Tags',
      type: 'list',
      func: ( items ) => (
        <div>
          { items.map((item)=>(
            <div style={{ background: item.color, color: 'white', borderRadius: 3 }} className="m-r-5 m-t-5 p-l-5 p-r-5">
              {item.title}
            </div>
          ) ) }
        </div>
      ),
      show: preference[ 'tags' ]
    },
    {
      value: 'taskType',
      label: 'Task Type',
      type: 'object',
      show: preference[ 'taskType' ]
    },
    {
      value: 'createdAt',
      label: 'Created at',
      type: 'date',
      show: preference[ 'createdAtV' ],
      visKey: 'createdAtV'
    },
    {
      value: 'deadline',
      label: 'Deadline',
      type: 'date',
      show: preference[ 'deadline' ]
    },
    {
      value: 'pausal',
      label: 'Pausal',
      type: 'boolean',
      show: preference[ 'pausal' ]
    },
    {
      value: 'overtime',
      label: 'Overtime',
      type: 'boolean',
      show: preference[ 'overtime' ]
    },
  ];
  const taskID = match.params.taskID;

  const link = `/helpdesk/taskList/i/${match.params.listID ? match.params.listID : 'all' }`;

  const [ showStatistics, setShowStatistics ] = React.useState( false );

  const filterTasks = () => {
    if ( taskSearch === "" ) {
      return tasks;
    }
    return tasks.filter( ( task ) => {
      return `${task.id} ${task.title}`.toLowerCase()
        .includes( taskSearch.toLowerCase() );
    } )
  }

  const generalProps = {
    ...props,
    showStatistics: showStatistics,
    setShowStatistics: setShowStatistics,
    tasks: filterTasks(),
    displayValues: displayValues,
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

          {(tasklistLayout === 1 || tasklistLayout === 0) && !showStatistics &&
            <div className="flex" >
              { taskID && <TaskEdit match={match} columns={false} history={history} /> }
              { !taskID &&
                <TableList {...generalProps} />
              }
            </div>
          }

          {tasklistLayout === 2 && !showStatistics &&
            <div className="col-xl-12" >
              {taskID && <TaskEdit match={match} columns={false} history={history} />}
              {!taskID &&
                <DnDList {...generalProps} />
              }
            </div>
          }
          {tasklistLayout === 3 && !showStatistics &&
            <div className='col-xl-12'>
              <Calendar {...generalProps} />
            </div>
          }
        </div>
      </div>
    </div>
  );
}