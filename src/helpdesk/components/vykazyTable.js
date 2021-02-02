import React from 'react';

import classnames from "classnames";
import {
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import Select from 'react-select';
import {
  selectStyle,
  invisibleSelectStyle,
  invisibleSelectStyleNoArrow
} from 'configs/components/select';
import Checkbox from 'components/checkbox';

export default function Rozpocet( props ) {
  //data & queries
  const {
    userRights,
    isInvoiced,
    company,
    defaultType,
    taskAssigned,
    tripTypes,
    taskTypes,
    subtasks,
    workTrips,
    materials,
    customItems,
    showColumns,
    showSubtasks,
    updateSubtask,
    updateSubtasks,
    removeSubtask,
    updateTrip,
    updateTrips,
    removeTrip,
    updateMaterial,
    updateMaterials,
    removeMaterial,
    updateCustomItem,
    updateCustomItems,
    removeCustomItem,
    submitService,
    submitTrip,
    submitMaterial,
    submitCustomItem
  } = props;

  let defaultTab = '6';

  if ( showSubtasks ) {
    defaultTab = '0';
  } else if ( userRights.vykazRead ) {
    defaultTab = '1';
  } else if ( userRights.rozpocetRead ) {
    defaultTab = '2';
  }

  //state
  const [ toggleTab, setToggleTab ] = React.useState( defaultTab );

  //subtasks
  const [ showAddSubtask, setShowAddSubtask ] = React.useState( false );

  const [ editedSubtaskTitle, setEditedSubtaskTitle ] = React.useState( "" );
  const [ editedSubtaskQuantity, setEditedSubtaskQuantity ] = React.useState( 0 );
  const [ editedSubtaskDiscount, setEditedSubtaskDiscount ] = React.useState( 0 );
  const [ focusedSubtask, setFocusedSubtask ] = React.useState( null );
  const [ newSubtaskTitle, setNewSubtaskTitle ] = React.useState( "" );
  const [ newSubtaskType, setNewSubtaskType ] = React.useState( defaultType );
  const [ newSubtaskAssigned, setNewSubtaskAssigned ] = React.useState( taskAssigned.length > 0 ? taskAssigned[ 0 ] : null );
  const [ newSubtaskQuantity, setNewSubtaskQuantity ] = React.useState( 0 );
  const [ newSubtaskDiscount, setNewSubtaskDiscount ] = React.useState( 0 );

  //trips
  const [ showAddTrip, setShowAddTrip ] = React.useState( false );

  const [ editedTripQuantity, setEditedTripQuantity ] = React.useState( 0 );
  const [ editedTripDiscount, setEditedTripDiscount ] = React.useState( 0 );
  const [ focusedTrip, setFocusedTrip ] = React.useState( null );

  const [ newTripType, setNewTripType ] = React.useState( tripTypes.length > 0 ? tripTypes[ 0 ] : null );
  const [ newTripAssigned, setNewTripAssigned ] = React.useState( taskAssigned.length > 0 ? taskAssigned[ 0 ] : null );
  const [ newTripQuantity, setNewTripQuantity ] = React.useState( 1 );
  const [ newTripDiscount, setNewTripDiscount ] = React.useState( 0 );

  //Materials
  const [ showAddMaterial, setShowAddMaterial ] = React.useState( false );
  const [ marginChanged, setMarginChanged ] = React.useState( false );
  const [ focusedMaterial, setFocusedMaterial ] = React.useState( null );

  const [ editedMaterialTitle, setEditedMaterialTitle ] = React.useState( "" );
  const [ editedMaterialQuantity, setEditedMaterialQuantity ] = React.useState( 0 );
  const [ editedMaterialMargin, setEditedMaterialMargin ] = React.useState( null );
  const [ editedMaterialPrice, setEditedMaterialPrice ] = React.useState( null );

  const [ newMaterialTitle, setNewMaterialTitle ] = React.useState( '' );
  const [ newMaterialQuantity, setNewMaterialQuantity ] = React.useState( 1 );
  const [ newMaterialMargin, setNewMaterialMargin ] = React.useState( company && company.pricelist ? company.pricelist.materialMargin : 0 );
  const [ newMaterialPrice, setNewMaterialPrice ] = React.useState( 0 );
  const [ newDiscountedMaterialPrice, setNewDiscountedMaterialPrice ] = React.useState( 0 );

  // Custom items
  const [ showAddCustomItem, setShowAddCustomItem ] = React.useState( false );
  const [ focusedCustomItem, setFocusedCustomItem ] = React.useState( null );

  const [ editedCustomItemTitle, setEditedCustomItemTitle ] = React.useState( "" );
  const [ editedCustomItemQuantity, setEditedCustomItemQuantity ] = React.useState( 0 );
  const [ editedCustomItemPrice, setEditedCustomItemPrice ] = React.useState( null );

  const [ newCustomItemTitle, setNewCustomItemTitle ] = React.useState( '' );
  const [ newCustomItemQuantity, setNewCustomItemQuantity ] = React.useState( 1 );
  const [ newCustomItemPrice, setNewCustomItemPrice ] = React.useState( 0 );

  React.useEffect( () => {
    setNewMaterialMargin( company && company.pricelist ? company.pricelist.materialMargin : 0 );
  }, [ company ] )

  React.useEffect( () => {
    setNewSubtaskAssigned( taskAssigned.length > 0 ? taskAssigned[ 0 ] : null );
    setNewTripAssigned( taskAssigned.length > 0 ? taskAssigned[ 0 ] : null );
  }, [ taskAssigned ] )

  React.useEffect( () => {
    setNewSubtaskType( defaultType )
  }, [ defaultType ] )

  const onFocusWorkTrip = ( trip ) => {
    setEditedTripQuantity( trip.quantity );
    setEditedTripDiscount( trip.discount );
    setFocusedTrip( trip.id );
  }

  const onFocusSubtask = ( subtask ) => {
    setEditedSubtaskTitle( subtask.title );
    setEditedSubtaskQuantity( subtask.quantity ? subtask.quantity : '' );
    setEditedSubtaskDiscount( subtask.discount );
    setFocusedSubtask( subtask.id );
  }

  const onFocusMaterial = ( material ) => {
    setEditedMaterialTitle( material.title );
    setEditedMaterialQuantity( material.quantity );
    setEditedMaterialMargin( material.margin );
    setEditedMaterialPrice( material.price );
    setFocusedMaterial( material.id );
  }

  const onFocusCustomItem = ( customItem ) => {
    setEditedCustomItemTitle( customItem.title );
    setEditedCustomItemQuantity( customItem.quantity );
    setEditedCustomItemPrice( customItem.price );
    setFocusedCustomItem( customItem.id );
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

  const getTotalPrice = ( item ) => {
    return parseFloat( getPrice( item.type )
      .toFixed( 2 ) )
  }

  const getTotalDiscountedPrice = ( item ) => {
    return parseFloat( parseFloat( getTotalPrice( item ) * ( 100 - parseInt( item.discount ) ) / 100 )
      .toFixed( 2 ) )
  }

  const getDiscountedMaterialPrice = ( material ) => {
    return parseFloat( material.price * ( 1 + material.margin / 100 ) )
  }

  const getBasicMaterialPrice = ( material ) => {
    return parseFloat( material.price / ( 1 + material.margin / 100 ) )
  }

  const getDPH = () => {
    let dph = 20;
    if ( company && company.dph > 0 ) {
      dph = company.dph;
    }
    return ( 100 + dph ) / 100;
  }

  let sortedWorks = subtasks.sort( ( work1, work2 ) => work1.order - work2.order );
  let sortedTrips = workTrips.sort( ( trip1, trip2 ) => trip1.order - trip2.order );
  let sortedMaterials = materials.sort( ( material1, material2 ) => material1.order - material2.order );
  let sortedCustomItems = customItems.sort( ( customItem1, customItem2 ) => customItem1.order - customItem2.order );
  let disabled = !(
    ( userRights.taskShortSubtasksWrite && toggleTab === '0' ) ||
    ( userRights.vykazWrite && toggleTab === '1' ) ||
    ( userRights.rozpocetWrite && toggleTab === '2' )
  )

  return (
    <div className="vykazyTable form-section">
      <table className="table form-section-rest">
        <thead>
          <tr>
            <th colSpan={showColumns.includes(0) ? 2 : 1}>
              <Nav tabs className="b-0 m-0">
                { showSubtasks && userRights.taskShortSubtasksRead &&
                  <NavItem>
                    <NavLink
                      className={classnames({ active: toggleTab === '0'}, "clickable", "")}
                      onClick={() => setToggleTab('0')}
                      >
                      Subtasks
                    </NavLink>
                  </NavItem>
                }
                { !showSubtasks && userRights.vykazRead &&
                  <NavItem>
                    <NavLink
                      className={classnames({ active: toggleTab === '1'}, "clickable", "")}
                      onClick={() => setToggleTab('1')}
                      >
                      Výkaz
                    </NavLink>
                  </NavItem>
                }
                { !showSubtasks &&
                  <NavItem>
                    <NavLink>
                      |
                    </NavLink>
                  </NavItem>
                }
                { !showSubtasks && userRights.rozpocetRead &&
                  <NavItem>
                    <NavLink
                      className={classnames({ active: toggleTab === '2' }, "clickable", "")}
                      onClick={() => setToggleTab('2')}
                      >
                      Rozpočet
                    </NavLink>
                  </NavItem>
                }
              </Nav>
            </th>
            {showColumns.includes(3) && toggleTab !== "0" && <th width="190">Typ</th> }
            {showColumns.includes(2) && toggleTab !== "0" && <th width="190">Rieši</th> }
            {showColumns.includes(4) && <th width="50" className="t-a-r">Mn.</th> }
            {showColumns.includes(5) && toggleTab === "2" && <th width="70" className="table-highlight-background t-a-r">Cenník/Nákup</th> }
            {showColumns.includes(6) && toggleTab === "2" && <th width="70" className="table-highlight-background t-a-r">Zľava/Marža</th> }
            {showColumns.includes(7) && toggleTab !== "0" && <th width="70" className="t-a-r">Cena</th> }
            {showColumns.includes(8) && !isInvoiced && <th width="120" className="t-a-c">Akcie</th> }
          </tr>
        </thead>
        <tbody>
          {/* Works */}
          { sortedWorks.map((subtask, index) =>
            <tr key={subtask.id}>
              {/*Checkbox done*/}
              {showColumns.includes(0) &&
                <td width="10">
                  <Checkbox
                    className="m-t-5"
                    disabled= { disabled || isInvoiced }
                    value={  isInvoiced || subtask.done }
                    onChange={()=>{
                      updateSubtask(subtask.id,{done:!subtask.done})
                    }}
                    />
                </td>
              }
              {/*Name*/}
              {showColumns.includes(1) &&
                <td className="">
                  <input
                    disabled={disabled}
                    className="form-control hidden-input"
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
                </td>
              }
              {/*Type*/}
              {showColumns.includes(3) && toggleTab !== "0" &&
                <td>
                  <Select
                    isDisabled={disabled}
                    value={ !isInvoiced ? subtask.type : subtask.invoicedData.type }
                    onChange={(type)=>{
                      updateSubtask(subtask.id,{type:type})
                    }}
                    options={taskTypes}
                    styles={invisibleSelectStyle}
                    />
                </td>
              }
              {/*Riesi*/}
              {showColumns.includes(2) && toggleTab !== "0" &&
                <td>
                  <Select
                    isDisabled={disabled}
                    value={ !isInvoiced ? subtask.assignedTo : subtask.invoicedData.assignedTo }
                    onChange={(assignedTo)=>{
                      updateSubtask(subtask.id,{assignedTo:assignedTo})
                    }}
                    options={taskAssigned}
                    styles={invisibleSelectStyle}
                    />
                </td>
              }
              {/*Mnozstvo*/}
              {showColumns.includes(4) &&
                <td>
                  <input
                    disabled={disabled}
                    type="text"
                    pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
                    className="form-control hidden-input h-30 t-a-r"
                    value={
                      subtask.id === focusedSubtask
                      ? editedSubtaskQuantity.toString()
                      : (
                        !isInvoiced ?
                        subtask.quantity.toString() :
                        subtask.invoicedData.quantity
                      )
                    }
                    onBlur={() => {
                      updateSubtask(subtask.id,{quantity:isNaN(parseFloat(editedSubtaskQuantity))?0:parseFloat(editedSubtaskQuantity)})
                      setFocusedSubtask(null);
                    }}
                    onFocus={() => onFocusSubtask(subtask)}
                    onChange={e =>setEditedSubtaskQuantity(e.target.value.replace(',', '.'))}
                    />
                </td>
              }
              {/*Cennik/Nakup*/}
              {showColumns.includes(5) && toggleTab === "2" &&
                <td className="table-highlight-background p-l-8">
                  <span className="text" style={{float: "right"}}>
                    <div style={{float: "right"}} className="p-t-8 p-r-8">
                      €
                    </div>
                    <input
                      disabled={true}
                      type="number"
                      style={{display: "inline", width: "70%", float: "right"}}
                      className="form-control hidden-input h-30"
                      value={!isInvoiced ? getPrice(subtask.type): subtask.price}
                      />
                  </span>
                </td>
              }
              {/*Zlava/Marža*/}
              {showColumns.includes(6) && toggleTab === "2" &&
                <td className="table-highlight-background">
                  <span className="text p-l-8">
                    -
                    <input
                      disabled={disabled}
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
                </td>
              }
              {/*Cena*/}
              {showColumns.includes(7) && toggleTab !== "0" &&
                <td className="p-t-15 p-l-8 p-r-8 t-a-r font-14">
                  {
                    !isInvoiced ?
                    (
                      isNaN(getTotalDiscountedPrice(subtask)) ?
                      'No price' :
                      getTotalDiscountedPrice(subtask) + " €"
                    ):
                    `${parseFloat(subtask.invoicedData.price) * parseFloat(subtask.invoicedData.quantity)} €`
                  }
                </td>
              }
              {/*Toolbar*/}
              {showColumns.includes(8) &&
                <td className="t-a-r">	{/* //akcie*/}
                  <button
                    className="btn btn-link waves-effect"
                    disabled={ disabled || index === 0 }
                    onClick={()=>{
                      updateSubtasks([
                        //update below
                        { id: sortedWorks[ index - 1 ].id, newData: { order: index } },
                        //update current
                        { id: subtask.id, newData: { order: index - 1 } }
                      ]);
                    }}
                    >
                    <i className="fa fa-arrow-up"  />
                  </button>
                  <button
                    className="btn btn-link waves-effect"
                    disabled={ disabled || index === sortedWorks.length - 1 }
                    onClick={()=>{
                      updateSubtasks([
                        //update below
                        { id: sortedWorks[ index + 1 ].id, newData: { order: index } },
                        //update current
                        { id: subtask.id, newData: { order: index + 1 } }
                      ]);
                    }}
                    >
                    <i className="fa fa-arrow-down"  />
                  </button>
                  <button className="btn btn-link waves-effect" disabled={disabled}
                    onClick={()=>{
                      if(window.confirm('Are you sure?')){
                        removeSubtask(subtask.id);
                      }
                    }}>
                    <i className="fa fa-times" />
                  </button>
                </td>
              }
            </tr>
          )}
          {/* Trips */}
          { toggleTab !== "0" &&
            sortedTrips.map((trip, index) => {
              return (<tr key={trip.id}>
                {/*Checkbox done*/}
                {showColumns.includes(0) &&
                  <td width="10">
                    <Checkbox
                      className="m-t-5"
                      disabled= { disabled || isInvoiced }
                      value={ isInvoiced || trip.done }
                      onChange={()=>{
                        updateTrip(trip.id,{done:!trip.done})
                      }}
                      />
                  </td>
                }
                {/*Name*/}
                {showColumns.includes(1) &&
                  <td>
                    <Select
                      isDisabled={disabled }
                      value={ !isInvoiced ? trip.type : trip.invoicedData.type }
                      onChange={(type)=>{
                        updateTrip(trip.id,{type:type})
                      }}
                      options={tripTypes}
                      styles={invisibleSelectStyle}
                      />
                  </td>
                }
                {/*Type*/}
                {showColumns.includes(3) &&
                  <td className="p-t-15 p-l-8">Výjazd</td>
                }
                {/*Riesi*/}
                {showColumns.includes(2) &&
                  <td>
                    <Select
                      isDisabled={disabled}
                      value={ !isInvoiced ? trip.assignedTo : trip.invoicedData.assignedTo }
                      onChange={(assignedTo)=>{
                        updateTrip(trip.id,{assignedTo:assignedTo})
                      }}
                      options={taskAssigned}
                      styles={invisibleSelectStyle}
                      />
                  </td>
                }
                {/*Mnozstvo*/}
                {showColumns.includes(4) &&
                  <td>
                    <input
                      disabled={disabled}
                      type="text"
                      pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
                      className="form-control hidden-input h-30 t-a-r"
                      value={
                        trip.id === focusedTrip ?
                        editedTripQuantity.toString() :
                        (
                          !isInvoiced ?
                          trip.quantity.toString() :
                          trip.invoicedData.quantity
                        )
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
                  </td>
                }
                {/*Cennik/Nakup*/}
                {showColumns.includes(5) && toggleTab === "2" &&
                  <td className="table-highlight-background p-l-8">
                    <span className="text" style={{float: "right"}}>
                      <div style={{float: "right"}} className="p-t-8 p-r-8">
                        €
                      </div>
                      <input
                        disabled={true}
                        type="number"
                        style={{display: "inline", width: "70%", float: "right"}}
                        className="form-control hidden-input h-30"
                        value={!isInvoiced ? getPrice(trip.type): trip.price}
                        />
                    </span>
                  </td>
                }
                {/*Zlava/Marža*/}
                {showColumns.includes(6) && toggleTab === "2" &&
                  <td className="table-highlight-background">
                    <span className="text p-l-8">
                      -
                      <input
                        disabled={disabled}
                        type="number"
                        style={{display: "inline", width: "60%"}}
                        className="form-control hidden-input h-30"
                        value={
                          trip.id === focusedTrip ?
                          editedTripDiscount :
                          trip.discount
                        }
                        onBlur={() => {
                          updateTrip(trip.id,{discount:isNaN(parseInt(editedTripDiscount))?0:parseInt(editedTripDiscount)});
                          setFocusedTrip(null);
                        }}
                        onFocus={() => {
                          onFocusWorkTrip(trip);
                        }}
                        onChange={e => setEditedTripDiscount(e.target.value) }
                        />
                      %
                    </span>
                  </td>
                }
                {/*Cena*/}
                {showColumns.includes(7) &&
                  <td className="p-t-15 p-l-8 p-r-8 t-a-r font-14">
                    {
                      !isInvoiced ?
                      (
                        isNaN(getTotalDiscountedPrice(trip)) ?
                        'No price' :
                        getTotalDiscountedPrice(trip) + " €"
                      ):
                      `${trip.invoicedData.price * trip.invoicedData.quantity} €`
                    }
                  </td>
                }
                {/*Toolbar*/}
                {showColumns.includes(8) &&
                  <td className="t-a-r">
                    <button
                      className="btn btn-link waves-effect"
                      disabled={ disabled || index === 0 }
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
                      className="btn btn-link waves-effect"
                      disabled={ disabled || index === sortedTrips.length - 1 }
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
                      className="btn btn-link waves-effect"
                      disabled={disabled}
                      onClick={()=>{
                        if(window.confirm('Are you sure?')){
                          removeTrip(trip.id);
                        }
                      }}
                      >
                      <i className="fa fa-times" />
                    </button>
                  </td>
                }
              </tr>)
            }
          )}
          {/* Materials */}
          { toggleTab !== "0" &&
            sortedMaterials.map((material,index) => {
              return (<tr key={material.id}>
                {/*Checkbox done*/}
                {showColumns.includes(0) &&
                  <td width="10">
                    <Checkbox
                      className="m-t-5"
                      disabled= { disabled || isInvoiced }
                      value={ isInvoiced || material.done }
                      onChange={()=>{
                        updateMaterial(material.id,{done:!material.done})
                      }}
                      />
                  </td>
                }
                {/*Name*/}
                {showColumns.includes(1) &&
                  <td className="">
                    <input
                      disabled={disabled}
                      className="form-control hidden-input"
                      value={
                        material.id === focusedMaterial ?
                        editedMaterialTitle :
                        (
                          !isInvoiced ?
                          material.title :
                          material.invoicedData.title
                        )
                      }
                      onBlur={() => {
                        updateMaterial(material.id,{title:editedMaterialTitle})
                        setFocusedMaterial(null);
                      }}
                      onFocus={() => onFocusMaterial(material)}
                      onChange={e => setEditedMaterialTitle(e.target.value) }
                      />
                  </td>
                }
                {/*Type*/}
                {showColumns.includes(3) &&
                  <td className="p-l-8 p-t-15">
                    Materiál
                  </td>
                }
                {/*Riesi*/}
                {showColumns.includes(2) &&
                  <td></td>
                }
                {/*Mnozstvo*/}
                {showColumns.includes(4) &&
                  <td>
                    <input
                      disabled={disabled}
                      type="text"
                      pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
                      className="form-control hidden-input h-30 t-a-r"
                      value={
                        material.id === focusedMaterial ?
                        editedMaterialQuantity.toString() :
                        (
                          !isInvoiced ?
                          material.quantity.toString() :
                          material.invoicedData.quantity
                        )
                      }
                      onBlur={() => {
                        //submit
                        updateMaterial(material.id,{quantity: parseFloat(editedMaterialQuantity)})
                        setFocusedMaterial(null);
                      }}
                      onFocus={() => onFocusMaterial(material)}
                      onChange={e => setEditedMaterialQuantity(e.target.value.replace(',', '.')) }
                      />
                  </td>
                }
                {/*Cennik/Nakup*/}
                {showColumns.includes(5) && toggleTab === "2" &&
                  <td className="table-highlight-background p-l-8">
                    <span className="text" style={{float: "right"}}>
                      <div style={{float: "right"}} className="p-t-8 p-r-8">
                        €
                      </div>
                      <input
                        disabled={disabled}
                        type="number"
                        style={{display: "inline", width: "70%", float: "right"}}
                        className="form-control hidden-input h-30"
                        value={
                          material.id === focusedMaterial ?
                          editedMaterialPrice :
                          (
                            !isInvoiced ?
                            material.price :
                            material.invoicedData.price
                          )
                        }
                        onBlur={() => {
                          //submit
                          updateMaterial(material.id,{price:editedMaterialPrice})
                          setFocusedMaterial(null);
                        }}
                        onFocus={() => onFocusMaterial(material)}
                        onChange={e => setEditedMaterialPrice(e.target.value) }
                        />
                    </span>
                  </td>
                }
                {/*Zlava/Marža*/}
                {showColumns.includes(6) && toggleTab === "2" &&
                  <td className="table-highlight-background p-l-8"> {/* //zlava/marza*/}
                    <span className="text">
                      +
                      <input
                        disabled={disabled}
                        type="number"
                        style={{display: "inline", width: "60%"}}
                        className="form-control hidden-input h-30"
                        value={
                          parseInt(
                            material.id === focusedMaterial ?
                            editedMaterialMargin :
                            (
                              !isInvoiced ?
                              material.margin :
                              material.invoicedData.margin
                            )
                          )
                        }
                        onBlur={() => {
                          updateMaterial(material.id,{margin:editedMaterialMargin})
                          setFocusedMaterial(null);
                        }}
                        onFocus={() => onFocusMaterial(material)}
                        onChange={e => setEditedMaterialMargin(e.target.value) }
                        />
                      %
                    </span>
                  </td>
                }
                {/*Cena*/}
                {showColumns.includes(7) &&
                  <td className="p-l-8 p-t-15 p-r-8 t-a-r font-14">
                    {
                      material.id === focusedMaterial ?
                      (  getDiscountedMaterialPrice({price:editedMaterialPrice, margin:editedMaterialMargin}).toFixed(2) + " €" ) :
                      (
                        !isInvoiced ?
                        ( getDiscountedMaterialPrice(material) ).toFixed(2) + " €" :
                        `${material.invoicedData.price * material.invoicedData.quantity} €`
                      )
                    }
                  </td>
                }
                {/*Toolbar*/}
                {showColumns.includes(8) &&
                  <td className="t-a-r">
                    <button className="btn btn-link waves-effect" disabled={disabled}>
                      <i
                        className="fa fa-sync-alt"
                        onClick={()=>{
                          if(parseInt(material.price) <= 50){
                            updateMaterial(material.id,{margin:(company && company.pricelist)?parseInt(company.pricelist.materialMargin):material.margin})
                          }else{
                            updateMaterial(material.id,{margin:(company && company.pricelist)?parseInt(company.pricelist.materialMarginExtra):material.margin})
                          }
                        }}
                        />
                    </button>
                    <button
                      className="btn btn-link waves-effect"
                      disabled={ disabled || index === 0 }
                      onClick={()=>{
                        updateMaterials([
                          //update below
                          { id: sortedMaterials[ index - 1 ].id, newData: { order: index } },
                          //update current
                          { id: material.id, newData: { order: index - 1 } }
                        ]);
                      }}
                      >
                      <i className="fa fa-arrow-up"  />
                    </button>
                    <button
                      className="btn btn-link waves-effect"
                      disabled={ disabled || index === sortedMaterials.length - 1 }
                      onClick={()=>{
                        updateMaterials([
                          //update below
                          { id: sortedMaterials[ index + 1 ].id, newData: { order: index } },
                          //update current
                          { id: material.id, newData: { order: index + 1 } }
                        ]);
                      }}
                      >
                      <i className="fa fa-arrow-down"  />
                    </button>
                    <button className="btn btn-link waves-effect"
                      disabled={disabled}
                      onClick={()=>{
                        if(window.confirm('Are you sure?')){
                          removeMaterial(material.id);
                        }
                      }}>
                      <i className="fa fa-times" />
                    </button>
                  </td>
                }
              </tr>)
            }
          )}
          {/* Custom Items */}
          { toggleTab !== "0" &&
            sortedCustomItems.map((customItem, index)=> {
              return (<tr key={customItem.id}>
                {/*Checkbox done*/}
                {showColumns.includes(0) &&
                  <td width="10">
                    <Checkbox
                      className="m-t-5"
                      disabled= { disabled || isInvoiced }
                      value={ isInvoiced || customItem.done }
                      onChange={()=>{
                        updateCustomItem(customItem.id,{done:!customItem.done})
                      }}
                      />
                  </td>
                }
                {/*Name*/}
                {showColumns.includes(1) &&
                  <td className="">
                    <input
                      disabled={disabled}
                      className="form-control hidden-input"
                      value={
                        customItem.id === focusedCustomItem ?
                        editedCustomItemTitle :
                        (
                          !isInvoiced ?
                          customItem.title :
                          customItem.invoicedData.title
                        )
                      }
                      onBlur={() => {
                        updateCustomItem(customItem.id,{title:editedCustomItemTitle})
                        setFocusedCustomItem(null);
                      }}
                      onFocus={() => onFocusCustomItem(customItem)}
                      onChange={e => setEditedCustomItemTitle(e.target.value) }
                      />
                  </td>
                }
                {/*Type*/}
                {showColumns.includes(3) &&
                  <td className="p-l-8 p-t-15">
                    Voľná položka
                  </td>
                }
                {/*Riesi*/}
                {showColumns.includes(2) &&
                  <td></td>
                }
                {/*Mnozstvo*/}
                {showColumns.includes(4) &&
                  <td>
                    <input
                      disabled={disabled}
                      type="text"
                      pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
                      className="form-control hidden-input h-30 t-a-r"
                      value={
                        customItem.id === focusedCustomItem ?
                        editedCustomItemQuantity.toString() :
                        (
                          !isInvoiced ?
                          customItem.quantity.toString() :
                          customItem.invoicedData.quantity
                        )
                      }
                      onBlur={() => {
                        //submit
                        updateCustomItem(customItem.id,{quantity: parseFloat(editedCustomItemQuantity)})
                        setFocusedCustomItem(null);
                      }}
                      onFocus={() => onFocusCustomItem(customItem)}
                      onChange={e => setEditedCustomItemQuantity(e.target.value.replace(',', '.')) }
                      />
                  </td>
                }
                {/*Cennik/Nakup*/}
                {showColumns.includes(5) && toggleTab === "2" &&
                  <td className="table-highlight-background p-l-8">
                  </td>
                }
                {/*Zlava/Marža*/}
                {showColumns.includes(6) && toggleTab === "2" &&
                  <td className="table-highlight-background p-l-8">
                  </td>
                }
                {/*Cena*/}
                {showColumns.includes(7) &&
                  <td className="p-l-8">
                    <span className="text" style={{float: "right"}}>
                      <div style={{float: "right"}} className="p-t-8 p-r-8">
                        €
                      </div>
                      <input
                        disabled={disabled}
                        type="number"
                        style={{display: "inline", width: "70%", float: "right"}}
                        className="form-control hidden-input h-30"
                        value={
                          customItem.id === focusedCustomItem ?
                          editedCustomItemPrice :
                          (
                            !isInvoiced ?
                            customItem.price :
                            customItem.invoicedData.price
                          )
                        }
                        onBlur={() => {
                          updateCustomItem(customItem.id,{price:editedCustomItemPrice})
                          setFocusedCustomItem(null);
                        }}
                        onFocus={() => onFocusCustomItem(customItem)}
                        onChange={e => setEditedCustomItemPrice(e.target.value)}
                        />
                    </span>
                  </td>
                }
                {/*Toolbar*/}
                {showColumns.includes(8) &&
                  <td className="t-a-r">
                    <button
                      className="btn btn-link waves-effect"
                      disabled={ disabled || index === 0 }
                      onClick={()=>{
                        updateCustomItems([
                          //update below
                          { id: sortedCustomItems[ index - 1 ].id, newData: { order: index } },
                          //update current
                          { id: customItem.id, newData: { order: index - 1 } }
                        ]);
                      }}
                      >
                      <i className="fa fa-arrow-up"  />
                    </button>
                    <button
                      className="btn btn-link waves-effect"
                      disabled={ disabled || index === sortedCustomItems.length - 1 }
                      onClick={()=>{
                        updateCustomItems([
                          //update below
                          { id: sortedCustomItems[ index + 1 ].id, newData: { order: index } },
                          //update current
                          { id: customItem.id, newData: { order: index + 1 } }
                        ]);
                      }}
                      >
                      <i className="fa fa-arrow-down"  />
                    </button>
                    <button className="btn btn-link waves-effect"
                      disabled={disabled}
                      onClick={()=>{
                        if(window.confirm('Are you sure?')){
                          removeCustomItem(customItem.id);
                        }
                      }}>
                      <i className="fa fa-times" />
                    </button>
                  </td>
                }
              </tr>)
            }
          )}

          {/* ADD Work */}
          {showAddSubtask && !disabled &&
            <tr>
              {/*Name*/}
              {showColumns.includes(1) &&
                <td colSpan={2} className="p-r-8">
                  <input
                    disabled={disabled}
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
                          title:newSubtaskTitle,
                          type: newSubtaskType,
                          quantity:newSubtaskQuantity!==''?parseInt(newSubtaskQuantity):0,
                          discount:newSubtaskDiscount!==''?parseInt(newSubtaskDiscount):0,
                          assignedTo: newSubtaskAssigned,
                          order:subtasks.length,
                        }

                        setNewSubtaskTitle('');
                        setNewSubtaskQuantity(0);
                        setNewSubtaskDiscount(0);
                        setNewSubtaskAssigned(taskAssigned.length>0?taskAssigned[0]:null);
                        setShowAddSubtask( false);

                        submitService(body);
                      }
                    }}
                    onChange={(e)=>setNewSubtaskTitle(e.target.value)}
                    />
                </td>
              }
              {/*Type*/}
              {showColumns.includes(3) && toggleTab !== "0" &&
                <td className="p-l-8">{/*typ*/}
                  <Select
                    isDisabled={disabled}
                    value={newSubtaskType}
                    options={taskTypes}
                    onChange={(type)=>{
                      setNewSubtaskType(type)
                    }}
                    styles={selectStyle}
                    />
                </td>
              }
              {/*Riesi*/}
              {showColumns.includes(2) && toggleTab !== "0" &&
                <td className="p-l-8">
                  <Select
                    isDisabled={disabled}
                    value={newSubtaskAssigned}
                    onChange={(newSubtaskAssigned)=>{
                      setNewSubtaskAssigned(newSubtaskAssigned);
                    }}
                    options={taskAssigned}
                    styles={invisibleSelectStyleNoArrow}
                    />
                </td>
              }
              {/*Mnozstvo*/}
              {showColumns.includes(4) &&
                <td className="p-l-8 p-r-8">
                  <input
                    disabled={disabled}
                    type="text"
                    pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
                    value={newSubtaskQuantity.toString()}
                    onChange={(e)=>setNewSubtaskQuantity(e.target.value.replace(',', '.'))}
                    className="form-control h-30 t-a-r"
                    id="inlineFormInput"
                    placeholder=""
                    />
                </td>
              }
              {/*Cennik/Nakup*/}
              {showColumns.includes(5) && toggleTab === "2" &&
                <td></td>
              }
              {/*Zlava/Marža*/}
              {showColumns.includes(6) && toggleTab === "2" &&
                <td className="table-highlight-background p-r-8 p-l-8">
                  <input
                    disabled={disabled}
                    type="number"
                    value={newSubtaskDiscount}
                    onChange={(e)=>setNewSubtaskDiscount(e.target.value)}
                    className="form-control input h-30"
                    id="inlineFormInput"
                    placeholder=""
                    />
                </td>
              }
              {/*Cena*/}
              {showColumns.includes(7) &&
                <td className="p-t-15 p-l-8 p-r-8 t-a-r font-14">
                  {
                    isNaN(getTotalDiscountedPrice({discount: newSubtaskDiscount, type: newSubtaskType, quantity: newSubtaskQuantity }))
                    ?'No price'
                    : (getTotalDiscountedPrice({discount: newSubtaskDiscount, type: newSubtaskType, quantity: newSubtaskQuantity })  ).toFixed(2)  + " €"
                  }
                </td>
              }
              {/*Toolbar*/}
              {showColumns.includes(8) &&
                <td className="t-a-r">
                  <button className="btn btn-link"
                    disabled={!newSubtaskType || newSubtaskType.id === null || disabled || newSubtaskAssigned===null}
                    onClick={()=>{
                      let body={
                        done:false,
                        title:newSubtaskTitle,
                        type: newSubtaskType,
                        quantity: newSubtaskQuantity !== '' ? parseFloat(newSubtaskQuantity) : 0,
                        discount:newSubtaskDiscount!==''?newSubtaskDiscount:0,
                        assignedTo:newSubtaskAssigned,
                        order:subtasks.length,
                      }

                      setNewSubtaskTitle('');
                      setNewSubtaskQuantity(0);
                      setNewSubtaskDiscount(0);
                      setNewSubtaskAssigned(taskAssigned.length>0?taskAssigned[0]:null);
                      setShowAddSubtask( false);

                      submitService(body, getTotalDiscountedPrice({discount: newSubtaskDiscount, type: newSubtaskType, quantity: newSubtaskQuantity }));
                    }}
                    >
                    <i className="fa fa-plus" />
                  </button>
                  <button className="btn btn-link waves-effect"
                    disabled={disabled}
                    onClick={()=>{
                      setShowAddSubtask(false)
                    }}
                    >
                    <i className="fa fa-times"  />
                  </button>
                </td>
              }
            </tr>
          }
          {/* ADD Trip */}
          {showAddTrip && !disabled &&
            <tr>
              {/*Name*/}
              {showColumns.includes(1) &&
                <td colSpan={2} className="p-r-8">
                  <Select
                    isDisabled={disabled}
                    value={newTripType}
                    onChange={(newTripType)=>{
                      setNewTripType(newTripType)
                    }}
                    options={tripTypes}
                    styles={selectStyle}
                    />
                </td>
              }
              {/*Type*/}
              {showColumns.includes(3) &&
                <td className="p-t-15 p-l-8">Výjazd</td>
              }
              {/*Riesi*/}
              {showColumns.includes(2) &&
                <td className="p-l-8">
                  <Select
                    isDisabled={disabled}
                    value={newTripAssigned}
                    onChange={(newTripAssigned)=>{
                      setNewTripAssigned(newTripAssigned)
                    }}
                    options={taskAssigned}
                    styles={invisibleSelectStyleNoArrow}
                    />
                </td>
              }
              {/*Mnozstvo*/}
              {showColumns.includes(4) &&
                <td className="p-l-8 p-r-8">
                  <input
                    disabled={disabled}
                    type="text"
                    pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
                    value={newTripQuantity.toString()}
                    onChange={(e)=>setNewTripQuantity(e.target.value.replace(',', '.'))}
                    className="form-control h-30 t-a-r"
                    id="inlineFormInput"
                    placeholder="Quantity"
                    />
                </td>
              }
              {/*Cennik/Nakup*/}
              {showColumns.includes(5) && toggleTab === "2" &&
                <td></td>
              }
              {/*Zlava/Marža*/}
              {showColumns.includes(6) && toggleTab === "2" &&
                <td className="table-highlight-background p-l-8 p-r-8">
                  <input
                    disabled={disabled}
                    type="number"
                    value={newTripDiscount}
                    onChange={(e)=>setNewTripDiscount(e.target.value)}
                    className="form-control h-30"
                    id="inlineFormInput"
                    placeholder="Discount"
                    />
                </td>
              }
              {/*Cena*/}
              {showColumns.includes(7) &&
                <td className="p-t-15 p-l-8 p-r-8 t-a-r font-14">
                  {
                    isNaN(getTotalDiscountedPrice({discount:newTripDiscount,quantity:newTripQuantity,type:newTripType})) ?
                    'No price' :
                    (getTotalDiscountedPrice({discount:newTripDiscount,quantity:newTripQuantity,type:newTripType}) ).toFixed(2) + " €"
                  }
                </td>
              }
              {/*Toolbar*/}
              {showColumns.includes(8) &&
                <td className="t-a-r">
                  <button className="btn btn-link"
                    disabled={newTripType===null||isNaN(parseInt(newTripQuantity))||disabled|| newTripAssigned===null}
                    onClick={()=>{
                      let body={
                        type:newTripType,
                        assignedTo: newTripAssigned,
                        quantity: newTripQuantity !== '' ? parseFloat(newTripQuantity) : 0,
                        discount: newTripDiscount!==''?newTripDiscount:0,
                        done: false,
                        order: workTrips.length,
                      }

                      setNewTripAssigned(taskAssigned.length>0?taskAssigned[0]:null);
                      setNewTripQuantity(1);
                      setNewTripDiscount(0);
                      setShowAddTrip(false);

                      submitTrip(body, getTotalDiscountedPrice({discount:newTripDiscount,quantity:newTripQuantity,type:newTripType}));
                    }}
                    >
                    <i className="fa fa-plus" />
                  </button>
                  <button className="btn btn-link waves-effect"
                    disabled={disabled}
                    onClick={()=>{
                      setShowAddTrip(false);
                      setShowAddSubtask(false);
                    }}>
                    <i className="fa fa-times"  />
                  </button>
                </td>
              }
            </tr>
          }
          {/* ADD Material */}
          {showAddMaterial && !disabled &&
            <tr>
              {/*Name*/}
              {showColumns.includes(1) &&
                <td  colSpan={2} className="p-r-8">
                  <input
                    disabled={disabled}
                    type="text"
                    className="form-control h-30"
                    id="inlineFormInput"
                    placeholder=""
                    value={newMaterialTitle}
                    onChange={(e)=>setNewMaterialTitle(e.target.value)}
                    />
                </td>
              }
              {/*Input Nakupna cena*/}
              {showColumns.includes(3) &&
                <td className="p-t-15 p-l-8">
                  Materiál
                </td>
              }
              {/*Text Nakupna cena*/}
              {showColumns.includes(2) &&
                <td className="p-r-8 p-l-8 table-highlight-background">
                  {
                    toggleTab === '1' &&
                    <div className="row">
                      <div className="w-50 center-hor">
                        Nákupná cena
                      </div>
                      <div className="w-50">
                        <input
                          disabled={disabled}
                          type="number"
                          value={newMaterialPrice}
                          onChange={(e)=>{
                            let newMaterialPrice = e.target.value;
                            if(!marginChanged){
                              if(newMaterialPrice==='' || parseFloat(newMaterialPrice) < 50 ){
                                let newMaterialMargin = (company && company.pricelist ? company.pricelist.materialMargin : 0);
                                setNewMaterialPrice(newMaterialPrice);
                                setNewDiscountedMaterialPrice(getDiscountedMaterialPrice({price: newMaterialPrice, margin: newMaterialMargin}).toFixed(2));
                                setNewMaterialMargin(newMaterialMargin);
                              }else{
                                let newMaterialMargin = (company && company.pricelist ? company.pricelist.materialMarginExtra : 0);
                                setNewMaterialPrice(newMaterialPrice);
                                setNewDiscountedMaterialPrice(getDiscountedMaterialPrice({price: newMaterialPrice, margin: newMaterialMargin}).toFixed(2));
                                setNewMaterialMargin(newMaterialMargin);
                              }
                            }else{
                              setNewMaterialPrice(newMaterialPrice);
                              setNewDiscountedMaterialPrice(getDiscountedMaterialPrice({price: newMaterialPrice, margin: newMaterialMargin}).toFixed(2));
                            }
                          }}
                          className="form-control h-30"
                          id="inlineFormInput"
                          placeholder="Nákupná cena"
                          />
                      </div>
                    </div>
                  }
                </td>
              }
              {/*Mnozstvo*/}
              {showColumns.includes(4) &&
                <td className="p-r-8 p-l-8">
                  <input
                    disabled={disabled}
                    type="text"
                    pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
                    value={newMaterialQuantity.toString()}
                    onChange={(e)=>setNewMaterialQuantity(e.target.value.replace(',', '.') )}
                    className="form-control h-30 t-a-r"
                    id="inlineFormInput"
                    placeholder=""
                    />
                </td>
              }
              {/*Cennik/Nakup*/}
              {showColumns.includes(5) && toggleTab === "2" &&
                <td className="table-highlight-background p-l-8 p-r-8">
                  <input
                    disabled={disabled}
                    type="number"
                    value={newMaterialPrice}
                    onChange={(e)=>{
                      let newMaterialPrice = e.target.value;
                      if(!marginChanged){
                        if(newMaterialPrice==='' || parseFloat(newMaterialPrice) < 50 ){
                          setNewMaterialPrice(newMaterialPrice);
                          setNewMaterialMargin(company && company.pricelist ? company.pricelist.materialMargin : 0);
                        }else{
                          setNewMaterialPrice(newMaterialPrice);
                          setNewMaterialMargin(company && company.pricelist ? company.pricelist.materialMarginExtra : 0);
                        }
                      }else{
                        setNewMaterialPrice(newMaterialPrice);
                      }
                    }}
                    className="form-control h-30"
                    id="inlineFormInput"
                    placeholder=""
                    />
                </td>
              }
              {/*Zlava/Marža*/}
              {showColumns.includes(6) && toggleTab === "2" &&
                <td className="table-highlight-background p-r-8">
                  <input
                    disabled={disabled}
                    type="number"
                    value={newMaterialMargin}
                    onChange={(e)=> {
                      setNewMaterialMargin(e.target.value);
                      setMarginChanged(true);
                    }}
                    className="form-control h-30"
                    id="inlineFormInput"
                    placeholder=""
                    />
                </td>
              }
              {/*Cena*/}
              {showColumns.includes(7) &&
                <td className="p-l-8 p-r-8 t-a-r">
                  <input
                    disabled={disabled}
                    type="number"
                    value={newDiscountedMaterialPrice}
                    onChange={(e)=>{
                      let newDiscountedMaterialPrice = e.target.value;

                      if(!marginChanged){
                        let newMaterialMargin = (company && company.pricelist ? company.pricelist.materialMargin : 0);
                        let basicMaterialPrice = getBasicMaterialPrice({price: newDiscountedMaterialPrice, margin: newMaterialMargin});

                        if(newDiscountedMaterialPrice === '' || parseFloat(basicMaterialPrice) > 50 ){
                          newMaterialMargin = (company && company.pricelist ? company.pricelist.materialMarginExtra : 0);
                          setNewMaterialPrice( getBasicMaterialPrice({price: newDiscountedMaterialPrice, margin: newMaterialMargin}) );
                          setNewDiscountedMaterialPrice(newDiscountedMaterialPrice);
                          setNewMaterialMargin(newMaterialMargin);

                        }else{
                          setNewMaterialPrice( basicMaterialPrice );
                          setNewDiscountedMaterialPrice(newDiscountedMaterialPrice);
                          setNewMaterialMargin(newMaterialMargin);
                        }

                      }else{
                        setNewMaterialPrice(getBasicMaterialPrice({price: newDiscountedMaterialPrice, margin:newMaterialMargin}));
                        setNewDiscountedMaterialPrice(newDiscountedMaterialPrice);
                      }
                    }}
                    className="form-control h-30"
                    id="inlineFormInput"
                    placeholder="Cena"
                    />
                </td>
              }
              {/*Toolbar*/}
              {showColumns.includes(8) &&
                <td className="t-a-r">
                  <button className="btn btn-link"
                    disabled={disabled}
                    onClick={()=>{
                      let body={
                        margin:newMaterialMargin!==''?parseFloat(newMaterialMargin):0,
                        price:newMaterialPrice!==''?newMaterialPrice:0,
                        quantity:newMaterialQuantity!==''? parseFloat(newMaterialQuantity) :0,
                        title:newMaterialTitle,
                        done:false,
                        order: materials.length,
                      }
                      setShowAddMaterial( false);
                      setNewMaterialTitle('');
                      setNewMaterialQuantity(1);
                      setNewMaterialMargin(0);
                      setNewMaterialPrice(0);
                      setMarginChanged(false);

                      submitMaterial(body);
                    }}
                    >
                    <i className="fa fa-plus" />
                  </button>
                  <button className="btn btn-link waves-effect"
                    disabled={disabled}
                    onClick={()=>{
                      setShowAddMaterial(false)
                    }}>
                    <i className="fa fa-times"  />
                  </button>
                </td>
              }
            </tr>
          }
          {/* ADD Custom item */}
          {showAddCustomItem && !disabled &&
            <tr>
              {/*Name*/}
              {showColumns.includes(1) &&
                <td  colSpan={2} className="p-r-8">
                  <input
                    disabled={disabled}
                    type="text"
                    className="form-control h-30"
                    id="inlineFormInput"
                    placeholder=""
                    value={newCustomItemTitle}
                    onChange={(e)=>setNewCustomItemTitle(e.target.value)}
                    />
                </td>
              }
              {/*Type*/}
              {showColumns.includes(3) &&
                <td className="p-t-15 p-l-8">
                  Voľná položka
                </td>
              }
              {/*Riesi */}
              {showColumns.includes(2) &&
                <td></td>
              }
              {/*Mnozstvo*/}
              {showColumns.includes(4) &&
                <td className="p-r-8 p-l-8">
                  <input
                    disabled={disabled}
                    type="text"
                    pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
                    value={newCustomItemQuantity.toString()}
                    onChange={(e)=>setNewCustomItemQuantity(e.target.value.replace(',', '.'))}
                    className="form-control h-30 t-a-r"
                    id="inlineFormInput"
                    placeholder=""
                    />
                </td>
              }
              {/*Cennik/Nakup*/}
              {showColumns.includes(5) && toggleTab === "2" &&
                <td className="table-highlight-background p-l-8 p-r-8">
                </td>
              }
              {/*Zlava/Marža*/}
              {showColumns.includes(6) && toggleTab === "2" &&
                <td className="table-highlight-background">
                </td>
              }
              {/*Cena*/}
              {showColumns.includes(7) &&
                <td className="p-l-8 p-r-8 t-a-r">
                  <input
                    disabled={disabled}
                    type="number"
                    value={newCustomItemPrice}
                    onChange={(e)=>{
                      let newCustomItemPrice = e.target.value;
                      setNewCustomItemPrice(newCustomItemPrice);
                    }}
                    className="form-control h-30"
                    id="inlineFormInput"
                    placeholder=""
                    />
                </td>
              }
              {/*Toolbar*/}
              {showColumns.includes(8) &&
                <td className="t-a-r">
                  <button className="btn btn-link"
                    disabled={disabled}
                    onClick={()=>{
                      let body={
                        price:newCustomItemPrice!==''?newCustomItemPrice:0,
                        quantity:newCustomItemQuantity!==''? parseFloat(newCustomItemQuantity):0,
                        title:newCustomItemTitle,
                        done:false,
                        order:customItems.length,
                      }
                      setNewCustomItemPrice(0);
                      setNewCustomItemQuantity(1);
                      setNewCustomItemTitle('');
                      setShowAddCustomItem( false);
                      submitCustomItem(body);
                    }}
                    >
                    <i className="fa fa-plus" />
                  </button>
                  <button className="btn btn-link waves-effect"
                    disabled={disabled}
                    onClick={()=>{
                      setShowAddCustomItem(false)
                    }}>
                    <i className="fa fa-times"  />
                  </button>
                </td>
              }
            </tr>
          }
          {/* ADD Buttons */}
          {!showAddSubtask && !showAddTrip && !showAddMaterial && !showAddCustomItem && !disabled &&
            <tr>
              <td colSpan={(toggleTab === '1' ? 8 : 10)}>
                {!showAddSubtask &&
                  <button className="btn btn-link waves-effect"
                    disabled={disabled}
                    onClick={()=>{
                      setShowAddSubtask(true);
                    }}
                    >
                    <i className="fa fa-plus" />
                    Práca
                  </button>
                }
                {!showAddTrip && !showSubtasks &&
                  <button className="btn btn-link waves-effect"
                    disabled={disabled}
                    onClick={()=>{
                      setShowAddTrip(true);
                    }}
                    >
                    <i className="fa fa-plus" />
                    Výjazd
                  </button>
                }
                {!showAddMaterial && !showSubtasks &&
                  <button className="btn btn-link waves-effect"
                    disabled={disabled}
                    onClick={()=>{
                      setShowAddMaterial(true);
                    }}
                    >
                    <i className="fa fa-plus" />
                    Materiál
                  </button>
                }
                {!showAddCustomItem && !showSubtasks &&
                  <button className="btn btn-link waves-effect"
                    disabled={disabled}
                    onClick={()=>{
                      setShowAddCustomItem(true);
                    }}
                    >
                    <i className="fa fa-plus" />
                    Vlastná položka
                  </button>
                }
              </td>
            </tr>
          }
        </tbody>
      </table>
      {/* Statistics */}
      {(workTrips.length + subtasks.length + materials.length + customItems.length > 0) &&
        <div className="row m-r-10">
          <div className="text-right ml-auto m-r-5">
            <b>Cena bez DPH: </b>
            {
              (
                subtasks.concat(workTrips).reduce((acc, cur)=> acc+(isNaN(getTotalPrice(cur))?0:getTotalPrice(cur)),0)
                + materials.reduce((acc, cur)=> acc+(isNaN(parseFloat(getDiscountedMaterialPrice(cur))) || isNaN(parseInt(cur.quantity)) ? 0 : parseFloat(getDiscountedMaterialPrice(cur))*parseInt(cur.quantity)),0)
                + customItems.reduce((acc, cur)=> acc+(isNaN(parseFloat(cur.price))||isNaN(parseInt(cur.quantity)) ? 0 : parseFloat(cur.price) * parseInt(cur.quantity)),0)
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
                  subtasks.concat(workTrips).reduce((acc, cur)=> acc+(isNaN(getTotalPrice(cur))?0:getTotalPrice(cur)),0)
                  + materials.reduce((acc, cur)=> acc+(isNaN(parseFloat(getDiscountedMaterialPrice(cur))) || isNaN(parseInt(cur.quantity)) ? 0 : parseFloat(getDiscountedMaterialPrice(cur))*parseInt(cur.quantity)),0)
                  + customItems.reduce((acc, cur)=> acc+(isNaN(parseFloat(cur.price))||isNaN(parseInt(cur.quantity)) ? 0 : parseFloat(cur.price) * parseInt(cur.quantity)),0)
                )*getDPH()
              ).toFixed(2)
            }
          </div>
        </div>
      }
    </div>
  );
}

export const getCreationError = ( newSubtaskType, newSubtaskAssigned, company ) => {
  //let noType = newSubtaskType.id === null;
  let noType = false;
  let noAssigned = newSubtaskAssigned.length === 0;
  let noCompany = company === null;
  let messages = [];
  if ( noAssigned ) {
    messages.push( 'assign the task to someone' );
  }
  if ( noType ) {
    messages.push( 'pick task type' );
  }
  if ( noCompany ) {
    messages.push( 'pick company' );
  }

  if ( messages.length === 0 ) {
    return ''
  }
  let errorMessage = 'First ';
  for ( let i = 0; i < messages.length; i++ ) {
    if ( i === messages.length - 1 ) {
      errorMessage += `${messages.length > 1 ? 'and ' : ''} ${messages[i]}!`
    } else {
      errorMessage += `${messages[i]}${messages.length-2 === i ? ' ' : ', '}`
    }
  }
  return errorMessage;
}