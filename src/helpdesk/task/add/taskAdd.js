import React from 'react';


import Select from 'react-select';
import {
  Label,
} from 'reactstrap';
import CKEditor5 from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DatePicker from 'components/DatePicker';
import MultiSelect from 'components/MultiSelectNew';
import Empty from 'components/Empty';
import Repeat from 'helpdesk/components/repeat/simpleRepeat';

import moment from 'moment';
import classnames from "classnames";
import axios from 'axios';

import Attachments from '../components/attachments';
import ShortSubtasks from '../components/shortSubtasks';
import WorksTable from '../components/vykazy/worksTable';
import Materials from '../components/vykazy/materialsTable';
import ErrorDisplay, {
  hasAddTaskIssues
} from '../components/errorDisplay/addTaskErrorDisplay';

import ck5config from 'configs/components/ck5config';
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
  defaultVykazyChanges,
  noTaskType,
} from '../constants';
import {
  addLocalError,
  setProject as setLocalProject,
} from 'apollo/localSchema/actions';

import {
  toSelArr
} from 'helperFunctions';
import 'scss/direct/task-ckeditor.scss';

let fakeID = -1;

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
  } = props;

  const afterTaskCreate = currentUser.afterTaskCreate;
  const currentUserIfInProject = ( project ) => {
    return project && project.users.some( ( userData ) => userData.user.id === currentUser.id ) ? users.find( ( user ) => user.id === currentUser.id ) : null;
  }

  const layout = 2; //currentUser.taskLayout
  const initialProject = projectID ? projects.find( p => p.id === projectID ) : null;

  const initialAssignableUsers = users.filter( ( user ) => initialProject && initialProject.users.some( ( userData ) => userData.assignable && userData.user.id === user.id ) );
  //state
  const [ project, setProject ] = React.useState( initialProject );
  const [ tagsOpen, setTagsOpen ] = React.useState( false );

  const [ attachments, setAttachments ] = React.useState( [] );
  const [ assignedTo, setAssignedTo ] = React.useState( initialAssignableUsers.filter( ( user ) => user.id === currentUser.id ) );
  const [ closeDate, setCloseDate ] = React.useState( null );
  const [ company, setCompany ] = React.useState( null );
  const [ deadline, setDeadline ] = React.useState( null );
  const [ startsAt, setStartsAt ] = React.useState( null );
  const [ description, setDescription ] = React.useState( "" );
  const [ descriptionVisible, setDescriptionVisible ] = React.useState( false );
  const [ milestone, setMilestone ] = React.useState( [ noMilestone ] );
  const [ overtime, setOvertime ] = React.useState( booleanSelects[ 0 ] );
  const [ pausal, setPausal ] = React.useState( booleanSelects[ 0 ] );
  const [ pendingDate, setPendingDate ] = React.useState( null );
  const [ pendingChangable, setPendingChangable ] = React.useState( false );
  const [ important, setImportant ] = React.useState( false );
  const [ repeat, setRepeat ] = React.useState( null );
  const [ requester, setRequester ] = React.useState( currentUserIfInProject( project ) );
  const [ status, setStatus ] = React.useState( null );
  const [ subtasks, setSubtasks ] = React.useState( [] );
  const [ tags, setTags ] = React.useState( [] );
  const [ materials, setMaterials ] = React.useState( [] );
  const [ taskType, setTaskType ] = React.useState( null );
  const [ title, setTitle ] = React.useState( "" );
  const [ workTrips, setWorkTrips ] = React.useState( [] );
  const [ simpleSubtasks, setSimpleSubtasks ] = React.useState( [] );

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

  //constants
  const getNewID = () => {
    return fakeID--;
  }

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
      projectAttributes
    } )
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
        setPausal( updatedCompany.monthly ? booleanSelects[ 1 ] : booleanSelects[ 0 ] );
      } else {
        setCompany( null );
        setPausal( booleanSelects[ 0 ] );
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
        setAssignedTo( [ potencialUser ] );
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
    let newTags = projectAttributes.tags.projectAttributes ? project.tags.filter( ( item ) => tagIds.includes( item.id ) ) : [];
    setTags( newTags );

    let newDeadline = projectAttributes.deadline.value ? moment( parseInt( projectAttributes.deadline.value ) ) : deadline;
    setDeadline( newDeadline );

    let newStartsAt = projectAttributes.startsAt.value ? moment( parseInt( projectAttributes.startsAt.value ) ) : startsAt;
    setStartsAt( newStartsAt );

    let newOvertime = projectAttributes.overtime.value !== null ? booleanSelects.find( ( item ) => projectAttributes.overtime.value === item.value ) : overtime;
    setOvertime( newOvertime );

    let newPausal = projectAttributes.pausal.value !== null ? booleanSelects.find( ( item ) => projectAttributes.pausal.value === item.value ) : pausal;
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
  const renderHeader = () => {
    return (
      <div className="task-add-layout-2 row">
        <h2 className="center-hor">Create new task</h2>
        {false &&
          <div className="ml-auto m-r-20">
            <button
              type="button"
              className="btn-link task-add-layout-button"
              onClick={ () => {
                setTaskLayout( currentUser.taskLayout === 1 ? 2 : 1 )
              }}>
              <i className="fas fa-retweet "/>
              Layout
            </button>
          </div>
        }
      </div>
    )
  }

  const renderTitle = () => {
    return (
      <div className="form-section row">
        <div className="flex">
          <Label>Task name<span className="warning-big m-l-5">*</span> </Label>
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
              placeholder="Enter new task name" />
          </div>
          { status && userRights.attributeRights.status.add &&
            (['CloseDate','PendingDate','CloseInvalid']).includes(status.action) &&
            <div className="task-info ml-auto">
                {(status.action==='CloseDate' || status.action==='CloseInvalid') ? "Closed at: " : "Pending date: "}
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
                placeholderText="No close date"
                />
            </div>
          }
        </div>
      </div>
    );
  }

  const layoutComponents = {
    Project: (
      <Select
        placeholder="Zadajte projekt"
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
    ),
    Assigned: (
      <div>
        { (projectAttributes.assigned.fixed || !userRights.attributeRights.assigned.edit ) &&
          <div>
            { assignedTo.map((user) => (
              <div className="disabled-info" key={user.id}>{user.label}</div>
            ))}
            { assignedTo.length === 0 &&
              <div className="message error-message">Úloha nepriradená</div>
            }
          </div>
        }
        { !projectAttributes.assigned.fixed && userRights.attributeRights.assigned.add &&
          <Select
            placeholder="Select reccomended"
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
    ),
    Status: (
      <div>
        { (projectAttributes.status.fixed || !userRights.attributeRights.status.edit ) &&
          <div
            className={`disabled-info`}
            style={status ? { backgroundColor: status.color, color: 'white', fontWeight: 'bolder' } : {} }
            >
            {status ? status.label : "None"}
          </div>
        }
        { !projectAttributes.status.fixed && userRights.attributeRights.status.add &&
          <Select
            placeholder="Select required"
            value={status}
            styles={ pickSelectStyle([ 'noArrow', 'colored', 'required', ]) }
            onChange={(status)=>{
              if(status.action==='PendingDate'){
                setStatus(status);
                setPendingDate( moment().add(1,'d') );
              }else if(status.action==='CloseDate'||status.action==='CloseInvalid'){
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
    ),
    Type: (
      <div>
        { (projectAttributes.taskType.fixed || !userRights.attributeRights.taskType.edit ) &&
          <div className="disabled-info">{taskType ? taskType.label : "None"}</div>
        }
        { !projectAttributes.taskType.fixed && userRights.attributeRights.taskType.edit &&
          <Select
            placeholder="Zadajte typ"
            value={taskType}
            styles={ pickSelectStyleWithRequired([ 'noArrow'], ['required'], userRights.attributeRights.taskType.required ) }
            onChange={(taskType)=> {
              setTaskType(taskType);
            }}
            options={taskTypes}
            />
        }
      </div>
    ),
    Requester: (
      <div>
        { (projectAttributes.requester.fixed || !userRights.attributeRights.requester.edit ) &&
          <div className="disabled-info">{requester ? requester.label : "None"}</div>
        }
        { !projectAttributes.requester.fixed && userRights.attributeRights.requester.add &&
          <Select
            value={requester}
            placeholder="Select reccomended"
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
    ),
    Company: (
      <div>
        { (projectAttributes.company.fixed || !userRights.attributeRights.company.edit ) &&
          <div className="disabled-info">{company ? company.label : "None"}</div>
        }
        { !projectAttributes.company.fixed && userRights.attributeRights.company.add &&
          <Select
            value={company}
            placeholder="Select required"
            onChange={(company)=> {
              setCompany(company);
              setPausal(company.monthly ? booleanSelects[1] : booleanSelects[0]);
            }}
            options={companies}
            styles={ pickSelectStyle( ['noArrow', 'required' ] ) }
            />
        }
      </div>
    ),
    StartsAt: (
      <div>
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
            placeholderText="No start date"
            />
        }
      </div>
    ),
    Deadline: (
      <div>
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
            placeholderText="No deadline"
            />
        }
      </div>
    ),
    Pausal: (
      <div>
        { ( !userRights.attributeRights.pausal.edit || !company || !company.monthly || projectAttributes.pausal.fixed ) &&
          <div className="disabled-info">{pausal ? pausal.label : "None"}</div>
        }
        { userRights.attributeRights.pausal.add && company && company.monthly && !projectAttributes.pausal.fixed &&
          <Select
            value={pausal}
            placeholder="Select required"
            styles={ pickSelectStyle([ 'noArrow', 'required', ]) }
            onChange={(pausal)=> setPausal(pausal)}
            options={booleanSelects}
            />
        }
      </div>
    ),
    Overtime: (
      <div>
        { (projectAttributes.overtime.fixed || !userRights.attributeRights.overtime.edit ) &&
          <div className="disabled-info">{overtime.label}</div>
        }
        { !projectAttributes.overtime.fixed && userRights.attributeRights.overtime.add &&
          <Select
            placeholder="Select required"
            value={overtime}
            styles={ pickSelectStyle([ 'noArrow', 'required', ]) }
            onChange={(overtime) => setOvertime(overtime)}
            options={booleanSelects}
            />
        }
      </div>
    )
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
                  { layoutComponents.Project }
                </div>
              </div>
            </div>
            { userRights.attributeRights.assigned.add &&
              <div className="col-8">
                <div className="row p-r-10">
                  <Label className="col-1-45 col-form-label">Assigned { userRights.attributeRights.assigned.required && <span className="warning-big">*</span> }</Label>
                  <div className="col-10-45">
                    { layoutComponents.Assigned }
                  </div>
                </div>
              </div>
            }
          </div>

          <div className="row">
            <div className="col-4">
              { userRights.attributeRights.status.add &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Status { userRights.attributeRights.status.required && <span className="warning-big">*</span> }</Label>
                  <div className="col-9">
                    { layoutComponents.Status }
                  </div>
                </div>
              }

              { userRights.attributeRights.taskType.add &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Task type { userRights.attributeRights.taskType.required && <span className="warning-big">*</span>}</Label>
                  <div className="col-9">
                    { layoutComponents.Type }
                  </div>
                </div>
              }
            </div>

            <div className="col-4">
              { userRights.attributeRights.requester.add &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Requester { userRights.attributeRights.requester.required && <span className="warning-big">*</span>}</Label>
                  <div className="col-9">
                    { layoutComponents.Requester }
                  </div>
                </div>
              }
              { userRights.attributeRights.company.add &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Company { userRights.attributeRights.company.required && <span className="warning-big">*</span>}</Label>
                  <div className="col-9">
                    { layoutComponents.Company }
                  </div>
                </div>
              }
              { userRights.attributeRights.pausal.add &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Pausal { userRights.attributeRights.pausal.required && <span className="warning-big">*</span>}</Label>
                  <div className="col-9">
                    { layoutComponents.Pausal }
                  </div>
                </div>
              }
            </div>

            <div className="col-4">
              { userRights.attributeRights.startsAt.add &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Starts at { userRights.attributeRights.startsAt.required && <span className="warning-big">*</span> }</Label>
                  <div className="col-9">
                    { layoutComponents.StartsAt }
                  </div>
                </div>
              }
              { userRights.attributeRights.deadline.add &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Deadline { userRights.attributeRights.deadline.required && <span className="warning-big">*</span> }</Label>
                  <div className="col-9">
                    { layoutComponents.Deadline }
                  </div>
                </div>
              }

              { userRights.attributeRights.repeat.add &&
                <Repeat
                  taskID={null}
                  repeat={repeat}
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
                  vertical={false}
                  addTask={true}
                  />
              }
              { userRights.attributeRights.overtime.add &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">After working hours{ userRights.attributeRights.overtime.required && <span className="warning-big">*</span> }</Label>
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
        { userRights.attributeRights.status.add &&
          <div className="col-2" >
            <Label className="col-form-label">Status { userRights.attributeRights.status.required && <span className="warning-big">*</span> }</Label>
            { layoutComponents.Status }
          </div>
        }
        { userRights.attributeRights.requester.add &&
          <div className="col-2">
            <Label className="col-form-label">Zadal { userRights.attributeRights.requester.required && <span className="warning-big">*</span> }</Label>
            { layoutComponents.Requester }
          </div>
        }
        { userRights.attributeRights.company.add &&
          <div className="col-2">
            <Label className="col-form-label">Firma { userRights.attributeRights.company.required && <span className="warning-big">*</span> }</Label>
            { layoutComponents.Company }
          </div>
        }
      </div>
    )
  }

  const renderSelectsLayout2Side = () => {
    return (
      <div className="task-edit-right p-b-20 p-t-20">
        <div className="form-selects-entry-column" >
          <Label>Project <span className="warning-big">*</span></Label>
          <div className="form-selects-entry-column-rest" >
            { layoutComponents.Project }
          </div>
        </div>
        { userRights.attributeRights.status.add &&
          <div className="form-selects-entry-column" >
            <Label>Status { userRights.attributeRights.status.required && <span className="warning-big">*</span> }</Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Status }
            </div>
          </div>
        }
        { userRights.attributeRights.requester.add &&
          <div className="form-selects-entry-column" >
            <Label>Requester { userRights.attributeRights.requester.required && <span className="warning-big">*</span> }</Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Requester }
            </div>
          </div>
        }
        { userRights.attributeRights.company.add &&
          <div className="form-selects-entry-column" >
            <Label>Company { userRights.attributeRights.company.required && <span className="warning-big">*</span>}</Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Company }
            </div>
          </div>
        }
        { userRights.attributeRights.assigned.add &&
          <div className="form-selects-entry-column" >
            <Label>Assigned { userRights.attributeRights.assigned.required && <span className="warning-big">*</span>}</Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Assigned }
            </div>
          </div>
        }
        { userRights.attributeRights.startsAt.add &&
          <div className="form-selects-entry-column" >
            <Label>Starts at { userRights.attributeRights.startsAt.required && <span className="warning-big">*</span> }</Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.StartsAt }
            </div>
          </div>
        }
        { userRights.attributeRights.deadline.add &&
          <div className="form-selects-entry-column" >
            <Label>Deadline { userRights.attributeRights.deadline.required && <span className="warning-big">*</span> }</Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Deadline }
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
            <Label>Task Type { userRights.attributeRights.taskType.required && <span className="warning-big">*</span> }</Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Type }
            </div>
          </div>
        }
        { userRights.attributeRights.pausal.add &&
          <div className="form-selects-entry-column" >
            <Label>Pausal { userRights.attributeRights.pausal.required && <span className="warning-big">*</span> }</Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Pausal }
            </div>
          </div>
        }
        { userRights.attributeRights.overtime.add &&
          <div className="form-selects-entry-column" >
            <Label>After working hours { userRights.attributeRights.overtime.required && <span className="warning-big">*</span> }</Label>
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
        { userRights.attributeRights.tags.add &&
          <div className="row center-hor">
            <button className="btn-link p-b-10 btn-distance" id="tags-multiselect-add" onClick={ () => setTagsOpen(true) } >
              <i className="fa fa-plus" />
              Tags { userRights.attributeRights.tags.required && <span className="warning-big">*</span> }
            </button>
            <MultiSelect
              className="center-hor"
              disabled={ projectAttributes.tags.fixed }
              direction="right"
              style={{}}
              header="Select tags for this task"
              target="tags-multiselect-add"
              closeMultiSelect={() => { setTagsOpen(false) }}
              open={tagsOpen}
              items={toSelArr(project === null ? [] : project.tags)}
              selected={tags}
              onChange={(tags) => {
                setTags(tags);
              }}
              />
          </div>
        }

        { userRights.attributeRights.tags.add &&
          tags.sort( ( tag1, tag2 ) => tag1.order > tag2.order ? 1 : -1 )
          .map( ( tag ) => (
            <span style={{ background: tag.color, color: 'white', borderRadius: 3 }} className="m-r-5 p-l-5 p-r-5">
              {tag.title}
            </span>
          ) )
        }
      </Empty>
    )
  }

  const renderDescription = () => {
    return (
      <div className="form-section">
        <div className="row" style={{alignItems: "baseline"}}>
          <Label className="m-r-10">Popis úlohy</Label>
          <label htmlFor={`uploadAttachment-${null}`} className="btn-link h-20-f btn-distance clickable" >
            <i className="fa fa-plus" />
            Attachment
          </label>
          {renderMultiSelectTags()}
        </div>
        <div className="form-section-rest">
          <CKEditor5
            editor={ ClassicEditor }
            data={description}
            onInit={(editor)=>{
            }}
            onChange={(e, editor)=>{
              setDescription(editor.getData());
            }}
            config={ck5config}
            />

          {
            renderAttachments(false)
          }
        </div>
      </div>
    )
  }

  const renderSimpleSubtasks = () => {
    if ( !userRights.rights.taskSubtasksWrite ) {
      return null;
    }
    return (
      <ShortSubtasks
        items={simpleSubtasks}
        onChange={(simpleSubtask) => {
          let newSimpleSubtasks = [...simpleSubtasks];
          newSimpleSubtasks[newSimpleSubtasks.findIndex((simpleSubtask2) => simpleSubtask2.id === simpleSubtask.id )] = simpleSubtask;
          setSimpleSubtasks(newSimpleSubtasks);
        }}
        submitItem = { (newSimpleSubtask) => {
          setSimpleSubtasks([
            ...simpleSubtasks,
            {
              ...newSimpleSubtask,
              id: fakeID--,
            }
          ])
        }}
        deleteItem = { (simpleSubtask) => {
          setSimpleSubtasks(simpleSubtasks.filter((simpleSubtask2) => simpleSubtask.id !== simpleSubtask2.id ))
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
        taskID={null}
        top={top}
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
    )
  }

  const renderVykazyTable = ( subtasks, workTrips, materials ) => {
    if (
      !userRights.rights.taskWorksWrite &&
      !userRights.rights.taskWorksAdvancedWrite &&
      !userRights.rights.taskMaterialsWrite
    ) {
      return null
    }

    return (
      <Empty>
        { (
          userRights.rights.taskWorksWrite ||
          userRights.rights.taskWorksAdvancedWrite
        ) &&
        <WorksTable
          userID={currentUser.id}
          userRights={userRights}
          currentUser={currentUser}
          company={company}
          showTotals={true}
          showColumns={ [ 'done', 'title', 'scheduled', 'quantity', 'assigned', 'approved', 'actions' ] }
          showAdvancedColumns={ [ 'done', 'title', 'quantity', 'price', 'discount', 'priceAfterDiscount' , 'actions' ] }
          autoApproved={project ? project.autoApproved : false}
          canAddSubtasksAndTrips={assignedTo.length !== 0}
          canEditInvoiced={false}
          taskAssigned={assignedTo}

          taskTypes={taskTypes}
          defaultType={taskType}
          subtasks={subtasks}
          addSubtask={(newSubtask)=>{
            setSubtasks([...subtasks,{id:getNewID(), ...newSubtask}]);
          }}
          updateSubtask={(id,newData)=>{
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
            let newSubtasks=[...subtasks];
            multipleSubtasks.forEach(({id, newData})=>{
              newSubtasks[newSubtasks.findIndex((taskWork)=>taskWork.id===id)]={...newSubtasks.find((taskWork)=>taskWork.id===id),...newData};
            });
            setSubtasks(newSubtasks);
          }}
          removeSubtask={(id)=>{
            let newSubtasks=[...subtasks];
            newSubtasks.splice(newSubtasks.findIndex((taskWork)=>taskWork.id===id),1);
            setSubtasks(newSubtasks);
          }}

          workTrips={ workTrips }
          tripTypes={tripTypes}
          workTrips={workTrips}
          tripTypes={tripTypes}
          addTrip={(newTrip)=>{
            setWorkTrips([...workTrips,{id: getNewID(),...newTrip}]);
          }}
          updateTrip={(id,newData)=>{
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
            let newTrips=[...workTrips];
            multipleTrips.forEach(({id, newData})=>{
              newTrips[newTrips.findIndex((trip)=>trip.id===id)]={...newTrips.find((trip)=>trip.id===id),...newData};
            });
            setWorkTrips(newTrips);
          }}
          removeTrip={(id)=>{
            let newTrips=[...workTrips];
            newTrips.splice(newTrips.findIndex((trip)=>trip.id===id),1);
            setWorkTrips(newTrips);
          }}
          />

      }

      { userRights.rights.taskMaterialsWrite &&
        <Materials
          showColumns={ [ 'done', 'title', 'quantity', 'price', 'total', 'approved', 'actions' ] }
          showTotals={true}
          autoApproved={project ? project.autoApproved : false}
          userRights={userRights}
          currentUser={currentUser}
          company={company}
          materials={ materials }
          addMaterial={(newMaterial)=>{
            setMaterials([...materials,{id:getNewID(),...newMaterial}]);
          }}
          updateMaterial={(id,newData)=>{
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
            let newMaterials=[...materials];
            multipleMaterials.forEach(({id, newData})=>{
              newMaterials[newMaterials.findIndex((material)=>material.id===id)]={...newMaterials.find((material)=>material.id===id),...newData};
            });
            setMaterials(newMaterials);
          }}
          removeMaterial={(id)=>{
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
      <div className="row m-b-20 m-l-10 m-t-10">
        {closeModal &&
          <button className="btn-link-cancel" onClick={() => closeModal()}>Cancel</button>
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
            > Create task
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{backgroundColor: "#f9f9f9"}}>
    <div
      className={classnames(
        "max-height-400",
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

        { renderVykazyTable(subtasks, workTrips, materials) }

        { renderButtons() }

        { showLocalCreationError &&
          <ErrorDisplay
            {...getTaskData()}
            userRights={userRights}
            projectAttributes={projectAttributes}
            />
        }
      </div>

      { layout === 2 && renderSelectsLayout2Side() }

    </div>

  </div>
  );
}