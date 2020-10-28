import React from 'react';
import {
  useMutation,
  useQuery,
  useLazyQuery
} from "@apollo/client";
import { gql } from '@apollo/client';;

import Select from 'react-select';
import {
  Label,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Modal,
  ModalBody,
  ModalHeader,
  ListGroup,
  ListGroupItem
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';
//import CKEditor4 from 'ckeditor4-react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import Attachments from '../components/attachments.js';
import Comments from '../components/comments.js';
//import Subtasks from '../components/subtasks';
import Repeat from '../components/repeat';

import VykazyTable from '../components/vykazyTable';

import UserAdd from '../settings/users/userAdd';
import CompanyAdd from '../settings/companies/companyAdd';

import Loading from 'components/loading';

import TaskAdd from './taskAddContainer';
import TaskPrint from './taskPrint';
import classnames from "classnames";
import ck5config from 'configs/components/ck5config';

import datePickerConfig from 'configs/components/datepicker';
import PendingPicker from '../components/pendingPicker';
import {
  toSelArr,
  toSelItem,
  timestampToString,
  orderArr
} from '../../helperFunctions';
import {
  invisibleSelectStyleNoArrow,
  invisibleSelectStyleNoArrowColored,
  invisibleSelectStyleNoArrowColoredRequired,
  invisibleSelectStyleNoArrowRequired
} from 'configs/components/select';
import booleanSelects from 'configs/constants/boolSelect';
import {
  noMilestone
} from 'configs/constants/sidebar';
import {
  noDef
} from 'configs/constants/projects';

const GET_MY_DATA = gql `
query {
  getMyData{
    id
    role {
			level
      accessRights {
				viewInternal
        projects
        publicFilters
      }
    }
  }
}
`;

const GET_TASK = gql `
query task($id: Int!){
	task(
		id: $id
	)  {
		id
		important
		title
		updatedAt
		createdAt
		closeDate
		assignedTo {
			id
			name
			surname
			email
		}
		company {
			id
			title
      dph
      usedTripPausal
      usedSubtaskPausal
      taskWorkPausal
      taskTripPausal
      monthly
      monthlyPausal
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
		createdBy {
			id
			name
			surname
		}
		deadline
		description
		milestone{
			id
			title
		}
		pendingDate
		project{
			id
			title
      milestones{
        id
        title
      }
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
		requester{
			id
			name
			surname
		}
		status {
			id
			title
			color
			action
		}
		tags {
			id
			title
			color
		}
		taskType {
			id
			title
		}
		repeat {
			repeatEvery
			repeatInterval
			startsAt
		}
		subtasks {
			id
			title
			order
			done
			quantity
			discount
			type {
				id
				title
			}
			assignedTo {
				id
				email
				company {
					id
				}
			}
		}
		workTrips {
			id
			order
			done
			quantity
			discount
			type {
				id
				title
			}
			assignedTo {
				id
				email
				company {
					id
				}
			}
		}
		materials {
			id
			title
			order
			done
			quantity
			margin
			price
		}
		customItems {
			id
			title
			order
			done
			quantity
			price
		}
		comments {
      id
      createdAt
      message
      childComments {
        id
        createdAt
        message
        user{
          id
          fullName
          email
        }
      }
		}
	}
}
`;
/*
internal
user {
  id
  fullName
  email
}
parentCommentId*/

const UPDATE_TASK = gql `
mutation updateTask($id: Int!, $important: Boolean, $title: String, $closeDate: String, $assignedTo: [Int], $company: Int, $deadline: String, $description: String, $milestone: Int, $overtime: Boolean, $pausal: Boolean, $pendingChangable: Boolean, $pendingDate: String, $project: Int, $requester: Int, $status: Int, $tags: [Int], $taskType: Int, $repeat: RepeatInput ) {
  updateTask(
		id: $id,
		important: $important,
    title: $title,
    closeDate: $closeDate,
    assignedTo: $assignedTo,
    company: $company,
    deadline: $deadline,
    description: $description,
    milestone: $milestone,
    overtime: $overtime,
    pausal: $pausal,
    pendingChangable: $pendingChangable,
    pendingDate: $pendingDate,
    project: $project,
    requester: $requester,
    status: $status,
    tags: $tags,
    taskType: $taskType,
    repeat: $repeat,
  ){
    id
    title
  }
}
`;

export const DELETE_TASK = gql `
mutation deleteTask($id: Int!) {
  deleteTask(
    id: $id,
  ){
    id
  }
}
`;


export const UPDATE_PROJECT_RIGHTS = gql `
mutation updateProject($id: Int!, $projectRights: [ProjectRightInput]) {
  updateProject(
		id: $id,
    projectRights: $projectRights,
  ){
		title
    id
    lockedRequester
    milestones{
      id
      title
    }
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

const ADD_SUBTASK = gql `
mutation addSubtask($title: String!, $order: Int!, $done: Boolean!, $quantity: Float!, $discount: Float!, $type: Int!, $task: Int!, $assignedTo: Int!) {
  addSubtask(
    title: $title,
		order: $order,
		done: $done,
		quantity: $quantity,
		discount: $discount,
		type: $type,
		task: $task,
		assignedTo: $assignedTo,
  ){
    id
  }
}
`;

const UPDATE_SUBTASK = gql `
mutation updateSubtask($id: Int!, $title: String, $order: Int, $done: Boolean, $quantity: Float, $discount: Float, $type: Int, $assignedTo: Int) {
  updateSubtask(
		id: $id,
    title: $title,
		order: $order,
		done: $done,
		quantity: $quantity,
		discount: $discount,
		type: $type,
		assignedTo: $assignedTo,
  ){
    id
    title
  }
}
`;

export const DELETE_SUBTASK = gql `
mutation deleteSubtask($id: Int!) {
  deleteSubtask(
    id: $id,
  ){
    id
  }
}
`;


const ADD_WORKTRIP = gql `
mutation addWorkTrip($order: Int!, $done: Boolean!, $quantity: Float!, $discount: Float!, $type: Int!, $task: Int!, $assignedTo: Int!) {
  addWorkTrip(
		order: $order,
		done: $done,
		quantity: $quantity,
		discount: $discount,
		type: $type,
		task: $task,
		assignedTo: $assignedTo,
  ){
    id
  }
}
`;

const UPDATE_WORKTRIP = gql `
mutation updateWorkTrip($id: Int!, $order: Int, $done: Boolean, $quantity: Float, $discount: Float, $type: Int, $assignedTo: Int) {
  updateWorkTrip(
		id: $id,
		order: $order,
		done: $done,
		quantity: $quantity,
		discount: $discount,
		type: $type,
		assignedTo: $assignedTo,
  ){
    id
  }
}
`;

export const DELETE_WORKTRIP = gql `
mutation deleteWorkTrip($id: Int!) {
  deleteWorkTrip(
    id: $id,
  ){
    id
  }
}
`;

const ADD_MATERIAL = gql `
mutation addMaterial($title: String!, $order: Int!, $done: Boolean!, $quantity: Float!, $margin: Float!, $price: Float!, $task: Int!) {
  addMaterial(
    title: $title,
		order: $order,
		done: $done,
		quantity: $quantity,
		margin: $margin,
		price: $price,
		task: $task,
  ){
    id
  }
}
`;

const UPDATE_MATERIAL = gql `
mutation updateMaterial($id: Int!, $title: String, $order: Int, $done: Boolean, $quantity: Float, $margin: Float, $price: Float) {
  updateMaterial(
		id: $id,
    title: $title,
		order: $order,
		done: $done,
		quantity: $quantity,
		margin: $margin,
		price: $price,
  ){
    id
    title
  }
}
`;

export const DELETE_MATERIAL = gql `
mutation deleteMaterial($id: Int!) {
  deleteMaterial(
    id: $id,
  ){
    id
  }
}
`;


const ADD_CUSTOM_ITEM = gql `
mutation addCustomItem($title: String!, $order: Int!, $done: Boolean!, $quantity: Float!, $price: Float!, $task: Int!) {
  addCustomItem(
    title: $title,
		order: $order,
		done: $done,
		quantity: $quantity,
		price: $price,
		task: $task,
  ){
    id
  }
}
`;

const UPDATE_CUSTOM_ITEM = gql `
mutation updateCustomItem($id: Int!, $title: String, $order: Int, $done: Boolean, $quantity: Float, $price: Float) {
  updateCustomItem(
		id: $id,
    title: $title,
		order: $order,
		done: $done,
		quantity: $quantity,
		price: $price,
  ){
    id
    title
  }
}
`;

export const DELETE_CUSTOM_ITEM = gql `
mutation deleteCustomItem($id: Int!) {
  deleteCustomItem(
    id: $id,
  ){
    id
  }
}
`;

const GET_PROJECTS = gql `
query {
  projects {
		id
		title
		milestones{
			id
			title
		}
		lockedRequester
		projectRights {
			read
			write
			delete
			internal
			admin
			user {
				id
				fullName
				email
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

const GET_USERS = gql `
query {
  users{
    id
    email
    username
    role {
      id
      title
    }
    company {
      id
      title
    }
  }
}
`;

const GET_STATUSES = gql `
query {
  statuses {
    title
    id
    order
  }
}
`;

const GET_COMPANIES = gql `
query {
 companies {
	 title
	 id
	 monthly
 }
}
`;

export default function TaskEdit( props ) {
  //data & queries
  const {
    match,
    history,
    columns,
    allTags,
    taskTypes,
    tripTypes,
    inModal,
    closeModal
  } = props;
  const [ getTask, {
    data: taskData,
    loading: taskLoading
  } ] = useLazyQuery( GET_TASK );
  const [ updateProjectRights ] = useMutation( UPDATE_PROJECT_RIGHTS );
  const [ updateTask /*, {client}*/ ] = useMutation( UPDATE_TASK );
  const [ deleteTask ] = useMutation( DELETE_TASK );
  const [ addSubtask ] = useMutation( ADD_SUBTASK );
  const [ updateSubtask ] = useMutation( UPDATE_SUBTASK );
  const [ deleteSubtask ] = useMutation( DELETE_SUBTASK );
  const [ addWorkTrip ] = useMutation( ADD_WORKTRIP );
  const [ updateWorkTrip ] = useMutation( UPDATE_WORKTRIP );
  const [ deleteWorkTrip ] = useMutation( DELETE_WORKTRIP );
  const [ addMaterial ] = useMutation( ADD_MATERIAL );
  const [ updateMaterial ] = useMutation( UPDATE_MATERIAL );
  const [ deleteMaterial ] = useMutation( DELETE_MATERIAL );
  const [ addCustomItem ] = useMutation( ADD_CUSTOM_ITEM );
  const [ updateCustomItem ] = useMutation( UPDATE_CUSTOM_ITEM );
  const [ deleteCustomItem ] = useMutation( DELETE_CUSTOM_ITEM );

  const {
    data: projectsData,
    loading: projectsLoading
  } = useQuery( GET_PROJECTS );
  const projects = ( projectsLoading || !projectsData ? [] : projectsData.projects );

  const {
    data: usersData,
    loading: usersLoading
  } = useQuery( GET_USERS );
  const users = ( usersLoading || !usersData ? [] : usersData.users );

  const {
    data: statusesData,
    loading: statusesLoading
  } = useQuery( GET_STATUSES );
  const statuses = ( statusesLoading || !statusesData ? [] : orderArr( statusesData.statuses ) );

  const {
    data: companiesData,
    loading: companiesLoading
  } = useQuery( GET_COMPANIES );
  const companies = ( companiesLoading || !companiesData ? [] : orderArr( companiesData.companies ) );

  const {
    data: myData,
    loading: myDataLoading
  } = useQuery( GET_MY_DATA );
  const currentUser = myDataLoading && myData ? myData.getMyData : {};
  const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};

  //state
  const [ layout, setLayout ] = React.useState( 1 );

  const [ defaultFields, setDefaultFields ] = React.useState( noDef );

  const [ attachments, setAttachments ] = React.useState( [] );
  const [ assignedTo, setAssignedTo ] = React.useState( [] );
  const [ createdBy, setCreatedBy ] = React.useState( null );
  const [ createdAt, setCreatedAt ] = React.useState( null );
  const [ closeDate, setCloseDate ] = React.useState( null );
  const [ comments, setComments ] = React.useState( [] );
  const [ company, setCompany ] = React.useState( null );
  const [ customItems, setCustomItems ] = React.useState( [] );
  const [ deadline, setDeadline ] = React.useState( null );
  const [ description, setDescription ] = React.useState( "" );
  const [ important, setImportant ] = React.useState( false );
  const [ materials, setMaterials ] = React.useState( [] );
  const [ milestone, setMilestone ] = React.useState( [ noMilestone ] );
  const [ overtime, setOvertime ] = React.useState( booleanSelects[ 0 ] );
  const [ openUserAdd, setOpenUserAdd ] = React.useState( false );
  const [ openCompanyAdd, setOpenCompanyAdd ] = React.useState( false );
  const [ pausal, setPausal ] = React.useState( booleanSelects[ 0 ] );
  const [ pendingChangable, setPendingChangable ] = React.useState( false );
  const [ pendingDate, setPendingDate ] = React.useState( null );
  const [ pendingOpen, setPendingOpen ] = React.useState( false );
  const [ project, setProject ] = React.useState( null );
  const [ projectChangeDate, setProjectChangeDate ] = React.useState( false );
  const [ repeat, setRepeat ] = React.useState( null );
  const [ requester, setRequester ] = React.useState( null );
  const [ saving, setSaving ] = React.useState( false );
  const [ status, setStatus ] = React.useState( null );
  const [ statusChange, setStatusChange ] = React.useState( false );
  const [ showDescription, setShowDescription ] = React.useState( false );
  const [ subtasks, setSubtasks ] = React.useState( [] );
  const [ tags, setTags ] = React.useState( [] );
  const [ taskHistory ] = React.useState( [] );
  const [ taskType, setTaskType ] = React.useState( null );
  const [ taskTripPausal, setTaskTripPausal ] = React.useState( 0 );
  const [ taskWorkPausal, setTaskWorkPausal ] = React.useState( 0 );
  const [ title, setTitle ] = React.useState( "" );
  const [ toggleTab, setToggleTab ] = React.useState( 1 );
  const [ usedSubtaskPausal, setUsedSubtaskPausal ] = React.useState( 0 );
  const [ usedTripPausal, setUsedTripPausal ] = React.useState( 0 );
  const [ workTrips, setWorkTrips ] = React.useState( [] );

  const [ viewOnly, setViewOnly ] = React.useState( true );

  // sync
  React.useEffect( () => {
    if ( !taskLoading && taskData ) {
      setAssignedTo( toSelArr( taskData.task.assignedTo, 'email' ) );
      setCloseDate( timestampToString( parseInt( taskData.task.closeDate ) ) );
      setComments( taskData.task.comments );
      setCompany( ( taskData.task.company ? {
        ...taskData.task.company,
        value: taskData.task.company.id,
        label: taskData.task.company.title
      } : null ) );
      setCreatedBy( taskData.task.createdBy );
      setCreatedAt( taskData.task.createdAt );
      setDeadline( taskData.task.deadline ? timestampToString( parseInt( taskData.task.deadline ) ) : null );
      setDescription( taskData.task.description );
      setImportant( taskData.task.important );
      //setInvoicedDate( timestampToString(parseInt(taskData.task.invoicedDate)) );
      const pro = ( taskData.task.project ? {
        ...taskData.task.project,
        value: taskData.task.project.id,
        label: taskData.task.project.title
      } : null );
      setMilestone( pro && pro.milestone ? {
        ...pro.milestone,
        value: pro.milestone.id,
        label: pro.milestone.title
      } : noMilestone );
      setOvertime( ( taskData.task.overtime ? booleanSelects[ 1 ] : booleanSelects[ 0 ] ) );
      setPausal( ( taskData.task.pausal ? booleanSelects[ 1 ] : booleanSelects[ 0 ] ) );
      setPendingChangable( taskData.task.pendingChangable );
      setPendingDate( timestampToString( parseInt( taskData.task.pendingDate ) ) );
      setProject( pro );
      //	setReminder(taskData.task.reminder);
      setRepeat( taskData.task.repeat );
      setRequester( ( taskData.task.requester ? {
        ...taskData.task.requester,
        value: taskData.task.requester.id,
        label: `${taskData.task.requester.name} ${taskData.task.requester.surname}`
      } : null ) );
      const sta = ( taskData.task.status ? toSelItem( taskData.task.status ) : null )
      setStatus( sta );
      setTags( taskData.task.tags ? toSelArr( taskData.task.tags ) : [] );
      setTaskType( ( taskData.task.taskType ? {
        ...taskData.task.taskType,
        value: taskData.task.taskType.id,
        label: taskData.task.taskType.title
      } : null ) );
      setTaskTripPausal( taskData.task.company ? taskData.task.company.taskTripPausal : 0 );
      setTaskWorkPausal( taskData.task.company ? taskData.task.company.taskWorkPausal : 0 );
      setTitle( taskData.task.title );
      setCustomItems( taskData.task.customItems );
      setMaterials( taskData.task.materials );
      setSubtasks( ( taskData.task.subtasks ? taskData.task.subtasks.map( item => ( {
        ...item,
        assignedTo: toSelItem( item.assignedTo, 'email' ),
        type: toSelItem( item.type )
      } ) ) : [] ) );
      setUsedSubtaskPausal( taskData.task.company ? taskData.task.company.usedSubtaskPausal : 0 );
      setUsedTripPausal( taskData.task.company ? taskData.task.company.usedTripPausal : 0 );
      setWorkTrips( ( taskData.task.workTrips ? taskData.task.workTrips.map( item => ( {
        ...item,
        assignedTo: toSelItem( item.assignedTo, 'email' ),
        type: toSelItem( item.type )
      } ) ) : [] ) );

      if ( pro && currentUser !== {} ) {
        setDefaults( pro );
        const userRights = pro ? pro.projectRights.find( r => r.user.id === currentUser.id ) : {};
        if ( sta && sta.action === 'Invoiced' && inModal && userRights && userRights.admin ) {
          setViewOnly( false );
        } else {
          setViewOnly( ( sta && sta.action === 'Invoiced' ) || ( userRights && !userRights.admin && !userRights.write ) );
        }
      }
    }
  }, [ taskLoading ] );

  React.useEffect( () => {
    getTask( {
      variables: {
        id: parseInt( match.params.taskID )
      }
    } );
  }, [ match.params.taskID ] );

  React.useEffect( () => {
    if ( important ) {
      updateTaskFunc( [ "important" ] );
    }
  }, [ important ] );

  React.useEffect( () => {
    if ( title ) {
      updateTaskFunc( [ "title" ] );
    }
  }, [ title ] );

  React.useEffect( () => {
    if ( closeDate ) {
      updateTaskFunc( [ "closeDate" ] );
    }
  }, [ closeDate ] );

  React.useEffect( () => {
    if ( assignedTo ) {
      updateTaskFunc( [ "assignedTo" ] );
    }
  }, [ assignedTo ] );

  React.useEffect( () => {
    if ( attachments ) {
      updateTaskFunc( [ "attachments" ] );
    }
  }, [ attachments ] );

  React.useEffect( () => {
    if ( company ) {
      updateTaskFunc( [ "company" ] );
    }
  }, [ company ] );

  React.useEffect( () => {
    if ( deadline ) {
      updateTaskFunc( [ "deadline" ] );
    }
  }, [ deadline ] );

  React.useEffect( () => {
    if ( description ) {
      updateTaskFunc( [ "description" ] );
    }
  }, [ description ] );

  React.useEffect( () => {
    if ( milestone ) {
      updateTaskFunc( [ "milestone" ] );
    }
  }, [ milestone ] );

  React.useEffect( () => {
    if ( overtime ) {
      updateTaskFunc( [ "overtime" ] );
    }
  }, [ overtime ] );

  React.useEffect( () => {
    if ( pausal ) {
      updateTaskFunc( [ "pausal" ] );
    }
  }, [ pausal ] );

  React.useEffect( () => {
    if ( pendingChangable ) {
      updateTaskFunc( [ "pendingChangable" ] );
    }
  }, [ pendingChangable ] );

  React.useEffect( () => {
    if ( pendingDate ) {
      updateTaskFunc( [ "pendingDate" ] );
    }
  }, [ pendingDate ] );

  React.useEffect( () => {
    if ( project ) {
      updateTaskFunc( [ "project" ] );
    }
  }, [ project ] );

  React.useEffect( () => {
    if ( requester ) {
      updateTaskFunc( [ "requester" ] );
    }
  }, [ requester ] );

  React.useEffect( () => {
    if ( status ) {
      updateTaskFunc( [ "status" ] );
    }
  }, [ status ] );

  React.useEffect( () => {
    if ( tags ) {
      updateTaskFunc( [ "tags" ] );
    }
  }, [ tags ] );

  React.useEffect( () => {
    if ( taskType ) {
      updateTaskFunc( [ "taskType" ] );
    }
  }, [ taskType ] );

  React.useEffect( () => {
    if ( repeat ) {
      updateTaskFunc( [ "repeat" ] );
    }
  }, [ repeat ] );

  const deleteTaskFunc = () => {
    if ( window.confirm( "Are you sure?" ) ) {
      deleteTask( {
          variables: {
            id: parseInt( match.params.taskID ),
          }
        } )
        .then( ( response ) => {
          if ( inModal ) {
            closeModal();
          } else {
            history.goBack();
            history.push( match.url.substring( 0, match.url.length - match.params.taskID.length ) );
          }
        } )
        .catch( ( err ) => {
          console.log( err.message );
          console.log( err );
        } );
    }
  }

  const updateProjectRightsFunc = ( user ) => {
    const newProjectRights = project.projectRights.map( item => ( {
      read: item.read,
      write: item.write,
      delete: item.delete,
      internal: item.internal,
      admin: item.admin,
      user: item.user.id
    } ) );
    const newUser = {
      read: true,
      write: false,
      delete: false,
      internal: false,
      admin: false,
      user: user.id
    }
    updateProjectRights( {
        variables: {
          id: project.id,
          projectRights: [ ...newProjectRights, newUser ],
        }
      } )
      .then( ( response ) => {} )
      .catch( ( err ) => {
        console.log( err.message );
      } );
  }

  const cannotSave = () => {
    return title === "" || status === null || project === null || assignedTo === [] || saving || viewOnly;
  }

  const updateTaskFunc = ( what ) => {
    if ( cannotSave() ) {
      return;
    }
    setSaving( true );

    let variables = {
      id: parseInt( match.params.taskID )
    };

    for ( var i = 0; i < what.length; i++ ) {
      switch ( what[ i ] ) {
        case "important":
          variables = {
            ...variables,
            important
          };
          break;
        case "title":
          variables = {
            ...variables,
            title
          };
          break;
        case "closeDate":
          variables = {
            ...variables,
            closeDate: ( closeDate !== null && ( status.action === 'CloseDate' || status.action === 'Invoiced' || status.action === 'CloseInvalid' ) ) ? closeDate.unix()
              .toString() : null
          };
          break;
        case "assignedTo":
          variables = {
            ...variables,
            assignedTo: assignedTo.map( ( item ) => item.id )
          };
          break;
        case "company":
          variables = {
            ...variables,
            company: company ? company.id : null
          };
          break;
        case "deadline":
          variables = {
            ...variables,
            deadline: deadline !== null ? deadline.unix()
              .toString() : null
          };
          break;
        case "description":
          variables = {
            ...variables,
            description
          };
          break;
        case "milestone":
          variables = {
            ...variables,
            milestone: ( milestone.id === null || milestone.id === -1 ? null : milestone.id ),
          };
          break;
        case "overtime":
          variables = {
            ...variables,
            overtime: overtime.value
          };
          break;
        case "pausal":
          variables = {
            ...variables,
            pausal: pausal.value
          };
          break;
        case "pendingChangable":
          variables = {
            ...variables,
            pendingChangable
          };
          break;
        case "pendingDate":
          variables = {
            ...variables,
            pendingDate: ( pendingDate !== null && status.action === 'PendingDate' ) ? pendingDate.unix()
              .toString() : null
          };
          break;
        case "project":
          variables = {
            ...variables,
            project: project ? project.id : null
          };
          break;
        case "requester":
          variables = {
            ...variables,
            requester: requester ? requester.id : null
          };
          break;
        case "status":
          variables = {
            ...variables,
            status: status ? status.id : null
          };
          break;
        case "tags":
          variables = {
            ...variables,
            tags: tags.map( ( item ) => item.id )
          };
          break;
        case "taskType":
          variables = {
            ...variables,
            taskType: taskType ? taskType.id : null
          };
          break;
        case "repeat":
          variables = {
            ...variables,
            repeat: repeat
          };
          break;
        default:
          console.log( "impossible", what[ i ] );
      }
    }

    updateTask( {
        variables
      } )
      .then( ( response ) => {} )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  }

  const addSubtaskFunc = ( sub ) => {
    if ( cannotSave() ) {
      return;
    }
    setSaving( true );

    addSubtask( {
        variables: {
          title: sub.title,
          order: sub.order,
          done: sub.done,
          discount: sub.discount,
          quantity: sub.quantity,
          type: sub.type.id,
          task: parseInt( match.params.taskID ),
          assignedTo: sub.assignedTo.id,
        }
      } )
      .then( ( response ) => {
        console.log( response );
        setSubtasks( [ ...subtasks, {
          ...sub,
          id: response.data.addSubtask.id
        } ] );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  }

  const updateSubtaskFunc = ( sub ) => {
    if ( cannotSave() ) {
      return;
    }
    setSaving( true );

    updateSubtask( {
        variables: {
          id: sub.id,
          title: sub.title,
          order: sub.order,
          done: sub.done,
          discount: sub.discount,
          quantity: sub.quantity,
          type: sub.type.id,
          assignedTo: sub.assignedTo.id,
        }
      } )
      .then( ( response ) => {} )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  }

  const deleteSubtaskFunc = ( id ) => {
    deleteSubtask( {
        variables: {
          id,
        }
      } )
      .then( ( response ) => {} )
      .catch( ( err ) => {
        console.log( err.message );
        console.log( err );
      } );
  }

  const addWorkTripFunc = ( wt ) => {
    if ( cannotSave() ) {
      return;
    }
    setSaving( true );

    addWorkTrip( {
        variables: {
          order: wt.order,
          done: wt.done,
          discount: wt.discount,
          quantity: wt.quantity,
          type: wt.type.id,
          task: parseInt( match.params.taskID ),
          assignedTo: wt.assignedTo.id,
        }
      } )
      .then( ( response ) => {
        console.log( response );
        setWorkTrips( [ ...workTrips, {
          ...wt,
          id: response.data.addWorkTrip.id
        } ] );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  }

  const updateWorkTripFunc = ( item ) => {
    if ( cannotSave() ) {
      return;
    }
    setSaving( true );

    updateWorkTrip( {
        variables: {
          id: item.id,
          order: item.order,
          done: item.done,
          discount: item.discount,
          quantity: item.quantity,
          type: item.type.id,
          assignedTo: item.assignedTo.id,
        }
      } )
      .then( ( response ) => {} )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  }

  const deleteWorkTripFunc = ( id ) => {
    deleteWorkTrip( {
        variables: {
          id,
        }
      } )
      .then( ( response ) => {} )
      .catch( ( err ) => {
        console.log( err.message );
        console.log( err );
      } );
  }

  const addMaterialFunc = ( item ) => {
    if ( cannotSave() ) {
      return;
    }
    setSaving( true );
    addMaterial( {
        variables: {
          title: item.title,
          order: item.order,
          done: item.done,
          quantity: parseFloat( item.quantity ),
          margin: parseFloat( item.margin ),
          price: parseFloat( item.price ),
          task: parseInt( match.params.taskID ),
        }
      } )
      .then( ( response ) => {
        console.log( response );
        setMaterials( [ ...materials, {
          ...item,
          id: response.data.addMaterial.id
        } ] );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  }

  const updateMaterialFunc = ( item ) => {
    if ( cannotSave() ) {
      return;
    }
    setSaving( true );

    updateMaterial( {
        variables: {
          id: item.id,
          title: item.title,
          order: item.order,
          done: item.done,
          quantity: parseFloat( item.quantity ),
          margin: parseFloat( item.margin ),
          price: parseFloat( item.price ),
        }
      } )
      .then( ( response ) => {} )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  }

  const deleteMaterialFunc = ( id ) => {
    deleteMaterial( {
        variables: {
          id,
        }
      } )
      .then( ( response ) => {} )
      .catch( ( err ) => {
        console.log( err.message );
        console.log( err );
      } );
  }

  const addCustomItemFunc = ( item ) => {
    if ( cannotSave() ) {
      return;
    }
    setSaving( true );
    addCustomItem( {
        variables: {
          title: item.title,
          order: item.order,
          done: item.done,
          quantity: parseFloat( item.quantity ),
          price: parseFloat( item.price ),
          task: parseInt( match.params.taskID ),
        }
      } )
      .then( ( response ) => {
        console.log( response );
        setCustomItems( [ ...customItems, {
          ...item,
          id: response.data.addCustomItem.id
        } ] );
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  }

  const updateCustomItemFunc = ( item ) => {
    if ( cannotSave() ) {
      return;
    }
    setSaving( true );

    updateCustomItem( {
        variables: {
          id: item.id,
          title: item.title,
          order: item.order,
          done: item.done,
          quantity: parseFloat( item.quantity ),
          price: parseFloat( item.price ),
        }
      } )
      .then( ( response ) => {} )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  }

  const deleteCustomItemFunc = ( id ) => {
    deleteCustomItem( {
        variables: {
          id,
        }
      } )
      .then( ( response ) => {} )
      .catch( ( err ) => {
        console.log( err.message );
        console.log( err );
      } );
  }
  /*
  	const getHistoryMessage = (type, data) => {
  		let user = "Používateľ " + currentUser.userData.name + ' ' + currentUser.userData.surname;
  		switch (type) {
  			case 'status':{
  				return `${user} zmenil status z ${data.oldStatus?data.oldStatus.title:''} na ${data.newStatus?data.newStatus.title:''}.`;
  			}
  			case 'comment':{
  				return user + ' komentoval úlohu.';
  			}
  			default:{
  				return user + ' spravil nedefinovanú zmenu.';
  			}
  		}
  	}*/

  const setDefaults = ( projectID ) => {
    if ( projectID === null ) {
      setDefaultFields( noDef );
      return;
    }
    let pro = projects.find( ( p ) => p.id === projectID );
    if ( !pro ) {
      setDefaultFields( noDef );
      return;
    }
    setDefaultFields( {
      ...noDef,
      ...pro.def
    } );
  }

  const rights = project ? project.projectRights.find( r => r.user.id === currentUser.id ) : undefined;
  const userRights = rights === undefined ? {
    user: currentUser,
    read: false,
    write: false,
    delete: false,
    internal: false,
    isAdmin: false
  } : rights;

  const canAdd = userRights.write || userRights.isAdmin;
  const canDelete = userRights.delete || userRights.isAdmin;
  const canCopy = userRights.write || userRights.isAdmin || title === "" || status === null || project === null || saving;

  const availableProjects = projects.filter( ( p ) => {
    let userRights = p.projectRights.find( r => r.user.id === currentUser.id );
    if ( ( userRights && userRights.isAdmin ) || ( userRights && userRights.read ) || ( p.id === -1 || p.id === null ) ) {
      return true;
    } else {
      return false;
    }
  } );

  const USERS_WITH_PERMISSIONS = project && project.projectRights ? project.projectRights.map( ( right ) => right.user ) : [];

  const REQUESTERS = ( project && project.lockedRequester ? USERS_WITH_PERMISSIONS : users );

  const MILESTONES = [ noMilestone ].concat( ( project ? toSelArr( project.milestones.filter( ( m ) => m.id !== milestone.id ) ) : [] ) );

  const renderCommandbar = () => {
    return (
      <div className={classnames({"commandbar-small": columns}, {"commandbar": !columns}, { "p-l-25": true})}> {/*Commandbar*/}
				<div className={classnames("d-flex", "flex-row", "center-hor", {"m-b-10": columns})}>
					<div className="display-inline center-hor">
						{!columns &&
							<button type="button" className="btn btn-link-reversed waves-effect p-l-0" onClick={() => history.push(`/helpdesk/taskList/i/${match.params.listID}`)}>
								<i
									className="fas fa-arrow-left commandbar-command-icon"
									/>
							</button>
						}
						{ project &&
							<TaskAdd
								history={taskHistory}
								project={project.id}
								triggerDate={projectChangeDate}
								task={taskData.task}
								disabled={canCopy}
								/>
						}
					</div>
					<div className="ml-auto center-hor">
					{false &&	<TaskPrint
							match={match}
							taskID={match.params.taskID}
							createdBy={createdBy}
							createdAt={createdAt}
							taskWorks={subtasks}
							workTrips={workTrips}
							taskMaterials={materials}
							customItems={customItems}
							isLoaded={!taskLoading} />
					}
						{ canDelete &&
							<button
                type="button"
                disabled={!canDelete}
                className="btn btn-link-reversed waves-effect"
                onClick={deleteTaskFunc}>
								<i className="far fa-trash-alt" /> Delete
							</button>
						}
						<button
              type="button"
              style={{color: important ? '#ffc107' : '#0078D4'}}
              disabled={viewOnly}
              className="btn btn-link-reversed waves-effect" onClick={()=>{
								setImportant(!important);
							}}>
							<i className="far fa-star" /> Important
						</button>
					</div>
					<button
						type="button"
						className="btn btn-link-reversed waves-effect"
						onClick={() => setLayout(layout === 1 ? 2 : 1)}>
						Switch layout
					</button>
				</div>
			</div>
    )
  }

  const renderTitle = () => {
    return (
      <div className="d-flex p-2">
					<div className="row flex">
						<h2 className="center-hor text-extra-slim">{match.params.taskID}: </h2>
						<span className="center-hor flex m-r-15">
							<input type="text"
								disabled={viewOnly}
								value={title}
								className="task-title-input text-extra-slim hidden-input m-l-10"
								onChange={(e)=> {
									setTitle(e.target.value);
								}}
								placeholder="Enter task name" />
						</span>

						<div className="ml-auto center-hor">
							<p className="m-b-0 task-info">
								<span className="text-muted">
									{createdBy?"Created by ":""}
								</span>
								{createdBy? (createdBy.name + " " +createdBy.surname) :''}
								<span className="text-muted">
									{createdBy?' at ':'Created at '}
									{createdAt?(timestampToString(createdAt)):''}
								</span>
							</p>
							<p className="m-b-0">
								{ renderStatusDate() }
							</p>
						</div>
					</div>
				</div>
    );
  }

  const renderStatusDate = () => {
    if ( status && status.action === 'PendingDate' ) {
      return (
        <span className="text-muted task-info m-r--40">
						<span className="center-hor">
							Pending date:
						</span>
						<DatePicker
							className="form-control hidden-input"
							selected={pendingDate}
							disabled={!status || status.action!=='PendingDate'||viewOnly||!pendingChangable}
							onChange={ (date) => {
								setPendingDate(date);
							}}
							placeholderText="No pending date"
							{...datePickerConfig}
							/>
					</span>
      )
    }

    if ( status && ( status.action === 'CloseDate' || status.action === 'Invoiced' || status.action === 'CloseInvalid' ) ) {
      return (
        <span className="text-muted task-info m-r--40">
						<span className="center-hor">
							Closed at:
						</span>
						<DatePicker
							className="form-control hidden-input"
							selected={closeDate}
							disabled={!status || (status.action!=='CloseDate' && status.action!=='CloseInvalid')||viewOnly}
							onChange={date => {
								setCloseDate(date);
							}}
							placeholderText="No pending date"
							{...datePickerConfig}
							/>
					</span>
      )
    }
    return (
      <span className="task-info ">
					<span className="center-hor text-muted">
						{statusChange ? ('Status changed at ' + timestampToString(statusChange) ) : ""}
					</span>
				</span>
    )
  }


  //Value Change
  const changeProject = ( pro ) => {
    let permissionIDs = [];
    if ( pro.projectRights ) {
      permissionIDs = pro.projectRights.map( ( p ) => p.user.id );
    }
    let newAssignedTo = assignedTo.filter( ( user ) => permissionIDs.includes( user.id ) );
    setProject( pro );
    setAssignedTo( newAssignedTo );
    setProjectChangeDate( moment() );
    setMilestone( noMilestone );
    setDefaults( project.id );
  }

  const changeStatus = ( s ) => {
    if ( s.action === 'PendingDate' ) {
      //	setPendingStatus(s);
      setPendingOpen( true );
    } else if ( s.action === 'CloseDate' || s.action === 'Invalid' ) {
      setStatus( s );
      setStatusChange( moment() );
      setImportant( false );
      setCloseDate( moment() );
    } else {
      setStatus( s );
      setStatusChange( moment() );
    }
  }

  const changeMilestone = ( mile ) => {
    if ( status.action === 'PendingDate' ) {
      if ( mile.startsAt !== null ) {
        setMilestone( mile );
        setPendingDate( moment( mile.startsAt ) );
        setPendingChangable( false );
      } else {
        setMilestone( mile );
        setPendingChangable( false );
      }
    } else {
      setMilestone( mile );
    }
  }

  const changeRequester = ( req ) => {
    if ( req.id === -1 ) {
      setOpenUserAdd( true );
    } else {
      setRequester( req );
    }
  }

  const changeCompany = ( comp ) => {
    if ( comp.id === -1 ) {
      setOpenCompanyAdd( true );
    } else {
      setCompany( comp );
      setPausal( parseInt( comp.taskWorkPausal ) > 0 ? booleanSelects[ 1 ] : booleanSelects[ 0 ] );
    }
  }

  const renderSelectsLayout1 = () => {
    return (
      <div>
				<div className="col-lg-12">
					<div className="col-lg-4">
						<div className="row p-r-10">
							<Label className="col-3 col-form-label">Projekt</Label>
							<div className="col-9">
								<Select
									placeholder="Zadajte projekt"
									isDisabled={ viewOnly }
									value={ project }
									onChange={(e) => changeProject(e) }
									options={ availableProjects }
									styles={ invisibleSelectStyleNoArrowRequired }
									/>
							</div>
						</div>
					</div>
					{ defaultFields.assignedTo.show &&
						<div className="col-lg-8">
							<div className="row p-r-10">
								<Label className="col-1-5 col-form-label">Assigned</Label>
								<div className="col-10-5">
									<Select
										value={assignedTo}
										placeholder="Select"
										isMulti
										isDisabled={defaultFields.assignedTo.fixed||viewOnly}
										onChange={(users)=> {
                      if (users.find(u => u.id === -1)){
                        setOpenUserAdd(true);
                      } else {
  											setAssignedTo(users);
                      }
										}}
										options={
											( canAdd ? [{id:-1, title:'+ Add user',body:'add', label:'+ Add user',value:null}] : [])
											.concat(USERS_WITH_PERMISSIONS)
										}
										styles={invisibleSelectStyleNoArrowRequired}
										/>
								</div>
							</div>
						</div>
					}
				</div>

				<div className="hello">
					{ defaultFields.status.show &&
						<div className="display-inline">
							<Label className="col-form-label w-8">Status</Label>
								<div className="display-inline-block w-25 p-r-10">
									<Select
										placeholder="Status required"
										value={status}
										isDisabled={defaultFields.status.fixed || viewOnly}
										styles={invisibleSelectStyleNoArrowColoredRequired}
										onChange={(s) => changeStatus(s)}
										options={statuses.filter((status)=>status.action!=='Invoiced')}
										/>
								</div>
						</div>
					}
					{ defaultFields.taskType.show &&
						<div className="display-inline">
							<Label className="col-form-label w-8">Typ</Label>
								<div className="display-inline-block w-25 p-r-10">
									<Select
										placeholder="Zadajte typ"
										value={taskType}
										isDisabled={defaultFields.taskType.fixed||viewOnly}
										styles={invisibleSelectStyleNoArrowRequired}
										onChange={(type)=> {
                      setTaskType(type);
                  }}
										options={taskTypes}
										/>
								</div>
						</div>
					}
					<div className="display-inline">
						<Label className="col-form-label w-8">Milestone</Label>
						<div className="display-inline-block w-25 p-r-10">
							<Select
								isDisabled={viewOnly}
								value={milestone}
								onChange={(m) => changeMilestone(m)}
								options={MILESTONES}
								styles={invisibleSelectStyleNoArrow}
								/>
						</div>
					</div>
					{ defaultFields.requester.show &&
						<div className="display-inline">
							<Label className="col-form-label w-8">Zadal</Label>
							<div className="display-inline-block w-25 p-r-10">
								<Select
									placeholder="Zadajte žiadateľa"
									value={requester}
									isDisabled={defaultFields.requester.fixed || viewOnly}
									onChange={changeRequester}
									options={(canAdd?[{id:-1,title:'+ Add user',body:'add', label:'+ Add user',value:null}]:[]).concat(REQUESTERS)}
									styles={invisibleSelectStyleNoArrowRequired}
									/>
							</div>
						</div>
					}
					{ defaultFields.company.show &&
						<div className="display-inline">
							<Label className="col-form-label w-8">Firma</Label>
							<div className="display-inline-block w-25 p-r-10">
								<Select
									placeholder="Zadajte firmu"
									value={company}
									isDisabled={defaultFields.company.fixed || viewOnly}
									onChange={changeCompany}
									options={(canAdd ? [{id:-1,title:'+ Add company',body:'add', label:'+ Add company', value:null}] : [] ).concat(companies)}
									styles={invisibleSelectStyleNoArrowRequired}
									/>
							</div>
						</div>
					}
					{	defaultFields.pausal.show &&
						<div className="display-inline">
							<Label className="col-form-label w-8">Paušál</Label>
							<div className="display-inline-block w-25 p-r-10">
								<Select
									value={company && parseInt(company.taskWorkPausal) === 0 && pausal.value === false ? {...pausal, label: pausal.label + " (nezmluvný)"} : pausal }
									isDisabled={viewOnly || !company || parseInt(company.taskWorkPausal) === 0 || defaultFields.pausal.fixed}
									styles={invisibleSelectStyleNoArrowRequired}
									onChange={(pausal)=> {
										setPausal(pausal);
									}}
									options={booleanSelects}
									/>
							</div>
						</div>
					}
					<div className="display-inline">
						<Label className="col-form-label w-8">Deadline</Label>
						<div className="display-inline-block w-25 p-r-10">
							<DatePicker
								className="form-control hidden-input"
								selected={deadline}
								disabled={viewOnly}
								onChange={date => {
									setDeadline(date);
								}}
								placeholderText="No deadline"
								{...datePickerConfig}
								/>
						</div>
					</div>
		       <div className="display-inline">
						<Repeat
							disabled={viewOnly}
							taskID={match.params.taskID}
							repeat={repeat}
							submitRepeat={(r) => {
                setRepeat(r);
              }}
							deleteRepeat={()=> {
                setRepeat(null);
              }}
							columns={columns}
							/>
		        </div>
					{	defaultFields.overtime.show &&
						<div className="display-inline">
							<Label className="col-form-label w-8">Mimo PH</Label>
							<div className="display-inline-block w-25 p-r-10">
								<Select
									value={overtime}
									isDisabled={viewOnly || defaultFields.overtime.fixed}
									styles={invisibleSelectStyleNoArrowRequired}
									onChange={(overtime)=> {
										setOvertime(overtime);
									}}
									options={booleanSelects}
									/>
							</div>
						</div>
					}
				</div>
			</div>
    )
  }

  const renderSelectsLayout2 = () => {
    return (
      <div className={"task-edit-right" + (columns ? " w-250px" : "")} >
				<div>
					<Label className="col-form-label-2">Projekt</Label>
					<div className="col-form-value-2">
						<Select
							placeholder="Zadajte projekt"
              isDisabled={ viewOnly }
              value={ project }
              onChange={(e) => changeProject(e) }
              options={ availableProjects }
              styles={ invisibleSelectStyleNoArrowRequired }
							/>
					</div>
				</div>
				{ defaultFields.assignedTo.show &&
					<div>
						<Label className="col-form-label-2">Assigned</Label>
						<div className="col-form-value-2" style={{marginLeft: "-5px"}}>
							<Select
                value={assignedTo}
                placeholder="Select"
                isMulti
                isDisabled={defaultFields.assignedTo.fixed||viewOnly}
                onChange={(users)=> {
                  if (users.find(u => u.id === -1)){
                    setOpenUserAdd(true);
                  } else {
                    setAssignedTo(users);
                  }
                }}
                options={
                  ( canAdd ? [{id:-1, title:'+ Add user',body:'add', label:'+ Add user',value:null}] : [])
                  .concat(USERS_WITH_PERMISSIONS)
                }
								styles={invisibleSelectStyleNoArrowRequired}
								/>
						</div>
					</div>
				}
				{ defaultFields.status.show &&
					<div>
						<Label className="col-form-label-2">Status</Label>
						<div className="col-form-value-2">
							<Select
								placeholder="Status required"
                value={status}
                isDisabled={defaultFields.status.fixed || viewOnly}
                styles={invisibleSelectStyleNoArrowColoredRequired}
                onChange={(s) => changeStatus(s)}
                options={statuses.filter((status)=>status.action!=='Invoiced')}
								/>
						</div>
					</div>
				}
				{ defaultFields.taskType.show &&
					<div>
						<Label className="col-form-label-2">Typ</Label>
						<div className="col-form-value-2">
							<Select
								placeholder="Zadajte typ"
                value={taskType}
                isDisabled={defaultFields.taskType.fixed||viewOnly}
                styles={invisibleSelectStyleNoArrowRequired}
                onChange={(type)=> {
                  setTaskType(type);
              }}
                options={taskTypes}
								/>
						</div>
					</div>
				}
				<div>
					<Label className="col-form-label-2">Milestone</Label>
					<div className="col-form-value-2">
						<Select
              isDisabled={viewOnly}
              value={milestone}
              onChange={(m) => changeMilestone(m)}
              options={MILESTONES}
              styles={invisibleSelectStyleNoArrow}
              />
					</div>
				</div>
				{ defaultFields.tag.show &&
					<div style={{maxWidth:"250px"}}>
						<Label className="col-form-label-2">Tagy: </Label>
						<div className="col-form-value-2">
							<Select
								placeholder="Zvoľte tagy"
    						value={tags}
    						isMulti
    						onChange={(tags)=> {
                  setTags(tags);
                }}
    						options={allTags}
    						isDisabled={defaultFields.tag.fixed||viewOnly}
    						styles={invisibleSelectStyleNoArrowColored}
								/>
						</div>
					</div>
				}
				{ defaultFields.requester.show &&
					<div>
						<Label className="col-form-label-2">Zadal</Label>
						<div className="col-form-value-2">
							<Select
								placeholder="Zadajte žiadateľa"
                value={requester}
                isDisabled={defaultFields.requester.fixed || viewOnly}
                onChange={changeRequester}
                options={(canAdd?[{id:-1,title:'+ Add user',body:'add', label:'+ Add user',value:null}]:[]).concat(REQUESTERS)}
                styles={invisibleSelectStyleNoArrowRequired}
								/>
						</div>
					</div>
				}
				{ defaultFields.company.show &&
					<div>
						<Label className="col-form-label-2">Firma</Label>
						<div className="col-form-value-2">
							<Select
								placeholder="Zadajte firmu"
                value={company}
                isDisabled={defaultFields.company.fixed || viewOnly}
                onChange={changeCompany}
                options={(canAdd ? [{id:-1,title:'+ Add company',body:'add', label:'+ Add company', value:null}] : [] ).concat(companies)}
                styles={invisibleSelectStyleNoArrowRequired}
								/>
						</div>
					</div>
				}
				{	defaultFields.pausal.show &&
					<div>
						<label className="col-form-label m-l-7">Paušál</label>
						<div className="col-form-value-2">
							<Select
                value={company && parseInt(company.taskWorkPausal) === 0 && pausal.value === false ? {...pausal, label: pausal.label + " (nezmluvný)"} : pausal }
                isDisabled={viewOnly || !company || parseInt(company.taskWorkPausal) === 0 || defaultFields.pausal.fixed}
                styles={invisibleSelectStyleNoArrowRequired}
                onChange={(pausal)=> {
                  setPausal(pausal);
                }}
                options={booleanSelects}
								/>
						</div>
					</div>
				}
				<div>
					<Label className="col-form-label m-l-7">Deadline</Label>
					<div className="col-form-value-2" style={{marginLeft: "-1px"}}>
						<DatePicker
							className="form-control hidden-input"
              selected={deadline}
              disabled={viewOnly}
              onChange={date => {
                setDeadline(date);
              }}
							placeholderText="No deadline"
							{...datePickerConfig}
							/>
					</div>
				</div>
				<Repeat
          disabled={viewOnly}
          taskID={match.params.taskID}
          repeat={repeat}
          submitRepeat={(r) => {
            setRepeat(r);
          }}
          deleteRepeat={()=> {
            setRepeat(null);
          }}
          columns={columns}
					vertical={true}
					/>
				{	defaultFields.overtime.show &&
					<div>
						<label className="col-form-label-2">Mimo PH</label>
						<div className="col-form-value-2">
							<Select
                value={overtime}
                isDisabled={viewOnly || defaultFields.overtime.fixed}
                styles={invisibleSelectStyleNoArrowRequired}
                onChange={(overtime)=> {
                  setOvertime(overtime);
                }}
                options={booleanSelects}
								/>
						</div>
					</div>
				}
			</div>
    );
  }


  const renderTags = () => {
    return (
      <div className="row m-t-10">
				<div className="center-hor">
					<Label className="center-hor">Tagy: </Label>
				</div>
				<div className="f-1 ">
					<Select
						placeholder="Zvoľte tagy"
						value={tags}
						isMulti
						onChange={(tags)=> {
              setTags(tags);
            }}
						options={allTags}
						isDisabled={defaultFields.tag.fixed||viewOnly}
						styles={invisibleSelectStyleNoArrowColored}
						/>
				</div>
			</div>
    )
  }

  const renderPopis = () => {
    let RenderDescription = null;
    if ( viewOnly ) {
      if ( description.length !== 0 ) {
        RenderDescription = <div className="task-edit-popis" dangerouslySetInnerHTML={{__html:description }} />
      } else {
        RenderDescription = <div className="task-edit-popis">Úloha nemá popis</div>
      }
    } else {
      if ( showDescription ) {
        RenderDescription = <div onClick={()=> setShowDescription(true)}>
					<CKEditor
						editor={ ClassicEditor }
						data={description}
						onInit={(editor) => {
							editor.editing.view.document.on( 'keydown', ( evt, data ) => {
								if ( data.keyCode === 27 ) {
									setShowDescription(false);
									data.preventDefault();
									evt.stop();
								}
							});
						}}
						onChange={(e,editor)=>{
              setDescription(editor.getData());
						}}
						config={ck5config}
						/>
				</div>
      } else {
        RenderDescription = <div className="clickable task-edit-popis" onClick={()=>setShowDescription(true)}>
					<div dangerouslySetInnerHTML={{__html:description }} />
					<span className="text-highlight"> <i	className="fas fa-pen"/> edit </span>
				</div>
      }
    }
    return (
      <div style={{zIndex: "9999"}}>
				<div>
				<Label className="col-form-label m-t-10 m-r-20">Popis úlohy</Label>
				{ company && company.monthlyPausal &&
					<span> {`Pausal subtasks:`}
						<span className={classnames( {"warning-general": (usedSubtaskPausal > taskWorkPausal)} )}>
							{` ${usedSubtaskPausal}`}
						 </span>
						{` / ${taskWorkPausal} Pausal trips:`}
						 <span className={classnames( {"warning-general": (usedTripPausal > taskTripPausal)} )} >
							 {` ${usedTripPausal}`}
						 </span>
						 {` / ${taskTripPausal}`}
				  </span>
				}
				</div>
				{RenderDescription}
			</div>
    )
  }


  const renderAttachments = () => {
    return (
      <Attachments
				disabled={viewOnly}
				taskID={match.params.taskID}
				attachments={attachments}
				addAttachments={(newAttachments)=>{
					let time = moment().unix();
					newAttachments = newAttachments.map((attachment)=>{
						return {
							title:attachment.name,
							size:attachment.size,
							time,
							data:attachment
						}
					});
					setAttachments([...attachments, ...newAttachments]);
				}}
				removeAttachment={(attachment)=>{
					let newAttachments = [...attachments];
					newAttachments.splice(newAttachments.findIndex((item)=>item.title===attachment.title && item.size===attachment.size && item.time===attachment.time),1);
					setAttachments([...newAttachments]);
				}}
				/>
    )
  }

  const renderModalUserAdd = () => {
    return (
      <Modal isOpen={openUserAdd} >
				<ModalHeader>
					Add user
				</ModalHeader>
				<ModalBody>
					<UserAdd
						closeModal={() => setOpenUserAdd(false)}
						addUserToList={(user) => {
							updateProjectRightsFunc(user);
			/*				let newUsers = users.concat([user]);
							this.setState({
								users: newUsers,
							})*/
						}}
						/>
				</ModalBody>
			</Modal>
    )
  }

  const renderModalCompanyAdd = () => {
    return (
      <Modal isOpen={openCompanyAdd}>
				<ModalBody>
					<CompanyAdd
						closeModal={() => setOpenCompanyAdd(false)}
						addCompanyToList={(company) => {
			/*				let newCompanies = this.state.companies.concat([company]);
							this.setState({
								companies: newCompanies,
							})*/
						}}
						/>
				</ModalBody>
			</Modal>
    )
  }


  const renderPendingPicker = () => {
    return (
      <PendingPicker
				open={pendingOpen}
				prefferedMilestone={milestone}
				milestones={ (project ? toSelArr( project.milestones.filter((m)=> m.id !== milestone.id && milestone.startsAt!==null) ) : []) }
				closeModal={()=>setPendingOpen(false)}
				savePending={(pending)=>{
					/*
					database.collection('help-calendar_events').where("taskID", "==", parseInt(this.props.match.params.taskID)).get()
					.then((data)=>{
					snapshotToArray(data).forEach((item)=>rebase.removeDoc('/help-calendar_events/'+item.id));
					});
					this.setState({
						pendingOpen:false,
						pendingStatus:null,
						status:this.state.pendingStatus,
						pendingDate:pending.milestoneActive?moment(pending.milestone.startsAt):pending.pendingDate,
						milestone:pending.milestoneActive?pending.milestone:this.state.milestone,
						pendingChangable:!pending.milestoneActive,
						statusChange:(new Date().getTime()),
					},this.submitTask.bind(this))*/
				}}
				/>
    )
  }

  const renderVykazyTable = () => {
    return (
      <VykazyTable
				showColumns={ (viewOnly ? [0,1,2,3,4,5,6,7] : [0,1,2,3,4,5,6,7,8]) }
				showTotals={false}
				disabled={viewOnly}
				company={company}
				match={match}
				taskID={match.params.taskID}
				taskAssigned={assignedTo}

				showSubtasks={project ? project.showSubtasks : false}

				submitService={(newService) => {
					addSubtaskFunc(newService);
        }}
				subtasks={subtasks ? subtasks : []}
				defaultType={taskType}
        taskTypes={taskTypes}
				updateSubtask={(id,newData)=>{
          let newSubtasks=[...subtasks];
          newSubtasks[newSubtasks.findIndex((item)=>item.id===id)]={...newSubtasks.find((item)=>item.id===id),...newData};
          setSubtasks(newSubtasks);
					updateSubtaskFunc({...newSubtasks.find((item)=>item.id===id),...newData});
				}}
				updateSubtasks={(multipleSubtasks)=>{
          let newSubtasks=[...subtasks];
          multipleSubtasks.forEach(({id, newData})=>{
            newSubtasks[newSubtasks.findIndex((item)=>item.id===id)]={...newSubtasks.find((item)=>item.id===id),...newData};
						updateSubtaskFunc({...newSubtasks.find((item)=>item.id===id),...newData});
          });
          setSubtasks(newSubtasks);
				}}
				removeSubtask={(id)=>{
          let newSubtasks=[...subtasks];
          newSubtasks.splice(newSubtasks.findIndex((item)=>item.id===id),1);
          setSubtasks(newSubtasks);
      		deleteSubtaskFunc(id);
				}}
				workTrips={workTrips ? workTrips : []}
				tripTypes={tripTypes ? tripTypes : []}
        submitTrip={(newTrip)=>{
      		addWorkTripFunc(newTrip);
        }}
				updateTrip={(id,newData)=>{
          let newTrips=[...workTrips];
          newTrips[newTrips.findIndex((trip)=>trip.id===id)]={...newTrips.find((trip)=>trip.id===id),...newData};
          setWorkTrips(newTrips);
      		updateWorkTripFunc({...newTrips.find((trip)=>trip.id===id),...newData});
				}}
				updateTrips={(multipleTrips)=>{
          let newTrips=[...workTrips];
          multipleTrips.forEach(({id, newData})=>{
            newTrips[newTrips.findIndex((trip)=>trip.id===id)]={...newTrips.find((trip)=>trip.id===id),...newData};
	      		updateWorkTripFunc({...newTrips.find((trip)=>trip.id===id),...newData});
          });
          setWorkTrips(newTrips);
				}}
				removeTrip={(id)=>{
          let newTrips=[...workTrips];
          newTrips.splice(newTrips.findIndex((trip)=>trip.id===id),1);
          setWorkTrips(newTrips);
      		deleteWorkTripFunc(id);
				}}

				materials={materials ? materials : []}
        submitMaterial={(newMaterial)=>{
      		addMaterialFunc(newMaterial);
        }}
				updateMaterial={(id,newData)=>{
          let newMaterials=[...materials];
          newMaterials[newMaterials.findIndex((material)=>material.id===id)]={...newMaterials.find((material)=>material.id===id),...newData};
          setMaterials(newMaterials);
      		updateMaterialFunc({...newMaterials.find((material)=>material.id===id),...newData});
				}}
				updateMaterials={(multipleMaterials)=>{
          let newMaterials=[...materials];
          multipleMaterials.forEach(({id, newData})=>{
            newMaterials[newMaterials.findIndex((material)=>material.id===id)]={...newMaterials.find((material)=>material.id===id),...newData};
	      		updateMaterialFunc({...newMaterials.find((material)=>material.id===id),...newData});
          });
          setMaterials(newMaterials);
				}}
				removeMaterial={(id)=>{
          let newMaterials=[...materials];
          newMaterials.splice(newMaterials.findIndex((taskMaterial)=>taskMaterial.id===id),1);
          setMaterials(newMaterials);
      		deleteMaterialFunc(id);
				}}
				customItems={customItems ? customItems : [] }
        submitCustomItem={(customItem)=>{
					addCustomItemFunc(customItem);
        }}
				updateCustomItem={(id,newData)=>{
          let newCustomItems=[...customItems];
          newCustomItems[newCustomItems.findIndex((customItem)=>customItem.id===id)]={...newCustomItems.find((customItem)=>customItem.id===id),...newData};
          setCustomItems(newCustomItems);
      		updateCustomItemFunc({...newCustomItems.find((customItem)=>customItem.id===id),...newData});
				}}
				updateCustomItems={(multipleCustomItems)=>{
          let newCustomItems=[...customItems];
          multipleCustomItems.forEach(({id, newData})=>{
            newCustomItems[newCustomItems.findIndex((customItem)=>customItem.id===id)]={...newCustomItems.find((customItem)=>customItem.id===id),...newData};
	      		updateCustomItemFunc({...newCustomItems.find((customItem)=>customItem.id===id),...newData});
          });
          setCustomItems(newCustomItems);
				}}
				removeCustomItem={(id)=>{
          let newCustomItems=[...customItems];
          newCustomItems.splice(newCustomItems.findIndex((customItem)=>customItem.id===id),1);
          setCustomItems(newCustomItems);
      		deleteCustomItemFunc();
				}}
				units={[]}
				defaultUnit={null}
				/>
    )
  }

  const renderComments = () => {
    return (
      <div className="comments">
				<Nav tabs className="b-0 m-b-22 m-l--10 m-t-15">
					<NavItem>
						<NavLink
							className={classnames({ active: toggleTab === 1}, "clickable", "")}
							onClick={() => setToggleTab(1) }
							>
							Komentáre
						</NavLink>
					</NavItem>
					<NavItem>
						<NavLink>
							|
						</NavLink>
					</NavItem>
					{ currentUser.role === 0 &&
						<NavItem>
							<NavLink
								className={classnames({ active: toggleTab === 2 }, "clickable", "")}
								onClick={() => setToggleTab(2) }
								>
								História
							</NavLink>
						</NavItem>
					}
				</Nav>

				<TabContent activeTab={toggleTab}>
					<TabPane tabId={1}>
						<Comments
							id={parseInt(match.params.taskID)}
							comments={comments}
							showInternal={accessRights.viewInternal || currentUser.role === 0 }
							users={users}
							setComments={setComments}
							addToHistory={(internal)=>{
					/*			let event = {
									message: getHistoryMessage('comment'),
									createdAt: moment(),
									task: parseInt(match.params.taskID)
								}*/
		//						this.addNotification(event,internal);
							}}
							/>
					</TabPane>
					{	currentUser.role === 0 &&
						<TabPane tabId={2}>
							<h3>História</h3>
							<ListGroup>
								{ taskHistory.map((event)=>
									<ListGroupItem key={event.id}>
										({timestampToString(event.createdAt)})
										{' ' + event.message}
									</ListGroupItem>
								)}
							</ListGroup>
							{	taskHistory.length===0 && <div>História je prázdna.</div>	}
						</TabPane>
					}
				</TabContent>
			</div>
    )
  }

  if ( taskLoading ) {
    return <Loading />
  }

  return (
    <div className="flex">
			{ showDescription &&
				<div
					style={{backgroundColor: "transparent", width: "100%", height: "100%", position: "absolute"}}
					onClick={()=>setShowDescription(false)}
					/>
			}

			{ renderCommandbar() }

			<div className={classnames({"fit-with-header-and-commandbar": !columns}, {"fit-with-header-and-commandbar-3": columns}, "scroll-visible", "bkg-white", { "row": layout === '2'})}>
				<div className={classnames( "card-box-lanwiki", { "task-edit-left": layout === '2' && !columns, "task-edit-left-columns": layout === '2' && columns})}>

					<div className="p-t-20 p-l-30 p-r-30">
						{ renderTitle() }

						<hr className="m-t-5 m-b-5"/>
						{ layout === 1 && renderSelectsLayout1() }

						{ renderPopis() }

						{ renderAttachments() }

						{ layout === 1 && defaultFields.tag.show && renderTags() }

						{ renderModalUserAdd() }

						{ renderModalCompanyAdd() }

						{ renderPendingPicker() }

						{ renderVykazyTable() }

						{ renderComments() }

					</div>


				</div>

				{ layout === 2 && renderSelectsLayout2() }

			</div>
		</div>
  );
}