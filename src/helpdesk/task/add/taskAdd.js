import React from 'react';

import moment from 'moment';
import classnames from "classnames";
import axios from 'axios';

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
import Attachments from 'helpdesk/components/attachments';
import CheckboxList from 'helpdesk/components/checkboxList';
import {
  getCreationError as getVykazyError
} from 'helpdesk/components/vykazy/vykazyTable';
import Materials from 'helpdesk/components/vykazy/materialsTable';
import WorksTable from 'helpdesk/components/vykazy/worksTable';

import ck5config from 'configs/components/ck5config';
import {
  pickSelectStyle,
} from 'configs/components/select';
import booleanSelects from 'configs/constants/boolSelect'
import {
  noMilestone
} from 'configs/constants/sidebar';
import {
  noDef,
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

const localCreationError = "Please fill in all required information.";

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
  const initialProject = projectID ? projects.find( p => p.id === projectID ) : null
  const userRights = (
    currentUser.role.level === 0 ?
    backendCleanRights( true ) :
    (
      initialProject ?
      initialProject.right :
      backendCleanRights()
    )
  );
  const assignableUsers = users.filter( ( user ) => initialProject && initialProject.users.some( ( userData ) => userData.assignable && userData.user.id === user.id ) );
  const projectUsers = users.filter( ( user ) => initialProject && initialProject.users.some( ( userData ) => userData.user.id === user.id ) );
  const projectRequesters = initialProject && initialProject.lockedRequester ? projectUsers : users;
  //state
  const [ project, setProject ] = React.useState( initialProject );
  const [ defaultFields, setDefaultFields ] = React.useState( noDef );
  const [ tagsOpen, setTagsOpen ] = React.useState( false );

  const [ attachments, setAttachments ] = React.useState( [] );
  const [ assignedTo, setAssignedTo ] = React.useState( assignableUsers.filter( ( user ) => user.id === currentUser.id ) );
  const [ closeDate, setCloseDate ] = React.useState( null );
  const [ company, setCompany ] = React.useState( null );
  const [ customItems, setCustomItems ] = React.useState( [] );
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
  const [ actionAfterAdd, setActionAfterAdd ] = React.useState( actionsAfterAdd.find( ( action ) => action.id === afterTaskCreate ) );
  const [ showLocalCreationError, setShowLocalCreationError ] = React.useState( false );


  //constants
  const getNewID = () => {
    return fakeID--;
  }

  const cannotSave = (
    saving ||
    loading ||
    title.length === 0 ||
    ( project.def.status.required && !status ) ||
    ( project.def.assignedTo.fixed && assignedTo.length === 0 ) ||
    ( project.def.requester.required && !requester ) ||
    ( project.def.tag.required && tags.length === 0 ) ||
    ( project.def.pausal.required && !pausal ) ||
    ( project.def.overtime.required && !overtime ) ||
    ( project.def.company.required && !company ) ||
    ( project.def.type.required && !taskType )
  );

  //reactions
  React.useEffect( () => {
    setDefaults( project );
  }, [ project.id ] );

  React.useEffect( () => {
    setActionAfterAdd( actionsAfterAdd.find( ( action ) => action.id === afterTaskCreate ) );
  }, [ afterTaskCreate ] );

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

  //functions
  const setDefaults = ( project, forced ) => {
    if ( project === null ) {
      setDefaultFields( noDef );
      return;
    }

    let def = project.def;
    if ( !def ) {
      setDefaultFields( noDef );
      return;
    }

    if ( props.task && !forced ) {
      setDefaultFields( def );
      return;
    }

    const potencialUser = currentUserIfInProject( project );

    let maybeRequester = null;
    if ( users ) {
      if ( project.lockedRequester ) {
        maybeRequester = potencialUser;
      } else {
        maybeRequester = users.find( ( user ) => user.id === currentUser.id );
      }
    }

    const userRights = project.right;
    const projectUsers = users.filter( ( user ) => project.users.some( ( userData ) => userData.user.id === user.id ) );
    const assignableUsers = users.filter( ( user ) => project.users.some( ( userData ) => userData.assignable && userData.user.id === user.id ) );
    const projectRequesters = ( project.lockedRequester ? projectUsers : users );

    if ( def.assignedTo.fixed ) {
      if ( def.assignedTo.value.length === 0 && userRights.assignedWrite ) {
        setAssignedTo( [ potencialUser ] );
      } else {
        setAssignedTo( assignableUsers.filter( ( user ) => def.assignedTo.value.some( ( user2 ) => user.id === user2.id ) ) );
      }
    } else {
      let newAssignedTo = assignedTo.filter( ( user ) => assignableUsers.some( ( user2 ) => user.id === user2.id ) );
      if ( def.assignedTo.def ) {
        //add def values
        newAssignedTo = [
          ...newAssignedTo,
          ...assignableUsers.filter( ( user1 ) => def.assignedTo.value.some( ( user2 ) => user1.id === user2.id ) && !newAssignedTo.some( ( user2 ) => user1.id === user2.id ) ),
        ]
      }
      if ( newAssignedTo.length === 0 && potencialUser && userRights.assignedWrite ) {
        newAssignedTo = [ potencialUser ];
      }
      setAssignedTo( newAssignedTo );
    }

    let newRequester = null;
    if ( def.requester.def && def.requester.value !== null ) {
      //has default value
      newRequester = projectRequesters.find( ( user ) => user.id === def.requester.value.id );
    } else if ( def.requester.required || userRights.requesterWrite ) {
      //no default value but is required or can be recommened
      newRequester = maybeRequester;
    }
    setRequester( newRequester );
    let newType = def.type.def ? taskTypes.find( ( item ) => item.id === def.type.value.id ) : null;
    setTaskType( newType );

    if ( def.company.def && def.company.value ) {
      setCompany( companies.find( ( company ) => company.id === def.company.value.id ) )
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
    let newStatus = def.status.def && def.status.value ? statuses.find( ( item ) => item.id === def.status.value.id ) : potentialStatus;
    setStatus( newStatus );

    let tagIds = def.tag.value.map( t => t.id );
    let newTags = def.tag.def ? project.tags.filter( ( item ) => tagIds.includes( item.id ) ) : [];
    setTags( newTags );

    let newOvertime = def.overtime.def ? booleanSelects.find( ( item ) => def.overtime.value === item.value ) : overtime;
    setOvertime( newOvertime );

    let newPausal = def.pausal.def ? booleanSelects.find( ( item ) => def.pausal.value === item.value ) : pausal;
    setPausal( newPausal );

    setDefaultFields( def );
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
            repeatEvery: repeat.repeatEvery.toString()
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
          customItems: customItems.map( item => ( {
            title: item.title,
            order: item.order,
            done: item.done,
            approved: item.approved,
            quantity: item.quantity,
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
                  await axios.post( `${REST_URL}/upload-repeat-template-attachments`, formData, {
                    headers: {
                      'Content-Type': 'multipart/form-data'
                    }
                  } )
                }
                setSaving( false );
                switch ( actionAfterAdd.action ) {
                  case 'open_new_task': {
                    closeModal();
                    history.push( `${link}/${response.data.addTask.id}` )
                    break;
                  }
                  case 'open_tasklist': {
                    const myProject = myProjects.find( ( myProject ) => myProject.project.id === project.id );
                    setLocalProject( {
                      ...myProject,
                      id: myProject.project.id,
                      value: myProject.project.id,
                      title: myProject.project.title,
                      label: myProject.project.title,
                    } );
                    closeModal();
                    history.push( `${link}` );
                    break;
                  }
                  default: {
                    break;
                  }
                }
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
          switch ( actionAfterAdd.action ) {
            case 'open_new_task': {
              closeModal();
              history.push( `${link}` );
              break;
            }
            case 'open_tasklist': {
              const myProject = myProjects.find( ( myProject ) => myProject.project.id === project.id );
              setLocalProject( {
                ...myProject,
                id: myProject.project.id,
                value: myProject.project.id,
                title: myProject.project.title,
                label: myProject.project.title,
              } );
              closeModal();
              history.push( `${link}` );
              break;
            }
            default: {
              break;
            }
          }
        }

      } )
      .catch( ( err ) => {
        addLocalError( err );
        setSaving( false );
      } );
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
          <div className={classnames( "row m-l-10", {"placeholder-highlight": showLocalCreationError })}>
            { userRights.important &&
              <button
                type="button"
                style={{color: '#ffc107'}}
                disabled={ !userRights.important }
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
          { status && userRights.statusRead &&
            (['CloseDate','PendingDate','CloseInvalid']).includes(status.action) &&
            <div className="task-info-add ml-auto center-hor">
              <span className="">
                {(status.action==='CloseDate' || status.action==='CloseInvalid') ? "Close date: " : "PendingDate: "}
              </span>
              <DatePicker
                className="form-control hidden-input bolder"
                selected={(status.action==='CloseDate' || status.action==='CloseInvalid') ? closeDate : pendingDate }
                disabled={userRights.statusWrite}
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
    Project: () => (
      <Select
        placeholder="Zadajte projekt"
        value={project}
        onChange={(project)=>{
          setTags([]);
          setStatus(null);
          //setMilestone(noMilestone);
          setProject(project);
        }}
        options={projects.filter((project) => currentUser.role.level === 0 || project.right.addTasks )}
        styles={pickSelectStyle( [ 'noArrow', 'required', ] )}
        />
    ),
    Assigned: (
      <div>
        { (defaultFields.assignedTo.fixed || !userRights.assignedWrite) &&
          <div> {assignedTo.map((user) =>
              <div className="disabled-info">{user.label}</div>
            )}
            { assignedTo.length === 0 &&
              <div className="message error-message">Úloha nepriradená</div>
            }
          </div>
        }
        { userRights.assignedWrite &&
          <Select
            placeholder="Select reccomended"
            value={assignedTo}
            isDisabled={ defaultFields.assignedTo.fixed || !userRights.assignedWrite }
            isMulti
            onChange={(users)=> {
              setAssignedTo(users);
            }}
            options={assignableUsers}
            styles={pickSelectStyle([ 'noArrow' ])}
            />
        }
      </div>
    ),
    Status: (
      <div>
        { (defaultFields.status.fixed || !userRights.statusWrite ) &&
          <div className="disabled-info">{status ? status.label : "None"}</div>
        }
        { !defaultFields.status.fixed && userRights.statusWrite &&
          <Select
            placeholder="Select required"
            value={status}
            isDisabled={defaultFields.status.fixed || !userRights.statusWrite }
            styles={showLocalCreationError ? pickSelectStyle( [ 'noArrow', 'colored', 'required', 'highlight', ] ) : pickSelectStyle([ 'noArrow', 'colored', 'required', ])}
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
      <Select
        placeholder="Zadajte typ"
        value={taskType}
        isDisabled={defaultFields.type.fixed || !userRights.typeWrite }
        styles={ (showLocalCreationError && defaultFields.type.required) ? pickSelectStyle([ 'noArrow', 'required', 'highlight', ])  : pickSelectStyle([ 'noArrow', defaultFields.type.required ? 'required' : ''  ]) }
        onChange={(taskType)=> {
          setTaskType(taskType);
        }}
        options={taskTypes}
        />
    ),
    Requester: (
      <div>
        { (defaultFields.requester.fixed || !userRights.requesterWrite) &&
          <div className="disabled-info">{requester ? requester.label : "None"}</div>
        }
        { !defaultFields.requester.fixed && userRights.requesterWrite &&
          <Select
            value={requester}
            placeholder="Select reccomended"
            isDisabled={defaultFields.requester.fixed || !userRights.requesterWrite}
            onChange={(requester)=>{
              setRequester(requester);
              if(userRights.companyWrite && !defaultFields.company.fixed){
                const newCompany = companies.find((company) => company.id === requester.id );
                setCompany(newCompany);
              }
            }}
            options={projectRequesters}
            styles={ pickSelectStyle([ 'noArrow', ]) }
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
            value={company}
            placeholder="Select required"
            isDisabled={defaultFields.company.fixed || !userRights.companyWrite}
            onChange={(company)=> {
              setCompany(company);
              setPausal(company.monthly ? booleanSelects[1] : booleanSelects[0]);
            }}
            options={companies}
            styles={ showLocalCreationError ? pickSelectStyle([ 'noArrow', 'required', 'highlight', ])  : pickSelectStyle( ['noArrow', 'required' ] ) }
            />
        }
      </div>
    ),
    Pausal: (
      <div>
        { (!userRights.pausalWrite || !company || !company.monthly || defaultFields.pausal.fixed ) &&
          <div className="disabled-info">{pausal ? pausal.label : "None"}</div>
        }
        { userRights.pausalWrite && company && company.monthly && !defaultFields.pausal.fixed &&
          <Select
            value={pausal}
            placeholder="Select required"
            isDisabled={!userRights.pausalWrite || !company || !company.monthly || parseInt(company.taskWorkPausal) < 0 || defaultFields.pausal.fixed}
            styles={ showLocalCreationError ? pickSelectStyle([ 'noArrow', 'required', 'highlight', ])  : pickSelectStyle([ 'noArrow', 'required', ]) }
            onChange={(pausal)=> setPausal(pausal)}
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
            onChange={date => setStartsAt( isNaN(date.valueOf()) ? null : date )}
            hideTime
            isClearable
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
            onChange={date => setDeadline( isNaN(date.valueOf()) ? null : date )}
            hideTime
            isClearable
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
            placeholder="Select required"
            value={overtime}
            isDisabled={ !userRights.overtimeWrite || defaultFields.overtime.fixed}
            styles={ showLocalCreationError ? pickSelectStyle([ 'noArrow', 'required', 'highlight', ])  : pickSelectStyle([ 'noArrow', 'required', ]) }
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
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Status {project.def.status.required && <span className="warning-big">*</span>}</Label>
                  <div className="col-9">
                    { layoutComponents.Status }
                  </div>
                </div>
              }

              { userRights.typeRead &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Task type {project.def.type.required && <span className="warning-big">*</span>}</Label>
                  <div className="col-9">
                    { layoutComponents.Type }
                  </div>
                </div>
              }
            </div>

            <div className="col-4">
              { userRights.requesterRead &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Requester {project.def.requester.required && <span className="warning-big">*</span>}</Label>
                  <div className="col-9">
                    { layoutComponents.Requester }
                  </div>
                </div>
              }
              { userRights.companyRead &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Company {project.def.company.required && <span className="warning-big">*</span>}</Label>
                  <div className="col-9">
                    { layoutComponents.Company }
                  </div>
                </div>
              }
              { userRights.pausalRead &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Pausal {project.def.pausal.required && <span className="warning-big">*</span>}</Label>
                  <div className="col-9">
                    { layoutComponents.Pausal }
                  </div>
                </div>
              }
            </div>

            <div className="col-4">
              { userRights.deadlineRead &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Starts at</Label>
                  <div className="col-9">
                    { layoutComponents.StartsAt }
                  </div>
                </div>
              }
              { userRights.deadlineRead &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Deadline</Label>
                  <div className="col-9">
                    { layoutComponents.Deadline }
                  </div>
                </div>
              }
              { userRights.repeatRead &&
                <Repeat
                  taskID={null}
                  repeat={repeat}
                  disabled={!userRights.repeatWrite}
                  submitRepeat={(repeat)=>{
                    if(!userRights.repeatWrite){
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
              { userRights.overtimeRead &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Outside PH {project.def.overtime.required && <span className="warning-big">*</span>}</Label>
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
      <div className="task-edit-right p-b-20 p-t-20">
        <div className="form-selects-entry-column" >
          <Label>Project <span className="warning-big">*</span></Label>
          <div className="form-selects-entry-column-rest" >
            { layoutComponents.Project(true) }
          </div>
        </div>
        { userRights.statusRead &&
          <div className="form-selects-entry-column" >
            <Label>Status<span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Status }
            </div>
          </div>
        }
        { userRights.requesterRead &&
          <div className="form-selects-entry-column" >
            <Label>Requester<span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Requester }
            </div>
          </div>
        }
        { userRights.companyRead &&
          <div className="form-selects-entry-column" >
            <Label>Company {project.def.company.required && <span className="warning-big">*</span>}</Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Company }
            </div>
          </div>
        }
        { userRights.assignedRead &&
          <div className="form-selects-entry-column" >
            <Label>Assigned {project.def.assignedTo.required && <span className="warning-big">*</span>}</Label>
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
            taskID={null}
            repeat={repeat}
            disabled={!userRights.repeatWrite}
            submitRepeat={(repeat)=>{
              if(!userRights.repeatWrite){
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
        { userRights.typeRead &&
          <div className="form-selects-entry-column" >
            <Label>Task Type {project.def.type.required && <span className="warning-big">*</span>}</Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Type }
            </div>
          </div>
        }
        { userRights.pausalRead &&
          <div className="form-selects-entry-column" >
            <Label>Pausal<span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Pausal }
            </div>
          </div>
        }
        { userRights.overtimeRead &&
          <div className="form-selects-entry-column" >
            <Label>Outside PH<span className="warning-big">*</span></Label>
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
        { userRights.tagsRead && userRights.tagsWrite &&
          <div className="row center-hor">
            <button className="btn-link p-b-10 btn-distance" id="tags-multiselect-add" onClick={ () => setTagsOpen(true) } >
              <i className="fa fa-plus" />
              Tags {project.def.tag.required && <span className="warning-big">*</span>}
            </button>
            <MultiSelect
              className="center-hor"
              disabled={ defaultFields.tag.fixed || !userRights.tagsWrite }
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

        {
          userRights.tagsRead && tags
          .sort( ( tag1, tag2 ) => tag1.order > tag2.order ? 1 : -1 )
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
          { userRights.taskAttachmentsRead && userRights.taskAttachmentsWrite &&
            <label htmlFor={`uploadAttachment-${null}`} className="btn-link h-20-f btn-distance" >
              <i className="fa fa-plus" />
              Attachment
            </label>
          }
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
            readOnly={!userRights.taskDescriptionWrite}
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
    //hidden
    if ( !userRights.taskShortSubtasksWrite ) {
      return null;
    }
    return (
      <CheckboxList
        disabled={!userRights.taskShortSubtasksWrite}
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
    if ( !userRights.taskAttachmentsRead ) {
      return null;
    }
    return (
      <Attachments
        disabled={!userRights.taskAttachmentsWrite}
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

  const renderVykazyTable = ( subtasks, workTrips, materials, customItems ) => {
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
      </Empty>
    )
  }

  const renderButtons = () => {
    return (
      <div className="form-section task-edit-buttons">
        <div className="row form-section-rest">
          {closeModal &&
            <button className="btn-link-cancel" onClick={() => closeModal()}>Cancel</button>
          }
          <div className="pull-right row">
            {showLocalCreationErrorFunc()}
            <div style={{ width: 100 }} className="m-r-5">
              <Select
                placeholder="Vyberte akciu"
                value={actionAfterAdd}
                onChange={(actionAfterAdd)=>{
                  setActionAfterAdd(actionAfterAdd);
                }}
                options={ actionsAfterAdd }
                styles={pickSelectStyle( [ 'invisible' ] )}
                />
            </div>
            <button
              className="btn"
              onClick={() => {
                if (cannotSave) {
                  setShowLocalCreationError(true);
                } else {
                  addTaskFunc();
                }
                if(actionAfterAdd.id !== afterTaskCreate){
                  setAfterTaskCreate({variables: {afterTaskCreate: actionAfterAdd.id}});
                }
              }}
              > Create task
            </button>
          </div>
        </div>
      </div>
    )
  }

  const canCreateVykazyError = () => {
    if ( getVykazyError( taskType, assignedTo.filter( ( user ) => user.id !== null ), company ) === '' ) {
      return (
        <span className="center-hor ml-auto">
        </span>
      );
    }
    return (
      <span className="message error-message center-hor ml-auto">
        {getVykazyError(taskType, assignedTo.filter((user) => user.id !== null ), company)}
      </span>
    );
  }

  const showLocalCreationErrorFunc = () => {
    if ( !cannotSave || !showLocalCreationError ) {
      return (
        <span className="center-hor ml-auto">
        </span>
      );
    }
    return (
      <span className="message error-message center-hor ml-auto">
        {localCreationError}
      </span>
    );
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

          { renderVykazyTable(subtasks, workTrips, materials, customItems) }

          <div className="task-add-layout-2"></div>
          { renderButtons() }
        </div>

        { layout === 2 && renderSelectsLayout2Side() }

      </div>

    </div>
  );
}