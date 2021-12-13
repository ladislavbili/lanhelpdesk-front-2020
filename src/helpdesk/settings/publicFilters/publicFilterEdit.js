import React from 'react';
import {
  useMutation,
  useQuery,
  useApolloClient,
} from "@apollo/client";
import moment from 'moment';

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
import FilterDatePickerInCalendar from 'components/filterDatePickerInCalendar';
import SettingsInput from '../components/settingsInput';


import {
  pickSelectStyle
} from 'configs/components/select';
import {
  toSelArr,
  fromObjectToState,
  setDefaultFromObject,
  translateSelectItem,
  translateAllSelectItems,
} from 'helperFunctions';

import {
  setFilter,
  addLocalError,
} from 'apollo/localSchema/actions';
import {
  oneOfOptions,
  getEmptyGeneralFilter,
  emptyFilter,
  ofCurrentUser,
  booleanSelectOptions
} from 'configs/constants/filter';

import {
  GET_PUBLIC_FILTERS,
  GET_FILTER,
  UPDATE_PUBLIC_FILTER,
  DELETE_FILTER,
} from './queries';
import {
  GET_PROJECT,
} from 'apollo/localSchema/queries';
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

export default function PublicFilterEdit( props ) {
  const {
    match
  } = props;

  const {
    t
  } = useTranslation();
  const id = parseInt( match.params.id );

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

  const {
    data: localProjectData,
  } = useQuery( GET_PROJECT );
  const projectId = localProjectData.localProject.id;

  const {
    data: publicFilterData,
    loading: publicFilterLoading,
    refetch: refetchPublicFilter,
  } = useQuery( GET_FILTER, {
    variables: {
      id
    },
    fetchPolicy: 'network-only',
  } );

  const [ updatePublicFilter ] = useMutation( UPDATE_PUBLIC_FILTER );
  const [ deleteFilter ] = useMutation( DELETE_FILTER );

  // state
  const [ global, setGlobal ] = React.useState( true );
  const [ dashboard, setDashboard ] = React.useState( true );
  const [ order, setOrder ] = React.useState( 0 );
  const [ roles, setRoles ] = React.useState( [] );
  const [ title, setTitle ] = React.useState( '' );
  const [ project, setProject ] = React.useState( null );
  const [ saving, setSaving ] = React.useState( null );
  const [ dataChanged, setDataChanged ] = React.useState( false );
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
    rolesLoading ||
    publicFilterLoading
  )

  React.useEffect( () => {
    refetchPublicFilter( {
        variables: {
          id
        }
      } )
      .then( setData );
  }, [ id ] );

  React.useEffect( () => {
    setData()
  }, [ dataLoading ] );

  const setData = () => {
    if ( dataLoading ) {
      return;
    }
    let filter = publicFilterData.filter;
    setTitle( filter.title );
    setOrder( filter.order );

    setRoles( filter.roles ? toSelArr( filter.roles ) : [] );
    filter = filter.filter;

    setCompanies( [
      ...( filter.companyCur ? [ translateSelectItem( ofCurrentUser, t ) ] : [] ),
      ...toSelArr( companiesData.basicCompanies )
      .filter( ( company ) => filter.companies.some( ( company2 ) => company.id === company2.id ) )
    ] );

    setRequesters( [
      ...( filter.requesterCur ? [ translateSelectItem( ofCurrentUser, t ) ] : [] ),
      ...toSelArr( usersData.basicUsers, "fullName" )
      .filter( ( user ) => filter.requesters.some( ( user2 ) => user.id === user2.id ) )
    ] );

    setAssignedTos( [
      ...( filter.assignedToCur ? [ translateSelectItem( ofCurrentUser, t ) ] : [] ),
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
    setScheduledFromNow( filter.scheduledFromNow );
    setScheduledFrom( filter.scheduledFrom === null ? null : moment( parseInt( filter.scheduledFrom ) ) );
    setScheduledToNow( filter.scheduledToNow );
    setScheduledTo( filter.scheduledTo === null ? null : moment( parseInt( filter.scheduledTo ) ) );
    setCreatedAtFromNow( filter.createdAtFromNow );
    setCreatedAtFrom( filter.createdAtFrom === null ? null : moment( parseInt( filter.createdAtFrom ) ) );
    setCreatedAtToNow( filter.createdAtToNow );
    setCreatedAtTo( filter.createdAtTo === null ? null : moment( parseInt( filter.createdAtTo ) ) );
    setOneOf( oneOfOptions.filter( ( oneOf ) => filter.oneOf.includes( oneOf.value ) ) );
    setImportant( translateAllSelectItems( booleanSelectOptions, t )
      .find( ( option ) => option.value === filter.important ) );
    setInvoiced( translateAllSelectItems( booleanSelectOptions, t )
      .find( ( option ) => option.value === filter.invoiced ) );
    setPausal( translateAllSelectItems( booleanSelectOptions, t )
      .find( ( option ) => option.value === filter.pausal ) );
    setOvertime( translateAllSelectItems( booleanSelectOptions, t )
      .find( ( option ) => option.value === filter.overtime ) );

    setDataChanged( false );
  }

  const submitPublicFilter = () => {
    setSaving( true );
    let variables = {
      id,
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
    updatePublicFilter( {
        variables
      } )
      .then( ( response ) => {
        setSaving( false );
        setDataChanged( false );
      } )
      .catch( ( err ) => {
        addLocalError( err );
        setSaving( false );
      } )
  }

  const deletePublicFilter = () => {
    if ( window.confirm( t( 'generalConfirmation' ) ) ) {
      deleteFilter( {
          variables: {
            id,
          }
        } )
        .then( ( response ) => {
          setFilter( getEmptyGeneralFilter() );
          history.back();
          close();
        } )
        .catch( ( err ) => {
          addLocalError( err );
        } );
    }
  }

  const cannotSave = () => (
    dataLoading ||
    saving ||
    title === "" ||
    ( !global && project === null ) ||
    isNaN( parseInt( order ) )
  )

  if ( dataLoading ) {
    return <Loading />
  }

  return (
    <div className="scroll-visible p-20 fit-with-header">
      <h2 className="m-b-20" >
        {`${t('edit')} ${t('publicFilter2').toLowerCase()}`}
      </h2>

      <SettingsInput
        id="title"
        required
        label={t('filterTitle')}
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          setDataChanged( true );
        }}
        />

      <SettingsInput
        id="order"
        required
        type="number"
        label={t('filterOrder')}
        value={order}
        onChange={(e) => {
          setOrder(e.target.value);
          setDataChanged( true );
        }}
        />

      {/* Roles */}
      <FormGroup>
        <Label className="">{t('roles')}</Label>
        <Select
          placeholder={t('chooseRoles')}
          value={roles}
          isMulti
          onChange={(newRoles) => {
            if(newRoles.some((role) => role.id === 'all' )){
              if( roles.length === rolesData.roles.length ){
                setRoles([]);
              }else{
                setRoles(toSelArr(rolesData.roles));
              }
            }else{
              setRoles(newRoles);
            }
            setDataChanged( true );
          }}
          options={toSelArr([
            {id: 'all', title: roles.length === rolesData.roles.length ? t('clear') : t('all') },
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
            setDataChanged( true );
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
            setDataChanged( true );
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
            setDataChanged( true );
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
            setDataChanged( true );
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
          setDataChanged( true );
        }}
        setDateFrom={(e) => {
          setStatusDateFrom(e);
          setDataChanged( true );
        }}
        showNowTo={statusDateToNow}
        dateTo={statusDateTo}
        setShowNowTo={(e) => {
          setStatusDateToNow(e);
          setDataChanged( true );
        }}
        setDateTo={(e) => {
          setStatusDateTo(e);
          setDataChanged( true );
        }}
        />

      {/* Pending Date */}
      <FilterDatePickerInCalendar
        label={t('pendingDate')}
        showNowFrom={pendingDateFromNow}
        dateFrom={pendingDateFrom}
        setShowNowFrom={(e) => {
          setPendingDateFromNow(e);
          setDataChanged( true );
        }}
        setDateFrom={(e) => {
          setPendingDateFrom(e);
          setDataChanged( true );
        }}
        showNowTo={pendingDateToNow}
        dateTo={pendingDateTo}
        setShowNowTo={(e) => {
          setPendingDateToNow(e);
          setDataChanged( true );
        }}
        setDateTo={(e) => {
          setPendingDateTo(e);
          setDataChanged( true );
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
          setDataChanged( true );
        }}
        setDateFrom={(e) => {
          setCloseDateFrom(e);
          setDataChanged( true );
        }}
        setShowNowTo={(e) => {
          setCloseDateToNow(e);
          setDataChanged( true );
        }}
        setDateTo={(e) => {
          setCloseDateTo(e);
          setDataChanged( true );
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
          setDataChanged( true );
        }}
        setDateFrom={(e) => {
          setDeadlineFrom(e);
          setDataChanged( true );
        }}
        setShowNowTo={(e) => {
          setDeadlineToNow(e);
          setDataChanged( true );
        }}
        setDateTo={(e) => {
          setDeadlineTo(e);
          setDataChanged( true );
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
          setDataChanged( true );
        }}
        setDateFrom={(e) => {
          setScheduledFrom(e);
          setDataChanged( true );
        }}
        setShowNowTo={(e) => {
          setScheduledToNow(e);
          setDataChanged( true );
        }}
        setDateTo={(e) => {
          setScheduledTo(e);
          setDataChanged( true );
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
          setDataChanged( true );
        }}
        setDateFrom={(e) => {
          setCreatedAtFrom(e);
          setDataChanged( true );
        }}
        setShowNowTo={(e) => {
          setCreatedAtToNow(e);
          setDataChanged( true );
        }}
        setDateTo={(e) => {
          setCreatedAtTo(e);
          setDataChanged( true );
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
              setDataChanged( true );
            }}
            value={important}
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
              setDataChanged( true );
            }}
            value={invoiced}
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
              setDataChanged( true );
            }}
            value={pausal}
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
              setDataChanged( true );
            }}
            value={overtime}
            styles={pickSelectStyle()}
            />
        </div>
      </div>


      <div className="form-buttons-row">
        <button
          className="btn-red m-l-5"
          onClick={ deletePublicFilter }>
          {t('delete')}
        </button>

        <div className="ml-auto message m-r-10">
          { dataChanged &&
            <div className="message error-message">
              {t('saveBeforeLeaving')}
            </div>
          }
          { !dataChanged &&
            <div className="message success-message">
              {t('saved')}
            </div>
          }
        </div>

        <button
          className="btn"
          disabled={cannotSave()}
          onClick={submitPublicFilter}
          >
          { saving ? `${t('saving')}...` : `${t('save')} ${t('filter').toLowerCase()}` }
        </button>
      </div>
    </div>
  );
}