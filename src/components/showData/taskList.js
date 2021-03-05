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
  getItemDisplayValue
}
from 'helperFunctions';
import ListHeader from './listHeader';
import Checkbox from '../checkbox';

import MultipleTaskEdit from 'helpdesk/task/edit/multipleTaskEdit';


import {
  GET_TASKS_ATTRIBUTES_FILTER,
} from 'apollo/localSchema/queries';

import {
  setTasksAttributeFilter,
  setTasksAttributesFilter,
} from 'apollo/localSchema/actions';

import {
  defaultTasksAttributesFilter
} from 'configs/constants/tasks';


export default function List( props ) {
  const {
    history,
    link,
    displayValues,
    data,
    deleteTask,
    checkTask,
  } = props;

  const [ editOpen, setEditOpen ] = React.useState( false );

  const {
    data: tasksFilterData
  } = useQuery( GET_TASKS_ATTRIBUTES_FILTER );

  const currentUser = data ? data.getMyData : {};

  const clearFilter = () => {
    if ( window.confirm( "Are you sure you want to clear the filter?" ) ) {
      setTasksAttributesFilter( defaultTasksAttributesFilter );
    }
  }
  const filter = tasksFilterData.tasksAttributesFilter;
  const filteredDisplayValues = displayValues.filter( ( displayValue ) => displayValue.show )
  const renderWithIcons = ( displayValues, item, index, Component ) => {
    if ( ![ 'important', 'invoiced' ].includes( displayValues[ index - 1 ].type ) ) {
      return Component;
    }
    return (
      <span>
        {(displayValues[index-1].type === 'important' || displayValues[index-2].type === 'important') && getItemDisplayValue(item,displayValues.find((item) => item.type === 'important' )) }
        {(displayValues[index-1].type === 'invoiced' || displayValues[index-2].type === 'invoiced') && getItemDisplayValue(item,displayValues.find((item) => item.type === 'invoiced' )) }
        <span className="task-list-title" style={{
            paddingLeft:
            (
              ((displayValues[index-1].type === 'important' || displayValues[index-2].type === 'important') && !item.important) ? 20.75 : 0
            ) +
            (
              ((displayValues[index-1].type === 'invoiced' || displayValues[index-2].type === 'invoiced') && !item.invoiced) ? 15.5 : 0
            )
          }}>
          { Component }
        </span>
      </span>
    )
  }


  return (
    <div>
        <table className="table">
          <thead>
            <tr>
              {
                filteredDisplayValues.map((display,index)=> {
                  if(display.type==='important' || display.type==='invoiced' ) {
                    return null;
                  }else if (display.type === 'checkbox'){
                    return <th key={display.value} className="row" colSpan={'1'} style={{color: '#0078D4', paddingLeft: "1px", paddingRight: "1px"}}>
                      <div
                        onClick={() => {
                          if( !data.some( (item) => item.checked ) ){
                            window.alert('Please first pick tasks to delete!');
                            return;
                          }
                          if (window.confirm("Are you sure you want to delete checked tasks?")){
                            deleteTask()
                          }
                        }}>
                        <i className="far fa-trash-alt clickable"	/>
                      </div>
                      <div
                        className="ml-auto"
                        onClick={() => {
                          if( !data.some( (item) => item.checked ) ){
                            window.alert('Please first pick tasks to edit!');
                            return;
                          }
                          setEditOpen(true);
                        }}>
                        <i	className="fas fa-pen clickable"/>
                      </div>
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
              )}
            </tr>
          </thead>

          <tbody>
            <tr>
              { filteredDisplayValues.map((display,index)=>{
                  if(display.type==='important' || display.type==='invoiced'){
                    return null;
                  }else if (display.type === 'checkbox'){
                    return <th key={display.value} colSpan={'1'} >
                      <Checkbox
                        className = "m-l-7 m-t-6 p-l-0"
                        value = { data.every((item) => item.checked ) }
                        label = ""
                        onChange={ (e) => checkTask('all', e.target.checked) }
                        highlighted={false}
                        />
                    </th>
                  }else {
                    const value = (filter[display.value] === "cur" ? currentUser().fullName : filter[display.value]);
                    return <th key={display.value} >
                      <div className={(index === filteredDisplayValues.length - 1 ? "row" : "")}>

                        <div style={index === filteredDisplayValues.length - 1 ? {flex: "1"} : {}}>
                          <input
                            type="text"
                            value={ value }
                            className="form-control"
                            style={{fontSize: "12px", marginRight: "10px"}}
                            onChange={(e) => {
                              setTasksAttributeFilter(display.value, e.target.value);
                            }}
                            />
                        </div>
                        {index === filteredDisplayValues.length - 1 &&
                          <div className="ml-auto row">
                            <button type="button" className="btn-link m-l-8 m-r-5" onClick={clearFilter}>
                              <i
                                className="fas fa-times commandbar-command-icon text-highlight"
                                />
                            </button>
                            <button type="button" className="btn" onClick={() => {}}>
                              Filter
                            </button>
                          </div>
                        }
                      </div>
                    </th>
                  }
                }
              )}
            </tr>
            {
              data
              .filter((item) =>
              {
                return filteredDisplayValues
                .every((display)=> {
                  let value = getItemDisplayValue(item,display);
                  if(display.value === "assignedTo"){
                    value = item["assignedTo"].map(item => `${item.name} ${item.surname} (${item.email})`).toString();
                  }
                  if(display.value === "status"){
                    value = item["status"] ? item["status"].title.toString() : "";
                  }
                  if(display.value === "tags"){
                    value = item["tags"].map(item => `${item.title}`).toString();
                  }
                  if(display.value === "URL"){
                    value = item["URL"];
                  }
                  if(display.value === "password"){
                    value = item["password"];
                  }
                  if(display.value === 'important'){
                    return true;
                  }
                  if(display.value === 'invoiced'){
                    return true;
                  }
                  if(display.value === 'invoiced'){
                    return true;
                  }
                  if(display.value === 'checked'){
                    return true;
                  }
                  let result = value.toString().toLowerCase().includes(filter[display.value].toLowerCase());
                  return result;
                });
              }).map((item)=>
              <tr
                key={item.id}
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
                          ...(["createdAt", "deadline"].includes(display.value) ? {textAlign: "right"} : {}),
                        }}
                        key={display.value}
                        className={display.value}
                        onClick={(e)=>{
                          if (display.type !== 'checkbox'){
                            history.push(link+'/'+item.id);
                          }
                        }}
                        >
                        {	display.type !== 'checkbox' &&
                          renderWithIcons( filteredDisplayValues, item, index, getItemDisplayValue(item,display) )
                        }
                        { display.type === 'checkbox' &&
                          <Checkbox
                            className = "p-l-0"
                            value = { item.checked }
                            label = ""
                            disabled = { item.viewOnly === true }
                            onChange={(e)=> checkTask(item.id, e.target.checked)}
                            highlighted={false}
                            />
                        }
                      </td>
                    )
                  }
                )}
              </tr>
            )}
          </tbody>
        </table>

        <div className="row m-b-10 m-r-30">
          <div className="message success-message ml-auto">Loaded 50/242 tasks</div>
          <button className="btn-link m-r-5">
            Load all tasks |
          </button>
          <button className="btn-link">
            Load next 50 tasks
          </button>
        </div>


    <Modal isOpen={editOpen}>
    <ModalBody className="scrollable" >
          <MultipleTaskEdit tasks={data.filter(d => d.checked)} close={() => setEditOpen(false)} />
        </ModalBody> </Modal>

    </div>
  );
}