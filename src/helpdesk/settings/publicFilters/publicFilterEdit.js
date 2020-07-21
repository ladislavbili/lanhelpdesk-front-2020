import React, { Component } from 'react';
import { Button, FormGroup, Label, Input, Alert } from 'reactstrap';

import { connect } from "react-redux";
import Checkbox from 'components/checkbox';
import {rebase} from 'index';

import FilterDatePickerInCalendar from 'components/filterDatePickerInCalendar';
import Select from 'react-select';
import {selectStyle} from 'configs/components/select';
import {
  storageHelpFiltersStart,
  storageUsersStart,
  storageCompaniesStart,
  storageHelpTaskTypesStart,
  storageHelpProjectsStart,
} from 'redux/actions';
import { roles } from 'configs/constants/roles';
import { toMomentInput, toSelArr, filterProjectsByPermissions, fromMomentToUnix } from 'helperFunctions';
import { oneOfOptions, emptyFilter } from 'configs/constants/filter';


class PublicFilterEdit extends Component{
  constructor(props){
    super(props);
    this.state = {
      global:false,
      dashboard:false,
      order: 0,
      roles: [],
      title: '',
      project: null,
      ...emptyFilter,

      loading: true,
      saving: false,
      deleting: false,
    }
  }

  componentWillReceiveProps(props){
    if ( this.props.match.params.id !== props.match.params.id ){
      this.setState({ loading: true })
      this.setData(props);
    }else if( this.storageLoaded(this.props) !== this.storageLoaded(props) ){
      this.setData(props);
    }
  }

  componentWillMount(){
    if(!this.props.filtersActive){
      this.props.storageHelpFiltersStart();
    }

    if(!this.props.usersActive){
      this.props.storageUsersStart();
    }

    if(!this.props.companiesActive){
      this.props.storageCompaniesStart();
    }

    if(!this.props.taskTypesActive){
      this.props.storageHelpTaskTypesStart();
    }

    if(!this.props.projectsActive){
      this.props.storageHelpProjectsStart();
    }

    this.setData(this.props);
  }

  storageLoaded(props){
    return (
      props.filtersLoaded &&
      props.taskTypesLoaded &&
      props.usersLoaded &&
      props.companiesLoaded &&
      props.projectsLoaded
    )
  }

  getItemValue(sourceKey,props,id){
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
  }

  setData(props){
    if( !this.storageLoaded(props) ){
      return;
    }
    const filterData = props.filters.find( (filter) => filter.id === props.match.params.id );
    const filter = filterData.filter;
    if(filter === undefined){
      return;
    }
    this.setState({
      requester: this.getItemValue( 'users', props, filter.requester ),
      company: this.getItemValue( 'companies', props, filter.company ),
      assigned: this.getItemValue( 'users', props, filter.assigned ),
      workType: this.getItemValue( 'taskTypes', props, filter.workType ),
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

      title: filterData.title,
      order: filterData.order || 0,
      roles: filterData.roles ? toSelArr(roles.filter( (role) => filterData.roles.includes(role.id) )) : [],
      global: filterData.global,
      dashboard: filterData.dashboard,
      loading: false,
    });
  }

  cantSaveFilter(){
    return this.state.saving || this.state.loading || this.state.title === "" || (!this.state.global && this.state.project === null) || isNaN(parseInt(this.state.order))
  }

  deleteFilter(){
    if(window.confirm("Are you sure?")){
      this.setState({ deleting: true })
      rebase.removeDoc('/help-filters/' + this.props.match.params.id);
    }
  }

  submit(){
    this.setState({ saving: true })
    let body = {
      title: this.state.title,
      order: this.state.order,
      public: true,
      global: this.state.global,
      dashboard: this.state.dashboard,
      project: this.state.project !==null ? this.state.project.id : null,
      roles: this.state.roles.map( (role) => role.id ),
      filter: {
        requester: this.state.requester.id,
        company: this.state.company.id,
        assigned: this.state.assigned.id,
        workType: this.state.workType.id,
        oneOf: this.state.oneOf.map( (item) => item.value ),

        statusDateFrom: this.state.statusDateFromNow ? null :  fromMomentToUnix(this.state.statusDateFrom),
        statusDateFromNow: this.state.statusDateFromNow,
        statusDateTo: this.state.statusDateToNow ? null :  fromMomentToUnix(this.state.statusDateTo),
        statusDateToNow: this.state.statusDateToNow,

        closeDateFrom: this.state.closeDateFromNow ? null :  fromMomentToUnix(this.state.closeDateFrom),
        closeDateFromNow: this.state.closeDateFromNow,
        closeDateTo: this.state.closeDateToNow ? null :  fromMomentToUnix(this.state.closeDateTo),
        closeDateToNow: this.state.closeDateToNow,

        pendingDateFrom: this.state.pendingDateFromNow ? null :  fromMomentToUnix(this.state.pendingDateFrom),
        pendingDateFromNow: this.state.pendingDateFromNow,
        pendingDateTo: this.state.pendingDateToNow ? null :  fromMomentToUnix(this.state.pendingDateTo),
        pendingDateToNow: this.state.pendingDateToNow,

        deadlineFrom: this.state.deadlineFromNow ? null :  fromMomentToUnix(this.state.deadlineFrom),
        deadlineFromNow: this.state.deadlineFromNow,
        deadlineTo: this.state.deadlineToNow ? null :  fromMomentToUnix(this.state.deadlineTo),
        deadlineToNow: this.state.deadlineToNow,
      },
    }
    rebase.updateDoc('/help-filters/' + this.props.match.params.id, body)
    .then(()=> {
      this.setState({ saving: false });
    });
  }

