import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import classnames from 'classnames';
import moment from 'moment';

import {
  Modal,
  ModalBody
} from 'reactstrap';
import ModalTaskEdit from 'helpdesk/task/edit/modalEdit';
import Checkbox from 'components/checkbox';
import Loading from 'components/loading';
import Empty from 'components/Empty';
import DatePicker from 'components/DatePicker';
import CommandBar from '../components/commandBar';
import Pagination from '../components/pagination';
import ActiveSearch from '../components/activeSearch';
import MultipleTaskEdit from 'helpdesk/task/edit/multipleTaskEdit';

import {
  getItemDisplayValue,
  timestampToString,
} from 'helperFunctions';

import {
  defaultTasksAttributesFilter
} from 'configs/constants/tasks';

export default function TableList( props ) {
  const {
    history,
    match,
    loading,
    localProject,
    displayValues,
    tasks,
    totals,
    deleteTask,
    checkTask,
    currentUser,
    localStringFilter,
    setLocalTaskStringFilter,
    setSingleLocalTaskStringFilter,
    setGlobalTaskStringFilter,
  } = props;

  let path = `/helpdesk/taskList/i/${match.params.listID}`;
  if ( match.params.page ) {
    path = `${path}/p/${match.params.page}`
  }
  const getMilestoneGroups = () => {
    let groups = [];
    tasks.forEach( ( task ) => {
      let groupIndex = groups.findIndex( ( group ) => (
        ( group.milestone === null && task.milestone === null ) ||
        ( group.milestone !== null && task.milestone !== null && group.milestone.id === task.milestone.id )
      ) );
      if ( groupIndex !== -1 ) {
        groups[ groupIndex ] = {
          ...groups[ groupIndex ],
          tasks: [ ...groups[ groupIndex ].tasks, task ]
        }
      } else {
        groups.push( {
          milestone: task.milestone,
          tasks: [ task ],
          show: true
        } )
      }
    } )
    return groups;
  }
  const [ editOpen, setEditOpen ] = React.useState( false );
  const [ groups, setGroups ] = React.useState( getMilestoneGroups() );
  const [ editedTask, setEditedTask ] = React.useState( null );

  React.useEffect( () => {
    if ( !loading ) {
      setGroups( getMilestoneGroups() );
    }
  }, [ loading ] );

  const setGroupOpen = ( milestone ) => {
    const index = groups.findIndex( ( group ) => ( group.milestone === null && milestone === null ) || ( group.milestone !== null && milestone !== null && group.milestone.id === milestone.id ) );
    let newGroups = [ ...groups ];
    newGroups[ index ] = {
      ...newGroups[ index ],
      show: !newGroups[ index ].show
    }
    setGroups( newGroups );
  }

  const filteredDisplayValues = displayValues.filter( ( displayValue ) => displayValue.show )

  const filterTaskByAttributes = ( task ) => {
    return filteredDisplayValues
      .every( ( display ) => {
        if ( [ 'important', 'invoiced', 'checked', 'works', 'trips', 'materialsWithoutDPH', 'materialsWithDPH', 'subtasks', 'subtaskAssigned', 'subtasksHours' ].includes( display.value ) ) {
          return true;
        }
        let value = getItemDisplayValue( task, display );
        if ( display.value === "assignedTo" ) {
          value = task[ "assignedTo" ].map( user => `${user.fullName} (${user.email})` )
            .toString();
        }
        if ( display.value === "status" ) {
          value = task[ "status" ] ? task[ "status" ].title.toString() : "";
        }
        if ( display.value === "tags" ) {
          value = task[ "tags" ].map( task => `${task.title}` )
            .toString();
        }
        if ( display.value === "URL" ) {
          value = task[ "URL" ];
        }
        if ( display.type === "date" ) {
          if ( localStringFilter[ display.value ] === null ) {
            return true;
          }
          if ( task[ display.value ] === null ) {
            return false;
          }
          const value = parseInt( task[ display.value ] );
          const start = ( localStringFilter[ display.value ] )
            .startOf( 'day' )
            .valueOf();
          const end = ( localStringFilter[ display.value ] )
            .endOf( 'day' )
            .valueOf();
          return start <= value && end >= value;
        }
        if ( display.value === "password" ) {
          value = task[ "password" ];
        }
        let result = value.toString()
          .toLowerCase()
          .includes( localStringFilter[ display.value ].toLowerCase() );
        return result;
      } );
  }

  const renderHeader = ( display ) => {
    if ( display.type === 'important' || display.type === 'invoiced' ) {
      return null;
    } else if ( display.type === 'checkbox' ) {
      return <th
        width={display.width ? display.width : '' }
        key={display.value}
        className={`row ${display.className ? display.className : '' }` }
        style={{color: '#0078D4', paddingLeft: "1px", paddingRight: "1px" }}
        >
        <div
          onClick={() => {
            if(loading){
              return;
            }
            if( !tasks.some( (task) => task.checked ) ){
              window.alert('Please first pick tasks to delete!');
              return;
            }
            deleteTask()
          }}>
          <i className="far fa-trash-alt clickable m-l-5"	/>
        </div>
      </th>
    }
    return (
      <th
        style={{
          ...(["createdAt"].includes(display.value) ? {textAlign: "right"} : {}),
        }}
        key={display.value}
        className={` ${display.className ? display.className : '' }` }
        width={display.width ? display.width : '' }
        >
        {display.label}
      </th>
    )
  }
  const renderAttributeFilter = ( display, index ) => {
    const last = index === filteredDisplayValues.length - 1;
    if ( display.type === 'important' || display.type === 'invoiced' ) {
      return null;
    } else if ( [ 'works', 'trips', 'materialsWithoutDPH', 'materialsWithDPH' ].includes( display.value ) ) {
      return ( <th key={display.value} width={display.width ? display.width : '' } className={` ${display.className ? display.className : '' }` } /> );
    } else if ( display.type === 'checkbox' ) {
      return <th key={display.value} width={display.width ? display.width : '' } className={` ${display.className ? display.className : '' }` } >
        <Checkbox
          className = "m-l-7 m-t-6 p-l-0"
          disabled={loading}
          value = { tasks.every((task) => task.checked ) }
          label = ""
          onChange={ (e) => checkTask('all', e.target.checked) }
          highlighted={false}
          />
      </th>
    } else if ( display.type === 'date' ) {
      return <th key={display.value} width="40" cclassName={` ${ last ? 'width-200' : '' } ${ display.className ? display.className : '' }` }>
        <div className={(last ? "row" : "")}>
          <div style={last ? {flex: "1"} : {}}>
            <DatePicker
              className="form-control"
              selected={localStringFilter[ display.value ]}
              hideTime
              disabled={loading}
              isClearable
              onChange={date => {
                setSingleLocalTaskStringFilter(display.value, isNaN(date.valueOf()) ? null : date);
              }}
              />
          </div>
          {last &&
            <div className="ml-auto row">
              <button type="button" disabled={loading} className="btn-link m-l-8 m-r-5" onClick={() => setLocalTaskStringFilter( defaultTasksAttributesFilter ) }>
                <i
                  className="fas fa-times commandbar-command-icon text-highlight"
                  />
              </button>
              <button type="button" disabled={loading} className="btn" onClick={setGlobalTaskStringFilter}>
                Filter
              </button>
            </div>
          }
        </div>
      </th>
    } else {
      const value = ( localStringFilter[ display.value ] === "cur" ? currentUser.fullName : localStringFilter[ display.value ] );
      return <th key={display.value} width={display.width ? display.width : '' } className={` ${display.className ? display.className : '' }` } >
        <div className={(last ? "row" : "")}>

          <div style={last ? {flex: "1"} : {}}>
            <input
              disabled={loading}
              type="text"
              value={ value }
              className="form-control"
              style={{fontSize: "12px", marginRight: "10px"}}
              onChange={(e) => {
                setSingleLocalTaskStringFilter(display.value, e.target.value);
              }}
              />
          </div>
          {last &&
            <div className="ml-auto row">
              <button type="button" disabled={loading} className="btn-link m-l-8 m-r-5" onClick={() => setLocalTaskStringFilter( defaultTasksAttributesFilter ) }>
                <i className="fas fa-times commandbar-command-icon text-highlight" />
              </button>
              <button type="button" disabled={loading} className="btn" onClick={setGlobalTaskStringFilter}>
                Filter
              </button>
            </div>
          }
        </div>
      </th>
    }
  }
  const renderWithIcons = ( displayValues, task, index, Component ) => {
    if ( index === 0 || ![ 'important', 'invoiced' ].includes( displayValues[ index - 1 ].type ) ) {
      return Component;
    }
    return (
      <span>
        {
          (displayValues[index-1].type === 'important' || displayValues[index-2].type === 'important') && getItemDisplayValue(task,displayValues.find((displayValue) => displayValue.type === 'important' ))
        }
        {(
          displayValues[index-1].type === 'invoiced' || displayValues[index-2].type === 'invoiced') && getItemDisplayValue(task,displayValues.find((displayValue) => displayValue.type === 'invoiced' ))
        }
        <span className="task-list-title" style={{
            paddingLeft:
            (
              ((displayValues[index-1].type === 'important' || displayValues[index-2].type === 'important') && !task.important) ? 20.75 : 0
            ) +
            (
              ((displayValues[index-1].type === 'invoiced' || displayValues[index-2].type === 'invoiced') && !task.invoiced) ? 15.5 : 0
            )
          }}>
          { Component }
        </span>
      </span>
    )
  }
  const renderTask = ( task ) => {
    return (
      <tr
        key={task.id}
        className="clickable">
        <td/>
        { filteredDisplayValues
          .map((display,index)=>{
            if(display.value === "important" || display.value === "invoiced" ){
              return null;
            }
            return (
              <td
                colSpan={ (index === filteredDisplayValues.length-1) ? "2" : "1" }
                style={{
                  ...(["createdAt"].includes(display.value) ? {textAlign: "right"} : {}),
                }}
                key={display.value}
                className={display.value}
                onClick={(e)=>{
                  if (display.type !== 'checkbox' && display.value !== 'subtasks' ){
                    setEditedTask(task);
                    //history.push(`${ path }/${ task.id }`);
                  }
                }}
                >
                {	display.type !== 'checkbox' &&
                  renderWithIcons( filteredDisplayValues, task, index, getItemDisplayValue(task,display, localStringFilter[display.value]) )
                }
                { display.type === 'checkbox' &&
                  <Checkbox
                    className = "p-l-0"
                    value = { task.checked }
                    label = ""
                    disabled = { task.viewOnly === true }
                    onChange={(e)=> checkTask(task.id, e.target.checked)}
                    highlighted={false}
                    />
                }
              </td>
            )
          }
        )}
      </tr>
    )
  }

  const getMilestoneDates = ( milestone ) => {
    if ( milestone === null ) {
      return {
        startsAt: '---',
        endsAt: '---',
      }
    }
    return {
      startsAt: milestone.startsAt === null ? '---' : timestampToString( milestone.startsAt ),
      endsAt: milestone.endsAt === null ? '---' : timestampToString( milestone.endsAt ),
    }
  }

  return (
    <div>
      <CommandBar
        {...props}
        showSort
        showPreferences={currentUser.role.accessRights.tasklistPreferences}
        gantt
        />
      <div className="full-width scroll-visible fit-with-header-and-commandbar-list task-container">
        <table className="table">
          <thead>
            <tr>
              <th width="22" />
              { filteredDisplayValues.map((display) =>
                renderHeader(display)
              )}
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={{ background: 'inherit' }}></td>
              { filteredDisplayValues.map((display,index) =>
                renderAttributeFilter(display,index)
              )}
            </tr>
            <ActiveSearch {...props} table />
            { groups.map((group) => (
              <Empty key={ group.milestone === null ? 'null' : group.milestone.id }>
                <tr onClick={() => setGroupOpen(group.milestone) } className="clickable bolder" >
                  <td>
                    <i className={classnames( "fa p-l-5 p-r-5", { "fa-chevron-down": !group.show, "fa-chevron-up": group.show } )} />
                    </td>
                  <td>
                    { getMilestoneDates(group.milestone).endsAt }
                  </td>
                  <td>
                    { getMilestoneDates(group.milestone).endsAt }
                  </td>
                  <td colSpan={filteredDisplayValues.length - 2 } className="noselect bolder" style={{fontSize: 14}}>
                    {group.milestone ? group.milestone.title : 'Without milestone' }
                  </td>
                </tr>
                { group.show && group.tasks
                  .filter((task) => filterTaskByAttributes(task) )
                  .map((task) =>
                  renderTask(task)
                )}
              </Empty>
            ))}
            { loading &&
              <tr>
                <td colSpan="100">
                  <Loading />
                </td>
              </tr>
            }
          </tbody>
        </table>
        <Pagination {...props} taskList/>
        <div className="m-l-30 m-b-10">
          <h4>Práca</h4>
          <p>
            Neschválených: { totals.pendingSubtasks } hodín
          </p>
          <p>
            Schválenych: { totals.approvedSubtasks } hodín
          </p>
          <p>
            Spolu: { totals.pendingSubtasks + totals.approvedSubtasks } hodín
          </p>
        </div>

        <div className="m-l-30 m-b-10">
          <h4>Materiál</h4>
          <p>
            Neschválených: { totals.pendingMaterials } EUR bez DPH
          </p>
          <p>
            Schválenych: { totals.approvedMaterials } EUR bez DPH
          </p>
          <p>
            Spolu: { totals.pendingMaterials + totals.approvedMaterials } EUR bez DPH
          </p>
        </div>

        <Modal isOpen={editOpen}>
          <ModalBody className="scrollable" >
            <MultipleTaskEdit tasks={tasks.filter(d => d.checked)} close={() => setEditOpen(false)} />
          </ModalBody>
        </Modal>
      </div>
      <ModalTaskEdit opened={editedTask} taskID={ editedTask ? editedTask.id : null } closeModal={ () => setEditedTask(null) } />
    </div>
  );
}