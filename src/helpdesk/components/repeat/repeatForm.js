import React from 'react';
import {
  useMutation,
  useApolloClient,
} from "@apollo/client";

import Select from 'react-select';
import {
  Label,
} from 'reactstrap';
import DatePicker from 'components/DatePicker';
import MultiSelect from 'components/MultiSelectNew';
import Empty from 'components/Empty';
import SimpleRepeat from 'helpdesk/components/repeat/simpleRepeat';
import moment from 'moment';

import Attachments from 'helpdesk/components/attachments';

import VykazyTable from 'helpdesk/components/vykazyTable';

import classnames from "classnames";

import CKEditor from '@ckeditor/ckeditor5-react';
import ck5config from 'configs/components/ck5config';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import {
  pickSelectStyle,
} from 'configs/components/select';
import booleanSelects from 'configs/constants/boolSelect'
import CheckboxList from 'helpdesk/components/checkboxList';
import {
  getCreationError as getVykazyError
} from 'helpdesk/components/vykazyTable';
import {
  noMilestone
} from 'configs/constants/sidebar';
import {
  noDef
} from 'configs/constants/projects';

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
  invoicedAttributes,
  noTaskType
} from 'helpdesk/task/constants';

import {
  backendCleanRights
} from 'configs/constants/projects';

