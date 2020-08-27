import React from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import {toSelArr, sameStringForms } from '../../helperFunctions';
import { Modal, ModalBody, Button } from 'reactstrap';
import TaskAdd from './taskAdd';
/*
import {
  storageHelpWorkTypesStart,
  storageHelpUnitsStart,
  storageMetadataStart,
  storageHelpMilestonesStart,
      } from '../../redux/actions';*/
import { noMilestone } from 'configs/constants/sidebar';

import { GET_TASK_TYPES } from 'helpdesk/settings/taskTypes';
import { GET_TRIP_TYPES } from 'helpdesk/settings/tripTypes';
import { GET_PRICELISTS } from 'helpdesk/settings/prices';

const GET_STATUSES = gql`
query {
  statuses {
    title
    id
    order
    color
    action
  }
}
`;

const GET_TAGS = gql`
query {
  tags {
    title
    id
    order
    color
  }
}
`;

const GET_PROJECTS = gql`
query {
  projects {
    title
    id
    lockedRequester
    projectRights {
			read
			write
			delete
			internal
			admin
			user {
				id
			}
		}
    def {
			assignedTo {
				def
				fixed
				show
				value {
					id
				}
			}
			company {
				def
				fixed
				show
				value {
					id
				}
			}
			overtime {
				def
				fixed
				show
				value
			}
			pausal {
				def
				fixed
				show
				value
			}
			requester {
				def
				fixed
				show
				value {
					id
				}
			}
			status {
				def
				fixed
				show
				value {
					id
				}
			}
			tag {
				def
				fixed
				show
				value {
					id
				}
			}
			taskType {
				def
				fixed
				show
				value {
					id
				}
			}
    }
  }
}
`;

const GET_COMPANIES = gql`
query {
  companies {
    title
    id
    dph
    taskWorkPausal
    pricelist {
      id
      title
      materialMargin
      prices {
        type
        price
        taskType {
          id
        }
        tripType {
          id
        }
      }
    }
  }
}
`;

const GET_USERS = gql`
query {
  users{
    id
    email
    role {
      level
    }
    company {
      id
    }
  }
}
`;

export default function TaskAddContainer (props){
  //data & queries
  const { history, match } = props;
  const { data: statusesData, loading: statusesLoading } = useQuery(GET_STATUSES);
  const { data: companiesData, loading: companiesLoading } = useQuery(GET_COMPANIES);
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS);
  const { data: taskTypesData, loading: taskTypesLoading } = useQuery(GET_TASK_TYPES);
  const { data: tripTypesData, loading: tripTypesLoading } = useQuery(GET_TRIP_TYPES);
  const { data: pricesData, loading: pricesLoading } = useQuery(GET_PRICELISTS);
  const { data: tagsData, loading: tagsLoading } = useQuery(GET_TAGS);
  const { data: projectsData, loading: projectsLoading } = useQuery(GET_PROJECTS);

  //state
  const [ hidden, setHidden ] = React.useState(false);
  const [ openAddTaskModal, setOpenAddTaskModal ] = React.useState(false);

  const [ newID, setNewID ] = React.useState(0); //ked budu tasky, toto bude max task.id + 1

  /*constructor(props){
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
  }*/
/*
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
    }*/

    const loading = statusesLoading  || companiesLoading || usersLoading || taskTypesLoading || tripTypesLoading || pricesLoading || tagsLoading || projectsLoading;

	  return (
			<div className="display-inline">
			{
				!props.task &&
				<Button
					className="btn sidebar-btn"
					onClick={() => {
            setOpenAddTaskModal(true);
            setHidden(false);
          }}
				>  Add task
				</Button>
			}

			{
				props.task &&
				<button
					type="button"
					className="btn btn-link-reversed waves-effect"
					disabled={props.disabled}
					onClick={()=> {
            setOpenAddTaskModal(true);
            setHidden(false);
          }}
          >
					<i
						className="far fa-copy"
						/> Copy
				</button>
			}


			<Modal isOpen={openAddTaskModal}  >
					<ModalBody className="scrollable" >
            {  openAddTaskModal && !loading &&
						   <TaskAdd {...props}
                 loading={loading}
                 statuses={ toSelArr(statusesData.statuses) }
                 projects={ toSelArr(projectsData.projects) }
                 users={ usersData ? toSelArr(usersData.users, 'email') : [] }
                 companies={ toSelArr(companiesData.companies) }
                 workTypes={[]}
                 taskTypes={ toSelArr(taskTypesData.taskTypes) }
                 allTags={ toSelArr(tagsData.tags) }
                 units={[]}
                 tripTypes={ toSelArr(tripTypesData.tripTypes) }
                 milestones={[noMilestone]}
                 defaultUnit={null}
                 newID = {newID}
                 closeModal={ () => setOpenAddTaskModal(false)}
                 />
             }
					</ModalBody>
				</Modal>
		</div>
    );
  }

/*
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
*/
