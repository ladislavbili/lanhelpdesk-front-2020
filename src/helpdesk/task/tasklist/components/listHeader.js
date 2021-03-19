import React from 'react';
import Search from './search';
import Checkbox from 'components/checkbox';
import MultiSelect from 'components/MultiSelectNew';
import classnames from "classnames";
import {
  orderByValues,
  attributeLimitingRights,
} from 'configs/constants/tasks';

export default function ListHeader( props ) {
  const {
    loading,
    localProject,
    displayValues: allDisplayValues,
    selectedStatuses,
    setSelectedStatuses,
    multiselect,
    setPreference,
    preference,
    ascending,
  } = props;

  const displayValues = (
    allDisplayValues ?
    allDisplayValues
    .filter( ( displayValue ) => displayValue.type !== 'checkbox' )
    .map( ( displayValue ) => ( {
      ...displayValue,
      id: displayValue.value
    } ) ) : []
  );

  const getPreferenceColumns = () => {
    if ( localProject.project.id === null ) {
      return displayValues;
    }
    let notAllowedColumns = attributeLimitingRights.filter( ( limitingRight ) => !localProject.right[ limitingRight.right ] )
      .map( ( limitingRight ) => limitingRight.preference );
    return displayValues.filter( ( column ) => !notAllowedColumns.includes( column.value ) );
  }

  const allStatuses = localProject.project.statuses ? localProject.project.statuses : [];
  const [ columnPreferencesOpen, setColumnPreferencesOpen ] = React.useState( false );
  const openColumnPreferences = () => setColumnPreferencesOpen( !columnPreferencesOpen );

  return (
    <div className={classnames("d-flex", "h-60px", "flex-row", 'm-l-30')}>
      <Search {...props}/>
      { !multiselect && selectedStatuses && allStatuses.length > 0 &&
        <div className="center-hor flex-row">
          <Checkbox
            className="m-l-5  m-r-10"
            style={{marginTop: 'auto', height: '20px'}}
            label= "All"
            disabled={loading}
            value={ selectedStatuses.length===0 || allStatuses.every((status)=>selectedStatuses.includes(status.id)) }
            onChange={()=>{
              if(selectedStatuses.length===0){
                let newStatuses = allStatuses.map((status) => status.id );
                setSelectedStatuses( newStatuses );
              }else{
                setSelectedStatuses( [] );
              }
            }}
            />
          { allStatuses.map((status)=>
            <Checkbox
              key={status.id}
              disabled={loading}
              className="m-l-5 m-r-10"
              style={{marginTop: 'auto', height: '20px'}}
              label={ status.title }
              value={ selectedStatuses.includes(status.id) }
              onChange={()=>{
                if(selectedStatuses.includes(status.id)) {
                  let newStatuses = selectedStatuses.filter( (id) => !(status.id === id) );
                  setSelectedStatuses( newStatuses );
                }else{
                  let newStatuses = [...selectedStatuses, status.id];
                  setSelectedStatuses(newStatuses);
                }
              }}
              />
          )}
        </div>
      }
      { multiselect && selectedStatuses &&
        <Multiselect
          className="ml-auto m-r-10"
          disabled={loading}
          options={ [{ id:'All', label: 'All' }, ...allStatuses.map((status)=>({...status,label:status.title}))] }
          value={
            [{ id:'All', label: 'All' }, ...allStatuses.map((status)=>({...status,label:status.title}))]
            .filter((status)=> selectedStatuses.includes(status.id))
            .concat(allStatuses.every((status)=>selectedStatuses.includes(status.id))?[{ id:'All', label: 'All' }]:[])
          }
          label={ "Status filter" }
          onChange={ (status) => {
            if(status.id === 'All'){
              if(selectedStatuses.length===0){
                let newStatuses = allStatuses.map((status) => status.id );
                setSelectedStatuses( newStatuses );
              }else{
                setSelectedStatuses( [] );
              }
            }else{
              if(selectedStatuses.includes(status.id)) {
                let newStatuses = selectedStatuses.filter( (id) => !(status.id === id) );
                setSelectedStatuses( newStatuses );
              }else{
                let newStatuses = [...selectedStatuses, status.id];
                setSelectedStatuses(newStatuses);
              }
            }
          } }
          />
      }

      <div className="ml-auto p-2 align-self-center">
        <div className="d-flex flex-row">
          <div className={
              classnames(
                {
                  "m-r-22": props.layout !== 0,
                  "m-r-5": props.layout === 0
                },
                "d-flex", "flex-row", "align-items-center", "ml-auto"
              )
            }
            >

            <div className="text-basic m-r-5 m-l-5">
              Sort by
            </div>

            <select
              value={props.orderBy}
              className="invisible-select text-bold text-highlight"
              onChange={(e)=>props.setOrderBy(e.target.value)}>
              { orderByValues.map((item,index) =>
                <option value={item.value} key={index}>{item.label}</option>
              ) }
            </select>

            { ascending &&
              <button type="button" className="btn-link" onClick={()=>props.setAscending(false)}>
                <i className="fas fa-arrow-up" />
              </button>
            }

            { !ascending &&
              <button type="button" className="btn-link" onClick={()=>props.setAscending(true)}>
                <i className="fas fa-arrow-down" />
              </button>
            }

            <div className="row">
              <button className="btn-link m-l-10" onClick={ openColumnPreferences } >
                <i className="fa fa-cog" />
              </button>
              <MultiSelect
                disabled={loading}
                className="center-hor"
                menuClassName="m-t-30"
                bodyClassName="p-l-10 p-r-10 scrollable"
                bodyStyle={{ maxHeight: 300 }}
                direction="left"
                style={{}}
                header="Select task list columns"
                closeMultiSelect={openColumnPreferences}
                showFilter={false}
                open={columnPreferencesOpen}
                items={getPreferenceColumns()}
                selected={getPreferenceColumns().filter((displayValue) => displayValue.show )}
                onChange={(_, item, deleted ) => {
                  let newVisibility = {};
                  displayValues.forEach((displayValue) => {
                    if(displayValue.id !== item.id){
                      newVisibility[displayValue.visKey ? displayValue.visKey : displayValue.value ] = displayValue.show;
                    }else{
                      newVisibility[displayValue.visKey ? displayValue.visKey : displayValue.value] = !deleted;
                    }
                  })
                  setPreference(newVisibility);
                }}
                />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}