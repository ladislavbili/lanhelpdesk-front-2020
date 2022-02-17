import React from 'react';

import Select from 'react-select';
import {
  Label,
} from 'reactstrap';
import CKEditor from 'components/CKEditor';
import DatePicker from 'components/DatePicker';
import MultiSelect from 'components/MultiSelectNew';
import Empty from 'components/Empty';

import Repeat from 'helpdesk/components/repeat/simpleRepeat';
import moment from 'moment';
import classnames from "classnames";
import axios from 'axios';

import Attachments from '../components/attachments';
import TagsPickerPopover from '../components/tags';
import ShortSubtasks from '../components/shortSubtasks';
import Vykazy from '../components/vykazy';
import ErrorDisplay, {
  hasAddTaskIssues
} from '../components/errorDisplay/addTaskErrorDisplay';

import {
  pickSelectStyle,
  pickSelectStyleWithRequired,
} from 'configs/components/select';
import booleanSelects from 'configs/constants/boolSelect'
import {
  noMilestone
} from 'configs/constants/sidebar';
import {
  getEmptyAttributeRights,
  backendCleanRights,
} from 'configs/constants/projects';
import {
  actionsAfterAdd,
} from 'configs/constants/tasks';
import {
  REST_URL
} from 'configs/restAPI';
import {
  useTranslation
} from "react-i18next";
import {
  addLocalError,
  setProject as setLocalProject,
} from 'apollo/localSchema/actions';

import {
  toSelArr,
  translateAllSelectItems,
  translateSelectItem,
} from 'helperFunctions';
import 'scss/direct/task-ckeditor.scss';

