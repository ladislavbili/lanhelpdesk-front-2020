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
} from 'reactstrap';
import CKEditor from 'components/CKEditor';
import DatePicker from 'components/DatePicker';
import Empty from 'components/Empty';

import classnames from "classnames";
import moment from 'moment';

import {
  pickSelectStyle,
} from 'configs/components/select';
import booleanSelects from 'configs/constants/boolSelect';
import {
  noMilestone
} from 'configs/constants/sidebar';
import {
  intervals
} from 'configs/constants/repeat';

import Repeat from 'helpdesk/components/repeat/repeatFormInput';

import Attachments from '../components/attachments';
import TagsPickerPopover from '../components/tags';
import ShortSubtasks from '../components/shortSubtasks';
import Vykazy from '../components/vykazy';
import Comments from '../components/comments';
import TaskHistory from '../components/taskHistory';
import ErrorDisplay from '../components/errorDisplay/editTaskErrorDisplay';

import AddUserToGroup from 'helpdesk/settings/projects/addUserToGroup';

import TaskAdd from '../add';
import TaskPrint from './taskPrint';

import UserAdd from 'helpdesk/settings/users/userAdd';
import CompanyAdd from 'helpdesk/settings/companies/companyAdd';

import {
  toSelArr,
  toSelItem,
  timestampToString,
  updateArrayItem,
  translateAllSelectItems,
  translateSelectItem,
} from 'helperFunctions';
import {
  addLocalError,
} from 'apollo/localSchema/actions';
import {
  GET_TASK,
  GET_TASKS,
} from '../queries';

import {
  getEmptyAttributeRights,
  backendCleanRights,
} from 'configs/constants/projects';
import {
  useTranslation
} from "react-i18next";

