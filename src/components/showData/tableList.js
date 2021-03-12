import React from 'react';
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

export default function TableList( props ) {
  const {
    defaultAttributesFilter,
    attributesFilter,
    setAttributeFilter,
    setAttributesFilter,
    currentUser,
    history,
    link,
    displayValues,
    data,
    checkItem,
    deleteMultiple,
    canDeleteMultiple,
    MultipleEdit,
    canEditMultiple
  } = props;

  const [ editOpen, setEditOpen ] = React.useState( false );

  const clearFilter = () => {
    if ( window.confirm( "Are you sure you want to clear the filter?" ) ) {
      setAttributesFilter( defaultAttributesFilter );
    }
  }

  const filteredDisplayValues = displayValues.filter( ( displayValue ) => displayValue.show )


  const filterItemByAttributes = ( item ) => {
    return filteredDisplayValues
      .every( ( display ) => {
        let value = getItemDisplayValue( item, display );
        if ( display.value === "assignedTo" ) {
          value = item[ "assignedTo" ].map( item => `${item.name} ${item.surname} (${item.email})` )
            .toString();
        }
        if ( display.value === "status" ) {
          value = item[ "status" ] ? item[ "status" ].title.toString() : "";
        }
        if ( display.value === "tags" ) {
          value = item[ "tags" ].map( item => `${item.title}` )
            .toString();
        }
        if ( display.value === "URL" ) {
          value = item[ "URL" ];
        }
        if ( display.value === "password" ) {
          value = item[ "password" ];
        }
        if ( display.value === 'important' ) {
          return true;
        }
        if ( display.value === 'invoiced' ) {
          return true;
        }
        if ( display.value === 'invoiced' ) {
          return true;
        }
        if ( display.value === 'checked' ) {
          return true;
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
      return <th key={display.value} className="row" colSpan={'1'} style={{color: '#0078D4', paddingLeft: "1px", paddingRight: "1px"}}>
        { canDeleteMultiple &&
          <div
            onClick={() => {
              if( !data.some( (item) => item.checked ) ){
                window.alert('Please first pick items to delete!');
                return;
              }
              if (window.confirm("Are you sure you want to delete checked items?")){
                deleteMultiple()
              }
            }}>
            <i className="far fa-trash-alt clickable"	/>
          </div>
        }
        { canEditMultiple &&
          <div
            className="ml-auto"
            onClick={() => {
              if( !data.some( (item) => item.checked ) ){
                window.alert('Please first pick items to edit!');
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
    } else if ( display.type === 'checkbox' ) {
      return <th key={display.value} colSpan={'1'} >
        <Checkbox
          className = "m-l-7 m-t-6 p-l-0"
          value = { data.every((item) => item.checked ) }
          label = ""
          onChange={ (e) => checkItem('all', e.target.checked) }
          highlighted={false}
          />
      </th>
    } else {
      const value = ( attributesFilter[ display.value ] === "cur" ? currentUser.fullName : attributesFilter[ display.value ] );
      return <th key={display.value} >
        <div className={(index === filteredDisplayValues.length - 1 ? "row" : "")}>

          <div style={index === filteredDisplayValues.length - 1 ? {flex: "1"} : {}}>
            <input
              type="text"
              value={ value }
              className="form-control"
              style={{fontSize: "12px", marginRight: "10px"}}
              onChange={(e) => {
                setAttributeFilter(display.value, e.target.value);
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

  const renderItem = ( item ) => {
    return (
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
                  onChange={(e)=> checkItem(item.id, e.target.checked)}
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
      <CommandBar {...props} />
      <div className="full-width scroll-visible fit-with-header-and-commandbar-4 task-container">
        <ListHeader {...props}/>
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
            { data.filter((item) => filterItemByAttributes(item) )
              .map((item) =>
              renderItem( item )
            )}
          </tbody>
        </table>
        { canEditMultiple &&
          <Modal isOpen={editOpen}>
            <ModalBody className="scrollable" >
              <MultipleEdit data={data.filter(d => d.checked)} close={() => setEditOpen(false)} />
            </ModalBody>
          </Modal>
        }

      </div>
    </div>
  );
}