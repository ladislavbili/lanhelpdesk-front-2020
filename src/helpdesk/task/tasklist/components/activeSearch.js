import React from 'react';
import classnames from "classnames";
import {
  Button
} from 'reactstrap';
import {
  defaultTasksAttributesFilter
} from 'configs/constants/tasks';
import {
  timestampToDate,
} from 'helperFunctions';
import {
  dashboard,
  allMilestones,
} from 'configs/constants/sidebar';


export default function ActiveSearch( props ) {
  const {
    link,
    history,
    loading,
    forceRefetch,
    setLocalProject,
    setLocalMilestone,
    displayValues,
    setLocalTaskStringFilter,
    globalStringFilter,
    setGlobalTaskStringFilter,
    includeGlobalSearch,
    setLocalTaskSearch,
    setGlobalTaskSearch,
    globalTaskSearch,
    table,
  } = props;

  if (
    (
      globalStringFilter === null ||
      Object.keys( globalStringFilter )
      .filter( ( filterKey ) => (
        ![ 'createdAt', 'startsAt', 'deadline' ].includes( filterKey ) &&
        globalStringFilter[ filterKey ] !== null &&
        globalStringFilter[ filterKey ].length !== 0
      ) )
      .length === 0
    ) &&
    ( !includeGlobalSearch || globalTaskSearch.length === 0 )
  ) {
    return null;
  }

  const clearFilter = () => {
    setLocalTaskStringFilter( defaultTasksAttributesFilter );
    setGlobalTaskStringFilter();
    if ( includeGlobalSearch ) {
      setLocalTaskSearch( '' );
      setGlobalTaskSearch( '' );
    }
  }

  let usedFilter = [];
  if ( includeGlobalSearch && globalTaskSearch.length > 0 ) {
    usedFilter.push( `Task & ID: ${globalTaskSearch}` );
  }

  if ( globalStringFilter !== null ) {
    usedFilter = [
      ...usedFilter,
      ...Object.keys( globalStringFilter )
    .filter( ( filterKey ) => ![ 'createdAtFrom', 'createdAtTo', 'startsAtFrom', 'startsAtTo', 'deadlineFrom', 'deadlineTo' ].includes( filterKey ) && globalStringFilter[ filterKey ] !== null && globalStringFilter[ filterKey ].length !== 0 )
    .map( ( filterKey ) => ( [ 'createdAt', 'startsAt', 'deadline' ].includes( filterKey ) ?
        `${displayValues.find( ( displayValue ) => displayValue.value === filterKey ).label}: ${timestampToDate(globalStringFilter[ filterKey ])}` :
        `${displayValues.find( ( displayValue ) => displayValue.value === filterKey ).label}: ${globalStringFilter[ filterKey ]}` ) )
    ]
  }


  const renderSearch = () => (
    <div
      className={classnames( "search-row" )}
      style={{ maxWidth: 700 }}
      >
      <span className="center-hor m-l-5 font-14">
        <span className="bolder m-r-5">
          Hľadané výrazy:
        </span>
        { usedFilter.join(', ') }
      </span>

      <Button
        disabled={loading}
        className="btn center-hor m-l-10"
        onClick={clearFilter}
        >
        <i className="fa fa-times" />
        Clear search
      </Button>
      <Button
        disabled={loading}
        className="btn center-hor m-l-10"
        onClick={forceRefetch}
        >
        <i className="fa fa-redo-alt" />
        Repeat search
      </Button>
      <Button
        className="btn center-hor m-l-10"
        disabled={loading}
        onClick={()=>{
          setLocalMilestone(allMilestones);
          setLocalProject(dashboard);
          history.push(`/helpdesk/taskList/i/all`)
        }}
        >
        Global search
      </Button>
    </div>
  )

  if ( table ) {
    return (
      <tr style={{ backgroundColor: 'inherit' }}>
        <td colSpan="100">
          {renderSearch()}
        </td>
      </tr>
    );
  }

  return (
    <div className="task-list-commandbar m-l-30 m-r-45" >
      {renderSearch()}
    </div>
  )
}