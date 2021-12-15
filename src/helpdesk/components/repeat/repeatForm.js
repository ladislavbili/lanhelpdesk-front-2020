import React from 'react';
import {
  useMutation,
  useApolloClient,
} from "@apollo/client";

import Select from 'react-select';
import {
  Label,
} from 'reactstrap';
import CKEditor from '@ckeditor/ckeditor5-react';
import ck5config from 'configs/components/ck5config';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import axios from 'axios';
import moment from 'moment';
import classnames from "classnames";

import DatePicker from 'components/DatePicker';
import MultiSelect from 'components/MultiSelectNew';
import Empty from 'components/Empty';
import SimpleRepeat from 'helpdesk/components/repeat/simpleRepeat';

import Attachments from 'helpdesk/task/components/attachments';
import TagsPickerPopover from 'helpdesk/task/components/tags';
import ShortSubtasks from 'helpdesk/task/components/shortSubtasks';
import Materials from 'helpdesk/task/components/vykazy/materialsTable';
import WorksTable from 'helpdesk/task/components/vykazy/worksTable';

import {
  useTranslation
} from "react-i18next";

import {
  pickSelectStyle,
} from 'configs/components/select';
import booleanSelects from 'configs/constants/boolSelect';
import {
  noMilestone
} from 'configs/constants/sidebar';
import {
  GET_TASK
} from 'helpdesk/task/queries';
import {
  ADD_REPEAT,
  UPDATE_REPEAT,
  DELETE_REPEAT,
  GET_REPEAT,
  GET_REPEATS,
} from './queries';

import {
  REST_URL
} from 'configs/restAPI';
import {
  intervals
} from 'configs/constants/repeat';

import {
  defaultVykazyChanges,
  noTaskType
} from 'helpdesk/task/constants';

import {
  getEmptyAttributeRights,
  backendCleanRights,
} from 'configs/constants/projects';

import {
  addLocalError,
} from 'apollo/localSchema/actions';

import {
  getCreationError as getVykazyError
} from 'helpdesk/task/components/vykazy/errors';

import {
  toSelArr,
  toSelItem,
  deleteAttributes,
  translateAllSelectItems,
} from 'helperFunctions';

let fakeID = -1;


