import React from 'react';
import Search from './search';
import Checkbox from 'components/checkbox';
import Empty from 'components/Empty';
import MultiSelect from 'components/MultiSelectNew';
import classnames from "classnames";
import {
  orderByValues,
  attributeLimitingRights,
  ganttAttributeLimitingRights,
} from 'configs/constants/tasks';

//statuses, sort, column preferences
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
    orderBy,
    setOrderBy,
    setAscending,
    gantt,
    search,
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
    let notAllowedColumns = ( gantt ? ganttAttributeLimitingRights : attributeLimitingRights )
      .filter( ( limitingRight ) => !localProject.right[ limitingRight.right ] )
      .map( ( limitingRight ) => limitingRight.preference );
    return displayValues.filter( ( column ) => !notAllowedColumns.includes( column.value ) );
  }

  const allStatuses = localProject.project.statuses ? localProject.project.statuses : [];
  const [ columnPreferencesOpen, setColumnPreferencesOpen ] = React.useState( false );
  const openColumnPreferences = () => setColumnPreferencesOpen( !columnPreferencesOpen );

  return (
    <div className={classnames("d-flex", "h-60px", "flex-row", 'p-l-30', "m-r-30", 'sticky')} style={{ left: 0 }}>
      {search && <Search {...props}/>}
      <div className="sort-style">
        <div className="d-flex flex-row">
          <div className={
              classnames(
                "d-flex", "flex-row", "align-items-center", "ml-auto"
              )
            }
            >

            <div className="text-basic m-r-5 m-l-5">
              Sort by
            </div>

            <select
              value={orderBy}
              className="invisible-select text-bold text-highlight"
              onChange={(e)=>setOrderBy(e.target.value)}>
              { orderByValues.map((item,index) =>
                <option value={item.value} key={index}>{item.label}</option>
              ) }
            </select>

            { ascending &&
              <button type="button" className="btn-link" onClick={()=>setAscending(false)}>
                <i className="fas fa-arrow-up" />
              </button>
            }

            { !ascending &&
              <button type="button" className="btn-link" onClick={()=>setAscending(true)}>
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
                items={getPreferenceColumns().filter((displayValue) => !displayValue.permanent )}
                selected={getPreferenceColumns().filter((displayValue) => displayValue.show )}
                onChange={(_, item, deleted ) => {
                  let newVisibility = {};
                  displayValues.filter((displayValue) => !displayValue.permanent ).forEach((displayValue) => {
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