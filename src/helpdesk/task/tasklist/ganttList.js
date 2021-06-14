import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";
import {
  Modal,
  ModalBody
} from 'reactstrap';
import {
  getItemDisplayValue,
  timestampToString,
} from 'helperFunctions';
import classnames from 'classnames';
import Checkbox from 'components/checkbox';
import Loading from 'components/loading';
import Empty from 'components/Empty';
import CommandBar from './components/commandBar';
import ListHeader from './components/listHeader';
import Pagination from './components/pagination';
import MultipleTaskEdit from 'helpdesk/task/edit/multipleTaskEdit';

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
    deleteTask,
    checkTask,
    currentUser,
    attributesFilter,
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
    return groups.sort( ( group1, group2 ) => {
        if ( group1.milestone === null ) {
          return 1;
        }
        if ( group2.milestone === null ) {
          return -1;
        }
        if ( group1.milestone.order > group2.milestone.order ) {
          return 1;
        }
        return -1;
      } )
      .map( ( group ) => ( {
        ...group,
        tasks: group.tasks.sort( ( task1, task2 ) => {
          if ( task1.startsAt === null && task2.startsAt === null ) {
            return 0;
          }
          if ( task1.startsAt === null ) {
            return 1;
          }
          if ( task2.startsAt === null ) {
            return -1;
          }
          if ( parseInt( task1.startsAt ) > parseInt( task2.startsAt ) ) {
            return 1;
          }
          return -1;
        } )
      } ) );
  }
  const [ editOpen, setEditOpen ] = React.useState( false );
  const [ groups, setGroups ] = React.useState( getMilestoneGroups() );

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

  const clearFilter = () => {
    if ( window.confirm( "Are you sure you want to clear the filter?" ) ) {
      setLocalTaskStringFilter( defaultTasksAttributesFilter );
      setGlobalTaskStringFilter();
    }
  }
  const filteredDisplayValues = displayValues.filter( ( displayValue ) => displayValue.show )

  const filterTaskByAttributes = ( task ) => {
    return filteredDisplayValues
      .every( ( display ) => {
        if ( [ 'important', 'invoiced', 'checked', 'works', 'trips', 'materialsWithoutDPH', 'materialsWithDPH' ].includes( display.value ) ) {
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
          if ( task[ display.value ] ) {
            value = `${timestampToString(task[ display.value ])} | ${timestampToString(task[ display.value ], true)}`;
          }
        }
        if ( display.value === "password" ) {
          value = task[ "password" ];
        }
        let result = value.toString()
          .toLowerCase()
          .includes( attributesFilter[ display.value ].toLowerCase() );
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
        className="row"
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
        { false &&
          <div
            className="m-l-5"
            onClick={() => {
              if(loading){
                return;
              }
              if( !tasks.some( (task) => task.checked ) ){
                window.alert('Please first pick tasks to edit!');
                return;
              }
              setEditOpen(true);
            }}>
            <i	className="fas fa-pen clickable"/>
          </div>
        }
      </th>
    }
    return (
      <th
        style={{
          ...(["createdAt"].includes(display.value) ? {textAlign: "right"} : {}),
        }}
        key={display.value}
        width={display.width ? display.width : '' }
        >
        {display.label}
      </th>
    )
  }
  const renderAttributeFilter = ( display, index ) => {
    if ( display.type === 'important' || display.type === 'invoiced' ) {
      return null;
    } else if ( [ 'works', 'trips', 'materialsWithoutDPH', 'materialsWithDPH' ].includes( display.value ) ) {
      return ( <th key={display.value} width={display.width ? display.width : '' } /> );
    } else if ( display.type === 'checkbox' ) {
      return <th key={display.value} width={display.width ? display.width : '' } >
        <Checkbox
          className = "m-l-7 m-t-6 p-l-0"
          disabled={loading}
          value = { tasks.every((task) => task.checked ) }
          label = ""
          onChange={ (e) => checkTask('all', e.target.checked) }
          highlighted={false}
          />
      </th>
    } else {
      const value = ( attributesFilter[ display.value ] === "cur" ? currentUser.fullName : attributesFilter[ display.value ] );
      return <th key={display.value} width={display.width ? display.width : '' } >
        <div className={(index === filteredDisplayValues.length - 1 ? "row" : "")}>

          <div style={index === filteredDisplayValues.length - 1 ? {flex: "1"} : {}}>
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
          {index === filteredDisplayValues.length - 1 &&
            <div className="ml-auto row">
              <button type="button" disabled={loading} className="btn-link m-l-8 m-r-5" onClick={clearFilter}>
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
                  if (display.type !== 'checkbox'){
                    history.push(`${ path }/${ task.id }`);
                  }
                }}
                >
                {	display.type !== 'checkbox' &&
                  renderWithIcons( filteredDisplayValues, task, index, getItemDisplayValue(task,display, attributesFilter[display.value]) )
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

  return (
    <div>
      <CommandBar
        {...props}
        />
      <div className="full-width scroll-visible fit-with-header-and-commandbar-4 task-container">
        <ListHeader
          {...props}
          gantt
          />
        <table className="table">
          <thead>
            <tr>
              { filteredDisplayValues.map((display) =>
                renderHeader(display)
              )}
            </tr>
          </thead>

          <tbody>
            <tr>
              { filteredDisplayValues.map((display,index) =>
                renderAttributeFilter(display,index)
              )}
            </tr>
            <tr>
              <td colSpan={filteredDisplayValues.length}>
                <h3>
                  {localProject.title}
                </h3>
              </td>
            </tr>
            { groups.map((group) => (
              <Empty key={ group.milestone === null ? 'null' : group.milestone.id }>
                <tr>
                  <td colSpan={filteredDisplayValues.length } className="noselect bolder-text" style={{fontSize: 14}}>
                    <i
                      className={classnames( "fa clickable p-l-5 p-r-5", { "fa-chevron-down": !group.show, "fa-chevron-up": group.show } )}
                      onClick={() => setGroupOpen(group.milestone) }
                      />
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
        <div className="bolder-text m-l-30 m-b-10">
          <p>Práca sumár</p>
          <p>Neschválených: 8 hodín</p>
          <p>Schválenych: 8 hodín</p>
          <p>Spolu: 16 hodín</p>
        </div>

        <div className="bolder-text m-l-30 m-b-10">
          <p>Vyjazd sumár ??</p>
        </div>

        <div className="bolder-text m-l-30 m-b-10">
          <p>Materiál sumár</p>
          <p>Neschválených: 100 EUR bez DPH</p>
          <p>Schválenych: 50 EUR bez DPH</p>
          <p>Spolu: 150 EUR bez DPH</p>
        </div>

        <Modal isOpen={editOpen}>
          <ModalBody className="scrollable" >
            <MultipleTaskEdit tasks={tasks.filter(d => d.checked)} close={() => setEditOpen(false)} />
          </ModalBody> </Modal>
        </div>
      </div>
  );
}