import {
  toSelArr,
  toSelItem,
  deleteAttributes,
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
    milestones,
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
    addCustomItemFunc,
    updateCustomItemFunc,
    deleteCustomItemFunc,
    addAttachments,
    removeAttachment,
    directSaving,
    newStartsAt,
  } = props;

  const client = useApolloClient();

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
  const [ defaultFields, setDefaultFields ] = React.useState( noDef );
  const [ changes, setChanges ] = React.useState( {} );
  const [ important, setImportant ] = React.useState( false );
  const [ attachments, setAttachments ] = React.useState( [] );
  const [ assignedTo, setAssignedTo ] = React.useState( projectUsers.filter( ( user ) => user.id === currentUser.id ) );
  const [ closeDate, setCloseDate ] = React.useState( null );
  const [ company, setCompany ] = React.useState( null );
  const [ customItems, setCustomItems ] = React.useState( [] );
  const [ deadline, setDeadline ] = React.useState( null );
  const [ showDescription, setShowDescription ] = React.useState( false );
  const [ description, setDescription ] = React.useState( "" );
  const [ descriptionVisible, setDescriptionVisible ] = React.useState( false );
  const [ milestone, setMilestone ] = React.useState( [ noMilestone ] );
  const [ overtime, setOvertime ] = React.useState( booleanSelects[ 0 ] );
  const [ pausal, setPausal ] = React.useState( booleanSelects[ 0 ] );
  const [ pendingDate, setPendingDate ] = React.useState( null );
  const [ pendingChangable, setPendingChangable ] = React.useState( false );
  const [ requester, setRequester ] = React.useState(
    project !== null ?
    currentUserIfInProject( project ) :
    null
  );
  const [ saving, setSaving ] = React.useState( false );
  const [ wasSaved, setWasSaved ] = React.useState( false );
  const [ status, setStatus ] = React.useState( null );
  const [ subtasks, setSubtasks ] = React.useState( [] );
  const [ tags, setTags ] = React.useState( [] );
  const [ materials, setMaterials ] = React.useState( [] );
  const [ taskType, setTaskType ] = React.useState( null );
  const [ title, setTitle ] = React.useState( "" );
  const [ workTrips, setWorkTrips ] = React.useState( [] );
  const [ repeat, setRepeat ] = React.useState( null );

  const [ simpleSubtasks, setSimpleSubtasks ] = React.useState( [] );


  let counter = 0;

  const getNewID = () => {
    return counter++;
  }

  const userRights = (
    currentUser.role.level === 0 ?
    backendCleanRights( true ) :
    (
      project ?
      project.right :
      backendCleanRights()
    )
  );

  const REQUESTERS = ( project && project.lockedRequester ? projectUsers : users );

  const setDefaults = ( project ) => {
    if ( project === null ) {
      setDefaultFields( noDef );
      return;
    }

    let def = project.def;
    if ( !def ) {
      setDefaultFields( noDef );
      return;
    }
    setDefaultFields( def );

    updateToProjectRules( project );
  }

  const updateToProjectRules = ( project ) => {
    if ( !project ) {
      return;
    }

    const userRights = project.right;
    const projectUsers = users.filter( ( user ) => project.users.some( ( userData ) => userData.user.id === user.id ) );
    const assignableUsers = users.filter( ( user ) => project.users.some( ( userData ) => userData.assignable && userData.user.id === user.id ) );
    const projectRequesters = ( project.lockedRequester ? projectUsers : users );
    const def = project.def;
    const statuses = toSelArr( project.statuses );
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
      console.log( 'project changes', changes );
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
    setAssignedTo( toSelArr( data.assignedTo, 'email' ) );
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
    const milestone = project && data.milestone ? toSelArr( project.milestones )
      .find( ( milestone ) => milestone.id === data.milestone.id ) : undefined;
    setOvertime( ( data.overtime ? booleanSelects[ 1 ] : booleanSelects[ 0 ] ) );
    setPausal( ( data.pausal ? booleanSelects[ 1 ] : booleanSelects[ 0 ] ) );
    setPendingChangable( data.pendingChangable );
    setPendingDate( moment( parseInt( data.pendingDate ) ) );
    const status = ( data.status ? toSelItem( data.status ) : null )
    setStatus( status );
    setTags( toSelArr( data.tags ) );
    setTaskType( ( data.taskType ? toSelItem( data.taskType ) : noTaskType ) );

    setCompany( ( data.company ? toSelItem( data.company ) : null ) );
    setMilestone( milestone === undefined ? noMilestone : milestone );
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
      assignedTo: toSelItem( item.assignedTo, 'email' ),
      type: toSelItem( item.type )
    } ) ) );
    setWorkTrips( data.workTrips.map( item => ( {
      ...item,
      assignedTo: toSelItem( item.assignedTo, 'email' ),
      type: toSelItem( item.type )
    } ) ) );
    setMaterials( data.materials );
    setCustomItems( data.customItems );
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
    setMilestone( duplicateTask.milestone );
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
    setCustomItems( duplicateTask.customItems.map( ( item ) => ( {
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
    if ( window.confirm( 'Are you sure you want to delete this repeat?' ) ) {
      if ( editMode ) {
        deleteRepeat( {
            variables: {
              id: originalRepeat.id,
            }
          } )
          .then( ( response ) => {
            updateTask( response, 'delete' );
            updateRepeatList( response, 'delete' );
            closeModal( true );
          } )
          .catch( ( err ) => {
            console.log( err );
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
      updateRepeat( {
          variables
        } )
        .then( ( response ) => {
          updateTask( response, 'update' );
          updateRepeatList( response, 'update' );
          setChanges( {} );
          setSaving( false );
          //update repeat
          updateRepeatData( response );
        } )
        .catch( ( err ) => {
          console.log( err );
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
              milestone: milestone ? milestone.id : null,
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
              customItems: customItems.map( item => ( {
                title: item.title,
                order: item.order,
                done: item.done,
                quantity: item.quantity,
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
                  closeModal( true );
                } else {
                  setSaving( false );
                }
              } )
              .catch( ( err ) => {
                console.log( err.message );
                setSaving( false );
              } );
          } else {
            updateTask( response, 'add' );
            setSaving( false );
            closeModal( true );
          }
        } )
        .catch( ( err ) => {
          console.log( err.message );
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

  const updateRepeatList = ( response, type ) => {
    if ( type === 'update' ) {
      try {
        const repeat = response.data.updateRepeat;
        let repeats = [
          ...client.readQuery( {
            query: GET_REPEATS
          } )
          .repeats
        ];
        let index = repeats.findIndex( ( OrgRepeat ) => OrgRepeat.id === repeat.id );
        repeats[ index ] = {
          ...repeats[ index ],
          ...repeat
        }
        client.writeQuery( {
          query: GET_REPEATS,
          data: {
            repeats
          }
        } );
      } catch ( err ) {

      }
    } else if ( type === 'delete' ) {
      try {
        let repeats = [
          ...client.readQuery( {
            query: GET_REPEATS
          } )
          .repeats
        ];

        client.writeQuery( {
          query: GET_REPEATS,
          data: {
            repeats: repeats.filter( ( repeat ) => repeat.id !== response.data.deleteRepeat.id )
          }
        } );
      } catch ( err ) {

      }
    }
  }

  //data functions
  const changeProject = ( project ) => {
    setProject( project );
    let newAssignedTo = assignedTo.filter( ( user ) => project.usersWithRights.some( ( projectUser ) => projectUser.assignable && projectUser.user.id === user.id ) );
    setAssignedTo( newAssignedTo );
    setMilestone( noMilestone );
    setTags( [] );
    setStatus( null );
    if ( editMode ) {
      saveChange( {
        project: project.id,
        tags: [],
        status: null,
        assignedTo: newAssignedTo.map( ( user ) => user.id ),
        milestone: null
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

  const changeRepeat = ( repeat ) => {
    if ( !userRights.repeatWrite ) {
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
    ( project === null && userRights.projectRead ) ||
    ( assignedTo.length === 0 && userRights.assignedRead && defaultFields.assignedTo.fixed ) ||
    repeat === null ||
    ( !company && userRights.companyRead ) ||
    ( project.def.tag.required && tags.length === 0 && userRights.tagsRead ) ||
    ( editMode && Object.keys( changes )
      .length === 0 && !newStartsAt )
  )

  //RENDERS
  const renderHeader = () => {
    return (
      <div className="task-add-layout row">
        <h2 className="center-hor p-r-20">{`${ !editMode ? 'Add repeat' : 'Edit repeat' }`}</h2>
        <div className="ml-auto m-r-20">
          <button
            type="button"
            className="btn-link task-add-layout-button btn-distance"
            onClick={ () => setLayout( (layout === 1 ? 2 : 1) ) }>
            <i className="fas fa-retweet "/>
            Layout
          </button>

          { editMode && userRights.repeatWrite &&
            <button
              type="button"
              className="btn-link task-add-layout-button"
              onClick={ deleteRepeatFunc }>
              <i className="far fa-trash-alt "/>
              Delete Repeat
            </button>
          }
        </div>

      </div>
    )
  }

  const renderTitle = () => {
    return (
      <div className="form-section">
        <Label>Task name<span className="warning-big m-l-5">*</span> </Label>
        <span className="form-section-rest">
          <input type="text"
            value={title}
            className="task-title-input full-width form-control"
            onChange={ (e) =>{ setTitle(e.target.value); saveChange({ title: e.target.value }); }}
            placeholder="ENTER NEW TASK NAME" />
        </span>
        { status && userRights.statusRead &&
          (['CloseDate','PendingDate','CloseInvalid']).includes(status.action) &&
          <div className="task-info-add ml-auto center-hor">
            <span className="">
              {(status.action==='CloseDate' || status.action==='CloseInvalid') ? "Close date: " : "PendingDate: "}
            </span>
            <DatePicker
              className="form-control"
              selected={(status.action==='CloseDate' || status.action==='CloseInvalid') ? closeDate : pendingDate }
              disabled={userRights.statusWrite}
              onChange={date => {
                if (status.action==='CloseDate' || status.action==='CloseInvalid'){
                  setCloseDate(date);
                  saveChange({ closeDate: date });
                } else {
                  setPendingDate(date);
                  saveChange({ pendingDate: date });
                }
              }}
              placeholderText="No close date"
              />
          </div>
        }
      </div>
    );
  }

  const layoutComponents = {
    Project: () => (
      <Select
        placeholder="Zadajte projekt"
        value={project}
        onChange={changeProject}
        options={projects.filter((project) => currentUser.role.level === 0 || (project.right.addTasks && project.right.repeatWrite ) )}
        styles={pickSelectStyle( [ 'invisible', 'required' ] )}
        />
    ),
    Assigned: (
      <Select
        placeholder="Select required"
        value={assignedTo}
        isDisabled={ defaultFields.assignedTo.fixed || !userRights.assignedWrite }
        isMulti
        onChange={(users)=> {
          setAssignedTo(users);
          saveChange({ assignedTo: users.map((user) => user.id) })
        }}
        options={projectUsers}
        styles={pickSelectStyle( [ 'invisible', 'required' ] )}
        />
    ),
    Status: (
      <Select
        placeholder="Select required"
        value={status}
        isDisabled={defaultFields.status.fixed || !userRights.statusWrite }
        styles={pickSelectStyle( [ 'noArrow', 'colored', 'required', ] )}
        onChange={changeStatus}
        options={project ? toSelArr(project.statuses.filter((status) => status.action.toLowerCase() !== 'invoiced' )) : []}
        />
    ),
    Type: (
      <Select
        placeholder="Select task type"
        value={taskType}
        isDisabled={ defaultFields.type.fixed || !userRights.typeWrite }
        styles={ pickSelectStyle( [ 'invisible', 'required' ] ) }
        onChange={(taskType)=> {
          setTaskType(taskType);
          saveChange({ taskType: taskType.id })
        }}
        options={taskTypes}
        />
    ),
    Milestone: (
      <Select
        isDisabled={!userRights.milestoneWrite}
        placeholder="None"
        value={milestone}
        onChange={changeMilestone}
        options={milestones.filter((milestone)=>milestone.id===null || (project !== null && milestone.project === project.id))}
        styles={ pickSelectStyle( [ 'noArrow', 'noPadding', ] ) }
        />
    ),
    Requester: (
      <Select
        value={requester}
        placeholder="Select required"
        isDisabled={defaultFields.requester.fixed || !userRights.requesterWrite}
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
        options={REQUESTERS}
        styles={ pickSelectStyle( [ 'invisible', 'required' ] ) }
        />
    ),
    Company: (
      <Select
        value={company}
        placeholder="Select required"
        isDisabled={defaultFields.company.fixed || !userRights.companyWrite}
        onChange={(company)=> {
          setCompany(company);
          setPausal(company.monthly ? booleanSelects[1] : booleanSelects[0]);
          saveChange({
            requester: company.id,
            pausal: company.monthly
          })
        }}
        options={companies}
        styles={ pickSelectStyle( [ 'invisible', 'required' ] ) }
        />
    ),
    Pausal: (
      <Select
        value={pausal}
        placeholder="Select required"
        isDisabled={ !userRights.pausalWrite || !company || company.monthly || defaultFields.pausal.fixed}
        styles={ pickSelectStyle( [ 'invisible', 'required' ] ) }
        onChange={(pausal)=> { setPausal(pausal); saveChange({ pausal: pausal.value }) }}
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
            saveChange({ deadline: date.valueOf().toString() })
          }
        }}
        placeholderText="No deadline"
        />
    ),
    Overtime: (
      <Select
        placeholder="Select required"
        value={overtime}
        isDisabled={ !userRights.overtimeWrite || defaultFields.overtime.fixed}
        styles={ pickSelectStyle( [ 'invisible', 'required' ] ) }
        onChange={(overtime) => { setOvertime(overtime); saveChange({ overtime: pausal.value }); }}
        options={booleanSelects}
        />
    ),
  }

  const renderSelectsLayout1 = () => {
    return (
      <div className = "form-section form-selects-entries" >
        <div className="form-section-rest">

          <div className="col-12 row">
            <div className="col-4">
              <div className="row p-r-10">
                <Label className="col-3 col-form-label">Projekt <span className="warning-big">*</span></Label>
                <div className="col-9">
                  { layoutComponents.Project() }
                </div>
              </div>
            </div>
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
                !defaultFields.status.fixed &&
                userRights.statusWrite &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Status <span className="warning-big">*</span></Label>
                  <div className="col-9">
                    { layoutComponents.Status }
                  </div>
                </div>
              }

              { userRights.typeRead &&
                userRights.typeWrite &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Typ</Label>
                  <div className="col-9">
                    { layoutComponents.Type }
                  </div>
                </div>
              }
              { userRights.milestoneRead &&
                userRights.milestoneWrite &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Milestone</Label>
                  <div className="col-9">
                    { layoutComponents.Milestone }
                  </div>
                </div>
              }
            </div>

            <div className="col-4">
              {userRights.requesterRead &&
                !defaultFields.requester.fixed &&
                userRights.requesterWrite &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Zadal <span className="warning-big">*</span></Label>
                  <div className="col-9">
                    { layoutComponents.Requester }
                  </div>
                </div>
              }
              {userRights.companyRead &&
                !defaultFields.company.fixed &&
                userRights.companyWrite &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Firma <span className="warning-big">*</span></Label>
                  <div className="col-9">
                    { layoutComponents.Company }
                  </div>
                </div>
              }
              {userRights.pausalRead &&
                userRights.pausalWrite &&
                company &&
                !company.monthly &&
                !defaultFields.pausal.fixed &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Paušál <span className="warning-big">*</span></Label>
                  <div className="col-9">
                    { layoutComponents.Pausal }
                  </div>
                </div>
              }
            </div>

            <div className="col-4">
              { userRights.deadlineRead &&
                userRights.deadlineWrite &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Deadline</Label>
                  <div className="col-9">
                    { layoutComponents.Deadline }
                  </div>
                </div>
              }

              { userRights.repeatRead &&
                <SimpleRepeat
                  taskID={null}
                  repeat={repeat}
                  submitRepeat={changeRepeat}
                  columns={true}
                  vertical={false}
                  addTask={true}
                  />
              }
              { userRights.overtimeRead &&
                userRights.overtimeWrite &&
                !defaultFields.overtime.fixed &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Mimo PH <span className="warning-big">*</span></Label>
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
          { layoutComponents.Project() }
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
      <div className="task-edit-right p-b-20">
        <div className="form-selects-entry-column" >
          <Label>Project <span className="warning-big">*</span></Label>
          <div className="form-selects-entry-column-rest" >
            { layoutComponents.Project(true) }
          </div>
        </div>
        { userRights.statusRead &&
          !defaultFields.status.fixed &&
          userRights.statusWrite &&
          <div className="form-selects-entry-column" >
            <Label>Status <span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Status }
            </div>
          </div>
        }
        { userRights.milestoneRead &&
          userRights.milestoneWrite &&
          <div className="form-selects-entry-column" >
            <Label>Milestone</Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Milestone }
            </div>
          </div>
        }
        { userRights.requesterRead &&
          !defaultFields.requester.fixed &&
          userRights.requesterWrite &&
          <div className="form-selects-entry-column" >
            <Label>Requester <span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Requester }
            </div>
          </div>
        }
        { userRights.companyRead &&
          !defaultFields.company.fixed &&
          userRights.companyWrite &&
          <div className="form-selects-entry-column" >
            <Label>Company <span className="warning-big">*</span></Label>
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
          userRights.deadlineWrite &&
          <div className="form-selects-entry-column" >
            <Label>Deadline</Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Deadline }
            </div>
          </div>
        }
        { userRights.repeatRead &&
          <SimpleRepeat
            taskID={null}
            repeat={repeat}
            submitRepeat={changeRepeat}
            columns={true}
            addTask={true}
            vertical={true}
            />
        }
        { userRights.typeRead &&
          userRights.typeWrite &&
          <div className="form-selects-entry-column" >
            <Label>Task Type</Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Type }
            </div>
          </div>
        }
        { userRights.pausalRead &&
          userRights.pausalWrite &&
          company &&
          !company.monthly &&
          !defaultFields.pausal.fixed &&
          <div className="form-selects-entry-column" >
            <Label>Pausal <span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Pausal }
            </div>
          </div>
        }
        { userRights.overtimeRead &&
          userRights.overtimeWrite &&
          !defaultFields.overtime.fixed &&
          <div className="form-selects-entry-column" >
            <Label>Outside PH <span className="warning-big">*</span></Label>
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
        { userRights.tagsWrite &&
          <div className="row center-hor">
            <button className="btn-link p-b-10" onClick={ () => setTagsOpen(true) } >
              <i className="fa fa-plus" />
              Tags
            </button>
            <MultiSelect
              className="center-hor"
              disabled={ defaultFields.tag.fixed || !userRights.tagsWrite }
              direction="right"
              style={{}}
              header="Select tags for this task"
              closeMultiSelect={() => { setTagsOpen(false) }}
              open={tagsOpen}
              items={toSelArr(project === null ? [] : project.tags)}
              selected={tags}
              onChange={ (tags) => { setTags(tags); saveChange({ tags: tags.map((tag) => tag.id ) }) }}
              />
          </div>
        }

        {
          userRights.tagsRead && tags
          .sort( ( tag1, tag2 ) => tag1.order > tag2.order ? 1 : -1 )
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
          <Label className="m-r-10">Popis úlohy</Label>
          { userRights.taskDescriptionWrite &&
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
              { !showDescription ? 'edit' : 'save' }
            </button>
          }
          { userRights.taskAttachmentsWrite &&
            <label htmlFor={`uploadAttachment-${null}`} className="btn-link m-l-0" >
              <i className="fa fa-plus" />
              Attachment
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
    if ( !userRights.taskShortSubtasksRead ) {
      return null;
    }
    return (
      <CheckboxList
        disabled={!userRights.taskShortSubtasksWrite}
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

  const renderVykazyTable = ( subtasks, workTrips, materials, customItems ) => {
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
        userID={currentUser.id}
        userRights={userRights}
        autoApproved={false}
        isInvoiced={false}
        canEditInvoiced={false}
        company={company}
        canAddSubtasksAndTrips={assignedTo.length !== 0}
        taskAssigned={assignedTo}

        showSubtasks={project ? project.showSubtasks : false}

        subtasks={subtasks}
        defaultType={taskType}
        taskTypes={taskTypes}
        submitSubtask={(newSubtask)=>{
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
        workTrips={workTrips}
        tripTypes={tripTypes}
        submitTrip={(newTrip)=>{
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

        materials={materials}
        submitMaterial={(newMaterial)=>{
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

        customItems={customItems}
        submitCustomItem={(customItem)=>{
          if(editMode){
            addCustomItemFunc(customItem, (id) => setCustomItems([...customItems,{ id, ...customItem }]) );
          }else{
            setCustomItems([...customItems,{id:getNewID(),...customItem}]);
          }
        }}
        updateCustomItem={(id,newData)=>{
          if(editMode){
            updateCustomItemFunc({...customItems.find( (customItem) => customItem.id === id ),...newData});
          }
          let newCustomItems=[...customItems];
          let index = newCustomItems.findIndex((item)=>item.id===id);
          if(newData.approved && newCustomItems[index].approved !== newData.approved ){
            newCustomItems[index]={...newCustomItems[index],...newData, approvedBy: users.find( ( user ) => user.id === currentUser.id ) };
          }else{
            newCustomItems[index]={...newCustomItems[index],...newData };
          }
          setCustomItems(newCustomItems);
        }}
        updateCustomItems={(multipleCustomItems)=>{
          if(editMode){
            multipleCustomItems.forEach(({id, newData})=>{
              updateCustomItemFunc({...customItems.find( (customItem) => customItem.id === id),...newData});
            });
          }
          let newCustomItems=[...customItems];
          multipleCustomItems.forEach(({id, newData})=>{
            newCustomItems[newCustomItems.findIndex((customItem)=>customItem.id===id)]={...newCustomItems.find((customItem)=>customItem.id===id),...newData};
          });
          setCustomItems(newCustomItems);
        }}
        removeCustomItem={(id)=>{
          if(editMode){
            deleteCustomItemFunc(id);
          }
          let newCustomItems=[...customItems];
          newCustomItems.splice(newCustomItems.findIndex((customItem)=>customItem.id===id),1);
          setCustomItems(newCustomItems);
        }}
        />
    )
  }

  const renderButtons = () => {
    return (
      <div className="form-section task-edit-buttons">
        <div className="row form-section-rest">
          {closeModal &&
            <button className="btn-link-cancel m-l-20" onClick={() => closeModal(wasSaved)}>Cancel</button>
          }
            { newStartsAt &&
              <span className="text-muted">
                New Repeat time has been loaded, you can just save the changes or edit repeat!
            </span>
            }
          <div className="row pull-right">
          {canCreateVykazyError()}
          <button
            className="btn"
            disabled={ cantSave }
            onClick={ triggerSave }
            >
            { editMode ? 'Update repeat' : 'Create repeat' }
          </button>
        </div>
        </div>
      </div>
    )
  }

  const canCreateVykazyError = () => {
    const error = getVykazyError( taskType, assignedTo.filter( ( user ) => user.id !== null ), company, userRights );
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
    <div style={{backgroundColor: "#f9f9f9"}}>
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
              "task-edit-left": layout === 2
            },
            {
              "task-edit-left-columns": layout !== 2
            }
          )}>

          { renderTitle() }

          { layout === 1 && renderSelectsLayout1()  }

          { renderDescription() }


          { renderSimpleSubtasks() }

          { renderVykazyTable(subtasks, workTrips, materials, customItems) }

          <div className="task-add-layout-2"></div>
          { renderButtons() }

        </div>

        { layout === 2 && renderSelectsLayout2Side() }

      </div>

    </div>
  );
}