  render(){
    if( !this.storageLoaded(this.props) ){
      return <Alert color="success">
        Loading data...
      </Alert>
    }
    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
        <FormGroup> {/* Title */}
          <Label for="role">Filter name</Label>
          <Input
            name="name"
            id="name"
            type="text"
            placeholder="Enter role name"
            value={this.state.title}
            onChange={(e)=>{
              this.setState({title: e.target.value})
            }}
            />
        </FormGroup>

        <FormGroup>{/* Order */}
          <Label for="role">Filter order</Label>
          <Input
            name="name"
            id="name"
            type="number"
            placeholder="Enter filter order"
            value={this.state.order}
            onChange={(e)=>{
              this.setState({ order: e.target.value })
            }}
            />
        </FormGroup>

        {/* Global */}
        <Checkbox
          className = "m-l-5 m-r-5"
          label = "Global (shown in all projects)"
          value = { this.state.global }
          onChange={(e)=>this.setState({global:!this.state.global })}
          />

        <div className="m-b-10">{/* Project */}
          <Label className="form-label">Projekt</Label>
          <Select
            placeholder="Vyberte projekt"
            value={this.state.project}
            isDisabled={this.state.global}
            onChange={(project)=> {
              this.setState({ project });
            }}
            options={filterProjectsByPermissions(this.props.projects, this.props.currentUser)}
            styles={selectStyle}
            />
        </div>

        {/* Dashboard */}
        <Checkbox
          className = "m-l-5 m-r-5"
          label = "Dashboard (shown in dashboard)"
          value = { this.state.dashboard }
          onChange={(e)=>this.setState({dashboard:!this.state.dashboard })}
          />

        <FormGroup>{/* Roles */}
          <Label className="">Roles</Label>
          <Select
            placeholder="Choose roles"
            value={this.state.roles}
            isMulti
            onChange={(newRoles)=>{
              if(newRoles.some((role) => role.id === 'all' )){
                if( this.state.roles.length === roles.length ){
                  this.setState({ roles: [] })
                }else{
                  this.setState({ roles: toSelArr(roles) })
                }
              }else{
                this.setState({roles: newRoles})
              }
            }}
            options={toSelArr([{id: 'all', title: this.state.roles.length === roles.length ? 'Clear' : 'All' }].concat(roles))}
            styles={selectStyle}
            />
        </FormGroup>


        <Label className="m-t-15">Filter attributes</Label>
        <hr className="m-t-5 m-b-10"/>

        <FormGroup>{/* Requester */}
          <label>Zadal</label>
          <Select
            id="select-requester"
            options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(toSelArr(this.props.users, 'email'))}
            onChange={ (requester) => this.setState({requester}) }
            value={this.state.requester}
            styles={selectStyle} />
        </FormGroup>