import {
  defaultVykazyChanges,
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
    saving,
    setSaving,
    filterValues,
    originalProjectId,
    filterId,
    deleteTaskFunc,
    addCompanyToList,
    addAttachments,
    removeAttachment,
    updateCasheStorage,
    updateTask,
    client,
    fromInvoice,
  } = props;

  const {
    t
  } = useTranslation();

  const invoiced = task.invoiced;

  //state
  const [ assignedTo, setAssignedTo ] = React.useState( [] );
  const [ closeDate, setCloseDate ] = React.useState( null );
  const [ company, setCompany ] = React.useState( null );
  const [ startsAt, setStartsAt ] = React.useState( null );
  const [ deadline, setDeadline ] = React.useState( null );
  const [ description, setDescription ] = React.useState( "" );
  const [ important, setImportant ] = React.useState( false );
  const [ milestone, setMilestone ] = React.useState( [ translateSelectItem( noMilestone, t ) ] );
  const [ overtime, setOvertime ] = React.useState( translateAllSelectItems( booleanSelects, t )[ 0 ] );
  const [ openUserAdd, setOpenUserAdd ] = React.useState( false );
  const [ openCompanyAdd, setOpenCompanyAdd ] = React.useState( false );
  const [ pausal, setPausal ] = React.useState( translateAllSelectItems( booleanSelects, t )[ 0 ] );
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

  const [ usedSubtaskPausal, setUsedSubtaskPausal ] = React.useState( 0 );
  const [ usedTripPausal, setUsedTripPausal ] = React.useState( 0 );
  const [ tagsOpen, setTagsOpen ] = React.useState( false );
  const [ newAddedUser, setNewAddedUser ] = React.useState( null );
  const [ taskTitleEdited, setTaskTitleEdited ] = React.useState( false );

  const [ changes, setChanges ] = React.useState( {} );
  const [ vykazyChanges, setVykazyChanges ] = React.useState( defaultVykazyChanges );
  const [ vykazyChanged, setVykazyChanged ] = React.useState( false );

  const userRights = (
    project ? {
      rights: project.right,
      attributeRights: project.attributeRights
    } :
    backendCleanRights()
  );

  const [ toggleTab, setToggleTab ] = React.useState( userRights.rights.viewComments ? 0 : 1 );

  const projectAttributes = (
    project ?
    project.project.projectAttributes :
    getEmptyAttributeRights()
  );

  // sync
  React.useEffect( () => {
    const project = task.project === null ? null : projects.find( ( project ) => project.id === task.project.id );
    const assignableUserIds = users.filter( ( user ) => project && project.usersWithRights.some( ( userData ) => userData.assignable && userData.user.id === user.id ) )
      .map( ( user ) => user.id );
    setChanges( {} );
    setTagsOpen( false );
    setVykazyChanges( defaultVykazyChanges );
    setAssignedTo( toSelArr( task.assignedTo, 'fullName' )
      .filter( ( user ) => assignableUserIds.includes( user.id ) ) );
    setCloseDate( task.closeDate ? moment( parseInt( task.closeDate ) ) : null );
    setStartsAt( task.startsAt ? moment( parseInt( task.startsAt ) ) : null );
    setDeadline( task.deadline ? moment( parseInt( task.deadline ) ) : null );
    setDescription( task.description );
    setImportant( task.important );
    /*
    const milestone = project && task.milestone ? toSelArr( project.project.milestones )
    .find( ( milestone ) => milestone.id === task.milestone.id ) : undefined;
    */
    setOvertime( ( task.overtime ? translateAllSelectItems( booleanSelects, t )[ 1 ] : translateAllSelectItems( booleanSelects, t )[ 0 ] ) );
    setPausal( ( task.pausal ? translateAllSelectItems( booleanSelects, t )[ 1 ] : translateAllSelectItems( booleanSelects, t )[ 0 ] ) );
    setPendingChangable( task.pendingChangable );
    setPendingDate( task.pendingDate ? moment( parseInt( task.pendingDate ) ) : null );
    const status = ( task.status ? toSelItem( task.status ) : null )
    setStatus( status );
    setTags( toSelArr( task.tags ) );
    setTaskType( ( task.taskType ? toSelItem( task.taskType ) : noTaskType ) );
    setCompany( ( task.company ? toSelItem( task.company ) : null ) );
    //setMilestone( milestone === undefined ? noMilestone : milestone );
    setRequester(
      task.requester ? {
        ...task.requester,
        value: task.requester.id,
        label: task.requester.fullName
      } :
      null
    );
    setProject( project );
    setTaskTripPausal( task.company ? task.company.taskTripPausal : 0 );
    setTaskWorkPausal( task.company ? task.company.taskWorkPausal : 0 );
    setTitle( task.title );
    setGanttOrder( task.ganttOrder );
    setUsedSubtaskPausal( task.company ? task.company.usedSubtaskPausal : 0 );
    setUsedTripPausal( task.company ? task.company.usedTripPausal : 0 );
  }, [ id, task ] );

  React.useEffect( () => {
    updateToProjectRules( project );
  }, [ project ] );

  const updateToProjectRules = ( project ) => {
    if ( !project ) {
      return;
    }

    const userRights = {
      rights: project.right,
      attributeRights: project.attributeRights
    };

    const projectAttributes = project.project.projectAttributes;

    const projectUsers = users.filter( ( user ) => project.usersWithRights.some( ( userData ) => userData.user.id === user.id ) );
    const assignableUsers = users.filter( ( user ) => project.usersWithRights.some( ( userData ) => userData.assignable && userData.user.id === user.id ) );
    const projectRequesters = ( project.lockedRequester ? projectUsers : users );
    const statuses = toSelArr( project.project.statuses );
    //check def required and fixed and change is needed (CHECK IF IT ALREADY ISNT SET) and can see the attribute
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
          potentialCompany = companies.find( ( company ) => company.id === projectAttributes.company.value.id );
        } else if ( potentialRequester ) {
          potentialCompany = companies.find( ( company ) => company.id === potentialRequester.company.id );
        }
        if ( potentialCompany && ( company === null || company.id !== potentialCompany.id ) ) {
          setCompany( potentialCompany );
          changes.company = company.id;
          if ( !projectAttributes.pausal.fixed ) {
            setPausal( parseInt( company.monthly ) > 0 ? translateAllSelectItems( booleanSelects, t )[ 1 ] : translateAllSelectItems( booleanSelects, t )[ 0 ] );
            changes.pausal = parseInt( company.monthly ) > 0
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

    //Starts at
    if ( userRights.attributeRights.startsAt.view ) {
      if ( projectAttributes.startsAt.fixed && startsAt.valueOf()
        .toString() !== projectAttributes.startsAt.value ) {
        setDeadline( projectAttributes.startsAt.value ? moment( parseInt( projectAttributes.startsAt.value ) ) : null );
        changes.startsAt = projectAttributes.startsAt.value;
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
        if ( projectAttributes.pausal.value === null ) {
          const companyMonthly = potentialCompany ? potentialCompany.monthly : company.monthly;
          setPausal( translateAllSelectItems( booleanSelects, t )
            .find( ( option ) => option.value === companyMonthly ) );
          changes.pausal = companyMonthly;
        } else {
          setPausal( translateAllSelectItems( booleanSelects, t )
            .find( ( option ) => option.value === projectAttributes.pausal.value ) );
          changes.pausal = projectAttributes.pausal.value;
        }
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
      autoUpdateTask( changes );
    }
  }

  //constants
  const canAddUser = accessRights.users;
  const canAddCompany = accessRights.companies;
  const availableProjects = projects.filter( ( project ) => project.right.taskProjectWrite );
  const assignedTos = project ? users.filter( ( user ) => project.usersWithRights.some( ( userData ) => userData.assignable && userData.user.id === user.id ) ) : [];

  const requesters = ( project && project.project.lockedRequester ? toSelArr( project.usersWithRights.map( ( userWithRights ) => userWithRights.user ), 'fullName' ) : users );
  //const milestones = [ noMilestone ].concat( ( project ? toSelArr( project.project.milestones ) : [] ) );

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
      invoiced ||
      ( compare.assignedTo.length === 0 && userRights.attributeRights.assigned.view && !projectAttributes.assigned.fixed ) ||
      compare.saving
    )
  }

  const autoUpdateTask = ( change, passFunc = null ) => {
    if ( getCantSave( change ) ) {
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
      ...change,
      fromInvoice,
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
              id,
              fromInvoice,
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
            id,
            fromInvoice,
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
        passFunc && passFunc();
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

  //vykazyTable
  const subtasks = task.subtasks.map( item => ( {
    ...item,
    assignedTo: toSelItem( item.assignedTo, 'fullName' ),
    type: item.type ? toSelItem( item.type ) : null,
  } ) );
  const workTrips = task.workTrips.map( item => ( {
    ...item,
    assignedTo: toSelItem( item.assignedTo, 'fullName' ),
    type: toSelItem( item.type )
  } ) );
  const materials = task.materials.map( ( item ) => ( {
    ...item,
  } ) );
  const canCopy = userRights.rights.addTask && !getCantSave();

  const getTaskData = () => ( {
    shortSubtasks: task.shortSubtasks,
    subtasks: task.subtasks.map( item => ( {
      ...item,
      assignedTo: toSelItem( item.assignedTo, 'fullName' ),
      type: item.type ? toSelItem( item.type ) : null,
    } ) ),
    workTrips: task.workTrips.map( item => ( {
      ...item,
      assignedTo: toSelItem( item.assignedTo, 'fullName' ),
      type: toSelItem( item.type )
    } ) ),
    materials: task.materials,
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
  } );

  //Value Change
  const changeProject = ( project ) => {
    let variables = {
      id,
      fromInvoice,
      project: project.id,
    };
    setSaving( true );
    updateTask( {
        variables
      } )
      .finally( () => {
        setSaving( false );
      } );
  }

  const changeStatus = ( status ) => {
    if ( status.action === 'PendingDate' ) {
      setStatus( status );
      setPendingDate( moment()
        .add( 1, 'days' ) );
      setPotentialPendingStatus( status );
      setPendingChangable( true );
      autoUpdateTask( {
        status: status.id,
        pendingDate: moment()
          .add( 1, 'days' )
          .valueOf()
          .toString(),
        pendingChangable: true,
      } );
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
      setPausal( parseInt( company.taskWorkPausal ) > 0 ? translateAllSelectItems( booleanSelects, t )[ 1 ] : translateAllSelectItems( booleanSelects, t )[ 0 ] );
      autoUpdateTask( {
        company: company.id,
        pausal: parseInt( company.taskWorkPausal ) > 0
      } )
    }
  }

  //render
  const renderSide = () => {
    //used sidebar
    return (
      <div className={classnames("task-edit-right", {"width-250": columns})}>
        <div>
          { inModal &&
            <div className="task-edit-buttons row m-b-10">
              <span className="ml-auto center-hor">

                { userRights.rights.deleteTask && !invoiced &&
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
                    duplicateTask={getTaskData()}
                    disabled={!canCopy}
                    noText
                    history={history}
                    match={match}
                    />
                }
                <button
                  type="button"
                  className="btn-link p-r-10"
                  onClick={() => closeModal(vykazyChanged)}
                  >
                  <i className="fa fa-times" style={{ fontSize: 25 }} />
                </button>
              </span>
            </div>
          }
          <div className="form-selects-entry-column" >
            <Label>{t('project')}<span className="warning-big">*</span></Label>
            <div className="form-selects-entry-column-rest" >
              { (!userRights.rights.taskProjectWrite || invoiced) &&
                <div className="disabled-info">{project ? project.title : t('noProject')}</div>
              }
              { (userRights.rights.taskProjectWrite && !invoiced) &&
                <Select
                  placeholder={t('selectProject')}
                  value={ project }
                  onChange={ changeProject }
                  options={ availableProjects }
                  styles={pickSelectStyle([ 'noArrow', 'required', ])}
                  />
              }
            </div>
          </div>
          { userRights.attributeRights.status.view &&
            <div className="form-selects-entry-column" >
              <Label>{t('status')}<span className="warning-big">*</span></Label>
              <div className="form-selects-entry-column-rest" >
                { (projectAttributes.status.fixed || !userRights.attributeRights.status.edit || invoiced) &&
                  <div
                    className={`disabled-info`}
                    style={status ? { backgroundColor: status.color, color: 'white', fontWeight: 'bolder' } : {} }
                    >
                    {status ? status.label : t('none')}
                  </div>
                }
                { !projectAttributes.status.fixed && userRights.attributeRights.status.edit && !invoiced &&
                  <Select
                    placeholder={t('statusPlaceholder')}
                    value={status}
                    styles={pickSelectStyle( [ 'noArrow', 'colored', 'required', ] )}
                    onChange={ changeStatus }
                    options={(project ? toSelArr(project.project.statuses) : []).filter((status)=>status.action !== 'Invoiced')}
                    />
                }
              </div>
            </div>
          }
          { userRights.attributeRights.requester.view &&
            <div className="form-selects-entry-column" >
              <Label>{t('requester')}<span className="warning-big">*</span></Label>
              <div className="form-selects-entry-column-rest" >
                { (projectAttributes.requester.fixed || !userRights.attributeRights.requester.edit || invoiced) &&
                  <div className="disabled-info">{requester ? requester.label : t('none')}</div>
                }
                { !projectAttributes.requester.fixed && userRights.attributeRights.requester.edit && !invoiced &&
                  <Select
                    placeholder={t('requesterPlaceholder')}
                    value={requester}
                    isDisabled={ projectAttributes.requester.fixed || !userRights.attributeRights.requester.edit }
                    onChange={changeRequester}
                    options={( canAddUser ?
                      [translateSelectItem({id:-1, title:'+ Add user',body:'add', labelId: 'addUserLabel', label:'+ Add user', value:null}, t)] :
                      []
                    ).concat(requesters)}
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
                { (projectAttributes.company.fixed || !userRights.attributeRights.company.edit || invoiced) &&
                  <div className="disabled-info">{company ? company.label : t('none')}</div>
                }
                { !projectAttributes.company.fixed && userRights.attributeRights.company.edit && !invoiced &&
                  <Select
                    placeholder={t('companyPlaceholder')}
                    value={company}
                    onChange={changeCompany}
                    options={(canAddCompany ?
                      [translateSelectItem({id:-1,title:'+ Add company',body:'add', labelId: 'addCompanyLabel', label:'+ Add company', value:null}, t)] :
                      []
                    ).concat(companies)}
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
                { (projectAttributes.assigned.fixed || !userRights.attributeRights.assigned.edit || invoiced) &&
                  <div>
                    {assignedTo.map((user) => (
                      <div className="disabled-info" key={user.id}>{user.label}</div>
                    ))}
                    { assignedTo.length === 0 &&
                      <div className="message error-message">{t('taskUnassigned')}</div>
                    }
                  </div>
                }
                { !projectAttributes.assigned.fixed && userRights.attributeRights.assigned.edit && !invoiced &&
                  <Select
                    value={assignedTo}
                    placeholder={t('selectRecommended')}
                    isMulti
                    onChange={(users)=> {
                      if (users.some(u => u.id === -1)){
                        setOpenUserAdd(true);
                      } else {
                        setAssignedTo(users);
                        autoUpdateTask({ assignedTo: users.map((user) => user.id) })
                      }
                    }}
                    options={
                      ( canAddUser ?
                        [translateSelectItem({id:-1, title:'+ Add user',body:'add', labelId: 'addUserLabel', label:'+ Add user', value:null}, t)] :
                        []
                      )
                      .concat(assignedTos)
                    }
                    styles={pickSelectStyle( [ 'noArrow', 'required' ] )}
                    />
                }
              </div>
            </div>
          }
          { userRights.attributeRights.startsAt.view &&
            <div className="form-selects-entry-column" >
              <Label>{t('plannedAt')}</Label>
              <div className="form-selects-entry-column-rest" >
                { (projectAttributes.startsAt.fixed || !userRights.attributeRights.startsAt.edit || invoiced) &&
                  <div className="disabled-info">{startsAt ? timestampToString(startsAt.valueOf()) : t('noPlannedAt') }</div>
                }
                { !projectAttributes.startsAt.fixed && userRights.attributeRights.startsAt.edit && !invoiced &&
                  <DatePicker
                    className={classnames("form-control")}
                    selected={startsAt}
                    hideTime
                    isClearable
                    onChange={date => {
                      setStartsAt( isNaN(date.valueOf()) ? null : date );
                      autoUpdateTask({ startsAt: isNaN(date.valueOf()) ? null : date.valueOf().toString() });
                    }}
                    placeholderText={t('plannedAtPlaceholder')}
                    />
                }
              </div>
            </div>
          }
          { userRights.attributeRights.deadline.view &&
            <div className="form-selects-entry-column" >
              <Label>{t('deadline')}</Label>
              <div className="form-selects-entry-column-rest" >
                { (projectAttributes.deadline.fixed || !userRights.attributeRights.deadline.edit || invoiced) &&
                  <div className="disabled-info">{deadline ? timestampToString(deadline.valueOf()) : t('noDeadline') }</div>
                }
                { !projectAttributes.deadline.fixed && userRights.attributeRights.deadline.edit && !invoiced &&
                  <DatePicker
                    className={classnames("form-control")}
                    selected={deadline}
                    hideTime
                    isClearable
                    onChange={date => {
                      setDeadline( isNaN(date.valueOf()) ? null : date );
                      autoUpdateTask({ deadline: isNaN(date.valueOf()) ? null : date.valueOf().toString() });
                    }}
                    placeholderText={t('deadlinePlaceholder')}
                    />
                }
              </div>
            </div>
          }
          { userRights.attributeRights.repeat.view && ( userRights.attributeRights.repeat.edit || task.repeat ) &&
            <div>
              <Repeat
                vertical
                duplicateTask={ !task.repeat ? getTaskData() : null}
                taskID={id}
                repeat={task.repeat}
                repeatTime={task.repeatTime}
                layout={2}
                />
            </div>
          }
          { userRights.attributeRights.taskType.view &&
            <div className="form-selects-entry-column" >
              <Label>{t('taskType')}<span className="warning-big">*</span></Label>
              <div className="form-selects-entry-column-rest" >
                { (projectAttributes.taskType.fixed || !userRights.attributeRights.taskType.edit || invoiced) &&
                  <div className="disabled-info">{taskType ? taskType.label : t('none')}</div>
                }
                { !projectAttributes.taskType.fixed && userRights.attributeRights.taskType.edit && !invoiced &&
                  <Select
                    placeholder={t('taskTypePlaceholder')}
                    value={taskType}
                    styles={ pickSelectStyle( [ 'noArrow', 'required' ] )}
                    onChange={(type)=> {
                      setTaskType(type);
                      autoUpdateTask({ taskType: type.id })
                    }}
                    options={[noTaskType, ...taskTypes]}
                    />
                }
              </div>
            </div>
          }
          { userRights.attributeRights.pausal.view &&
            <div className="form-selects-entry-column" >
              <Label>{t('pausal')}<span className="warning-big">*</span></Label>
              <div className="form-selects-entry-column-rest" >
                { ( !userRights.attributeRights.pausal.edit || !company || !company.monthly || projectAttributes.pausal.fixed || invoiced ) &&
                  <div className="disabled-info">{pausal ? pausal.label : t('none')}</div>
                }
                { userRights.attributeRights.pausal.edit && company && company.monthly && !projectAttributes.pausal.fixed && !invoiced &&
                  <Select
                    value={ pausal }
                    placeholder={t('selectRequired')}
                    styles={pickSelectStyle([ 'noArrow', 'required', ]) }
                    onChange={(pausal)=> {
                      autoUpdateTask({ pausal: pausal.value })
                      setPausal(pausal);
                    }}
                    options={translateAllSelectItems(booleanSelects, t)}
                    />
                }
              </div>
            </div>
          }
          { userRights.attributeRights.overtime.view &&
            <div className="form-selects-entry-column" >
              <Label>{t('overtimeShort')}<span className="warning-big">*</span></Label>
              <div className="form-selects-entry-column-rest" >
                { (projectAttributes.overtime.fixed || !userRights.attributeRights.overtime.edit || invoiced) &&
                  <div className="disabled-info">{overtime.label}</div>
                }
                { !projectAttributes.overtime.fixed && userRights.attributeRights.overtime.edit && !invoiced &&
                  <Select
                    value={overtime}
                    placeholder={t('selectRequired')}
                    styles={ pickSelectStyle([ 'noArrow', 'required', ]) }
                    onChange={(overtime)=> {
                      setOvertime(overtime);
                      autoUpdateTask({ overtime: overtime.value })
                    }}
                    options={translateAllSelectItems(booleanSelects, t)}
                    />
                }
              </div>
            </div>
          }
        </div>
      </div>
    );
  }

  const renderMain = () => {

    const PausalInfo = () => (
      <div className="form-section">
        <div className="form-section-rest">
          <span className=" message success-message center-hor ml-auto">
            { `${t('pausal')} ${company ? company.title : ''}  ` }
            <span>
              {`${t('pausalSubtasks')}:`}
              <span className={classnames( {"warning-general": (usedSubtaskPausal > taskWorkPausal)} )}>
                {` ${usedSubtaskPausal}`}
              </span>
              {` / ${taskWorkPausal} ${t('pausalTrips')}:`}
              <span className={classnames( {"warning-general": (usedTripPausal > taskTripPausal)} )} >
                {` ${usedTripPausal}`}
              </span>
              {` / ${taskTripPausal}`}
            </span>
          </span>
        </div>
      </div>
    );

    return (
      <div
        className={classnames(
          {
            "task-edit-left": !columns,
            "task-edit-left-columns": columns,
          },
        )}
        >
        { renderMainTop() }

        { renderDescriptionAttachmentsTags() }

        { userRights.rights.taskSubtasksRead &&
          <ShortSubtasks
            edit
            taskID={id}
            setSaving={setSaving}
            updateCasheStorage={updateCasheStorage}
            disabled={!userRights.rights.taskSubtasksWrite || invoiced}
            fromInvoice={fromInvoice}
            shortSubtasks={task.shortSubtasks}
            />
        }

        {
          (
            userRights.rights.taskWorksRead ||
            userRights.rights.taskWorksAdvancedRead ||
            userRights.rights.taskMaterialsRead ||
            userRights.rights.taskPausalInfo
          ) &&
          <Vykazy
            edit
            task={id}
            invoiced={invoiced}
            fromInvoice={fromInvoice}
            autoApproved={project ? project.project.autoApproved : false}
            userRights={userRights}
            currentUser={currentUser}
            assignedTo={assignedTo}
            company={company}
            setChanged={() => setVykazyChanged(true) }
            updateCasheStorage={updateCasheStorage}
            renderCompanyPausalInfo={ (company && company.monthlyPausal && userRights.rights.taskPausalInfo) ? PausalInfo : null }
            works={subtasks}
            taskTypes={taskTypes}
            taskType={taskType}
            trips={workTrips}
            tripTypes={tripTypes}
            materials={materials}
            />
        }

        { renderComments() }

        <ErrorDisplay
          {...getTaskData()}
          userRights={userRights}
          projectAttributes={projectAttributes}
          />

        { currentUser.role.accessRights.users && !invoiced &&
          <Empty>
            <Modal isOpen={openUserAdd} className="modal-without-borders" >
              <ModalHeader>
                {t('addUser')}
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
            { project && project.id && userRights.rights.projectWrite &&
              <AddUserToGroup
                user={newAddedUser}
                disabled={ !userRights.rights.projectWrite }
                projectID={project.id}
                finish={() => setNewAddedUser(null)}
                />
            }
          </Empty>
        }

        { currentUser.role.accessRights.companies && !invoiced &&
          <Modal isOpen={openCompanyAdd} className="modal-without-borders">
            <ModalBody>
              <CompanyAdd
                closeModal={() => setOpenCompanyAdd(false)}
                addCompanyToList={addCompanyToList}
                />
            </ModalBody>
          </Modal>
        }
      </div>
    );
  };

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
            {t('back')}
          </button>
        }
        { project && canCopy &&
          <TaskAdd
            projectID={project.id}
            duplicateTask={getTaskData()}
            disabled={!canCopy}
            history={history}
            match={match}
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
              assignedTo: toSelItem( item.assignedTo, 'fullName' ),
              type: toSelItem( item.type )
            } ) )}
            workTrips={workTrips}
            taskMaterials={materials}
            isLoaded={true}
            />
        }
        { userRights.rights.deleteTask && !invoiced &&
          <button
            type="button"
            className="btn-link task-add-layout-button btn-distance"
            onClick={deleteTaskFunc}
            >
            <i className="far fa-trash-alt" />
            {t('delete')}
          </button>
        }
        { invoiced &&
          <div className="inline-warning-message center-hor">{t('taskInvoiced')}</div>
        }
        <span className="ml-auto">
          { inModal &&
            <button
              type="button"
              className="btn-link-cancel task-add-layout-button p-l-10 p-r-10 m-r-10"
              onClick={() => closeModal(vykazyChanged)}
              >
              <i className="fa fa-times" style={{ fontSize: 25 }} />
            </button>
          }
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
              disabled={invoiced}
              onClick={()=>{
                setImportant(!important);
                autoUpdateTask({ important: !important });
              }}
              >
              <i className={`fa${ important ? 's' : 'r' } fa-star`} style={{ fontSize: 25 }} />
            </button>
          }
          <h2 className="center-hor">{id}: </h2>
          { taskTitleEdited &&
            <span className="center-hor flex m-r-15">
              <input type="text"
                disabled={ !userRights.rights.taskTitleWrite || invoiced }
                value={title}
                className="task-title-input text-extra-slim form-control m-t-4 m-b-3"
                onChange={(e)=> {
                  setTitle(e.target.value);
                }}
                onBlur={(e) => {
                  autoUpdateTask({ title })
                }}
                placeholder={t('taskTitlePlaceholder')}
                />
            </span>
          }
          { !taskTitleEdited &&
            <span className="task-title-input text-extra-slim m-l-7">
              {title}
            </span>
          }
          { (userRights.rights.taskTitleWrite && !invoiced) &&
            <i className={classnames({ "fa-pen": !taskTitleEdited, "fa-save": taskTitleEdited },"fa clickable center-hor color-link")} onClick={() => setTaskTitleEdited(!taskTitleEdited) } />
          }
          { invoiced && inModal && <div className="inline-warning-message center-hor">{t('taskInvoiced')}</div> }
        </div>
        <hr className="m-t-5 m-b-2"/>

        <div className="ml-auto center-hor">
          <div className="task-info">
            <span>
              {task.createdBy ? `${t('createdBy')} ` : ""}
            </span>
            <span className="bolder">
              {task.createdBy ? `${task.createdBy.name} ${task.createdBy.surname}` :''}
            </span>
            <span>
              {task.createdBy ?` ${t('atDate')} `: t('createdAt')}
            </span>
            <span className="bolder">
              {task.createdAt ? (timestampToString(task.createdAt)) : ''}
            </span>
          </div>
          { renderStatusDate() }
        </div>
      </div>
    );
  }

  const renderStatusDate = () => {
    if ( !userRights.attributeRights.status.view || !status ) {
      return null;
    }
    if ( status && status.action === 'PendingDate' ) {
      const datepickerDisabled = !userRights.attributeRights.status.edit || !pendingChangable || invoiced;
      return (
        <div className="task-info ml-auto">
          {t('pendingDate')} :
          { datepickerDisabled ?
            (
              <span className="bolder center-hor m-l-3">
                { pendingDate ? (timestampToString(pendingDate.valueOf())) : '' }
              </span>
            ):
            (
              <DatePicker
                className="form-control hidden-input bolder p-0 text-right width-95"
                selected={pendingDate}
                disabled={datepickerDisabled}
                onChange={ (date) => {
                  setPendingDate(date);
                  if(date.valueOf() !== null){
                    autoUpdateTask({pendingDate: date.valueOf().toString()});
                  }
                }}
                placeholderText={t('noPendingDate')}
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
      const datepickerDisabled = ( status.action !== 'CloseDate' && status.action !== 'CloseInvalid' ) || !userRights.attributeRights.status.edit || invoiced;
      return (
        <div className="task-info ml-auto">
          {t('closedAt')}:
          { datepickerDisabled ?
            (
              <span className="bolder center-hor m-l-3">
                { closeDate ? (timestampToString(closeDate.valueOf())) : '' }
              </span>
            ):
            (
              <DatePicker
                className="form-control hidden-input bolder p-0 text-right width-95"
                selected={closeDate}
                disabled={datepickerDisabled}
                onChange={date => {
                  setCloseDate(date);
                  if(date.valueOf() !== null){
                    autoUpdateTask({closeDate: date.valueOf().toString()});
                  }
                }}
                placeholderText={t('noPendingDate')}
                />
            )
          }
        </div>
      )
    }
    return (
      <div className="task-info ml-auto">
        <span className="center-hor bolder">
          {task.statusChange ? (`${t('statusChangedAt')} ` + timestampToString(task.statusChange) ) : ""}
        </span>
      </div>
    )
  }

  const renderDescriptionAttachmentsTags = () => {
    if ( !userRights.rights.taskDescriptionRead && !userRights.rights.taskAttachmentsRead ) {
      return null;
    }
    let RenderDescription = null;
    if ( !userRights.rights.taskDescriptionWrite || invoiced ) {
      if ( description.length !== 0 ) {
        RenderDescription = <div className="task-edit-popis" dangerouslySetInnerHTML={{__html:description }} />
      } else {
        RenderDescription = <div className="task-edit-popis">{t('noTaskDescription')}</div>
      }
    } else {
      if ( showDescription && !invoiced ) {
        RenderDescription = <div>
          <CKEditor
            value={description}
            onReady={(editor) => {
              editor.editing.view.document.on( 'keydown', ( evt, data ) => {
                if ( data.keyCode === 27 ) {
                  autoUpdateTask({ description  })
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
          <Label className="m-r-10">
            {t('taskDescription')}
          </Label>
          { userRights.rights.taskDescriptionWrite && !invoiced &&
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
              { !showDescription ? t('edit') : t('save') }
            </button>
          }
          { userRights.rights.taskAttachmentsWrite && !invoiced &&
            <label htmlFor={`uploadAttachment-${id}`} className="btn-link btn-distance m-l-0 clickable" >
              <i className="fa fa-plus" />
              {t('attachment')}
            </label>
          }
          { userRights.attributeRights.tags.edit && !invoiced &&
            <TagsPickerPopover
              taskID={id}
              required={userRights.attributeRights.tags.required}
              disabled={ projectAttributes.tags.fixed || invoiced }
              items={toSelArr(project === null ? [] : project.project.tags)}
              className="center-hor"
              selected={tags}
              onChange={(tags) => {
                setTags(tags);
                autoUpdateTask({ tags: tags.map((tag) => tag.id ) })
              }}
              />
          }

          { userRights.attributeRights.tags.view &&
            tags.sort( ( tag1, tag2 ) => tag1.order > tag2.order ? 1 : -1 )
            .map( ( tag ) => (
              <span key={tag.id} style={{ background: tag.color, color: 'white', borderRadius: 3 }} className="m-r-5 p-l-5 p-r-5">
                {tag.title}
              </span>
            ) )
          }
        </div>
        <div className="form-section-rest">
          {RenderDescription}
          { userRights.rights.taskAttachmentsRead &&
            <Attachments
              disabled={!userRights.rights.taskAttachmentsWrite || invoiced }
              taskID={id}
              type="task"
              top={false}
              attachments={task.taskAttachments}
              addAttachments={addAttachments}
              removeAttachment={removeAttachment}
              />
          }
        </div>
      </div>
    )
  }

  const renderComments = () => {
    if ( !userRights.rights.history && !userRights.rights.viewComments ) {
      return null;
    }
    return (
      <div className="form-section">
        <div className="form-section-rest">
          <Nav tabs className="no-border m-b-10">
            { userRights.rights.viewComments &&
              <NavItem>
                <NavLink
                  className={classnames({ active: toggleTab === 1}, "clickable", "")}
                  onClick={() => setToggleTab(1) }
                  >
                  {t('comments')}
                </NavLink>
              </NavItem>
            }
            { userRights.rights.history && userRights.rights.viewComments &&
              <NavItem>
                <NavLink>
                  |
                </NavLink>
              </NavItem>
            }
            { userRights.rights.history &&
              <NavItem>
                <NavLink
                  className={classnames({ active: toggleTab === 2 }, "clickable", "")}
                  onClick={() => setToggleTab(2) }
                  >
                  {t('history')}
                </NavLink>
              </NavItem>
            }
          </Nav>
          <TabContent activeTab={toggleTab}>
            <TabPane tabId={1}>
              { userRights.rights.viewComments &&
                <Comments
                  disabled={invoiced}
                  id={id}
                  userRights={ userRights }
                  users={users}
                  fromInvoice={fromInvoice}
                  />
              }
            </TabPane>
            {	userRights.rights.history &&
              <TabPane tabId={2}>
                { userRights.rights.history &&
                  <TaskHistory task={task} fromInvoice={fromInvoice} />
                }
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
        "flex max-height-400",
      )}
      >

      <div
        className={classnames(
          {"fit-with-header": !columns && !inModal},
          {"fit-with-header-and-commandbar": columns && !inModal},
          {"scroll-visible": !inModal},
          {"overflow-x-auto": inModal},
        )}
        >
        { !inModal && renderCommandbar() }
        <div
          className="row"
          style={{minHeight: "calc(100% - 70px)"}}
          >
          { renderMain() }
          { renderSide() }
        </div>
      </div>
    </div>
  );
}