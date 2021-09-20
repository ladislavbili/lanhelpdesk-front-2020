import React from 'react';
import {
  FormGroup,
  Label,
} from 'reactstrap';
import Switch from "components/switch";
import classnames from 'classnames';
import Select from 'react-select';
import SettingsInput from 'helpdesk/settings/components/settingsInput';
import FilterDatePickerInCalendar from 'components/filterDatePickerInCalendar';
import {
  pickSelectStyle
} from 'configs/components/select';
import {
  emptyFilter,
  booleanSelectOptions,
  ofCurrentUser,
} from 'configs/constants/filter';
import {
  getGroupsProblematicAttributes,
} from '../../helpers';
import {
  toSelArr,
  fromObjectToState,
  setDefaultFromObject,
} from 'helperFunctions';
import moment from 'moment';

export default function ProjectFilterForm( props ) {
  //props
  const {
    edit,
    allGroups,
    allStatuses,
    allTaskTypes,
    allUsers,
    allCompanies,
    filter,
    submit,
    isOpened,
    closeModal,
  } = props;

  const [ active, setActive ] = React.useState( true );
  const [ title, setTitle ] = React.useState( '' );
  const [ order, setOrder ] = React.useState( 0 );
  const [ description, setDescription ] = React.useState( '' );
  const [ groups, setGroups ] = React.useState( [] );
  const {
    requesters,
    setRequesters,
    companies,
    setCompanies,
    assignedTos,
    setAssignedTos,
    taskTypes,
    setTaskTypes,
    statuses,
    setStatuses,
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
  } = fromObjectToState( emptyFilter );

  const [ saving, setSaving ] = React.useState( false );

  React.useEffect( () => {
    if ( edit && isOpened ) {
      setData();
    }
  }, [ isOpened ] );

  const setData = () => {
    setActive( filter.active );
    setTitle( filter.title );
    setDescription( filter.description );
    setGroups( allGroups.filter( ( group ) => filter.groups.includes( group.id ) ) );
    setFilterState( filter.filter );
  }

  const setFilterState = ( filter ) => {
    //filter data
    setCompanies( [
      ...( filter.companyCur ? [ ofCurrentUser ] : [] ),
      ...toSelArr( allCompanies )
      .filter( ( company ) => filter.companies.includes( company.id ) )
    ] );

    setRequesters( [
      ...( filter.requesterCur ? [ ofCurrentUser ] : [] ),
      ...toSelArr( allUsers, "fullName" )
      .filter( ( user ) => filter.requesters.includes( user.id ) )
    ] );

    setAssignedTos( [
      ...( filter.assignedToCur ? [ ofCurrentUser ] : [] ),
      ...toSelArr( allUsers, "fullName" )
      .filter( ( user ) => filter.assignedTos.includes( user.id ) )
    ] );

    setTaskTypes(
      toSelArr( allTaskTypes )
      .filter( ( taskType ) => filter.taskTypes.includes( taskType.id ) )
    );
    setStatuses(
      toSelArr( allStatuses )
      .filter( ( status ) => filter.statuses.includes( status.id ) )
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
    setScheduledFromNow( filter.scheduledFromNow );
    setScheduledFrom( filter.scheduledFrom === null ? null : moment( parseInt( filter.scheduledFrom ) ) );
    setScheduledToNow( filter.scheduledToNow );
    setScheduledTo( filter.scheduledTo === null ? null : moment( parseInt( filter.scheduledTo ) ) );
    setCreatedAtFromNow( filter.createdAtFromNow );
    setCreatedAtFrom( filter.createdAtFrom === null ? null : moment( parseInt( filter.createdAtFrom ) ) );
    setCreatedAtToNow( filter.createdAtToNow );
    setCreatedAtTo( filter.createdAtTo === null ? null : moment( parseInt( filter.createdAtTo ) ) );
    setImportant( booleanSelectOptions.find( ( option ) => option.value === filter.important ) );
    setInvoiced( booleanSelectOptions.find( ( option ) => option.value === filter.invoiced ) );
    setPausal( booleanSelectOptions.find( ( option ) => option.value === filter.pausal ) );
    setOvertime( booleanSelectOptions.find( ( option ) => option.value === filter.overtime ) );
  }

  const getCurrentFilter = () => ( {
    assignedToCur: assignedTos.some( ( assignedTo ) => assignedTo.id === 'cur' ),
    assignedTos: assignedTos.filter( ( assignedTo ) => assignedTo.id !== 'cur' ),
    requesterCur: requesters.some( ( requester ) => requester.id === 'cur' ),
    requesters: requesters.filter( ( requester ) => requester.id !== 'cur' ),
    companyCur: companies.some( ( company ) => company.id === 'cur' ),
    companies: companies.filter( ( company ) => company.id !== 'cur' ),
    taskTypes,
    statuses,

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

  const resetFilter = () => {
    if ( !filter ) {
      setTitle( '' );
      setDefaultFromObject( {
        setRequesters,
        setCompanies,
        setAssignedTos,
        setTaskTypes,
        setStatuses,
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
      }, emptyFilter );
    } else {
      setFilterState( filter );
    }
  }

  const getCleanCurrentFilter = () => {
    const filter = getCurrentFilter();
    return ( {
      ...filter,
      assignedTos: filter.assignedTos.map( ( item ) => item.id ),
      requesters: filter.requesters.map( ( item ) => item.id ),
      companies: filter.companies.map( ( item ) => item.id ),
      taskTypes: filter.taskTypes.map( ( item ) => item.id ),
      statuses: filter.statuses.map( ( item ) => item.id ),
    } )
  }

  const submitForm = () => {
    const filterData = {
      filter: getCleanCurrentFilter(),
      active,
      title,
      description,
      groups: groups.map( ( group ) => group.id ),
    }
    if ( edit ) {
      submit( {
        id: filter.id,
        ...filterData,
      } )
      closeModal();
    } else {
      submit( filterData )
      resetFilter();
      setDescription( '' );
      setGroups( [] );
      closeModal();
    }
  }

  const cannotSave = () => (
    saving ||
    title === "" ||
    groups.length === 0 ||
    isNaN( parseInt( order ) )
  )

  const UsersCantUseFilter = () => {
    const troubledGroups = getGroupsProblematicAttributes( groups, {
      filter: getCleanCurrentFilter(),
      active,
      title,
      description,
      groups: groups.map( ( group ) => group.id ),
    } );

    if ( troubledGroups.length === 0 ) {
      return null;
    }

    return (
      <div>
        { troubledGroups.map((troubledGroup) => (
          <div className="error-message" key={troubledGroup.group.id}>
            {`Group ${troubledGroup.group.title} can't use this filter! Attributes that they can't see are: ${troubledGroup.attributes.join(', ')}`}
          </div>
        ) ) }
      </div>
    )
  }

  return (
    <div>
      <Switch
        value={active}
        onChange={() => {
          setActive(!active);
        }}
        label="Active"
        labelClassName="text-normal font-normal"
        simpleSwitch
        />
      <SettingsInput
        required
        id="title"
        label="Filter name"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        />

      <SettingsInput
        required
        id="order"
        type="number"
        label="Filter order"
        placeholder="Enter filter order"
        value={order}
        onChange={(e) => {
          setOrder(e.target.value);
        }}
        />

      <SettingsInput
        id="description"
        type="textarea"
        label="Filter description"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
        }}
        />

      <FormGroup>
        <Label className="">Groups</Label>
        <Select
          placeholder="Choose groups"
          value={groups}
          isMulti
          onChange={ (newGroups) => {
            if(newGroups.some((role) => role.id === 'all' )){
              if( allGroups.length === groups.length ){
                setGroups([]);
              }else{
                setGroups(allGroups);
              }
            }else{
              setGroups(newGroups);
            }
          }}
          options={toSelArr([
            { id: 'all', title: groups.length === allGroups.length ? 'Clear' : 'All' },
            ...allGroups
          ])}
          styles={pickSelectStyle()}
          />
      </FormGroup>

      <Label className="m-t-15">Filter attributes</Label>

      <hr className="m-t-5 m-b-10"/>

      {/* Requester */}
      <FormGroup>
        <label>Zadal</label>
        <Select
          id="select-requester"
          isMulti
          options={[{label:'Current',value:'cur',id:'cur'}].concat(toSelArr(allUsers, 'email'))}
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
          options={[{label:'Current',value:'cur',id:'cur'}].concat(toSelArr(allCompanies))}
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
          options={[{label:'Current',value:'cur',id:'cur'}].concat(toSelArr(allUsers, 'email'))}
          isMulti
          onChange={(newValue)=>{
            setAssignedTos(newValue);
          }}
          value={assignedTos}
          styles={pickSelectStyle()}
          />
      </FormGroup>

      {/* Status */}
      <FormGroup>
        <label>Status</label>
        <Select
          options={toSelArr(allStatuses)}
          isMulti
          onChange={(newValue)=>{
            setStatuses(newValue);
          }}
          value={statuses}
          styles={pickSelectStyle(['colored'])}
          />
      </FormGroup>

      {/* Task type */}
      <FormGroup>
        <label>Typ práce</label>
        <Select
          options={toSelArr(allTaskTypes)}
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

      {UsersCantUseFilter()}

      <div className="form-buttons-row">
        <button
          className={classnames(
            "btn"
          )}
          onClick={closeModal}
          >
          Close
        </button>
        <button
          className={classnames(
            'ml-auto', "btn"
          )}
          disabled={cannotSave()}
          onClick={submitForm}
          >
          {`${edit ? 'Save' : 'Add' } filter`}
        </button>
      </div>
    </div>
  );
}