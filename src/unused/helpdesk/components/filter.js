import React, { Component } from 'react';
import {NavItem, Nav} from 'reactstrap';
import Select from 'react-select';
import { connect } from "react-redux";

import {database, rebase} from '../../index';
import {setFilter} from '../../redux/actions';
import {toSelArr, snapshotToArray} from '../../helperFunctions';
import AddFilter from './filterAdd';

import {selectStyle} from 'configs/components/select';

class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statuses:[],
      users:[],
      companies:[],
      workTypes:[],
      status:{id:null,label:'Žiadny',value:null},
      requester:{id:null,label:'Žiadny',value:null},
      company:{id:null,label:'Žiadny',value:null},
      assigned:{id:null,label:'Žiadny',value:null},
      workType:{id:null,label:'Žiadny',value:null},
      statusDateFrom:'',
      statusDateTo:'',
      loading:true
    };
    this.fetchData();
  }

  setData(statuses,users,companies,workTypes){
    this.setState({
      statuses,
      users,
      companies,
      workTypes,
      status:{id:null,label:'Žiadny',value:null},
      requester:{id:null,label:'Žiadny',value:null},
      company:{id:null,label:'Žiadny',value:null},
      assigned:{id:null,label:'Žiadny',value:null},
      workType:{id:null,label:'Žiadny',value:null},
      statusDateFrom:'',
      statusDateTo:'',
      loading:false
    });
  }

  getItemValue(sourceKey,state,id){
    let value = state[sourceKey].find((item)=>item.id===id);
    if(value===undefined){
      value={id:null,label:'Žiadny',value:null};
    }
    return value;
  }

  componentWillReceiveProps(props){
    if(this.props.filter.updatedAt!==props.filter.updatedAt){
      let filter = props.filter;
      this.setState({
        status:this.getItemValue('statuses',this.state,filter.status),
        requester:this.getItemValue('users',this.state,filter.requester),
        company:this.getItemValue('companies',this.state,filter.company),
        assigned:this.getItemValue('users',this.state,filter.assigned),
        workType:this.getItemValue('workTypes',this.state,filter.workType),
        statusDateFrom:filter.statusDateFrom,
        statusDateTo:filter.statusDateTo,
      });
    }
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
        rebase.removeDoc('/help-filters/'+this.props.filterID).then(()=>{
          this.props.resetFilter();
          this.setState({
            status:{id:null,label:'Žiadny',value:null},
            requester:{id:null,label:'Žiadny',value:null},
            company:{id:null,label:'Žiadny',value:null},
            assigned:{id:null,label:'Žiadny',value:null},
            workType:{id:null,label:'Žiadny',value:null},
            statusDateFrom:'',
            statusDateTo:'',
          });
          this.applyFilter();
        });
      }
    }

    resetFilter(){
      if(this.props.filterID===null){
        this.setState({
          status:{id:null,label:'Žiadny',value:null},
          requester:{id:null,label:'Žiadny',value:null},
          company:{id:null,label:'Žiadny',value:null},
          assigned:{id:null,label:'Žiadny',value:null},
          workType:{id:null,label:'Žiadny',value:null},
          statusDateFrom:'',
          statusDateTo:'',
        })
      }else{
        this.setState({
          status:this.getItemValue('statuses',this.state,this.props.filterData.filter.status),
          requester:this.getItemValue('users',this.state,this.props.filterData.filter.requester),
          company:this.getItemValue('companies',this.state,this.props.filterData.filter.company),
          assigned:this.getItemValue('users',this.state,this.props.filterData.filter.assigned),
          workType:this.getItemValue('workTypes',this.state,this.props.filterData.filter.workType),
          statusDateFrom:this.props.filterData.filter.statusDateFrom,
          statusDateTo:this.props.filterData.filter.statusDateTo,
        });
      }
    }

    applyFilter(){
      let body={
        requester:this.state.requester.id,
        company:this.state.company.id,
        assigned:this.state.assigned.id,
        workType:this.state.workType.id,
        status:this.state.status.id,
        statusDateFrom:isNaN(new Date(this.state.statusDateFrom).getTime())||this.state.statusDateFrom === '' ? '' : (new Date(this.state.statusDateFrom).getTime()),
        statusDateTo:isNaN(new Date(this.state.statusDateTo).getTime())|| this.state.statusDateTo === '' ? '' : (new Date(this.state.statusDateTo).getTime()),
        updatedAt:(new Date()).getTime()
      }
      this.props.setFilter(body);
    }

    render() {
      return (
        <Nav vertical className="p-10">
          <NavItem>
            <div className="d-flex m-b-2">
              <button type="button" className="btn-link" onClick={this.applyFilter.bind(this)}>Apply</button>
              <AddFilter
                filter={{
                  requester:this.state.requester.id,
                  company:this.state.company.id,
                  assigned:this.state.assigned.id,
                  workType:this.state.workType.id,
                  status:this.state.status.id,
                  statusDateFrom:isNaN(new Date(this.state.statusDateFrom).getTime())||this.state.statusDateFrom === '' ? '' : (new Date(this.state.statusDateFrom).getTime()),
                  statusDateTo:isNaN(new Date(this.state.statusDateTo).getTime())|| this.state.statusDateTo === '' ? '' : (new Date(this.state.statusDateTo).getTime())
                }}
                filterID={this.props.filterID}
                filterData={this.props.filterData}
              />
              <button type="button" className="btn-link" onClick={this.resetFilter.bind(this)}>Reset</button>
              <button type="button" className="btn-link" onClick={this.deleteFilter.bind(this)}>Delete</button>
            </div>
          </NavItem>
          <h5>{this.props.filterID?'Filter: '+this.props.filterData.title:'No filter selected'}</h5>
          <NavItem>
            <div className="m-b-3">
              <label htmlFor="example-input-small">Status</label>
              <Select
                options={[{label:'Žiadny',value:null,id:null}].concat(this.state.statuses)}
                onChange={(newValue)=>this.setState({status:newValue})}
                value={this.state.status}
                styles={selectStyle} />
            </div>
          </NavItem>
          <NavItem>
            <div className="m-b-3">
              <label htmlFor="example-input-small">Zadal</label>
              <Select
                options={[{label:'Žiadny',value:null,id:null}].concat(this.state.users)}
                onChange={(newValue)=>this.setState({requester:newValue})}
                value={this.state.requester}
                styles={selectStyle} />
            </div>
          </NavItem>
          <NavItem>
            <div className="m-b-3">
              <label htmlFor="example-input-small">Firma</label>
              <Select
                options={[{label:'Žiadny',value:null,id:null}].concat(this.state.companies)}
                onChange={(newValue)=>this.setState({company:newValue})}
                value={this.state.company}
                styles={selectStyle} />
            </div>
          </NavItem>
          <NavItem>
            <div className="m-b-3">
              <label htmlFor="example-input-small">Riesi</label>
              <Select
                options={[{label:'Žiadny',value:null,id:null}].concat(this.state.users)}
                onChange={(newValue)=>this.setState({assigned:newValue})}
                value={this.state.assigned}
                styles={selectStyle} />
            </div>
          </NavItem>
          <NavItem>
            <div className="m-b-3">
              <label htmlFor="example-input-small">Status date from</label>
              <input
                type="datetime-local"
                value={this.state.statusDateFrom}
                onChange={(e)=>{
                  this.setState({statusDateFrom:e.target.value})}
                }
                className="form-control active"
                placeholder="Od" />
            </div>
          </NavItem>
          <NavItem>
            <div className=" m-b-3">
              <label htmlFor="example-input-small">Status date to</label>
              <input
                type="datetime-local"
                value={this.state.statusDateTo}
                onChange={(e)=>{
                  this.setState({statusDateTo:e.target.value})}
                }
                className="form-control active"
                placeholder="Od" />
            </div>
          </NavItem>
          <NavItem>
            <div className="m-b-3">
              <label htmlFor="example-input-small">Typ práce</label>
              <Select
                options={[{label:'Žiadny',value:null,id:null}].concat(this.state.workTypes)}
                onChange={(newValue)=>this.setState({workType:newValue})}
                value={this.state.workType}
                styles={selectStyle} />
            </div>
          </NavItem>
        </Nav>
      )
    }
  }


  const mapStateToProps = ({ filterReducer }) => {
    const { filter } = filterReducer;
    return { filter };
  };

  export default connect(mapStateToProps, { setFilter })(Filter);
