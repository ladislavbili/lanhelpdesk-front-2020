import React from 'react';
import {
  useMutation
} from "@apollo/client";

import Select from 'react-select';
import {
  Label,
  Button
} from 'reactstrap';
import DatePicker from 'components/DatePicker';
import moment from 'moment';

import Repeat from 'helpdesk/components/repeat';
import Attachments from 'helpdesk/components/attachments';

import VykazyTable from 'helpdesk/components/vykazyTable';

import classnames from "classnames";

import CKEditor5 from '@ckeditor/ckeditor5-react';
import ck5config from 'configs/components/ck5config';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
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
import booleanSelects from 'configs/constants/boolSelect'
import CheckboxList from 'helpdesk/components/checkboxList';
import Scheduled from 'helpdesk/components/scheduled';
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
  ADD_TASK
} from '../queries';

import {
  REST_URL
} from 'configs/restAPI';

import {
  defaultVykazyChanges,
  invoicedAttributes,
  noTaskType
} from '../constants';

import {
  backendCleanRights
} from 'configs/constants/projects';

import {
  toSelArr
} from 'helperFunctions';

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
    users,
    taskTypes,
    tripTypes,
    milestones,
    companies,
    defaultUnit,
    closeModal,
  } = props;

  const userIfInProject = ( project ) => {
    let USERS_WITH_PERMISSIONS = users.filter( ( user ) => project && project.users.includes( user.id ) );
    let user = USERS_WITH_PERMISSIONS.find( ( user ) => user.id === currentUser.id );
    return user ? user : null;
  }

  const [ addTask ] = useMutation( ADD_TASK );
  //state
  const [ layout, setLayout ] = React.useState( 2 );

  const [ project, setProject ] = React.useState( projectID ? projects.find( p => p.id === projectID ) : null );
  const USERS_WITH_PERMISSIONS = users.filter( ( user ) => project && project.users.includes( user.id ) );
  const [ defaultFields, setDefaultFields ] = React.useState( noDef );

  const [ attachments, setAttachments ] = React.useState( [] );
  const [ assignedTo, setAssignedTo ] = React.useState( USERS_WITH_PERMISSIONS.filter( ( user ) => user.id === currentUser.id ) );
  const [ closeDate, setCloseDate ] = React.useState( null );
  const [ company, setCompany ] = React.useState( null );
  const [ customItems, setCustomItems ] = React.useState( [] );
  const [ deadline, setDeadline ] = React.useState( null );
  const [ description, setDescription ] = React.useState( "" );
  const [ descriptionVisible, setDescriptionVisible ] = React.useState( false );
  const [ milestone, setMilestone ] = React.useState( [ noMilestone ] );
  const [ overtime, setOvertime ] = React.useState( booleanSelects[ 0 ] );
  const [ pausal, setPausal ] = React.useState( booleanSelects[ 0 ] );
  const [ pendingDate, setPendingDate ] = React.useState( null );
  const [ pendingChangable, setPendingChangable ] = React.useState( false );
  //  const [ reminder, setReminder ] = React.useState(null);
  const [ repeat, setRepeat ] = React.useState( null );
  const [ requester, setRequester ] = React.useState(
    project !== null ?
    userIfInProject( project ) :
    null
  );
  const [ saving, setSaving ] = React.useState( false );
  const [ status, setStatus ] = React.useState( null );
  const [ subtasks, setSubtasks ] = React.useState( [] );
  const [ tags, setTags ] = React.useState( [] );
  const [ materials, setMaterials ] = React.useState( [] );
  const [ taskType, setTaskType ] = React.useState( null );
  const [ title, setTitle ] = React.useState( "" );
  const [ workTrips, setWorkTrips ] = React.useState( [] );

  const [ simpleSubtasks, setSimpleSubtasks ] = React.useState( [] );
  const [ scheduled, setScheduled ] = React.useState( [] );


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
  const REQUESTERS = ( project && project.lockedRequester ? USERS_WITH_PERMISSIONS : users );

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

    const potencialUser = userIfInProject( project );

    let maybeRequester = null;
    if ( users ) {
      if ( project.lockedRequester ) {
        maybeRequester = USERS_WITH_PERMISSIONS.find( ( user ) => user.id === currentUser.id );
      } else {
        maybeRequester = users.find( ( user ) => user.id === currentUser.id );
      }
      if ( maybeRequester === undefined ) {
        maybeRequester = null;
      }
    }

    let filteredAssignedTo = assignedTo.filter( ( user ) => project && project.users.includes( user.id ) );
    if ( filteredAssignedTo.length === 0 && potencialUser ) {
      filteredAssignedTo = [ potencialUser ];
    }
    let newAssignedTo = def.assignedTo && ( def.assignedTo.fixed || def.assignedTo.def ) ? users.filter( ( item ) => def.assignedTo.value.includes( item.id ) ) : filteredAssignedTo;
    setAssignedTo( newAssignedTo );
    let newRequester = def.requester && ( def.requester.fixed || def.requester.def ) ? users.find( ( item ) => item.id === def.requester.value.id ) : maybeRequester;
    setRequester( newRequester );
    let newCompany = def.company && ( def.company.fixed || def.company.def ) ? companies.find( ( item ) => item.id === def.company.value.id ) : ( companies && newRequester ? companies.find( ( company ) => company.id === newRequester.company.id ) : null );
    setCompany( newCompany );

    let potentialStatus = toSelArr( project.statuses )
      .find( ( status ) => status.action.toLowerCase() === 'isnew' );
    if ( ![ potentialStatus ] ) {
      potentialStatus = toSelArr( project.statuses )[ 0 ];
    }
    let newStatus = def.status && ( def.status.fixed || def.status.def ) ? toSelArr( project.statuses )
      .find( ( item ) => item.id === def.status.value.id ) : potentialStatus;
    setStatus( newStatus );

    let mappedTags = def.tag.value.map( t => t.id );
    let newTags = def.tag && ( def.tag.fixed || def.tag.def ) ? project.tags.filter( ( item ) => mappedTags.includes( item.id ) ) : [];
    setTags( newTags );

    let newOvertime = def.overtime && ( def.overtime.fixed || def.overtime.def ) ? booleanSelects.find( ( item ) => def.overtime.value === item.value ) : overtime;
    setOvertime( newOvertime );

    let newPausal = def.pausal && ( def.pausal.fixed || def.pausal.def ) ? booleanSelects.find( ( item ) => def.pausal.value === item.value ) : pausal;
    setPausal( newPausal );

    setDefaultFields( def );
  }

  React.useEffect( () => {
    setDefaults( project );
  }, [ project ] );

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
          title,
          closeDate: closeDate ? closeDate.valueOf()
            .toString() : null,
          assignedTo: assignedTo.map( user => user.id ),
          company: company.id,
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
          repeat: repeat ? {
            repeatInterval: repeat.repeatInterval.value,
            startsAt: repeat.startsAt.valueOf() + "",
            repeatEvery: repeat.repeatEvery + ""
          } : null,
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
          scheduled: scheduled.map( ( item ) => ( {
            to: item.to.valueOf()
              .toString(),
            from: item.from.valueOf()
              .toString(),
            UserId: item.user.id,
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
            .then( ( response2 ) => {
              if ( response2.data.ok ) {
                setSaving( false );
                closeModal();
                history.push( `${link}/${response.data.addTask.id}` )
              } else {
                setSaving( false );
              }
            } )
            .catch( ( err ) => {
              console.log( err.message );
              setSaving( false );
            } );
        } else {
          setSaving( false );
          closeModal();
          history.push( `${link}/${response.data.addTask.id}` )
        }

      } )
      .catch( ( err ) => {
        console.log( err.message );
        setSaving( false );
      } );
  }

  const cantSave = (
    saving ||
    loading ||
    title === "" ||
    status === null ||
    project === null ||
    assignedTo === [] ||
    !company ||
    ( project.def.tag.required && tags.length === 0 )
  )

  //RENDERS
  const renderLayoutButton = () => {
    return (
      <div className="task-add-layout">
        <button
          type="button"
          className="btn btn-link waves-effect task-add-layout-button"
          onClick={ () => setLayout( (layout === 1 ? 2 : 1) ) }>
          <i className="fas fa-retweet "/>
          Layout
        </button>
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
            onChange={ (e) => setTitle(e.target.value) }
            placeholder="ENTER NEW TASK NAME" />
        </span>
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
          setProject(project);
          setMilestone(noMilestone);
          let newAssignedTo = assignedTo.filter((user) => project.users.includes(user.id));
          setAssignedTo(newAssignedTo);
        }}
        options={projects.filter((project) => currentUser.role.level === 0 || project.right.addTasks )}
        styles={selectStyleNoArrowRequired}
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
        }}
        options={USERS_WITH_PERMISSIONS}
        styles={selectStyleNoArrowRequired}
        />
    ),
    Status: (
      <Select
        placeholder="Select required"
        value={status}
        isDisabled={defaultFields.status.fixed || !userRights.statusWrite }
        styles={selectStyleNoArrowColoredRequired}
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
    ),
    Type: (
      <Select
        placeholder="Select task type"
        value={taskType}
        isDisabled={ !userRights.typeWrite }
        styles={ selectStyleNoArrowRequired }
        onChange={(taskType)=> {
          setTaskType(taskType);
        }}
        options={taskTypes}
        />
    ),
    Milestone: (
      <Select
        isDisabled={!userRights.milestoneWrite}
        placeholder="None"
        value={milestone}
        onChange={(milestone)=> {
          if(status.action==='PendingDate'){
            if(milestone.startsAt !== null){
              setMilestone(milestone);
              setPendingDate(moment(milestone.startsAt));
              setPendingChangable(false);
            }else{
              setMilestone(milestone);
              setPendingChangable(true);
            }
          }else{
            setMilestone(milestone);
          }
        }}
        options={milestones.filter((milestone)=>milestone.id===null || (project !== null && milestone.project === project.id))}
        styles={ selectStyleNoArrowNoPadding }
        />
    ),
    Requester: (
      <Select
        value={requester}
        placeholder="Select required"
        isDisabled={defaultFields.requester.fixed || !userRights.requesterWrite}
        onChange={(requester)=>{
          setRequester(requester);
          const newCompany = companies.find((company) => company.id === requester.id );
          setCompany(newCompany);
        }}
        options={REQUESTERS}
        styles={ selectStyleNoArrowRequired }
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
        }}
        options={companies}
        styles={ selectStyleNoArrowRequired }
        />
    ),
    Pausal: (
      <Select
        value={pausal}
        placeholder="Select required"
        isDisabled={ !userRights.pausalWrite || !company || company.monthly || defaultFields.pausal.fixed}
        styles={ selectStyleNoArrowRequired }
        onChange={(pausal)=> setPausal(pausal)}
        options={booleanSelects}
        />
    ),
    Deadline: (
      <DatePicker
        className={classnames("form-control")}
        selected={deadline}
        disabled={!userRights.deadlineWrite}
        onChange={date => setDeadline(date)}
        placeholderText="No deadline"
        />
    ),
    Overtime: (
      <Select
        placeholder="Select required"
        value={overtime}
        isDisabled={ !userRights.overtimeWrite || defaultFields.overtime.fixed}
        styles={ selectStyleNoArrowRequired }
        onChange={(overtime) => setOvertime(overtime)}
        options={booleanSelects}
        />
    ),
    Tags: (
      <div className="f-1">
        <Select
          value={tags}
          placeholder="None"
          isDisabled={defaultFields.tag.fixed || !userRights.tagsWrite}
          isMulti
          onChange={(t)=>setTags(t)}
          options={ !userRights.tagsRead || project === null ? [] : toSelArr(project.tags)}
          styles={ selectStyleNoArrowColoredRequired }
          />
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
               !defaultFields.assignedTo.fixed &&
               userRights.assignedWrite &&
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
              userRights.repeatWrite &&
              <Repeat
                taskID={null}
                repeat={repeat}
                disabled={true}
                submitRepeat={(repeat)=>{
                  if(viewOnly){
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

          { userRights.tagsRead &&
            !defaultFields.tag.fixed &&
            userRights.tagsWrite &&
            <div className="row p-r-10">
              <Label className="col-0-5 col-form-label">Tags { project && project.def.tag.required ? <span className="warning-big">*</span> : ""}</Label>
              <div className="col-11-5">
                { layoutComponents.Tags }
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
      <div className="task-edit-right">
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
           !defaultFields.assignedTo.fixed &&
           userRights.assignedWrite &&
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
          userRights.repeatWrite &&
          <Repeat
            taskID={null}
            repeat={repeat}
            disabled={true}
            submitRepeat={(repeat)=>{
              if(true){
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
        { userRights.scheduledRead &&
          userRights.scheduledWrite &&
          <Scheduled
            items={scheduled}
            users={assignedTo}
            disabled={false}
            onChange={(item) => {
              let newScheduled = [...scheduled];
              newScheduled[newScheduled.findIndex((item2) => item2.id === item.id )] = item;
              setScheduled(newScheduled);
            }}
            submitItem = { (newScheduled) => {
              setScheduled([
                ...scheduled,
                {
                  ...newScheduled,
                  id: fakeID--,
                }
              ])
            }}
            deleteItem = { (newScheduled) => {
              setScheduled(scheduled.filter((newScheduled2) => newScheduled.id !== newScheduled2.id ))
            } }
            layout={layout}
            />
        }
        { userRights.tagsRead &&
          !defaultFields.tag.fixed &&
          userRights.tagsWrite &&
          <div className="form-selects-entry-column" >
            <Label>Tags { project && project.def.tag.required ? <span className="warning-big">*</span> : ""}</Label>
            <div className="form-selects-entry-column-rest" >
              { layoutComponents.Tags }
            </div>
          </div>
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

  const renderTags = () => {
    if ( !userRights.tagsRead ) {
      return null;
    }
    return (
      <div className = "form-section" >
        <Label>Tagy</Label>
        <div className="f-1 form-section-rest" style={{marginLeft: "5px"}}>
          <Select
            value={tags}
            placeholder="None"
            isDisabled={defaultFields.tag.fixed || !userRights.tagsWrite}
            isMulti
            onChange={(t)=>setTags(t)}
            options={ !userRights.tagsRead || project === null ? [] : toSelArr(project.tags)}
            styles={ project && project.def.tag.required ? invisibleSelectStyleNoArrowColoredRequired : invisibleSelectStyleNoArrowColored }
            />
        </div>
      </div>
    )
  }

  const renderDescription = () => {
    if ( !userRights.taskDescriptionRead ) {
      return null;
    }
    return (
      <div className="form-section">
        <div className="row" style={{alignItems: "baseline"}}>
          <Label className="m-r-10">Popis úlohy</Label>
            { userRights.taskAttachmentsRead && userRights.taskAttachmentsWrite &&
              <label htmlFor={`uploadAttachment-${null}`} className="btn btn-link" >
                <i className="fa fa-plus" />
                Attachment
              </label>
          }
        </div>
        <div  className="form-section-rest">
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
    if ( !userRights.taskShortSubtasksRead ) {
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
        attachments={attachments}
        addAttachments={(newAttachments)=>{
          let time = moment().valueOf();
          newAttachments = newAttachments.map((attachment)=>{
            return {
              title:attachment.name,
              size:attachment.size,
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
      <VykazyTable
        id={company ? company.id : 0}
        showColumns={ [0,1,2,3,4,5,6,7,8] }
        showTotals={false}
        userRights={userRights}
        isInvoiced={false}
        canEditInvoiced={false}
        company={company}
        match={match}
        taskID={null}
        taskAssigned={assignedTo}

        showSubtasks={project ? project.showSubtasks : false}

        submitService={(newService)=>{
          setSubtasks([...subtasks,{id:getNewID(), ...newService}]);
        }}
        subtasks={subtasks}
        defaultType={taskType}
        taskTypes={taskTypes}
        updateSubtask={(id,newData)=>{
          let newSubtasks=[...subtasks];
          newSubtasks[newSubtasks.findIndex((taskWork)=>taskWork.id===id)]={...newSubtasks.find((taskWork)=>taskWork.id===id),...newData};
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
        workTrips={workTrips}
        tripTypes={tripTypes}
        submitTrip={(newTrip)=>{
          setWorkTrips([...workTrips,{id: getNewID(),...newTrip}]);
        }}
        updateTrip={(id,newData)=>{
          let newTrips=[...workTrips];
          newTrips[newTrips.findIndex((trip)=>trip.id===id)]={...newTrips.find((trip)=>trip.id===id),...newData};
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

        materials={materials}
        submitMaterial={(newMaterial)=>{
          setMaterials([...materials,{id:getNewID(),...newMaterial}]);
        }}
        updateMaterial={(id,newData)=>{
          let newMaterials=[...materials];
          newMaterials[newMaterials.findIndex((material)=>material.id===id)]={...newMaterials.find((material)=>material.id===id),...newData};
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

        customItems={customItems}
        submitCustomItem={(customItem)=>{
          setCustomItems([...customItems,{id:getNewID(),...customItem}]);
        }}
        updateCustomItem={(id,newData)=>{
          let newCustomItems=[...customItems];
          newCustomItems[newCustomItems.findIndex((customItem)=>customItem.id===id)]={...newCustomItems.find((customItem)=>customItem.id===id),...newData};
          setCustomItems(newCustomItems);
        }}
        updateCustomItems={(multipleCustomItems)=>{
          let newCustomItems=[...customItems];
          multipleCustomItems.forEach(({id, newData})=>{
            newCustomItems[newCustomItems.findIndex((customItem)=>customItem.id===id)]={...newCustomItems.find((customItem)=>customItem.id===id),...newData};
          });
          setCustomItems(newCustomItems);
        }}
        removeCustomItem={(id)=>{
          let newCustomItems=[...customItems];
          newCustomItems.splice(newCustomItems.findIndex((customItem)=>customItem.id===id),1);
          setCustomItems(newCustomItems);
        }}

        units={[]}
        defaultUnit={defaultUnit}
        />
    )
  }

  const renderButtons = () => {
    return (
      <div className="form-section task-edit-buttons">
      <div className="row form-section-rest">
        {closeModal &&
          <Button className="btn btn-link-cancel" onClick={() => closeModal()}>Cancel</Button>
        }
        {canCreateVykazyError()}
        <button
          className="btn pull-right"
          disabled={ cantSave }
          onClick={addTaskFunc}
          > Create task
        </button>
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

  return (
    <div style={{backgroundColor: "#f9f9f9"}}>
      {renderLayoutButton()}
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

        </div>

        { layout === 2 && renderSelectsLayout2Side() }

      </div>

      { renderButtons() }

    </div>
  );
}