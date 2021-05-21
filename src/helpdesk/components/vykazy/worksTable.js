import React from 'react';

import classnames from "classnames";
import {
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import Empty from 'components/Empty';
import Scheduled from './scheduled';
import Select from 'react-select';
import {
  pickSelectStyle
} from 'configs/components/select';
import Checkbox from 'components/checkbox';
import {
  objectToAtributeArray
} from 'helperFunctions';
import Switch from "react-switch";

const defaultCols = [
  {
    header: 'Done',
    key: 'done',
    width: null,
    headerClassnames: "",
    columnClassnames: "",
  },
  {
    header: 'Názov',
    key: 'title',
    width: null,
    headerClassnames: "",
    columnClassnames: "",
  },
  {
    header: 'Scheduled',
    key: 'scheduled',
    width: "15%",
    headerClassnames: "",
    columnClassnames: "p-l-8",
  },
  {
    header: 'Mn.',
    key: 'quantity',
    width: "50",
    headerClassnames: "t-a-r",
    columnClassnames: "p-l-5",
  },
  {
    header: 'Typ',
    key: 'type',
    width: "190",
    headerClassnames: "",
    columnClassnames: "p-l-8",
  },
  {
    header: 'Rieši',
    key: 'assigned',
    width: "12%",
    headerClassnames: "",
    columnClassnames: "p-l-8",
  },
  {
    header: 'Faktúrovať',
    key: 'approved',
    width: "12%",
    headerClassnames: "",
    columnClassnames: "",
  },
  {
    header: 'Akcie',
    key: 'actions',
    width: "8%",
    headerClassnames: "t-a-c",
    columnClassnames: "t-a-r",
  },
]

const getShownData = ( cols, autoApproved, newDefs = [] ) => {
  let shownData = [];
  const sourceDefs = [ ...newDefs, ...defaultCols ];
  cols.forEach( ( col ) => {
    const colData = sourceDefs.find( ( def ) => def.key === col );
    if ( colData && ( col !== 'approved' || !autoApproved ) ) {
      shownData.push( colData );
    }
  } );
  return shownData;
}

export default function Rozpocet( props ) {
  //data & queries
  const {
    userID,
    userRights,
    currentUser,
    showColumns,
    newColumnDefinitions,
    autoApproved,
    canAddSubtasksAndTrips,
    taskAssigned,
    taskTypes,
    defaultType,
    subtasks,
    addSubtask,
    updateSubtask,
    updateSubtasks,
    removeSubtask,
    tripTypes,
    workTrips,
    addTrip,
    updateTrip,
    updateTrips,
    removeTrip,
  } = props;

  const shownColumns = getShownData( showColumns, autoApproved, newColumnDefinitions ? newColumnDefinitions : [] );

  let defaultTab = '0';

  if ( userRights.vykazRead ) {
    defaultTab = '1';
  } else if ( userRights.rozpocetRead ) {
    defaultTab = '2';
  }

  //state
  let defaultAssigned = taskAssigned.length > 0 ? taskAssigned[ 0 ] : null;
  if ( objectToAtributeArray( taskAssigned, "id" )
    .includes( userID ) ) {
    defaultAssigned = taskAssigned.find( assigned => assigned.id === userID );
  }


  const [ toggleTab, setToggleTab ] = React.useState( defaultTab );
  const [ fakeScheduledFrom, setFakeScheduledFrom ] = React.useState( null );
  const [ fakeScheduledTo, setFakeScheduledTo ] = React.useState( null );

  //subtasks
  const [ showAddSubtask, setShowAddSubtask ] = React.useState( false );
  const [ editedSubtaskTitle, setEditedSubtaskTitle ] = React.useState( "" );
  const [ editedSubtaskQuantity, setEditedSubtaskQuantity ] = React.useState( 0 );
  const [ focusedSubtask, setFocusedSubtask ] = React.useState( null );
  const [ newSubtaskTitle, setNewSubtaskTitle ] = React.useState( "" );
  const [ newSubtaskType, setNewSubtaskType ] = React.useState( defaultType );
  const [ newSubtaskAssigned, setNewSubtaskAssigned ] = React.useState( defaultAssigned );
  const [ newSubtaskQuantity, setNewSubtaskQuantity ] = React.useState( 0 );
  const [ newSubtaskApproved, setNewSubtaskApproved ] = React.useState( false );

  //trips
  const [ showAddTrip, setShowAddTrip ] = React.useState( false );

  const [ editedTripQuantity, setEditedTripQuantity ] = React.useState( 0 );
  const [ focusedTrip, setFocusedTrip ] = React.useState( null );

  const [ newTripType, setNewTripType ] = React.useState( tripTypes.length > 0 ? tripTypes[ 0 ] : null );
  const [ newTripAssigned, setNewTripAssigned ] = React.useState( defaultAssigned );
  const [ newTripQuantity, setNewTripQuantity ] = React.useState( 1 );
  const [ newTripApproved, setNewTripApproved ] = React.useState( false );

  React.useEffect( () => {
    let defaultAssigned = taskAssigned.length > 0 ? taskAssigned[ 0 ] : null;
    if ( objectToAtributeArray( taskAssigned, "id" )
      .includes( userID ) ) {
      defaultAssigned = taskAssigned.find( assigned => assigned.id === userID );
    }
    setNewSubtaskAssigned( defaultAssigned );
    setNewTripAssigned( defaultAssigned );
  }, [ taskAssigned ] )

  React.useEffect( () => {
    setNewSubtaskType( defaultType )
  }, [ defaultType ] )

  React.useEffect( () => {
    if ( defaultType === null && taskTypes.length > 0 ) {
      setNewSubtaskType( taskTypes[ 0 ] )
    }
  }, [ taskTypes ] )

  const onFocusSubtask = ( subtask ) => {
    setEditedSubtaskTitle( subtask.title );
    setEditedSubtaskQuantity( subtask.quantity ? subtask.quantity : '' );
    setFocusedSubtask( subtask.id );
  }

  const onFocusWorkTrip = ( trip ) => {
    setEditedTripQuantity( trip.quantity );
    setFocusedTrip( trip.id );
  }

  let sortedSubtasks = subtasks.sort( ( work1, work2 ) => work1.order - work2.order );
  let sortedTrips = workTrips.sort( ( trip1, trip2 ) => trip1.order - trip2.order );
  let disabled = !(
    ( userRights.taskShortSubtasksWrite && toggleTab === '0' ) ||
    ( userRights.vykazWrite && toggleTab === '1' ) ||
    ( userRights.rozpocetWrite && toggleTab === '2' )
  )

  const getSubColRender = ( key, subtask, index ) => {
    switch ( key ) {
      case 'done': {
        return (
          <Checkbox
            className="m-t-5"
            disabled= { disabled || !canAddSubtasksAndTrips }
            value={ subtask.done }
            onChange={()=>{
              updateSubtask(subtask.id,{done:!subtask.done})
            }}
            />
        )
      }
      case 'title': {
        return (
          <input
            disabled={disabled || !canAddSubtasksAndTrips}
            className="form-control hidden-input"
            placeholder="Add note"
            value={
              subtask.id === focusedSubtask ?
              editedSubtaskTitle :
              subtask.title
            }
            onBlur={() => {
              updateSubtask(subtask.id,{title:editedSubtaskTitle})
              setFocusedSubtask(null);
            }}
            onFocus={() => onFocusSubtask(subtask)}
            onChange={e =>setEditedSubtaskTitle(e.target.value)}
            />
        )
      }
      case 'scheduled': {
        return (
          <Scheduled
            dateFrom={fakeScheduledFrom}
            dateTo={fakeScheduledTo}
            disabled={disabled || !canAddSubtasksAndTrips || !userRights.assignedWrite}
            needsSubmit={true}
            submit={(fromDate, toDate ) => {
              setFakeScheduledFrom(fromDate);
              setFakeScheduledTo(toDate);
            } }
            id={`sub-${subtask.id}`}
            />
        );
      }
      case 'quantity': {
        return (
          <input
            disabled={disabled || !canAddSubtasksAndTrips}
            type="text"
            pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
            className="form-control hidden-input h-30 t-a-r"
            value={
              subtask.id === focusedSubtask
              ? editedSubtaskQuantity.toString()
              : subtask.quantity.toString()
            }
            onBlur={() => {
              updateSubtask(subtask.id,{quantity:isNaN(parseFloat(editedSubtaskQuantity))?0:parseFloat(editedSubtaskQuantity)})
              setFocusedSubtask(null);
            }}
            onFocus={() => onFocusSubtask(subtask)}
            onChange={e =>setEditedSubtaskQuantity(e.target.value.replace(',', '.'))}
            />
        )
      }
      case 'type': {
        return (
          <Select
            isDisabled={disabled || !canAddSubtasksAndTrips}
            value={ subtask.type }
            onChange={(type)=>{
              updateSubtask(subtask.id,{type:type})
            }}
            options={taskTypes}
            styles={pickSelectStyle([ 'invisible', ])}
            />
        )
      }
      case 'assigned': {
        return (
          <Select
            isDisabled={disabled || !canAddSubtasksAndTrips}
            value={ subtask.assignedTo }
            onChange={(assignedTo)=>{
              updateSubtask(subtask.id,{assignedTo:assignedTo})
            }}
            options={taskAssigned}
            styles={pickSelectStyle([ 'invisible', ])}
            />
        );
      }
      case 'approved': {
        return (
          <div className="vykazy-approved">
            <Switch
              checked={subtask.approved}
              disabled={disabled || !canAddSubtasksAndTrips}
              onChange={ () => { updateSubtask( subtask.id, { approved: !subtask.approved } ) } }
              height={16}
              width={30}
              handleDiameter={12}
              checkedIcon={<span className="switchLabel"></span>}
              uncheckedIcon={<span className="switchLabel"></span>}
              onColor={"#0078D4"} />
            <span className="m-l-10">{ subtask.approved ? subtask.approvedBy.fullName : 'Neschválené' }</span>
          </div>
        )
      }
      case 'actions': {
        return (
          <Empty>
            <button
              className="btn-link btn-distance"
              disabled={ disabled || !canAddSubtasksAndTrips || index === 0 }
              onClick={()=>{
                updateSubtasks([
                  //update below
                  { id: sortedSubtasks[ index - 1 ].id, newData: { order: index } },
                  //update current
                  { id: subtask.id, newData: { order: index - 1 } }
                ]);
              }}
              >
              <i className="fa fa-arrow-up"  />
            </button>
            <button
              className="btn-link btn-distance"
              disabled={ disabled || !canAddSubtasksAndTrips || index === sortedSubtasks.length - 1 }
              onClick={()=>{
                updateSubtasks([
                  //update below
                  { id: sortedSubtasks[ index + 1 ].id, newData: { order: index } },
                  //update current
                  { id: subtask.id, newData: { order: index + 1 } }
                ]);
              }}
              >
              <i className="fa fa-arrow-down"  />
            </button>
            <button className="btn-link" disabled={disabled || !canAddSubtasksAndTrips}
              onClick={()=>{
                if(window.confirm('Are you sure?')){
                  removeSubtask(subtask.id);
                }
              }}>
              <i className="fa fa-times" />
            </button>
          </Empty>
        )
      }
      default: {
        return null;
      }
    };
  }

  const getTripColRender = ( key, trip, index ) => {
    switch ( key ) {
      case 'done': {
        return (
          <Checkbox
            className="m-t-5"
            disabled= { disabled || !canAddSubtasksAndTrips }
            value={ trip.done }
            onChange={()=>{
              updateTrip(trip.id,{done:!trip.done})
            }}
            />
        )
      }
      case 'title': {
        return (
          <Select
            isDisabled={disabled || !canAddSubtasksAndTrips }
            value={ trip.type }
            onChange={(type)=>{
              updateTrip(trip.id,{type:type})
            }}
            options={tripTypes}
            styles={pickSelectStyle([ 'invisible', ])}
            />
        )
      }
      case 'scheduled': {
        return (
          <Scheduled
            dateFrom={fakeScheduledFrom}
            dateTo={fakeScheduledTo}
            disabled={disabled || !canAddSubtasksAndTrips || !userRights.assignedWrite}
            needsSubmit={true}
            submit={(fromDate, toDate ) => {
              setFakeScheduledFrom(fromDate);
              setFakeScheduledTo(toDate);
            } }
            id={`trip-${trip.id}`}
            />
        );
      }
      case 'quantity': {
        return (
          <input
            disabled={disabled || !canAddSubtasksAndTrips}
            type="text"
            pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
            className="form-control hidden-input h-30 t-a-r"
            value={
              trip.id === focusedTrip ?
              editedTripQuantity.toString() :
              trip.quantity.toString()
            }
            onBlur={() => {
              updateTrip(trip.id,{quantity:isNaN(parseFloat(editedTripQuantity))?0:parseFloat(editedTripQuantity)})
              setFocusedTrip(null);
            }}
            onFocus={() => {
              onFocusWorkTrip(trip);
            }}
            onChange={e => setEditedTripQuantity(e.target.value.replace(',', '.')) }
            />
        )
      }
      case 'type': {
        return (
          <Select
            isDisabled={disabled || !canAddSubtasksAndTrips }
            value={ trip.type }
            onChange={(type)=>{
              updateTrip(trip.id,{type:type})
            }}
            options={tripTypes}
            styles={pickSelectStyle([ 'invisible', ])}
            />
        )
      }
      case 'assigned': {
        return (
          <Select
            isDisabled={disabled || !canAddSubtasksAndTrips}
            value={ trip.assignedTo }
            onChange={(assignedTo)=>{
              updateTrip(trip.id,{assignedTo:assignedTo})
            }}
            options={taskAssigned}
            styles={pickSelectStyle([ 'invisible', ])}
            />
        );
      }
      case 'approved': {
        return (
          <div className="vykazy-approved">
            <Switch
              checked={trip.approved}
              disabled={disabled || !canAddSubtasksAndTrips}
              onChange={ () => { updateTrip( trip.id, { approved: !trip.approved } ) } }
              height={16}
              width={30}
              handleDiameter={12}
              checkedIcon={<span className="switchLabel"></span>}
              uncheckedIcon={<span className="switchLabel"></span>}
              onColor={"#0078D4"} />
            <span className="m-l-10">{ trip.approved ? trip.approvedBy.fullName : 'Neschválené' }</span>
          </div>
        )
      }
      case 'actions': {
        return (
          <Empty>
            <button
              className="btn-link btn-distance"
              disabled={ disabled || !canAddSubtasksAndTrips || index === 0 }
              onClick={()=>{
                updateTrips([
                  //update below
                  { id: sortedTrips[ index - 1 ].id, newData: { order: index } },
                  //update current
                  { id: trip.id, newData: { order: index - 1 } }
                ]);
              }}
              >
              <i className="fa fa-arrow-up"  />
            </button>
            <button
              className="btn-link btn-distance"
              disabled={ disabled || !canAddSubtasksAndTrips || index === sortedTrips.length - 1 }
              onClick={()=>{
                updateTrips([
                  //update below
                  { id: sortedTrips[ index + 1 ].id, newData: { order: index } },
                  //update current
                  { id: trip.id, newData: { order: index + 1 } }
                ]);
              }}
              >
              <i className="fa fa-arrow-down"  />
            </button>
            <button
              className="btn-link"
              disabled={disabled || !canAddSubtasksAndTrips}
              onClick={()=>{
                if(window.confirm('Are you sure?')){
                  removeTrip(trip.id);
                }
              }}
              >
              <i className="fa fa-times" />
            </button>
          </Empty>
        )
      }
      default: {
        return null;
      }
    };
  }

  const getCreateSubColRender = ( key ) => {
    switch ( key ) {
      case 'title': {
        return (
          <input
            disabled={disabled || !canAddSubtasksAndTrips}
            type="text"
            className="form-control"
            id="inlineFormInput"
            placeholder=""
            value={newSubtaskTitle}
            onKeyPress={(e)=>{
              if(
                e.key === 'Enter' &&
                newSubtaskType !== null &&
                newSubtaskAssigned !== null &&
                newSubtaskTitle.length > 0
              ){
                let body={
                  done:false,
                  approved: false,
                  title:newSubtaskTitle,
                  type: newSubtaskType,
                  quantity:newSubtaskQuantity!==''?parseInt(newSubtaskQuantity):0,
                  discount: 0,
                  assignedTo: newSubtaskAssigned,
                  order:subtasks.length,
                }

                setNewSubtaskTitle('');
                setNewSubtaskQuantity(0);
                setNewSubtaskAssigned(taskAssigned.length>0?taskAssigned[0]:null);
                setShowAddSubtask( false);

                addSubtask(body);
              }
            }}
            onChange={(e)=>setNewSubtaskTitle(e.target.value)}
            />
        )
      }
      case 'scheduled': {
        return (
          <Scheduled
            dateFrom={fakeScheduledFrom}
            dateTo={fakeScheduledTo}
            disabled={disabled || !canAddSubtasksAndTrips || !userRights.assignedWrite}
            needsSubmit={false}
            submit={(fromDate, toDate ) => {
              setFakeScheduledFrom(fromDate);
              setFakeScheduledTo(toDate);
            } }
            id={'newSubScheduled'}
            />
        );
      }
      case 'quantity': {
        return (
          <input
            disabled={disabled || !canAddSubtasksAndTrips}
            type="text"
            pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
            value={newSubtaskQuantity.toString()}
            onChange={(e)=>setNewSubtaskQuantity(e.target.value.replace(',', '.'))}
            className="form-control h-30 t-a-r"
            id="inlineFormInput"
            placeholder=""
            />
        )
      }
      case 'type': {
        return (
          <Select
            isDisabled={disabled || !canAddSubtasksAndTrips}
            value={newSubtaskType}
            options={taskTypes}
            onChange={(type)=>{
              setNewSubtaskType(type)
            }}
            styles={pickSelectStyle()}
            />
        )
      }
      case 'assigned': {
        return (
          <Select
            isDisabled={disabled || !canAddSubtasksAndTrips}
            value={newSubtaskAssigned}
            onChange={(newSubtaskAssigned)=>{
              setNewSubtaskAssigned(newSubtaskAssigned);
            }}
            options={taskAssigned}
            styles={pickSelectStyle( [ 'invisible', 'noArrow', ] )}
            />
        );
      }
      case 'approved': {
        return (
          <div className="vykazy-approved">
            <Switch
              checked={newSubtaskApproved}
              disabled={disabled}
              onChange={ () => { setNewSubtaskApproved(!newSubtaskApproved) } }
              height={16}
              width={30}
              handleDiameter={12}
              checkedIcon={<span className="switchLabel"></span>}
              uncheckedIcon={<span className="switchLabel"></span>}
              onColor={"#0078D4"}
              />
            <span className="m-l-10">{ newSubtaskApproved ? currentUser.fullName : 'Neschválené' }</span>
          </div>
        )
      }
      case 'actions': {
        return (
          <Empty>
            <button className="btn-link-red"
              disabled={disabled}
              onClick={()=>{
                setShowAddSubtask(false)
              }}
              >
              <i className="fa fa-times"  />
            </button>
            <button className="btn"
              disabled={!newSubtaskType || newSubtaskType.id === null || disabled || !canAddSubtasksAndTrips || newSubtaskAssigned===null}
              onClick={()=>{
                let body={
                  done:false,
                  approved: newSubtaskApproved,
                  title:newSubtaskTitle,
                  type: newSubtaskType,
                  quantity: newSubtaskQuantity !== '' ? parseFloat(newSubtaskQuantity) : 0,
                  discount: 0,
                  assignedTo:newSubtaskAssigned,
                  order:subtasks.length,
                }

                setNewSubtaskTitle('');
                setNewSubtaskQuantity(0);
                setNewSubtaskAssigned(taskAssigned.length>0?taskAssigned[0]:null);
                setNewSubtaskApproved(false);
                setShowAddSubtask( false);

                addSubtask(body);
              }}
              >
              <i className="fa fa-plus p-r-0" />
            </button>
          </Empty>
        )
      }
      default: {
        return null;
      }
    };
  }

  const getCreateTripColRender = ( key ) => {
    switch ( key ) {
      case 'title': {
        return (
          <Select
            isDisabled={disabled || !canAddSubtasksAndTrips}
            value={newTripType}
            onChange={(newTripType)=>{
              setNewTripType(newTripType)
            }}
            options={tripTypes}
            styles={pickSelectStyle()}
            />
        )
      }
      case 'scheduled': {
        return (
          <Scheduled
            dateFrom={fakeScheduledFrom}
            dateTo={fakeScheduledTo}
            disabled={disabled || !canAddSubtasksAndTrips || !userRights.assignedWrite}
            needsSubmit={false}
            submit={(fromDate, toDate ) => {
              setFakeScheduledFrom(fromDate);
              setFakeScheduledTo(toDate);
            } }
            id={"newTripScheduled"}
            />
        );
      }
      case 'quantity': {
        return (
          <input
            disabled={disabled || !canAddSubtasksAndTrips}
            type="text"
            pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
            value={newTripQuantity.toString()}
            onChange={(e)=>setNewTripQuantity(e.target.value.replace(',', '.'))}
            className="form-control h-30 t-a-r"
            id="inlineFormInput"
            placeholder="Quantity"
            />
        )
      }
      case 'type': {
        return (
          <Select
            isDisabled={disabled || !canAddSubtasksAndTrips}
            value={newTripType}
            onChange={(newTripType)=>{
              setNewTripType(newTripType)
            }}
            options={tripTypes}
            styles={pickSelectStyle()}
            />
        )
      }
      case 'assigned': {
        return (
          <Select
            isDisabled={disabled || !canAddSubtasksAndTrips}
            value={newTripAssigned}
            onChange={(newTripAssigned)=>{
              setNewTripAssigned(newTripAssigned)
            }}
            options={taskAssigned}
            styles={pickSelectStyle( [ 'invisible', 'noArrow', ] )}
            />
        );
      }
      case 'approved': {
        return (
          <div className="vykazy-approved">
            <Switch
              checked={newTripApproved}
              disabled={disabled}
              onChange={ () => { setNewTripApproved(!newTripApproved) } }
              height={16}
              width={30}
              handleDiameter={12}
              checkedIcon={<span className="switchLabel"></span>}
              uncheckedIcon={<span className="switchLabel"></span>}
              onColor={"#0078D4"}
              />
            <span className="m-l-10">{ newTripApproved ? currentUser.fullName : 'Neschválené' }</span>
          </div>
        )
      }
      case 'actions': {
        return (
          <Empty>
            <button className="btn-link-red"
              disabled={disabled}
              onClick={()=>{
                setShowAddTrip(false);
                setShowAddSubtask(false);
              }}>
              <i className="fa fa-times"  />
            </button>
            <button className="btn"
              disabled={newTripType===null||isNaN(parseInt(newTripQuantity))||disabled || !canAddSubtasksAndTrips|| newTripAssigned===null}
              onClick={()=>{
                let body={
                  type:newTripType,
                  assignedTo: newTripAssigned,
                  quantity: newTripQuantity !== '' ? parseFloat(newTripQuantity) : 0,
                  discount: 0,
                  done: false,
                  approved: false,
                  order: workTrips.length,
                }

                setNewTripAssigned(taskAssigned.length>0?taskAssigned[0]:null);
                setNewTripQuantity(1);
                setShowAddTrip(false);

                addTrip(body);
              }}
              >
              <i className="fa fa-plus p-r-0" />
            </button>
          </Empty>
        )
      }
      default: {
        return null;
      }
    };
  }

  return (
    <div className="vykazyTable form-section">
      <table className="table form-section-rest">
        <thead>
          <tr>
            <th>
              <span
                onClick={() => setToggleTab('1')}
                className={classnames("clickable vykazyTableNav", {active: toggleTab === '1'})}
                >
                Práca
              </span>
              <span className='m-l-7 m-r-7'>
                |
              </span>
              <span
                onClick={() => setToggleTab('2')}
                className={classnames("clickable vykazyTableNav", {active: toggleTab === '2'})}
                >
                Rozpočet
              </span>
            </th>
            { shownColumns.map((colData, index) => {
              if(index < 2 ){
                return null;
              }
              return <th width={colData.width} key={colData.key} className={colData.headerClassnames}>{colData.header}</th>
            })}
          </tr>
        </thead>
        <tbody>
          {/* Subtasks */}
          { sortedSubtasks.map((subtask, order) => (
            <tr key={subtask.id}>
              { shownColumns.map((colData, index) => {
                if(index < 1){
                  return null;
                }
                const extraData = index === 1;
                const extraColData = shownColumns[0];
                return (
                  <td className={`${colData.columnClassnames} ${extraData ? ('row ' + extraColData.columnClassnames) : '' }`} colSpan={extraData ? "2" : "1"  } key={colData.key} >
                    { extraData &&
                      <div>
                        {getSubColRender(extraColData.key, subtask, index)}
                      </div>
                    }
                    <div className={extraData ? 'm-l-5 flex' : ''} >
                      { getSubColRender(colData.key, subtask, order) }
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
          {/* Trips */}
          { sortedTrips.map((trip, order) => (
            <tr key={trip.id}>
              { shownColumns.map((colData, index) => {
                if(index < 1){
                  return null;
                }
                const extraData = index === 1;
                const extraColData = shownColumns[0];
                return (
                  <td className={`${colData.columnClassnames} ${extraData ? ('row ' + extraColData.columnClassnames) : '' }`} colSpan={extraData ? "2" : "1"  } key={colData.key} >
                    { extraData &&
                      <div>
                        {getTripColRender(extraColData.key, trip, index)}
                      </div>
                    }
                    <div className={extraData ? 'm-l-5 flex' : ''} >
                      { getTripColRender(colData.key, trip, order) }
                    </div>
                  </td>
                )
              })}
            </tr>
          ))}
          {/* Add buttons*/}
          { !showAddSubtask && !showAddTrip && !disabled &&
            <tr key='addButton' colSpan={(shownColumns.length - 1).toString()}>
              <button className="btn-link btn-distance"
                disabled={disabled || !canAddSubtasksAndTrips}
                onClick={()=>{
                  setShowAddSubtask(true);
                }}
                >
                <i className="fa fa-plus" />
                Práca
              </button>
              <button className="btn-link btn-distance"
                disabled={disabled || !canAddSubtasksAndTrips}
                onClick={()=>{
                  setShowAddTrip(true);
                }}
                >
                <i className="fa fa-plus" />
                Výjazd
              </button>
            </tr>
          }
          {/* Add subtask row*/}
          { showAddSubtask && !disabled &&
            <tr key='addMaterialRow'>
              { shownColumns.map((colData, index) => {
                if(colData.key === 'done'){
                  return null;
                }

                return (
                  <td className={`${colData.columnClassnames}`} key={colData.key} >
                    { getCreateSubColRender(colData.key) }
                  </td>
                )
              })}
            </tr>
          }
          {/* Add trip row*/}
          { showAddTrip && !disabled &&
            <tr key='addMaterialRow'>
              { shownColumns.map((colData, index) => {
                if(colData.key === 'done'){
                  return null;
                }

                return (
                  <td className={`${colData.columnClassnames}`} key={colData.key} >
                    { getCreateTripColRender(colData.key) }
                  </td>
                )
              })}
            </tr>
          }
        </tbody>
      </table>

    </div>
  );
}