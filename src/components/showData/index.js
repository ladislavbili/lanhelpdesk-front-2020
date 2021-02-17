import React from 'react';
import {
  useQuery,
  gql
} from "@apollo/client";

import {
  GET_TASK_SEARCH,
} from 'apollo/localSchema/queries';

import TaskCol from './taskCol';
import TaskList from './taskList';
import TaskListDnD from './taskListDnD';
import {
  localFilterToValues
} from 'helperFunctions';

import moment from 'moment';

import {
  GET_FILTER,
  GET_PROJECT,
} from 'apollo/localSchema/queries';

import {
  GET_MY_DATA
} from './queries';

export default function ShowDataContainer( props ) {
  const {
    history,
    match,
    data,
    listName,
    filterBy,
    displayValues,
    orderByValues,
    orderBy,
    ascending,
    useBreadcrums,
    breadcrumsData,
    Empty,
    itemID,
    link,
    displayCol,
    isTask,
    setStatuses,
    statuses,
    allStatuses,
    Edit,
    checkTask,
    deleteTask,
    dndGroupAttribute,
    dndGroupData,
    calendarAllDayData,
    calendarEventsData,
    underSearch,
    underSearchLabel,
    tasklistLayout,
    tasklistLayoutData,
  } = props;

  const {
    data: taskSearchData,
    loading: taskSearchLoading
  } = useQuery( GET_TASK_SEARCH );

  const {
    data: myData
  } = useQuery( GET_MY_DATA );

  //local
  const {
    data: filterData,
  } = useQuery( GET_FILTER );

  const {
    data: projectData,
  } = useQuery( GET_PROJECT );

  const filterDataFunc = () => {
    return data.filter( ( item ) => {
        if ( taskSearchData.taskSearch === "" ) {
          return true;
        }
        let filterString = "";
        filterBy.forEach( ( value ) => {
          if ( !item[ value.value ] ) {
            return;
          }
          if ( value.type === 'object' ) {
            if ( value.value === "statusX" ) {
              //status specific disabled
            } else {
              filterString += item[ value.value ].title + " ";
            }
          } else if ( value.type === 'text' ) {
            filterString += item[ value.value ] + " ";
          } else if ( value.type === 'int' ) {
            filterString += item[ value.value ] + " ";
          } else if ( value.type === 'list' ) {
            filterString += item[ value.value ].reduce( value.func, '' ) + " ";
          } else if ( value.type === 'date' ) {
            filterString += moment( item[ value.value ] ) + " ";
          } else if ( value.type === 'user' ) {
            filterString += item[ value.value ].email + ' ' + item[ value.value ].fullName + " ";
          }
        } );
        return filterString.toLowerCase()
          .includes( taskSearchData.taskSearch.toLowerCase() );
      } )
      .sort( ( item1, item2 ) => {
        const val1 = getSortValue( item1 );
        const val2 = getSortValue( item2 );
        const returnVal = ascending ? -1 : 1;
        if ( val1 === null ) {
          return returnVal * -1;
        } else if ( val2 === null ) {
          return returnVal;
        }
        if ( val1 > val2 ) {
          return returnVal;
        } else if ( val1 < val2 ) {
          return returnVal * -1
        }
        if ( item1.important && !item2.important ) {
          return -1;
        } else if ( !item1.important && item2.important ) {
          return 1;
        }
        return 0;
      } );
  }

  const getSortValue = ( item ) => {
    let value = orderByValues.find( ( val ) => val.value === orderBy );
    if ( value.type === 'object' ) {
      if ( value.value === "status" ) {
        return item[ value.value ] ? ( 100 - item[ value.value ].order ) : null;
      }
      return item[ value.value ] ? item[ value.value ].title.toLowerCase() : null;
    } else if ( value.type === 'text' ) {
      return item[ value.value ].toLowerCase();
    } else if ( value.type === 'int' ) {
      return item[ value.value ];
    } else if ( value.type === 'list' ) {
      return item[ value.value ].reduce( value.func, '' )
        .toLowerCase();
    } else if ( value.type === 'date' ) {
      return parseInt( item[ value.value ] ? item[ value.value ] : null );
    } else if ( value.type === 'user' ) {
      return ( item[ value.value ].fullName )
        .toLowerCase();
    }
  }

  return (
    <div className="content-page">
			<div className="content" style={{ paddingTop: 0 }}>
				<div className="row m-0">
					{tasklistLayout === 0 && (
						<div className='col-xl-12'>
							<TaskCol
                layout={tasklistLayout}
								commandBar={props}
								useBreadcrums={useBreadcrums}
								breadcrumsData={breadcrumsData}
								listName={listName}
								history={history}
								Empty={Empty}
								match={match}
								data={filterDataFunc()}
								itemID={itemID}
								link={link}
								displayCol={displayCol}
								isTask={isTask}
								setStatuses={setStatuses}
								statuses={statuses}
								allStatuses={allStatuses}
								Edit={Edit}
                underSearch={underSearch}
                underSearchLabel={underSearchLabel}
                tasklistLayoutData={tasklistLayoutData}
								/>
						</div>
					)}


					{tasklistLayout === 1 && (
						<div className="flex" >
							{itemID && <props.Edit match={match} columns={false} history={history} />}
							{!itemID &&
								<TaskList
                  layout={tasklistLayout}
									commandBar={props}
									useBreadcrums={useBreadcrums}
									breadcrumsData={breadcrumsData}
									listName={listName}
									history={history}
									match={match}
									data={filterDataFunc()}
									displayValues={displayValues}
									filterName={listName}
									isTask={isTask}
									setStatuses={setStatuses}
									statuses={statuses}
									allStatuses={allStatuses}
									link={link}
									checkTask={checkTask}
									deleteTask={deleteTask}
                  underSearch={underSearch}
                  underSearchLabel={underSearchLabel}
                  tasklistLayoutData={tasklistLayoutData}
									/>}
						</div>
					)}

					{tasklistLayout === 2 && (
						<div className="col-xl-12" >
							{itemID && <props.Edit match={match} columns={false} history={history} />}
							{!itemID &&
								<TaskListDnD
                  layout={tasklistLayout}
									commandBar={props}
									useBreadcrums={useBreadcrums}
									breadcrumsData={breadcrumsData}
									listName={listName}
									history={history}
									match={match}
									data={filterDataFunc()}
									displayValues={displayValues}
									displayCol={displayCol}
									link={link}
									groupBy={dndGroupAttribute}
									groupData={dndGroupData}
									isTask={isTask}
									setStatuses={setStatuses}
									statuses={statuses}
									allStatuses={allStatuses}
                  underSearch={underSearch}
                  underSearchLabel={underSearchLabel}
                  tasklistLayoutData={tasklistLayoutData}
									/>
							}
						</div>
					)}
					{tasklistLayout === 3 && (
						<div className='col-xl-12'>
							<props.calendar
                layout={tasklistLayout}
								commandBar={props}
								useBreadcrums={useBreadcrums}
								breadcrumsData={breadcrumsData}
								listName={listName}
								history={history}
								match={match}
								data={
									(calendarAllDayData ? calendarAllDayData(filterDataFunc()):[]).concat(
										calendarEventsData ? calendarEventsData(filterDataFunc()):[]
									)
								}
								link={link}
								groupBy={dndGroupAttribute}
								groupData={dndGroupData}
								isTask={isTask}
								setStatuses={setStatuses}
								statuses={statuses}
								allStatuses={allStatuses}
								Edit={Edit}
                underSearch={underSearch}
                underSearchLabel={underSearchLabel}
                tasklistLayoutData={tasklistLayoutData}
								/>
						</div>
					)}
				</div>
			</div>
    </div>
  );
}