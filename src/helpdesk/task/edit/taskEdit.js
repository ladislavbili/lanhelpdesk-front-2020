import React from 'react';
import {
  gql,
  useMutation,
  useQuery,
  useLazyQuery,
  useApolloClient,
} from "@apollo/client";

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
import classnames from "classnames";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import ck5config from 'configs/components/ck5config';
import {
  intervals
} from 'configs/constants/repeat';

import datePickerConfig from 'configs/components/datepicker';
import {
  invisibleSelectStyleNoArrow,
  selectStyleNoArrowNoPadding,
  invisibleSelectStyleNoArrowNoPadding,
  invisibleSelectStyleNoArrowColored,
  selectStyleNoArrowColoredRequired,
  invisibleSelectStyleNoArrowColoredRequired,
  invisibleSelectStyleNoArrowColoredRequiredNoPadding,
  selectStyleNoArrowRequired,
  invisibleSelectStyleNoArrowRequired,
  invisibleSelectStyleNoArrowRequiredNoPadding,
} from 'configs/components/select';
import booleanSelects from 'configs/constants/boolSelect';
import {
  noMilestone
} from 'configs/constants/sidebar';
import {
  noDef
} from 'configs/constants/projects';

import Attachments from 'helpdesk/components/attachments';
import Comments from 'helpdesk/components/comments';
import Repeat from 'helpdesk/components/repeat';
import TaskHistory from 'helpdesk/components/taskHistory';
import VykazyTable, {
  getCreationError as getVykazyError
} from 'helpdesk/components/vykazyTable';
import CheckboxList from 'helpdesk/components/checkboxList';
import Scheduled from 'helpdesk/components/scheduled';
import TaskAdd from '../add';
import TaskPrint from './taskPrint';

import PendingPicker from 'helpdesk/components/pendingPicker';
import UserAdd from 'helpdesk/settings/users/userAdd';
import CompanyAdd from 'helpdesk/settings/companies/companyAdd';

import {
  toSelArr,
  toSelItem,
  timestampToString,
  orderArr,
  updateArrayItem,
  toFloatOrZero
} from 'helperFunctions';
import {
  UPDATE_TASK,
  UPDATE_INVOICED_TASK,
  GET_TASK,
  GET_TASKS,
} from '../queries';

import {
  backendCleanRights
} from 'configs/constants/projects';

import {
  defaultVykazyChanges,
  invoicedAttributes,
  noTaskType
} from '../constants';

let fakeID = -1;

