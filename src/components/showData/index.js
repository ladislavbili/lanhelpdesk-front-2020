import React from 'react';
import {
  useQuery,
  //useApolloClient
} from "@apollo/client";
import {
  gql
} from '@apollo/client';;

import TaskCol from './taskCol';
import TaskList from './taskList';
import TaskListDnD from './taskListDnD';

import moment from 'moment';

const GET_MY_DATA = gql `
query {
  getMyData{
    tasklistLayout
  }
}
`;

const LOCAL_CACHE = gql `
  query getLocalCache {
    milestone @client {
      id
      title
      value
      label
    }
		search @client
		showDataFilter @client {
			name
			id
			title
			status
			requester
			company
			assignedTo
			createdAt
			deadline
		}
  }
`;

export default function ShowDataContainer( props ) {
  const {
    history,
    match,
    data,
    listName,
    filterBy,
    displayValues,
    orderByValues,
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
    calendarEventsData
  } = props;
  const {
    data: userData
  } = useQuery( GET_MY_DATA );
  const {
    data: localCache
  } = useQuery( LOCAL_CACHE );

  const tasklistLayout = 1;

  const search = ( localCache ? localCache.search : "" );

  //	const client = useApolloClient();

  /*	const addShowDataFilter = () => {
  		if(localCache && localCache.showDataFilter.name !== listName){
  			let newShowDataFilter={
  				name: listName,
  			};
  			displayValues.forEach((display)=>{
  				if (display.value === "checked" || display.value === "important"){
  					newShowDataFilter[display.value] = false;
  				} else {
  					newShowDataFilter[display.value] = '';
  				}
  			})
  			client.writeData({ data: {
  				showDataFilter: newShowDataFilter,
  			} });
  		}
  	}*/

  const filterData = () => {
    let aaa = data.filter( ( item ) => {
        let filterString = "";
        filterBy.forEach( ( value ) => {
          if ( !item[ value.value ] ) {
            return;
          }
          if ( value.type === 'object' ) {
            if ( value.value === "status" ) {
              filterString += ( 100 - item[ value.value ].order ) + " " + item.statusChange + " ";
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
          .includes( search.toLowerCase() );
      } )
      .sort( ( item1, item2 ) => {
        let val1 = getSortValue( item1 );
        let val2 = getSortValue( item2 );
        if ( localCache && localCache.ascending ) {
          if ( val1 === null ) {
            return 1;
          }
          return val1 > val2 ? 1 : -1;
        } else {
          if ( val2 === null ) {
            return 1;
          }
          return val1 < val2 ? 1 : -1;
        }
      } )
      .sort( ( val1, val2 ) => {
        if ( val1.important && !val2.important ) {
          return -1;
        } else if ( !val2.important && val2.important ) {
          return 1;
        }
        return 0;
      } );
    return aaa;
  }

  const getSortValue = ( item ) => {
    let value = orderByValues.find( ( val ) => val.value === ( localCache ? localCache.orderBy : "id" ) );
    if ( value.type === 'object' ) {
      if ( value.value === "status" ) {
        return item[ value.value ] ? ( ( 100 - item[ value.value ].order ) + " " + item.statusChange ) : null;
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
								commandBar={props}
								useBreadcrums={useBreadcrums}
								breadcrumsData={breadcrumsData}
								listName={listName}
								history={history}
								Empty={Empty}
								match={match}
								data={filterData()}
								itemID={itemID}
								link={link}
								displayCol={displayCol}
								isTask={isTask}
								setStatuses={setStatuses}
								statuses={statuses}
								allStatuses={allStatuses}
								Edit={Edit}
								/>
						</div>
					)}


					{tasklistLayout === 1 && (
						<div className='col-xl-12'>
							{itemID && <this.props.edit match={match} columns={false} history={history} />}
							{!itemID &&
								<TaskList
									commandBar={props}
									useBreadcrums={useBreadcrums}
									breadcrumsData={breadcrumsData}
									listName={listName}
									history={history}
									match={match}
									data={filterData()}
									displayValues={displayValues}
									filterName={listName}
									isTask={isTask}
									setStatuses={setStatuses}
									statuses={statuses}
									allStatuses={allStatuses}
									link={link}
									checkTask={checkTask}
									deleteTask={deleteTask}
									/>}
						</div>
					)}

					{tasklistLayout === 2 && (
						<div className='col-xl-12'>
							{itemID && <this.props.edit match={match} columns={false} history={history} />}
							{!itemID &&
								<TaskListDnD
									commandBar={props}
									useBreadcrums={useBreadcrums}
									breadcrumsData={breadcrumsData}
									listName={listName}
									history={history}
									match={match}
									data={filterData()}
									displayValues={displayValues}
									displayCol={displayCol}
									link={link}
									groupBy={dndGroupAttribute}
									groupData={dndGroupData}
									isTask={isTask}
									setStatuses={setStatuses}
									statuses={statuses}
									allStatuses={allStatuses}
									/>
							}
						</div>
					)}
					{tasklistLayout === 3 && (
						<div className='col-xl-12'>
							<this.props.calendar
								commandBar={props}
								useBreadcrums={useBreadcrums}
								breadcrumsData={breadcrumsData}
								listName={listName}
								history={history}
								match={match}
								data={
									(calendarAllDayData ? calendarAllDayData(filterData()):[]).concat(
										calendarEventsData ? calendarEventsData(filterData()):[]
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
								/>
						</div>
					)}
				</div>
			</div>
		</div>
  );
}