import React from 'react';

import classnames from "classnames";
import {
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import Empty from 'components/Empty';
import Checkbox from 'components/checkbox';
import Switch from "react-switch";
import {
  useTranslation
} from "react-i18next";

const defaultCols = [
  {
    header: 'done',
    key: 'done',
    width: null,
    headerClassnames: "",
    columnClassnames: "",
  },
  {
    header: 'title',
    key: 'title',
    width: null,
    headerClassnames: "",
    columnClassnames: "",
  },
  {
    header: 'quantityShort',
    key: 'quantity',
    width: "50",
    headerClassnames: "text-right",
    columnClassnames: "p-l-5",
  },
  {
    header: 'pricePerUnit',
    key: 'price',
    width: "8%",
    headerClassnames: "text-right",
    columnClassnames: "p-l-8 min-width-100",
  },
  {
    header: 'total',
    key: 'total',
    width: "8%",
    headerClassnames: "text-right",
    columnClassnames: "p-l-8 min-width-100",
  },
  {
    header: 'invoiced',
    key: 'approved',
    width: "2%",
    headerClassnames: "",
    columnClassnames: "p-l-8",
  },
  {
    header: 'actions',
    key: 'actions',
    width: "80",
    headerClassnames: "text-right",
    columnClassnames: "text-right",
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

export default function MaterialsTable( props ) {
  //data & queries
  const {
    invoiced,
    showColumns,
    newColumnDefinitions,
    showTotals,
    autoApproved,
    userRights,
    currentUser,
    company,
    materials,
    addMaterial,
    updateMaterial,
    updateMaterials,
    removeMaterial,
  } = props;

  const {
    t
  } = useTranslation();

  const shownColumns = getShownData( showColumns, autoApproved, newColumnDefinitions ? newColumnDefinitions : [] );

  //Materials
  const [ showAddMaterial, setShowAddMaterial ] = React.useState( false );
  const [ focusedMaterial, setFocusedMaterial ] = React.useState( null );

  const [ editedMaterialTitle, setEditedMaterialTitle ] = React.useState( "" );
  const [ editedMaterialQuantity, setEditedMaterialQuantity ] = React.useState( 0 );
  const [ editedMaterialPrice, setEditedMaterialPrice ] = React.useState( null );

  const [ newMaterialTitle, setNewMaterialTitle ] = React.useState( '' );
  const [ newMaterialQuantity, setNewMaterialQuantity ] = React.useState( 1 );
  const [ newMaterialPrice, setNewMaterialPrice ] = React.useState( 0 );
  const [ newMaterialTotalPrice, setNewMaterialTotalPrice ] = React.useState( 0 );
  const [ newMaterialApproved, setNewMaterialApproved ] = React.useState( false );

  React.useEffect( () => {
    setNewMaterialTotalPrice( getNewTotalPrice() );
  }, [ newMaterialPrice, newMaterialQuantity ] );

  const onFocusMaterial = ( material ) => {
    setEditedMaterialTitle( material.title );
    setEditedMaterialQuantity( material.quantity );
    setEditedMaterialPrice( material.price );
    setFocusedMaterial( material.id );
  }

  const getMaterialPrice = ( material ) => {
    return parseFloat( material.price )
  }

  const getDPH = () => {
    let dph = 20;
    if ( company && company.dph > 0 ) {
      dph = company.dph;
    }
    return ( 100 + dph ) / 100;
  }

  const getNewTotalPrice = () => {
    let quantity = 0;
    let price = 0;
    if ( !isNaN( parseFloat( newMaterialPrice ) ) ) {
      price = parseFloat( newMaterialPrice );
    }
    if ( !isNaN( parseFloat( newMaterialQuantity ) ) ) {
      quantity = parseFloat( newMaterialQuantity );
    }

    return ( quantity * price )
      .toFixed( 2 )
  }

  let sortedMaterials = [ ...materials ].sort( ( material1, material2 ) => material1.order > material2.order ? -1 : 1 );
  let disabled = !userRights.rights.taskMaterialsWrite || invoiced;

  const getColRender = ( key, material, index ) => {
    switch ( key ) {
      case 'done': {
        return (
          <Checkbox
            className="m-t-5 segoe-blue-text"
            disabled= { disabled }
            value={ material.done }
            onChange={()=>{
              updateMaterial(material.id,{done:!material.done})
            }}
            />
        )
      }
      case 'title': {
        return (
          <input
            disabled={disabled}
            className="form-control hidden-input segoe-blue-text"
            value={
              material.id === focusedMaterial ?
              editedMaterialTitle :
              material.title
            }
            onBlur={() => {
              updateMaterial(material.id,{title:editedMaterialTitle})
              setFocusedMaterial(null);
            }}
            onFocus={() => onFocusMaterial(material)}
            onChange={e => setEditedMaterialTitle(e.target.value) }
            />
        )
      }
      case 'quantity': {
        return (
          <input
            disabled={disabled}
            type="text"
            pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
            className="form-control hidden-input h-30 text-right segoe-blue-text"
            value={
              material.id === focusedMaterial ?
              editedMaterialQuantity.toString() :
              material.quantity.toString()
            }
            onBlur={() => {
              //submit
              updateMaterial(material.id,{quantity: parseFloat(editedMaterialQuantity)})
              setFocusedMaterial(null);
            }}
            onFocus={() => onFocusMaterial(material)}
            onChange={e => setEditedMaterialQuantity(e.target.value.replace(',', '.')) }
            />
        )
      }
      case 'price': {
        return (
          <span className="text segoe-blue-text" style={{float: "right"}}>
            <div style={{float: "right"}} className="p-t-8 p-r-8">
              €
            </div>
            <input
              disabled={disabled}
              type="number"
              style={{display: "inline", width: "70%", float: "right"}}
              className="form-control hidden-input h-30 segoe-blue-text"
              value={
                material.id === focusedMaterial ?
                editedMaterialPrice :
                material.price

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
        )
      }
      case 'total': {
        return (
          <div className="p-t-7 p-r-8 text-right segoe-blue-text">
            {  material.id === focusedMaterial
              ?
              (
                (  getMaterialPrice( { price: editedMaterialPrice } ) *
                parseFloat(editedMaterialQuantity)
              ).toFixed( 2 ) + " €"
            )
            :
            (
              (
                getMaterialPrice( material ) *
                parseFloat( material.quantity )
              ).toFixed( 2 ) + " €"
            )
          }
        </div>
        );
      }
      case 'approved': {
        return (
          <div className="vykazy-approved">
          <Switch
            checked={material.approved}
            disabled={disabled}
            onChange={ () => { updateMaterial( material.id, { approved: !material.approved } ) } }
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
          <button
            className="btn-link btn-distance"
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
            className="btn-link btn-distance"
            disabled={ disabled || index === sortedMaterials.length - 1 }
            onClick={()=>{
              updateMaterials([
                //update above
                { id: sortedMaterials[ index + 1 ].id, newData: { order: index } },
                //update current
                { id: material.id, newData: { order: index + 1 } }
              ]);
            }}
            >
            <i className="fa fa-arrow-down"  />
          </button>
          <button className="btn-link"
            disabled={disabled}
            onClick={()=>{
              removeMaterial(material.id);
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

  const getCreateColRender = ( key ) => {
    switch ( key ) {
      case 'title': {
        return (
          <input
          disabled={disabled}
          type="text"
          className="form-control h-30 segoe-blue-text"
          id="inlineFormInput"
          placeholder={t('enterTitle')}
          value={newMaterialTitle}
          onChange={(e)=>setNewMaterialTitle(e.target.value)}
          />
        )
      }
      case 'quantity': {
        return (
          <input
          disabled={disabled}
          type="text"
          pattern="([0-9]+.{0,1}[0-9]*,{0,1})*[0-9]"
          value={newMaterialQuantity.toString()}
          onChange={(e)=>setNewMaterialQuantity(e.target.value.replace(',', '.') )}
          className="form-control h-30 text-right segoe-blue-text"
          id="inlineFormInput"
          placeholder={t('quantity')}
          />
        )
      }
      case 'price': {
        return (
          <span className="text" style={{float: "right"}}>
          <div style={{float: "right"}} className="p-t-8 p-r-8 p-l-4 segoe-blue-text">
            €
          </div>
          <input
            disabled={disabled}
            type="number"
            value={newMaterialPrice}
            style={{display: "inline", width: "70%", float: "right"}}
            onChange={(e)=>{
              setNewMaterialPrice(e.target.value);
            }}
            className="form-control h-30 segoe-blue-text"
            placeholder={t('price')}
            />
        </span>
        )
      }
      case 'total': {
        return (
          <span className="text" style={{float: "right"}}>
          <div style={{float: "right"}} className="p-t-8 p-r-8 p-l-4 segoe-blue-text">
            €
          </div>
          <input
            disabled={disabled}
            type="number"
            value={newMaterialTotalPrice}
            style={{display: "inline", width: "70%", float: "right"}}
            onChange={(e)=>{
              if(isNaN(parseFloat(e.target.value))){
                setNewMaterialTotalPrice(e.target.value);
              }else if(!isNaN(parseFloat(newMaterialQuantity))){
                setNewMaterialTotalPrice(e.target.value);
                setNewMaterialPrice((parseFloat(e.target.value) / parseFloat(newMaterialQuantity)).toFixed(2) );
              }
            }}
            className="form-control h-30 segoe-blue-text"
            placeholder={t('totalPrice')}
            />
        </span>
        )
      }
      case 'approved': {
        return (
          <div className="vykazy-approved">
          <Switch
            checked={newMaterialApproved}
            disabled={disabled}
            onChange={ () => { setNewMaterialApproved(!newMaterialApproved) } }
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
              setShowAddMaterial( false);
              setNewMaterialTitle('');
              setNewMaterialQuantity(1);
              setNewMaterialPrice(0);
              setNewMaterialTotalPrice(0);
              setNewMaterialApproved(false);
            }}
            >
            <i className="fa fa-times"  />
          </button>
          <button className="btn"
            disabled={disabled}
            onClick={()=>{
              let body={
                margin: 0,
                price: newMaterialPrice!=='' ? newMaterialPrice : 0,
                quantity: newMaterialQuantity!=='' ? parseFloat(newMaterialQuantity) : 0,
                title: newMaterialTitle,
                done: false,
                approved: newMaterialApproved,
                order: materials.length,
              }
              setShowAddMaterial( false);
              setNewMaterialTitle('');
              setNewMaterialQuantity(1);
              setNewMaterialPrice(0);
              setNewMaterialTotalPrice(0);
              setNewMaterialApproved(false);

              addMaterial(body);
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
              className={classnames("clickable vykazyTableNav active")}
              >
              {t('material')}
            </span>
          </th>
          { shownColumns.map((colData, index) => {
            if(index < 2 ){
              return null;
            }
            return <th width={colData.width} key={colData.key} className={colData.headerClassnames}>{t(colData.header)}</th>
          })}
        </tr>
      </thead>
      <tbody>
        {/* Materials render*/}
        { sortedMaterials.map((material, order) => (
          <tr key={material.id}>
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
                      {getColRender(extraColData.key, material, index)}
                    </div>
                  }
                  <div className={extraData ? 'm-l-5 flex' : ''} >
                    { getColRender(colData.key, material, order) }
                  </div>
                </td>
              )
            })}
          </tr>
        ))}

        {/* Add button*/}
        { !showAddMaterial && !disabled &&
          <tr key='addButton'>
            <td colSpan={(shownColumns.length - 1).toString()}>
              <button className="btn-link btn-distance"
                disabled={disabled}
                onClick={()=>{
                  setShowAddMaterial(true);
                }}
                >
                <i className="fa fa-plus" />
                {t('material')}
              </button>
            </td>
          </tr>
        }

        {/* Add row*/}
        { showAddMaterial && !disabled &&
          <tr key='addMaterialRow'>
            { shownColumns.map((colData, index) => {
              if(colData.key === 'done'){
                return null;
              }

              return (
                <td className={`${colData.columnClassnames}`} key={colData.key} >
                  { getCreateColRender(colData.key) }
                </td>
              )
            })}
          </tr>
        }
      </tbody>
    </table>

    {/* Statistics */}
    { showTotals && materials.length > 0 &&
      <div className="row">
        <div className="ml-auto row m-r-10">
          <div className="text-right ml-auto m-r-5">
            <b>{t('priceWithoutTax')}: </b>
            {
              (
                materials.reduce((acc, cur)=> acc+(isNaN(parseFloat(getMaterialPrice(cur))) || isNaN(parseInt(cur.quantity)) ? 0 : parseFloat(getMaterialPrice(cur))*parseInt(cur.quantity)),0)
              ).toFixed(2)
            }
          </div>
          <div className="text-right m-r-5">
            <b>{t('tax')}: </b>
            {((getDPH()-1)*100).toFixed(2) + ' %' }
          </div>
          <div className="text-right">
            <b>{t('priceWithTax')}: </b>
            {
              (
                (
                  materials.reduce((acc, cur) => acc+(isNaN(parseFloat(getMaterialPrice(cur))) || isNaN(parseInt(cur.quantity)) ? 0 : parseFloat(getMaterialPrice(cur))*parseInt(cur.quantity)),0)
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