export default function RepeatForm( props ) {
  //data & queries
  const {
    currentUser,
    projects,
    originalRepeat,
    editMode,
    users,
    taskTypes,
    tripTypes,
    companies,
    defaultUnit,
    closeModal,
    taskID,
    duplicateTask,
    addShortSubtaskFunc,
    updateShortSubtaskFunc,
    deleteShortSubtaskFunc,
    addSubtaskFunc,
    updateSubtaskFunc,
    deleteSubtaskFunc,
    addWorkTripFunc,
    updateWorkTripFunc,
    deleteWorkTripFunc,
    addMaterialFunc,
    updateMaterialFunc,
    deleteMaterialFunc,
    addAttachments,
    removeAttachment,
    directSaving,
    newStartsAt,
  } = props;

  const {
    t
  } = useTranslation();

  const client = useApolloClient();
  let counter = 0;

  const getNewID = () => {
    return counter++;
  }

  const currentUserIfInProject = ( project ) => {
    return project && project.users.some( ( userData ) => userData.user.id === currentUser.id ) ? users.find( ( user ) => user.id === currentUser.id ) : null;
  }

  const [ addRepeat ] = useMutation( ADD_REPEAT );
  const [ updateRepeat ] = useMutation( UPDATE_REPEAT );
  const [ deleteRepeat ] = useMutation( DELETE_REPEAT );

  //state
  const [ layout, setLayout ] = React.useState( 2 );
  const [ tagsOpen, setTagsOpen ] = React.useState( false );

  const [ project, setProject ] = React.useState( null );
  const projectUsers = users.filter( ( user ) => project && project.users.some( ( user2 ) => user2.id === user.id ) );
  const assignableUsers = users.filter( ( user ) => project && project.users.some( ( user2 ) => user2.user.id === user.id && user2.assignable ) );
  const [ changes, setChanges ] = React.useState( {} );
  const [ important, setImportant ] = React.useState( false );
  const [ attachments, setAttachments ] = React.useState( [] );
  const [ assignedTo, setAssignedTo ] = React.useState( assignableUsers.filter( ( user ) => user.id === currentUser.id ) );
  const [ closeDate, setCloseDate ] = React.useState( null );
  const [ company, setCompany ] = React.useState( null );
  const [ deadline, setDeadline ] = React.useState( null );
  const [ showDescription, setShowDescription ] = React.useState( false );
  const [ description, setDescription ] = React.useState( "" );
  const [ descriptionVisible, setDescriptionVisible ] = React.useState( false );
  const [ milestone, setMilestone ] = React.useState( [ noMilestone ] );
  const [ overtime, setOvertime ] = React.useState( translateAllSelectItems( booleanSelects, t )[ 0 ] );
  const [ pausal, setPausal ] = React.useState( translateAllSelectItems( booleanSelects, t )[ 0 ] );
  const [ pendingDate, setPendingDate ] = React.useState( null );
  const [ pendingChangable, setPendingChangable ] = React.useState( false );
  const [ requester, setRequester ] = React.useState(
    project !== null ?
    currentUserIfInProject( project ) :
    null
  );
  const [ saving, setSaving ] = React.useState( false );
  const [ wasSaved, setWasSaved ] = React.useState( false );
  const [ wasDisabled, setWasDisabled ] = React.useState( false );
  const [ status, setStatus ] = React.useState( null );
  const [ subtasks, setSubtasks ] = React.useState( [] );
  const [ tags, setTags ] = React.useState( [] );
  const [ materials, setMaterials ] = React.useState( [] );
  const [ taskType, setTaskType ] = React.useState( null );
  const [ title, setTitle ] = React.useState( "" );
  const [ workTrips, setWorkTrips ] = React.useState( [] );
  const [ repeat, setRepeat ] = React.useState( null );

  const [ simpleSubtasks, setSimpleSubtasks ] = React.useState( [] );

  const userRights = (
    project ? {
      rights: project.right,
      attributeRights: project.attributeRights
    } :
    backendCleanRights()
  );
  const projectAttributes = (
    project ?
    project.projectAttributes :
    getEmptyAttributeRights()
  );

  const requesters = ( project && project.lockedRequester ? projectUsers : users );

  const setDefaults = ( project ) => {
    if ( project === null || !project.projectAttributes ) {
      return;
    }

    updateToProjectRules( project );
  }

  const updateToProjectRules = ( project ) => {
    if ( !project ) {
      return;
    }

    const userRights = {
      rights: project.right,
      attributeRights: project.attributeRights
    };

    const projectAttributes = project.projectAttributes;

    const projectUsers = users.filter( ( user ) => project.users.some( ( userData ) => userData.user.id === user.id ) );
    const assignableUsers = users.filter( ( user ) => project.users.some( ( userData ) => userData.assignable && userData.user.id === user.id ) );
    const projectRequesters = ( project.lockedRequester ? projectUsers : users );
    const statuses = toSelArr( project.statuses );
    //check projectAttributes fixed and change is needed (CHECK IF IT ALREADY ISNT SET) and can see the attribute
    let changes = {};
    //Status
    if ( userRights.attributeRights.status.view ) {
      if ( projectAttributes.status.fixed ) {
        if ( projectAttributes.status.value && status.id !== projectAttributes.status.value.id ) {
          changeStatus( statuses.find( ( status ) => status.id === projectAttributes.status.value.id ) );
        }
      }
    }

    //Tags
    if ( userRights.attributeRights.tags.view ) {
      if ( projectAttributes.tags.fixed ) {
        let tagIds = projectAttributes.tags.value.map( t => t.id );
        if ( tags.length !== tagIds.length || tags.some( ( tag ) => !tagsIds.includes( tag.id ) ) ) {
          setTags( project.tags.filter( ( item ) => tagIds.includes( item.id ) ) );
          changes.tags = tagIds;
        }
      }
    }

    //Assigned to
    if ( userRights.attributeRights.assigned.view ) {
      if ( projectAttributes.assigned.fixed ) {
        let newAssignedTo = assignableUsers.filter( ( user1 ) => projectAttributes.assigned.value.some( ( user2 ) => user1.id === user2.id ) );
        if ( newAssignedTo.length === 0 && userRights.attributeRights.assigned.edit ) {
          newAssignedTo = assignableUsers.filter( ( user ) => user.id === currentUser.id );
        }
        if ( newAssignedTo.length !== assignedTo.length || newAssignedTo.some( ( user1 ) => assignedTo.some( ( user2 ) => user1.id !== user2.id ) ) ) {
          changes.assignedTo = newAssignedTo.map( ( user ) => user.id );
        }
        setAssignedTo( newAssignedTo );
      }
    }

    //Requester
    let potentialRequester = null;
    if ( userRights.attributeRights.requester.view ) {
      if ( projectAttributes.requester.fixed ) {
        if ( projectAttributes.requester.value ) {
          potentialRequester = projectRequesters.find( ( user ) => user.id === projectAttributes.requester.value.id );
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
    if ( userRights.attributeRights.company.view ) {
      if ( projectAttributes.company.fixed ) {
        if ( projectAttributes.company.value ) {
          potentialCompany = companies.find( ( company ) => company.id === def.company.value.id );
        } else if ( potentialRequester ) {
          potentialCompany = companies.find( ( company ) => company.id === potentialRequester.company.id );
        }
        if ( potentialCompany && ( company === null || company.id !== potentialCompany.id ) ) {
          setCompany( potentialCompany );
          changes.company = company.id;
          if ( !projectAttributes.pausal.fixed ) {
            setPausal( parseInt( company.taskWorkPausal ) > 0 ? translateAllSelectItems( booleanSelects, t )[ 1 ] : translateAllSelectItems( booleanSelects, t )[ 0 ] );
            changes.pausal = parseInt( company.taskWorkPausal ) > 0
          }
        }
      }
    }

    //Task type
    if ( userRights.attributeRights.taskType.view ) {
      if ( projectAttributes.taskType.fixed ) {
        const newTaskType = taskTypes.find( ( type ) => type.id === projectAttributes.taskType.value.id );
        if ( newTaskType && ( taskType === null || taskType.id !== newTaskType.id ) ) {
          setTaskType( newTaskType );
          changes.taskType = newTaskType.id;
        }
      }
    }

    //Deadline
    if ( userRights.attributeRights.deadline.view ) {
      if ( projectAttributes.deadline.fixed && deadline.valueOf()
        .toString() !== projectAttributes.deadline.value ) {
        setDeadline( projectAttributes.deadline.value ? moment( parseInt( projectAttributes.deadline.value ) ) : null );
        changes.deadline = projectAttributes.deadline.value;
      }
    }

    //Pausal
    if ( userRights.attributeRights.pausal.view ) {
      if ( projectAttributes.pausal.fixed && pausal.value !== projectAttributes.pausal.value ) {
        setPausal( translateAllSelectItems( booleanSelects, t )
          .find( ( option ) => option.value === projectAttributes.pausal.value ) );
        changes.pausal = projectAttributes.pausal.value;
      }
    }

    //Overtime
    if ( userRights.attributeRights.overtime.view ) {
      if ( projectAttributes.overtime.fixed && overtime.value !== projectAttributes.overtime.value ) {
        setOvertime( translateAllSelectItems( booleanSelects, t )
          .find( ( option ) => option.value === projectAttributes.overtime.value ) );
        changes.overtime = projectAttributes.overtime.value;
      }
    }
    //save all
    if ( Object.keys( changes )
      .length > 0 ) {
      saveChange( changes );
    }
  }

  const setOriginalRepeat = () => {
    const data = originalRepeat.repeatTemplate;
    setChanges( newStartsAt ? {
      repeat: {
        repeatEvery: originalRepeat.repeatEvery,
        repeatInterval: originalRepeat.repeatInterval,
        startsAt: newStartsAt.toString(),
        active: originalRepeat.active,
      }
    } : {} );
    setAssignedTo( toSelArr( data.assignedTo, 'fullName' ) );
    setCloseDate( moment( parseInt( data.closeDate ) ) );
    setDeadline( data.deadline ? moment( parseInt( data.deadline ) ) : null );
    setDescription( data.description );
    setImportant( data.important );
    setRepeat( {
      repeatEvery: originalRepeat.repeatEvery,
      repeatInterval: intervals.find( ( interval ) => interval.value === originalRepeat.repeatInterval ),
      startsAt: newStartsAt ? moment( newStartsAt ) : moment( parseInt( originalRepeat.startsAt ) ),
      active: originalRepeat.active,
    } )
    const project = projects.find( ( project ) => project.id === data.project.id );
    /*
    const milestone = project && data.milestone ? toSelArr( project.milestones )
    .find( ( milestone ) => milestone.id === data.milestone.id ) : undefined;
    setMilestone( milestone === undefined ? noMilestone : milestone );
    */
    setOvertime( ( data.overtime ? translateAllSelectItems( booleanSelects, t )[ 1 ] : translateAllSelectItems( booleanSelects, t )[ 0 ] ) );
    setPausal( ( data.pausal ? translateAllSelectItems( booleanSelects, t )[ 1 ] : translateAllSelectItems( booleanSelects, t )[ 0 ] ) );
    setPendingChangable( data.pendingChangable );
    setPendingDate( moment( parseInt( data.pendingDate ) ) );
    const status = ( data.status ? toSelItem( data.status ) : null )
    setStatus( status );
    setTags( toSelArr( data.tags ) );
    setTaskType( ( data.taskType ? toSelItem( data.taskType ) : noTaskType ) );

    setCompany( ( data.company ? toSelItem( data.company ) : null ) );
    setRequester(
      data.requester ? {
        ...data.requester,
        value: data.requester.id,
        label: data.requester.fullName
      } :
      null
    );
    setProject( project );
    setTitle( data.title );
    setAttachments( data.repeatTemplateAttachments );
    setSimpleSubtasks( data.shortSubtasks );
    setSubtasks( data.subtasks.map( item => ( {
      ...item,
      assignedTo: toSelItem( item.assignedTo, 'fullName' ),
      type: toSelItem( item.type )
    } ) ) );
    setWorkTrips( data.workTrips.map( item => ( {
      ...item,
      assignedTo: toSelItem( item.assignedTo, 'fullName' ),
      type: toSelItem( item.type )
    } ) ) );
    setMaterials( data.materials );
  }

  const setTaskData = () => {
    setAssignedTo( duplicateTask.assignedTo );
    setCloseDate( duplicateTask.closeDate );
    setDeadline( duplicateTask.deadline );
    setDescription( duplicateTask.description );
    setImportant( duplicateTask.important );
    setOvertime( duplicateTask.overtime );
    setPausal( duplicateTask.pausal );
    setPendingChangable( duplicateTask.pendingChangable );
    setPendingDate( duplicateTask.pendingDate );
    setStatus( duplicateTask.status );
    setTags( duplicateTask.tags );
    setTaskType( duplicateTask.taskType );

    setCompany( duplicateTask.company );
    //setMilestone( duplicateTask.milestone );
    setRequester( duplicateTask.requester );
    setProject( projects.find( ( project ) => duplicateTask.project.project.id === project.id ) );
    setTitle( duplicateTask.title );
    setSimpleSubtasks( duplicateTask.shortSubtasks.map( ( item ) => ( {
      ...item,
      id: fakeID--
    } ) ) );
    setSubtasks( duplicateTask.subtasks.map( ( item ) => ( {
      ...item,
      id: fakeID--
    } ) ) );
    setWorkTrips( duplicateTask.workTrips.map( ( item ) => ( {
      ...item,
      id: fakeID--
    } ) ) );
    setMaterials( duplicateTask.materials.map( ( item ) => ( {
      ...item,
      id: fakeID--
    } ) ) );
  }

  React.useEffect( () => {
    setDefaults( project );
  }, [ project ] );

  React.useEffect( () => {
    if ( editMode ) {
      setOriginalRepeat();
    } else if ( duplicateTask ) {
      setTaskData();
    }
  }, [] );

  const deleteRepeatFunc = () => {
    if ( window.confirm( t( 'deleteRepeatMessage' ) ) ) {
      if ( editMode ) {
        deleteRepeat( {
            variables: {
              id: originalRepeat.id,
            }
          } )
          .then( ( response ) => {
            updateTask( response, 'delete' );
            closeModal( true, true );
          } )
          .catch( ( err ) => {
            addLocalError( err );
            setSaving( false );
          } )
      }
    }
  }

  const saveChange = ( change ) => {
    if ( editMode ) {
      setChanges( {
        ...changes,
        ...change
      } );
    }
  }

  const triggerSave = () => {
    setSaving( true );
    if ( editMode ) {
      const newRepeatData = changes.repeat;
      const repeatTemplate = deleteAttributes( changes, [ 'repeat' ] );
      const variables = {
        id: originalRepeat.id,
        ...( newRepeatData ? newRepeatData : {} ),
        ...(
          repeatTemplate ? {
            repeatTemplate
          } : {}
        )
      }
      setWasSaved( true );
      setWasDisabled( newRepeatData && newRepeatData.active );
      updateRepeat( {
          variables
        } )
        .then( ( response ) => {
          updateTask( response, 'update' );
          setChanges( {} );
          setSaving( false );
          //update repeat
          updateRepeatData( response );
        } )
        .catch( ( err ) => {
          addLocalError( err );
          setSaving( false );
        } )
    } else {
      addRepeat( {
          variables: {
            active: repeat.active,
            taskId: taskID ? taskID : undefined,
            repeatInterval: repeat.repeatInterval.value,
            startsAt: repeat.startsAt.valueOf()
              .toString(),
            repeatEvery: parseInt( repeat.repeatEvery ),
            repeatTemplate: {
              title,
              closeDate: closeDate ? closeDate.valueOf()
                .toString() : null,
              assignedTo: assignedTo.map( user => user.id ),
              company: company ? company.id : null,
              deadline: deadline ? deadline.valueOf()
                .toString() : null,
              description,
              milestone: /*milestone ? milestone.id :*/ null,
              overtime: overtime.value,
              pausal: pausal.value,
              pendingChangable,
              pendingDate: pendingDate ? pendingDate.valueOf()
                .toString() : null,
              project: project.id,
              requester: requester ? requester.id : null,
              status: status.id,
              tags: tags.map( tag => tag.id ),
              taskType: taskType ? taskType.id : null,
              subtasks: subtasks.map( item => ( {
                title: item.title,
                order: item.order,
                done: item.done,
                quantity: item.quantity,
                discount: item.discount,
                type: item.type.id,
                assignedTo: item.assignedTo.id
              } ) ),
              workTrips: workTrips.map( item => ( {
                order: item.order,
                done: item.done,
                quantity: item.quantity,
                discount: item.discount,
                type: item.type.id,
                assignedTo: item.assignedTo.id
              } ) ),
              materials: materials.map( item => ( {
                title: item.title,
                order: item.order,
                done: item.done,
                quantity: item.quantity,
                margin: item.margin,
                price: parseFloat( item.price )
              } ) ),
              shortSubtasks: simpleSubtasks.map( ( item ) => ( {
                done: item.done,
                title: item.title,
              } ) ),
            }
          }
        } )
        .then( ( response ) => {
          if ( attachments.length > 0 ) {
            const formData = new FormData();
            attachments.map( ( attachment ) => attachment.data )
              .forEach( ( file ) => formData.append( `file`, file ) );
            formData.append( "token", `Bearer ${sessionStorage.getItem( "acctok" )}` );
            formData.append( "taskId", response.data.addTask.id );
            axios.post( `${REST_URL}/upload-repeat-template-attachments`, formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              } )
              .then( ( response2 ) => {
                if ( response2.data.ok ) {
                  updateTask( response, 'add' );
                  setSaving( false );
                  closeModal( true, repeat.active );
                } else {
                  setSaving( false );
                }
              } )
              .catch( ( err ) => {
                addLocalError( err );
                setSaving( false );
              } );
          } else {
            updateTask( response, 'add' );
            setSaving( false );
            closeModal( true, repeat.active );
          }
        } )
        .catch( ( err ) => {
          addLocalError( err );
          setSaving( false );
        } );
    }
  }

  const updateRepeatData = ( response ) => {
    const repeat = client.readQuery( {
        query: GET_REPEAT,
        variables: {
          id: originalRepeat.id
        },
      } )
      .repeat;

    const updatedRepeat = {
      ...repeat,
      ...response.data.updateRepeat
    }

    client.writeQuery( {
      query: GET_REPEAT,
      variables: {
        id: repeat.id
      },
      data: {
        repeat: updatedRepeat
      }
    } );
  }

  const updateTask = ( response, type ) => {
    if ( taskID && type === 'update' ) {
      const repeat = response.data.updateRepeat;
      const task = client.readQuery( {
          query: GET_TASK,
          variables: {
            id: taskID,
          },
        } )
        .task;
      client.writeQuery( {
        query: GET_TASK,
        variables: {
          id: taskID,
        },
        data: {
          task: {
            ...task,
            repeat: {
              ...task.repeat,
              active: repeat.active,
              repeatEvery: repeat.repeatEvery,
              repeatInterval: repeat.repeatInterval,
              startsAt: repeat.startsAt,
            }
          }
        }
      } );
    } else if ( taskID && type === 'add' ) {
      const repeat = response.data.addRepeat;
      const task = client.readQuery( {
          query: GET_TASK,
          variables: {
            id: taskID,
          },
        } )
        .task;
      client.writeQuery( {
        query: GET_TASK,
        variables: {
          id: taskID,
        },
        data: {
          task: {
            ...task,
            repeat: {
              ...task.repeat,
              active: repeat.active,
              repeatEvery: repeat.repeatEvery,
              repeatInterval: repeat.repeatInterval,
              startsAt: repeat.startsAt,
            }
          }
        }
      } );
    } else if ( taskID && type === 'delete' ) {
      const task = client.readQuery( {
          query: GET_TASK,
          variables: {
            id: taskID,
          },
        } )
        .task;
      client.writeQuery( {
        query: GET_TASK,
        variables: {
          id: taskID,
        },
        data: {
          task: {
            ...task,
            repeat: null
          }
        }
      } );
    }
  }

  //data functions
  const changeProject = ( project ) => {
    setProject( project );
    let newAssignedTo = assignedTo.filter( ( user ) => project.users.some( ( projectUser ) => projectUser.assignable && projectUser.user.id === user.id ) );
    setAssignedTo( newAssignedTo );
    //setMilestone( noMilestone );
    setTags( [] );
    setStatus( null );
    if ( editMode ) {
      saveChange( {
        project: project.id,
        tags: [],
        status: null,
        assignedTo: newAssignedTo.map( ( user ) => user.id ),
        //milestone: null
      } )
    }
  }

  const changeStatus = ( status ) => {
    if ( status.action === 'PendingDate' ) {
      setStatus( status );
      setPendingDate( moment()
        .add( 1, 'd' ) );
      saveChange( {
        status,
        pendingDate: moment()
          .add( 1, 'd' )
          .valueOf()
          .toString()
      } )
    } else if ( status.action === 'CloseDate' || status.action === 'CloseInvalid' ) {
      setStatus( status );
      setCloseDate( moment() );
      saveChange( {
        status,
        closeDate: moment()
          .valueOf()
          .toString()
      } )
    } else {
      setStatus( status );
      saveChange( {
        status,
      } )
    }
  }
  /*
  const changeMilestone = ( milestone ) => {
  if ( status.action === 'PendingDate' ) {
  if ( milestone.startsAt !== null ) {
  setMilestone( milestone );
  setPendingDate( moment( milestone.startsAt ) );
  setPendingChangable( false );
  saveChange( {
  milestone: milestone.id,
  pendingDate: moment( milestone.startsAt )
  .valueOf()
  .toString(),
  pendingChangable: false
  } )
  } else {
  setMilestone( milestone );
  setPendingChangable( true );
  saveChange( {
  milestone: milestone.id,
  pendingChangable: true
  } )
  }
  } else {
  setMilestone( milestone );
  saveChange( {
  milestone: milestone.id
  } )
  }
  }
  */

  const changeRepeat = ( repeat ) => {
    if ( !userRights.attributeRights.repeat.edit ) {
      return;
    }
    setRepeat( repeat );
    saveChange( {
      repeat: {
        active: repeat.active,
        repeatInterval: repeat.repeatInterval.value,
        startsAt: repeat.startsAt.valueOf()
          .toString(),
        repeatEvery: repeat.repeatEvery
      }
    } )
  }

  const cantSave = (
    saving ||
    directSaving ||
    title === "" ||
    status === null ||
    project === null ||
    ( assignedTo.length === 0 && userRights.attributeRights.assigned.view && !projectAttributes.assigned.fixed ) ||
    repeat === null ||
    ( !company && userRights.attributeRights.company.view ) ||
    ( editMode && Object.keys( changes )
      .length === 0 && !newStartsAt )
  )

  //RENDERS
  const renderHeader = () => {
    return (
      <div className="task-edit-buttons row m-b-10 m-l-20 m-r-20 m-t-20">
        <h2 className="center-hor">{`${ !editMode ? t('addRepeat') : t('editRepeat') }`}</h2>
        <span className="ml-auto">
          { editMode && userRights.attributeRights.repeat.edit &&
            <button
              type="button"
              className="btn-link-red btn-distance p-0"
              onClick={deleteRepeatFunc}
              >
              <i className="far fa-trash-alt" />
            </button>
          }
          <button
            type="button"
            className="btn-link p-r-10"
            onClick={() => closeModal(wasSaved, wasDisabled)}
            >
            <i className="fa fa-times" style={{ fontSize: 25 }} />
          </button>
        </span>

      </div>
    )
  }

  const renderTitle = () => {
    return (
      <div className="d-flex">
        { userRights.rights.taskImportant &&
          <button
            type="button"
            style={{color: '#ffc107'}}
            className="btn-link center-hor m-r-10"
            onClick={()=>{
              setImportant(!important);
              saveChange({ important: !important });
            }}
            >
            <i className={`fa${ important ? 's' : 'r' } fa-star`} style={{ fontSize: 25 }} />
          </button>
        }
        { editMode && <h2 className="center-hor">{originalRepeat.id}: </h2> }
        <span className="center-hor flex m-r-15">
          <input type="text"
            value={title}
            className="task-title-input text-extra-slim hidden-input form-control"
            onChange={(e)=> {
              setTitle(e.target.value);
              saveChange({ title: e.target.value })
            }}
            placeholder={t('taskTitlePlaceholder')}
            />
        </span>
      </div>
    );
  }

  const renderStatusDate = () => {
    if ( !userRights.attributeRights.status.view || !status ) {
      return null;
    }

    if ( status.action === 'PendingDate' ) {
      const datepickerDisabled = !userRights.attributeRights.status.edit || !pendingChangable;
      return (
        <div className="task-info ml-auto">
          <span className="center-hor">
            {t('pendingDate')}:
          </span>
          { datepickerDisabled ?
            (
              <span className="bolder center-hor m-l-3">
                { closeDate ? (timestampToString(pendingDate.valueOf())) : '' }
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
                    saveChange({pendingDate: date.valueOf().toString()});
                  }
                }}
                placeholderText={t('pendingDateLabel')}
                />
            )
          }
        </div>
      )
    }

    if (
      status.action === 'CloseDate' ||
      status.action === 'Invoiced' ||
      status.action === 'CloseInvalid'
    ) {
      const datepickerDisabled = ( status.action !== 'CloseDate' && status.action !== 'CloseInvalid' ) || !userRights.attributeRights.status.edit;
      return (
        <div className="task-info ml-auto">
          <span className="center-hor">
            {t('closedAt')}:
          </span>
          { datepickerDisabled ?
            (
              <span className="bolder center-hor m-l-3">
                { closeDate ? (timestampToString(closeDate.valueOf())) : '' }
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
                    saveChange({closeDate: date.valueOf().toString()});
                  }
                }}
                placeholderText={t('pendingDateLabel')}
                />
            )
          }
        </div>
      )
    }
    return null;
  }

  const layoutComponents = {
    Project: (
      <Select
        placeholder={t('selectProject')}
        value={project}
        onChange={changeProject}
        options={projects.filter((project) => currentUser.role.level === 0 || (project.right.addTask && project.right.repeatWrite ) )}
        styles={pickSelectStyle([ 'noArrow', 'required', ])}
        />
    ),
    Assigned: (
      <div>
        { (projectAttributes.assigned.fixed || !userRights.attributeRights.assigned.edit) &&
          <div>
            { assignedTo.map((user) => (
              <div className="disabled-info">{user.label}</div>
            ) )}
            { assignedTo.length === 0 &&
              <div className="message error-message">{t('taskNotAssigned')}</div>
            }
          </div>
        }
        { !projectAttributes.assigned.fixed && userRights.attributeRights.assigned.edit &&
          <Select
            value={assignedTo}
            placeholder={t('selectReccomended')}
            isMulti
            onChange={(users)=> {
              setAssignedTo(users);
              saveChange({ assignedTo: users.map((user) => user.id) })
            }}
            options={assignableUsers}
            styles={pickSelectStyle( [ 'noArrow', ] )}
            />
        }
      </div>
    ),
    Status: (
      <div>
        { (projectAttributes.status.fixed || !userRights.attributeRights.status.edit) &&
          <div className="disabled-info">{status ? status.label : t('none')}</div>
        }
        { !projectAttributes.status.fixed && userRights.attributeRights.status.edit &&
          <Select
          placeholder={t('statusPlaceholder')}
            value={status}
            styles={pickSelectStyle( [ 'noArrow', 'colored', 'required', ] )}
            onChange={ changeStatus }
            options={(project ? toSelArr(project.statuses) : []).filter( (status) => status.action !== 'Invoiced' )}
            />
        }
      </div>
    ),
    Type: (
      <Select
      placeholder={t('taskTypePlaceholder')}
        value={taskType}
        isDisabled={ projectAttributes.taskType.fixed || !userRights.attributeRights.taskType.edit }
        styles={ pickSelectStyle( [ 'noArrow', ] ) }
        onChange={ (taskType) => {
          setTaskType(taskType);
          saveChange({ taskType: taskType.id })
        }}
        options={taskTypes}
        />
    ),
    Requester: (
      <div>
        { (projectAttributes.requester.fixed || !userRights.attributeRights.requester.edit) &&
          <div className="disabled-info">{requester ? requester.label : t('none')}</div>
        }
        { !projectAttributes.requester.fixed && userRights.attributeRights.requester.edit &&
          <Select
            placeholder={t('requesterPlaceholder')}
            value={requester}
            onChange={(requester)=>{
              setRequester(requester);
              if(!editMode){
                const newCompany = companies.find((company) => company.id === requester.id );
                setCompany(newCompany);
              }
              saveChange({
                requester: requester.id
              })
            }}
            options={requesters}
            styles={ pickSelectStyle([ 'noArrow', 'required', ])}
            />
        }
      </div>
    ),
    Company: (
      <div>
        { (projectAttributes.company.fixed || !userRights.attributeRights.company.edit) &&
          <div className="disabled-info">{company ? company.label : t('none')}</div>
        }
        { !projectAttributes.company.fixed && userRights.attributeRights.company.edit &&
          <Select
            placeholder={t('companyPlaceholder')}
            value={company}
            onChange={(company)=> {
              setCompany(company);
              setPausal(company.monthly ? translateAllSelectItems(booleanSelects, t)[1] : translateAllSelectItems(booleanSelects, t)[0]);
              saveChange({
                requester: company.id,
                pausal: company.monthly
              })
            }}
            options={companies}
            styles={pickSelectStyle([ 'noArrow', 'required', ])}
            />
        }
      </div>
    ),
    Pausal: (
      <div>
        { ( !userRights.attributeRights.pausal.edit || !company || !company.monthly || projectAttributes.pausal.fixed ) &&
          <div className="disabled-info">{ pausal ? pausal.label : t('none') }</div>
        }
        { userRights.attributeRights.pausal.edit && company && company.monthly && !projectAttributes.pausal.fixed &&
          <Select
            value={ pausal }
            placeholder={t('selectRequired')}
            styles={pickSelectStyle([ 'noArrow', 'required', ]) }
            onChange={(pausal)=> { setPausal(pausal); saveChange({ pausal: pausal.value }) }}
            options={translateAllSelectItems(booleanSelects, t)}
            />
        }
      </div>
    ),
    Deadline: (
      <div>
        { (projectAttributes.deadline.fixed || !userRights.attributeRights.deadline.edit) &&
          <div className="disabled-info">{deadline}</div>
        }
        { !projectAttributes.deadline.fixed && userRights.attributeRights.deadline.edit &&
          <DatePicker
            className={classnames("form-control")}
            selected={deadline}
            hideTime
            isClearable
            onChange={date => {
              setDeadline(date);
              if( date.valueOf() !== null ){
                saveChange({ deadline: date.valueOf().toString() })
              }
            }}
            placeholderText={t('deadlinePlaceholder')}
            />
        }
      </div>
    ),
    Overtime: (
      <div>
        { (projectAttributes.overtime.fixed || !userRights.attributeRights.overtime.edit) &&
          <div className="disabled-info">{overtime.label}</div>
        }
        { !projectAttributes.overtime.fixed && userRights.attributeRights.overtime.edit &&
          <Select
            value={overtime}
            placeholder={t('selectRequired')}
            styles={ pickSelectStyle([ 'noArrow', 'required', ]) }
            onChange={(overtime) => { setOvertime(overtime); saveChange({ overtime: pausal.value }); }}
            options={translateAllSelectItems(booleanSelects, t)}
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
            <div className="col-4">
              <div className="row p-r-10">
                <Label className="col-3 col-form-label">{t('project')}<span className="warning-big">*</span></Label>
                <div className="col-9">
                  { layoutComponents.Project }
                </div>
              </div>
            </div>
            { userRights.attributeRights.assigned.view &&
              <div className="col-8">
                <div className="row p-r-10">
                  <Label className="col-1-45 col-form-label">{t('assignedTo')}<span className="warning-big">*</span></Label>
                  <div className="col-10-45">
                    { layoutComponents.Assigned }
                  </div>
                </div>
              </div>
            }
          </div>

          <div className="row">
            <div className="col-4">
              { userRights.attributeRights.status.view &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">{t('status')}<span className="warning-big">*</span></Label>
                  <div className="col-9">
                    { layoutComponents.Status }
                  </div>
                </div>
              }

              { userRights.attributeRights.taskType.view &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">{t('taskType')}</Label>
                  <div className="col-9">
                    { layoutComponents.Type }
                  </div>
                </div>
              }

            </div>

            <div className="col-4">
              { userRights.attributeRights.requester.view &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">{t('requester')}<span className="warning-big">*</span></Label>
                  <div className="col-9">
                    { layoutComponents.Requester }
                  </div>
                </div>
              }
              { userRights.attributeRights.company.view &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">{t('company')}<span className="warning-big">*</span></Label>
                  <div className="col-9">
                    { layoutComponents.Company }
                  </div>
                </div>
              }
              { userRights.attributeRights.pausal.view &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">{t('pausal')}<span className="warning-big">*</span></Label>
                  <div className="col-9">
                    { layoutComponents.Pausal }
                  </div>
                </div>
              }
            </div>

            <div className="col-4">
              { userRights.attributeRights.deadline.view &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">{t('deadline')}</Label>
                  <div className="col-9">
                    { layoutComponents.Deadline }
                  </div>
                </div>
              }

              { userRights.attributeRights.repeat.view &&
                <SimpleRepeat
                  taskID={null}
                  repeat={repeat}
                  submitRepeat={changeRepeat}
                  columns={true}
                  vertical={false}
                  addTask={true}
                  />
              }
              { userRights.attributeRights.overtime.view &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">{t('overtimeShort')} <span className="warning-big">*</span></Label>
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
          <Label className="col-form-label">{t('project')}</Label>
          { layoutComponents.Project }
        </div>
        { userRights.attributeRights.status.view &&
          <div className="col-2" >
            <Label className="col-form-label">{t('status')}</Label>
            { layoutComponents.Status }
          </div>
        }
        { userRights.attributeRights.requester.view &&
          <div className="col-2">
            <Label className="col-form-label">{t('requester')}</Label>
            { layoutComponents.Requester }
          </div>
        }
        { userRights.attributeRights.company.view &&
          <div className="col-2">
            <Label className="col-form-label">{t('company')}</Label>
            { layoutComponents.Company }
          </div>
        }
      </div>
    )
  }

  const renderSelectsLayout2Side = () => {
    return (
      <div className="task-edit-right p-b-20 m-t-0">
        <div className="form-selects-entry-column" >
          <Label>{t('project')} <span className="warning-big">*</span></Label>
          <div className="form-selects-entry-column-rest" >
            { layoutComponents.Project }
          </div>
        </div>
        { userRights.attributeRights.status.view &&
          <div className="form-selects-entry-column" >
            <Label>{t('status')}<span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Status }
            </div>
          </div>
        }
        { userRights.attributeRights.requester.view &&
          <div className="form-selects-entry-column" >
            <Label>{t('requester')}<span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Requester }
            </div>
          </div>
        }
        { userRights.attributeRights.company.view &&
          <div className="form-selects-entry-column" >
            <Label>{t('company')}<span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Company }
            </div>
          </div>
        }
        { userRights.attributeRights.assigned.view &&
          <div className="form-selects-entry-column" >
            <Label>{t('assignedTo')}<span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Assigned }
            </div>
          </div>
        }
        { userRights.attributeRights.deadline.view &&
          <div className="form-selects-entry-column" >
            <Label>{t('deadline')}</Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Deadline }
            </div>
          </div>
        }
        { userRights.attributeRights.repeat.view &&
          <SimpleRepeat
            taskID={null}
            repeat={repeat}
            submitRepeat={changeRepeat}
            columns={true}
            addTask={true}
            vertical={true}
            />
        }
        { userRights.attributeRights.taskType.view &&
          <div className="form-selects-entry-column" >
            <Label>{t('taskType')}</Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Type }
            </div>
          </div>
        }
        { userRights.attributeRights.pausal.view &&
          <div className="form-selects-entry-column" >
            <Label>{t('pausal')}<span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Pausal }
            </div>
          </div>
        }
        { userRights.attributeRights.overtime.view &&
          <div className="form-selects-entry-column" >
            <Label>{t('overtimeShort')}<span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Overtime }
            </div>
          </div>
        }
      </div>
    )
  }

  const renderMultiSelectTags = () => {
    return (
      <Empty>
        <span className="m-l-10"/>
        { userRights.attributeRights.tags.edit &&
          <TagsPickerPopover
            taskID={`repeat-${ editMode ? originalRepeat.id : 'add' }`}
            disabled={ projectAttributes.tags.fixed }
            items={toSelArr(project === null ? [] : project.tags)}
            className="center-hor"
            selected={tags}
            onChange={ (tags) => { setTags(tags); saveChange({ tags: tags.map((tag) => tag.id ) }) }}
            />
        }

        { userRights.attributeRights.tags.view &&
          tags.sort( ( tag1, tag2 ) => tag1.order > tag2.order ? 1 : -1 )
          .map( ( tag ) => (
            <span style={{ background: tag.color, color: 'white', borderRadius: 3 }} key={tag.id} className="m-r-5 p-l-5 p-r-5">
              {tag.title}
            </span>
          ) )
        }
      </Empty>
    )
  }

  const renderDescription = () => {
    if ( !userRights.rights.taskDescriptionRead && !userRights.rights.taskAttachmentsRead ) {
      return null;
    }
    let RenderDescription = null;
    if ( !userRights.rights.taskDescriptionWrite ) {
      if ( description.length !== 0 ) {
        RenderDescription = <div className="task-edit-popis" dangerouslySetInnerHTML={{__html:description }} />
      } else {
        RenderDescription = <div className="task-edit-popis">{t('noDescription')}</div>
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
          RenderDescription = <div className="task-edit-popis">{t('noDescription')}</div>
        }
      }
    }
    return (
      <div className="form-section">
        <div className="row" style={{alignItems: "baseline"}}>
          <Label className="m-r-10">{t('taskDescription')}</Label>
          { userRights.rights.taskDescriptionWrite &&
            <button
              className="btn-link btn-distance"
              style={{height: "20px"}}
              onClick={()=>{
                if(showDescription){
                  saveChange({ description  })
                }
                setShowDescription(!showDescription);
              }}
              >
              <i className={`fa fa-${!showDescription ? 'pen' : 'save' }`} />
              { !showDescription ? t('edit') : t('save') }
            </button>
          }
          { userRights.rights.taskAttachmentsWrite &&
            <label htmlFor={`uploadAttachment-${null}`} className="btn-link m-l-0" >
              <i className="fa fa-plus" />
              {t('attachment')}
            </label>
          }
          {renderMultiSelectTags()}
        </div>
        <div  className="form-section-rest">
          {RenderDescription}
          {
            renderAttachments(false)
          }
        </div>
      </div>
    )
  }

  const renderSimpleSubtasks = () => {
    if ( !userRights.rights.taskSubtasksRead ) {
      return null;
    }
    return (
      <ShortSubtasks
        disabled={!userRights.rights.taskSubtasksWrite}
        items={simpleSubtasks}
        onChange={(simpleSubtask) => {
          if(editMode){
            updateShortSubtaskFunc(simpleSubtask);
          }
          let newSimpleSubtasks = [...simpleSubtasks];
          newSimpleSubtasks[newSimpleSubtasks.findIndex((simpleSubtask2) => simpleSubtask2.id === simpleSubtask.id )] = simpleSubtask;
          setSimpleSubtasks(newSimpleSubtasks);
        }}
        submitItem = { (newSimpleSubtask) => {
          if(editMode){
            addShortSubtaskFunc(
              {...newSimpleSubtask, repeatTemplate: originalRepeat.repeatTemplate.id},
              (id) => {
                setSimpleSubtasks([
                  ...simpleSubtasks,
                  {
                    ...newSimpleSubtask,
                    id,
                  }
                ])
              }
            );
          }else{
            setSimpleSubtasks([
              ...simpleSubtasks,
              {
                ...newSimpleSubtask,
                id: fakeID--,
              }
            ])
          }
        }}
        deleteItem = { (simpleSubtask) => {
          if(editMode){
            deleteShortSubtaskFunc(simpleSubtask.id)
          }
          setSimpleSubtasks(simpleSubtasks.filter((simpleSubtask2) => simpleSubtask.id !== simpleSubtask2.id ))
        } }
        placeholder={t('shortSubtaskTitle')}
        newPlaceholder={t('newShortSubtaskTitle')}
        label={t('shortSubtask')}
        />
    )
  }

  const renderAttachments = ( top ) => {
    if ( !userRights.rights.taskAttachmentsRead ) {
      return null;
    }

    return (
      <Attachments
        disabled={!userRights.rights.taskAttachmentsWrite }
        taskID={null}
        top={top}
        type="repeatTemplate"
        attachments={attachments}
        addAttachments={(newAttachments)=>{
          if(editMode){
            addAttachments(newAttachments);
          }
          let time = moment().valueOf();
          newAttachments = newAttachments.map((attachment)=>{
            return {
              title:attachment.name,
              size:attachment.size,
              filename: attachment.name,
              time,
              data: attachment
            }
          });
          setAttachments([...attachments, ...newAttachments]);
        }}
        removeAttachment={(attachment)=>{
          if(editMode){
            removeAttachment(attachment);
          }
          let newAttachments = [...attachments];
          newAttachments.splice(newAttachments.findIndex((item)=>item.title===attachment.title && item.size===attachment.size && item.time===attachment.time),1);
          setAttachments([...newAttachments]);
        }}
        />
    )
  }

  const renderVykazyTable = ( subtasks, workTrips, materials ) => {
    if (
      !userRights.rights.taskWorksRead &&
      !userRights.rights.taskWorksAdvancedRead &&
      !userRights.rights.taskMaterialsRead
    ) {
      return null
    }

    return (
      <Empty>
        { (
          userRights.rights.taskWorksRead ||
          userRights.rights.taskWorksAdvancedRead
        ) &&
        <WorksTable
          userID={currentUser.id}
          userRights={userRights}
          currentUser={currentUser}
          company={company}
          showTotals={true}
          showColumns={ [ 'done', 'title', 'quantity', 'assigned', 'approved', 'actions' ] }
          showAdvancedColumns={ [ 'done', 'title', 'quantity', 'price', 'discount', 'priceAfterDiscount' , 'actions' ] }
          autoApproved={project ? project.autoApproved : false}
          canAddSubtasksAndTrips={assignedTo.length !== 0}
          canEditInvoiced={false}
          taskAssigned={assignedTo}

          taskTypes={ taskTypes }
          defaultType={ taskType }
          subtasks={ subtasks }
          addSubtask={(newSubtask)=>{
            if(editMode){
              addSubtaskFunc( newSubtask, (id) => setSubtasks([...subtasks,{id, ...newSubtask}]) );
            }else{
              setSubtasks([...subtasks,{id:getNewID(), ...newSubtask}]);
            }
          }}
          updateSubtask={(id,newData)=>{
            if(editMode){
              updateSubtaskFunc({...subtasks.find((item)=>item.id===id),...newData});
            }
            let newSubtasks=[...subtasks];
            let index = newSubtasks.findIndex((subtask)=>subtask.id===id);
            if(newData.approved && newSubtasks[index].approved !== newData.approved ){
              newSubtasks[index]={...newSubtasks[index],...newData, approvedBy: users.find( ( user ) => user.id === currentUser.id ) };
            }else{
              newSubtasks[index]={...newSubtasks[index],...newData };
            }
            setSubtasks(newSubtasks);
          }}
          updateSubtasks={(multipleSubtasks)=>{
            if(editMode){
              multipleSubtasks.forEach(({id, newData})=>{
                updateSubtaskFunc({...subtasks.find((item)=>item.id===id),...newData});
              });
            }
            let newSubtasks=[...subtasks];
            multipleSubtasks.forEach(({id, newData})=>{
              newSubtasks[newSubtasks.findIndex((taskWork)=>taskWork.id===id)]={...newSubtasks.find((taskWork)=>taskWork.id===id),...newData};
            });
            setSubtasks(newSubtasks);
          }}
          removeSubtask={(id)=>{
            if(editMode){
              deleteSubtaskFunc(id);
            }
            let newSubtasks=[...subtasks];
            newSubtasks.splice(newSubtasks.findIndex((taskWork)=>taskWork.id===id),1);
            setSubtasks(newSubtasks);
          }}

          workTrips={ workTrips }
          tripTypes={tripTypes}
          addTrip={(newTrip)=>{
            if(editMode){
              addWorkTripFunc(newTrip, (id) => setWorkTrips([...workTrips,{id,...newTrip}]));
            }else{
              setWorkTrips([...workTrips,{id: getNewID(),...newTrip}]);
            }
          }}
          updateTrip={(id,newData)=>{
            if(editMode){
              updateWorkTripFunc({...workTrips.find((trip)=>trip.id===id),...newData});
            }
            let newTrips=[...workTrips];
            let index = newTrips.findIndex((trip)=>trip.id===id);
            if(newData.approved && newTrips[index].approved !== newData.approved ){
              newTrips[index]={...newTrips[index],...newData, approvedBy: users.find( ( user ) => user.id === currentUser.id ) };
            }else{
              newTrips[index]={...newTrips[index],...newData };
            }
            setWorkTrips(newTrips);
          }}
          updateTrips={(multipleTrips)=>{
            if(editMode){
              multipleTrips.forEach(({id, newData})=>{
                updateWorkTripFunc({...workTrips.find((trip)=>trip.id===id),...newData});
              });
            }
            let newTrips=[...workTrips];
            multipleTrips.forEach(({id, newData})=>{
              newTrips[newTrips.findIndex((trip)=>trip.id===id)]={...newTrips.find((trip)=>trip.id===id),...newData};
            });
            setWorkTrips(newTrips);
          }}
          removeTrip={(id)=>{
            if(editMode){
              deleteWorkTripFunc(id);
            }
            let newTrips=[...workTrips];
            newTrips.splice(newTrips.findIndex((trip)=>trip.id===id),1);
            setWorkTrips(newTrips);
          }}
          />
      }

      { userRights.rights.taskMaterialsRead &&
        <Materials
          showColumns={ [ 'done', 'title', 'quantity', 'price', 'total', 'approved', 'actions' ] }
          showTotals={true}
          autoApproved={project ? project.autoApproved : false}
          userRights={userRights}
          currentUser={currentUser}
          company={company}
          materials={ materials }
          addMaterial={(newMaterial)=>{
            if(editMode){
              addMaterialFunc(newMaterial, (id) => setMaterials([...materials,{ id, ...newMaterial }]) );
            }else{
              setMaterials([...materials,{id:getNewID(),...newMaterial}]);
            }
          }}
          updateMaterial={(id,newData)=>{
            if(editMode){
              updateMaterialFunc({...materials.find((material)=>material.id===id),...newData});
            }
            let newMaterials=[...materials];
            let index = newMaterials.findIndex((material)=>material.id===id);
            if(newData.approved && newMaterials[index].approved !== newData.approved ){
              newMaterials[index]={...newMaterials[index],...newData, approvedBy: users.find( ( user ) => user.id === currentUser.id ) };
            }else{
              newMaterials[index]={...newMaterials[index],...newData };
            }
            setMaterials(newMaterials);
          }}
          updateMaterials={(multipleMaterials)=>{
            if(editMode){
              multipleMaterials.forEach(({id, newData})=>{
                updateMaterialFunc({...materials.find((material)=>material.id===id),...newData});
              });
            }
            let newMaterials=[...materials];
            multipleMaterials.forEach(({id, newData})=>{
              newMaterials[newMaterials.findIndex((material)=>material.id===id)]={...newMaterials.find((material)=>material.id===id),...newData};
            });
            setMaterials(newMaterials);
          }}
          removeMaterial={(id)=>{
            if(editMode){
              deleteMaterialFunc(id);
            }
            let newMaterials=[...materials];
            newMaterials.splice(newMaterials.findIndex((taskMaterial)=>taskMaterial.id===id),1);
            setMaterials(newMaterials);
          }}
          />
      }
    </Empty>
    )
  }

  const renderButtons = () => {
    return (
      <div className="form-section task-edit-buttons">
      <div className="row form-section-rest">
        {closeModal &&
          <button className="btn-link-cancel m-l-20" onClick={() => closeModal(wasSaved, wasDisabled)}>{t('cancel')}</button>
        }
        { newStartsAt &&
          <span className="color-muted">
            {t('repeatAutoupdateMessage')}
          </span>
        }
        <div className="row pull-right">
          {canCreateVykazyError()}
          <button
            className="btn"
            disabled={ cantSave }
            onClick={ triggerSave }
            >
            { editMode ? t('updateRepeat') : t('createRepeat') }
          </button>
        </div>
      </div>
    </div>
    )
  }

  const canCreateVykazyError = () => {
    const error = getVykazyError( taskType, assignedTo.filter( ( user ) => user.id !== null ), company, userRights, t );
    if ( error === '' ) {
      return (
        <span className="center-hor ml-auto">
      </span>
      );
    }
    return (
      <span className="message error-message center-hor ml-auto">
      {error}
    </span>
    );
  }

  return (
    <div>
    {renderHeader()}
    <div
      className={classnames(
        "scrollable",
        "min-height-400",
        { "row": layout === 2}
      )}
      >

      <div
        className={classnames(
          {
            "task-edit-left": layout === 2,
            "task-edit-left-columns": layout !== 2
          },
          'm-t-0'
        )}>

        { renderTitle() }

        { layout === 2 && <hr className="m-t-5 m-b-18"/> }
        { renderStatusDate() }

        { layout === 1 && renderSelectsLayout1()  }

        { renderDescription() }


        { renderSimpleSubtasks() }

        { renderVykazyTable(subtasks, workTrips, materials) }

        <div className="task-add-layout-2"></div>
        { renderButtons() }

      </div>

      { layout === 2 && renderSelectsLayout2Side() }

    </div>

  </div>
  );
}