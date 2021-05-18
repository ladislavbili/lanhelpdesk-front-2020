import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/client";
import {
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import Checkbox from 'components/checkbox';

import FilterDatePickerInCalendar from 'components/filterDatePickerInCalendar';
import Loading from 'components/loading';
import Select from 'react-select';
import {
  pickSelectStyle
} from 'configs/components/select';
import {
  toSelArr,
  fromObjectToState
} from 'helperFunctions';
import {
  ADD_PUBLIC_FILTER,
  GET_PUBLIC_FILTERS
} from './queries';
import {
  GET_TASK_TYPES,
} from '../taskTypes/queries';
import {
  GET_BASIC_USERS,
} from '../users/queries';
import {
  GET_BASIC_COMPANIES,
} from '../companies/queries';
import {
  GET_PROJECTS,
} from '../projects/queries';
import {
  GET_ROLES,
} from '../roles/queries';

import {
  oneOfOptions,
  emptyFilter,
  booleanSelectOptions,
} from 'configs/constants/filter';

export default function PublicFilterAdd( props ) {
  const {
    history
  } = props;

  // state
  const [ global, setGlobal ] = React.useState( false );
  const [ dashboard, setDashboard ] = React.useState( false );
  const [ order, setOrder ] = React.useState( 0 );
  const [ roles, setRoles ] = React.useState( [] );
  const [ title, setTitle ] = React.useState( '' );
  const [ project, setProject ] = React.useState( null );
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
    tags,
    setTags,
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

  //get data
  const {
    data: taskTypesData,
    loading: taskTypesLoading
  } = useQuery( GET_TASK_TYPES );

  const {
    data: usersData,
    loading: usersLoading
  } = useQuery( GET_BASIC_USERS );

  const {
    data: companiesData,
    loading: companiesLoading
  } = useQuery( GET_BASIC_COMPANIES );

  const {
    data: projectsData,
    loading: projectsLoading
  } = useQuery( GET_PROJECTS );

  const {
    data: rolesData,
    loading: rolesLoading
  } = useQuery( GET_ROLES );

  const [ addPublicFilter, {
    client
  } ] = useMutation( ADD_PUBLIC_FILTER );

  const dataLoading = (
    taskTypesLoading ||
    usersLoading ||
    companiesLoading ||
    projectsLoading ||
    rolesLoading
  )

  const cantSave = (
    dataLoading ||
    saving ||
    title === "" ||
    ( !global && project === null ) ||
    isNaN( parseInt( order ) )
  )

  const submitPublicFilter = () => {
    setSaving( true );
    let variables = {
      title,
      global,
      dashboard,
      order: isNaN( parseInt( order ) ) ? 0 : parseInt( order ),
      roles: roles.map( ( role ) => role.id ),
      projectId: global ? null : project.id,
      filter: {
        assignedToCur: assignedTos.some( ( assignedTo ) => assignedTo.id === 'cur' ),
        assignedTos: assignedTos.filter( ( assignedTo ) => assignedTo.id !== 'cur' )
          .map( ( item ) => item.id ),
        requesterCur: requesters.some( ( requester ) => requester.id === 'cur' ),
        requesters: requesters.filter( ( requester ) => requester.id !== 'cur' )
          .map( ( item ) => item.id ),
        companyCur: companies.some( ( company ) => company.id === 'cur' ),
        companies: companies.filter( ( company ) => company.id !== 'cur' )
          .map( ( item ) => item.id ),
        taskTypes: taskTypes.map( ( item ) => item.id ),
        tags: tags.map( ( item ) => item.id ),
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
      },
    }
    addPublicFilter( {
        variables
      } )
      .then( ( response ) => {
        history.push( `./${response.data.addPublicFilter.id}` );
      } )
      .catch( ( err ) => {
        console.log( err.message );
        setSaving( false );
      } )
  }

  if ( dataLoading ) {
    return <Loading />
  }
  return (
    <div>
      <div className="commandbar a-i-c p-l-20">
        { cantSave &&
          <div className="message error-message">
            Fill in all the required information!
          </div>
        }
      </div>


      <div className="p-t-10 p-l-20 p-r-20 p-b-20 scroll-visible fit-with-header-and-commandbar">
        <h2 className="m-b-20" >
          Add public filter
        </h2>

        {/* Title */}
        <FormGroup>
          <Label htmlFor="title">Filter name <span className="warning-big">*</span></Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter role name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            />
        </FormGroup>

        {/* Order */}
        <FormGroup>
          <Label for="order">Filter order <span className="warning-big">*</span></Label>
          <Input
            id="order"
            type="number"
            placeholder="Enter filter order"
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            />
        </FormGroup>

        {/* Roles */}
        <FormGroup>
          <Label className="">Roles</Label>
          <Select
            placeholder="Choose roles"
            value={roles}
            isMulti
            onChange={(newRoles)=>{
              if(newRoles.some((role) => role.id === 'all' )){
                if( roles.length === rolesData.roles.length ){
                  setRoles([]);
                }else{
                  setRoles(toSelArr(rolesData.roles));
                }
              }else{
                setRoles(newRoles);
              }
            }}
            options={toSelArr([{id: 'all', title: roles.length === rolesData.roles.length ? 'Clear' : 'All' }, ...rolesData.roles])}
            styles={pickSelectStyle()}
            />
        </FormGroup>

        <Label  className="m-t-15">Show filter <span className="warning-big">*</span></Label>
        <hr className="m-t-5 m-b-10"/>
        {/* Global */}
        <Checkbox
          className = "m-l-5 m-r-5"
          label = "Global (shown in all projects)"
          value = { global }
          onChange={(e) => setGlobal(!global)}
          addition={ <span className="one-of-big">*</span>}
          />

        {/* Project */}
        <div className="m-b-10">
          <Label className="form-label">Projekt <span className="one-of-big">*</span></Label>
          <Select
            placeholder="Vyberte projekt"
            value={project}
            isDisabled={global}
            onChange={(project) => setProject(project)}
            options={toSelArr(projectsData.projects)}
            styles={pickSelectStyle()}
            />
        </div>

        {/* Dashboard */}
        <Checkbox
          className = "m-l-5 m-r-5"
          label = "Dashboard (shown in dashboard)"
          value = { dashboard }
          onChange={(e) => setDashboard(!dashboard)}
          />

        <Label className="m-t-15">Filter attributes</Label>
        <hr className="m-t-5 m-b-10"/>

          {/* Requester */}
          <FormGroup>
            <label>Zadal</label>
            <Select
              id="select-requester"
              isMulti
              options={[{label:'Current',value:'cur',id:'cur'}].concat(toSelArr(usersData.basicUsers, 'email'))}
              onChange={ (requesters) => {
                setRequesters(requesters) ;
              }}
              value={requesters}
              styles={pickSelectStyle()}
              />
          </FormGroup>

          {/* Company */}
          <FormGroup>
            <label>Firma</label>
            <Select
              isMulti
              options={[{label:'Current',value:'cur',id:'cur'}].concat(toSelArr(companiesData.basicCompanies))}
              onChange={ (companies) => {
                setCompanies(companies);
              }}
              value={companies}
              styles={pickSelectStyle()} />
          </FormGroup>

          {/* Assigned */}
          <FormGroup>
            <label>Riesi</label>
            <Select
              options={[{label:'Žiadny',value:null,id:null}].concat(toSelArr(usersData.basicUsers, 'email'))}
              isMulti
              onChange={(newValue)=>{
                setAssignedTos(newValue);
              }}
              value={assignedTos}
              styles={pickSelectStyle()}
              />
          </FormGroup>

          {/* Task type */}
          <FormGroup>
            <label>Typ práce</label>
            <Select
              options={toSelArr(taskTypesData.taskTypes)}
              isMulti
              onChange={(newValue)=>{
                setTaskTypes(newValue);
              }}
              value={taskTypes}
              styles={pickSelectStyle()}
              />
          </FormGroup>

          {/* Status Date */}
          <FilterDatePickerInCalendar
            label="Status date"
            showNowFrom={statusDateFromNow}
            dateFrom={statusDateFrom}
            setShowNowFrom={(e) => {
              setStatusDateFromNow(e);
            }}
            setDateFrom={(e) => {
              setStatusDateFrom(e);
            }}
            showNowTo={statusDateToNow}
            dateTo={statusDateTo}
            setShowNowTo={(e) => {
              setStatusDateToNow(e);
            }}
            setDateTo={(e) => {
              setStatusDateTo(e);
            }}
            />

          {/* Pending Date */}
          <FilterDatePickerInCalendar
            label="Pending date"
            showNowFrom={pendingDateFromNow}
            dateFrom={pendingDateFrom}
            setShowNowFrom={(e) => {
              setPendingDateFromNow(e);
            }}
            setDateFrom={(e) => {
              setPendingDateFrom(e);
            }}
            showNowTo={pendingDateToNow}
            dateTo={pendingDateTo}
            setShowNowTo={(e) => {
              setPendingDateToNow(e);
            }}
            setDateTo={(e) => {
              setPendingDateTo(e);
            }}
            />

          {/* Close Date */}
          <FilterDatePickerInCalendar
            label="Close date"
            showNowFrom={closeDateFromNow}
            dateFrom={closeDateFrom}
            showNowTo={closeDateToNow}
            dateTo={closeDateTo}
            setShowNowFrom={(e) => {
              setCloseDateFromNow(e);
            }}
            setDateFrom={(e) => {
              setCloseDateFrom(e);
            }}
            setShowNowTo={(e) => {
              setCloseDateToNow(e);
            }}
            setDateTo={(e) => {
              setCloseDateTo(e);
            }}
            />

          {/* Deadline */}
          <FilterDatePickerInCalendar
            label="Deadline"
            showNowFrom={deadlineFromNow}
            dateFrom={deadlineFrom}
            showNowTo={deadlineToNow}
            dateTo={deadlineTo}
            setShowNowFrom={(e) => {
              setDeadlineFromNow(e);
            }}
            setDateFrom={(e) => {
              setDeadlineFrom(e);
            }}
            setShowNowTo={(e) => {
              setDeadlineToNow(e);
            }}
            setDateTo={(e) => {
              setDeadlineTo(e);
            }}
            />

          {/* Scheduled */}
          <FilterDatePickerInCalendar
            label="Scheduled date"
            showNowFrom={scheduledFromNow}
            dateFrom={scheduledFrom}
            showNowTo={scheduledToNow}
            dateTo={scheduledTo}
            setShowNowFrom={(e) => {
              setScheduledFromNow(e);
            }}
            setDateFrom={(e) => {
              setScheduledFrom(e);
            }}
            setShowNowTo={(e) => {
              setScheduledToNow(e);
            }}
            setDateTo={(e) => {
              setScheduledTo(e);
            }}
            />

          {/* Created at */}
          <FilterDatePickerInCalendar
            label="Created at"
            showNowFrom={createdAtFromNow}
            dateFrom={createdAtFrom}
            showNowTo={createdAtToNow}
            dateTo={createdAtTo}
            setShowNowFrom={(e) => {
              setCreatedAtFromNow(e);
            }}
            setDateFrom={(e) => {
              setCreatedAtFrom(e);
            }}
            setShowNowTo={(e) => {
              setCreatedAtToNow(e);
            }}
            setDateTo={(e) => {
              setCreatedAtTo(e);
            }}
            />

          {/* Important */}
          <div className="sidebar-filter-row">
            <label htmlFor="filter-Important">Important</label>
            <div className="flex">
              <Select
                id="filter-Important"
                options={booleanSelectOptions}
                onChange={(imp) => {
                  setImportant(imp);
                }}
                value={important}
                styles={pickSelectStyle()}
                />
            </div>
          </div>

          {/* Invoiced */}
          <div className="sidebar-filter-row">
            <label htmlFor="filter-Invoiced">Invoiced</label>
            <div className="flex">
              <Select
                id="filter-Invoiced"
                options={booleanSelectOptions}
                onChange={(invoiced) => {
                  setInvoiced(invoiced);
                }}
                value={invoiced}
                styles={pickSelectStyle()}
                />
            </div>
          </div>

          {/* Pausal */}
          <div className="sidebar-filter-row">
            <label htmlFor="filter-Paušál">Paušál</label>
            <div className="flex">
              <Select
                id="filter-Paušál"
                options={booleanSelectOptions}
                onChange={(pausal) => {
                  setPausal(pausal);
                }}
                value={pausal}
                styles={pickSelectStyle()}
                />
            </div>
          </div>

          {/* Overtime */}
          <div className="sidebar-filter-row">
            <label htmlFor="filter-Overtime">Overtime</label>
            <div className="flex">
              <Select
                id="filter-Overtime"
                options={booleanSelectOptions}
                onChange={(overtime) => {
                  setOvertime(overtime);
                }}
                value={overtime}
                styles={pickSelectStyle()}
                />
            </div>
          </div>

        <div className="form-buttons-row">
          <button className="btn ml-auto" disabled={cantSave} onClick={submitPublicFilter}>
            {saving?'Adding...':'Add filter'}
          </button>
        </div>
      </div>
    </div>
  );
}