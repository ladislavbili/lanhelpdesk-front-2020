import React from 'react';
import {
  useMutation,
  useQuery,
} from "@apollo/client";
import {
  gql
} from '@apollo/client';;
import {
  Input
} from 'reactstrap';
import Select from 'react-select';
import {
  toSelArr,
  fromObjectToState,
  setDefaultFromObject
} from 'helperFunctions';
import AddFilter from './filterAdd';
import Loading from 'components/loading';
import FilterDatePickerInCalendar from 'components/filterDatePickerInCalendar';
import FilterDatePickerPopover from 'components/filterDatePickerPopover';
import {
  setFilter,
} from 'apollo/localSchema/actions';
import {
  invisibleSelectStyleBlueFont
} from 'configs/components/select';
import {
  oneOfOptions,
  getEmptyGeneralFilter,
  emptyFilter,
  ofCurrentUser
} from 'configs/constants/filter';

import {
  GET_MY_DATA,
  GET_MY_FILTERS,
  DELETE_FILTER,
} from './queries';
import {
  GET_FILTER
} from 'apollo/localSchema/queries';
import {
  GET_BASIC_USERS
} from 'helpdesk/settings/users/queries';
import {
  GET_BASIC_COMPANIES
} from 'helpdesk/settings/companies/queries';
import {
  GET_TASK_TYPES
} from 'helpdesk/settings/taskTypes/queries';
import moment from 'moment';

