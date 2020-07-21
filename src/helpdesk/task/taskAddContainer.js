import React, { Component } from 'react';
import { connect } from "react-redux";
import {toSelArr, sameStringForms } from '../../helperFunctions';
import { Modal, ModalBody, Button } from 'reactstrap';
import TaskAdd from './taskAddCombined';
import {storageHelpStatusesStart, storageHelpProjectsStart, storageUsersStart, storageCompaniesStart, storageHelpWorkTypesStart, storageHelpUnitsStart, storageHelpPricesStart, storageHelpPricelistsStart, storageHelpTagsStart, storageHelpTaskTypesStart, storageMetadataStart, storageHelpMilestonesStart, storageHelpTripTypesStart} from '../../redux/actions';
import { noMilestone } from 'configs/constants/sidebar';

class TaskAddContainer extends Component{
  constructor(props){
    super(props);
    this.state={
			openAddTaskModal: false,
      loading: true,

      statuses: [],
      projects: [],
      users: [],
      milestones:[],
      companies: [],
      workTypes: [],
      taskTypes: [],
      allTags: [],
      units: [],
      tripTypes:[],
      newID: null,
      defaultUnit: null,

      add: 0,
    }
    this.setData.bind(this);
  }

  storageLoaded(props){
    return props.statusesLoaded &&
    props.projectsLoaded &&
    props.usersLoaded &&
    props.companiesLoaded &&
    props.workTypesLoaded &&
    props.unitsLoaded &&
    props.pricesLoaded &&
    props.pricelistsLoaded &&
    props.tagsLoaded &&
    props.taskTypesLoaded &&
    props.metadataLoaded &&
    props.milestonesLoaded &&
    props.tripTypesLoaded

  }

  componentWillReceiveProps(props){
		if((!sameStringForms(props.statuses,this.props.statuses)||
      !sameStringForms(props.projects,this.props.projects)||
      !sameStringForms(props.users,this.props.users)||
      !sameStringForms(props.companies,this.props.companies)||
      !sameStringForms(props.workTypes,this.props.workTypes)||
      !sameStringForms(props.units,this.props.units)||
      !sameStringForms(props.prices,this.props.prices)||
      !sameStringForms(props.pricelists,this.props.pricelists)||
      !sameStringForms(props.tags,this.props.tags)||
      !sameStringForms(props.taskTypes,this.props.taskTypes)||
      !sameStringForms(props.metadata,this.props.metadata)||
			!sameStringForms(props.milestones,this.props.milestones)||
      !sameStringForms(props.tripTypes,this.props.tripTypes)
      )&&
      this.storageLoaded(props)
    ){
      this.setData(props);
		}
    if(!this.storageLoaded(this.props) && this.storageLoaded(props)){
      this.setData(props);
    }
	}

  componentWillMount(){
    if(!this.props.statusesActive){
      this.props.storageHelpStatusesStart();
    }

    if(!this.props.projectsActive){
      this.props.storageHelpProjectsStart();
    }

    if(!this.props.tripTypesActive){
      this.props.storageHelpTripTypesStart();
    }

    if(!this.props.usersActive){
      this.props.storageUsersStart();
    }

    if(!this.props.companiesActive){
      this.props.storageCompaniesStart();
    }

    if(!this.props.workTypesActive){
      this.props.storageHelpWorkTypesStart();
    }

    if(!this.props.unitsActive){
      this.props.storageHelpUnitsStart();
    }

    if(!this.props.pricesActive){
      this.props.storageHelpPricesStart();
    }

    if(!this.props.pricelistsActive){
      this.props.storageHelpPricelistsStart();
    }

    if(!this.props.tagsActive){
      this.props.storageHelpTagsStart();
    }

    if(!this.props.taskTypesActive){
      this.props.storageHelpTaskTypesStart();
    }
    if(!this.props.metadataActive){
      this.props.storageMetadataStart();
    }
    if(!this.props.milestonesActive){
      this.props.storageHelpMilestonesStart();
    }
    if(this.storageLoaded(this.props)){
      this.setData(this.props);
    }
  }

    setData(props){
      let statuses = toSelArr(props.statuses);
      let projects = toSelArr(props.projects);
      let tripTypes = toSelArr(props.tripTypes);
      let users = toSelArr(props.users,'email');
      let companies = toSelArr(props.companies);
      let units = toSelArr(props.units);
      let prices = props.prices;
      let pricelists = props.pricelists;
      let tags = toSelArr(props.tags);
      let taskTypes = toSelArr(props.taskTypes);
      let defaultUnit = props.metadata?props.metadata.defaultUnit:null;
      let newID = props.metadata?props.metadata.taskLastID:null;
      let milestones = toSelArr([noMilestone].concat(props.milestones));

      let newCompanies=companies.map((company)=>{
        let newCompany={...company,pricelist:pricelists.find((item)=>item.id===company.pricelist)};
        return newCompany;
      });
      let newTaskTypes=taskTypes.map((taskType)=>{
        let newTaskType = {...taskType, prices:prices.filter((price)=>price.type===taskType.id)}
        return newTaskType;
      });

      let newTripTypes=tripTypes.map((tripType)=>{
        let newTripType = {...tripType, prices:prices.filter((price)=>price.type===tripType.id)}
        return newTripType;
      });

      this.setState({
        statuses,
        projects,
        users,
        companies:newCompanies,
        tripTypes:newTripTypes,
        taskTypes:newTaskTypes,
        allTags:tags,
        milestones,
        units,
        newID,
        loading:false,

        defaultUnit
      });
    }

