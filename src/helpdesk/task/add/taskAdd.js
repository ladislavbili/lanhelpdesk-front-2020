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
  invisibleSelectStyleNoArrowColored,
  invisibleSelectStyleNoArrowColoredRequired,
  invisibleSelectStyleNoArrowRequired
} from 'configs/components/select';
import booleanSelects from 'configs/constants/boolSelect'
import {
  noMilestone
} from 'configs/constants/sidebar';
import {
  noDef
} from 'configs/constants/projects';
import {
  ADD_TASK
} from '../querries';

import {
  REST_URL
} from 'configs/restAPI';

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
    allTags,
    taskTypes,
    tripTypes,
    milestones,
    companies,
    statuses,
    defaultUnit,
    closeModal
  } = props;

  const userIfInProject = ( project ) => {
    let USERS_WITH_PERMISSIONS = users.filter( ( user ) => project && project.users.includes( user.id ) );
    let user = USERS_WITH_PERMISSIONS.find( ( user ) => user.id === currentUser.id );
    return user ? user : null;
  }

  const [ addTask ] = useMutation( ADD_TASK );
  //state
  const [ layout, setLayout ] = React.useState( 1 );

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
  const [ status, setStatus ] = React.useState( statuses ? statuses.find( ( status ) => status.action === 'IsNew' ) : null );
  const [ subtasks, setSubtasks ] = React.useState( [] );
  const [ tags, setTags ] = React.useState( [] );
  const [ materials, setMaterials ] = React.useState( [] );
  const [ taskType, setTaskType ] = React.useState( null );
  const [ title, setTitle ] = React.useState( "" );
  const [ workTrips, setWorkTrips ] = React.useState( [] );

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
    let newRequester = def.requester && ( def.requester.fixed || def.requester.def ) ? users.find( ( item ) => item.id === def.requester.value.id ) : maybeRequester;
    setRequester( newRequester );

    let newCompany = def.company && ( def.company.fixed || def.company.def ) ? companies.find( ( item ) => item.id === def.company.value ) : ( companies && newRequester ? companies.find( ( company ) => company.id === newRequester.company.id ) : null );
    setCompany( newCompany );


    let newStatus = def.status && ( def.status.fixed || def.status.def ) ? statuses.find( ( item ) => item.id === def.status.value.is ) : statuses[ 0 ];
    setStatus( newStatus );

    let mappedTags = def.tag.value.map( t => t.id );
    let newTags = def.tag && ( def.tag.fixed || def.tag.def ) ? allTags.filter( ( item ) => mappedTags.includes( item.id ) ) : allTags;
    setTags( newTags );

    let newTaskType = def.taskType && ( def.taskType.fixed || def.taskType.def ) ? taskTypes.find( ( item ) => item.id === def.taskType.value ) : taskType;
    setTaskType( newTaskType );

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

  const renderTitle = () => {
    return (
      <div className="row m-b-15">
        <span className="center-hor flex m-r-15">
          <input type="text"
            value={title}
            className="task-title-input text-extra-slim hidden-input"
            onChange={ (e) => setTitle(e.target.value) }
            placeholder="ENTER NEW TASK NAME" />
        </span>
        { status && (['CloseDate','PendingDate','CloseInvalid']).includes(status.action) && <div className="ml-auto center-hor">
          <span>
            { (status.action==='CloseDate' || status.action==='CloseInvalid') &&
              <span className="text-muted">
                Close date:
                <DatePicker
                  className="form-control hidden-input"
                  selected={closeDate}
                  disabled={viewOnly}
                  onChange={date => {
                    setCloseDate(date);
                  }}
                  placeholderText="No close date"
                  {...datePickerConfig}
                  />
              </span>
            }
            { status.action==='PendingDate' &&
              <span className="text-muted">
                Pending date:
                <DatePicker
                  className="form-control hidden-input"
                  selected={pendingDate}
                  disabled={viewOnly}
                  onChange={date => {
                    setPendingDate(date);
                  }}
                  placeholderText="No pending date"
                  {...datePickerConfig}
                  />
              </span>
            }
          </span>
        </div>}
        <button
          type="button"
          className="btn btn-link waves-effect ml-auto asc"
          onClick={ () => setLayout( (layout === 1 ? 2 : 1) ) }>
          Switch layout
        </button>
      </div>
    );
  }

  const REQUESTERS = ( project && project.lockedRequester ? USERS_WITH_PERMISSIONS : users );

  const renderSelectsLayout1 = () => {
    return (
      <div className="row">
        {viewOnly &&
          <div className="row p-r-10">
            <Label className="col-3 col-form-label">Projekt</Label>
            <div className="col-9">
              <Select
                value={project}
                placeholder="None"
                onChange={(project)=>{
                  setProject(project);
                  setMilestone(noMilestone);
                  setPausal(booleanSelects[0]);
                  const viewOnly = currentUser.role.level !== 0 && !project.right.write;
                  setViewOnly(viewOnly);

                  if(viewOnly){
                    setRepeat(null);
                    setSubtasks([]);
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
                styles={invisibleSelectStyleNoArrow}
                />
            </div>
          </div>
        }

        {!viewOnly &&
          <div className="col-12">
            <div className="col-12">
              <div className="col-4">
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Projekt</Label>
                  <div className="col-9">
                    <Select
                      placeholder="Select required"
                      value={project}
                      onChange={(project)=>{
                        setProject(project);
                        setMilestone(noMilestone);
                        let newAssignedTo = assignedTo.filter((user) => project.users.includes(user.id));
                        setAssignedTo(newAssignedTo);

                        const viewOnly = currentUser.role.level !== 0 && !project.right.write;
                        setViewOnly(viewOnly);

                        if(viewOnly){
                          setRepeat(null);
                          setSubtasks([]);
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
                      styles={invisibleSelectStyleNoArrowRequired}
                      />
                  </div>
                </div>
              </div>
              {!viewOnly &&
                defaultFields.assignedTo.show &&
                <div className="col-8">
                  <div className="row p-r-10">
                    <Label className="col-1-5 col-form-label">Assigned</Label>
                    <div className="col-10-5">
                      <Select
                        placeholder="Select required"
                        value={assignedTo}
                        isDisabled={defaultFields.assignedTo.fixed || viewOnly}
                        isMulti
                        onChange={(users)=> setAssignedTo(users)}
                        options={USERS_WITH_PERMISSIONS}
                        styles={invisibleSelectStyleNoArrowRequired}
                        />
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
                    <Select
                      placeholder="Select required"
                      value={status}
                      isDisabled={defaultFields.status.fixed || viewOnly}
                      styles={invisibleSelectStyleNoArrowColoredRequired}
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
                      options={statuses}
                      />
                  </div>
                </div>
              }
              {!viewOnly &&
                defaultFields.taskType.show &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Typ</Label>
                  <div className="col-9">
                    <Select
                      placeholder="Select required"
                      value={taskType}
                      isDisabled={defaultFields.taskType.fixed || viewOnly}
                      styles={invisibleSelectStyleNoArrowRequired}
                      onChange={(taskType)=>setTaskType(taskType)}
                      options={taskTypes}
                      />
                  </div>
                </div>
              }
              {!viewOnly &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Milestone</Label>
                  <div className="col-9">
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
                      styles={invisibleSelectStyleNoArrow}
                      />
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
                    <Select
                      value={requester}
                      placeholder="Select required"
                      isDisabled={defaultFields.requester.fixed || viewOnly}
                      onChange={(requester)=>{
                        setRequester(requester);
                        setCompany(companies.find((company) => company.id === requester.id ))
                      }}
                      options={REQUESTERS}
                      styles={invisibleSelectStyleNoArrowRequired}
                      />
                  </div>
                </div>
              }
              {!viewOnly &&
                defaultFields.company.show &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Firma</Label>
                  <div className="col-9">
                    <Select
                      value={company}
                      placeholder="Select required"
                      isDisabled={defaultFields.company.fixed || viewOnly}
                      onChange={(company)=> {
                        setCompany(company);
                        setPausal(company.monthly ? booleanSelects[1] : booleanSelects[0]);
                      }}
                      options={companies}
                      styles={invisibleSelectStyleNoArrowRequired}
                      />
                  </div>
                </div>
              }
              {!viewOnly &&
                defaultFields.pausal.show &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Paušál</Label>
                  <div className="col-9">
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
            </div>

            <div className="col-4">
              <div className="row p-r-10">
                <Label className="col-3 col-form-label">Deadline</Label>
                <div className="col-9">
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
                  />
              }
              {!viewOnly &&
                defaultFields.overtime.show &&
                <div className="row p-r-10">
                  <Label className="col-3 col-form-label">Mimo PH</Label>
                  <div className="col-9">
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
          </div>
        }
      </div>
    )
  }

  const renderSelectsLayout2 = () => {
    return (
      <div className="task-edit-right">
        {viewOnly &&
          <div className="">
            <Label className="col-form-label-2">Projekt</Label>
            <div className="col-form-value-2">
              <Select
                value={project}
                placeholder="None"
                onChange={(project)=>{
                  setProject(project);
                  setMilestone(noMilestone);
                  setPausal(booleanSelects[0]);
                  const viewOnly = currentUser.role.level !== 0 && !project.right.write;
                  setViewOnly(viewOnly);

                  if(viewOnly){
                    setRepeat(null);
                    setSubtasks([]);
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
                styles={invisibleSelectStyleNoArrow}
                />
            </div>
          </div>
        }

        {!viewOnly &&
          <div className="">
            <Label className="col-form-label-2">Projekt</Label>
            <div className="col-form-value-2">
              <Select
                placeholder="Select required"
                value={project}
                onChange={(project)=>{
                  setProject(project);
                  setMilestone(noMilestone);

                  let newAssignedTo = assignedTo.filter((user) => project.users.includes(user.id));
                  setAssignedTo(newAssignedTo);

                  const viewOnly = currentUser.role.level !== 0 && !project.right.write;
                  setViewOnly(viewOnly);

                  if(viewOnly){
                    setRepeat(null);
                    setSubtasks([]);
                    setSubtasks([]);
                    setMaterials([]);
                    setCustomItems([]);
                    setDeadline(null);
                    setCloseDate(null);
                    setPendingDate(null);
                    //					setReminder(null);
                  }
                }}
                options={projects}
                styles={invisibleSelectStyleNoArrowRequired}
                />
            </div>
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
                onChange={(users)=> setAssignedTo(users)}
                options={USERS_WITH_PERMISSIONS}
                styles={invisibleSelectStyleNoArrowRequired}
                />
            </div>
          </div>
        }

        {!viewOnly &&
          defaultFields.status.show &&
          <div className="">
            <Label className="col-form-label-2">Status</Label>
            <div className="col-form-value-2">
              <Select
                placeholder="Select required"
                value={status}
                isDisabled={defaultFields.status.fixed || viewOnly}
                styles={invisibleSelectStyleNoArrowColoredRequired}
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
                options={statuses.filter((status)=>status.action!=='invoiced').sort((item1,item2)=>{
                  if(item1.order &&item2.order){
                    return item1.order > item2.order? 1 :-1;
                  }
                  return -1;
                })}
                />
            </div>
          </div>
        }

        {!viewOnly &&
          defaultFields.taskType.show &&
          <div className="">
            <Label className="col-form-label-2">Typ</Label>
            <div className="col-form-value-2">
              <Select
                placeholder="Select required"
                value={taskType}
                isDisabled={defaultFields.taskType.fixed || viewOnly}
                styles={invisibleSelectStyleNoArrowRequired}
                onChange={(taskType)=>setTaskType(taskType)}
                options={taskTypes}
                />
            </div>
          </div>}
          {!viewOnly &&
            <div className="">
              <Label className="col-form-label-2">Milestone</Label>
              <div className="col-form-value-2">
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
                  styles={invisibleSelectStyleNoArrow}
                  />
              </div>
            </div>
          }

          {defaultFields.tag.show &&
            <div className="">
              <Label className="col-form-label-2">Tagy: </Label>
              <div className="col-form-value-2">
                <Select
                  value={tags}
                  placeholder="None"
                  isDisabled={defaultFields.tag.fixed || viewOnly}
                  isMulti
                  onChange={(t)=>setTags(t)}
                  options={allTags}
                  styles={invisibleSelectStyleNoArrowColored}
                  />
              </div>
            </div>
          }

          {!viewOnly &&
            defaultFields.requester.show &&
            <div className="">
              <Label className="col-form-label-2">Zadal</Label>
              <div className="col-form-value-2">
                <Select
                  value={requester}
                  placeholder="Select required"
                  isDisabled={defaultFields.requester.fixed || viewOnly}
                  onChange={(requester)=>setRequester(requester)}
                  options={REQUESTERS}
                  styles={invisibleSelectStyleNoArrowRequired}
                  />
              </div>
            </div>
          }

          {!viewOnly &&
            defaultFields.company.show &&
            <div className="">
              <Label className="col-form-label-2">Firma</Label>
              <div className="col-form-value-2">
                <Select
                  value={company}
                  placeholder="Select required"
                  isDisabled={defaultFields.company.fixed || viewOnly}
                  onChange={(company)=> {
                    setCompany(company);
                    setPausal(company.monthly ? booleanSelects[1] : booleanSelects[0]);
                  }}
                  options={companies}
                  styles={invisibleSelectStyleNoArrowRequired}
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
              />
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
      <div>
          <Label className="m-b-10 col-form-label m-t-10">Popis úlohy</Label>
          {!descriptionVisible &&
            <span className="task-edit-popis p-20 text-muted" onClick={()=>setDescriptionVisible(true)}>
              Napíšte krátky popis úlohy
            </span>}
            {descriptionVisible &&
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
            }
          </div>
    )
  }

  const renderTags = () => {
    return (
      <div className="row m-t-10">
            <div className="center-hor">
              <Label className="center-hor">Tagy: </Label>
            </div>
            <div className="f-1 ">
              <Select
                value={tags}
                placeholder="None"
                isDisabled={defaultFields.tag.fixed || viewOnly}
                isMulti
                onChange={(t)=>setTags(t)}
                options={viewOnly ? [] : allTags}
                styles={invisibleSelectStyleNoArrowColored}
                />
            </div>
          </div>
    )
  }

  const renderAttachments = () => {
    return (
      <Attachments
            disabled={viewOnly}
            taskID={null}
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
      <div>
            {closeModal &&
              <Button className="btn-link-remove" onClick={() => closeModal()}>Cancel</Button>
            }
            <button
              className="btn pull-right"
              disabled={title==="" || status===null || project === null || assignedTo === [] || company === null || saving || loading}
              onClick={addTaskFunc}
              > Create task
            </button>
          </div>
    )
  }

  return (
    <div className={classnames("scrollable", { "p-20": layout === 1}, { "row": layout === 2})}>

          <div className={classnames({ "task-edit-left p-l-20 p-r-20 p-b-15 p-t-15": layout === 2})}>

            { renderTitle() }

            <hr className="m-t-15 m-b-10"/>

            { layout === 1 && renderSelectsLayout1() }

            { renderPopis() }

            { layout === 1 && defaultFields.tag.show && renderTags() }

            { renderAttachments() }

            { !viewOnly && renderVykazyTable(subtasks, workTrips, materials, customItems) }

            { renderButtons() }

          </div>

          { layout === 2 && renderSelectsLayout2() }

        </div>
  );
}