export default function TaskEdit( props ) {
  const client = useApolloClient();
  //data & queries
  const {
    match,
    history,
    columns,
    closeModal,
    inModal,
    id,
    task,
    currentUser,
    accessRights,
    companies,
    users,
    taskTypes,
    tripTypes,
    projects,
    emails,
    saving,
    setSaving,
    filterValues,
    originalProjectId,
    filterId,
    submitComment,
    submitEmail,
    addScheduledTaskFunc,
    deleteScheduledTaskFunc,
    deleteTaskFunc,
    addUserToProject,
    addCompanyToList,
    addAttachments,
    removeAttachment,
    addSubtaskFunc,
    updateSubtaskFunc,
    deleteSubtaskFunc,
    addWorkTripFunc,
    updateWorkTripFunc,
    deleteWorkTripFunc,
    addMaterialFunc,
    updateMaterialFunc,
    deleteMaterialFunc,
    addCustomItemFunc,
    updateCustomItemFunc,
    deleteCustomItemFunc,
    addShortSubtask,
    updateShortSubtask,
    deleteShortSubtask,
    canEditInvoiced,
  } = props;

  //state
  const [ layout, setLayout ] = React.useState( 2 );

  const [ assignedTo, setAssignedTo ] = React.useState( [] );
  const [ closeDate, setCloseDate ] = React.useState( null );
  const [ comments, setComments ] = React.useState( [] );
  const [ company, setCompany ] = React.useState( null );
  const [ deadline, setDeadline ] = React.useState( null );
  const [ description, setDescription ] = React.useState( "" );
  const [ important, setImportant ] = React.useState( false );
  const [ milestone, setMilestone ] = React.useState( [ noMilestone ] );
  const [ overtime, setOvertime ] = React.useState( booleanSelects[ 0 ] );
  const [ openUserAdd, setOpenUserAdd ] = React.useState( false );
  const [ openCompanyAdd, setOpenCompanyAdd ] = React.useState( false );
  const [ pausal, setPausal ] = React.useState( booleanSelects[ 0 ] );
  const [ pendingChangable, setPendingChangable ] = React.useState( false );
  const [ pendingDate, setPendingDate ] = React.useState( null );
  const [ potentialPendingStatus, setPotentialPendingStatus ] = React.useState( null );
  const [ pendingOpen, setPendingOpen ] = React.useState( false );
  const [ project, setProject ] = React.useState( null );
  const [ repeat, setRepeat ] = React.useState( null );
  const [ requester, setRequester ] = React.useState( null );
  const [ status, setStatus ] = React.useState( null );
  const [ showDescription, setShowDescription ] = React.useState( false );
  const [ tags, setTags ] = React.useState( [] );
  const [ taskType, setTaskType ] = React.useState( null );
  const [ taskTripPausal, setTaskTripPausal ] = React.useState( 0 );
  const [ taskWorkPausal, setTaskWorkPausal ] = React.useState( 0 );
  const [ title, setTitle ] = React.useState( "" );
  const [ toggleTab, setToggleTab ] = React.useState( 1 );
  const [ usedSubtaskPausal, setUsedSubtaskPausal ] = React.useState( 0 );
  const [ usedTripPausal, setUsedTripPausal ] = React.useState( 0 );

  const [ changes, setChanges ] = React.useState( {} );
  const [ vykazyChanges, setVykazyChanges ] = React.useState( defaultVykazyChanges );
  const [ updateTask ] = useMutation( UPDATE_TASK );
  const [ updateInvoicedTask ] = useMutation( UPDATE_INVOICED_TASK );

  const invoicedTask = task.invoiced ? task.invoicedTasks[ 0 ] : null;
  // sync
  React.useEffect( () => {
    setChanges( {} );
    setVykazyChanges( defaultVykazyChanges );
    if ( task.invoiced ) {
      setAssignedTo( toSelArr( invoicedTask.assignedTo ) );
    } else {
      setAssignedTo( toSelArr( task.assignedTo, 'email' ) );
    }
    setCloseDate( moment( parseInt( task.closeDate ) ) );
    setComments( task.comments );
    setDeadline( task.deadline ? moment( parseInt( task.deadline ) ) : null );
    setDescription( task.description );
    setImportant( task.important );
    const project = projects.find( ( project ) => project.id === task.project.id );
    const milestone = project && task.milestone ? toSelArr( project.project.milestones )
      .find( ( milestone ) => milestone.id === task.milestone.id ) : undefined;
    setOvertime( ( task.overtime ? booleanSelects[ 1 ] : booleanSelects[ 0 ] ) );
    setPausal( ( task.pausal ? booleanSelects[ 1 ] : booleanSelects[ 0 ] ) );
    setPendingChangable( task.pendingChangable );
    setPendingDate( moment( parseInt( task.pendingDate ) ) );
    if ( task.repeat === null ) {
      setRepeat( null );
    } else {
      setRepeat( {
        repeatInterval: intervals.find( ( interval ) => interval.value === task.repeat.repeatInterval ),
        repeatEvery: task.repeat.repeatEvery,
        startsAt: moment( parseInt( task.repeat.startsAt ) )
      } );
    }
    const status = ( task.status ? toSelItem( task.status ) : null )
    setStatus( status );
    if ( task.invoiced ) {
      setTags( toSelArr( invoicedTask.tags ) );
      setTaskType( createSelectInvoicedItem( task.taskType, invoicedTask.taskType ) );
      setCompany( createSelectInvoicedItem( task.company, invoicedTask.company ) );
      setMilestone( milestone === undefined ? noMilestone : {
        ...milestone,
        label: invoicedTask.milestone
      } );
      setRequester( createSelectInvoicedItem( task.requester, invoicedTask.requester ) );
      setProject( {
        ...project,
        label: invoicedTask.project
      } );
    } else {
      setTags( toSelArr( task.tags ) );
      setTaskType( ( task.taskType ? toSelItem( task.taskType ) : noTaskType ) );
      setCompany( ( task.company ? toSelItem( task.company ) : null ) );
      setMilestone( milestone === undefined ? noMilestone : milestone );
      setRequester(
        task.requester ? {
          ...task.requester,
          value: task.requester.id,
          label: task.requester.fullName
        } :
        null
      );
      setProject( project );
    }
    setTaskTripPausal( task.company ? task.company.taskTripPausal : 0 );
    setTaskWorkPausal( task.company ? task.company.taskWorkPausal : 0 );
    setTitle( task.title );
    setUsedSubtaskPausal( task.company ? task.company.usedSubtaskPausal : 0 );
    setUsedTripPausal( task.company ? task.company.usedTripPausal : 0 );
  }, [ id ] );

  //constants
  const defaultFields = project === null ? noDef : {
    ...noDef,
    ...project.project.def
  };
  const userRights = (
    currentUser.role.level === 0 ?
    backendCleanRights( true ) :
    (
      project ?
      project.right :
      backendCleanRights()
    )
  );
  const canAddUser = accessRights.users;
  const canAddCompany = accessRights.companies;
  const availableProjects = projects.filter( ( project ) => project.right.projectWrite || currentUser.role.level === 0 );
  const assignedTos = project ? toSelArr( project.usersWithRights, 'fullName' ) : [];

  const requesters = ( project && project.project.lockedRequester ? toSelArr( project.usersWithRights, 'fullName' ) : users );
  const milestones = [ noMilestone ].concat( ( project ? toSelArr( project.project.milestones ) : [] ) );

  //functions
  const getCantSave = ( change = {} ) => {
    const compare = {
      title,
      status,
      project,
      tags,
      assignedTo,
      saving,
      ...change,
    }
    return (
      compare.title === "" ||
      compare.status === null ||
      compare.project === null ||
      compare.assignedTo.length === 0 ||
      compare.saving ||
      ( defaultFields.tag.required && compare.tags.length === 0 ) ||
      ( defaultFields.assignedTo.required && compare.assignedTo.length === 0 )
    )
  }

  const createSelectInvoicedItem = ( original, invoiced ) => (
    original ? {
      ...original,
      value: original.id,
      label: invoiced
    } : {
      value: invoiced,
      label: invoiced
    }
  )
  const autoUpdateTask = ( change ) => {
    if ( getCantSave( change ) || task.invoiced ) {
      setChanges( {
        ...changes,
        ...change
      } );
      return;
    }
    setSaving( true );
    let variables = {
      id,
      ...changes,
      ...change
    };

    updateTask( {
        variables
      } )
      .then( ( response ) => {
        setChanges( {} );
        //update task
        const originalTask = client.readQuery( {
            query: GET_TASK,
            variables: {
              id
            },
          } )
          .task;

        const updatedTask = {
          ...originalTask,
          ...response.data.updateTask
        }

        client.writeQuery( {
          query: GET_TASK,
          variables: {
            id
          },
          data: {
            task: updatedTask
          }
        } );

        //update tasks if project changed or not
        let execTasks = client.readQuery( {
            query: GET_TASKS,
            variables: {
              filterId,
              filter: filterValues,
              projectId: originalProjectId
            }
          } )
          .tasks;

        if ( project.id !== originalProjectId && originalProjectId !== null ) {
          client.writeQuery( {
            query: GET_TASKS,
            variables: {
              filterId,
              filter: filterValues,
              projectId: originalProjectId
            },
            data: {
              tasks: {
                ...execTasks,
                tasks: execTasks.tasks.filter( ( task ) => task.id !== id )
              }
            }
          } );
        } else {
          client.writeQuery( {
            query: GET_TASKS,
            variables: {
              filterId,
              filter: filterValues,
              projectId: originalProjectId
            },
            data: {
              tasks: {
                ...execTasks,
                tasks: updateArrayItem( execTasks.tasks, updatedTask )
              }
            }
          } );
        }
      } )
      .catch( ( err ) => {
        console.log( 'error' );
        setChanges( {
          ...changes,
          ...change
        } );
        console.log( err.message );
      } );

    setSaving( false );
  }

  const submitInvoicedTask = ( cancelInvoiced ) => {
    const stmcChanges = {
      subtasks: {
        ADD: vykazyChanges.subtask.ADD.map( ( newSubtask ) => ( {
          title: newSubtask.title,
          order: newSubtask.order,
          quantity: toFloatOrZero( newSubtask.quantity ),
          discount: toFloatOrZero( newSubtask.discount ),
          type: newSubtask.type.id,
          assignedTo: newSubtask.assignedTo.id,
        } ) ),
        EDIT: vykazyChanges.subtask.EDIT.map( ( subtask ) => {
          let subtaskChanges = {};
          Object.keys( subtask )
            .forEach( ( key ) => {
              switch ( key ) {
                case 'assignedTo': {
                  subtaskChanges[ key ] = subtask[ key ].id;
                  break;
                }
                case 'type': {
                  subtaskChanges[ key ] = subtask[ key ].id;
                  break;
                }
                case 'discount': {
                  subtaskChanges[ key ] = toFloatOrZero( subtask[ key ] );
                  break;
                }
                case 'quantity': {
                  subtaskChanges[ key ] = toFloatOrZero( subtask[ key ] );
                  break;
                }
                default: {
                  subtaskChanges[ key ] = subtask[ key ];
                  break;
                }
              }
            } )
          return subtaskChanges;
        } ),
        DELETE: vykazyChanges.subtask.DELETE,
      },
      trips: {
        ADD: vykazyChanges.trip.ADD.map( ( newTrip ) => ( {
          order: newTrip.order,
          quantity: toFloatOrZero( newTrip.quantity ),
          discount: toFloatOrZero( newTrip.discount ),
          type: newTrip.type.id,
          assignedTo: newTrip.assignedTo.id,
        } ) ),
        EDIT: vykazyChanges.trip.EDIT.map( ( trip ) => {
          let tripChanges = {};
          Object.keys( trip )
            .forEach( ( key ) => {
              switch ( key ) {
                case 'discount': {
                  tripChanges[ key ] = toFloatOrZero( trip[ key ] );
                  break;
                }
                case 'quantity': {
                  tripChanges[ key ] = toFloatOrZero( trip[ key ] );
                  break;
                }
                case 'assignedTo': {
                  tripChanges[ key ] = trip[ key ].id;
                  break;
                }
                case 'type': {
                  tripChanges[ key ] = trip[ key ].id;
                  break;
                }
                default: {
                  tripChanges[ key ] = trip[ key ];
                  break;
                }
              }
            } )
          return tripChanges;
        } ),
        DELETE: vykazyChanges.trip.DELETE,
      },
      materials: {
        ADD: vykazyChanges.material.ADD.map( ( newMaterial ) => ( {
          title: newMaterial.title,
          order: newMaterial.order,
          quantity: toFloatOrZero( newMaterial.quantity ),
          margin: toFloatOrZero( newMaterial.margin ),
          price: toFloatOrZero( newMaterial.price ),
        } ) ),
        EDIT: vykazyChanges.material.EDIT.map( ( material ) => {
          let materialChanges = {};
          Object.keys( material )
            .forEach( ( key ) => {
              switch ( key ) {
                case 'quantity': {
                  materialChanges[ key ] = toFloatOrZero( material[ key ] );
                  break;
                }
                case 'margin': {
                  materialChanges[ key ] = toFloatOrZero( material[ key ] );
                  break;
                }
                case 'price': {
                  materialChanges[ key ] = toFloatOrZero( material[ key ] );
                  break;
                }
                default: {
                  materialChanges[ key ] = material[ key ];
                  break;
                }
              }
            } )
          return materialChanges;
        } ),
        DELETE: vykazyChanges.material.DELETE,
      },
      customItems: {
        ADD: vykazyChanges.customItem.ADD.map( ( newCustomItem ) => ( {
          title: newCustomItem.title,
          order: newCustomItem.order,
          quantity: toFloatOrZero( newCustomItem.quantity ),
          price: toFloatOrZero( newCustomItem.price ),
        } ) ),
        EDIT: vykazyChanges.customItem.EDIT.map( ( customItem ) => {
          let customItemChanges = {};
          Object.keys( customItem )
            .forEach( ( key ) => {
              switch ( key ) {
                case 'quantity': {
                  customItemChanges[ key ] = toFloatOrZero( customItem[ key ] );
                  break;
                }
                case 'price': {
                  customItemChanges[ key ] = toFloatOrZero( customItem[ key ] );
                  break;
                }
                default: {
                  customItemChanges[ key ] = customItem[ key ];
                  break;
                }
              }
            } )
          return customItemChanges;
        } ),
        DELETE: vykazyChanges.customItem.DELETE,
      },
    };
    updateInvoicedTask( {
        variables: {
          id,
          cancelInvoiced,
          taskChanges: changes,
          stmcChanges,
        }
      } )
      .then( ( response ) => {
        setChanges( {} );
        setVykazyChanges( defaultVykazyChanges );
        const originalTask = client.readQuery( {
            query: GET_TASK,
            variables: {
              id
            },
          } )
          .task;

        const updatedTask = {
          ...originalTask,
          ...response.data.updateInvoicedTask
        }

        client.writeQuery( {
          query: GET_TASK,
          variables: {
            id
          },
          data: {
            task: updatedTask
          }
        } );
      } )
      .catch( ( error ) => {
        console.log( error );
      } )
  }

  const saveVykazyChanges = ( data, dataType, action ) => {
    let newChanges = {
      ...vykazyChanges
    };
    switch ( action ) {
      case 'ADD': {
        let invoicedData = {};
        invoicedAttributes[ dataType ].forEach( ( attribute ) => {
          invoicedData[ attribute ] = data[ attribute ];
        } );
        newChanges[ dataType ][ action ].push( {
          ...data,
          id: fakeID--,
          invoicedData
        } );
        break;
      }
      case 'EDIT': {
        if ( data.id < 0 ) {
          const index = newChanges[ dataType ][ 'ADD' ].findIndex( ( item ) => item.id === data.id );
          newChanges[ dataType ][ 'ADD' ][ index ] = {
            ...newChanges[ dataType ][ 'ADD' ][ index ],
            ...data.newData
          }
          Object.keys( data.newData )
            .forEach( ( key ) => {
              if ( invoicedAttributes[ dataType ].includes( key ) ) {
                newChanges[ dataType ][ 'ADD' ][ index ].invoicedData[ key ] = data.newData[ key ];
              }
            } )
        } else {
          const index = newChanges[ dataType ][ 'EDIT' ].findIndex( ( item ) => item.id === data.id );
          if ( index !== -1 ) {
            newChanges[ dataType ][ 'EDIT' ][ index ] = {
              ...newChanges[ dataType ][ 'EDIT' ][ index ],
              ...data.newData
            }
          } else {
            newChanges[ dataType ][ 'EDIT' ].push( {
              id: data.id,
              ...data.newData,
            } )
          }
        }
        break;
      }
      case 'DELETE': {
        if ( data < 0 ) {
          newChanges[ dataType ][ 'ADD' ].splice( newChanges[ dataType ][ 'ADD' ].findIndex( ( item ) => item.id === data ), 1 );
        } else {
          newChanges[ dataType ][ 'EDIT' ].splice( newChanges[ dataType ][ 'EDIT' ].findIndex( ( item ) => item.id === data ), 1 );
          newChanges[ dataType ][ action ].push( data );
        }
        break;
      }
      default: {}
    }
    setVykazyChanges( newChanges );
  }

  const modifyInvoicedVykazy = ( data, type ) => {
    if ( !task.invoiced ) {
      return data;
    }
    //vykazyChanges, setVykazyChanges
    let newData = data.filter( ( item ) => !vykazyChanges[ type ][ 'DELETE' ].includes( item.id ) );
    newData = newData.map( ( item ) => {
      switch ( type ) {
        case 'subtask': {
          return ( {
            ...item,
            invoicedData: {
              ...item.invoicedData,
              assignedTo: {
                label: item.invoicedData.assignedTo,
                value: item.assignedTo ? item.assignedTo.id : null
              },
              type: {
                label: item.invoicedData.type,
                value: item.type ? item.type.id : null
              },
            }
          } )
          break;
        }
        case 'trip': {
          return ( {
            ...item,
            invoicedData: {
              ...item.invoicedData,
              assignedTo: {
                label: item.invoicedData.assignedTo,
                value: item.assignedTo ? item.assignedTo.id : null
              },
              type: {
                label: item.invoicedData.type,
                value: item.type ? item.type.id : null
              },
            }
          } )
          break;
        }
        default: {
          return item
          break;
        }

      }
    } )
    newData = newData.map( ( item ) => {
      const change = vykazyChanges[ type ][ 'EDIT' ].find( ( item2 ) => item.id === item2.id );
      if ( !change ) {
        return item;
      }
      let newItem = {
        ...item,
        invoicedData: {
          ...item.invoicedData
        }
      };
      Object.keys( change )
        .forEach( ( key ) => {
          newItem[ key ] = change[ key ];
          if ( invoicedAttributes[ type ].includes( key ) ) {
            newItem.invoicedData[ key ] = change[ key ];
          }
        } )
      return newItem;
    } )
    return newData.concat( vykazyChanges[ type ][ 'ADD' ] );
  }


  //vykazyTable
  const subtasks = task.subtasks.map( item => ( {
    ...item,
    invoicedData: item.invoicedData ? item.invoicedData[ 0 ] : item.invoicedData,
    assignedTo: toSelItem( item.assignedTo, 'email' ),
    type: toSelItem( item.type )
  } ) );
  const workTrips = task.workTrips.map( item => ( {
    ...item,
    invoicedData: item.invoicedData ? item.invoicedData[ 0 ] : item.invoicedData,
    assignedTo: toSelItem( item.assignedTo, 'email' ),
    type: toSelItem( item.type )
  } ) );
  const materials = task.materials.map( ( item ) => ( {
    ...item,
    invoicedData: item.invoicedData ? item.invoicedData[ 0 ] : item.invoicedData,
  } ) );
  const customItems = task.customItems.map( ( item ) => ( {
    ...item,
    invoicedData: item.invoicedData ? item.invoicedData[ 0 ] : item.invoicedData,
  } ) );

  const canCopy = userRights.addTasks && !getCantSave();


  //Value Change
  const changeProject = ( project ) => {
    let newAssignedTo = assignedTo.filter( ( user ) => project.usersWithRights.some( ( projectUser ) => projectUser.id === user.id ) );
    setProject( project );
    setAssignedTo( newAssignedTo );
    setMilestone( noMilestone );
    setTags( [] );
    setStatus( null );
    autoUpdateTask( {
      project: project.id,
      tags: [],
      status: null,
      assignedTo: newAssignedTo.map( ( user ) => user.id ),
      milestone: null
    } )
  }

  const changeStatus = ( status ) => {
    if ( status.action === 'PendingDate' ) {
      setPendingOpen( true );
      setPotentialPendingStatus( status );
    } else if ( status.action === 'CloseDate' || status.action === 'Invalid' ) {
      setStatus( status );
      setImportant( false );
      setCloseDate( moment() );
      autoUpdateTask( {
        status: status.id,
        closeDate: moment()
          .valueOf()
          .toString(),
        important: false
      } );
    } else {
      setStatus( status );
      autoUpdateTask( {
        status: status.id
      } );
    }
  }

  const changeMilestone = ( milestone ) => {
    if ( status.action === 'PendingDate' ) {
      if ( milestone.startsAt !== null ) {
        setMilestone( milestone );
        setPendingDate( moment( milestone.startsAt ) );
        setPendingChangable( false );
        autoUpdateTask( {
          milestone: milestone.id,
          pendingDate: moment( milestone.startsAt )
            .valueOf()
            .toString(),
          pendingChangable: false
        } );
      } else {
        setMilestone( milestone );
        setPendingChangable( true );
        autoUpdateTask( {
          milestone: milestone.id,
          pendingChangable: true
        } );
      }
    } else {
      setMilestone( milestone );
      autoUpdateTask( {
        milestone: milestone.id
      } );
    }
  }

  const changeRequester = ( requester ) => {
    if ( requester.id === -1 ) {
      setOpenUserAdd( true );
    } else {
      setRequester( requester );
      autoUpdateTask( {
        requester: requester.id
      } )
    }
  }

  const changeCompany = ( company ) => {
    if ( company.id === -1 ) {
      setOpenCompanyAdd( true );
    } else {
      setCompany( company );
      setPausal( parseInt( company.taskWorkPausal ) > 0 ? booleanSelects[ 1 ] : booleanSelects[ 0 ] );
      autoUpdateTask( {
        company: company.id,
        pausal: parseInt( company.taskWorkPausal ) > 0
      } )
    }
  }

  //render
  const renderCommandbar = () => {
    return (
      <div className="task-add-layout"> {/*Commandbar*/}
        <div className={classnames("d-flex", "flex-row", "center-hor", {"m-b-10": columns})}>
          <div className="display-inline center-hor">
            {!columns &&
              <button
                type="button"
                className="btn btn-link waves-effect task-add-layout-button"
                onClick={() => {
                  if(inModal){
                    closeModal()
                  }else{
                    history.push(`/helpdesk/taskList/i/${match.params.listID}`)
                  }
                }}
                >
                <i
                  className="fas fa-arrow-left commandbar-command-icon"
                  />
                Back
              </button>
            }
            { task.invoiced && accessRights.vykazy && canEditInvoiced &&
              <button
                type="button"
                disabled={getCantSave()}
                className="btn btn-danger waves-effect task-add-layout-button"
                onClick={() => submitInvoicedTask(true)}
                >
                Re-open
              </button>
            }
            { task.invoiced && accessRights.vykazy && canEditInvoiced &&
              <button
                type="button"
                disabled={getCantSave()}
                className="btn btn-link waves-effect task-add-layout-button"
                onClick={() => submitInvoicedTask(false)}
                >
                <i className="far fa-save" />
                Save invoiced task
              </button>
            }
            { project && canCopy &&
              <TaskAdd
                project={project.id}
                task={task}
                disabled={!canCopy}
                />
            }
            { false &&
              <TaskPrint
                match={match}
                taskID={id}
                createdBy={task.createdBy}
                createdAt={task.createdAt}
                taskWorks={task.subtasks.map( item => ( {
                  ...item,
                  invoicedData: item.invoicedData ? item.invoicedData[ 0 ] : item.invoicedData,
                  assignedTo: toSelItem( item.assignedTo, 'email' ),
                  type: toSelItem( item.type )
                } ) )}
                workTrips={workTrips}
                taskMaterials={materials}
                customItems={customItems}
                isLoaded={true}
                />
            }
            { userRights.deleteTasks &&
              <button
                type="button"
                className="btn btn-link waves-effect task-add-layout-button"
                onClick={deleteTaskFunc}
                >
                <i className="far fa-trash-alt" />
                Delete
              </button>
            }
            { userRights.important &&
              <button
                type="button"
                style={{color: important ? '#ffc107' : '#0078D4'}}
                disabled={ !userRights.important }
                className="btn btn-link waves-effect task-add-layout-button"
                onClick={()=>{
                  autoUpdateTask({ important: !important })
                  setImportant(!important);
                }}
                >
                <i className="far fa-star" />
                Important
              </button>
            }
            <button
              type="button"
              className="btn btn-link waves-effect task-add-layout-button"
              onClick={() => setLayout(layout === 1 ? 2 : 1)}
              >
              <i className="fas fa-retweet "/>
              Layout
            </button>

            { !task.invoiced && userRights.statusWrite &&
              (project ? toSelArr(project.project.statuses) : [])
              .filter((status) => !['Invoiced'].includes(status.action) )
              .map((status) => (
                <button
                  type="button"
                  key={status.id}
                  className="btn btn-link waves-effect task-add-layout-button"
                  onClick={() => changeStatus(status)}
                  >
                  { status.icon.length > 3 &&
                    <i
                      className={`${status.icon} commandbar-command-icon`}
                      />
                  }
                  {status.title}
                </button>
              ))
            }
          </div>
        </div>
      </div>
    )
  }

  const canCreateVykazyError = () => {
    if (
      ( !userRights.vykazRead && !userRights.rozpocetRead ) ||
      getVykazyError( taskType, assignedTo.filter( ( user ) => user.id !== null ), company ) === ''
    ) {
      return null;
    }
    return (
      <div className="center-hor" style={{color: "#FF4500", height: "20px"}}>
        {getVykazyError(taskType, assignedTo.filter((user) => user.id !== null ), company)}
      </div>
    )
  }

  const renderTitle = () => {
    return (
      <div className="d-flex">
        <div className="row flex">
          <h2 className="center-hor m-l-10">{id}: </h2>
          <span className="center-hor flex m-r-15">
            <input type="text"
              disabled={ !userRights.taskTitleEdit }
              value={title}
              className="task-title-input text-extra-slim hidden-input m-l-10 form-control "
              onChange={(e)=> {
                setTitle(e.target.value);
              }}
              onBlur={(e) => {
                autoUpdateTask({ title })
              }}
              placeholder="Enter task name" />
          </span>
          {renderTaskInfoAndDates()}
        </div>
      </div>
    );
  }

  const renderTaskInfoAndDates = () => {
    return (
      <div className="ml-auto center-hor">
        <div className="task-info">
          <span className="">
            {task.createdBy?"Created by ":""}
          </span>
          <span className="bolder">
            {task.createdBy? (task.createdBy.name + " " +task.createdBy.surname) :''}
          </span>
          <span className="">
            {task.createdBy?' at ':'Created at '}
          </span>
          <span className="bolder">
            {task.createdAt?(timestampToString(task.createdAt)):''}
          </span>
        </div>
        { renderStatusDate() }
      </div>
    )
  }

  const renderStatusDate = () => {
    if ( !userRights.statusRead ) {
      return null;
    }

    if ( status && status.action === 'PendingDate' ) {
      return (
        <div className="task-info">
          <span className="center-hor">
            Pending date:
          </span>
          <DatePicker
            className="form-control hidden-input bolder"
            selected={pendingDate}
            disabled={!status || status.action!=='PendingDate'||!userRights.statusWrite||!pendingChangable}
            onChange={ (date) => {
              setPendingDate(date);
              if(date.valueOf() !== null){
                autoUpdateTask({pendingDate: date.valueOf().toString()});
              }
            }}
            placeholderText="No pending date"
            {...datePickerConfig}
            />
        </div>
      )
    }

    if ( status && (
        status.action === 'CloseDate' ||
        status.action === 'Invoiced' ||
        status.action === 'CloseInvalid'
      ) ) {
      return (
        <div className="task-info">
          <span className="center-hor">
            Closed at:
          </span>
          <DatePicker
            className="form-control hidden-input bolder"
            selected={closeDate}
            disabled={!status || (status.action!=='CloseDate' && status.action!=='CloseInvalid')||!userRights.statustatusWrite}
            onChange={date => {
              setCloseDate(date);
              if(date.valueOf() !== null){
                autoUpdateTask({closeDate: date.valueOf().toString()});
              }
            }}
            placeholderText="No pending date"
            {...datePickerConfig}
            />
        </div>
      )
    }
    return (
      <div className="task-info">
        <span className="center-hor bolder">
          {task.statusChange ? ('Status changed at ' + timestampToString(task.statusChange) ) : ""}
        </span>
      </div>
    )
  }

  const layoutComponents = {
    Project: (
      <Select
        placeholder="Zadajte projekt"
        isDisabled={ !userRights.projectWrite || task.invoiced }
        value={ project }
        onChange={ changeProject }
        options={ availableProjects }
        styles={selectStyleNoArrowRequired}
        />
    ),
    Assigned: (
      <Select
        value={assignedTo}
        placeholder="Select"
        isMulti
        isDisabled={defaultFields.assignedTo.fixed||!userRights.assignedWrite}
        onChange={(users)=> {
          if (users.some(u => u.id === -1)){
            setOpenUserAdd(true);
          } else {
            setAssignedTo(users);
            autoUpdateTask({ assignedTo: users.map((user) => user.id) })
          }
        }}
        options={
          ( canAddUser ? [{id:-1, title:'+ Add user',body:'add', label:'+ Add user',value:null}] : [])
          .concat(assignedTos)
        }
        styles={selectStyleNoArrowRequired}
        />
    ),
    Status: (
      <Select
        placeholder="Status required"
        value={status}
        isDisabled={defaultFields.status.fixed || !userRights.statusWrite || task.invoiced}
        styles={selectStyleNoArrowColoredRequired}
        onChange={ changeStatus }
        options={(project ? toSelArr(project.project.statuses) : []).filter((status)=>status.action!=='Invoiced')}
        />
    ),
    Type: (
      <Select
        placeholder="Zadajte typ"
        value={taskType}
        isDisabled={ !userRights.typeWrite }
        styles={selectStyleNoArrowRequired}
        onChange={(type)=> {
          setTaskType(type);
          autoUpdateTask({ taskType: type.id })
        }}
        options={[noTaskType, ...taskTypes]}
        />
    ),
    Milestone: (
      <Select
        isDisabled={!userRights.milestoneWrite}
        value={milestone}
        onChange={changeMilestone}
        options={milestones}
        styles={selectStyleNoArrowNoPadding}
        />
    ),
    Requester: (
      <Select
        placeholder="Zadajte žiadateľa"
        value={requester}
        isDisabled={defaultFields.requester.fixed || !userRights.requesterWrite}
        onChange={changeRequester}
        options={(canAddUser?[{id:-1,title:'+ Add user',body:'add', label:'+ Add user',value:null}]:[]).concat(requesters)}
        styles={ selectStyleNoArrowRequired}
        />
    ),
    Company: (
      <Select
        placeholder="Zadajte firmu"
        value={company}
        isDisabled={defaultFields.company.fixed || !userRights.companyWrite || task.invoiced}
        onChange={changeCompany}
        options={(canAddCompany ? [{id:-1,title:'+ Add company',body:'add', label:'+ Add company', value:null}] : [] ).concat(companies)}
        styles={selectStyleNoArrowRequired}
        />
    ),
    Pausal: (
      <Select
        value={company && parseInt(company.taskWorkPausal) === 0 && pausal.value === false ? {...pausal, label: pausal.label + " (nezmluvný)"} : pausal }
        isDisabled={!userRights.pausalWrite || !company || !company.monthly || parseInt(company.taskWorkPausal) < 0 || defaultFields.pausal.fixed}
        styles={selectStyleNoArrowRequired }
        onChange={(pausal)=> {
          autoUpdateTask({ pausal: pausal.value })
          setPausal(pausal);
        }}
        options={booleanSelects}
        />
    ),
    Deadline: (
      <DatePicker
        className={classnames("form-control")}
        selected={deadline}
        disabled={!userRights.deadlineWrite}
        onChange={date => {
          setDeadline(date);
          if( date.valueOf() !== null ){
            autoUpdateTask({ deadline: date.valueOf().toString() })
          }
        }}
        placeholderText="No deadline"
        {...datePickerConfig}
        />
    ),
    Overtime: (
      <Select
        value={overtime}
        isDisabled={!userRights.overtimeWrite || defaultFields.overtime.fixed}
        styles={ selectStyleNoArrowRequired }
        onChange={(overtime)=> {
          setOvertime(overtime);
          autoUpdateTask({ overtime: overtime.value })
        }}
        options={booleanSelects}
        />
    ),
  }

  const renderSelectsLayout1 = () => {
    return (
      <div className = "form-section form-selects-entries" >
        <div className="form-section-rest">
          <div className="col-12 row">
            { userRights.projectRead &&
              <div className="col-4">
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Projekt <span className="warning-big">*</span></Label>
                  <div className="col-9">
                    { layoutComponents.Project }
                  </div>
                </div>
              </div>
            }
            { userRights.assignedRead &&
              <div className="col-8">
                <div className="row p-r-10">
                  <Label className="col-1-45 col-form-label">Assigned <span className="warning-big">*</span></Label>
                  <div className="col-10-45">
                    { layoutComponents.Assigned }
                  </div>
                </div>
              </div>
            }
          </div>

          <div className="row">
          <div className="col-4">
            {userRights.statusRead &&
              <div className="display-inline row p-r-10">
                <Label className="col-form-label col-3 ">Status <span className="warning-big">*</span></Label>
                <div className="display-inline-block col-9">
                  { layoutComponents.Status }
                </div>
              </div>
            }
            { userRights.typeRead &&
              <div className="display-inline row p-r-10">
                <Label className="col-form-label  col-3">Typ <span className="warning-big">*</span></Label>
                <div className="display-inline-block col-9">
                  { layoutComponents.Type }
                </div>
              </div>
            }
            { userRights.milestoneRead &&
              <div className="display-inline row p-r-10">
                <Label className="col-form-label  col-3">Milestone</Label>
                <div className="display-inline-block col-9">
                  { layoutComponents.Milestone }
                </div>
              </div>
            }
          </div>

          <div className="col-4">
            {userRights.requesterRead &&
              <div className="display-inline row p-r-10">
                <Label className="col-form-label col-3 ">Zadal <span className="warning-big">*</span></Label>
                <div className="display-inline-block col-9">
                  { layoutComponents.Requester }
                </div>
              </div>
            }
            {userRights.companyRead &&
              <div className="display-inline row p-r-10">
                <Label className="col-form-label col-3 ">Firma <span className="warning-big">*</span></Label>
                <div className="display-inline-block col-9">
                  { layoutComponents.Company }
                </div>
              </div>
            }
            {userRights.pausalRead &&
              <div className="display-inline row p-r-10">
                <Label className="col-form-label col-3 ">Paušál <span className="warning-big">*</span></Label>
                <div className="display-inline-block col-9">
                  { layoutComponents.Pausal }
                </div>
              </div>
            }
          </div>
          <div className="col-4">
            { userRights.deadlineRead &&
              <div className="display-inline row p-r-10">
                <Label className="col-form-label col-3">Deadline</Label>
                <div className="display-inline-block col-9">
                  { layoutComponents.Deadline }
                </div>
              </div>
            }
            { userRights.repeatRead &&
                <Repeat
                  disabled={!userRights.repeatWrite}
                  taskID={id}
                  repeat={repeat}
                  submitRepeat={(repeat) => {
                    setRepeat(repeat);
                    autoUpdateTask({
                      repeat: {
                        repeatEvery: repeat.repeatEvery,
                        repeatInterval: repeat.repeatInterval.value,
                        startsAt: repeat.startsAt.valueOf().toString(),
                      }
                    })
                  }}
                  deleteRepeat={()=> {
                    setRepeat(null);
                    autoUpdateTask({ repeat: null })
                  }}
                  layout={layout}
                  />
            }
            { userRights.overtimeRead &&
              <div className="display-inline row p-r-10">
                <Label className="col-form-label row col-3">Mimo PH <span className="warning-big">*</span></Label>
                <div className="display-inline-block col-9">
                  {layoutComponents.Overtime}
                </div>
              </div>
            }
          </div>
          </div>

          { userRights.tagsRead &&
            <div className="row p-r-10">
              <Label className="col-0-5 col-form-label">Tags {  defaultFields.tag.required ? <span className="warning-big">*</span> : ""}</Label>
              <div className="col-11-5">
                { renderTags() }
              </div>
            </div>
          }

        </div>
      </div>
    )
  }

  const renderSelectsLayout2Form = () => {
    return (
      <div className="col-12 row task-edit-align-select-labels">
        <div className="col-2">
          <Label className="col-form-label">Projekt</Label>
          { layoutComponents.Project }
        </div>
        { userRights.statusRead &&
          <div className="col-2" >
            <Label className="col-form-label">Status</Label>
            { layoutComponents.Status }
          </div>
        }
        { userRights.milestoneRead &&
          <div className="col-2">
            <Label className="col-form-label">Milestone</Label>
            { layoutComponents.Milestone }
          </div>
        }
        { userRights.requesterRead &&
          <div className="col-2">
            <Label className="col-form-label">Zadal</Label>
            { layoutComponents.Requester }
          </div>
        }
        { userRights.companyRead &&
          <div className="col-2">
            <Label className="col-form-label">Firma</Label>
            { layoutComponents.Company }
          </div>
        }
      </div>
    )
  }

  const renderSelectsLayout2Side = () => {
    return (
      <div className={"task-edit-right" + (columns ? " w-250px" : "")} >
        { userRights.projectRead &&
          <div className="form-selects-entry-column" >
            <Label>Projekt <span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Project }
            </div>
          </div>
        }
        { userRights.statusRead &&
          <div className="form-selects-entry-column" >
            <Label>Status <span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Status }
            </div>
          </div>
        }
        { userRights.milestoneRead &&
          <div className="form-selects-entry-column" >
            <Label>Milestone</Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Milestone }
            </div>
          </div>
        }
        { userRights.requesterRead &&
          <div className="form-selects-entry-column" >
            <Label>Zadal <span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Requester }
            </div>
          </div>
        }
        { userRights.companyRead &&
          <div className="form-selects-entry-column" >
            <Label>Firma <span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Company }
            </div>
          </div>
        }
        { userRights.assignedRead &&
          <div className="form-selects-entry-column" >
            <Label>Assigned <span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Assigned }
            </div>
          </div>
        }
        { userRights.deadlineRead &&
          <div className="form-selects-entry-column" >
            <Label>Deadline</Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Deadline }
            </div>
          </div>
        }
        { userRights.repeatRead &&
          <Repeat
            disabled={userRights.repeatWrite}
            taskID={id}
            repeat={repeat}
            submitRepeat={(repeat) => {
              setRepeat(repeat);
              autoUpdateTask({
                repeat: {
                  repeatEvery: repeat.repeatEvery,
                  repeatInterval: repeat.repeatInterval.value,
                  startsAt: repeat.startsAt.valueOf().toString(),
                }
              })
            }}
            deleteRepeat={()=> {
              setRepeat(null);
              autoUpdateTask({ repeat: null })
            }}
            vertical={true}
            layout={layout}
            />
        }
        { userRights.scheduledRead &&
          <Scheduled
            items={task.scheduled.map((item) => ({
              ...item,
              from: moment(parseInt(item.from)),
              to: moment(parseInt(item.to)),
            }))}
            users={assignedTos}
            disabled={false}
            submitItem = { (newScheduled) => {
              addScheduledTaskFunc({task: id, UserId: newScheduled.user.id, from: newScheduled.from , to: newScheduled.to });
            }}
            deleteItem = { (scheduled) => {
              deleteScheduledTaskFunc(scheduled.id);
            } }
            />
        }

        { userRights.tagsRead &&
          <div className="form-selects-entry-column" >
            <Label>Tags { defaultFields.tag.required ? <span className="warning-big">*</span> : ""}</Label>
            <div className="form-selects-entry-column-rest" >
              { renderTags() }
            </div>
          </div>
        }

        { userRights.typeRead &&
          <div className="form-selects-entry-column" >
            <Label>Task Type <span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Type }
            </div>
          </div>
        }
        { userRights.pausalRead &&
          <div className="form-selects-entry-column" >
            <Label>Paušál <span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Pausal }
            </div>
          </div>
        }
        { userRights.overtimeRead &&
          <div className="form-selects-entry-column" >
            <Label>Mimo PH <span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Overtime }
            </div>
          </div>
        }
      </div>
    );
  }

  const renderTags = () => {
    if ( !userRights.tagsRead ) {
      if ( task.invoiced ) {
        return (
          <span className="bolder">
            {timestampToString(task.invoicedDate)}
          </span>
        )
      }
      return null;
    }
    return (
      <div className="flex">
        { task.invoiced &&
          <div className="bolder">
            Invoiced: {timestampToString(task.invoicedDate)}
          </div>
        }
        {
          !task.invoiced && getCantSave() &&
          <div className="bolder warning">
            Task can't be automatically saved! Some attributes are missing!
          </div>
        }
        <div className="row f-1">
          <div className="f-1 center-hor">
            <Select
              placeholder="Zvoľte tagy"
              value={tags}
              isMulti
              onChange={(tags)=> {
                setTags(tags);
                autoUpdateTask({ tags: tags.map((tag) => tag.id ) })
              }}
              options={toSelArr(project === null ? [] : project.project.tags)}
              isDisabled={defaultFields.tag.fixed || !userRights.tagsWrite}
              styles={selectStyleNoArrowColoredRequired }
              />
          </div>
        </div>
      </div>
    )
  }

  const renderTagsAndInfo = () => {
    return (
      <div className="row">
        {renderTags()}
        {renderTaskInfoAndDates()}
      </div>
    )
  }

  const renderDescription = () => {
    if ( !userRights.taskDescriptionRead ) {
      return null;
    }
    let RenderDescription = null;
    if ( !userRights.taskDescriptionWrite ) {
      if ( description.length !== 0 ) {
        RenderDescription = <div className="task-edit-popis" dangerouslySetInnerHTML={{__html:description }} />
      } else {
        RenderDescription = <div className="task-edit-popis">Úloha nemá popis</div>
      }
    } else {
      if ( showDescription ) {
        RenderDescription = <div>
          <CKEditor
            editor={ ClassicEditor }
            data={description}
            onInit={(editor) => {
              editor.editing.view.document.on( 'keydown', ( evt, data ) => {
                if ( data.keyCode === 27 ) {
                  autoUpdateTask({ description  });
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
        if ( description.length !== 0 ) {
          RenderDescription = <div className="task-edit-popis" dangerouslySetInnerHTML={{__html:description }} />
        } else {
          RenderDescription = <div className="task-edit-popis">Úloha nemá popis</div>
        }
      }
    }
    return (
      <div className="form-section">
        <div className="row" style={{alignItems: "baseline"}}>
          <Label className="m-r-10">
            Popis úlohy
          </Label>
            { userRights.taskDescriptionWrite &&
              <button
                className="btn btn-link waves-effect m-r-10"
                style={{height: "20px"}}
                onClick={()=>{
                  if(showDescription){
                    autoUpdateTask({ description  })
                  }
                  setShowDescription(!showDescription);
                }}
                >
                <i className={`fa fa-${!showDescription ? 'pen' : 'save' }`} />
                { !showDescription ? 'edit' : 'save' }
              </button>
            }
            { userRights.taskAttachmentsRead && userRights.taskAttachmentsWrite &&
              <label htmlFor={`uploadAttachment-${id}`} className="btn btn-link" >
                <i className="fa fa-plus" />
                Attachment
              </label>
          }
          </div>
        <div className="form-section-rest">
          {RenderDescription}
          {renderAttachments(false)}
        </div>
      </div>
    )
  }

  const renderCompanyPausalInfo = () => {
    if ( !company || !company.monthlyPausal || !userRights.pausalRead ) {
      return null;
    }
    return (
      <div className="form-section">
        <div className="form-section-rest">
          <span className=" message success-message center-hor ml-auto">
            { `Pausal ${company.title}  ` }
            <span>
              {`Pausal subtasks:`}
              <span className={classnames( {"warning-general": (usedSubtaskPausal > taskWorkPausal)} )}>
                {` ${usedSubtaskPausal}`}
              </span>
              {` / ${taskWorkPausal} Pausal trips:`}
              <span className={classnames( {"warning-general": (usedTripPausal > taskTripPausal)} )} >
                {` ${usedTripPausal}`}
              </span>
              {` / ${taskTripPausal}`}
            </span>
          </span>
        </div>
      </div>
    )
  }

  const renderSimpleSubtasks = () => {
    if ( !userRights.taskShortSubtasksRead ) {
      return null;
    }
    return (
      <CheckboxList
        disabled={!userRights.taskShortSubtasksWrite}
        items={task.shortSubtasks}
        onChange={(simpleSubtask) => {
          updateShortSubtask(simpleSubtask);
        }}
        submitItem = { (newSimpleSubtask) => {
          addShortSubtask({...newSimpleSubtask, task: id});
        }}
        deleteItem = { (simpleSubtask) => {
          deleteShortSubtask(simpleSubtask.id)
        } }
        placeholder="Short subtask title"
        newPlaceholder="New short subtask title"
        label="Subtask"
        />
    )
  }

  const renderAttachments = ( top ) => {
    if ( !userRights.taskAttachmentsRead ) {
      return null;
    }
    return (
      <Attachments
        disabled={!userRights.taskAttachmentsWrite}
        taskID={id}
        top={top}
        attachments={task.taskAttachments}
        addAttachments={addAttachments}
        removeAttachment={removeAttachment}
        />
    )
  }

  const renderModalUserAdd = () => {
    return (
      <Modal isOpen={openUserAdd} className="modal-without-borders" >
        <ModalHeader>
          Add user
        </ModalHeader>
        <ModalBody>
          <UserAdd
            closeModal={() => setOpenUserAdd(false)}
            addUserToList={(user) => {
              addUserToProject(user, project);
              setProject({
                ...project,
                usersWithRights:[
                  ...project.usersWithRights,
                  {
                    id: user.id,
                    fullName: user.fullName
                  }
                ]
              })
            } }
            />
        </ModalBody>
      </Modal>
    )
  }

  const renderModalCompanyAdd = () => {
    return (
      <Modal isOpen={openCompanyAdd} className="modal-without-borders">
        <ModalBody>
          <CompanyAdd
            closeModal={() => setOpenCompanyAdd(false)}
            addCompanyToList={addCompanyToList}
            />
        </ModalBody>
      </Modal>
    )
  }

  const renderPendingPicker = () => {
    if ( userRights.statusWrite ) {
      return null;
    }
    return (
      <PendingPicker
        open={pendingOpen}
        prefferedMilestone={milestone}
        milestonesBlocked={userRights.milestoneWrite}
        milestones={ milestones }
        closeModal={() => {
          setPendingOpen(false);
          setPotentialPendingStatus(null);
        }}
        savePending={(pending)=>{
          if(pending.pendingDate === null){
            setPendingDate( moment( parseInt(pending.milestone.endsAt) ) );
            setMilestone( pending.milestone );
            autoUpdateTask( {
              status: potentialPendingStatus.id,
              pendingChangable: false,
              important: false,
              milestone: pending.milestone.id,
              pendingDate: pending.milestone.endsAt ? pending.milestone.endsAt : moment().add(1,'day').valueOf().toString()
            } );
          }else{
            setPendingDate( pending.pendingDate );
            autoUpdateTask( {
              status: potentialPendingStatus.id,
              pendingChangable: true,
              important: false,
              pendingDate: pending.pendingDate.valueOf().toString()
            });
          }
          setStatus( potentialPendingStatus );
          setPendingOpen(false);
          setPotentialPendingStatus(null);
        }}
        />
    )
  }

  const renderVykazyTable = () => {
    if (
      !userRights.rozpocetRead &&
      !userRights.vykazRead
    ) {
      return null
    }
    return (
      <VykazyTable
        showColumns={ ( (!userRights.vykazWrite && !userRights.rozpocetWrite ) ? [0,1,2,3,4,5,6,7] : [0,1,2,3,4,5,6,7,8]) }
        showTotals={false}
        userRights={userRights}
        isInvoiced={task.invoiced}
        canEditInvoiced={canEditInvoiced}
        company={company}
        match={match}
        taskID={id}
        taskAssigned={assignedTo.filter((user) => user.id !== null )}

        showSubtasks={project ? project.showSubtasks : false}

        message={renderCompanyPausalInfo()}

        submitService={(newService, price) => {
          if(task.invoiced){
            saveVykazyChanges({...newService, price}, 'subtask', 'ADD' );
          }else{
            addSubtaskFunc(newService);
          }
        }}
        subtasks={ task.invoiced ? modifyInvoicedVykazy(subtasks, 'subtask') : subtasks }
        defaultType={taskType}
        taskTypes={taskTypes}
        updateSubtask={(id,newData)=>{
          if(task.invoiced){
            saveVykazyChanges({id,newData}, 'subtask', 'EDIT' );
          }else{
            updateSubtaskFunc({...subtasks.find((item)=>item.id===id),...newData});
          }
        }}
        updateSubtasks={(multipleSubtasks)=>{
          if(task.invoiced){
            multipleSubtasks.forEach(({id, newData}) => {
              saveVykazyChanges({id,newData}, 'subtask', 'EDIT' );
            })
          } else {
            multipleSubtasks.forEach(({id, newData})=>{
              updateSubtaskFunc({...subtasks.find((item)=>item.id===id),...newData});
            });
          }
        }}
        removeSubtask={(id)=>{
          if(task.invoiced){
            saveVykazyChanges( id, 'subtask', 'DELETE' );
          }else{
            deleteSubtaskFunc(id);
          }
        }}
        workTrips={ task.invoiced ? modifyInvoicedVykazy(workTrips, 'trip') : workTrips }
        tripTypes={tripTypes}
        submitTrip={(newTrip, price)=>{
          if(task.invoiced){
            saveVykazyChanges( { ...newTrip, price }, 'trip', 'ADD' );
          }else{
            addWorkTripFunc(newTrip);
          }
        }}
        updateTrip={(id,newData)=>{
          if(task.invoiced){
            saveVykazyChanges( {id, newData}, 'trip', 'EDIT' );
          }else{
            updateWorkTripFunc({...workTrips.find((trip)=>trip.id===id),...newData});
          }
        }}
        updateTrips={(multipleTrips)=>{
          if(task.invoiced){
            multipleTrips.forEach(({id, newData}) => {
              saveVykazyChanges({id,newData}, 'trip', 'EDIT' );
            })
          } else {
            multipleTrips.forEach(({id, newData})=>{
              updateWorkTripFunc({...workTrips.find((trip)=>trip.id===id),...newData});
            });
          }
        }}
        removeTrip={(id)=>{
          if(task.invoiced){
            saveVykazyChanges( id, 'trip', 'DELETE' );
          }else{
            deleteWorkTripFunc(id);
          }
        }}

        materials={ task.invoiced ? modifyInvoicedVykazy(materials, 'material') : materials }
        submitMaterial={(newMaterial)=>{
          if(task.invoiced){
            saveVykazyChanges( newMaterial, 'material', 'ADD' );
          }else{
            addMaterialFunc(newMaterial);
          }
        }}
        updateMaterial={(id,newData)=>{
          if(task.invoiced){
            saveVykazyChanges( {id,newData}, 'material', 'EDIT' );
          }else{
            updateMaterialFunc({...materials.find((material)=>material.id===id),...newData});
          }
        }}
        updateMaterials={(multipleMaterials)=>{
          if(task.invoiced){
            multipleMaterials.forEach(({id, newData}) => {
              saveVykazyChanges({id,newData}, 'material', 'EDIT' );
            })
          } else {
            multipleMaterials.forEach(({id, newData})=>{
              updateMaterialFunc({...materials.find((material)=>material.id===id),...newData});
            });
          }
        }}
        removeMaterial={(id)=>{
          if(task.invoiced){
            saveVykazyChanges( id, 'material', 'DELETE' );
          }else{
            deleteMaterialFunc(id);
          }
        }}
        customItems={ task.invoiced ? modifyInvoicedVykazy(customItems, 'customItem') : customItems }
        submitCustomItem={(customItem)=>{
          if(task.invoiced){
            saveVykazyChanges( customItem, 'customItem', 'ADD' );
          }else{
            addCustomItemFunc(customItem);
          }
        }}
        updateCustomItem={(id,newData)=>{
          if(task.invoiced){
            saveVykazyChanges( {id,newData}, 'customItem', 'EDIT' );
          }else{
            updateCustomItemFunc({...customItems.find( (customItem) => customItem.id === id ),...newData});
          }
        }}
        updateCustomItems={(multipleCustomItems)=>{
          if(task.invoiced){
            multipleCustomItems.forEach(({id, newData}) => {
              saveVykazyChanges({id,newData}, 'customItem', 'EDIT' );
            })
          } else {
            multipleCustomItems.forEach(({id, newData})=>{
              updateCustomItemFunc({...customItems.find( (customItem) => customItem.id === id),...newData});
            });
          }
        }}
        removeCustomItem={(id)=>{
          if(task.invoiced){
            saveVykazyChanges( id, 'customItem', 'DELETE' );
          }else{
            deleteCustomItemFunc(id);
          }
        }}
        units={[]}
        defaultUnit={null}
        />
    )
  }

  const renderComments = () => {
    if ( !userRights.history && !userRights.viewComments ) {
      return null;
    }
    return (
      <div className="form-section">
        <div className="form-section-rest">
          <Nav tabs className="b-0 m-b-10">
            { userRights.viewComments &&
              <NavItem>
                <NavLink
                  className={classnames({ active: toggleTab === 1}, "clickable", "")}
                  onClick={() => setToggleTab(1) }
                  >
                  Komentáre
                </NavLink>
              </NavItem>
            }
            { userRights.history && userRights.viewComments &&
              <NavItem>
                <NavLink>
                  |
                </NavLink>
              </NavItem>
            }
            { userRights.history &&
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
                id={id}
                comments={task ? task.comments : []}
                submitComment={ submitComment }
                submitEmail={ submitEmail }
                userRights={ userRights }
                users={users}
                />
            </TabPane>
            {	userRights.history &&
              <TabPane tabId={2}>
                <TaskHistory task={task} />
              </TabPane>
            }
          </TabContent>
        </div>
      </div>
    )
  }

  return (
    <div
      className={classnames(
        {
          'task-edit-width': !inModal
        },
        "flex",
        "min-height-400",
      )}
      >

      <div
        className={classnames(
          {"fit-with-header": !columns},
          {"fit-with-header-and-commandbar": columns},
          "scroll-visible",
        )}
        >
        { renderCommandbar() }
        <div
          className={classnames(
            {
              "row": layout === 2,
            },
          )}
          >
          <div
            className={classnames(
              "bkg-white",
              {
                "task-edit-left": layout === 2 && !columns,
                "task-edit-left-columns": (layout === 2 && columns) || layout === 1,
              },
            )}
            >

            <div>
              { renderTitle() }
              { layout === 2 && <hr className="m-t-5 m-b-15"/> }

              {canCreateVykazyError()}

              { layout === 1 ? renderSelectsLayout1() : null }

              { renderDescription() }

              { renderSimpleSubtasks() }


              { renderModalUserAdd() }

              { renderModalCompanyAdd() }

              { renderPendingPicker() }

              { renderVykazyTable() }

              { renderComments() }

              <div className="form-section"></div>

            </div>


          </div>

          { layout === 2 && renderSelectsLayout2Side() }
        </div>
      </div>
    </div>
  );
}