  render(){
	  return (
			<div className="display-inline">
			{
				!this.props.task &&
				<Button
					className="btn sidebar-btn"
					onClick={()=>{this.setState({openAddTaskModal:true,hidden:false})}}
				>  Add task
				</Button>
			}

			{
				this.props.task &&
				<button
					type="button"
					className="btn btn-link-reversed waves-effect"
					disabled={this.props.disabled}
					onClick={()=>{this.setState({openAddTaskModal:true,hidden:false})}}>
					<i
						className="far fa-copy"
						/> Copy
				</button>
			}


			<Modal isOpen={this.state.openAddTaskModal}  >
					<ModalBody className="scrollable" >
            {  this.state.openAddTaskModal && this.storageLoaded(this.props) &&
						   <TaskAdd {...this.props}
                 loading={this.state.loading}
                 statuses={this.state.statuses}
                 projects={this.state.projects}
                 users={this.state.users}
                 companies={this.state.companies}
                 workTypes={this.state.workTypes}
                 taskTypes={this.state.taskTypes}
                 allTags={this.state.allTags}
                 units={this.state.units}
                 tripTypes={this.state.tripTypes}
                 milestones={this.state.milestones}
                 defaultUnit={this.state.defaultUnit}
                 newID = {this.state.newID}
                 closeModal={ () => this.setState({openAddTaskModal: false,})}
                 switch={() => this.switch()}
                 />
             }
					</ModalBody>
				</Modal>
		</div>
    );
  }
}

const mapStateToProps = ({userReducer, filterReducer, taskReducer, storageHelpStatuses, storageHelpProjects,storageUsers,storageCompanies,storageHelpWorkTypes,storageHelpUnits,storageHelpPrices,storageHelpPricelists,storageHelpTags,storageHelpTaskTypes, storageMetadata, storageHelpMilestones, storageHelpTripTypes }) => {
	const { project } = filterReducer;
	const { orderBy, ascending } = taskReducer;

  const { statusesLoaded ,statusesActive, statuses } = storageHelpStatuses;
  const { projectsLoaded ,projectsActive, projects } = storageHelpProjects;
  const { usersLoaded ,usersActive, users } = storageUsers;
  const { companiesLoaded ,companiesActive, companies } = storageCompanies;
  const { workTypesLoaded ,workTypesActive, workTypes } = storageHelpWorkTypes;
  const { unitsLoaded ,unitsActive, units } = storageHelpUnits;
  const { pricesLoaded ,pricesActive, prices } = storageHelpPrices;
  const { pricelistsLoaded ,pricelistsActive, pricelists } = storageHelpPricelists;
  const { tagsLoaded ,tagsActive, tags } = storageHelpTags;
  const { taskTypesLoaded ,taskTypesActive, taskTypes } = storageHelpTaskTypes;
  const { metadataLoaded ,metadataActive, metadata } = storageMetadata;
  const { milestonesLoaded, milestonesActive, milestones } = storageHelpMilestones;
  const { tripTypesActive, tripTypes, tripTypesLoaded } = storageHelpTripTypes;

	return { project, orderBy,ascending,currentUser:userReducer,
    statusesLoaded ,statusesActive, statuses,
    projectsLoaded ,projectsActive, projects,
    usersLoaded ,usersActive, users,
    companiesLoaded ,companiesActive, companies,
    workTypesLoaded ,workTypesActive, workTypes,
    unitsLoaded ,unitsActive, units,
    pricesLoaded ,pricesActive, prices,
    pricelistsLoaded ,pricelistsActive, pricelists,
    tagsLoaded ,tagsActive, tags,
    taskTypesLoaded ,taskTypesActive, taskTypes,
    metadataLoaded ,metadataActive, metadata,
    milestonesLoaded, milestonesActive, milestones,
		tripTypesActive, tripTypes, tripTypesLoaded,
  };
};

export default connect(mapStateToProps, { storageHelpStatusesStart, storageHelpProjectsStart, storageUsersStart, storageCompaniesStart, storageHelpWorkTypesStart, storageHelpUnitsStart, storageHelpPricesStart, storageHelpPricelistsStart, storageHelpTagsStart, storageHelpTaskTypesStart, storageMetadataStart, storageHelpMilestonesStart, storageHelpTripTypesStart})(TaskAddContainer);
