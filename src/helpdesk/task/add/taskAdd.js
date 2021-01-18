import React from 'react';
import {
  useMutation
} from "@apollo/client";

import Select from 'react-select';
import {
  Label,
  Button
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import Repeat from 'helpdesk/components/repeat';
import Attachments from 'helpdesk/components/attachments';

import VykazyTable from 'helpdesk/components/vykazyTable';

import classnames from "classnames";

import CKEditor5 from '@ckeditor/ckeditor5-react';
import ck5config from 'configs/components/ck5config';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
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
    project ?
    project.right : {
      admin: false,
      delete: false,
      internal: false,
      read: false,
      write: false
    }
  );

  const [ viewOnly, setViewOnly ] = React.useState( currentUser.role.level !== 0 && !userRights.write );

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
    //  setAssignedToCreationError( newAssignedTo );
    let newRequester = def.requester && ( def.requester.fixed || def.requester.def ) ? users.find( ( item ) => item.id === def.requester.value.id ) : maybeRequester;
    setRequester( newRequester );

    let newCompany = def.company && ( def.company.fixed || def.company.def ) ? companies.find( ( item ) => item.id === def.company.value ) : ( companies && newRequester ? companies.find( ( company ) => company.id === newRequester.company.id ) : null );
    setCompany( newCompany );
    //setCompanyCreationError( newCompany );

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

    let newTaskType = def.taskType && ( def.taskType.fixed || def.taskType.def ) ? taskTypes.find( ( item ) => item.id === def.taskType.value ) : taskType;
    setTaskType( newTaskType );
    //setTaskTypeCreationError( newTaskType );

    let newOvertime = def.overtime && ( def.overtime.fixed || def.overtime.def ) ? booleanSelects.find( ( item ) => def.overtime.value === item.value ) : overtime;
    setOvertime( newOvertime );

    let newPausal = def.pausal && ( def.pausal.fixed || def.pausal.def ) ? booleanSelects.find( ( item ) => def.pausal.value === item.value ) : pausal;
    setPausal( newPausal );

    setViewOnly( currentUser.role.level !== 0 && !project.right.write );

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
          formData.append( "token", `Bearer ${localStorage.getItem( "acctok" )}` );
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
        <Label>Task name </Label>
        <span>
          <input type="text"
            value={title}
            className="task-title-input full-width form-control"
            onChange={ (e) => setTitle(e.target.value) }
            placeholder="ENTER NEW TASK NAME" />
        </span>
        {
          status &&
          (['CloseDate','PendingDate','CloseInvalid']).includes(status.action) &&
          <div className="task-info-add ml-auto center-hor">
          <span className="">
            {(status.action==='CloseDate' || status.action==='CloseInvalid') ? "Close date: " : "PendingDate: "}
          </span>
          <DatePicker
            className="form-control hidden-input bolder"
            selected={(status.action==='CloseDate' || status.action==='CloseInvalid') ? closeDate : pendingDate }
            disabled={viewOnly}
            onChange={date => {
              if (status.action==='CloseDate' || status.action==='CloseInvalid'){
                setCloseDate(date);
              } else {
                setPendingDate(date);
              }
            }}
            placeholderText="No close date"
            {...datePickerConfig}
            />
        </div>
      }
      </div>
    );
  }

  const REQUESTERS = ( project && project.lockedRequester ? USERS_WITH_PERMISSIONS : users );

  const layoutComponents = {
    Project: ( viewOnly ) => (
      <Select
        placeholder={viewOnly ? "None" : "Select required" }
        value={project}
        onChange={(project)=>{
          setTags([]);
          setStatus(null);
          setProject(project);
          setMilestone(noMilestone);

          if(!viewOnly){
            let newAssignedTo = assignedTo.filter((user) => project.users.includes(user.id));
            setAssignedTo(newAssignedTo);
          //  setAssignedToCreationError(newAssignedTo);
          }else{
            setPausal(booleanSelects[0]);
          }

          const newViewOnly = currentUser.role.level !== 0 && !project.right.write;
          setViewOnly(newViewOnly);

          if(newViewOnly){
            setRepeat(null);
            setSimpleSubtasks([]);
            setScheduled([]);
            setSubtasks([]);
            setMaterials([]);
            setCustomItems([]);
            setWorkTrips([]);
            setDeadline(null);
            setCloseDate(null);
            setPendingDate(null);
            //		setReminder(null);
          }

        }}
        options={projects}
        styles={layout === 2 ? invisibleSelectStyleNoArrowNoPadding : invisibleSelectStyleNoArrowRequired}
        />
    ),
    Assigned: (
      <Select
        placeholder="Select required"
        value={assignedTo}
        isDisabled={defaultFields.assignedTo.fixed || viewOnly}
        isMulti
        onChange={(users)=> {
          setAssignedTo(users);
          //setAssignedToCreationError(users);
        }}
        options={USERS_WITH_PERMISSIONS}
        styles={invisibleSelectStyleNoArrowRequired}
        />
    ),
    Status: (
      <Select
        placeholder="Select required"
        value={status}
        isDisabled={defaultFields.status.fixed || viewOnly}
        styles={layout === 2 ? invisibleSelectStyleNoArrowColoredRequiredNoPadding : invisibleSelectStyleNoArrowColoredRequired}
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
        placeholder="Select required"
        value={taskType}
        isDisabled={defaultFields.taskType.fixed || viewOnly}
        styles={invisibleSelectStyleNoArrowRequired}
        onChange={(taskType)=> {
          setTaskType(taskType);
          //setTaskTypeCreationError(taskType);
        }}
        options={taskTypes}
        />
    ),
    Milestone: (
      <Select
        isDisabled={viewOnly}
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
        styles={layout === 2 ? invisibleSelectStyleNoArrowNoPadding : invisibleSelectStyleNoArrow}
        />
    ),
    Requester: (
      <Select
        value={requester}
        placeholder="Select required"
        isDisabled={defaultFields.requester.fixed || viewOnly}
        onChange={(requester)=>{
          setRequester(requester);
          const newCompany = companies.find((company) => company.id === requester.id );
          setCompany(newCompany);
      //    setCompanyCreationError(newCompany);
        }}
        options={REQUESTERS}
        styles={layout === 2 ? invisibleSelectStyleNoArrowRequiredNoPadding : invisibleSelectStyleNoArrowRequired}
        />
    ),
    Company: (
      <Select
        value={company}
        placeholder="Select required"
        isDisabled={defaultFields.company.fixed || viewOnly}
        onChange={(company)=> {
          setCompany(company);
          //setCompanyCreationError(company);
          setPausal(company.monthly ? booleanSelects[1] : booleanSelects[0]);
        }}
        options={companies}
        styles={layout === 2 ? invisibleSelectStyleNoArrowRequiredNoPadding : invisibleSelectStyleNoArrowRequired}
        />
    ),
    Pausal: (
      <Select
        value={pausal}
        placeholder="Select required"
        isDisabled={viewOnly || !company || company.monthly || defaultFields.pausal.fixed}
        styles={invisibleSelectStyleNoArrowRequired}
        onChange={(pausal)=> setPausal(pausal)}
        options={booleanSelects}
        />
    ),
    Deadline: (
      <DatePicker
        className="form-control hidden-input"
        selected={deadline}
        disabled={viewOnly}
        onChange={date => setDeadline(date)}
        placeholderText="No deadline"
        {...datePickerConfig}
        />
    ),
    Overtime: (
      <Select
        placeholder="Select required"
        value={overtime}
        isDisabled={viewOnly || defaultFields.overtime.fixed}
        styles={invisibleSelectStyleNoArrowRequired}
        onChange={(overtime) => setOvertime(overtime)}
        options={booleanSelects}
        />
    ),
  }

  const renderSelectsLayout1 = () => {
    return (
      <div className = "row" >
        {!viewOnly &&
          <div className="col-12 row">
            <div className="col-12 row">
              <div className="col-4">
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Projekt</Label>
                  <div className="col-9">
                    { layoutComponents.Project(viewOnly) }
                  </div>
                </div>
              </div>
              {!viewOnly &&
                defaultFields.assignedTo.show &&
                <div className="col-8">
                  <div className="row p-r-10">
                    <Label className="col-1-5 col-form-label">Assigned</Label>
                    <div className="col-10-5">
                      { layoutComponents.Assigned }
                    </div>
                  </div>
                </div>
              }
            </div>

            <div className="col-4">
              {!viewOnly &&
                defaultFields.status.show &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Status</Label>
                  <div className="col-9">
                    { layoutComponents.Status }
                  </div>
                </div>
              }
              {!viewOnly &&
                defaultFields.taskType.show &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Typ</Label>
                  <div className="col-9">
                    { layoutComponents.Type }
                  </div>
                </div>
              }
              {!viewOnly &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Milestone</Label>
                  <div className="col-9">
                    { layoutComponents.Milestone }
                  </div>
                </div>
              }
            </div>

            <div className="col-4">
              {!viewOnly &&
                defaultFields.requester.show &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Zadal</Label>
                  <div className="col-9">
                    { layoutComponents.Requester }
                  </div>
                </div>
              }
              {!viewOnly &&
                defaultFields.company.show &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Firma</Label>
                  <div className="col-9">
                    { layoutComponents.Company }
                  </div>
                </div>
              }
              {!viewOnly &&
                defaultFields.pausal.show &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Paušál</Label>
                  <div className="col-9">
                    { layoutComponents.Pausal }
                  </div>
                </div>
              }
            </div>

            <div className="col-4">
              <div className="row p-r-10">
                <Label className="col-3 col-form-label">Deadline</Label>
                <div className="col-9">
                  { layoutComponents.Deadline }
                </div>
              </div>
              {!viewOnly &&
                <Repeat
                  taskID={null}
                  repeat={repeat}
                  disabled={viewOnly}
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
              {!viewOnly &&
                defaultFields.overtime.show &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Mimo PH</Label>
                  <div className="col-9">
                    {layoutComponents.Overtime}
                  </div>
                </div>
              }
            </div>
          </div>
        }
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
          { layoutComponents.Project(viewOnly) }
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
      <div className="task-edit-right  m-t-0 ">
        <div className="col-form-label-2" >
          <Label className="col-form-value-2">Status</Label>
          { layoutComponents.Status }
        </div>

        <div className="col-form-label-2">
          <Label className="col-form-value-2">Projekt</Label>
          { layoutComponents.Project(viewOnly) }
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
        {!viewOnly &&
          defaultFields.assignedTo.show &&
          <div className="">
            <Label className="col-form-label-2">Assigned</Label>
            <div className="col-form-value-2">
              <Select
                placeholder="Select required"
                value={assignedTo}
                isDisabled={defaultFields.assignedTo.fixed || viewOnly}
                isMulti
                onChange={(users)=> {
                  setAssignedTo(users);
                //  setAssignedToCreationError(users);
                }}
                options={USERS_WITH_PERMISSIONS}
                styles={invisibleSelectStyleNoArrowRequired}
                />
            </div>
          </div>
        }

        {!viewOnly &&
          <div className="">
            <Label className="col-form-label-2">Deadline</Label>
            <div className="col-form-value-2">
              <DatePicker
                className="form-control hidden-input"
                selected={deadline}
                disabled={viewOnly}
                onChange={date => setDeadline(date)}
                placeholderText="No deadline"
                {...datePickerConfig}
                />
            </div>
          </div>
        }

        {!viewOnly &&
          <Repeat
            taskID={null}
            repeat={repeat}
            disabled={viewOnly}
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
            addTask={true}
            vertical={true}
            />
        }

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
          />

        {!viewOnly &&
          defaultFields.taskType.show &&
          <div className="">
            <Label className="col-form-label-2">Task Type</Label>
            <div className="col-form-value-2">
              <Select
                placeholder="Select required"
                value={taskType}
                isDisabled={defaultFields.taskType.fixed || viewOnly}
                styles={invisibleSelectStyleNoArrowRequired}
                onChange={(taskType)=> {
                  setTaskType(taskType);
                //  setTaskTypeCreationError(taskType);
                }}
                options={taskTypes}
                />
            </div>
          </div>
        }

        {!viewOnly &&
          defaultFields.pausal.show &&
          <div className="">
            <Label className="col-form-label-2">Paušál</Label>
            <div className="col-form-value-2">
              <Select
                value={pausal}
                placeholder="Select required"
                isDisabled={viewOnly || !company || company.monthly || defaultFields.pausal.fixed}
                styles={invisibleSelectStyleNoArrowRequired}
                onChange={(pausal)=> setPausal(pausal)}
                options={booleanSelects}
                />
            </div>
          </div>
        }

        {!viewOnly &&
          defaultFields.overtime.show &&
          <div className="">
            <Label className="col-form-label-2">Mimo PH</Label>
            <div className="col-form-value-2">
              <Select
                placeholder="Select required"
                value={overtime}
                isDisabled={viewOnly || defaultFields.overtime.fixed}
                styles={invisibleSelectStyleNoArrowRequired}
                onChange={(overtime) => setOvertime(overtime)}
                options={booleanSelects}
                />
            </div>
          </div>
        }
      </div>
    )
  }

  const renderPopis = () => {
    return (
      <div className="form-section">
        <Label className="col-form-label-description">Popis úlohy</Label>
        <CKEditor5
          editor={ ClassicEditor }
          data={description}
          onInit={(editor)=>{
          }}
          onChange={(e, editor)=>{
            setDescription(editor.getData());
          }}
          readOnly={viewOnly}
          config={ck5config}
          />
      </div>
    )
  }

  const renderSimpleSubtasks = () => {
    return (
      <CheckboxList
        disabled={false}
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

  const renderTags = () => {
    return (
      <div className="form-section">
        <Label >Tagy </Label>
        <div className="f-1" style={{marginLeft: "-5px"}}>
          <Select
            value={tags}
            placeholder="None"
            isDisabled={defaultFields.tag.fixed || viewOnly}
            isMulti
            onChange={(t)=>setTags(t)}
            options={viewOnly || project === null ? [] : toSelArr(project.tags)}
            styles={invisibleSelectStyleNoArrowColored}
            />
        </div>
      </div>
    )
  }

  const renderAttachments = ( top ) => {
    return (
      <Attachments
        disabled={viewOnly}
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
    return (
      <VykazyTable
        id={company ? company.id : 0}
        showColumns={ [0,1,2,3,4,5,6,7,8] }

        showTotals={false}
        disabled={viewOnly}
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
      <div className="row">
        <Button
          className="btn btn-link-cancel"
          onClick={() => closeModal()}>Cancel</Button>
        {canCreateVykazyError()}
        <button
          className="btn"
          disabled={title==="" || status===null || project === null || assignedTo === [] || company === null || saving || loading}
          onClick={addTaskFunc}
          > Create task
        </button>
      </div>
    )
  }

  const canCreateVykazyError = () => {
    if ( getVykazyError( taskType, assignedTo.filter( ( user ) => user.id !== null ), company ) === '' ) {
      return null;
    }
    return (
      <span className="center-hor ml-auto m-r-5" style={{color: "#FF4500", height: "20px", fontSize: "14px"}}>
        {getVykazyError(taskType, assignedTo.filter((user) => user.id !== null ), company)}
      </span>
    );
  }

  return (
    <div>
      {renderLayoutButton()}

      <div
        className={classnames(
          "scrollable",
          { "p-0": layout === 1},
          { "row": layout === 2}
        )}
        >

        <div
          className={classnames(
            {
              "task-edit-left": layout === 2
            },
            {
              "task-edit-left-columns": layout === 1
            }
          )}>


          { renderTitle() }

          { layout === 1 ? renderSelectsLayout1() : renderTags() }

          { renderPopis() }

          { layout === 1 && defaultFields.tag.show && renderTags() }

            { renderSimpleSubtasks() }

          { renderAttachments(false) }

          { !viewOnly && renderVykazyTable(subtasks, workTrips, materials, customItems) }

          { renderButtons() }

        </div>

        { layout === 2 && renderSelectsLayout2Side() }

      </div>

    </div>
  );
}