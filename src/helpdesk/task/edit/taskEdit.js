import React from 'react';
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
  ListGroupItem,
} from 'reactstrap';
import moment from 'moment';
import classnames from "classnames";
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import DatePicker from 'components/DatePicker';
import Empty from 'components/Empty';

import ck5config from 'configs/components/ck5config';
import {
  pickSelectStyle,
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
import Repeat from 'helpdesk/components/repeat/repeatFormInput';
import TaskHistory from 'helpdesk/components/taskHistory';
import TagsPickerPopover from 'helpdesk/components/tags';
import {
  getCreationError as getVykazyError,
} from 'helpdesk/components/vykazy/errors';
import Materials from 'helpdesk/components/vykazy/materialsTable';
import WorksTable from 'helpdesk/components/vykazy/worksTable';
import CheckboxList from 'helpdesk/components/checkboxList';
import StatusChangeModal from 'helpdesk/components/statusChangeModal';
import PendingPicker from 'helpdesk/components/pendingPicker';
import AddUserToGroup from 'helpdesk/settings/projects/addUserToGroup';

import TaskAdd from '../add';
import TaskPrint from './taskPrint';

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
  addLocalError,
} from 'apollo/localSchema/actions';
import {
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
import 'scss/direct/task-ckeditor.scss';

let fakeID = -1;

export default function TaskEdit( props ) {
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
    deleteTaskFunc,
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
    updateTask,
    updateInvoicedTask,
    client,
    setTaskLayout,
  } = props;

  //state
  const [ assignedTo, setAssignedTo ] = React.useState( [] );
  const [ closeDate, setCloseDate ] = React.useState( null );
  const [ company, setCompany ] = React.useState( null );
  const [ startsAt, setStartsAt ] = React.useState( null );
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
  const [ requester, setRequester ] = React.useState( null );
  const [ possibleStatus, setPossibleStatus ] = React.useState( null );
  const [ status, setStatus ] = React.useState( null );
  const [ showDescription, setShowDescription ] = React.useState( false );
  const [ tags, setTags ] = React.useState( [] );
  const [ taskType, setTaskType ] = React.useState( noTaskType );
  const [ taskTripPausal, setTaskTripPausal ] = React.useState( 0 );
  const [ taskWorkPausal, setTaskWorkPausal ] = React.useState( 0 );
  const [ title, setTitle ] = React.useState( "" );
  const [ ganttOrder, setGanttOrder ] = React.useState( 0 );

  const [ toggleTab, setToggleTab ] = React.useState( 1 );
  const [ usedSubtaskPausal, setUsedSubtaskPausal ] = React.useState( 0 );
  const [ usedTripPausal, setUsedTripPausal ] = React.useState( 0 );
  const [ tagsOpen, setTagsOpen ] = React.useState( false );
  const [ newAddedUser, setNewAddedUser ] = React.useState( null );

  const [ changes, setChanges ] = React.useState( {} );
  const [ vykazyChanges, setVykazyChanges ] = React.useState( defaultVykazyChanges );

  const invoicedTask = task.invoiced ? task.invoicedTasks[ 0 ] : null;

  // sync
  React.useEffect( () => {
    const project = task.project === null ? null : projects.find( ( project ) => project.id === task.project.id );
    const assignableUserIds = users.filter( ( user ) => project && project.usersWithRights.some( ( userData ) => userData.assignable && userData.user.id === user.id ) )
      .map( ( user ) => user.id );
    setChanges( {} );
    setTagsOpen( false );
    setVykazyChanges( defaultVykazyChanges );
    if ( task.invoiced ) {
      setAssignedTo( toSelArr( invoicedTask.assignedTo ) );
    } else {
      setAssignedTo( toSelArr( task.assignedTo, 'email' )
        .filter( ( user ) => assignableUserIds.includes( user.id ) ) );
    }
    setCloseDate( task.closeDate ? moment( parseInt( task.closeDate ) ) : null );
    setStartsAt( task.startsAt ? moment( parseInt( task.startsAt ) ) : null );
    setDeadline( task.deadline ? moment( parseInt( task.deadline ) ) : null );
    setDescription( task.description );
    setImportant( task.important );
    const milestone = project && task.milestone ? toSelArr( project.project.milestones )
      .find( ( milestone ) => milestone.id === task.milestone.id ) : undefined;
    setOvertime( ( task.overtime ? booleanSelects[ 1 ] : booleanSelects[ 0 ] ) );
    setPausal( ( task.pausal ? booleanSelects[ 1 ] : booleanSelects[ 0 ] ) );
    setPendingChangable( task.pendingChangable );
    setPendingDate( task.pendingDate ? moment( parseInt( task.pendingDate ) ) : null );
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
    setGanttOrder( task.ganttOrder );
    setUsedSubtaskPausal( task.company ? task.company.usedSubtaskPausal : 0 );
    setUsedTripPausal( task.company ? task.company.usedTripPausal : 0 );
  }, [ id ] );

  React.useEffect( () => {
    updateToProjectRules( project );
  }, [ project ] );

  const updateToProjectRules = ( project ) => {
    if ( !project ) {
      return;
    }

    const userRights = project.right;
    const projectUsers = users.filter( ( user ) => project.usersWithRights.some( ( userData ) => userData.user.id === user.id ) );
    const assignableUsers = users.filter( ( user ) => project.usersWithRights.some( ( userData ) => userData.assignable && userData.user.id === user.id ) );
    const projectRequesters = ( project.lockedRequester ? projectUsers : users );
    const def = project.project.def;
    const statuses = toSelArr( project.project.statuses );
    //check def required and fixed and change is needed (CHECK IF IT ALREADY ISNT SET) and can see the attribute
    let changes = {};
    //Status
    if ( userRights.statusRead ) {
      if ( def.status.fixed ) {
        if ( def.status.value && status.id !== def.status.value.id ) {
          changeStatus( statuses.find( ( status ) => status.id === def.status.value.id ) );
        }
      } else if ( def.status.required && status === null ) {
        let potentialStatus = statuses.find( ( status ) => status.action.toLowerCase() === 'isnew' );
        if ( !potentialStatus ) {
          potentialStatus = statuses[ 0 ];
        }
        changeStatus( potentialStatus );
      }
    }

    //Tags
    if ( userRights.tagsRead ) {
      if ( def.tag.fixed || ( def.tag.required && tags.length === 0 ) ) {
        let tagIds = def.tag.value.map( t => t.id );
        if ( tags.length !== tagIds.length || tags.some( ( tag ) => !tagsIds.includes( tag.id ) ) ) {
          setTags( project.tags.filter( ( item ) => tagIds.includes( item.id ) ) );
          changes.tags = tagIds;
        }
      }
    }

    //Assigned to
    if ( userRights.assignedRead ) {
      if ( def.assignedTo.fixed ) {
        let newAssignedTo = assignableUsers.filter( ( user1 ) => def.assignedTo.value.some( ( user2 ) => user1.id === user2.id ) );
        if ( newAssignedTo.length === 0 && userRights.assignedWrite ) {
          newAssignedTo = assignableUsers.filter( ( user ) => user.id === currentUser.id );
        }
        if ( newAssignedTo.length !== assignedTo.length || newAssignedTo.some( ( user1 ) => assignedTo.some( ( user2 ) => user1.id !== user2.id ) ) ) {
          changes.assignedTo = newAssignedTo.map( ( user ) => user.id );
        }
        setAssignedTo( newAssignedTo );
      } else if ( def.assignedTo.required && assignedTo.length === 0 ) {
        const newAssignedTo = assignableUsers.filter( ( user ) => user.id === currentUser.id );
        if ( newAssignedTo > 1 ) {
          changes.assignedTo = [ currentUser.id ];
          setAssignedTo( newAssignedTo );
        }
      }
    }

    //Requester
    let potentialRequester = null;
    if ( userRights.requesterRead ) {
      if ( def.requester.fixed || ( def.requester.required && requester === null ) ) {
        if ( def.requester.value ) {
          potentialRequester = projectRequesters.find( ( user ) => user.id === def.requester.value.id );
        } else {
          potentialRequester = projectRequesters.find( ( user ) => user.id === currentUser.id );
        }
        if ( potentialRequester && ( requester === null || requester.id !== potentialRequester.id ) ) {
          setRequester( potentialRequester );
          changes.requester = potentialRequester.id;
        }
      }
    }

    //Company
    let potentialCompany = null;
    if ( userRights.companyRead ) {
      if ( def.company.fixed || ( def.company.required && company === null ) ) {
        if ( def.company.value ) {
          potentialCompany = companies.find( ( company ) => company.id === def.company.value.id );
        } else if ( potentialRequester ) {
          potentialCompany = companies.find( ( company ) => company.id === potentialRequester.company.id );
        }
        if ( potentialCompany && ( company === null || company.id !== potentialCompany.id ) ) {
          setCompany( potentialCompany );
          changes.company = company.id;
          if ( !def.pausal.fixed ) {
            setPausal( parseInt( company.taskWorkPausal ) > 0 ? booleanSelects[ 1 ] : booleanSelects[ 0 ] );
            changes.pausal = parseInt( company.taskWorkPausal ) > 0
          }
        }
      }
    }

    //Task type
    if ( userRights.typeRead ) {
      if ( def.type.fixed || ( def.type.required && taskType === null ) ) {
        const newTaskType = taskTypes.find( ( type ) => type.id === def.type.value.id );
        if ( newTaskType && ( taskType === null || taskType.id !== newTaskType.id ) ) {
          setTaskType( newTaskType );
          changes.taskType = newTaskType.id;
        }
      }
    }

    //Pausal
    if ( userRights.pausalRead ) {
      if ( def.pausal.fixed && pausal.value !== def.pausal.value ) {
        setPausal( booleanSelects.find( ( option ) => option.value === def.pausal.value ) );
        changes.pausal = def.pausal.value;
      }
    }

    //Overtime
    if ( userRights.overtimeRead ) {
      if ( def.overtime.fixed && overtime.value !== def.overtime.value ) {
        setOvertime( booleanSelects.find( ( option ) => option.value === def.overtime.value ) );
        changes.overtime = def.overtime.value;
      }
    }
    //save all
    if ( Object.keys( changes )
      .length > 0 ) {
      autoUpdateTask( changes );
    }
  }

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
  const assignedTos = project ? users.filter( ( user ) => project.usersWithRights.some( ( userData ) => userData.assignable && userData.user.id === user.id ) ) : [];

  const requesters = ( project && project.project.lockedRequester ? toSelArr( project.usersWithRights.map( ( userWithRights ) => userWithRights.user ), 'fullName' ) : users );
  const milestones = [ noMilestone ].concat( ( project ? toSelArr( project.project.milestones ) : [] ) );

  const layout = 2; //currentUser.taskLayout

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
      ( compare.project === null && userRights.projectRead ) ||
      ( compare.assignedTo.length === 0 && userRights.assignedRead && defaultFields.assignedTo.fixed ) ||
      compare.saving ||
      ( defaultFields.tag.required && compare.tags.length === 0 && userRights.tagsRead )
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
        try {
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

        } catch {}

      } )
      .catch( ( err ) => {
        setChanges( {
          ...changes,
          ...change
        } );
        addLocalError( err );
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
        addLocalError( error );
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
    type: item.type ? toSelItem( item.type ) : null,
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

  const getTaskData = () => ( {
    shortSubtasks: task.shortSubtasks,
    subtasks: task.subtasks.map( item => ( {
      ...item,
      assignedTo: toSelItem( item.assignedTo, 'email' ),
      type: item.type ? toSelItem( item.type ) : null,
    } ) ),
    workTrips: task.workTrips.map( item => ( {
      ...item,
      assignedTo: toSelItem( item.assignedTo, 'email' ),
      type: toSelItem( item.type )
    } ) ),
    materials: task.materials,
    customItems: task.customItems,
    assignedTo,
    closeDate,
    company,
    startsAt,
    deadline,
    description,
    important,
    milestone,
    overtime,
    pausal,
    pendingChangable,
    pendingDate,
    potentialPendingStatus,
    project,
    requester,
    status,
    tags,
    taskType,
    title,
    ganttOrder,
  } )

  //Value Change
  const changeProject = ( project ) => {
    let newAssignedTo = assignedTo.filter( ( user ) => project.usersWithRights.some( ( projectUser ) => projectUser.assignable && projectUser.user.id === user.id ) );
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
      setPendingDate( moment()
        .add( 1, 'days' ) );
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
      <div className="task-add-layout row">
        {!columns && !inModal &&
          <button
            type="button"
            className="btn-link task-add-layout-button btn-distance"
            onClick={() => {
              history.push(`/helpdesk/taskList/i/${match.params.listID}`)
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
            className="btn-danger task-add-layout-button btn-distance"
            onClick={() => submitInvoicedTask(true)}
            >
            Re-open
          </button>
        }
        { task.invoiced && accessRights.vykazy && canEditInvoiced &&
          <button
            type="button"
            disabled={getCantSave()}
            className="btn-link task-add-layout-button btn-distance"
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
            className="btn-link task-add-layout-button btn-distance"
            onClick={deleteTaskFunc}
            >
            <i className="far fa-trash-alt" />
            Delete
          </button>
        }
        {false &&
          <button
            type="button"
            className="btn-link task-add-layout-button btn-distance"
            onClick={() => setTaskLayout(currentUser.taskLayout === 1 ? 2 : 1)}
            >
            <i className="fas fa-retweet "/>
            Layout
          </button>
        }

        { false && !task.invoiced && userRights.statusWrite &&
          (project ? toSelArr(project.project.statuses) : [])
          .filter((status) => !['Invoiced'].includes(status.action) )
          .map((possibleStatus) => (
            <button
              type="button"
              key={possibleStatus.id}
              className="btn-link task-add-layout-button btn-distance"
              style={ possibleStatus.id === status.id ? { color: status.color } : {}}
              onClick={() => setPossibleStatus(possibleStatus) }
              >
              { possibleStatus.icon.length > 3 &&
                <i
                  className={`${possibleStatus.icon} commandbar-command-icon`}
                  />
              }
              {possibleStatus.title}
            </button>
          ))
        }
        <span className="ml-auto">
          { inModal &&
            <button
              type="button"
              className="btn-link-cancel task-add-layout-button p-l-10 p-r-10 m-r-10"
              onClick={closeModal}
              >
              <i className="fa fa-times" style={{ fontSize: 25 }} />
            </button>
          }
        </span>
      </div>
    )
  }

  const canCreateVykazyError = () => {
    if (
      ( !userRights.vykazRead && !userRights.rozpocetRead ) ||
      getVykazyError( taskType, assignedTo.filter( ( user ) => user.id !== null ), company, userRights ) === ''
    ) {
      return null;
    }
    return (
      <div className="center-hor" style={{color: "#FF4500", height: "20px"}}>
        {getVykazyError(taskType, assignedTo.filter((user) => user.id !== null ), company, userRights )}
      </div>
    )
  }

  const renderTitle = () => {
    return (
      <div className="d-flex">
        { userRights.important &&
          <button
            type="button"
            style={{color: '#ffc107'}}
            disabled={ !userRights.important }
            className="btn-link center-hor m-r-10"
            onClick={()=>{
              setImportant(!important);
              autoUpdateTask({ important: !important });
            }}
            >
            <i className={`fa${ important ? 's' : 'r' } fa-star`} style={{ fontSize: 25 }} />
          </button>
        }
        <h2 className="center-hor">{id}: </h2>
        <span className="center-hor flex m-r-15">
          <input type="text"
            disabled={ !userRights.taskTitleEdit }
            value={title}
            className="task-title-input text-extra-slim hidden-input form-control"
            onChange={(e)=> {
              setTitle(e.target.value);
            }}
            onBlur={(e) => {
              autoUpdateTask({ title })
            }}
            placeholder="Enter task name"
            />
        </span>
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
      const datepickerDisabled = !status || status.action !== 'PendingDate' || !userRights.statusWrite || !pendingChangable;
      return (
        <div className="task-info ml-auto">
          <span className="center-hor">
            Pending date:
          </span>
          { datepickerDisabled ?
            (
              <span className="bolder center-hor m-l-3">
                {closeDate?(timestampToString(pendingDate.valueOf())):''}
              </span>
            ):
            (
              <DatePicker
                className="form-control hidden-input bolder"
                selected={pendingDate}
                disabled={datepickerDisabled}
                onChange={ (date) => {
                  setPendingDate(date);
                  if(date.valueOf() !== null){
                    autoUpdateTask({pendingDate: date.valueOf().toString()});
                  }
                }}
                placeholderText="No pending date"
                />
            )
          }
        </div>
      )
    }

    if ( status && (
        status.action === 'CloseDate' ||
        status.action === 'Invoiced' ||
        status.action === 'CloseInvalid'
      ) ) {
      const datepickerDisabled = !status || ( status.action !== 'CloseDate' && status.action !== 'CloseInvalid' ) || !userRights.statustatusWrite;
      return (
        <div className="task-info ml-auto">
          <span className="center-hor">
            Closed at:
          </span>
          { datepickerDisabled ?
            (
              <span className="bolder center-hor m-l-3">
                {closeDate?(timestampToString(closeDate.valueOf())):''}
              </span>
            ):
            (
              <DatePicker
                className="form-control hidden-input bolder"
                selected={closeDate}
                disabled={datepickerDisabled}
                onChange={date => {
                  setCloseDate(date);
                  if(date.valueOf() !== null){
                    autoUpdateTask({closeDate: date.valueOf().toString()});
                  }
                }}
                placeholderText="No pending date"
                />
            )
          }
        </div>
      )
    }
    return (
      <div className="task-info ml-auto">
        <span className="center-hor bolder">
          {task.statusChange ? ('Status changed at ' + timestampToString(task.statusChange) ) : ""}
        </span>
      </div>
    )
  }

  const layoutComponents = {
    Order: (
      <input
        className="form-control hidden-input"
        placeholder="Set order"
        value={ ganttOrder }
        onChange={(e)=> {
          setGanttOrder(e.target.value);
        }}
        onBlur={(e) => {
          if(!isNaN(parseInt(ganttOrder))){
            autoUpdateTask({ ganttOrder: parseInt(ganttOrder) })
          }else{
            autoUpdateTask({ ganttOrder: 0 })
            setGanttOrder(0);
          }
        }}
        />
    ),
    Project: (
      <Select
        placeholder="Zadajte projekt"
        isDisabled={ !userRights.projectWrite || task.invoiced }
        value={ project }
        onChange={ changeProject }
        options={ availableProjects }
        styles={pickSelectStyle([ 'noArrow', 'required', ])}
        />
    ),
    Assigned: (
      <div>
        { (defaultFields.assignedTo.fixed || !userRights.assignedWrite) &&
          <div> {assignedTo.map((user) =>
              <div className="disabled-info">{ user.label}</div>
            )}
            { assignedTo.length === 0 &&
              <div className="message error-message">Úloha nepriradená</div>
            }
          </div>
        }
        { userRights.assignedWrite &&
          <Select
            value={assignedTo}
            placeholder="Select reccomended"
            isMulti
            isDisabled={defaultFields.assignedTo.fixed || !userRights.assignedWrite}
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
            styles={pickSelectStyle( [ 'noArrow', ] )}
            />
        }
      </div>
    ),
    Status: (
      <div>
        { (defaultFields.status.fixed || !userRights.statusWrite || task.invoiced) &&
          <div className="disabled-info">{status ? status.label : "None"}</div>
        }
        { !defaultFields.status.fixed && userRights.statusWrite && !task.invoiced &&
          <Select
            placeholder="Status required"
            value={status}
            isDisabled={defaultFields.status.fixed || !userRights.statusWrite || task.invoiced}
            styles={pickSelectStyle( [ 'noArrow', 'colored', 'required', ] )}
            onChange={ changeStatus }
            options={(project ? toSelArr(project.project.statuses) : []).filter((status)=>status.action!=='Invoiced')}
            />
        }
      </div>
    ),
    Type: (
      <Select
        placeholder="Zadajte typ"
        value={taskType}
        isDisabled={ defaultFields.type.fixed || !userRights.typeWrite }
        styles={pickSelectStyle( [ 'noArrow', defaultFields.type.required ? 'required' : ''] )}
        onChange={(type)=> {
          setTaskType(type);
          autoUpdateTask({ taskType: type.id })
        }}
        options={[noTaskType, ...taskTypes]}
        />
    ),
    Milestone: (
      <div>
        { !userRights.milestoneWrite &&
          <div className="disabled-info">{milestone ? milestone.label : "None"}</div>
        }
        { userRights.milestoneWrite &&
          <Select
            isDisabled={!userRights.milestoneWrite}
            value={milestone}
            onChange={changeMilestone}
            options={milestones}
            styles={pickSelectStyle( [ 'noArrow', ] )}
            />
        }
      </div>
    ),
    Requester: (
      <div>
        { (defaultFields.requester.fixed || !userRights.requesterWrite) &&
          <div className="disabled-info">{requester ? requester.label : "None"}</div>
        }
        { !defaultFields.requester.fixed && userRights.requesterWrite &&
          <Select
            placeholder="Zadajte žiadateľa"
            value={requester}
            isDisabled={defaultFields.requester.fixed || !userRights.requesterWrite}
            onChange={changeRequester}
            options={(canAddUser?[{id:-1,title:'+ Add user',body:'add', label:'+ Add user',value:null}]:[]).concat(requesters)}
            styles={ pickSelectStyle([ 'noArrow', 'required', ])}
            />
        }
      </div>
    ),
    Company: (
      <div>
        { (defaultFields.company.fixed || !userRights.companyWrite) &&
          <div className="disabled-info">{company ? company.label : "None"}</div>
        }
        { !defaultFields.company.fixed && userRights.companyWrite &&
          <Select
            placeholder="Zadajte firmu"
            value={company}
            isDisabled={defaultFields.company.fixed || !userRights.companyWrite || task.invoiced}
            onChange={changeCompany}
            options={(canAddCompany ? [{id:-1,title:'+ Add company',body:'add', label:'+ Add company', value:null}] : [] ).concat(companies)}
            styles={pickSelectStyle([ 'noArrow', 'required', ])}
            />
        }
      </div>
    ),
    Pausal: (
      <div>
        { (!userRights.pausalWrite || !company || !company.monthly || defaultFields.pausal.fixed || parseInt(company.taskWorkPausal) < 0) &&
          <div className="disabled-info">{pausal ? pausal.label : "None"}</div>
        }
        { userRights.pausalWrite && company && company.monthly && (parseInt(company.taskWorkPausal) >= 0) && !defaultFields.pausal.fixed &&
          <Select
            value={company && parseInt(company.taskWorkPausal) === 0 && pausal.value === false ? {...pausal, label: pausal.label + " (nezmluvný)"} : pausal }
            isDisabled={!userRights.pausalWrite || !company || !company.monthly || parseInt(company.taskWorkPausal) < 0 || defaultFields.pausal.fixed}
            styles={pickSelectStyle([ 'noArrow', 'required', ]) }
            onChange={(pausal)=> {
              autoUpdateTask({ pausal: pausal.value })
              setPausal(pausal);
            }}
            options={booleanSelects}
            />
        }
      </div>
    ),
    StartsAt: (
      <div>
        { !userRights.deadlineWrite &&
          <div className="disabled-info">{startsAt}</div>
        }
        { userRights.deadlineWrite &&
          <DatePicker
            className={classnames("form-control")}
            selected={startsAt}
            disabled={!userRights.deadlineWrite}
            hideTime
            isClearable
            onChange={date => {
              setStartsAt( isNaN(date.valueOf()) ? null : date );
              autoUpdateTask({ startsAt: isNaN(date.valueOf()) ? null : date.valueOf().toString() });
            }}
            placeholderText="No start date"
            />
        }
      </div>
    ),
    Deadline: (
      <div>
        { !userRights.deadlineWrite &&
          <div className="disabled-info">{deadline}</div>
        }
        { userRights.deadlineWrite &&
          <DatePicker
            className={classnames("form-control")}
            selected={deadline}
            disabled={!userRights.deadlineWrite}
            hideTime
            isClearable
            onChange={date => {
              setDeadline( isNaN(date.valueOf()) ? null : date );
              autoUpdateTask({ deadline: isNaN(date.valueOf()) ? null : date.valueOf().toString() });
            }}
            placeholderText="No deadline"
            />
        }
      </div>
    ),
    Overtime: (
      <div>
        { (!userRights.overtimeWrite || defaultFields.overtime.fixed) &&
          <div className="disabled-info">{overtime.label}</div>
        }
        { userRights.overtimeWrite && !defaultFields.overtime.fixed &&
          <Select
            value={overtime}
            isDisabled={!userRights.overtimeWrite || defaultFields.overtime.fixed}
            styles={ pickSelectStyle([ 'noArrow', 'required', ]) }
            onChange={(overtime)=> {
              setOvertime(overtime);
              autoUpdateTask({ overtime: overtime.value })
            }}
            options={booleanSelects}
            />
        }
      </div>
    ),
  }

  const renderSelectsLayout1 = () => {
    return (
      <div className = "form-section form-selects-entries" >
        <div className="form-section-rest">
          <div className="col-12 row">
            { userRights.projectRead &&
              <div className="col-3">
                <div className="p-r-10">
                  <Label className="col-3 col-form-label">Projekt <span className="warning-big">*</span></Label>
                  <div className="col-9">
                    { layoutComponents.Project }
                  </div>
                </div>
              </div>
            }
            { userRights.assignedRead &&
              <div className="col-9" style={{border: "none"}}>
                <div className="p-r-10">
                  <Label className="col-1-45 col-form-label">Assigned <span className="warning-big">*</span></Label>
                  <div className="col-10-45" style={{maxWidth: "100%"}}>
                    { layoutComponents.Assigned }
                  </div>
                </div>
              </div>
            }
          </div>

          <div className="row">
            <div className="col-3">
              {userRights.statusRead &&
                <div className="p-r-10">
                  <Label className="col-form-label col-3 ">Status <span className="warning-big">*</span></Label>
                  <div className="col-9">
                    { layoutComponents.Status }
                  </div>
                </div>
              }
              { userRights.typeRead &&
                <div className="p-r-10">
                  <Label className="col-form-label  col-3">Typ <span className="warning-big">*</span></Label>
                  <div className="col-9">
                    { layoutComponents.Type }
                  </div>
                </div>
              }
              { userRights.milestoneRead &&
                <div className="p-r-10">
                  <Label className="col-form-label  col-3">Milestone</Label>
                  <div className="col-9">
                    { layoutComponents.Milestone }
                  </div>
                </div>
              }
            </div>

            <div className="col-3">
              {userRights.requesterRead &&
                <div className="p-r-10">
                  <Label className="col-form-label col-3 ">Zadal <span className="warning-big">*</span></Label>
                  <div className="col-9">
                    { layoutComponents.Requester }
                  </div>
                </div>
              }
              {userRights.companyRead &&
                <div className="p-r-10">
                  <Label className="col-form-label col-3 ">Firma <span className="warning-big">*</span></Label>
                  <div className="col-9">
                    { layoutComponents.Company }
                  </div>
                </div>
              }
            </div>

            <div className="col-3">
              {userRights.pausalRead &&
                <div className="p-r-10">
                  <Label className="col-form-label col-3 ">Paušál <span className="warning-big">*</span></Label>
                  <div className="col-9">
                    { layoutComponents.Pausal }
                  </div>
                </div>
              }
              { userRights.deadlineRead &&
                <div className="p-r-10">
                  <Label className="col-form-label col-3">Starts at</Label>
                  <div className="col-9">
                    { layoutComponents.StartsAt }
                  </div>
                </div>
              }
              { userRights.deadlineRead &&
                <div className="p-r-10">
                  <Label className="col-form-label col-3">Deadline</Label>
                  <div className="col-9">
                    { layoutComponents.Deadline }
                  </div>
                </div>
              }
            </div>
            <div className="col-3">
              { userRights.repeatRead &&
                <Repeat
                  disabled={!userRights.repeatWrite}
                  taskID={id}
                  duplicateTask={ !task.repeat ? getTaskData() : null}
                  repeat={task.repeat}
                  layout={layout}
                  repeatTime={task.repeatTime}
                  />
              }
              { userRights.overtimeRead &&
                <div className="p-r-10">
                  <Label className="col-form-label col-4">Mimo PH <span className="warning-big">*</span></Label>
                  <div className="col-9">
                    {layoutComponents.Overtime}
                  </div>
                </div>
              }
            </div>
          </div>
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
      <div className={classnames("task-edit-right", {"w-250px": columns})}>
        <div className="">
          { inModal &&
            <div className="task-edit-buttons row m-b-10">
              { userRights.important && false &&
                <button
                  type="button"
                  style={{color: '#ffc107'}}
                  disabled={ !userRights.important }
                  className="btn-link btn-distance p-0"
                  onClick={()=>{
                    autoUpdateTask({ important: !important })
                    setImportant(!important);
                  }}
                  >
                  <i className={`fa${ important ? 's' : 'r' } fa-star`} />
                </button>
              }
              <span className="ml-auto">

                { userRights.deleteTasks &&
                  <button
                    type="button"
                    className="btn-link-red btn-distance p-0"
                    onClick={deleteTaskFunc}
                    >
                    <i className="far fa-trash-alt" />
                  </button>
                }
                { project && canCopy &&
                  <TaskAdd
                    project={project.id}
                    task={task}
                    disabled={!canCopy}
                    noText
                    />
                }
                <button
                  type="button"
                  className="btn-link p-r-10"
                  onClick={closeModal}
                  >
                  <i className="fa fa-times" style={{ fontSize: 25 }} />
                </button>
              </span>
            </div>
          }
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
              <Label>Starts at</Label>
              <div className="form-selects-entry-column-rest" >
                { layoutComponents.StartsAt }
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
              vertical
              disabled={!userRights.repeatWrite}
              duplicateTask={ !task.repeat ? getTaskData() : null}
              taskID={id}
              repeat={task.repeat}
              repeatTime={task.repeatTime}
              layout={layout}
              />
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
      </div>
    );
  }

  const renderMultiSelectTags = () => {
    return (
      <Empty>
        { userRights.tagsRead && userRights.tagsWrite &&
          <TagsPickerPopover
            taskID={id}
            disabled={ defaultFields.tag.fixed || !userRights.tagsWrite }
            items={toSelArr(project === null ? [] : project.project.tags)}
            className="center-hor"
            selected={tags}
            onChange={(tags) => {
              setTags(tags);
              autoUpdateTask({ tags: tags.map((tag) => tag.id ) })
            }}
            />
        }

        { userRights.tagsRead && tags
          .sort( ( tag1, tag2 ) => tag1.order > tag2.order ? 1 : -1 )
          .map( ( tag ) => (
            <span key={tag.id} style={{ background: tag.color, color: 'white', borderRadius: 3 }} className="m-r-5 p-l-5 p-r-5">
              {tag.title}
            </span>
          ) )
        }
      </Empty>
    )
  }

  const renderDescription = () => {
    if ( !userRights.taskDescriptionRead && !userRights.taskAttachmentsRead ) {
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
                  autoUpdateTask({ description  })
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
              className="btn-link btn-distance"
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
          { userRights.taskAttachmentsWrite &&
            <label htmlFor={`uploadAttachment-${id}`} className="btn-link btn-distance m-l-0 clickable" >
              <i className="fa fa-plus" />
              Attachment
            </label>
          }
          { renderMultiSelectTags() }
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
    //hidden
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
        type="task"
        top={top}
        attachments={task.taskAttachments}
        addAttachments={addAttachments}
        removeAttachment={removeAttachment}
        />
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
      <Empty>
        <WorksTable
          userID={currentUser.id}
          userRights={userRights}
          currentUser={currentUser}
          company={company}
          showTotals={true}
          showColumns={ [ 'done', 'title', 'scheduled', 'quantity', 'assigned', 'approved', 'actions' ] }
          showAdvancedColumns={ [ 'done', 'title', 'quantity', 'price', 'discount', 'priceAfterDiscount' , 'actions' ] }
          autoApproved={project ? project.project.autoApproved : false}
          canAddSubtasksAndTrips={assignedTo.length !== 0}
          canEditInvoiced={canEditInvoiced}
          taskAssigned={assignedTo.filter((user) => user.id !== null )}

          taskTypes={taskTypes}
          defaultType={taskType}
          subtasks={ task.invoiced ? modifyInvoicedVykazy(subtasks, 'subtask') : subtasks }
          addSubtask={(newSubtask, price) => {
            if(task.invoiced){
              saveVykazyChanges({...newSubtask, price}, 'subtask', 'ADD' );
            }else{
              addSubtaskFunc(newSubtask);
            }
          }}
          updateSubtask={(id,newData)=>{
            let originalSubtask = subtasks.find((item)=>item.id===id);
            originalSubtask = {
              ...originalSubtask,
              scheduled: originalSubtask.scheduled ?
              {
                from: originalSubtask.scheduled.from,
                to: originalSubtask.scheduled.to,
              } :
              null
            }
            if(task.invoiced){
              saveVykazyChanges({id,newData}, 'subtask', 'EDIT' );
            }else{
              updateSubtaskFunc({...originalSubtask,...newData});
            }
          }}
          updateSubtasks={(multipleSubtasks)=>{
            if(task.invoiced){
              multipleSubtasks.forEach(({id, newData}) => {
                saveVykazyChanges({id,newData}, 'subtask', 'EDIT' );
              })
            } else {
              multipleSubtasks.forEach(({id, newData})=>{
                let originalSubtask = subtasks.find((item)=>item.id===id);
                originalSubtask = {
                  ...originalSubtask,
                  scheduled: originalSubtask.scheduled ?
                  {
                    from: originalSubtask.scheduled.from,
                    to: originalSubtask.scheduled.to,
                  } :
                  null
                }
                updateSubtaskFunc({...originalSubtask,...newData});
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
          addTrip={(newTrip, price)=>{
            if(task.invoiced){
              saveVykazyChanges( { ...newTrip, price }, 'trip', 'ADD' );
            }else{
              addWorkTripFunc(newTrip);
            }
          }}
          updateTrip={(id,newData)=>{
            let originalTrip = workTrips.find((item)=>item.id===id);
            originalTrip = {
              ...originalTrip,
              scheduled: originalTrip.scheduled ?
              {
                from: originalTrip.scheduled.from,
                to: originalTrip.scheduled.to,
              } :
              null
            }
            if(task.invoiced){
              saveVykazyChanges( {id, newData}, 'trip', 'EDIT' );
            }else{
              updateWorkTripFunc({...originalTrip,...newData});
            }
          }}
          updateTrips={(multipleTrips)=>{
            const originalTrips = workTrips.map((item)=>({
              ...item,
              scheduled:{
                from: item.scheduled.from,
                to: item.scheduled.to,
              }
            }));
            if(task.invoiced){
              multipleTrips.forEach(({id, newData}) => {
                saveVykazyChanges({id,newData}, 'trip', 'EDIT' );
              })
            } else {
              multipleTrips.forEach(({id, newData})=>{
                let originalTrip = workTrips.find((item)=>item.id===id);
                originalTrip = {
                  ...originalTrip,
                  scheduled: originalTrip.scheduled ?
                  {
                    from: originalTrip.scheduled.from,
                    to: originalTrip.scheduled.to,
                  } :
                  null
                }
                updateWorkTripFunc({...originalTrip,...newData});
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
          />
        {renderCompanyPausalInfo()}
        <Materials
          showColumns={ [ 'done', 'title', 'quantity', 'price', 'total', 'approved', 'actions' ] }
          showTotals={true}
          autoApproved={project ? project.project.autoApproved : false}
          userRights={userRights}
          currentUser={currentUser}
          company={company}
          materials={ task.invoiced ? modifyInvoicedVykazy(materials, 'material') : materials }
          addMaterial={(newMaterial)=>{
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
          />
      </Empty>
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

  const renderStatusChangeModal = () => {
    return (
      <StatusChangeModal
        open={possibleStatus !== null}
        userRights={ userRights }
        statuses={project ? toSelArr(project.project.statuses) : []}
        newStatus={possibleStatus}
        closeModal={ () => {
          setPossibleStatus(null);
        } }
        submit={(status, comment, date ) => {
          setPossibleStatus(null);
          setStatus( status );
          if ( status.action === 'PendingDate' ) {
            setPendingDate( date );
            autoUpdateTask( {
              status: status.id,
              pendingDate: date
              .valueOf()
              .toString(),
              pendingChangable: true,
            } );
          } else if ( status.action === 'CloseDate' || status.action === 'Invalid' ) {
            setCloseDate( date );
            autoUpdateTask( {
              status: status.id,
              closeDate: date
              .valueOf()
              .toString(),
            } );
          } else {
            autoUpdateTask( {
              status: status.id
            } );
          }
          if(comment.length > 0 ){
            submitComment({
              id,
              message: comment,
              attachments: [],
              parentCommentId: null,
              internal: false,
            })
          }
        }}
        />
    )
  }

  const renderModalUserAdd = () => {
    return (
      <Empty>
        <Modal isOpen={openUserAdd} className="modal-without-borders" >
          <ModalHeader>
            Add user
          </ModalHeader>
          <ModalBody>
            <UserAdd
              closeModal={() => setOpenUserAdd(false)}
              addUserToList={(user) => {
                setNewAddedUser(user);
              }}
              />
          </ModalBody>
        </Modal>
        { project && project.id &&
          <AddUserToGroup
            user={newAddedUser}
            disabled={ !userRights.projectSecondary }
            projectID={project.id}
            finish={() => setNewAddedUser(null)}
            />
        }
      </Empty>
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

  return (
    <div
      className={classnames(
        {
          'task-edit-width': !inModal
        },
        "flex",
        "min-height-400",
        {
          "basic-border-top": layout === 1
        }
      )}
      >

      <div
        className={classnames(
          {"fit-with-header": !columns && !inModal},
          {"fit-with-header-and-commandbar": columns && !inModal},
          {"scroll-visible": !inModal},
          {"scroll-x-auto": inModal},
        )}
        >
        { !inModal && renderCommandbar() }
        <div
          className={classnames(
            {
              "row":  layout === 2,
            },
          )}
          style={{minHeight: "calc(100% - 70px)"}}
          >
          <div
            className={classnames(
              {
                "task-edit-left":  layout === 2 && !columns,
                "task-edit-left-columns": (layout === 2 && columns) || layout === 1 || layout === 3,
              },
            )}
            >

            <div className="" >
              { renderTitle() }
              { layout === 2 && <hr className="m-t-5 m-b-2"/> }
              {renderTaskInfoAndDates()}

              {canCreateVykazyError()}

              { layout === 1 ? renderSelectsLayout1() : null }

              { renderDescription() }

              { renderSimpleSubtasks() }



              { renderPendingPicker() }

              { renderVykazyTable() }

              { renderComments() }

              { currentUser.role.accessRights.users && renderModalUserAdd() }

              { currentUser.role.accessRights.companies && renderModalCompanyAdd() }

              { renderStatusChangeModal() }

              <div className="form-section"></div>

            </div>


          </div>

          { layout === 2 && renderSelectsLayout2Side() }
        </div>
      </div>
    </div>
  );
}