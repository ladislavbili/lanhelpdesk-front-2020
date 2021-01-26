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
import CommandBar from './commandBar';
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
    commandBar,
    listName,
    statuses,
    setStatuses,
    allStatuses,
    displayValues,
    data,
    deleteTask,
    checkTask,
    layout,
    underSearch: UnderSearch,
    underSearchLabel
  } = props;
  const [ editOpen, setEditOpen ] = React.useState( false );
  const [ underSearchOpen, setUnderSearchOpen ] = React.useState( false );

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

  return (
    <div>
      <CommandBar {...commandBar} listName={listName}/>
      <div className="full-width scroll-visible fit-with-header-and-commandbar task-container">
        <ListHeader
          {...commandBar}
          listName={listName}
          statuses={statuses}
          setStatuses={setStatuses}
          allStatuses={allStatuses}
          underSearchButtonEvent={() => setUnderSearchOpen(!underSearchOpen)}
          underSearchButtonLabel={underSearchLabel}
          layout={layout}
          />
        {
          UnderSearch !== undefined &&
          underSearchOpen &&
          <UnderSearch/>
        }
        <table className="table">
          <thead>
            <tr>
              {
                displayValues.map((display,index)=> {
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
                      style={(display.value === "createdAt" || display.value === "deadline" ? {textAlign: "right"} : {})}
                      colSpan={((index===0 || index ===1 || displayValues[index-1].type!=='important') && display.value !== "deadline")?'1':'2'}
                      key={display.value}
                      width={display.value === 'title' ? "30%" : ((display.value === "id") ? "50px" : '')}>
                      {display.label}
                    </th>
                  )
                }
              )}
            </tr>
          </thead>

          <tbody>
            <tr>
              {
                displayValues.map((display,index)=>{
                  if(display.type==='important' || display.type==='invoiced'){
                    return null;
                  }else if (display.type === 'checkbox'){
                    return <th key={display.value} colSpan={'1'} >
                      <Checkbox
                        className = "m-l-7 m-t-3 p-l-0"
                        value = { data.every((item) => item.checked ) }
                        label = ""
                        onChange={ (e) => checkTask('all', e.target.checked) }
                        highlighted={false}
                        />
                    </th>
                  }else {
                    const value = (filter[display.value] === "cur" ? currentUser().fullName : filter[display.value]);
                    return <th key={display.value} >
                      <div className={(display.value === "deadline" ? "row" : "")}>

                        <div style={{width: "80%"}}>
                          <input
                            type="text"
                            value={ value }
                            className="form-control hidden-input"
                            style={{fontSize: "12px", marginRight: "10px"}}
                            onChange={(e) => {
                              setTasksAttributeFilter(display.value, e.target.value);
                            }}
                            />
                        </div>
                        {display.value === "deadline" &&
                          <div>
                            <button type="button" className="btn btn-link waves-effect" onClick={clearFilter}>
                              <i
                                className="fas fa-times commandbar-command-icon m-l-8 text-highlight"
                                />
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
                return displayValues
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
                { displayValues
                  .map((display,index)=>{
                    if(display.value === "important" || display.value === "invoiced" ){
                      return null;
                    }
                    return (
                      <td
                        colSpan={(index===displayValues.length-1)?"2":"1"}
                        style={{
                          ...(display.value === "createdAt" || display.value === "deadline" ? {textAlign: "right"} : {}),
                        }}
                        key={display.value}
                        className={display.value}
                        onClick={(e)=>{
                          if (display.type !== 'checkbox'){
                            history.push(link+'/'+item.id);
                          }
                        }}
                        >
                        {	display.type !== 'checkbox' && display.value === 'title' &&
                          <span>
                            {(displayValues[index-1].type === 'important' || displayValues[index-2].type === 'important') && getItemDisplayValue(item,displayValues.find((item) => item.type === 'important' )) }
                            {(displayValues[index-1].type === 'invoiced' || displayValues[index-2].type === 'invoiced') && getItemDisplayValue(item,displayValues.find((item) => item.type === 'invoiced' )) }
                            <span style={{
                                paddingLeft:
                                (
                                  ((displayValues[index-1].type === 'important' || displayValues[index-2].type === 'important') && !item.important) ? 20.75 : 0
                                ) +
                                (
                                  ((displayValues[index-1].type === 'invoiced' || displayValues[index-2].type === 'invoiced') && !item.invoiced) ? 15.5 : 0
                                )
                              }}>
                              {getItemDisplayValue(item,display)}
                            </span>
                          </span>
                        }
                        {	display.type !== 'checkbox' && display.value !== 'title' &&
                          getItemDisplayValue(item,display)
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
      </div>


      <Modal isOpen={editOpen}  >
        <ModalBody className="scrollable" >
          <MultipleTaskEdit tasks={data.filter(d => d.checked)} close={() => setEditOpen(false)} />
        </ModalBody>
      </Modal>

    </div>
  );
}