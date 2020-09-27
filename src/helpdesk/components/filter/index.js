import React from 'react';
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { Input } from 'reactstrap';
import Select from 'react-select';

import {toSelArr, toSelItem, toMomentInput } from '../../../helperFunctions';
import AddFilter from './filterAdd';
import FilterDatePickerInCalendar from 'components/filterDatePickerInCalendar';

import {invisibleSelectStyleOtherFont} from 'configs/components/select';
import { oneOfOptions } from 'configs/constants/filter';

import { GET_USERS } from 'helpdesk/settings/users';
import { GET_COMPANIES } from 'helpdesk/settings/companies';
import { GET_TASK_TYPES } from 'helpdesk/settings/taskTypes';
import { GET_MY_FILTERS } from 'helpdesk/components/sidebar/tasksSidebar';

const GET_MY_DATA = gql`
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

const DELETE_FILTER = gql`
mutation deleteFilter($id: Int!) {
  deleteFilter(
    id: $id,
  ){
    id
  }
}
`;

export default function Filter(props) {
  //data & queries
  const { history, filterID, filterData, close } = props;
  const { data } = useQuery(GET_MY_DATA);
  const { data: userData, loading: userLoading } = useQuery(GET_USERS);
  const { data: companyData, loading: companyLoading } = useQuery(GET_COMPANIES);
  const { data: taskTypeData, loading: taskTypeLoading } = useQuery(GET_TASK_TYPES);
  const [ deleteFilter, {client} ] = useMutation(DELETE_FILTER);

  const users = ( userLoading ? [] : toSelArr(userData.users, 'email'));
  const companies = ( companyLoading ? [] : toSelArr(companyData.companies) );
  const taskTypes = ( taskTypeLoading ? [] : toSelArr(taskTypeData.taskTypes) );

  let currentUser = {};

  if (data) {
    currentUser = data.getMyData;
  }

  const [ newFilterName, setNewFilterName ] = React.useState("");
  const [ openEditName, setOpenEditName ] = React.useState(false);

  const [ assignedToCur, setAssignedToCur ] = React.useState(filterID ? filterData.filter.assignedToCur : false);
  let assigned = {id:null,label:'Žiadny',value:null};
  if (filterID && filterData.filter.assignedToCur){
    assigned = {label:'Current',value:'cur',id:'cur'};
  } else if (filterID && filterData.filter.assignedTo){
    assigned = toSelItem(filterData.filter.assignedTo, 'email');
  }
  const [ assignedTo, setAssignedTo ] = React.useState(assigned);

  const [ requesterCur, setRequesterCur ] = React.useState(filterID ? filterData.filter.requesterCur : false);
  let req = {id:null,label:'Žiadny',value:null};
  if (filterID && filterData.filter.requesterCur){
    req = {label:'Current',value:'cur',id:'cur'};
  } else if (filterID && filterData.filter.requester){
    req = toSelItem(filterData.filter.requester, 'email');
  }
  const [ requester, setRequester ] = React.useState( req );

  const [ companyCur, setCompanyCur ] = React.useState(filterID ? filterData.filter.companyCur : false);
  let com = {id:null,label:'Žiadny',value:null};
  if (filterID && filterData.filter.companyCur){
    com = {label:'Current',value:'cur',id:'cur'};
  } else if (filterID && filterData.filter.company){
    com = toSelItem(filterData.filter.company);
  }
  const [ company, setCompany ] = React.useState(com);

  const [ taskType, setTaskType ] = React.useState(filterID && filterData.filter.taskType? toSelItem(filterData.filter.taskType) : null);
  const [ oneOf, setOneOf ] = React.useState(filterID && filterData.filter.oneOf ? toSelArr(filterData.filter.oneOf) : []);
  const [ statusDateFrom, setStatusDateFrom ] = React.useState(filterID ? toMomentInput(filterData.filter.statusDateFrom) : null);
  const [ statusDateFromNow, setStatusDateFromNow ] = React.useState(filterID ? filterData.filter.statusDateFromNow : false);
  const [ statusDateTo, setStatusDateTo ] = React.useState(filterID ? toMomentInput(filterData.filter.statusDateTo) : null);
  const [ statusDateToNow, setStatusDateToNow ] = React.useState(filterID ? filterData.filter.statusDateToNow : false);
  const [ pendingDateFrom, setPendingDateFrom ] = React.useState(filterID ? toMomentInput(filterData.filter.pendingDateFrom) : null);
  const [ pendingDateFromNow, setPendingDateFromNow ] = React.useState(filterID ? filterData.filter.pendingDateFromNow : false);
  const [ pendingDateTo, setPendingDateTo ] = React.useState(filterID ? toMomentInput(filterData.filter.pendingDateTo) : null);
  const [ pendingDateToNow, setPendingDateToNow ] = React.useState(filterID ? filterData.filter.pendingDateToNow : false);
  const [ closeDateFrom, setCloseDateFrom ] = React.useState(filterID ? toMomentInput(filterData.filter.closeDateFrom) : null);
  const [ closeDateFromNow, setCloseDateFromNow ] = React.useState(filterID ? filterData.filter.closeDateFromNow : false);
  const [ closeDateTo, setCloseDateTo ] = React.useState(filterID ? toMomentInput(filterData.filter.closeDateTo) : null);
  const [ closeDateToNow, setCloseDateToNow ] = React.useState(filterID ? filterData.filter.closeDateToNow : false);
  const [ deadlineFrom, setDeadlineFrom ] = React.useState(filterID ? toMomentInput(filterData.filter.deadlineFrom) : null);
  const [ deadlineFromNow, setDeadlineFromNow ] = React.useState(filterID ? filterData.filter.deadlineFromNow : false);
  const [ deadlineTo, setDeadlineTo ] = React.useState(filterID ? toMomentInput(filterData.filter.deadlineTo) : null);
  const [ deadlineToNow, setDeadlineToNow ] = React.useState(filterID ? filterData.filter.deadlineToNow : false);

  React.useEffect(() => {
		if (!openEditName) {
			renameFilter();
		}
	}, [openEditName]);

  React.useEffect(() => {
		if (filterID && filterData) {
      setNewFilterName("");
      setOpenEditName(false);

      setAssignedToCur(filterData.filter.assignedToCur);
      let assigned = {id:null,label:'Žiadny',value:null};
      if (filterID && filterData.filter.assignedToCur){
        assigned = {label:'Current',value:'cur',id:'cur'};
      } else if (filterID && filterData.filter.assignedTo){
        assigned = toSelItem(filterData.filter.assignedTo, 'email');
      }
      setAssignedTo(assigned);

      setRequesterCur(filterData.filter.requesterCur);
      let req = {id:null,label:'Žiadny',value:null};
      if (filterData.filter.requesterCur){
        req = {label:'Current',value:'cur',id:'cur'};
      } else if (filterData.filter.requester){
        req = toSelItem(filterData.filter.requester, 'email');
      }
      setRequester( req );

      setCompanyCur(filterData.filter.companyCur );
      let com = {id:null,label:'Žiadny',value:null};
      if (filterData.filter.companyCur){
        com = {label:'Current',value:'cur',id:'cur'};
      } else if (filterData.filter.company){
        com = toSelItem(filterData.filter.company);
      }
      setCompany(com);

      setTaskType( filterData.filter.taskType ? toSelItem(filterData.filter.taskType) : null );
      setOneOf( filterData.filter.oneOf ? toSelArr(filterData.filter.oneOf) : [] );
      setStatusDateFrom( toMomentInput(filterData.filter.statusDateFrom) );
      setStatusDateFromNow( filterData.filter.statusDateFromNow );
      setStatusDateTo( toMomentInput(filterData.filter.statusDateTo) );
      setStatusDateToNow( filterData.filter.statusDateToNow );
      setPendingDateFrom( toMomentInput(filterData.filter.pendingDateFrom) );
      setPendingDateFromNow( filterData.filter.pendingDateFromNow );
      setPendingDateTo( toMomentInput(filterData.filter.pendingDateTo) );
      setPendingDateToNow( filterData.filter.pendingDateToNow );
      setCloseDateFrom( toMomentInput(filterData.filter.closeDateFrom) );
      setCloseDateFromNow( filterData.filter.closeDateFromNow );
      setCloseDateTo( toMomentInput(filterData.filter.closeDateTo) );
      setCloseDateToNow( filterData.filter.closeDateToNow );
      setDeadlineFrom( toMomentInput(filterData.filter.deadlineFrom) );
      setDeadlineFromNow( filterData.filter.deadlineFromNow );
      setDeadlineTo( toMomentInput(filterData.filter.deadlineTo) );
      setDeadlineToNow( filterData.filter.deadlineToNow );
		}
	}, [filterID]);
/*
  const getItemValue = (sourceKey,props,id) => {
    const source = toSelArr( props[sourceKey], ['users'].includes(sourceKey) ? 'email' : 'title' )
    let value = source.find((item)=>item.id === id);
    if(value===undefined){
      if(id==='cur'){
        value={label:'Current',value:'cur',id:'cur'};
      }else{
        value={id:null,label:'Žiadny',value:null};
      }
    }
    return value;
  }*/


  const deleteFilterFunc = () => {
    if(window.confirm("Are you sure?") && filterID!==null){
    //  props.resetFilter();
    //  close();
      deleteFilter({ variables: {
        id: filterID,
      } }).then( ( response ) => {
        const allFilters = client.readQuery({query: GET_MY_FILTERS}).myFilters;
        const newFilters = allFilters.filter(item =>item.id !== filterID);
        client.writeQuery({ query: GET_MY_FILTERS, data: {myFilters: [...newFilters] } });
        history.push('/helpdesk/taskList/i/all');
      }).catch( (err) => {
        console.log(err.message);
        console.log(err);
      });
      /*rebase.removeDoc('/help-filters/'+this.props.filterID).then(()=>{
        this.setState(emptyFilter,this.applyFilter.bind(this));
      });*/
    }
  }

  const resetFilter = () => {
    if( filterID === null ){
      setEmptyFilter();
    }
    setFilter();
  }

  const setFilter = () => {
    /*if(!this.storageLoaded(props)){
      return;
    }
    const filterData = props.filters.find( (filter) => filter.id === props.filter.id );
    const filter = props.filter;
    this.setState({
      requester: this.getItemValue( 'users', props, filter.requester ),
      company: this.getItemValue( 'companies', props, filter.company ),
      assigned: this.getItemValue( 'users', props, filter.assigned ),
      taskType: this.getItemValue( 'taskTypes', props, filter.taskType ),
      oneOf: oneOfOptions.filter( (option) => filter.oneOf.includes(option.value) ),

      statusDateFrom: toMomentInput(filter.statusDateFrom),
      statusDateFromNow: filter.statusDateFromNow === true,
      statusDateTo: toMomentInput(filter.statusDateTo),
      statusDateToNow: filter.statusDateToNow === true,

      pendingDateFrom: toMomentInput(filter.pendingDateFrom),
      pendingDateFromNow: filter.pendingDateFromNow === true,
      pendingDateTo: toMomentInput(filter.pendingDateTo),
      pendingDateToNow: filter.pendingDateToNow === true,

      closeDateFrom: toMomentInput(filter.closeDateFrom),
      closeDateFromNow: filter.closeDateFromNow === true,
      closeDateTo: toMomentInput(filter.closeDateTo),
      closeDateToNow: filter.closeDateToNow === true,

      deadlineFrom: toMomentInput(filter.deadlineFrom),
      deadlineFromNow: filter.deadlineFromNow === true,
      deadlineTo: toMomentInput(filter.deadlineTo),
      deadlineToNow: filter.deadlineToNow === true,

      public:filterData ? filterData.public : false,
    });
  }

  storageLoaded(props){
    return (
      props.filtersLoaded &&
      props.taskTypesLoaded &&
      props.usersLoaded &&
      props.companiesLoaded
    )*/
  }


  const setEmptyFilter = () => {
    // filter = emptyFilter bla bla
  }

  const applyFilter = () => {
  /*  let body={
      requester:this.state.requester.id,
      company:this.state.company.id,
      assigned:this.state.assigned.id,
      taskType:this.state.taskType.id,
      oneOf: this.state.oneOf.map( (item) => item.value ),

      statusDateFrom: toMomentInput(this.state.statusDateFrom),
      statusDateFromNow: this.state.statusDateFromNow === true,
      statusDateTo: toMomentInput(this.state.statusDateTo),
      statusDateToNow: this.state.statusDateToNow === true,

      pendingDateFrom: toMomentInput(this.state.pendingDateFrom),
      pendingDateFromNow: this.state.pendingDateFromNow === true,
      pendingDateTo: toMomentInput(this.state.pendingDateTo),
      pendingDateToNow: this.state.pendingDateToNow === true,

      closeDateFrom: toMomentInput(this.state.closeDateFrom),
      closeDateFromNow: this.state.closeDateFromNow === true,
      closeDateTo: toMomentInput(this.state.closeDateTo),
      closeDateToNow: this.state.closeDateToNow === true,

      deadlineFrom: toMomentInput(this.state.deadlineFrom),
      deadlineFromNow: this.state.deadlineFromNow === true,
      deadlineTo: toMomentInput(this.state.deadlineTo),
      deadlineToNow: this.state.deadlineToNow === true,

      updatedAt:(new Date()).getTime()
    }
    this.props.setFilter(body);*/ // localCache
  }

  const renameFilter = () => {
    if ( filterData && filterData.title !== newFilterName && newFilterName.length > 0){
    //  rebase.updateDoc('/help-filters/'+this.props.filterID, {title: this.state.newFilterName})
    }
  }

  const canSaveFilter = () => {
    if ( filterID === null || filterID === undefined){
      return true;
    }
    let filter = filterData;
    return true || filter.roles.includes(currentUser.role.id) || ( filter && filter.createdBy === currentUser.id );
  }

  return (
    <div>
      <div className="d-flex m-l-15 m-t-5">
        <button type="button" className="btn-link-reversed" onClick={applyFilter}><i className="fa fa-check icon-M"/></button>
        {canSaveFilter() &&
          <AddFilter
            filter={{
              requester: requester && requester.value !== 'cur' && requester.value !== null ? requester.id : null,
              requesterCur: requesterCur,
              company: company && company.value !== 'cur' && company.value !== null ? company.id : null,
              companyCur: companyCur,
              assignedTo: assignedTo && assignedTo.value !== 'cur' && assignedTo.value !== null ? assignedTo.id : null,
              assignedToCur: assignedToCur,
              taskType: taskType ? taskType.id : null,
              oneOf: oneOf.map( (item) => item.value ),

              statusDateFrom: toMomentInput(statusDateFrom),
              statusDateFromNow: statusDateFromNow === true,
              statusDateTo: toMomentInput(statusDateTo),
              statusDateToNow: statusDateToNow === true,

              pendingDateFrom: toMomentInput(pendingDateFrom),
              pendingDateFromNow: pendingDateFromNow === true,
              pendingDateTo: toMomentInput(pendingDateTo),
              pendingDateToNow: pendingDateToNow === true,

              closeDateFrom: toMomentInput(closeDateFrom),
              closeDateFromNow: closeDateFromNow === true,
              closeDateTo: toMomentInput(closeDateTo),
              closeDateToNow: closeDateToNow === true,

              deadlineFrom: toMomentInput(deadlineFrom),
              deadlineFromNow: deadlineFromNow === true,
              deadlineTo: toMomentInput(deadlineTo),
              deadlineToNow: deadlineToNow === true,
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
                    onChange={(e) => setNewFilterName(e.target.value)}
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