        <FormGroup>{/* Company */}
          <label>Firma</label>
          <Select
            options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(toSelArr(this.props.companies))}
            onChange={ (company) => this.setState({company}) }
            value={this.state.company}
            styles={selectStyle} />
        </FormGroup>

        <FormGroup>{/* Assigned */}
          <label>Riesi</label>
          <Select
            options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(toSelArr(this.props.users, 'email'))}
            onChange={(newValue)=>this.setState({assigned:newValue})}
            value={this.state.assigned}
            styles={selectStyle}
            />
        </FormGroup>

        {/* Status Date */}
        <FilterDatePickerInCalendar
          label="Status date"
          showNowFrom={this.state.statusDateFromNow}
          dateFrom={this.state.statusDateFrom}
          setShowNowFrom={(statusDateFromNow)=>{
            this.setState({ statusDateFromNow })
          }}
          setDateFrom={(statusDateFrom)=>{
            this.setState({statusDateFrom})
          }}
          showNowTo={this.state.statusDateToNow}
          dateTo={this.state.statusDateTo}
          setShowNowTo={(statusDateToNow)=>{
            this.setState({ statusDateToNow })
          }}
          setDateTo={(statusDateTo)=>{
            this.setState({statusDateTo})
          }}
          />

        {/* Pending Date */}
        <FilterDatePickerInCalendar
          label="Pending date"
          showNowFrom={this.state.pendingDateFromNow}
          dateFrom={this.state.pendingDateFrom}
          setShowNowFrom={(pendingDateFromNow)=>{
            this.setState({ pendingDateFromNow })
          }}
          setDateFrom={(pendingDateFrom)=>{
            this.setState({pendingDateFrom})
          }}
          showNowTo={this.state.pendingDateToNow}
          dateTo={this.state.pendingDateTo}
          setShowNowTo={(pendingDateToNow)=>{
            this.setState({ pendingDateToNow })
          }}
          setDateTo={(pendingDateTo)=>{
            this.setState({pendingDateTo})
          }}
          />

        {/* Close Date */}
        <FilterDatePickerInCalendar
          label="Close date"
          showNowFrom={this.state.closeDateFromNow}
          dateFrom={this.state.closeDateFrom}
          setShowNowFrom={(closeDateFromNow)=>{
            this.setState({ closeDateFromNow })
          }}
          setDateFrom={(closeDateFrom)=>{
            this.setState({closeDateFrom})
          }}
          showNowTo={this.state.closeDateToNow}
          dateTo={this.state.closeDateTo}
          setShowNowTo={(closeDateToNow)=>{
            this.setState({ closeDateToNow })
          }}
          setDateTo={(closeDateTo)=>{
            this.setState({closeDateTo})
          }}
          />

        {/* Deadline */}
        <FilterDatePickerInCalendar
          label="Deadline"
          showNowFrom={this.state.deadlineFromNow}
          dateFrom={this.state.deadlineFrom}
          setShowNowFrom={(deadlineFromNow)=>{
            this.setState({ deadlineFromNow })
          }}
          setDateFrom={(deadlineFrom)=>{
            this.setState({deadlineFrom})
          }}
          showNowTo={this.state.deadlineToNow}
          dateTo={this.state.deadlineTo}
          setShowNowTo={(deadlineToNow)=>{
            this.setState({ deadlineToNow })
          }}
          setDateTo={(deadlineTo)=>{
            this.setState({deadlineTo})
          }}
          />

        <FormGroup>{/* Work Type */}
          <label htmlFor="example-input-small">Typ práce</label>
          <Select
            options={[{label:'Žiadny',value:null,id:null}].concat(toSelArr(this.props.taskTypes))}
            onChange={(newValue)=>this.setState({workType:newValue})}
            value={this.state.workType}
            styles={selectStyle} />
        </FormGroup>

        <FormGroup>{/* One Of */}
          <label htmlFor="example-input-small">Alebo - jedna splnená stačí</label>
          <Select
            options={oneOfOptions}
            onChange={(oneOf)=>this.setState({oneOf})}
            value={this.state.oneOf}
            isMulti
            styles={selectStyle} />
        </FormGroup>
        <div className="row">
          <Button className="btn" disabled={this.cantSaveFilter()} onClick={this.submit.bind(this)}>{this.state.saving?'Saving...':'Save filter'}</Button>
          <Button className="btn btn-red m-l-5" disabled={this.state.deleting} onClick={this.deleteFilter.bind(this)}>{this.state.deleting ? 'Deleting...':'Delete filter'}</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({
  storageHelpFilters,
  storageHelpTaskTypes,
  storageUsers,
  storageCompanies,
  storageHelpProjects,
  userReducer
}) => {
  const { filtersActive, filtersLoaded, filters } = storageHelpFilters;
  const { taskTypesActive, taskTypesLoaded, taskTypes } = storageHelpTaskTypes;
  const { usersActive, usersLoaded, users } = storageUsers;
  const { companiesActive, companiesLoaded, companies } = storageCompanies;
  const { projectsActive, projects, projectsLoaded } = storageHelpProjects;
  return {
    filtersActive, filtersLoaded, filters,
    taskTypesActive, taskTypesLoaded, taskTypes,
    usersActive, usersLoaded, users,
    companiesActive, companiesLoaded, companies,
    projectsActive, projects, projectsLoaded,
    currentUser:userReducer
  };
};

export default connect(mapStateToProps, {
  storageHelpFiltersStart,
  storageUsersStart,
  storageCompaniesStart,
  storageHelpTaskTypesStart,
  storageHelpProjectsStart,
})(PublicFilterEdit);
