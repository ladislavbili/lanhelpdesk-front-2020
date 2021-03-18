import React from 'react';
import {
  useMutation,
  useQuery,
} from "@apollo/client";
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
  ofCurrentUser,
  booleanSelectOptions
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
    requesters,
    setRequesters,
    companies,
    setCompanies,
    assignedTos,
    setAssignedTos,
    taskTypes,
    setTaskTypes,
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
    scheduledFrom,
    setScheduledFrom,
    scheduledFromNow,
    setScheduledFromNow,
    scheduledTo,
    setScheduledTo,
    scheduledToNow,
    setScheduledToNow,
    createdAtFrom,
    setCreatedAtFrom,
    createdAtFromNow,
    setCreatedAtFromNow,
    createdAtTo,
    setCreatedAtTo,
    createdAtToNow,
    setCreatedAtToNow,
    important,
    setImportant,
    invoiced,
    setInvoiced,
    pausal,
    setPausal,
    overtime,
    setOvertime,
    oneOf,
    setOneOf,
  } = fromObjectToState( emptyFilter );
  //createdAt important invoiced pausal overtime

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
        setRequesters,
        setCompanies,
        setAssignedTos,
        setTaskTypes,
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
        setScheduledFrom,
        setScheduledFromNow,
        setScheduledTo,
        setScheduledToNow,
        setCreatedAtFrom,
        setCreatedAtFromNow,
        setCreatedAtTo,
        setCreatedAtToNow,
        setImportant,
        setInvoiced,
        setPausal,
        setOvertime,
        setOneOf,
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
    assignedToCur: assignedTos.some( ( assignedTo ) => assignedTo.id === 'cur' ),
    assignedTos: assignedTos.filter( ( assignedTo ) => assignedTo.id !== 'cur' ),
    requesterCur: requesters.some( ( requester ) => requester.id === 'cur' ),
    requesters: requesters.filter( ( requester ) => requester.id !== 'cur' ),
    companyCur: companies.some( ( company ) => company.id === 'cur' ),
    companies: companies.filter( ( company ) => company.id !== 'cur' ),
    taskTypes,
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
    scheduledFrom: scheduledFrom === null ? null : scheduledFrom.valueOf()
      .toString(),
    scheduledFromNow,
    scheduledTo: scheduledTo === null ? null : scheduledTo.valueOf()
      .toString(),
    scheduledToNow,
    createdAtFrom: createdAtFrom === null ? null : createdAtFrom.valueOf()
      .toString(),
    createdAtFromNow,
    createdAtTo: createdAtTo === null ? null : createdAtTo.valueOf()
      .toString(),
    createdAtToNow,
    important: important.value,
    invoiced: invoiced.value,
    pausal: pausal.value,
    overtime: overtime.value,
  } )

  const getCleanCurrentFilter = () => {
    const filter = getCurrentFilter();
    return ( {
      ...filter,
      assignedTos: filter.assignedTos.map( ( item ) => item.id ),
      requesters: filter.requesters.map( ( item ) => item.id ),
      companies: filter.companies.map( ( item ) => item.id ),
      taskTypes: filter.taskTypes.map( ( item ) => item.id ),
    } )
  }
  const setFilterState = ( filter ) => {
    setTitle( filter.title );
    //filter data
    filter = filter.filter;
    setCompanies( [
      ...( filter.companyCur ? [ ofCurrentUser ] : [] ),
      ...toSelArr( companiesData.basicCompanies )
      .filter( ( company ) => filter.companies.some( ( company2 ) => company.id === company2.id ) )
    ] );

    setRequesters( [
      ...( filter.requesterCur ? [ ofCurrentUser ] : [] ),
      ...toSelArr( usersData.basicUsers, "fullName" )
      .filter( ( user ) => filter.requesters.some( ( user2 ) => user.id === user2.id ) )
    ] );

    setRequesters( [
      ...( filter.assignedToCur ? [ ofCurrentUser ] : [] ),
      ...toSelArr( usersData.basicUsers, "fullName" )
      .filter( ( user ) => filter.assignedTos.some( ( user2 ) => user.id === user2.id ) )
    ] );

    setTaskTypes(
      toSelArr( taskTypesData.taskTypes )
      .filter( ( taskType ) => filter.taskTypes.some( ( taskType2 ) => taskType.id === taskType2.id ) )
    );

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
    setScheduledFrom( filter.scheduledFromNow );
    setScheduledFromNow( filter.scheduledFrom === null ? null : moment( parseInt( filter.scheduledFrom ) ) );
    setScheduledTo( filter.scheduledToNow );
    setScheduledToNow( filter.scheduledTo === null ? null : moment( parseInt( filter.scheduledTo ) ) );
    setCreatedAtFrom( filter.createdAtFromNow );
    setCreatedAtFromNow( filter.createdAtFrom === null ? null : moment( parseInt( filter.createdAtFrom ) ) );
    setCreatedAtTo( filter.createdAtToNow );
    setCreatedAtToNow( filter.createdAtTo === null ? null : moment( parseInt( filter.createdAtTo ) ) );
    setOneOf( oneOfOptions.filter( ( oneOf ) => filter.oneOf.includes( oneOf.value ) ) );
    setImportant( booleanSelectOptions.find( ( option ) => option.id === filter.important ) );
    setInvoiced( booleanSelectOptions.find( ( option ) => option.id === filter.invoiced ) );
    setPausal( booleanSelectOptions.find( ( option ) => option.id === filter.pausal ) );
    setOvertime( booleanSelectOptions.find( ( option ) => option.id === filter.overtime ) );
  }

  if ( dataLoading ) {
    return <Loading />
  }
  const users = toSelArr( usersData.basicUsers, 'email' );
  const allCompanies = toSelArr( companiesData.basicCompanies );
  const allTaskTypes = toSelArr( taskTypesData.taskTypes );

  let canModify = id !== null;

  return (
    <div>
      <div className="d-flex m-t-5 sidebar-filter-commandbar">
        <button type="button" className="btn-link" onClick={applyFilter}><i className="fa fa-check icon-M p-r-0 m-r-0"/></button>
        {
          <AddFilter
            filter={getCurrentFilter()}
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
              options={[{label:'Current',value:'cur',id:'cur'}].concat(users)}
              isMulti
              onChange={(newValues)=> {
                setRequesters(newValues);
              }}
              value={requesters}
              styles={invisibleSelectStyleBlueFont}
              />
          </div>
        </div>

        <div className="sidebar-filter-row">
          <label htmlFor="example-input-small">Firma</label>
          <div className="flex">
            <Select
              options={[{label:'Current',value:'cur',id:'cur'}].concat(toSelArr(allCompanies))}
              isMulti
              onChange={(companies) => {
                setCompanies(companies);
              }}
              value={companies}
              styles={invisibleSelectStyleBlueFont}
              />
          </div>
        </div>

        <div className="sidebar-filter-row">
          <label htmlFor="example-input-small">Rieši</label>
          <div className="flex">
            <Select
              options={[{label:'Current',value:'cur',id:'cur'}].concat(toSelArr(users, 'email'))}
              isMulti
              onChange={(newValues)=> {
                setAssignedTos(newValues);
              }}
              value={assignedTos}
              styles={invisibleSelectStyleBlueFont}
              />
          </div>
        </div>

        {/*Task type*/}
        <div className="sidebar-filter-row">
          <label htmlFor="example-input-small">Typ práce</label>
          <div className="flex">
            <Select
              options={toSelArr(allTaskTypes)}
              isMulti
              onChange={(newValues)=> {
                setTaskTypes(newValues);
              }}
              value={taskTypes}
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

        {/* Scheduled */}
        <FilterDatePickerPopover
          label="Scheduled date"
          minimal
          showNowFrom={scheduledFromNow}
          dateFrom={scheduledFrom}
          setShowNowFrom={(scheduledFromNow)=> setScheduledFromNow( scheduledFromNow )}
          setDateFrom={(scheduledFrom)=> setScheduledFrom( scheduledFrom )}
          showNowTo={scheduledToNow}
          dateTo={scheduledTo}
          setShowNowTo={(scheduledToNow)=> setScheduledToNow( scheduledToNow )}
          setDateTo={(scheduledTo)=> setScheduledTo( scheduledTo )}
          />

        {/* Created at */}
        <FilterDatePickerPopover
          label="Created at"
          minimal
          showNowFrom={createdAtFromNow}
          dateFrom={createdAtFrom}
          setShowNowFrom={(createdAtFromNow)=> setCreatedAtFromNow( createdAtFromNow )}
          setDateFrom={(createdAtFrom)=> setCreatedAtFrom( createdAtFrom )}
          showNowTo={createdAtToNow}
          dateTo={createdAtTo}
          setShowNowTo={(createdAtToNow)=> setCreatedAtToNow( createdAtToNow )}
          setDateTo={(createdAtTo)=> setCreatedAtTo( createdAtTo )}
          />

        <div className="sidebar-filter-row">
          <label htmlFor="example-input-small">Important</label>
          <div className="flex">
            <Select
              options={booleanSelectOptions}
              onChange={(imp) => {
                setImportant(imp);
              }}
              value={important}
              styles={invisibleSelectStyleBlueFont}
              />
          </div>
        </div>
        <div className="sidebar-filter-row">
          <label htmlFor="example-input-small">Invoiced</label>
          <div className="flex">
            <Select
              options={booleanSelectOptions}
              onChange={(invoiced) => {
                setInvoiced(invoiced);
              }}
              value={invoiced}
              styles={invisibleSelectStyleBlueFont}
              />
          </div>
        </div>
        <div className="sidebar-filter-row">
          <label htmlFor="example-input-small">Paušál</label>
          <div className="flex">
            <Select
              options={booleanSelectOptions}
              onChange={(pausal) => {
                setPausal(pausal);
              }}
              value={pausal}
              styles={invisibleSelectStyleBlueFont}
              />
          </div>
        </div>
        <div className="sidebar-filter-row">
          <label htmlFor="example-input-small">Overtime</label>
          <div className="flex">
            <Select
              options={booleanSelectOptions}
              onChange={(overtime) => {
                setOvertime(overtime);
              }}
              value={overtime}
              styles={invisibleSelectStyleBlueFont}
              />
          </div>
        </div>
      </div>

    </div>
  )
}