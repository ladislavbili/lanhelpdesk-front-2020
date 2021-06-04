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
import moment from 'moment';

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
    columnClassnames: "p-l-8 center-hor",
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
    width: "2%",
    headerClassnames: "",
    columnClassnames: "p-l-8",
  },
  {
    header: 'Akcie',
    key: 'actions',
    width: "93",
    headerClassnames: "t-a-c",
    columnClassnames: "t-a-r",
  },
  //advanced
  {
    header: 'Cenník/ks',
    key: 'price',
    width: "93",
    headerClassnames: "t-a-r",
    columnClassnames: "p-l-8",
  },
  {
    header: 'Zľava',
    key: 'discount',
    width: "93",
    headerClassnames: "t-a-r",
    columnClassnames: "p-l-8",
  },
  {
    header: 'Cena',
    key: 'priceAfterDiscount',
    width: "93",
    headerClassnames: "t-a-r",
    columnClassnames: "p-l-8",
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

export default function WorksTable( props ) {
  //data & queries
  const {
    userID,
    userRights,
    currentUser,
    company,
    showTotals,
    showColumns,
    showAdvancedColumns,
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

  //subtasks
  const [ showAddSubtask, setShowAddSubtask ] = React.useState( false );
  const [ editedSubtaskTitle, setEditedSubtaskTitle ] = React.useState( "" );
  const [ editedSubtaskQuantity, setEditedSubtaskQuantity ] = React.useState( 1 );
  const [ editedSubtaskDiscount, setEditedSubtaskDiscount ] = React.useState( 0 );
  const [ focusedSubtask, setFocusedSubtask ] = React.useState( null );
  const [ newSubtaskTitle, setNewSubtaskTitle ] = React.useState( "" );
  const [ newSubtaskType, setNewSubtaskType ] = React.useState( defaultType );
  const [ newSubtaskAssigned, setNewSubtaskAssigned ] = React.useState( defaultAssigned );
  const [ newSubtaskQuantity, setNewSubtaskQuantity ] = React.useState( 1 );
  const [ newSubtaskApproved, setNewSubtaskApproved ] = React.useState( false );
  const [ newSubtaskDiscount, setNewSubtaskDiscount ] = React.useState( 0 );
  const [ newSubtaskScheduledFrom, setNewSubtaskScheduledFrom ] = React.useState( null );
  const [ newSubtaskScheduledTo, setNewSubtaskScheduledTo ] = React.useState( null );

  //trips
  const [ showAddTrip, setShowAddTrip ] = React.useState( false );

  const [ editedTripQuantity, setEditedTripQuantity ] = React.useState( 1 );
  const [ editedTripDiscount, setEditedTripDiscount ] = React.useState( 0 );
  const [ focusedTrip, setFocusedTrip ] = React.useState( null );

  const [ newTripType, setNewTripType ] = React.useState( tripTypes.length > 0 ? tripTypes[ 0 ] : null );
  const [ newTripAssigned, setNewTripAssigned ] = React.useState( defaultAssigned );
  const [ newTripQuantity, setNewTripQuantity ] = React.useState( 1 );
  const [ newTripApproved, setNewTripApproved ] = React.useState( false );
  const [ newTripDiscount, setNewTripDiscount ] = React.useState( 0 );
  const [ newTripScheduledFrom, setNewTripScheduledFrom ] = React.useState( null );
  const [ newTripScheduledTo, setNewTripScheduledTo ] = React.useState( null );

  const shownColumns = getShownData( toggleTab === "2" && userRights.rozpocetRead ? showAdvancedColumns : showColumns, autoApproved, newColumnDefinitions ? newColumnDefinitions : [] );

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
    setEditedSubtaskDiscount( subtask.discount );
    setFocusedSubtask( subtask.id );
  }

  const onFocusWorkTrip = ( trip ) => {
    setEditedTripQuantity( trip.quantity );
    setEditedTripDiscount( trip.discount );
    setFocusedTrip( trip.id );
  }

  let sortedSubtasks = subtasks.sort( ( work1, work2 ) => work1.order - work2.order );
  let sortedTrips = workTrips.sort( ( trip1, trip2 ) => trip1.order - trip2.order );
  let disabled = !(
    ( userRights.taskShortSubtasksWrite && toggleTab === '0' ) ||
    ( userRights.vykazWrite && toggleTab === '1' ) ||
    ( userRights.rozpocetWrite && toggleTab === '2' )
  )

  const getDPH = () => {
    let dph = 20;
    if ( company && company.dph > 0 ) {
      dph = company.dph;
    }
    return ( 100 + dph ) / 100;
  }

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
            dateFrom={subtask.scheduled ? moment( parseInt( subtask.scheduled.from ) ) : null}
            dateTo={subtask.scheduled ? moment( parseInt( subtask.scheduled.to ) ) : null}
            disabled={disabled || !canAddSubtasksAndTrips || !userRights.assignedWrite}
            needsSubmit={true}
            quantity={subtask.quantity}
            submit={(fromDate, toDate, quantity ) => {
              if(fromDate === null ){
                updateSubtask( subtask.id, { scheduled: null } )
              }else{
                updateSubtask( subtask.id, { quantity, scheduled: { from: fromDate.valueOf().toString(), to: toDate.valueOf().toString() } } )
              }
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
              const quantity = isNaN(parseFloat(editedSubtaskQuantity)) ? 0 : parseFloat(editedSubtaskQuantity);
              if(subtask.scheduled){
                updateSubtask(
                  subtask.id,
                  {
                    quantity,
                    scheduled: {
                      from: subtask.scheduled.from,
                      to: moment(parseInt(subtask.scheduled.from)).add(quantity, 'hours').valueOf().toString(),
                    }
                  }
                )
              }else{
                updateSubtask(subtask.id,{quantity})
              }
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
      case 'price': {
        return (
          <span className="text" style={{float: "right"}}>
            <div style={{float: "right"}} className="p-t-8 p-r-8">
              €
            </div>
            <input
              disabled={true}
              type="number"
              style={{display: "inline", width: "70%", float: "right"}}
              className="form-control hidden-input h-30"
              value={ getPrice(subtask.type) }
              />
          </span>
        )
      }
      case 'discount': {
        return (
          <span className="text p-l-8">
            -
            <input
              disabled={disabled || !canAddSubtasksAndTrips}
              style={{display: "inline", width: "60%"}}
              type="number"
              className="form-control hidden-input h-30"
              value={ parseInt(
                subtask.id === focusedSubtask ?
                editedSubtaskDiscount :
                subtask.discount
              )}
              onBlur={() => {
                updateSubtask(subtask.id,{discount:isNaN(parseInt(editedSubtaskDiscount))?0:parseInt(editedSubtaskDiscount)})
                setFocusedSubtask(null);
              }}
              onFocus={() => {
                onFocusSubtask(subtask);
              }}
              onChange={e => setEditedSubtaskDiscount(e.target.value)}
              />
            %
          </span>
        )
      }
      case 'priceAfterDiscount': {
        return (
          <span className="text" style={{float: "right"}}>
            <div style={{float: "right"}} className="p-t-8 p-r-8">
              €
            </div>
            <input
              disabled={true}
              type="number"
              style={{display: "inline", width: "70%", float: "right"}}
              className="form-control hidden-input h-30"
              value={ getDiscountPrice(subtask) }
              />
          </span>
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
            dateFrom={trip.scheduled ? moment( parseInt( trip.scheduled.from ) ) : null}
            dateTo={trip.scheduled ? moment( parseInt( trip.scheduled.to ) ) : null}
            disabled={disabled || !canAddSubtasksAndTrips || !userRights.assignedWrite}
            needsSubmit={true}
            quantity={trip.quantity}
            submit={(fromDate, toDate, quantity ) => {
              if(fromDate === null ){
                updateTrip( trip.id, { scheduled: null } )
              }else{
                updateTrip( trip.id, { quantity, scheduled: { from: fromDate.valueOf().toString(), to: toDate.valueOf().toString() } } )
              }
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
              const quantity = isNaN(parseFloat(editedTripQuantity)) ? 0 : parseFloat(editedTripQuantity);
              if(trip.scheduled){
                updateTrip(
                  trip.id,
                  {
                    quantity,
                    scheduled: {
                      from: trip.scheduled.from,
                      to: moment(parseInt(trip.scheduled.from)).add(quantity, 'hours').valueOf().toString(),
                    }
                  }
                )
              }else{
                updateTrip(trip.id,{quantity})
              }
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
      case 'price': {
        return (
          <span className="text" style={{float: "right"}}>
            <div style={{float: "right"}} className="p-t-8 p-r-8">
              €
            </div>
            <input
              disabled={true}
              type="number"
              style={{display: "inline", width: "70%", float: "right"}}
              className="form-control hidden-input h-30"
              value={ getPrice(trip.type) }
              />
          </span>
        )
      }
      case 'discount': {
        return (
          <span className="text p-l-8">
            -
            <input
              disabled={disabled || !canAddSubtasksAndTrips}
              style={{display: "inline", width: "60%"}}
              type="number"
              className="form-control hidden-input h-30"
              value={ parseInt(
                trip.id === focusedTrip ?
                editedTripDiscount :
                trip.discount
              )}
              onBlur={() => {
                updateTrip(trip.id,{discount:isNaN(parseInt(editedTripDiscount))?0:parseInt(editedTripDiscount)})
                setFocusedTrip(null);
              }}
              onFocus={() => {
                onFocusWorkTrip(trip);
              }}
              onChange={e => setEditedTripDiscount(e.target.value)}
              />
            %
          </span>
        )
      }
      case 'priceAfterDiscount': {
        return (
          <span className="text" style={{float: "right"}}>
            <div style={{float: "right"}} className="p-t-8 p-r-8">
              €
            </div>
            <input
              disabled={true}
              type="number"
              style={{display: "inline", width: "70%", float: "right"}}
              className="form-control hidden-input h-30"
              value={ getDiscountPrice(trip) }
              />
          </span>
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
                  discount: isNaN(parseFloat(newSubtaskDiscount)) ? 0 : parseFloat(newSubtaskDiscount),
                  assignedTo: newSubtaskAssigned,
                  order:subtasks.length,
                  scheduled: newSubtaskScheduledFrom === null || newSubtaskScheduledTo === null ? null : { from: newSubtaskScheduledFrom.valueOf().toString(), to: newSubtaskScheduledTo.valueOf().toString() },
                }

                setNewSubtaskTitle('');
                setNewSubtaskQuantity(0);
                setNewSubtaskAssigned(taskAssigned.length>0?taskAssigned[0]:null);
                setNewSubtaskDiscount(0);
                setShowAddSubtask( false);
                setNewSubtaskScheduledTo(null);
                setNewSubtaskScheduledFrom(null);

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
            dateFrom={newSubtaskScheduledFrom}
            dateTo={newSubtaskScheduledTo}
            disabled={disabled || !canAddSubtasksAndTrips || !userRights.assignedWrite}
            needsSubmit={false}
            quantity={newSubtaskQuantity}
            submit={(fromDate, toDate, quantity ) => {
              setNewSubtaskScheduledFrom(fromDate);
              setNewSubtaskScheduledTo(toDate);
              setNewSubtaskQuantity(quantity.toString());
            } }
            id={`newSubScheduled`}
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
            onChange={(e)=>{
              setNewSubtaskQuantity(e.target.value.replace(',', '.'));
              if(newSubtaskScheduledFrom !== null && !isNaN(parseFloat(e.target.value.replace(',', '.'))) ){
                setNewSubtaskScheduledTo(moment(newSubtaskScheduledFrom).add( parseFloat(e.target.value.replace(',', '.')) ,'hours'))
              }
            }}
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
          </div>
        )
      }
      case 'actions': {
        return (
          <Empty>
            <button className="btn-link-red"
              disabled={disabled}
              onClick={()=>{
                setNewSubtaskTitle('');
                setNewSubtaskQuantity(0);
                setNewSubtaskAssigned(taskAssigned.length>0?taskAssigned[0]:null);
                setNewSubtaskDiscount(0);
                setNewSubtaskApproved(false);
                setNewSubtaskScheduledTo(null);
                setNewSubtaskScheduledFrom(null);
                setShowAddSubtask( false);
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
                  discount: isNaN(parseFloat(newSubtaskDiscount)) ? 0 : parseFloat(newSubtaskDiscount),
                  assignedTo:newSubtaskAssigned,
                  order:subtasks.length,
                  scheduled: newSubtaskScheduledFrom === null || newSubtaskScheduledTo === null ? null : { from: newSubtaskScheduledFrom.valueOf().toString(), to: newSubtaskScheduledTo.valueOf().toString() },
                }

                setNewSubtaskTitle('');
                setNewSubtaskQuantity(0);
                setNewSubtaskAssigned(taskAssigned.length>0?taskAssigned[0]:null);
                setNewSubtaskDiscount(0);
                setNewSubtaskApproved(false);
                setNewSubtaskScheduledTo(null);
                setNewSubtaskScheduledFrom(null);
                setShowAddSubtask( false);

                addSubtask(body);
              }}
              >
              <i className="fa fa-plus p-r-0" />
            </button>
          </Empty>
        )
      }
      case 'price': {
        return (
          <span className="text" style={{float: "right"}}>
            <div style={{float: "right"}} className="p-t-8 p-r-8">
              €
            </div>
            <input
              disabled={true}
              type="number"
              style={{display: "inline", width: "70%", float: "right"}}
              className="form-control h-30"
              value={ newSubtaskType ? getPrice(newSubtaskType) : 0 }
              />
          </span>
        )
      }
      case 'discount': {
        return (
          <span className="text p-l-8">
            -
            <input
              disabled={disabled || !canAddSubtasksAndTrips}
              style={{display: "inline", width: "60%"}}
              type="number"
              className="form-control m-l-5 m-r-5 input h-30"
              value={newSubtaskDiscount}
              onChange={(e)=>setNewSubtaskDiscount(e.target.value)}
              />
            %
          </span>
        )
      }
      case 'priceAfterDiscount': {
        return (
          <span className="text" style={{float: "right"}}>
            <div style={{float: "right"}} className="p-t-8 p-r-8">
              €
            </div>
            <input
              disabled={true}
              type="number"
              style={{display: "inline", width: "70%", float: "right"}}
              className="form-control hidden-input h-30"
              value={ newSubtaskType ? getDiscountPrice({type: newSubtaskType, discount: newSubtaskDiscount }) : 0 }
              />
          </span>
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
            dateFrom={newTripScheduledFrom}
            dateTo={newTripScheduledTo}
            disabled={disabled || !canAddSubtasksAndTrips || !userRights.assignedWrite}
            needsSubmit={false}
            quantity={newTripQuantity}
            submit={(fromDate, toDate, quantity ) => {
              setNewTripScheduledFrom(fromDate);
              setNewTripScheduledTo(toDate);
              setNewTripQuantity(quantity);
            } }
            id={`newTripScheduled`}
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
            onChange={(e)=>{
              setNewTripQuantity(e.target.value.replace(',', '.'));
              if(newTripScheduledFrom !== null && !isNaN(parseFloat(e.target.value.replace(',', '.'))) ){
                setNewTripScheduledTo(moment(newTripScheduledFrom).add( parseFloat(e.target.value.replace(',', '.')) ,'hours'))
              }
            }}
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
          </div>
        )
      }
      case 'actions': {
        return (
          <Empty>
            <button className="btn-link-red"
              disabled={disabled}
              onClick={()=>{
                setNewTripAssigned(taskAssigned.length>0?taskAssigned[0]:null);
                setNewTripQuantity(1);
                setNewTripDiscount(0);
                setNewTripScheduledTo(null);
                setNewTripScheduledFrom(null);
                setShowAddTrip(false);
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
                  discount: newTripDiscount,
                  done: false,
                  approved: false,
                  order: workTrips.length,
                  scheduled: newTripScheduledFrom === null || newTripScheduledTo === null ? null : { from: newTripScheduledFrom.valueOf().toString(), to: newTripScheduledTo.valueOf().toString() },
                }

                setNewTripAssigned(taskAssigned.length>0?taskAssigned[0]:null);
                setNewTripQuantity(1);
                setNewTripDiscount(0);
                setNewTripScheduledTo(null);
                setNewTripScheduledFrom(null);
                setShowAddTrip(false);
                addTrip(body);
              }}
              >
              <i className="fa fa-plus p-r-0" />
            </button>
          </Empty>
        )
      }
      case 'price': {
        return (
          <span className="text" style={{float: "right"}}>
            <div style={{float: "right"}} className="p-t-8 p-r-8">
              €
            </div>
            <input
              disabled={true}
              type="number"
              style={{display: "inline", width: "70%", float: "right"}}
              className="form-control h-30"
              value={ newTripType ? getPrice(newTripType) : 0 }
              />
          </span>
        )
      }
      case 'discount': {
        return (
          <span className="text p-l-8">
            -
            <input
              disabled={disabled || !canAddSubtasksAndTrips}
              style={{display: "inline", width: "60%"}}
              type="number"
              className="form-control m-l-5 m-r-5 input h-30"
              value={newTripDiscount}
              onChange={(e)=>setNewTripDiscount(e.target.value)}
              />
            %
          </span>
        )
      }
      case 'priceAfterDiscount': {
        return (
          <span className="text" style={{float: "right"}}>
            <div style={{float: "right"}} className="p-t-8 p-r-8">
              €
            </div>
            <input
              disabled={true}
              type="number"
              style={{display: "inline", width: "70%", float: "right"}}
              className="form-control hidden-input h-30"
              value={ newTripType ? getDiscountPrice({type: newTripType, discount: newTripDiscount }) : 0 }
              />
          </span>
        )
      }
      default: {
        return null;
      }
    };
  }

  const getPrice = ( type ) => {
    if ( !type ) {
      return NaN;
    }
    let price = ( company && company.pricelist && company.pricelist.prices ? company.pricelist.prices.find( price => {
      if ( type.__typename === "TaskType" && price.type === "TaskType" ) {
        return price.taskType.id === type.id;
      } else if ( type.__typename === "TripType" && price.type === "TripType" ) {
        return price.tripType.id === type.id;
      }
      return false;
    } ) : undefined );
    if ( price === undefined ) {
      price = NaN;
    } else {
      price = price.price;
    }
    return parseFloat( parseFloat( price )
      .toFixed( 2 ) );
  }

  const getDiscountPrice = ( item ) => {
    return getPrice( item.type ) * ( 1 - item.discount / 100 );
  }

  const getTotalPrice = ( item ) => {
    const quantity = isNaN( parseFloat( item.quantity ) ) ? 0 : parseFloat( item.quantity );
    return getDiscountPrice( item ) * quantity;
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
              { userRights.vykazyRead &&
                <Empty>
                  <span className='m-l-7 m-r-7'>
                    |
                  </span>
                  <span
                    onClick={() => setToggleTab('2')}
                    className={classnames("clickable vykazyTableNav", {active: toggleTab === '2'})}
                    >
                    Rozpočet
                  </span>
                </Empty>
              }
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
            <tr key='addButton'>
              <td colSpan={(shownColumns.length - 1).toString()}>
                <button className="btn-link btn-distance"
                  disabled={disabled || !canAddSubtasksAndTrips || !defaultType || defaultType.id === null}
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
                { ( !defaultType || defaultType.id === null ) &&
                  <span className="message error-message">Can't add work without assigning task type!</span>
                }
              </td>
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

      {/* Statistics */}
      { showTotals &&  subtasks.length > 0 && workTrips.length > 0 && toggleTab === '2' &&
        <div className="row">
          <div className="ml-auto row m-r-10">
            <div className="text-right ml-auto m-r-5">
              <b>Cena bez DPH: </b>
              {
                (
                  [...subtasks, ...workTrips ].reduce((acc, cur) => acc + getTotalPrice(cur), 0 )
                ).toFixed(2)
              }
            </div>
            <div className="text-right m-r-5">
              <b>DPH: </b>
              {((getDPH()-1)*100).toFixed(2) + ' %' }
            </div>
            <div className="text-right">
              <b>Cena s DPH: </b>
              {
                (
                  (
                    [...subtasks, ...workTrips ].reduce((acc, cur) => acc + getTotalPrice(cur), 0 )
                  )*getDPH()
                ).toFixed(2)
              }
            </div>
          </div>
        </div>
      }

    </div>
  );
}