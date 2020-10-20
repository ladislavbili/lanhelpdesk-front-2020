import React from 'react';
import {
  useQuery,
  useMutation,
  useApolloClient
} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {
  Input
} from 'reactstrap';
import Select from 'react-select';
import {
  toSelArr,
  toSelItem,
  toMomentInput
} from '../../../helperFunctions';
import AddFilter from './filterAdd';
import FilterDatePickerInCalendar from 'components/filterDatePickerInCalendar';

import {
  invisibleSelectStyleOtherFont
} from 'configs/components/select';
import {
  oneOfOptions
} from 'configs/constants/filter';

import {
  GET_USERS
} from 'helpdesk/settings/users';
import {
  GET_COMPANIES
} from 'helpdesk/settings/companies/querries';
import {
  GET_TASK_TYPES
} from 'helpdesk/settings/taskTypes/querries';
import {
  GET_MY_FILTERS
} from 'helpdesk/components/sidebar/tasksSidebar';

import {
  filter,
  generalFilter
} from 'localCache';

const GET_MY_DATA = gql `
query {
  getMyData{
    id
    email
    role {
      id
    }
  }
}
`;

const DELETE_FILTER = gql `
mutation deleteFilter($id: Int!) {
  deleteFilter(
    id: $id,
  ){
    id
  }
}
`;
/*
const LOCAL_CACHE = gql `
  query getLocalCache {
    filterName @client
  }
`;
*/

const UPDATE_FILTER = gql `
mutation updateFilter( $id: Int!, $title: String ) {
  updateFilter(
    id: $id,
    title: $title,
  )
}
`;

