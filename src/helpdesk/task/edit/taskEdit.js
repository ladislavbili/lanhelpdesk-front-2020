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
  invisibleSelectStyleNoArrowNoPadding,
  invisibleSelectStyleNoArrowColored,
  invisibleSelectStyleNoArrowColoredRequired,
  invisibleSelectStyleNoArrowColoredRequiredNoPadding,
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
let fakeID = -1;

import {
  defaultVykazyChanges,
  invoicedAttributes,
  noTaskType
} from '../constants';

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

  const [ viewOnly, setViewOnly ] = React.useState( true );
  const [ changes, setChanges ] = React.useState( {} );
  const [ vykazyChanges, setVykazyChanges ] = React.useState( defaultVykazyChanges );
  const [ updateTask ] = useMutation( UPDATE_TASK );
  const [ updateInvoicedTask ] = useMutation( UPDATE_INVOICED_TASK );

  const isInvoiced = task.status.action === 'Invoiced';
  const canEditInvoiced = accessRights.vykazy;
  const invoicedTask = isInvoiced ? task.invoicedTasks[ 0 ] : null;

  // sync
  React.useEffect( () => {
    setChanges( {} );
    setVykazyChanges( defaultVykazyChanges );
    if ( isInvoiced ) {
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
    if ( isInvoiced ) {
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

    if ( project ) {
      const viewOnly = !project.right.write || ( status.action === 'Invoiced' && !canEditInvoiced );
      setViewOnly( viewOnly );
    }
  }, [ id ] );

  //functions
  const getCantSave = ( change = {} ) => {
    const compare = {
      title,
      status,
      project,
      assignedTo,
      saving,
      viewOnly,
      isInvoiced,
      ...change,
    }
    return (
      compare.title === "" ||
      compare.status === null ||
      compare.project === null ||
      compare.assignedTo.length === 0 ||
      compare.saving ||
      compare.viewOnly
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
    if ( getCantSave( change ) || isInvoiced ) {
      setChanges( {
        ...changes,
        ...change
      } );
      return;
    }
    setSaving( true );
    let variables = {
      id,
      ...change,
      ...changes
    };
    setChanges( {} );

    updateTask( {
        variables
      } )
      .then( ( response ) => {
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
        console.log( err.message );
      } );

    setSaving( false );
  }

  const submitInvoicedTask = () => {
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
    if ( !isInvoiced ) {
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

  //constants
  const defaultFields = project === null ? noDef : {
    ...noDef,
    ...project.def
  };
  const userRights = !project ? {
    user: currentUser,
    read: false,
    write: false,
    delete: false,
    internal: false,
    isAdmin: false
  } : project.right;
  const canAddUser = accessRights.users;
  const canAddCompany = accessRights.companies;
  const canDelete = userRights.delete;
  const canCopy = userRights.write || title === "" || status === null || project === null || saving;
  const availableProjects = projects.filter( ( project ) => project.right.write );
  const assignedTos = project ? toSelArr( project.usersWithRights, 'fullName' ) : [];

  const requesters = ( project && project.project.lockedRequester ? toSelArr( project.usersWithRights, 'fullName' ) : users );
  const milestones = [ noMilestone ].concat( ( project ? toSelArr( project.project.milestones ) : [] ) );

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
      <div className={classnames( "bkg-white", "p-l-30", {"commandbar-small": columns}, {"commandbar": !columns})}> {/*Commandbar*/}
        <div className={classnames("d-flex", "flex-row", "center-hor", {"m-b-10": columns})}>
          <div className="display-inline center-hor">
            {!columns &&
              <button
                type="button"
                className="btn btn-link waves-effect"
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
            { project &&
              <TaskAdd
                project={project.id}
                task={task}
                disabled={canCopy}
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
            { canDelete &&
              <button
                type="button"
                disabled={!canDelete}
                className="btn btn-link waves-effect"
                onClick={deleteTaskFunc}
                >
                <i className="far fa-trash-alt" />
                Delete
              </button>
            }
            <button
              type="button"
              style={{color: important ? '#ffc107' : '#0078D4'}}
              disabled={viewOnly}
              className="btn btn-link waves-effect"
              onClick={()=>{
                autoUpdateTask({ important: !important })
                setImportant(!important);
              }}
              >
              <i className="far fa-star" />
              Important
            </button>
            { isInvoiced &&
              <button
                type="button"
                style={{color: important ? '#ffc107' : '#0078D4'}}
                disabled={getCantSave()}
                className="btn btn-link waves-effect"
                onClick={submitInvoicedTask}
                >
                <i className="far fa-save" />
                Save invoiced task
              </button>
            }
            <button
              type="button"
              className="btn btn-link waves-effect"
              onClick={() => setLayout(layout === 1 ? 2 : 1)}
              >
              <i className="fas fa-retweet "/>
              Layout
            </button>
            {
              (project ? toSelArr(project.project.statuses) : []).filter((status) => !['Invoiced'].includes(status.action) ).map((status) => (
                <button
                  type="button"
                  className="btn btn-link waves-effect"
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
    if ( getVykazyError( taskType, assignedTo.filter( ( user ) => user.id !== null ), company ) === '' ) {
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
      <div className="d-flex p-2">
        <div className="row flex">
          <h2 className="center-hor text-extra-slim">{id}: </h2>
          <span className="center-hor flex m-r-15">
            <input type="text"
              disabled={viewOnly}
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
    if ( status && status.action === 'PendingDate' ) {
      return (
        <div className="task-info">
            <span className="center-hor">
              Pending date:
            </span>
            <DatePicker
              className="form-control hidden-input bolder"
              selected={pendingDate}
              disabled={!status || status.action!=='PendingDate'||viewOnly||!pendingChangable}
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

    if ( status && ( status.action === 'CloseDate' || status.action === 'Invoiced' || status.action === 'CloseInvalid' ) ) {
      return (
        <div className="task-info">
            <span className="center-hor">
              Closed at:
            </span>
            <DatePicker
              className="form-control hidden-input bolder"
              selected={closeDate}
              disabled={!status || (status.action!=='CloseDate' && status.action!=='CloseInvalid')||viewOnly}
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
        isDisabled={ viewOnly }
        value={ project }
        onChange={ changeProject }
        options={ availableProjects }
        styles={layout === 2 ? invisibleSelectStyleNoArrowRequiredNoPadding : invisibleSelectStyleNoArrowRequired }
        />
    ),
    Assigned: (
      <Select
        value={assignedTo}
        placeholder="Select"
        isMulti
        isDisabled={defaultFields.assignedTo.fixed||viewOnly}
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
        styles={invisibleSelectStyleNoArrowRequired}
        />
    ),
    Status: (
      <Select
        placeholder="Status required"
        value={status}
        isDisabled={defaultFields.status.fixed || viewOnly}
        styles={layout === 2 ? invisibleSelectStyleNoArrowColoredRequiredNoPadding : invisibleSelectStyleNoArrowColoredRequired}
        onChange={ changeStatus }
        options={(project ? toSelArr(project.project.statuses) : []).filter((status)=>status.action!=='Invoiced')}
        />
    ),
    Type: (
      <Select
        placeholder="Zadajte typ"
        value={taskType}
        isDisabled={defaultFields.taskType.fixed||viewOnly}
        styles={invisibleSelectStyleNoArrowRequired}
        onChange={(type)=> {
          setTaskType(type);
          autoUpdateTask({ taskType: type.id })
        }}
        options={[noTaskType, ...taskTypes]}
        />
    ),
    Milestone: (
      <Select
        isDisabled={viewOnly}
        value={milestone}
        onChange={changeMilestone}
        options={milestones}
        styles={layout === 2 ? invisibleSelectStyleNoArrowNoPadding : invisibleSelectStyleNoArrow}
        />
    ),
    Requester: (
      <Select
        placeholder="Zadajte žiadateľa"
        value={requester}
        isDisabled={defaultFields.requester.fixed || viewOnly}
        onChange={changeRequester}
        options={(canAddUser?[{id:-1,title:'+ Add user',body:'add', label:'+ Add user',value:null}]:[]).concat(requesters)}
        styles={layout === 2 ? invisibleSelectStyleNoArrowRequiredNoPadding : invisibleSelectStyleNoArrowRequired}
        />
    ),
    Company: (
      <Select
        placeholder="Zadajte firmu"
        value={company}
        isDisabled={defaultFields.company.fixed || viewOnly}
        onChange={changeCompany}
        options={(canAddCompany ? [{id:-1,title:'+ Add company',body:'add', label:'+ Add company', value:null}] : [] ).concat(companies)}
        styles={layout === 2 ? invisibleSelectStyleNoArrowRequiredNoPadding : invisibleSelectStyleNoArrowRequired}
        />
    ),
    Pausal: (
      <Select
        value={company && parseInt(company.taskWorkPausal) === 0 && pausal.value === false ? {...pausal, label: pausal.label + " (nezmluvný)"} : pausal }
        isDisabled={viewOnly || !company || !company.monthly || parseInt(company.taskWorkPausal) < 0 || defaultFields.pausal.fixed}
        styles={invisibleSelectStyleNoArrowRequired}
        onChange={(pausal)=> {
          autoUpdateTask({ pausal: pausal.value })
          setPausal(pausal);
        }}
        options={booleanSelects}
        />
    ),
    Deadline: (
      <DatePicker
        className="form-control hidden-input"
        selected={deadline}
        disabled={viewOnly}
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
        isDisabled={viewOnly || defaultFields.overtime.fixed}
        styles={invisibleSelectStyleNoArrowRequired}
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
      <div>
        <div className="col-12 row">
          <div className="col-4">
            <div className="row p-r-10">
              <Label className="col-3 col-form-label">Projekt</Label>
              <div className="col-9">
                { layoutComponents.Project }
              </div>
            </div>
          </div>
          { defaultFields.assignedTo.show &&
            <div className="col-8" style={{ marginLeft: -5 }}>
              <div className="row p-r-10">
                <Label className="col-1-5 col-form-label">Assigned</Label>
                <div className="col-10-5">
                  { layoutComponents.Assigned }
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
                { layoutComponents.Status }
              </div>
            </div>
          }
          { defaultFields.taskType.show &&
            <div className="display-inline">
              <Label className="col-form-label w-8">Typ</Label>
              <div className="display-inline-block w-25 p-r-10">
                { layoutComponents.Type }
              </div>
            </div>
          }
          <div className="display-inline">
            <Label className="col-form-label w-8">Milestone</Label>
            <div className="display-inline-block w-25 p-r-10">
              { layoutComponents.Milestone }
            </div>
          </div>
          { defaultFields.requester.show &&
            <div className="display-inline">
              <Label className="col-form-label w-8">Zadal</Label>
              <div className="display-inline-block w-25 p-r-10">
                { layoutComponents.Requester }
              </div>
            </div>
          }
          { defaultFields.company.show &&
            <div className="display-inline">
              <Label className="col-form-label w-8">Firma</Label>
              <div className="display-inline-block w-25 p-r-10">
                { layoutComponents.Company }
              </div>
            </div>
          }
          {	defaultFields.pausal.show &&
            <div className="display-inline">
              <Label className="col-form-label w-8">Paušál</Label>
              <div className="display-inline-block w-25 p-r-10">
                { layoutComponents.Pausal }
              </div>
            </div>
          }
          <div className="display-inline">
            <Label className="col-form-label w-8">Deadline</Label>
            <div className="display-inline-block w-25 p-r-10">
              { layoutComponents.Deadline }
            </div>
          </div>
          <div className="display-inline">
            <Repeat
              disabled={viewOnly}
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
              />
          </div>
          {	defaultFields.overtime.show &&
            <div className="display-inline">
              <Label className="col-form-label w-8">Mimo PH</Label>
              <div className="display-inline-block w-25 p-r-10">
                {layoutComponents.Overtime}
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
        <div className="col-2" >
          <Label className="col-form-label">Status</Label>
          { layoutComponents.Status }
        </div>

        <div className="col-2">
          <Label className="col-form-label">Projekt</Label>
          { layoutComponents.Project }
        </div>

        <div className="col-2">
          <Label className="col-form-label">Milestone</Label>
          { layoutComponents.Milestone }
        </div>
        { defaultFields.requester.show &&
          <div className="col-2">
            <Label className="col-form-label">Zadal</Label>
            { layoutComponents.Requester }
          </div>
        }
        { defaultFields.company.show &&
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
      <div className={classnames(
        {
          "task-edit-right": !columns,
          "task-edit-right-columns": columns
        },
      )}>
        <div className="col-form-label-2" >
          <Label className="col-form-value-2">Status</Label>
          { layoutComponents.Status }
        </div>

        <div className="col-form-label-2">
          <Label className="col-form-value-2">Projekt</Label>
          { layoutComponents.Project }
        </div>

        <div className="col-form-label-2">
          <Label className="col-form-value-2">Milestone</Label>
          { layoutComponents.Milestone }
        </div>
        { defaultFields.requester.show &&
          <div className="col-form-label-2">
            <Label className="col-form-value-2">Zadal</Label>
            { layoutComponents.Requester }
          </div>
        }
        { defaultFields.company.show &&
          <div className="col-form-label-2">
            <Label className="col-form-value-2">Firma</Label>
            { layoutComponents.Company }
          </div>
        }
        { defaultFields.assignedTo.show &&
          <div>
            <Label className="col-form-label-2">Assigned</Label>
            <div className="col-form-value-2" style={{marginLeft: "-5px"}}>
              {layoutComponents.Assigned}
            </div>
          </div>
        }

        <div>
          <Label className="col-form-label m-l-7">Deadline</Label>
          <div className="col-form-value-2" style={{marginLeft: "-1px"}}>
            {layoutComponents.Deadline}
          </div>
        </div>

        <Repeat
          disabled={viewOnly}
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
          />
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

        { defaultFields.taskType.show &&
          <div>
            <label className="col-form-label m-l-7">Task Type</label>
            <div className="col-form-value-2">
              { layoutComponents.Type }
            </div>
          </div>
        }
        {	defaultFields.pausal.show &&
          <div>
            <label className="col-form-label m-l-7">Paušál</label>
            <div className="col-form-value-2">
              {layoutComponents.Pausal}
            </div>
          </div>
        }
        {	defaultFields.overtime.show &&
          <div>
            <label className="col-form-label-2">Mimo PH</label>
            <div className="col-form-value-2">
              {layoutComponents.Overtime}
            </div>
          </div>
        }
      </div>
    );
  }

  const renderTags = () => {
    if ( !defaultFields.tag.show ) {
      return null;
    }
    return (
      <div className="row f-1">
        <div className="center-hor">
          <Label className="center-hor">Tagy: </Label>
        </div>
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
            isDisabled={defaultFields.tag.fixed||viewOnly}
            styles={invisibleSelectStyleNoArrowColored}
            />
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
    let RenderDescription = null;
    if ( viewOnly ) {
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
          RenderDescription = <div className=""></div>
        }
      }
    }
    return (
      <div>
        <div>
          <Label className="col-form-label-description">
            Popis úlohy
            <button
              className="btn btn-link waves-effect m-l-5"
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
          </Label>
        </div>
        {RenderDescription}
      </div>
    )
  }

  const renderCompanyPausalInfo = () => {
    if ( !company || !company.monthlyPausal ) {
      return null;
    }
    return (
      <div>
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
      </div>
    )
  }

  const renderSimpleSubtasks = () => {
    return (
      <CheckboxList
        disabled={false}
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
    return (
      <Attachments
        disabled={viewOnly}
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
      <Modal isOpen={openUserAdd} >
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
      <Modal isOpen={openCompanyAdd}>
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
    return (
      <PendingPicker
        open={pendingOpen}
        prefferedMilestone={milestone}
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
    return (
      <VykazyTable
        showColumns={ (viewOnly ? [0,1,2,3,4,5,6,7] : [0,1,2,3,4,5,6,7,8]) }
        showTotals={false}
        disabled={(viewOnly || getCantSave()) && !canEditInvoiced }
        isInvoiced={isInvoiced}
        canEditInvoiced={canEditInvoiced}
        company={company}
        match={match}
        taskID={id}
        taskAssigned={assignedTo.filter((user) => user.id !== null )}

        showSubtasks={project ? project.showSubtasks : false}

        submitService={(newService, price) => {
          if(isInvoiced){
            saveVykazyChanges({...newService, price}, 'subtask', 'ADD' );
          }else{
            addSubtaskFunc(newService);
          }
        }}
        subtasks={ isInvoiced ? modifyInvoicedVykazy(subtasks, 'subtask') : subtasks }
        defaultType={taskType}
        taskTypes={taskTypes}
        updateSubtask={(id,newData)=>{
          if(isInvoiced){
            saveVykazyChanges({id,newData}, 'subtask', 'EDIT' );
          }else{
            updateSubtaskFunc({...subtasks.find((item)=>item.id===id),...newData});
          }
        }}
        updateSubtasks={(multipleSubtasks)=>{
          if(isInvoiced){
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
          if(isInvoiced){
            saveVykazyChanges( id, 'subtask', 'DELETE' );
          }else{
            deleteSubtaskFunc(id);
          }
        }}
        workTrips={ isInvoiced ? modifyInvoicedVykazy(workTrips, 'trip') : workTrips }
        tripTypes={tripTypes}
        submitTrip={(newTrip, price)=>{
          if(isInvoiced){
            saveVykazyChanges( { ...newTrip, price }, 'trip', 'ADD' );
          }else{
            addWorkTripFunc(newTrip);
          }
        }}
        updateTrip={(id,newData)=>{
          if(isInvoiced){
            saveVykazyChanges( {id, newData}, 'trip', 'EDIT' );
          }else{
            updateWorkTripFunc({...workTrips.find((trip)=>trip.id===id),...newData});
          }
        }}
        updateTrips={(multipleTrips)=>{
          if(isInvoiced){
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
          if(isInvoiced){
            saveVykazyChanges( id, 'trip', 'DELETE' );
          }else{
            deleteWorkTripFunc(id);
          }
        }}

        materials={ isInvoiced ? modifyInvoicedVykazy(materials, 'material') : materials }
        submitMaterial={(newMaterial)=>{
          if(isInvoiced){
            saveVykazyChanges( newMaterial, 'material', 'ADD' );
          }else{
            addMaterialFunc(newMaterial);
          }
        }}
        updateMaterial={(id,newData)=>{
          if(isInvoiced){
            saveVykazyChanges( {id,newData}, 'material', 'EDIT' );
          }else{
            updateMaterialFunc({...materials.find((material)=>material.id===id),...newData});
          }
        }}
        updateMaterials={(multipleMaterials)=>{
          if(isInvoiced){
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
          if(isInvoiced){
            saveVykazyChanges( id, 'material', 'DELETE' );
          }else{
            deleteMaterialFunc(id);
          }
        }}
        customItems={ isInvoiced ? modifyInvoicedVykazy(customItems, 'customItem') : customItems }
        submitCustomItem={(customItem)=>{
          if(isInvoiced){
            saveVykazyChanges( customItem, 'customItem', 'ADD' );
          }else{
            addCustomItemFunc(customItem);
          }
        }}
        updateCustomItem={(id,newData)=>{
          if(isInvoiced){
            saveVykazyChanges( {id,newData}, 'customItem', 'EDIT' );
          }else{
            updateCustomItemFunc({...customItems.find( (customItem) => customItem.id === id ),...newData});
          }
        }}
        updateCustomItems={(multipleCustomItems)=>{
          if(isInvoiced){
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
          if(isInvoiced){
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
          { userRights.write &&
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
              showInternal={accessRights.viewInternal || currentUser.role === 0 }
              users={users}
              />
          </TabPane>
          {	userRights.write &&
            <TabPane tabId={2}>
              <TaskHistory task={task} />
            </TabPane>
          }
        </TabContent>
      </div>
    )
  }

  return (
    <div
      className={classnames(
        "flex",
        "no-wrap-content"
      )}
      >

      <div
        className={classnames(
          {"fit-with-header": !columns},
          {"fit-with-header-and-commandbar": columns},
          "scroll-visible",
          { "row": layout === 2},
        )}
        >
        <div
          className={classnames(
            "bkg-white",
            {
              "task-edit-left": layout === 2 && !columns,
              "task-edit-left-columns": layout === 2 && columns
            },
          )}
          >
          { renderCommandbar() }

          <div className="p-l-30 p-r-30">
            { renderTitle() }
            <hr className="m-t-5 m-b-5"/>
            { renderTagsAndInfo() }

            {canCreateVykazyError()}

            { layout === 1 ? renderSelectsLayout1() : null }

            { renderDescription() }

            { renderSimpleSubtasks() }

            { renderAttachments(false) }

            { renderCompanyPausalInfo() }

            { renderModalUserAdd() }

            { renderModalCompanyAdd() }

            { renderPendingPicker() }

            { renderVykazyTable() }

            { renderComments() }

          </div>


        </div>

        { layout === 2 && renderSelectsLayout2Side() }

      </div>
    </div>
  );
}