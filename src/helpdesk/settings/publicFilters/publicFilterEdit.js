import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/client";
import {
  Button,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';
import Checkbox from 'components/checkbox';

import {
  setFilter,
} from 'apollo/localSchema/actions';

import FilterDatePickerInCalendar from 'components/filterDatePickerInCalendar';
import Loading from 'components/loading';
import Select from 'react-select';
import {
  selectStyle
} from 'configs/components/select';
import {
  toSelArr,
  fromObjectToState
} from 'helperFunctions';
import moment from 'moment';
import {
  GET_PUBLIC_FILTERS,
  GET_FILTER,
  UPDATE_PUBLIC_FILTER,
  DELETE_FILTER,
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
  getEmptyGeneralFilter,
  emptyFilter,
  ofCurrentUser,
} from 'configs/constants/filter';
export default function PublicFilterEdit( props ) {
  const {
    match
  } = props;
  const id = parseInt( match.params.id );
  // state
  const [ global, setGlobal ] = React.useState( false );
  const [ dashboard, setDashboard ] = React.useState( false );
  const [ order, setOrder ] = React.useState( 0 );
  const [ roles, setRoles ] = React.useState( [] );
  const [ title, setTitle ] = React.useState( '' );
  const [ project, setProject ] = React.useState( null );
  const [ saving, setSaving ] = React.useState( null );
  const [ dataChanged, setDataChanged ] = React.useState( false );
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

  const {
    data: publicFilterData,
    loading: publicFilterLoading,
    refetch: refetchPublicFilter,
  } = useQuery( GET_FILTER, {
    variables: {
      id
    },
    notifyOnNetworkStatusChange: true,
  } );
  const [ updatePublicFilter, {
    client
  } ] = useMutation( UPDATE_PUBLIC_FILTER );

  const [ deleteFilter ] = useMutation( DELETE_FILTER );

  const dataLoading = (
    taskTypesLoading ||
    usersLoading ||
    companiesLoading ||
    projectsLoading ||
    rolesLoading ||
    publicFilterLoading
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
      id,
      title,
      global,
      dashboard,
      order: isNaN( parseInt( order ) ) ? 0 : parseInt( order ),
      roles: roles.map( ( role ) => role.id ),
      projectId: global ? null : project.id,
      filter: {
        assignedToCur: assigned.id === 'cur',
        assignedTo: assigned.id === 'cur' ? null : assigned.id,
        requesterCur: requester.id === 'cur',
        requester: requester.id === 'cur' ? null : requester.id,
        companyCur: company.id === 'cur',
        company: company.id === 'cur' ? null : company.id,
        taskType: taskType.id,
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
      },
    }
    updatePublicFilter( {
        variables
      } )
      .then( ( response ) => {
        const newPublicFilter = {
          ...response.data.updatePublicFilter,
          __typename: "Filter"
        };
        let publicFilters = client.readQuery( {
            query: GET_PUBLIC_FILTERS
          } )
          .publicFilters;
        let index = publicFilters.findIndex( ( publicFilter ) => publicFilter.id === id );
        publicFilters[ index ] = newPublicFilter;
        client.writeQuery( {
          query: GET_PUBLIC_FILTERS,
          data: {
            publicFilters
          }
        } )
        setSaving( false );
      } )
      .catch( ( err ) => {
        console.log( err.message );
        setSaving( false );
      } )
    setDataChanged( false );
  }

  const deletePublicFilter = () => {
    if ( window.confirm( "Are you sure?" ) ) {
      deleteFilter( {
          variables: {
            id,
          }
        } )
        .then( ( response ) => {
          try {
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
          } catch ( err ) {

          }
          try {
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
          } catch ( err ) {

          }
          try {
            const allFilters = client.readQuery( {
                query: GET_PUBLIC_FILTERS
              } )
              .publicFilters;
            const newFilters = [ ...allFilters ].filter( item => item.id !== id );
            client.writeQuery( {
              query: GET_PUBLIC_FILTERS,
              data: {
                publicFilters: [ ...newFilters ]
              }
            } );
          } catch ( err ) {

          }
          history.back();
          setFilter( getEmptyGeneralFilter() );
          close();
        } )
        .catch( ( err ) => {
          console.log( err.message );
          console.log( err );
        } );
    }
  }

  React.useEffect( () => {
    refetchPublicFilter( {
      variables: {
        id
      }
    } )
  }, [ id ] )
  React.useEffect( () => {
    if ( !dataLoading ) {
      let filter = publicFilterData.filter;
      //filter information
      setGlobal( filter.global );
      setDashboard( filter.dashboard );
      setOrder( filter.order );
      setRoles( toSelArr( rolesData.roles )
        .filter( ( role ) => filter.roles.some( ( filterRole ) => filterRole.id === role.id ) ) );
      setTitle( filter.title );
      if ( filter.project !== null ) {
        setProject( toSelArr( projectsData.projects )
          .find( ( project ) => project.id === filter.project.id ) );
      } else {
        setProject( emptyFilter.project );
      }
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
        setRequester( toSelArr( usersData.basicUsers )
          .find( ( user ) => user.id === filter.requester.id ) );
      }

      if ( filter.assignedToCur ) {
        setAssigned( emptyFilter.assigned );
      } else if ( filter.assignedTo === null ) {
        setAssigned( emptyFilter.assigned );
      } else {
        setAssigned( toSelArr( usersData.basicUsers )
          .find( ( user ) => user.id === filter.assigned.id ) );
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

      setDataChanged( false );
    }
  }, [ dataLoading ] );

  if ( dataLoading ) {
    return <Loading />
  }
  return (
    <div>
      <div className="commandbar a-i-c p-l-20">
        { dataChanged &&
          <div className="message error-message">
            Save changes before leaving!
          </div>
        }
        { !dataChanged &&
          <div className="message success-message">
            Saved
          </div>
        }
      </div>

      <div className="p-t-10 p-l-20 p-r-20 p-b-20 scroll-visible fit-with-header-and-commandbar">
        <h2 className="m-b-20" >
          Edit public filter
        </h2>
        <FormGroup> {/* Title */}
          <Label htmlFor="title">Filter name <span className="warning-big">*</span></Label>
          <Input
            id="title"
            type="text"
            placeholder="Enter role name"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setDataChanged( true );
            }}
            />
        </FormGroup>

        <FormGroup>{/* Order */}
          <Label for="order">Filter order <span className="warning-big">*</span></Label>
          <Input
            id="order"
            type="number"
            placeholder="Enter filter order"
            value={order}
            onChange={(e) => {
              setOrder(e.target.value);
              setDataChanged( true );
            }}
            />
        </FormGroup>


        <FormGroup>{/* Roles */}
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
              setDataChanged( true );
            }}
            options={toSelArr([{id: 'all', title: roles.length === rolesData.roles.length ? 'Clear' : 'All' }, ...rolesData.roles])}
            styles={selectStyle}
            />
        </FormGroup>

        <Label  className="m-t-15">Show filter <span className="warning-big">*</span></Label>
        <hr className="m-t-5 m-b-10"/>
        {/* Global */}
        <FormGroup className="m-t-5">
        <Checkbox
          className = "m-l-5 m-r-5 "
          label = "Global (shown in all projects) or choose project"
          value = { global }
          onChange={(e) => {
            setGlobal(!global);
            setDataChanged( true );
          }}
          addition={ <span className="one-of-big">*</span>}
          />
      </FormGroup>
        <FormGroup>{/* Project */}
        {/*   <Label className="form-label">Projekt <span className="one-of-big">*</span></Label>*/}
          <Select
            placeholder="Vyberte projekt"
            value={project}
            isDisabled={global}
            onChange={(project) => {
              setProject(project);
              setDataChanged( true );
            }}
            options={toSelArr(projectsData.projects)}
            styles={selectStyle}
            />

        </FormGroup>

        {/* Dashboard */}
        <FormGroup className="m-t-5">
        <Checkbox
          className = "m-l-5 m-r-5 "
          label = "Dashboard (shown in dashboard)"
          value = { dashboard }
          onChange={(e) => {
            setDashboard(!dashboard);
            setDataChanged( true );
          }}
          />
      </FormGroup>



        <Label className="m-t-15">Filter attributes</Label>
        <hr className="m-t-5 m-b-10"/>

        <FormGroup>{/* Requester */}
          <label>Zadal</label>
          <Select
            id="select-requester"
            options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(toSelArr(usersData.basicUsers, 'email'))}
            onChange={ (requester) => {
              setRequester(requester) ;
              setDataChanged( true );
            }}
            value={requester}
            styles={selectStyle} />
        </FormGroup>

        <FormGroup>{/* Company */}
          <label>Firma</label>
          <Select
            options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(toSelArr(companiesData.basicCompanies))}
            onChange={ (company) => {
              setCompany(company);
              setDataChanged( true );
            }}
            value={company}
            styles={selectStyle} />
        </FormGroup>

        <FormGroup>{/* Assigned */}
          <label>Riesi</label>
          <Select
            options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(toSelArr(usersData.basicUsers, 'email'))}
            onChange={(newValue)=>{
              setAssigned(newValue);
              setDataChanged( true );
            }}
            value={assigned}
            styles={selectStyle}
            />
        </FormGroup>

        {/* Status Date */}
        <FilterDatePickerInCalendar
          label="Status date"
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
          label="Pending date"
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
          label="Close date"
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
          label="Deadline"
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

        <FormGroup>{/* Work Type */}
          <label htmlFor="example-input-small">Typ práce</label>
          <Select
            options={[{label:'Žiadny',value:null,id:null}].concat(toSelArr(taskTypesData.taskTypes))}
            onChange={(taskType)=>{
              setTaskType(taskType);
              setDataChanged( true );
            }}
            value={taskType}
            styles={selectStyle} />
        </FormGroup>

        <FormGroup>{/* One Of */}
          <label htmlFor="example-input-small">Alebo - jedna splnená stačí</label>
          <Select
            options={oneOfOptions}
            onChange={(oneOf)=>{
              setOneOf(oneOf);
              setDataChanged( true );
            }}
            value={oneOf}
            isMulti
            styles={selectStyle} />
        </FormGroup>


        <div className="form-buttons-row">
          <Button
            className="btn-red m-l-5"
            onClick={ deletePublicFilter }>
            Delete
          </Button>
          <button className="btn ml-auto" disabled={cantSave} onClick={submitPublicFilter}>{saving?'Saving...':'Save filter'}</button>
        </div>
      </div>
    </div>
  );
}