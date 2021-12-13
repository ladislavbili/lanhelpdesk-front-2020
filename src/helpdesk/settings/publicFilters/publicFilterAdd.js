import React from 'react';
import {
  useMutation,
  useQuery,
  useApolloClient,
} from "@apollo/client";
import classnames from 'classnames';

import {
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import {
  useTranslation
} from "react-i18next";
import Select from 'react-select';
import Checkbox from 'components/checkbox';
import Loading from 'components/loading';
import RequiredLabel from 'components/requiredLabel';
import SettingsInput from '../components/settingsInput';
import FilterDatePickerInCalendar from 'components/filterDatePickerInCalendar';

import {
  oneOfOptions,
  emptyFilter,
  booleanSelectOptions,
  ofCurrentUser,
} from 'configs/constants/filter';
import {
  pickSelectStyle
} from 'configs/components/select';
import {
  toSelArr,
  fromObjectToState,
  translateSelectItem,
  translateAllSelectItems,
} from 'helperFunctions';
import {
  addLocalError,
} from 'apollo/localSchema/actions';

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

export default function PublicFilterAdd( props ) {
  const {
    history
  } = props;

  const {
    t
  } = useTranslation();
  const client = useApolloClient();

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

  const [ addPublicFilter ] = useMutation( ADD_PUBLIC_FILTER );

  // state
  const [ global, setGlobal ] = React.useState( true );
  const [ dashboard, setDashboard ] = React.useState( true );
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

  const dataLoading = (
    taskTypesLoading ||
    usersLoading ||
    companiesLoading ||
    projectsLoading ||
    rolesLoading
  )

  const cannotSave = () => (
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
        addLocalError( err );
        setSaving( false );
      } )
  }

  if ( dataLoading ) {
    return <Loading />
  }

  return (
    <div
      className={classnames(
        "p-20",
        "scroll-visible fit-with-header"
      )}
      >
      <h2 className="m-b-20" >
        {`${t('add')} ${t('publicFilter2').toLowerCase()}`}
      </h2>

      <SettingsInput
        required
        id="title"
        label={t('filterTitle')}
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        />

      <SettingsInput
        required
        id="order"
        type="number"
        label={t('filterOrder')}
        value={order}
        onChange={(e) => {
          setOrder(e.target.value);
        }}
        />

      {/* Roles */}
      <FormGroup>
        <Label className="">{t('roles')}</Label>
        <Select
          placeholder={t('chooseRoles')}
          value={roles}
          isMulti
          onChange={ (newRoles) => {
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
          options={toSelArr([
            { id: 'all', title: roles.length === rolesData.roles.length ? 'Clear' : 'All' },
            ...rolesData.roles
          ])}
          styles={pickSelectStyle()}
          />
      </FormGroup>

      <FormGroup>
        <label>{t('project')}</label>
        <Select
          id="filter-project"
          options={[]}
          value={{ label: t('globalLabel'), id: t('globalLabel') }}
          isDisabled={true}
          styles={pickSelectStyle()}
          />
      </FormGroup>

      <Checkbox
        blocked={true}
        label={t('public')}
        />
      <Checkbox
        blocked={true}
        label={t('dashboard')}
        />

      <Label className="m-t-15">{`${t('filter')} ${t('attributes').toLowerCase()}`}</Label>
      <hr className="m-t-5 m-b-10"/>

      {/* Requester */}
      <FormGroup>
        <label>{t('requester')}</label>
        <Select
          id="select-requester"
          isMulti
          options={[translateSelectItem(ofCurrentUser, t)].concat(toSelArr(usersData.basicUsers, 'email'))}
          onChange={ (requesters) => {
            setRequesters(requesters) ;
          }}
          value={requesters}
          styles={pickSelectStyle()}
          />
      </FormGroup>

      {/* Company */}
      <FormGroup>
        <label>{t('company')}</label>
        <Select
          isMulti
          options={[translateSelectItem(ofCurrentUser, t)].concat(toSelArr(companiesData.basicCompanies))}
          onChange={ (companies) => {
            setCompanies(companies);
          }}
          value={companies}
          styles={pickSelectStyle()} />
      </FormGroup>

      {/* Assigned */}
      <FormGroup>
        <label>{t('assignedTo')}</label>
        <Select
          options={[translateSelectItem(ofCurrentUser, t)].concat(toSelArr(usersData.basicUsers, 'email'))}
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
        <label>{t('taskType')}</label>
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
        label={t('statusDate')}
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
        label={t('pendingDate')}
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
        label={t('closeDate')}
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
        label={t('deadline')}
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
        label={t('scheduled')}
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
        label={t('createdAt')}
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
        <label htmlFor="filter-Important">{t('important')}</label>
        <div className="flex">
          <Select
            id="filter-Important"
            options={translateAllSelectItems(booleanSelectOptions, t)}
            onChange={(imp) => {
              setImportant(imp);
            }}
            value={translateSelectItem(important, t)}
            styles={pickSelectStyle()}
            />
        </div>
      </div>

      {/* Invoiced */}
      <div className="sidebar-filter-row">
        <label htmlFor="filter-Invoiced">{t('invoiced')}</label>
        <div className="flex">
          <Select
            id="filter-Invoiced"
            options={translateAllSelectItems(booleanSelectOptions, t)}
            onChange={(invoiced) => {
              setInvoiced(invoiced);
            }}
            value={translateSelectItem(invoiced, t)}
            styles={pickSelectStyle()}
            />
        </div>
      </div>

      {/* Pausal */}
      <div className="sidebar-filter-row">
        <label htmlFor="filter-Paušál">{t('pausal')}</label>
        <div className="flex">
          <Select
            id="filter-Paušál"
            options={translateAllSelectItems(booleanSelectOptions, t)}
            onChange={(pausal) => {
              setPausal(pausal);
            }}
            value={translateSelectItem(pausal, t)}
            styles={pickSelectStyle()}
            />
        </div>
      </div>

      {/* Overtime */}
      <div className="sidebar-filter-row">
        <label htmlFor="filter-Overtime">{t('overtime')}</label>
        <div className="flex">
          <Select
            id="filter-Overtime"
            options={translateAllSelectItems(booleanSelectOptions, t)}
            onChange={(overtime) => {
              setOvertime(overtime);
            }}
            value={translateSelectItem(overtime, t)}
            styles={pickSelectStyle()}
            />
        </div>
      </div>

      <div className="form-buttons-row">
        { cannotSave() &&
          <div className="message error-message ml-auto">
            {t('fillAllRequiredInformation')}
          </div>
        }
        <button
          className={classnames(
            "btn",
            {"ml-auto": !cannotSave()}
          )}
          disabled={cannotSave()}
          onClick={submitPublicFilter}
          >
          { saving ? `${t('adding')}...` : `${t('add')} ${t('filter').toLowerCase()}` }
        </button>
      </div>
    </div>
  );
}