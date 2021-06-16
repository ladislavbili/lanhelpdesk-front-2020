import React from 'react';
import {
  useQuery,
  gql
}
from "@apollo/client";
import {
  Modal,
  ModalBody
}
from 'reactstrap';
import {
  getItemDisplayValue,
  timestampToString,
}
from 'helperFunctions';
import Checkbox from 'components/checkbox';
import Loading from 'components/loading';
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
  const [ editOpen, setEditOpen ] = React.useState( false );

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
        if ( [ 'important', 'invoiced', 'checked', 'works', 'trips', 'materialsWithoutDPH', 'materialsWithDPH', 'scheduled' ].includes( display.value ) ) {
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
        width="40"
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
        style={(display.value === "createdAt" ? {textAlign: "right"} : {})}
        key={display.value}
        width={display.value === 'title' ? "30%" : ((display.value === "id" || display.value === "status") ? "50px" : '')}>
        {display.label}
      </th>
    )
  }
  const renderAttributeFilter = ( display, index ) => {
    if ( display.type === 'important' || display.type === 'invoiced' ) {
      return null;
    } else if ( [ 'works', 'trips', 'materialsWithoutDPH', 'materialsWithDPH' ].includes( display.value ) ) {
      return ( <th key={display.value} width="40" /> );
    } else if ( display.type === 'checkbox' ) {
      return <th key={display.value} width="40" >
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
      return <th key={display.value} >
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
    if ( ![ 'important', 'invoiced' ].includes( displayValues[ index - 1 ].type ) ) {
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
                  ...(["createdAt", "deadline", "startsAt"].includes(display.value) ? {textAlign: "right"} : {}),
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
            {
              tasks
              .filter((task) => filterTaskByAttributes(task) )
              .map((task) =>
              renderTask(task)
            )}
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

        <Modal isOpen={editOpen}>
          <ModalBody className="scrollable" >
            <MultipleTaskEdit tasks={tasks.filter(d => d.checked)} close={() => setEditOpen(false)} />
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
}