export default function FilterForm( props ) {
  //data & queries
  const {
    close,
    history
  } = props;

  //apollo
  const {
    data: myData,
    loading: myDataLoading,
  } = useQuery( GET_MY_DATA );

  const {
    data: usersData,
    loading: usersLoading
  } = useQuery( GET_BASIC_USERS );

  const {
    data: companiesData,
    loading: companiesLoading
  } = useQuery( GET_BASIC_COMPANIES );

  const {
    data: taskTypesData,
    loading: taskTypesLoading
  } = useQuery( GET_TASK_TYPES );


  const {
    data: myFiltersData,
    loading: myFiltersLoading
  } = useQuery( GET_MY_FILTERS );

  const {
    data: filterData,
    loading: filterLoading
  } = useQuery( GET_FILTER );

  const id = filterData.localFilter.id;

  //state
  const [ deleteFilter, {
    client
  } ] = useMutation( DELETE_FILTER );

  const [ title, setTitle ] = React.useState( '' );
  const [ editTitleOpen, setEditTitleOpen ] = React.useState( false );
  const [ saving, setSaving ] = React.useState( null );

  const {
    requester,
    setRequester,
    company,
    setCompany,
    assigned,
    setAssigned,
    taskType,
    setTaskType,
    statusDateFrom,
    setStatusDateFrom,
    statusDateFromNow,
    setStatusDateFromNow,
    statusDateTo,
    setStatusDateTo,
    statusDateToNow,
    setStatusDateToNow,
    closeDateFrom,
    setCloseDateFrom,
    closeDateFromNow,
    setCloseDateFromNow,
    closeDateTo,
    setCloseDateTo,
    closeDateToNow,
    setCloseDateToNow,
    pendingDateFrom,
    setPendingDateFrom,
    pendingDateFromNow,
    setPendingDateFromNow,
    pendingDateTo,
    setPendingDateTo,
    pendingDateToNow,
    setPendingDateToNow,
    deadlineFrom,
    setDeadlineFrom,
    deadlineFromNow,
    setDeadlineFromNow,
    deadlineTo,
    setDeadlineTo,
    deadlineToNow,
    setDeadlineToNow,
    oneOf,
    setOneOf,
  } = fromObjectToState( emptyFilter );

  const dataLoading = (
    myDataLoading ||
    usersLoading ||
    companiesLoading ||
    taskTypesLoading ||
    filterLoading ||
    myFiltersLoading
  )

  React.useEffect( () => {
    if ( !dataLoading ) {
      let filter = filterData.localFilter;
      //filter information
      setFilterState( filter );
    }
  }, [ id, dataLoading ] );

  const applyFilter = () => {
    let filter = getCurrentFilter();
    setFilter( {
      ...filterData.localFilter,
      filter
    } );
  }
  const resetFilter = () => {
    if ( id === null ) {
      setTitle( '' );
      setDefaultFromObject( {
        setRequester,
        setCompany,
        setAssigned,
        setTaskType,
        setStatusDateFrom,
        setStatusDateFromNow,
        setStatusDateTo,
        setStatusDateToNow,
        setCloseDateFrom,
        setCloseDateFromNow,
        setCloseDateTo,
        setCloseDateToNow,
        setPendingDateFrom,
        setPendingDateFromNow,
        setPendingDateTo,
        setPendingDateToNow,
        setDeadlineFrom,
        setDeadlineFromNow,
        setDeadlineTo,
        setDeadlineToNow,
        setOneOf
      }, emptyFilter );
    } else {
      setFilter( myFiltersData.myFilters.find( ( myFilter ) => myFilter.id === id ) );
      setFilterState( filterData.localFilter );
    }
  }
  const deleteFilterFunc = () => {
    if ( window.confirm( "Are you sure?" ) ) {
      deleteFilter( {
          variables: {
            id,
          }
        } )
        .then( ( response ) => {
          const allFilters = client.readQuery( {
              query: GET_MY_FILTERS
            } )
            .myFilters;
          const newFilters = [ ...allFilters ].filter( item => item.id !== id );
          client.writeQuery( {
            query: GET_MY_FILTERS,
            data: {
              myFilters: [ ...newFilters ]
            }
          } );
          history.push( `/helpdesk/taskList/i/all` );
          setFilter( getEmptyGeneralFilter() );
          close();
        } )
        .catch( ( err ) => {
          console.log( err.message );
          console.log( err );
        } );
    }
  }

  const getCurrentFilter = () => ( {
    assignedToCur: assigned.id === 'cur',
    assignedTo: assigned.id === 'cur' ? null : assigned,
    requesterCur: requester.id === 'cur',
    requester: requester.id === 'cur' ? null : requester,
    companyCur: company.id === 'cur',
    company: company.id === 'cur' ? null : company,
    taskType: taskType,
    oneOf: oneOf.map( ( oneOf ) => oneOf.value ),

    statusDateFrom: statusDateFrom === null ? null : statusDateFrom.valueOf()
      .toString(),
    statusDateFromNow,
    statusDateTo: statusDateTo === null ? null : statusDateTo.valueOf()
      .toString(),
    statusDateToNow,
    pendingDateFrom: pendingDateFrom === null ? null : pendingDateFrom.valueOf()
      .toString(),
    pendingDateFromNow,
    pendingDateTo: pendingDateTo === null ? null : pendingDateTo.valueOf()
      .toString(),
    pendingDateToNow,
    closeDateFrom: closeDateFrom === null ? null : closeDateFrom.valueOf()
      .toString(),
    closeDateFromNow,
    closeDateTo: closeDateTo === null ? null : closeDateTo.valueOf()
      .toString(),
    closeDateToNow,
    deadlineFrom: deadlineFrom === null ? null : deadlineFrom.valueOf()
      .toString(),
    deadlineFromNow,
    deadlineTo: deadlineTo === null ? null : deadlineTo.valueOf()
      .toString(),
    deadlineToNow,
  } )

  const getCleanCurrentFilter = () => ( {
    ...getCurrentFilter(),
    assignedTo: assigned.id === 'cur' ? null : assigned.id,
    requester: requester.id === 'cur' ? null : requester.id,
    company: company.id === 'cur' ? null : company.id,
    taskType: taskType.id
  } )

  const setFilterState = ( filter ) => {
    setTitle( filter.title );
    //filter data
    filter = filter.filter;

    if ( filter.companyCur ) {
      setCompany( ofCurrentUser );
    } else if ( filter.company === null ) {
      setCompany( emptyFilter.company );
    } else {
      setCompany( toSelArr( companiesData.basicCompanies )
        .find( ( company ) => company.id === filter.company.id ) );
    }

    if ( filter.requesterCur ) {
      setRequester( ofCurrentUser );
    } else if ( filter.requester === null ) {
      setRequester( emptyFilter.requester );
    } else {
      setRequester( toSelArr( usersData.basicUsers, "fullName" )
        .find( ( user ) => user.id === filter.requester.id ) );
    }

    if ( filter.assignedToCur ) {
      setAssigned( emptyFilter.assigned );
    } else if ( filter.assignedTo === null ) {
      setAssigned( emptyFilter.assigned );
    } else {
      setAssigned( toSelArr( usersData.basicUsers )
        .find( ( user ) => user.id === filter.assignedTo.id ) );
    }

    if ( filter.taskType !== null ) {
      setTaskType( toSelArr( taskTypesData.taskTypes )
        .find( ( taskType ) => taskType.id === filter.taskType.id ) );
    } else {
      setTaskType( emptyFilter.taskType );
    }

    setStatusDateFromNow( filter.statusDateFromNow );
    setStatusDateFrom( filter.statusDateFrom === null ? null : moment( parseInt( filter.statusDateFrom ) ) );
    setStatusDateToNow( filter.statusDateToNow );
    setStatusDateTo( filter.statusDateTo === null ? null : moment( parseInt( filter.statusDateTo ) ) );
    setCloseDateFromNow( filter.closeDateFromNow );
    setCloseDateFrom( filter.closeDateFrom === null ? null : moment( parseInt( filter.closeDateFrom ) ) );
    setCloseDateToNow( filter.closeDateToNow );
    setCloseDateTo( filter.closeDateTo === null ? null : moment( parseInt( filter.closeDateTo ) ) );
    setPendingDateFromNow( filter.pendingDateFromNow );
    setPendingDateFrom( filter.pendingDateFrom === null ? null : moment( parseInt( filter.pendingDateFrom ) ) );
    setPendingDateToNow( filter.pendingDateToNow );
    setPendingDateTo( filter.pendingDateTo === null ? null : moment( parseInt( filter.pendingDateTo ) ) );
    setDeadlineFromNow( filter.deadlineFromNow );
    setDeadlineFrom( filter.deadlineFrom === null ? null : moment( parseInt( filter.deadlineFrom ) ) );
    setDeadlineToNow( filter.deadlineToNow );
    setDeadlineTo( filter.deadlineTo === null ? null : moment( parseInt( filter.deadlineTo ) ) );
    setOneOf( oneOfOptions.filter( ( oneOf ) => filter.oneOf.includes( oneOf.value ) ) );
  }

  if ( dataLoading ) {
    return <Loading />
  }
  const users = toSelArr( usersData.basicUsers, 'email' );
  const companies = toSelArr( companiesData.basicCompanies );
  const taskTypes = toSelArr( taskTypesData.taskTypes );

  let canModify = id !== null;


  return (
      <div>
      <div className="d-flex m-t-5 sidebar-filter-commandbar">
        <button type="button" className="btn-link" onClick={applyFilter}><i className="fa fa-check icon-M p-r-0 m-r-0"/></button>
        {
          <AddFilter
            filter={getCleanCurrentFilter()}
            title={title}
            {...props}
            />
        }

        <button type="button" className="btn-link" onClick={resetFilter}><i className="fa fa-sync icon-M p-r-0 m-r-0"/></button>
        { canModify &&
          <button type="button" className="btn-link" onClick={deleteFilterFunc}><i className="far fa-trash-alt icon-M p-r-0 m-r-0"/></button>
        }
        <button type="button" className="btn-link" onClick={() => close()}><i className="fa fa-times icon-M p-r-0 m-r-0"/></button>
      </div>
      <div>
        <div className="sidebar-filter-label">
          Filter name
        </div>
        <div
          className=""
          onClick={() => setEditTitleOpen(true)}
          >
          {!editTitleOpen &&
            <h5 className="sidebar-filter-name">{ title.length !== 0 ? title : 'New filter title' }</h5>
          }
          {editTitleOpen &&
            <Input
              type="text"
              className="from-control sidebar-filter-input"
              placeholder="Enter filter name"
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              onBlur={() => setEditTitleOpen(false)}
              />
          }
        </div>
      </div>

      <div className="sidebar-filter">
        <div className="sidebar-filter-row">
          <label htmlFor="example-input-small">Zadal</label>
          <div className="flex">
            <Select
              options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(users)}
              onChange={(newValue)=> {
                setRequester(newValue);
              }}
              value={requester}
              styles={invisibleSelectStyleBlueFont} />
          </div>
        </div>
        <div className="sidebar-filter-row">
          <label htmlFor="example-input-small">Firma</label>
          <div className="flex">
            <Select
              options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(toSelArr(companies))}
              onChange={(comp) => {
                setCompany(comp);
              }}
              value={company}
              styles={invisibleSelectStyleBlueFont} />
          </div>
        </div>

        <div className="sidebar-filter-row">
          <label htmlFor="example-input-small">Riesi</label>
          <div className="flex">
            <Select
              options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(toSelArr(users, 'email'))}
              onChange={(newValue)=> {
                setAssigned(newValue);
              }}
              value={assigned}
              styles={invisibleSelectStyleBlueFont} />
          </div>
        </div>

      <FilterDatePickerPopover
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
        <FilterDatePickerPopover
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
        <FilterDatePickerPopover
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
        <FilterDatePickerPopover
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
              styles={invisibleSelectStyleBlueFont} />
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
              styles={invisibleSelectStyleBlueFont} />
          </div>
        </div>
      </div>

    <
    /div>
  )
}