export default function TaskAdd( props ) {
  //data & queries
  const {
    history,
    match,
    loading,
    projectID,
    currentUser,
    projects,
    myProjects,
    users,
    taskTypes,
    tripTypes,
    companies,
    defaultUnit,
    closeModal,
    addTask,
    setTaskLayout,
    setAfterTaskCreate,
    duplicateTask,
  } = props;

  const {
    t
  } = useTranslation();

  const getDuplicateTaskAttribute = ( key, defValue ) => {
    if ( duplicateTask ) {
      if (
        [
          'assignedTo',
          'closeDate',
          'deadline',
          'startsAt',
          'description',
          'important',
          'overtime',
          'pausal',
          'pendingChangable',
          'pendingDate',
          'status',
          'tags',
          'taskType',
          'company',
          'milestone',
          'requester',
          'title',
        ].includes( key )
      ) {
        return duplicateTask[ key ];
      } else if ( key === 'project' ) {
        return projects.find( ( project ) => duplicateTask.project.project.id === project.id );
      } else if ( [
        'shortSubtasks',
        'subtasks',
        'workTrips',
        'materials',
      ].includes( key ) ) {
        return duplicateTask[ key ].map( ( item ) => ( {
          ...item,
          id: fakeID--
        } ) );
      }
    }
    return defValue;
  }

  const afterTaskCreate = currentUser.afterTaskCreate;
  const currentUserIfInProject = ( project ) => {
    return project && project.users.some( ( userData ) => userData.user.id === currentUser.id ) ? users.find( ( user ) => user.id === currentUser.id ) : null;
  }
  const initialProject = projectID ? projects.find( p => p.id === projectID ) : null;

  const initialAssignableUsers = users.filter( ( user ) => initialProject && initialProject.users.some( ( userData ) => userData.assignable && userData.user.id === user.id ) );
  //state
  const [ title, setTitle ] = React.useState( getDuplicateTaskAttribute( 'title', "" ) );
  const [ project, setProject ] = React.useState( getDuplicateTaskAttribute( 'project', initialProject ) );
  const [ tagsOpen, setTagsOpen ] = React.useState( false );

  const [ attachments, setAttachments ] = React.useState( [] );
  const [ assignedTo, setAssignedTo ] = React.useState( getDuplicateTaskAttribute( 'assignedTo', initialAssignableUsers.filter( ( user ) => user.id === currentUser.id ) ) );
  const [ closeDate, setCloseDate ] = React.useState( getDuplicateTaskAttribute( 'closeDate', null ) );
  const [ company, setCompany ] = React.useState( getDuplicateTaskAttribute( 'company', null ) );
  const [ deadline, setDeadline ] = React.useState( getDuplicateTaskAttribute( 'deadline', null ) );
  const [ startsAt, setStartsAt ] = React.useState( getDuplicateTaskAttribute( 'startsAt', null ) );
  const [ description, setDescription ] = React.useState( getDuplicateTaskAttribute( 'description', "" ) );
  const [ descriptionVisible, setDescriptionVisible ] = React.useState( false );
  const [ milestone, setMilestone ] = React.useState( getDuplicateTaskAttribute( 'description', translateSelectItem( noMilestone, t ) ) );
  const [ overtime, setOvertime ] = React.useState( getDuplicateTaskAttribute( 'overtime', translateAllSelectItems( booleanSelects, t )[ 0 ] ) );
  const [ pausal, setPausal ] = React.useState( getDuplicateTaskAttribute( 'pausal', translateAllSelectItems( booleanSelects, t )[ 0 ] ) );
  const [ pendingDate, setPendingDate ] = React.useState( getDuplicateTaskAttribute( 'pendingDate', null ) );
  const [ pendingChangable, setPendingChangable ] = React.useState( getDuplicateTaskAttribute( 'pendingChangable', false ) );
  const [ important, setImportant ] = React.useState( getDuplicateTaskAttribute( 'important', false ) );
  const [ repeat, setRepeat ] = React.useState( null );
  const [ requester, setRequester ] = React.useState( getDuplicateTaskAttribute( 'requester', currentUserIfInProject( project ) ) );
  const [ status, setStatus ] = React.useState( getDuplicateTaskAttribute( 'status', null ) );
  const [ tags, setTags ] = React.useState( getDuplicateTaskAttribute( 'tags', [] ) );
  const [ taskType, setTaskType ] = React.useState( getDuplicateTaskAttribute( 'taskType', null ) );
  const [ simpleSubtasks, setSimpleSubtasks ] = React.useState( getDuplicateTaskAttribute( 'shortSubtasks', [] ) );
  const [ subtasks, setSubtasks ] = React.useState( getDuplicateTaskAttribute( 'subtasks', [] ) );
  const [ workTrips, setWorkTrips ] = React.useState( getDuplicateTaskAttribute( 'workTrips', [] ) );
  const [ materials, setMaterials ] = React.useState( getDuplicateTaskAttribute( 'materials', [] ) );

  const [ saving, setSaving ] = React.useState( false );
  const [ showLocalCreationError, setShowLocalCreationError ] = React.useState( false );

  const projectUsers = users.filter( ( user ) => project && project.users.some( ( userData ) => userData.user.id === user.id ) );
  const assignableUsers = users.filter( ( user ) => project && project.users.some( ( userData ) => userData.assignable && userData.user.id === user.id ) );
  const projectRequesters = project && project.lockedRequester ? projectUsers : users;

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

  const getTaskData = () => ( {
    shortSubtasks: simpleSubtasks,
    subtasks,
    workTrips,
    materials,
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
    project,
    requester,
    status,
    tags,
    taskType,
    title,
  } );


  //assignedTo je fixne a nie dlzky 0 a nie je to identicke alebo je dlzky 0 a bud to nie je user alebo prazdne
  //ak je nieco required a empty
  const cannotSave = (
    saving ||
    loading ||
    hasAddTaskIssues( {
      ...getTaskData(),
      userRights,
      projectAttributes,
      currentUser,
    }, t )
  );

  //reactions
  React.useEffect( () => {
    setDefaults( project );
  }, [ project.id ] );

  React.useEffect( () => {
    if ( project ) {
      const updatedProject = projects.find( ( project2 ) => project2.id === project.id )
      if ( updatedProject ) {
        setProject( updatedProject );
      } else {
        setTags( [] );
        setStatus( null );
        //setMilestone( noMilestone );
        setProject( projects[ 0 ] );
        if ( closeModal ) {
          closeModal( true );
        }
      }
    }
  }, [ projects ] );

  React.useEffect( () => {
    if ( company ) {
      const updatedCompany = companies.find( ( company2 ) => company2.id === company.id )
      if ( updatedCompany ) {
        setCompany( updatedCompany );
        if ( !project.projectAttributes.pausal.fixed ) {
          setPausal( updatedCompany.monthly ? translateAllSelectItems( booleanSelects, t )[ 1 ] : translateAllSelectItems( booleanSelects, t )[ 0 ] );
        }
      } else {
        setCompany( null );
        if ( !project.projectAttributes.pausal.fixed ) {
          setPausal( translateAllSelectItems( booleanSelects, t )[ 0 ] );
        }
      }
    }
  }, [ companies ] );

  React.useEffect( () => {
    if ( subtasks.length > 0 ) {
      setSubtasks( subtasks.map( ( subtask ) => {
        const updatedUser = users.find( ( user2 ) => user2.id === subtask.assignedTo.id )
        return {
          ...subtask,
          assignedTo: updatedUser ? updatedUser : null,
        }
      } ) );
    }
    if ( workTrips.length > 0 ) {
      setSubtasks( workTrips.map( ( trip ) => {
        const updatedUser = users.find( ( user2 ) => user2.id === trip.assignedTo.id )
        return {
          ...trip,
          assignedTo: updatedUser ? updatedUser : null,
        }
      } ) );
    }

    if ( assignedTo.length > 0 ) {
      const updatedAssignedTos = users.filter( ( user ) => assignedTo.some( ( user2 ) => user2.id === user.id ) );
      setAssignedTo( updatedAssignedTos );
    }

    if ( requester ) {
      const updatedRequester = users.find( ( user2 ) => user2.id === requester.id )
      if ( updatedRequester ) {
        setRequester( updatedRequester );
      } else {
        setRequester( null );
      }
    }
  }, [ users ] );

  React.useEffect( () => {
    updateWorks( assignedTo );
  }, [ assignedTo ] );

  //functions
  const updateWorks = ( assignedTo ) => {
    const defAssigned = assignedTo.length > 0 ? users.find( ( user2 ) => user2.id === assignedTo[ 0 ].id ) : null;
    setSubtasks( subtasks.map( ( subtask ) => {
      const updatedUser = assignedTo.some( ( user2 ) => user2.id === subtask.assignedTo.id )
      return {
        ...subtask,
        assignedTo: updatedUser ? subtask.assignedTo : defAssigned,
      }
    } ) );
    setWorkTrips( workTrips.map( ( trip ) => {
      const updatedUser = assignedTo.some( ( user2 ) => user2.id === trip.assignedTo.id )
      return {
        ...trip,
        assignedTo: updatedUser ? trip.assignedTo : defAssigned,
      }
    } ) );
  }

  const setDefaults = ( project, forced ) => {
    if ( project === null || !project.projectAttributes ) {
      return;
    }
    updateToProjectRules( project );
  }

  const updateToProjectRules = ( project ) => {
    if ( !project ) {
      return;
    }

    //dont care for fixed, set defaults and fixed will restrict editing
    const potencialUser = currentUserIfInProject( project );
    const userRights = {
      rights: project.right,
      attributeRights: project.attributeRights
    };

    const projectAttributes = (
      project ?
      project.projectAttributes :
      getEmptyAttributeRights()
    );

    let maybeRequester = null;
    if ( users ) {
      if ( project.lockedRequester && currentUser.role.level !== 0 ) {
        maybeRequester = potencialUser;
      } else {
        maybeRequester = users.find( ( user ) => user.id === currentUser.id );
      }
    }

    const projectUsers = users.filter( ( user ) => project.users.some( ( userData ) => userData.user.id === user.id ) );
    const assignableUsers = users.filter( ( user ) => project.users.some( ( userData ) => userData.assignable && userData.user.id === user.id ) );
    const projectRequesters = ( project.lockedRequester ? projectUsers : users );

    if ( projectAttributes.assigned.fixed ) {
      if ( projectAttributes.assigned.value.length === 0 && userRights.attributeRights.assigned.add ) {
        setAssignedTo( potencialUser ? [ potencialUser ] : [] );
      } else {
        setAssignedTo( assignableUsers.filter( ( user ) => projectAttributes.assigned.value.some( ( user2 ) => user.id === user2.id ) ) );
      }
    } else {
      let newAssignedTo = assignedTo.filter( ( user ) => assignableUsers.some( ( user2 ) => user.id === user2.id ) );
      newAssignedTo = [
        ...newAssignedTo,
        ...assignableUsers.filter( ( user1 ) => projectAttributes.assigned.value.some( ( user2 ) => user1.id === user2.id ) && !newAssignedTo.some( ( user2 ) => user1.id === user2.id ) ),
      ];
      if ( newAssignedTo.length === 0 && potencialUser && userRights.attributeRights.assigned.add ) {
        newAssignedTo = [ potencialUser ];
      }
      setAssignedTo( newAssignedTo );
    }

    let newRequester = null;
    if ( projectAttributes.requester.value !== null ) {
      //has projectAttributesault value
      newRequester = projectRequesters.find( ( user ) => user.id === projectAttributes.requester.value.id );
    } else {
      //no projectAttributesault value but is required or can be recommened
      newRequester = maybeRequester;
    }
    setRequester( newRequester );
    let newType = projectAttributes.taskType.value ? taskTypes.find( ( item ) => item.id === projectAttributes.taskType.value.id ) : null;
    setTaskType( newType );

    if ( projectAttributes.company.value ) {
      setCompany( companies.find( ( company ) => company.id === projectAttributes.company.value.id ) )
    } else {
      if ( newRequester ) {
        setCompany( companies.find( ( company ) => company.id === newRequester.company.id ) )
      } else {
        setCompany( null );
      }
    }

    //status
    const statuses = toSelArr( project.statuses );
    let potentialStatus = statuses.find( ( status ) => status.action.toLowerCase() === 'isnew' );
    if ( !potentialStatus ) {
      potentialStatus = statuses[ 0 ];
    }
    let newStatus = projectAttributes.status.value ? statuses.find( ( item ) => item.id === projectAttributes.status.value.id ) : potentialStatus;
    setStatus( newStatus );

    let tagIds = projectAttributes.tags.value.map( t => t.id );
    let newTags = projectAttributes.tags.value.length > 0 ? project.tags.filter( ( item ) => tagIds.includes( item.id ) ) : tags.filter( ( tag1 ) => project.tags.some( ( tag2 ) => tag2.id === tag1.id ) );
    setTags( newTags );

    let newDeadline = projectAttributes.deadline.value ? moment( parseInt( projectAttributes.deadline.value ) ) : deadline;
    setDeadline( newDeadline );

    let newStartsAt = projectAttributes.startsAt.value ? moment( parseInt( projectAttributes.startsAt.value ) ) : startsAt;
    setStartsAt( newStartsAt );

    let newOvertime = projectAttributes.overtime.value !== null ? translateAllSelectItems( booleanSelects, t )
      .find( ( item ) => projectAttributes.overtime.value === item.value ) : overtime;
    setOvertime( newOvertime );

    let newPausal = projectAttributes.pausal.value !== null ? translateAllSelectItems( booleanSelects, t )
      .find( ( item ) => projectAttributes.pausal.value === item.value ) : pausal;
    setPausal( newPausal );
  }

  const addTaskFunc = () => {
    let link = '';
    if ( match.params.hasOwnProperty( 'listID' ) ) {
      link = '/helpdesk/taskList/i/' + match.params.listID;
    } else {
      link = '/helpdesk/taskList/i/all'
    }


    setSaving( true );
    addTask( {
        variables: {
          important,
          title,
          closeDate: closeDate ? closeDate.valueOf()
            .toString() : null,
          assignedTo: assignedTo.map( user => user.id ),
          company: company ? company.id : null,
          startsAt: startsAt ? startsAt.valueOf()
            .toString() : null,
          deadline: deadline ? deadline.valueOf()
            .toString() : null,
          description,
          milestone: /*milestone ? milestone.id : */ null,
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
          repeat: repeat ? {
            active: repeat.active,
            repeatInterval: repeat.repeatInterval.value,
            startsAt: repeat.startsAt.valueOf()
              .toString(),
            repeatEvery: parseInt( repeat.repeatEvery )
          } : null,
          subtasks: subtasks.map( item => ( {
            title: item.title,
            order: item.order,
            done: item.done,
            approved: item.approved,
            quantity: item.quantity,
            discount: item.discount,
            type: item.type.id,
            assignedTo: item.assignedTo.id,
            scheduled: item.scheduled,
          } ) ),
          workTrips: workTrips.map( item => ( {
            order: item.order,
            done: item.done,
            approved: item.approved,
            quantity: item.quantity,
            discount: item.discount,
            type: item.type.id,
            assignedTo: item.assignedTo.id,
            scheduled: item.scheduled,
          } ) ),
          materials: materials.map( item => ( {
            title: item.title,
            order: item.order,
            done: item.done,
            approved: item.approved,
            quantity: item.quantity,
            margin: item.margin,
            price: parseFloat( item.price )
          } ) ),
          shortSubtasks: simpleSubtasks.map( ( item ) => ( {
            done: item.done,
            title: item.title,
          } ) ),
        }
      } )
      .then( ( response ) => {
        if ( attachments.length > 0 ) {
          const formData = new FormData();
          attachments.map( ( attachment ) => attachment.data )
            .forEach( ( file ) => formData.append( `file`, file ) );
          formData.append( "token", `Bearer ${sessionStorage.getItem( "acctok" )}` );
          formData.append( "taskId", response.data.addTask.id );
          formData.append( "newTask", true );
          axios.post( `${REST_URL}/upload-attachments`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            } )
            .then( async ( response2 ) => {
              if ( response2.data.ok ) {
                if ( repeat ) {
                  const formData = new FormData();
                  attachments.map( ( attachment ) => attachment.data )
                    .forEach( ( file ) => formData.append( `file`, file ) );
                  formData.append( "token", `Bearer ${sessionStorage.getItem( "acctok" )}` );
                  formData.append( "repeatTemplateId", response.data.addTask.repeat.repeatTemplate.id );
                  formData.append( "newTask", true );
                  await axios.post( `${REST_URL}/upload-repeat-template-attachments`, formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  } )
                }
                setSaving( false );
                closeModal();
                return;
              } else {
                setSaving( false );
              }
            } )
            .catch( ( err ) => {
              addLocalError( err );
              setSaving( false );
            } );
        } else {
          setSaving( false );
          closeModal();
          return;
        }
      } )
      .catch( ( err ) => {
        addLocalError( err );
        setSaving( false );
      } );
  }

  const pickDatepickerStyles = ( value, required ) => {
    if ( required && ( value === null || !value.isValid() ) ) {
      return "form-control datepicker-required"
    }
    return "form-control"
  }

  //RENDERS
  const renderSide = () => {
    return (
      <div className="task-edit-right p-b-20 p-t-20">
        <div className="form-selects-entry-column" >
          <Label>{t('project')}<span className="warning-big">*</span></Label>
          <div className="form-selects-entry-column-rest" >
            <Select
              placeholder={t('selectProject')}
              value={project}
              onChange={(project)=>{
                setTags([]);
                setStatus(null);
                //setMilestone(noMilestone);
                setProject(project);
              }}
              options={projects.filter((project) => currentUser.role.level === 0 || project.right.addTask )}
              styles={pickSelectStyle( [ 'noArrow', 'required', ] )}
              />
          </div>
        </div>
        { userRights.attributeRights.status.add &&
          <div className="form-selects-entry-column" >
            <Label>{t('status')}{ userRights.attributeRights.status.required && <span className="warning-big">*</span> }</Label>
            <div className="form-selects-entry-column-rest" >
              { (projectAttributes.status.fixed || !userRights.attributeRights.status.edit ) &&
                <div
                  className={`disabled-info`}
                  style={status ? { backgroundColor: status.color, color: 'white', fontWeight: 'bolder' } : {} }
                  >
                  {status ? status.label : t('none')}
                </div>
              }
              { !projectAttributes.status.fixed && userRights.attributeRights.status.add &&
                <Select
                  placeholder={t('statusPlaceholder')}
                  value={status}
                  styles={ pickSelectStyle([ 'noArrow', 'colored', 'required', ]) }
                  onChange={(status)=>{
                    if(status.action==='PendingDate'){
                      setStatus(status);
                      setPendingDate( moment().add(1,'d') );
                    }else if(status.action==='CloseDate' || status.action==='CloseInvalid'){
                      setStatus(status);
                      setCloseDate( moment() );
                    }
                    else{
                      setStatus(status);
                    }
                  }}
                  options={project ? toSelArr(project.statuses.filter((status) => status.action.toLowerCase() !== 'invoiced' )) : []}
                  />
              }
            </div>
          </div>
        }
        { userRights.attributeRights.requester.add &&
          <div className="form-selects-entry-column" >
            <Label>{t('requester')}{ userRights.attributeRights.requester.required && <span className="warning-big">*</span> }</Label>
            <div className="form-selects-entry-column-rest" >
              { (projectAttributes.requester.fixed || !userRights.attributeRights.requester.edit ) &&
                <div className="disabled-info">{requester ? requester.label : t('none')}</div>
              }
              { !projectAttributes.requester.fixed && userRights.attributeRights.requester.add &&
                <Select
                  value={requester}
                  placeholder={t('requesterPlaceholder')}
                  onChange={(requester)=>{
                    setRequester(requester);
                    if(userRights.attributeRights.company.add && !projectAttributes.company.fixed){
                      const newCompany = companies.find((company) => company.id === requester.company.id );
                      setCompany(newCompany);
                    }
                  }}
                  options={projectRequesters}
                  styles={ pickSelectStyleWithRequired([ 'noArrow'], ['required'], userRights.attributeRights.requester.required ) }
                  />
              }
            </div>
          </div>
        }
        { userRights.attributeRights.company.add &&
          <div className="form-selects-entry-column" >
            <Label>{t('company')}{ userRights.attributeRights.company.required && <span className="warning-big">*</span>}</Label>
            <div className="form-selects-entry-column-rest" >
              { (projectAttributes.company.fixed || !userRights.attributeRights.company.edit ) &&
                <div className="disabled-info">{company ? company.label : t('none')}</div>
              }
              { !projectAttributes.company.fixed && userRights.attributeRights.company.add &&
                <Select
                  value={company}
                  placeholder={t('companyPlaceholder')}
                  onChange={(company)=> {
                    setCompany(company);
                    if(!project.projectAttributes.pausal.fixed){
                      setPausal(company.monthly ? translateAllSelectItems(booleanSelects, t )[1] : translateAllSelectItems(booleanSelects, t )[0]);
                    }
                  }}
                  options={companies}
                  styles={ pickSelectStyle( ['noArrow', 'required' ] ) }
                  />
              }
            </div>
          </div>
        }
        { userRights.attributeRights.assigned.add &&
          <div className="form-selects-entry-column" >
            <Label>{t('assignedTo')}{ userRights.attributeRights.assigned.required && <span className="warning-big">*</span>}</Label>
            <div className="form-selects-entry-column-rest" >
              { (projectAttributes.assigned.fixed || !userRights.attributeRights.assigned.edit ) &&
                <div>
                  { assignedTo.map((user) => (
                    <div className="disabled-info" key={user.id}>{user.label}</div>
                  ))}
                  { assignedTo.length === 0 &&
                    <div className="message error-message">{t('taskUnassigned')}</div>
                  }
                </div>
              }
              { !projectAttributes.assigned.fixed && userRights.attributeRights.assigned.add &&
                <Select
                  placeholder={t('selectRecommended')}
                  value={assignedTo}
                  isMulti
                  onChange={(users)=> {
                    setAssignedTo(users);
                  }}
                  options={assignableUsers}
                  styles={pickSelectStyleWithRequired([ 'noArrow' ],['required'], userRights.attributeRights.assigned.required)}
                  />
              }
            </div>
          </div>
        }
        { userRights.attributeRights.startsAt.add &&
          <div className="form-selects-entry-column" >
            <Label>{t('plannedAt')}{ userRights.attributeRights.startsAt.required && <span className="warning-big">*</span> }</Label>
            <div className="form-selects-entry-column-rest" >
              { (projectAttributes.startsAt.fixed || !userRights.attributeRights.startsAt.edit ) &&
                <div className="disabled-info">{startsAt}</div>
              }
              { !projectAttributes.startsAt.fixed && userRights.attributeRights.startsAt.add &&
                <DatePicker
                  className={pickDatepickerStyles(startsAt, userRights.attributeRights.startsAt.required )}
                  selected={startsAt}
                  hideTime
                  isClearable
                  onChange={date => {
                    setStartsAt( isNaN(date.valueOf()) ? null : date );
                  }}
                  placeholderText={t('plannedAtPlaceholder')}
                  />
              }
            </div>
          </div>
        }
        { userRights.attributeRights.deadline.add &&
          <div className="form-selects-entry-column" >
            <Label>{t('deadline')}{ userRights.attributeRights.deadline.required && <span className="warning-big">*</span> }</Label>
            <div className="form-selects-entry-column-rest" >
              { (projectAttributes.deadline.fixed || !userRights.attributeRights.deadline.edit ) &&
                <div className="disabled-info">{deadline}</div>
              }
              { !projectAttributes.deadline.fixed && userRights.attributeRights.deadline.add &&
                <DatePicker
                  className={pickDatepickerStyles(deadline, userRights.attributeRights.deadline.required )}
                  selected={deadline}
                  onChange={date => setDeadline( isNaN(date.valueOf()) ? null : date )}
                  hideTime
                  isClearable
                  placeholderText={t('deadlinePlaceholder')}
                  />
              }
            </div>
          </div>
        }
        { userRights.attributeRights.repeat.add &&
          <Repeat
            taskID={null}
            repeat={repeat}
            disabled={!userRights.attributeRights.repeat.add}
            submitRepeat={(repeat)=>{
              if(!userRights.attributeRights.repeat.add){
                return;
              }
              setRepeat(repeat);
            }}
            deleteRepeat={()=>{
              setRepeat(null);
            }}
            columns={true}
            addTask={true}
            vertical={true}
            />
        }
        { userRights.attributeRights.taskType.add &&
          <div className="form-selects-entry-column" >
            <Label>{t('taskType')}{ userRights.attributeRights.taskType.required && <span className="warning-big">*</span> }</Label>
            <div className="form-selects-entry-column-rest" >
              { (projectAttributes.taskType.fixed || !userRights.attributeRights.taskType.edit ) &&
                <div className="disabled-info">{taskType ? taskType.label : t('none')}</div>
              }
              { !projectAttributes.taskType.fixed && userRights.attributeRights.taskType.edit &&
                <Select
                  placeholder={t('taskTypePlaceholder')}
                  value={taskType}
                  styles={ pickSelectStyleWithRequired([ 'noArrow'], ['required'], userRights.attributeRights.taskType.required ) }
                  onChange={(taskType)=> {
                    setTaskType(taskType);
                  }}
                  options={taskTypes}
                  />
              }
            </div>
          </div>
        }
        { userRights.attributeRights.pausal.add &&
          <div className="form-selects-entry-column" >
            <Label>{t('pausal')}{ userRights.attributeRights.pausal.required && <span className="warning-big">*</span> }</Label>
            <div className="form-selects-entry-column-rest" >
              { ( !userRights.attributeRights.pausal.edit || !company || !company.monthly || projectAttributes.pausal.fixed ) &&
                <div className="disabled-info">{pausal ? pausal.label : t('none')}</div>
              }
              { userRights.attributeRights.pausal.add && company && company.monthly && !projectAttributes.pausal.fixed &&
                <Select
                  value={pausal}
                  placeholder={t('selectRequired')}
                  styles={ pickSelectStyle([ 'noArrow', 'required', ]) }
                  onChange={(pausal)=> setPausal(pausal)}
                  options={translateAllSelectItems(booleanSelects, t )}
                  />
              }
            </div>
          </div>
        }
        { userRights.attributeRights.overtime.add &&
          <div className="form-selects-entry-column" >
            <Label>{t('overtimeShort')}{ userRights.attributeRights.overtime.required && <span className="warning-big">*</span> }</Label>
            <div className="form-selects-entry-column-rest" >
              { (projectAttributes.overtime.fixed || !userRights.attributeRights.overtime.edit ) &&
                <div className="disabled-info">{overtime.label}</div>
              }
              { !projectAttributes.overtime.fixed && userRights.attributeRights.overtime.add &&
                <Select
                  placeholder={t('selectRequired')}
                  value={overtime}
                  styles={ pickSelectStyle([ 'noArrow', 'required', ]) }
                  onChange={(overtime) => setOvertime(overtime)}
                  options={translateAllSelectItems(booleanSelects, t )}
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
      <div className="task-edit-left">

        <div className="form-section row">
          <div className="flex">
            <Label>{t('taskTitle')}<span className="warning-big m-l-5">*</span> </Label>
            <div className={classnames( "row m-l-10", {"placeholder-highlight": showLocalCreationError && title.length === 0 })}>
              { userRights.rights.taskImportant &&
                <button
                  type="button"
                  style={{color: '#ffc107'}}
                  className="btn-link center-hor m-r-10"
                  onClick={()=>{
                    setImportant(!important);
                  }}
                  >
                  <i className={`fa${ important ? 's' : 'r' } fa-star`} style={{ fontSize: 25 }} />
                </button>
              }
              <input type="text"
                value={title}
                className="form-control task-title-input"
                onChange={ (e) => setTitle(e.target.value) }
                placeholder={t('newTaskTitlePlaceholder')} />
            </div>
            { status && userRights.attributeRights.status.add &&
              (['CloseDate','PendingDate','CloseInvalid']).includes(status.action) &&
              <div className="task-info ml-auto">
                {(status.action==='CloseDate' || status.action==='CloseInvalid') ? `${t('closedAt')}: ` : `${t('pendingDate')}: `}
                <DatePicker
                  className="form-control hidden-input bolder p-0 text-right width-95"
                  selected={(status.action==='CloseDate' || status.action==='CloseInvalid') ? closeDate : pendingDate }
                  onChange={date => {
                    if (status.action==='CloseDate' || status.action==='CloseInvalid'){
                      setCloseDate(date);
                    } else {
                      setPendingDate(date);
                    }
                  }}
                  placeholderText={(status.action==='CloseDate' || status.action==='CloseInvalid') ? t('noCloseDate') : t('noPendingDate')}
                  />
              </div>
            }
          </div>
        </div>

        { renderDescriptionAttachmentsTags() }

        { userRights.rights.taskSubtasksWrite &&
          <ShortSubtasks
            shortSubtasks={simpleSubtasks}
            setShortSubtasks={setSimpleSubtasks}
            />
        }

        { (
          userRights.rights.taskWorksWrite ||
          userRights.rights.taskWorksAdvancedWrite ||
          userRights.rights.taskMaterialsWrite
        ) &&
        <Vykazy
          autoApproved={project ? project.autoApproved : false}
          userRights={userRights}
          currentUser={currentUser}
          assignedTo={assignedTo}
          company={company}
          works={subtasks}
          setWorks={setSubtasks}
          taskTypes={taskTypes}
          taskType={taskType}
          trips={workTrips}
          setTrips={setWorkTrips}
          tripTypes={tripTypes}
          materials={materials}
          setMaterials={setMaterials}
          setSaving={setSaving}
          />
      }
      <div className="row m-b-20 m-l-10">
        {closeModal &&
          <button className="btn-link-cancel" onClick={() => closeModal()}>{t('cancel')}</button>
        }
        <div className="ml-auto">
          <button
            className="btn"
            onClick={() => {
              if (cannotSave) {
                setShowLocalCreationError(true);
              } else {
                addTaskFunc();
              }
            }}
            >
            {saving ? `${t('creating')}...` : `${t('createTask')}`}
          </button>
        </div>
      </div>
      { showLocalCreationError &&
        <ErrorDisplay
          {...getTaskData()}
          currentUser={currentUser}
          userRights={userRights}
          projectAttributes={projectAttributes}
          />
      }
    </div>
    );
  };

  const renderDescriptionAttachmentsTags = () => {
    return (
      <div className="form-section">
      <div className="row" style={{alignItems: "baseline"}}>
        <Label className="m-r-10">{t('taskDescription')}</Label>
        <label htmlFor={`uploadAttachment-${null}`} className="btn-link h-20-f btn-distance clickable" >
          <i className="fa fa-plus" />
          {t('attachment')}
        </label>
        { userRights.attributeRights.tags.add &&
          <TagsPickerPopover
            taskID={'add'}
            required={userRights.attributeRights.tags.required}
            disabled={ projectAttributes.tags.fixed }
            items={toSelArr(project === null ? [] : project.tags)}
            className="center-hor"
            selected={tags}
            onChange={(tags) => {
              setTags(tags);
            }}
            />
        }

        { userRights.attributeRights.tags.add &&
          tags.sort( ( tag1, tag2 ) => tag1.order > tag2.order ? 1 : -1 )
          .map( ( tag ) => (
            <span style={{ background: tag.color, color: 'white', borderRadius: 3 }} key={tag.id} className="m-r-5 p-l-5 p-r-5">
              {tag.title}
            </span>
          ) )
        }
      </div>
      <div className="form-section-rest">
        <CKEditor
          value={description}
          onChange={(description)=>{
            setDescription(description);
          }}
          type="basic"
          />

        <Attachments
          taskID={null}
          top={false}
          type="task"
          attachments={attachments}
          addAttachments={(newAttachments)=>{
            let time = moment().valueOf();
            newAttachments = newAttachments.map((attachment)=>{
              return {
                title:attachment.name,
                size:attachment.size,
                filename: attachment.name,
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
      </div>
    </div>
    )
  }

  return (
    <div style={{backgroundColor: "#f9f9f9"}}>
    <div className="max-height-400 row">

      { renderMain() }
      { renderSide() }

    </div>

  </div>
  );
}