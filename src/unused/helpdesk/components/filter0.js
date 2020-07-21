import React, { Component } from 'react';
import {NavItem, Nav, Input} from 'reactstrap';
import Select from 'react-select';
import { connect } from "react-redux";

import {database, rebase} from '../../index';
import {setFilter, storageHelpTaskTypesStart,storageUsersStart, storageCompaniesStart, storageHelpStatusesStart} from '../../redux/actions';
import {toSelArr, snapshotToArray, sameStringForms, timestampToInput, inputToTimestamp} from '../../helperFunctions';
import AddFilter from './filterAdd';

import {invisibleSelectStyle} from 'configs/components/select';

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statuses:[],
      users:[],
      companies:[],
      workTypes:[],
      status:[],
      requester:{id:null,label:'Žiadny',value:null},
      company:{id:null,label:'Žiadny',value:null},
      assigned:{id:null,label:'Žiadny',value:null},
      workType:{id:null,label:'Žiadny',value:null},
      statusDateFrom:'',
      statusDateTo:'',
      closeDateFrom:'',
      closeDateTo:'',
      pendingDateFrom:'',
      pendingDateTo:'',
      loading:true,
      public:false,

      newFilterName: "",
      openEditName: false,
    };
    this.renameFilter.bind(this);
    this.canSaveFilter.bind(this);
  }

  getItemValue(sourceKey,state,id){
    let value = state[sourceKey].find((item)=>item.id===id);
    if(value===undefined){
      if(id==='cur'){
        value={label:'Current',value:'cur',id:'cur'};
      }else{
        value={id:null,label:'Žiadny',value:null};
      }
    }
    return value;
  }

  componentWillReceiveProps(props){
    let oldFilter = this.props.filters.find((filter)=>filter.id===props.filterID);
    let newFilter = props.filters.find((filter)=>filter.id===props.filterID);
    if(this.props.filter.updatedAt!==props.filter.updatedAt||!sameStringForms(oldFilter,newFilter)){
      let filter = props.filter;
      this.setState({
        status:this.state.statuses.filter((status)=>filter.status.includes(status.id)),
        requester:this.getItemValue('users',this.state,filter.requester),
        company:this.getItemValue('companies',this.state,filter.company),
        assigned:this.getItemValue('users',this.state,filter.assigned),
        workType:this.getItemValue('workTypes',this.state,filter.workType),
        statusDateFrom:timestampToInput(filter.statusDateFrom),
        statusDateTo:timestampToInput(filter.statusDateTo),
        pendingDateFrom:timestampToInput(filter.pendingDateFrom),
        pendingDateTo:timestampToInput(filter.pendingDateTo),
        closeDateFrom:timestampToInput(filter.closeDateFrom),
        closeDateTo:timestampToInput(filter.closeDateTo),
        public:newFilter?newFilter.public:false,
      });
    }
    if(!sameStringForms(props.statuses,this.props.statuses)){
			this.setState({statuses:toSelArr(props.statuses)})
		}
    if(!sameStringForms(props.users,this.props.users)){
      this.setState({users:toSelArr(props.users,'email')})
    }
    if(!sameStringForms(props.companies,this.props.companies)){
      this.setState({companies:toSelArr(props.companies)})
    }
    if(!sameStringForms(props.taskTypes,this.props.taskTypes)){
      this.setState({taskTypes:toSelArr(props.taskTypes)})
    }
  }

  componentWillMount(){
		if(!this.props.statusesActive){
			this.props.storageHelpStatusesStart();
		}
		this.setState({statuses:toSelArr(this.props.statuses)});

    if(!this.props.usersActive){
			this.props.storageUsersStart();
		}
		this.setState({users:toSelArr(this.props.users,'email')});

    if(!this.props.companiesActive){
      this.props.storageCompaniesStart();
    }
    this.setState({companies:toSelArr(this.props.companies)});

    if(!this.props.taskTypesActive){
      this.props.storageHelpTaskTypesStart();
    }
    this.setState({workTypes:toSelArr(this.props.taskTypes)});
  }

  fetchData(){
    Promise.all(
      [
        database.collection('help-statuses').get(),
        database.collection('users').get(),
        database.collection('companies').get(),
        database.collection('help-task_types').get(),
      ]).then(([statuses,users, companies, workTypes])=>{
        this.setData(toSelArr(snapshotToArray(statuses)),toSelArr(snapshotToArray(users),'email'),toSelArr(snapshotToArray(companies)),toSelArr(snapshotToArray(workTypes)));
      });
    }

    deleteFilter(){
      if(window.confirm("Are you sure?")&& this.props.filterID!==null){
        this.props.resetFilter();
        this.props.close();
        this.props.history.push('/helpdesk/taskList/i/all');
        rebase.removeDoc('/help-filters/'+this.props.filterID).then(()=>{
          this.setState({
            status:[],
            requester:{id:null,label:'Žiadny',value:null},
            company:{id:null,label:'Žiadny',value:null},
            assigned:{id:null,label:'Žiadny',value:null},
            workType:{id:null,label:'Žiadny',value:null},
            statusDateFrom:'',
            statusDateTo:'',
            closeDateFrom:'',
            closeDateTo:'',
            pendingDateFrom:'',
            pendingDateTo:'',
            public:false,
          },this.applyFilter.bind(this));
        });
      }
    }

    resetFilter(){
      if(this.props.filterID===null){
        this.setState({
          status:[],
          requester:{id:null,label:'Žiadny',value:null},
          company:{id:null,label:'Žiadny',value:null},
          assigned:{id:null,label:'Žiadny',value:null},
          workType:{id:null,label:'Žiadny',value:null},
          statusDateFrom:'',
          statusDateTo:'',
          closeDateFrom:'',
          closeDateTo:'',
          pendingDateFrom:'',
          pendingDateTo:'',
          public:false,
        })
      }else{
        let filter = this.props.filterData.filter;
        this.setState({
          status:this.state.statuses.filter((status)=>filter.status.includes(status.id)),
          requester:this.getItemValue('users',this.state,filter.requester),
          company:this.getItemValue('companies',this.state,filter.company),
          assigned:this.getItemValue('users',this.state,filter.assigned),
          workType:this.getItemValue('workTypes',this.state,filter.workType),
          statusDateFrom:timestampToInput(filter.statusDateFrom),
          statusDateTo:timestampToInput(filter.statusDateTo),
          closeDateFrom:timestampToInput(filter.closeDateFrom),
          closeDateTo:timestampToInput(filter.closeDateTo),
          pendingDateFrom:timestampToInput(filter.pendingDateFrom),
          pendingDateTo:timestampToInput(filter.pendingDateTo)
        });
      }
    }

    applyFilter(){
      let body={
        requester:this.state.requester.id,
        company:this.state.company.id,
        assigned:this.state.assigned.id,
        workType:this.state.workType.id,
        status:this.state.status.map((item)=>item.id),
        statusDateFrom:isNaN(new Date(this.state.statusDateFrom).getTime())||this.state.statusDateFrom === '' ? '' : (new Date(this.state.statusDateFrom).getTime()),
        statusDateTo:isNaN(new Date(this.state.statusDateTo).getTime())|| this.state.statusDateTo === '' ? '' : (new Date(this.state.statusDateTo).getTime()),
        closeDateFrom:isNaN(new Date(this.state.closeDateFrom).getTime())||this.state.closeDateFrom === '' ? '' : (new Date(this.state.closeDateFrom).getTime()),
        closeDateTo:isNaN(new Date(this.state.closeDateTo).getTime())|| this.state.closeDateTo === '' ? '' : (new Date(this.state.closeDateTo).getTime()),
        pendingDateFrom:isNaN(new Date(this.state.pendingDateFrom).getTime())||this.state.pendingDateFrom === '' ? '' : (new Date(this.state.pendingDateFrom).getTime()),
        pendingDateTo:isNaN(new Date(this.state.pendingDateTo).getTime())|| this.state.pendingDateTo === '' ? '' : (new Date(this.state.pendingDateTo).getTime()),
        updatedAt:(new Date()).getTime()
      }
      this.props.setFilter(body);
      this.props.close();
    }

    renameFilter(){
      if (this.props.filterData.title !== this.state.newFilterName
        && this.state.newFilterName.length > 0){
        rebase.updateDoc('/help-filters/'+this.props.filterID, {title: this.state.newFilterName})
        .then(()=> {
        });
      }
    }

    canSaveFilter(){
      if(this.props.filterID===null){
        return true;
      }
      let filter = this.props.filterData;
      return this.props.currentUser.userData.role.value > 1 || (
        filter && filter.createdBy===this.props.currentUser.id
      )
    }


    render() {
      return (
        <div>

            <div className="d-flex m-l-15 m-t-5">
              <button type="button" className="btn-link-reversed" onClick={this.applyFilter.bind(this)}><i className="fa fa-check icon-M"/></button>
              {this.canSaveFilter() && <AddFilter
                filter={{
                  requester:this.state.requester.id,
                  company:this.state.company.id,
                  assigned:this.state.assigned.id,
                  workType:this.state.workType.id,
                  status:this.state.status.map((item)=>item.id),
                  statusDateFrom:inputToTimestamp(this.state.statusDateFrom),
                  statusDateTo:inputToTimestamp(this.state.statusDateTo),
                  closeDateFrom:inputToTimestamp(this.state.closeDateFrom),
                  closeDateTo:inputToTimestamp(this.state.closeDateTo),
                  pendingDateFrom:inputToTimestamp(this.state.pendingDateFrom),
                  pendingDateTo:inputToTimestamp(this.state.pendingDateTo),
                }}
                filterID={this.props.filterID}
                filterData={this.props.filterData}
                />}
              <button type="button" className="btn-link-reversed m-2" onClick={this.resetFilter.bind(this)}><i className="fa fa-sync icon-M"/></button>
              {this.canSaveFilter() && <button type="button" className="btn-link-reversed m-2" onClick={this.deleteFilter.bind(this)}><i className="far fa-trash-alt icon-M"/></button>}
            </div>

         <div className="sidebar-filter-label">
           Filter name
         </div>
         <div
              className=""
              onClick={() => this.setState({openEditName: (this.props.filterID ? true : false)})}
              >
              {(!this.state.openEditName || !this.canSaveFilter()) &&
                <h5 className="sidebar-filter-name">{this.props.filterID?' '+ (this.state.newFilterName ? this.state.newFilterName : this.props.filterData.title):' Všetky'}</h5>
              }
              {this.state.openEditName && this.canSaveFilter() &&
                  <Input
                    type="text"
                    className="from-control sidebar-filter-input"
                    placeholder="Enter filter name"
                    autoFocus
                    value={this.state.newFilterName ? this.state.newFilterName : this.props.filterData.title}
                    onChange={(e)=>this.setState({newFilterName: e.target.value})}
                    onBlur={() => this.setState({openEditName: false}, () => this.renameFilter())}
                />
            }
          </div>

          <Nav vertical className=" p-r-15 p-l-15 sidebar-filter">

            <NavItem>
              <div className="row sidebar-filter-row">
                <label htmlFor="example-input-small">Status:</label>
                <div className="flex">
                  <Select
                    options={this.state.statuses}
                    isMulti={true}
                    onChange={(newValue)=>this.setState({status:newValue})}
                    value={this.state.status}
                    styles={invisibleSelectStyle} />
                </div>
              </div>
            </NavItem>
            <NavItem>
              <div className="row sidebar-filter-row">
                <label htmlFor="example-input-small">Zadal:</label>
                <div className="flex">
                  <Select
                    options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(this.state.users)}
                    onChange={(newValue)=>this.setState({requester:newValue})}
                    value={this.state.requester}
                    styles={invisibleSelectStyle} />
                </div>
              </div>
            </NavItem>
            <NavItem>
              <div className="row sidebar-filter-row">
                <label htmlFor="example-input-small">Firma:</label>
                <div className="flex">
                  <Select
                    options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(this.state.companies)}
                    onChange={(newValue)=>this.setState({company:newValue})}
                    value={this.state.company}
                    styles={invisibleSelectStyle} />
                </div>
              </div>
            </NavItem>
            <NavItem>
              <div className="row sidebar-filter-row">
                <label htmlFor="example-input-small">Riesi:</label>
                <div className="flex">
                  <Select
                    options={[{label:'Žiadny',value:null,id:null},{label:'Current',value:'cur',id:'cur'}].concat(this.state.users)}
                    onChange={(newValue)=>this.setState({assigned:newValue})}
                    value={this.state.assigned}
                    styles={invisibleSelectStyle} />
                </div>
              </div>
            </NavItem>
            <NavItem>
              <label>Status change:</label>
              <div className="row sidebar-filter-row">
                <label>From:</label>
                <div className="flex">
                  <Input
                    type="datetime-local"
                    value={this.state.statusDateFrom}
                    onChange={(e)=>{
                      this.setState({statusDateFrom:e.target.value})}
                    }
                    className="form-control invisible-input"
                    placeholder="Od" />
                </div>
              </div>
            </NavItem>
            <NavItem>
              <div className="row sidebar-filter-row">
                <div>
                  <label>To:</label>
                </div>
                <div className="flex">
                  <Input
                    type="datetime-local"
                    value={this.state.statusDateTo}
                    onChange={(e)=>{
                      this.setState({statusDateTo:e.target.value})}
                    }
                    className="form-control hidden-input"
                    placeholder="Od" />
                </div>
              </div>
            </NavItem>
            <NavItem>
              <label>Pending date:</label>
              <div className="row sidebar-filter-row">
                <label>From:</label>
                <div className="flex">
                  <Input
                    type="datetime-local"
                    value={this.state.pendingDateFrom}
                    onChange={(e)=>{
                      this.setState({pendingDateFrom:e.target.value})}
                    }
                    className="form-control invisible-input"
                    placeholder="Od" />
                </div>
              </div>
            </NavItem>
            <NavItem>
              <div className="row sidebar-filter-row">
                <div>
                  <label>To:</label>
                </div>
                <div className="flex">
                  <Input
                    type="datetime-local"
                    value={this.state.pendingDateTo}
                    onChange={(e)=>{
                      this.setState({pendingDateTo:e.target.value})}
                    }
                    className="form-control invisible-input"
                    placeholder="Od" />
                </div>
              </div>
            </NavItem>
            <NavItem>
              <label>Close date:</label>
              <div className="row sidebar-filter-row">
                <label>From:</label>
                <div className="flex">
                  <Input
                    type="datetime-local"
                    value={this.state.closeDateFrom}
                    onChange={(e)=>{
                      this.setState({closeDateFrom:e.target.value})}
                    }
                    className="form-control invisible-input"
                    placeholder="Od" />
                </div>
              </div>
            </NavItem>
            <NavItem>
              <div className="row sidebar-filter-row">
                <div>
                  <label>To:</label>
                </div>
                <div className="flex">
                  <Input
                    type="datetime-local"
                    value={this.state.closeDateTo}
                    onChange={(e)=>{
                      this.setState({closeDateTo:e.target.value})}
                    }
                    className="form-control invisible-input"
                    placeholder="Od" />
                </div>
              </div>
            </NavItem>
            <NavItem>
              <div className="row sidebar-filter-row">
                <label htmlFor="example-input-small">Typ práce:</label>
                <div className="flex">
                  <Select
                    options={[{label:'Žiadny',value:null,id:null}].concat(this.state.workTypes)}
                    onChange={(newValue)=>this.setState({workType:newValue})}
                    value={this.state.workType}
                    styles={invisibleSelectStyle} />
                </div>
              </div>
            </NavItem>
        </Nav>
      </div>
      )
    }
  }


  const mapStateToProps = ({ filterReducer, storageHelpFilters, storageHelpTaskTypes, storageUsers, storageCompanies, storageHelpStatuses, userReducer }) => {
    const { filter } = filterReducer;
    const { filters,filtersLoaded } = storageHelpFilters;
    const { taskTypesActive, taskTypes } = storageHelpTaskTypes;
    const { usersActive, users } = storageUsers;
    const { companiesActive, companies } = storageCompanies;
    const { statusesActive, statuses } = storageHelpStatuses;

    return { filter,
      filters,filtersLoaded,
      taskTypesActive, taskTypes,
      usersActive, users,
      companiesActive, companies,
      statusesActive, statuses,
      currentUser:userReducer
     };
  };

  export default connect(mapStateToProps, { setFilter, storageHelpTaskTypesStart,storageUsersStart, storageCompaniesStart, storageHelpStatusesStart })(Filter);