export default function Filter( props ) {
  //data & queries
  const {
    history,
    filterID,
    filterData,
    generalFilterData,
    close,
    setToEmptyFilter,
    setCurrentFilter
  } = props;
  const {
    data
  } = useQuery( GET_MY_DATA );
  /*
  const {
    data: localCache
  } = useQuery( LOCAL_CACHE );
  */
  const {
    data: userData,
    loading: userLoading
  } = useQuery( GET_USERS );
  const {
    data: companyData,
    loading: companyLoading
  } = useQuery( GET_COMPANIES );
  const {
    data: taskTypeData,
    loading: taskTypeLoading
  } = useQuery( GET_TASK_TYPES );
  const [ updateFilter ] = useMutation( UPDATE_FILTER );
  const [ deleteFilter ] = useMutation( DELETE_FILTER );

  const users = ( userLoading ? [] : toSelArr( userData.users, 'email' ) );
  const companies = ( companyLoading ? [] : toSelArr( companyData.companies ) );
  const taskTypes = ( taskTypeLoading ? [] : toSelArr( taskTypeData.taskTypes ) );

  const client = useApolloClient();

  let currentUser = {};

  if ( data ) {
    currentUser = data.getMyData;
  }

  const [ newFilterName, setNewFilterName ] = React.useState( "" );
  const [ openEditName, setOpenEditName ] = React.useState( false );

  const [ assignedToCur, setAssignedToCur ] = React.useState( false );
  const [ assignedTo, setAssignedTo ] = React.useState( {
    id: null,
    label: 'Žiadny',
    value: null
  } );

  const [ requesterCur, setRequesterCur ] = React.useState( false );
  const [ requester, setRequester ] = React.useState( {
    id: null,
    label: 'Žiadny',
    value: null
  } );

  const [ companyCur, setCompanyCur ] = React.useState( false );
  const [ company, setCompany ] = React.useState( {
    id: null,
    label: 'Žiadny',
    value: null
  } );

  const [ taskType, setTaskType ] = React.useState( null );
  const [ oneOf, setOneOf ] = React.useState( [] );
  const [ statusDateFrom, setStatusDateFrom ] = React.useState( "" );
  const [ statusDateFromNow, setStatusDateFromNow ] = React.useState( false );
  const [ statusDateTo, setStatusDateTo ] = React.useState( "" );
  const [ statusDateToNow, setStatusDateToNow ] = React.useState( false );
  const [ pendingDateFrom, setPendingDateFrom ] = React.useState( "" );
  const [ pendingDateFromNow, setPendingDateFromNow ] = React.useState( false );
  const [ pendingDateTo, setPendingDateTo ] = React.useState( "" );
  const [ pendingDateToNow, setPendingDateToNow ] = React.useState( false );
  const [ closeDateFrom, setCloseDateFrom ] = React.useState( "" );
  const [ closeDateFromNow, setCloseDateFromNow ] = React.useState( false );
  const [ closeDateTo, setCloseDateTo ] = React.useState( "" );
  const [ closeDateToNow, setCloseDateToNow ] = React.useState( false );
  const [ deadlineFrom, setDeadlineFrom ] = React.useState( "" );
  const [ deadlineFromNow, setDeadlineFromNow ] = React.useState( false );
  const [ deadlineTo, setDeadlineTo ] = React.useState( "" );
  const [ deadlineToNow, setDeadlineToNow ] = React.useState( false );

  React.useEffect( () => {
    if ( !openEditName ) {
      renameFilter();
    }
  }, [ openEditName ] );

  React.useEffect( () => {
    if ( filterID ) {
      setNewFilterName( generalFilterData.title );
      setOpenEditName( false );

      setAssignedToCur( filterData.assignedToCur );
      let assigned = {
        id: null,
        label: 'Žiadny',
        value: null
      };
      if ( filterID && filterData.assignedToCur ) {
        assigned = {
          label: 'Current',
          value: 'cur',
          id: 'cur'
        };
      } else if ( filterID && filterData.assignedTo ) {
        assigned = toSelItem( filterData.assignedTo, 'email' );
      }
      setAssignedTo( assigned );

      setRequesterCur( filterData.requesterCur );
      let req = {
        id: null,
        label: 'Žiadny',
        value: null
      };
      if ( filterData.requesterCur ) {
        req = {
          label: 'Current',
          value: 'cur',
          id: 'cur'
        };
      } else if ( filterData.requester ) {
        req = toSelItem( filterData.requester, 'email' );
      }
      setRequester( req );

      setCompanyCur( filterData.companyCur );
      let com = {
        id: null,
        label: 'Žiadny',
        value: null
      };
      if ( filterData.companyCur ) {
        com = {
          label: 'Current',
          value: 'cur',
          id: 'cur'
        };
      } else if ( filterData.company ) {
        com = toSelItem( filterData.company );
      }
      setCompany( com );

      setTaskType( filterData.taskType ? toSelItem( filterData.taskType ) : null );

      let oneOfArr = filterData.oneOf ? toSelArr( filterData.oneOf ) : [];
      oneOfArr.map( item => {
        if ( item === 'requester' ) {
          return {
            id: 'req',
            title: "Requester",
            value: 'req',
            label: "Requester"
          }
        } else if ( item === 'assigned' ) {
          return {
            id: 'as',
            title: "Assigned",
            value: 'as',
            label: "Assigned"
          }
        } else {
          return {
            id: 'com',
            title: "Company",
            value: 'com',
            label: "Company"
          }
        }
      } )
      setOneOf( oneOfArr );
      setStatusDateFrom( toMomentInput( filterData.statusDateFrom ) );
      setStatusDateFromNow( filterData.statusDateFromNow );
      setStatusDateTo( toMomentInput( filterData.statusDateTo ) );
      setStatusDateToNow( filterData.statusDateToNow );
      setPendingDateFrom( toMomentInput( filterData.pendingDateFrom ) );
      setPendingDateFromNow( filterData.pendingDateFromNow );
      setPendingDateTo( toMomentInput( filterData.pendingDateTo ) );
      setPendingDateToNow( filterData.pendingDateToNow );
      setCloseDateFrom( toMomentInput( filterData.closeDateFrom ) );
      setCloseDateFromNow( filterData.closeDateFromNow );
      setCloseDateTo( toMomentInput( filterData.closeDateTo ) );
      setCloseDateToNow( filterData.closeDateToNow );
      setDeadlineFrom( toMomentInput( filterData.deadlineFrom ) );
      setDeadlineFromNow( filterData.deadlineFromNow );
      setDeadlineTo( toMomentInput( filterData.deadlineTo ) );
      setDeadlineToNow( filterData.deadlineToNow );
    }
  }, [ filterID ] );

  const deleteFilterFunc = () => {
    if ( filterID !== null && window.confirm( "Are you sure?" ) ) {
      deleteFilter( {
          variables: {
            id: filterID,
          }
        } )
        .then( ( response ) => {
          const allFilters = client.readQuery( {
              query: GET_MY_FILTERS
            } )
            .myFilters;
          const newFilters = allFilters.filter( item => item.id !== filterID );
          client.writeQuery( {
            query: GET_MY_FILTERS,
            data: {
              myFilters: [ ...newFilters ]
            }
          } );
          history.push( '/helpdesk/taskList/i/all' );
          setToEmptyFilter();
          close();
        } )
        .catch( ( err ) => {
          console.log( err.message );
          console.log( err );
        } );
    }
  }

  const resetFilter = () => {
    if ( filterID === null ) {
      setEmptyFilter();
    } else {
      setFilter();
    }
  }

  const setFilter = () => {
    setNewFilterName( generalFilterData.title );
    setOpenEditName( false );

    setAssignedToCur( filterData.assignedToCur );
    let assigned = {
      id: null,
      label: 'Žiadny',
      value: null
    };
    if ( filterID && filterData.assignedToCur ) {
      assigned = {
        label: 'Current',
        value: 'cur',
        id: 'cur'
      };
    } else if ( filterID && filterData.assignedTo ) {
      assigned = toSelItem( filterData.assignedTo, 'email' );
    }
    setAssignedTo( assigned );

    setRequesterCur( filterData.requesterCur );
    let req = {
      id: null,
      label: 'Žiadny',
      value: null
    };
    if ( filterData.requesterCur ) {
      req = {
        label: 'Current',
        value: 'cur',
        id: 'cur'
      };
    } else if ( filterData.requester ) {
      req = toSelItem( filterData.requester, 'email' );
    }
    setRequester( req );

    setCompanyCur( filterData.companyCur );
    let com = {
      id: null,
      label: 'Žiadny',
      value: null
    };
    if ( filterData.companyCur ) {
      com = {
        label: 'Current',
        value: 'cur',
        id: 'cur'
      };
    } else if ( filterData.company ) {
      com = toSelItem( filterData.company );
    }
    setCompany( com );

    setTaskType( filterData.taskType ? toSelItem( filterData.taskType ) : null );

    let oneOfArr = filterData.oneOf ? toSelArr( filterData.oneOf ) : [];
    oneOfArr.map( item => {
      if ( item === 'requester' ) {
        return {
          id: 'req',
          title: "Requester",
          value: 'requester',
          label: "Requester"
        }
      } else if ( item === 'assigned' ) {
        return {
          id: 'as',
          title: "Assigned",
          value: 'assigned',
          label: "Assigned"
        }
      } else {
        return {
          id: 'com',
          title: "Company",
          value: 'company',
          label: "Company"
        }
      }
    } )
    setOneOf( oneOfArr );
    setStatusDateFrom( toMomentInput( filterData.statusDateFrom ) );
    setStatusDateFromNow( filterData.statusDateFromNow );
    setStatusDateTo( toMomentInput( filterData.statusDateTo ) );
    setStatusDateToNow( filterData.statusDateToNow );
    setPendingDateFrom( toMomentInput( filterData.pendingDateFrom ) );
    setPendingDateFromNow( filterData.pendingDateFromNow );
    setPendingDateTo( toMomentInput( filterData.pendingDateTo ) );
    setPendingDateToNow( filterData.pendingDateToNow );
    setCloseDateFrom( toMomentInput( filterData.closeDateFrom ) );
    setCloseDateFromNow( filterData.closeDateFromNow );
    setCloseDateTo( toMomentInput( filterData.closeDateTo ) );
    setCloseDateToNow( filterData.closeDateToNow );
    setDeadlineFrom( toMomentInput( filterData.deadlineFrom ) );
    setDeadlineFromNow( filterData.deadlineFromNow );
    setDeadlineTo( toMomentInput( filterData.deadlineTo ) );
    setDeadlineToNow( filterData.deadlineToNow );

    filter( filterData );
    generalFilter( generalFilterData );
  }


  const setEmptyFilter = () => {
    setNewFilterName( "" );
    setOpenEditName( false );

    setAssignedToCur( false );
    setAssignedTo( {
      id: null,
      label: 'Žiadny',
      value: null
    } );

    setRequesterCur( false );
    setRequester( {
      id: null,
      label: 'Žiadny',
      value: null
    } );

    setCompanyCur( false );
    setCompany( {
      id: null,
      label: 'Žiadny',
      value: null
    } );

    setTaskType( null );
    setOneOf( [] );
    setStatusDateFrom( "" );
    setStatusDateFromNow( false );
    setStatusDateTo( "" );
    setStatusDateToNow( false );
    setPendingDateFrom( "" );
    setPendingDateFromNow( false );
    setPendingDateTo( "" );
    setPendingDateToNow( false );
    setCloseDateFrom( "" );
    setCloseDateFromNow( false );
    setCloseDateTo( "" );
    setCloseDateToNow( false );
    setDeadlineFrom( "" );
    setDeadlineFromNow( false );
    setDeadlineTo( "" );
    setDeadlineToNow( false );
  }

  const applyFilter = () => {
    let newGeneralFilter = {
      ...generalFilterData
    };
    //let newFilter = {};
    /*
    let body = {
      requester: requester.id,
      requesterCur: requesterCur,
      company: company.id,
      companyCur: companyCur,
      assignedTo: assignedTo.id,
      assignedToCur: assignedToCur,

      taskType: taskType.id,
      oneOf: oneOf.map( ( item ) => item.value ),

      statusDateFrom: toMomentInput( statusDateFrom ),
      statusDateFromNow: statusDateFromNow,
      statusDateTo: toMomentInput( statusDateTo ),
      statusDateToNow: statusDateToNow,

      pendingDateFrom: toMomentInput( pendingDateFrom ),
      pendingDateFromNow: pendingDateFromNow,
      pendingDateTo: toMomentInput( pendingDateTo ),
      pendingDateToNow: pendingDateToNow,

      closeDateFrom: toMomentInput( closeDateFrom ),
      closeDateFromNow: closeDateFromNow,
      closeDateTo: toMomentInput( closeDateTo ),
      closeDateToNow: closeDateToNow,

      deadlineFrom: toMomentInput( deadlineFrom ),
      deadlineFromNow: deadlineFromNow,
      deadlineTo: toMomentInput( deadlineTo ),
      deadlineToNow: deadlineToNow,

      updatedAt: ( new Date() )
        .getTime()
    }
    */
    setCurrentFilter( newGeneralFilter );
  }

  const renameFilter = () => {
    if ( generalFilterData && generalFilterData.title !== newFilterName && newFilterName.length > 0 ) {
      updateFilter( {
          variables: {
            id: filterID,
            title: newFilterName,
          }
        } )
        .then( ( response ) => {
          let allFilters = client.readQuery( {
              query: GET_MY_FILTERS
            } )
            .myFilters;
          const newFilters = allFilters.map( item => {
            if ( item.id !== filterID ) {
              return item;
            }
            return ( {
              ...generalFilterData,
              name: newFilterName,
              __typename: "Filter"
            } );
          } );
          client.writeQuery( {
            query: GET_MY_FILTERS,
            data: {
              myFilters: [ ...newFilters ]
            }
          } );
          generalFilter( {
            ...generalFilterData,
            title: newFilterName
          } );
          setCurrentFilter( {
            ...generalFilterData,
            title: newFilterName
          } );
          client.writeData( {
            data: {
              filterName: newFilterName
            }
          } );
        } )
        .catch( ( err ) => {
          console.log( err.message );
        } );
    }
  }

  const canSaveFilter = () => {
    if ( filterID === null || filterID === undefined ) {
      return true;
    }
    let filter = filterData;
    return true || filter.roles.includes( currentUser.role.id ) || ( filter && filter.createdBy === currentUser.id );
  }

  return (
    <div>
      <div className="d-flex m-l-15 m-t-5">
        <button type="button" className="btn-link-reversed" onClick={applyFilter}><i className="fa fa-check icon-M"/></button>
        {canSaveFilter() &&
          <AddFilter
            filter={{
              requester: requester && requester.value !== 'cur' && requester.value !== null ? requester.id : null,
              requesterCur,
              company: company && company.value !== 'cur' && company.value !== null ? company.id : null,
              companyCur,
              assignedTo: assignedTo && assignedTo.value !== 'cur' && assignedTo.value !== null ? assignedTo.id : null,
              assignedToCur,
              taskType: taskType ? taskType.id : null,
              oneOf: oneOf.map( (item) => item.value ),

              statusDateFrom: toMomentInput(statusDateFrom),
              statusDateFromNow,
              statusDateTo: toMomentInput(statusDateTo),
              statusDateToNow,

              pendingDateFrom: toMomentInput(pendingDateFrom),
              pendingDateFromNow,
              pendingDateTo: toMomentInput(pendingDateTo),
              pendingDateToNow,

              closeDateFrom: toMomentInput(closeDateFrom),
              closeDateFromNow,
              closeDateTo: toMomentInput(closeDateTo),
              closeDateToNow,

              deadlineFrom: toMomentInput(deadlineFrom),
              deadlineFromNow,
              deadlineTo: toMomentInput(deadlineTo),
              deadlineToNow,
            }}
            filterID={filterID}
            bigFilter={filterData}
            />}

            <button type="button" className="btn-link-reversed m-2" onClick={resetFilter}><i className="fa fa-sync icon-M"/></button>
            {canSaveFilter() &&
              <button type="button" className="btn-link-reversed m-2" disabled={filterID===null} onClick={deleteFilterFunc}><i className="far fa-trash-alt icon-M"/></button>}
            <button type="button" className="btn-link-reversed m-2" onClick={() => close()}><i className="fa fa-times icon-M"/></button>
          </div>


          { filterID!==null  &&
            <div>
              <div className="sidebar-filter-label">
                Filter name
              </div>
              <div
                className=""
                onClick={() => setOpenEditName(filterID ? true : false)}
                >
                {(!openEditName || !canSaveFilter()) &&
                  <h5 className="sidebar-filter-name">{filterID?' '+ (newFilterName ? newFilterName : filterData.title):' Všetky'}</h5>
                }
                {openEditName && canSaveFilter() &&
                  <Input
                    type="text"
                    className="from-control sidebar-filter-input"
                    placeholder="Enter filter name"
                    autoFocus
                    value={newFilterName ? newFilterName : filterData.title}
                    onChange={(e) => {
                      setNewFilterName(e.target.value);
                      renameFilter()
                    }}
                    onBlur={() => setOpenEditName(false)}
                    />
                }
              </div>
            </div>
          }

          <div className=" p-r-15 p-l-15 sidebar-filter">
            <div className="sidebar-filter-row">
              <label htmlFor="example-input-small">Zadal</label>
              <div className="flex">
                <Select
                  options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(users)}
                  onChange={(newValue)=> {
                    setRequester(newValue);
                    setRequesterCur(newValue.value === 'cur')
                  }}
                  value={requester}
                  styles={invisibleSelectStyleOtherFont} />
              </div>
            </div>
            <div className="sidebar-filter-row">
              <label htmlFor="example-input-small">Firma</label>
              <div className="flex">
                <Select
                  options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(toSelArr(companies))}
                  onChange={(comp) => {
                    setCompany(comp);
                    setCompanyCur(comp.value === 'cur')
                  }}
                  value={company}
                  styles={invisibleSelectStyleOtherFont} />
              </div>
            </div>

            <div className="sidebar-filter-row">
              <label htmlFor="example-input-small">Riesi</label>
              <div className="flex">
                <Select
                  options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(toSelArr(users, 'email'))}
                  onChange={(newValue)=> {
                    setAssignedTo(newValue);
                    setAssignedToCur(newValue.value === 'cur');
                  }}
                  value={assignedTo}
                  styles={invisibleSelectStyleOtherFont} />
              </div>
            </div>

            <FilterDatePickerInCalendar
              label="Status date"
              minimal
              showNowFrom={statusDateFromNow}
              dateFrom={statusDateFrom}
              setShowNowFrom={(statusDateFromNow)=> setStatusDateFromNow(statusDateFromNow)}
              setDateFrom={(statusDateFrom)=> setStatusDateFrom(statusDateFrom)}
              showNowTo={statusDateToNow}
              dateTo={statusDateTo}
              setShowNowTo={(statusDateToNow)=> setStatusDateToNow(statusDateToNow)}
              setDateTo={(statusDateTo)=>setStatusDateTo(statusDateTo)}
              />

              {/* Pending Date */}
              <FilterDatePickerInCalendar
                label="Pending date"
                minimal
                showNowFrom={pendingDateFromNow}
                dateFrom={pendingDateFrom}
                setShowNowFrom={(pendingDateFromNow) => setPendingDateFromNow( pendingDateFromNow )}
                setDateFrom={(pendingDateFrom)=> setPendingDateFrom(pendingDateFrom)}
                showNowTo={pendingDateToNow}
                dateTo={pendingDateTo}
                setShowNowTo={(pendingDateToNow)=> setPendingDateToNow( pendingDateToNow )}
                setDateTo={(pendingDateTo)=> setPendingDateTo(pendingDateTo)}
                />

              {/* Close Date */}
              <FilterDatePickerInCalendar
                label="Close date"
                minimal
                showNowFrom={closeDateFromNow}
                dateFrom={closeDateFrom}
                setShowNowFrom={(closeDateFromNow) => setCloseDateFromNow( closeDateFromNow ) }
                setDateFrom={(closeDateFrom) => setCloseDateFrom(closeDateFrom)}
                showNowTo={closeDateToNow}
                dateTo={closeDateTo}
                setShowNowTo={(closeDateToNow) => setCloseDateToNow( closeDateToNow ) }
                setDateTo={(closeDateTo)=> setCloseDateTo(closeDateTo)}
                />

              {/* Deadline */}
              <FilterDatePickerInCalendar
                label="Deadline"
                minimal
                showNowFrom={deadlineFromNow}
                dateFrom={deadlineFrom}
                setShowNowFrom={(deadlineFromNow)=> setDeadlineFromNow( deadlineFromNow )}
                setDateFrom={(deadlineFrom)=> setDeadlineFrom( deadlineFrom )}
                showNowTo={deadlineToNow}
                dateTo={deadlineTo}
                setShowNowTo={(deadlineToNow)=> setDeadlineToNow( deadlineToNow )}
                setDateTo={(deadlineTo)=> setDeadlineTo( deadlineTo )}
                />

            <div className="sidebar-filter-row">
              <label htmlFor="example-input-small">Typ práce</label>
              <div className="flex">
                <Select
                  options={[{label:'Žiadny',value:null,id:null}].concat(toSelArr(taskTypes))}
                  onChange={(newValue)=> setTaskType(newValue)}
                  value={taskType}
                  styles={invisibleSelectStyleOtherFont} />
              </div>
            </div>

            <div className="sidebar-filter-row">
              <label htmlFor="example-input-small">Alebo - jedna splnená stačí</label>
              <div className="flex">
                <Select
                  options={oneOfOptions}
                  onChange={(oneOf)=> setOneOf(oneOf)}
                  value={oneOf}
                  isMulti
                  styles={invisibleSelectStyleOtherFont} />
              </div>
            </div>
          </div>

        </div>
  )
}