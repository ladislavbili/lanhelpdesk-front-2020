import React from 'react';
import {
  useMutation,
  useApolloClient,
} from "@apollo/client";

import Select from 'react-select';
import {
  Label,
  FormGroup,
  Input,
} from 'reactstrap';
import CKEditor from 'components/CKEditor';
import Checkbox from 'components/checkbox';

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
import Vykazy from 'helpdesk/task/components/vykazy';
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
  translateSelectItem,
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
    updateCasheStorage,
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
  const [ daysToDeadline, setDaysToDeadline ] = React.useState( 0 );
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

  const [ active, setActive ] = React.useState( true );
  const [ startsAt, setStartsAt ] = React.useState( originalRepeat ? originalRepeat.startsAt : null );
  const [ repeatEvery, setRepeatEvery ] = React.useState( originalRepeat ? originalRepeat.repeatEvery : "1" );
  const [ repeatInterval, setRepeatInterval ] = React.useState( originalRepeat ? originalRepeat.repeatInterval : intervals[ 0 ] );

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
      repeatEvery: originalRepeat.repeatEvery,
      repeatInterval: originalRepeat.repeatInterval,
      startsAt: newStartsAt.toString(),
      active: originalRepeat.active,
    } : {} );
    setAssignedTo( toSelArr( data.assignedTo, 'fullName' ) );
    setCloseDate( moment( parseInt( data.closeDate ) ) );
    setDaysToDeadline( data.daysToDeadline ? data.daysToDeadline : null );
    setDescription( data.description );
    setImportant( data.important );

    setActive( originalRepeat.active );
    setStartsAt( newStartsAt ? moment( newStartsAt ) : moment( parseInt( originalRepeat.startsAt ) ) );
    setRepeatEvery( originalRepeat.repeatEvery );
    setRepeatInterval( intervals.find( ( interval ) => interval.value === originalRepeat.repeatInterval ) );
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
      type: null
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
  }, [ originalRepeat ] );

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
      const newRepeatData = (
        (
          changes.startsAt === undefined &&
          changes.repeatEvery === undefined &&
          changes.repeatInterval === undefined &&
          changes.active === undefined
        ) ? {} : {
          startsAt: startsAt.valueOf()
            .toString(),
          repeatEvery: parseInt( repeatEvery ),
          repeatInterval: repeatInterval.value,
          active,
        }
      );
      const repeatTemplate = deleteAttributes( changes, [ 'startsAt', 'repeatEvery', 'repeatInterval', 'active' ] );
      const variables = {
        id: originalRepeat.id,
        ...newRepeatData,
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
            active,
            taskId: taskID ? taskID : undefined,
            repeatInterval: repeatInterval.value,
            startsAt: startsAt.valueOf()
              .toString(),
            repeatEvery: parseInt( repeatEvery ),
            repeatTemplate: {
              title,
              closeDate: closeDate ? closeDate.valueOf()
                .toString() : null,
              assignedTo: assignedTo.map( user => user.id ),
              company: company ? company.id : null,
              daysToDeadline,
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
                  closeModal( true, active );
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
            closeModal( true, active );
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
              ...repeat,
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
        status: status.id,
        pendingDate: moment()
          .add( 1, 'd' )
          .valueOf()
          .toString()
      } )
    } else if ( status.action === 'CloseDate' || status.action === 'CloseInvalid' ) {
      setStatus( status );
      setCloseDate( moment() );
      saveChange( {
        status: status.id,
        closeDate: moment()
          .valueOf()
          .toString()
      } )
    } else {
      setStatus( status );
      saveChange( {
        status: status.id,
      } )
    }
  }

  const cantSave = (
    saving ||
    directSaving ||
    title === "" ||
    status === null ||
    project === null ||
    ( assignedTo.length === 0 && userRights.attributeRights.assigned.view && !projectAttributes.assigned.fixed ) ||
    repeatInterval.value === null ||
    parseInt( repeatEvery ) <= 0 ||
    isNaN( parseInt( repeatEvery ) ) ||
    startsAt === null ||
    ( !company && userRights.attributeRights.company.view ) ||
    ( editMode && Object.keys( changes )
      .length === 0 && !newStartsAt )
  )

  //RENDERS

  const renderSide = () => {
    return (
      <div className="task-edit-right p-b-20 m-t-0">
        <div className="form-selects-entry-column" >
          <Label>{t('project')} <span className="warning-big">*</span></Label>
          <div className="form-selects-entry-column-rest" >
            <Select
              placeholder={t('selectProject')}
              value={project}
              onChange={changeProject}
              options={projects.filter((project) => currentUser.role.level === 0 || (project.right.addTask && project.right.repeatWrite ) )}
              styles={pickSelectStyle([ 'noArrow', 'required', ])}
              />
          </div>
        </div>
        { userRights.attributeRights.status.view &&
          <div className="form-selects-entry-column" >
            <Label>{t('status')}<span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
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
          </div>
        }
        { userRights.attributeRights.requester.view &&
          <div className="form-selects-entry-column" >
            <Label>{t('requester')}<span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
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
          </div>
        }
        { userRights.attributeRights.company.view &&
          <div className="form-selects-entry-column" >
            <Label>{t('company')}<span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
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
          </div>
        }
        { userRights.attributeRights.assigned.view &&
          <div className="form-selects-entry-column" >
            <Label>{t('assignedTo')}<span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
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
                  styles={pickSelectStyle( [ 'noArrow', 'required' ] )}
                  />
              }
            </div>
          </div>
        }
        <div className="form-selects-entry-column" >
          <Label>{t('plannedAt')}</Label>
          <div className="form-selects-entry-column-rest" >
            <div className="disabled-info">{t('taskCreationDate')}</div>
          </div>
        </div>
        { userRights.attributeRights.deadline.view &&
          <div className="form-selects-entry-column" >
            <Label>{t('deadlineSinceCreation')}</Label>
            <div className="form-selects-entry-column-rest" >
              { (projectAttributes.deadline.fixed || !userRights.attributeRights.deadline.edit) &&
                <div className="disabled-info">{deadline}</div>
              }
              { !projectAttributes.deadline.fixed && userRights.attributeRights.deadline.edit &&
                <div className="row">
                  <div className="flex">
                  <input
                    className="form-control"
                    type="number"
                    placeholder={daysToDeadline === null ? t('noDeadline') : t("deadlineSinceCreationPlaceholder")}
                    value={daysToDeadline === null ? '' : daysToDeadline }
                    onChange={(e) => {
                      setDaysToDeadline( e.target.value );
                      saveChange({ daysToDeadline: isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value) });
                    } }
                    />
                  </div>
                  { daysToDeadline !== null &&
                    <div className="ml-auto row">
                      <button type="button" className="btn-link m-l-5 m-r-0" onClick={() => { setDaysToDeadline(null); saveChange({ daysToDeadline: null }) } }>
                        <i className="fas fa-times text-highlight" />
                      </button>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        }
        { userRights.attributeRights.repeat.view &&
          <div className="form-selects-entry-column" >
            <Label>{t('repeat')}</Label>
            <div className="form-selects-entry-column-rest" >
              <div className="secondary-border p-10" style={{ marginLeft: -10, marginRight: -10 }}>
                <FormGroup className="task-add-date-picker-placeholder">
                  <Label>{t('startDate')} *</Label>
                  <div className="flex-input">
                    <DatePicker
                      className="form-control"
                      selected={startsAt}
                      onChange={(value) => {
                        setStartsAt(value);
                        saveChange( {
                          startsAt: value.valueOf()
                          .toString(),
                        } );
                      }}
                      placeholderText={t('noStartDate')}
                      />
                  </div>
                </FormGroup>

                <FormGroup>
                  <Label>{t('repeatEvery')} *</Label>
                  { parseInt(repeatEvery) <= 0 &&
                    <Label className="warning">{t('warningMustBeMoreThan0')}.</Label>
                  }
                  <Input type="number"
                    className={classnames({ "form-control-warning": parseInt(repeatEvery) < 0 }, "form-control-secondary no-border m-b-10" ) }
                    placeholder={t('enterNumber')}
                    value={( repeatEvery )}
                    onChange={(e)=> {
                      setRepeatEvery(e.target.value);
                      saveChange( {
                        repeatEvery: e.target.value,
                      } );
                    }}
                    />
                  <Select
                    value={translateSelectItem(repeatInterval, t)}
                    onChange={(value) =>{
                      setRepeatInterval( value );
                      saveChange( {
                        repeatInterval: value.value,
                      } );
                    }}
                    options={translateAllSelectItems(intervals, t)}
                    styles={pickSelectStyle()}
                    />
                </FormGroup>
                <Checkbox
                  className = "m-r-5"
                  label={t('active')}
                  value = { active }
                  onChange={() =>{
                    setActive(!active );
                    saveChange( {
                      active: !active,
                    } );
                  }}
                  />
              </div>
            </div>
          </div>
    } {
      userRights.attributeRights.taskType.view &&
        <div className="form-selects-entry-column" >
            <Label>{t('taskType')}</Label>
            <div className="form-selects-entry-column-rest" >
              <Select
                placeholder={t('taskTypePlaceholder')}
                value={taskType}
                isDisabled={ projectAttributes.taskType.fixed || !userRights.attributeRights.taskType.edit }
                styles={ pickSelectStyle( [ 'noArrow', 'required' ] )}
                onChange={ (taskType) => {
                  setTaskType(taskType);
                  saveChange({ taskType: taskType.id })
                }}
                options={taskTypes}
                />
            </div>
          </div>
    } {
      userRights.attributeRights.pausal.view &&
        <div className="form-selects-entry-column" >
            <Label>{t('pausal')}<span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
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
          </div>
    } {
      userRights.attributeRights.overtime.view &&
        <div className="form-selects-entry-column" >
            <Label>{t('overtimeShort')}<span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
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
          </div>
    }
    </div>
    )
  }

  const renderMain = () => {
    return (
      <div
        className="task-edit-left m-t-0">

        { renderMainTop() }

        { renderDescriptionAttachmentsTags() }

        { userRights.rights.taskSubtasksRead && (
          <ShortSubtasks
            edit={editMode}
            repeat
            repeatID={editMode ? originalRepeat.repeatTemplate.id : null}
            disabled={!userRights.rights.taskSubtasksWrite}
            setSaving={() => {}}
            shortSubtasks={simpleSubtasks}
            setShortSubtasks={setSimpleSubtasks}
            updateCasheStorage={updateCasheStorage}
            />
        ) }
        {(
          userRights.rights.taskWorksRead ||
          userRights.rights.taskWorksAdvancedRead ||
          userRights.rights.taskMaterialsRead
        ) && (
          <Vykazy
            edit={editMode}
            repeat
            repeatID={editMode ? originalRepeat.repeatTemplate.id : null}
            autoApproved={project ? project.autoApproved : false}
            userRights={userRights}
            currentUser={currentUser}
            assignedTo={assignedTo}
            company={company}
            updateCasheStorage={updateCasheStorage}
            renderCompanyPausalInfo={null}
            works={subtasks}
            setWorks={setSubtasks}
            taskTypes={ taskTypes }
            taskType={ taskType }
            trips={ workTrips }
            setTrips={setWorkTrips}
            tripTypes={tripTypes}
            materials={materials}
            setMaterials={setMaterials}
            setSaving={setSaving}
            />
        )}
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
                { t('save') }
              </button>
            </div>
          </div>
        </div>

      </div>
    );
  }

  const renderCommandbar = () => {
    return (
      <div className="task-edit-buttons row m-b-10 m-l-20 m-r-20 m-t-20">
        <h2 className="center-hor">{t('repeat')}</h2>
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

  const renderMainTop = () => {
    return (
      <div>
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
        <hr className="m-t-5 m-b-18"/>
        { renderStatusDate() }
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

  const renderDescriptionAttachmentsTags = () => {
    if ( !userRights.rights.taskDescriptionRead && !userRights.rights.taskAttachmentsRead ) {
      return null;
    }
    let RenderDescription = null;
    if ( !userRights.rights.taskDescriptionWrite ) {
      if ( description.length !== 0 ) {
        RenderDescription = <div className="task-edit-popis" dangerouslySetInnerHTML={{__html:description }} />
      } else {
        RenderDescription = <div className="task-edit-popis">{t('noTaskDescription')}</div>
      }
    } else {
      if ( showDescription ) {
        RenderDescription = <div>
          <CKEditor
            value={description}
            onReady={(editor) => {
              editor.editing.view.document.on( 'keydown', ( evt, data ) => {
                if ( data.keyCode === 27 ) {
                  setShowDescription(false);
                  data.preventDefault();
                  evt.stop();
                }
              });
            }}
            onChange={(description)=>{
              setDescription(description);
            }}
            type="basic"
            />
        </div>
      } else {
        if ( description.length !== 0 ) {
          RenderDescription = <div className="task-edit-popis" dangerouslySetInnerHTML={{__html:description }} />
        } else {
          RenderDescription = <div className="task-edit-popis">{t('noTaskDescription')}</div>
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
        </div>
        <div  className="form-section-rest">
          {RenderDescription}
          { userRights.rights.taskAttachmentsRead && (
            <Attachments
              disabled={!userRights.rights.taskAttachmentsWrite }
              taskID={null}
              top={false}
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
          )}
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
      { renderCommandbar() }
      <div
        className="scrollable min-height-400 row">

        { renderMain() }

        { renderSide() }

      </div>

    </div>
  );
}