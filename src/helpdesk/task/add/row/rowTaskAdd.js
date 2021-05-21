import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/client";

import Select from 'react-select';
import {
  Label,
  Button
} from 'reactstrap';
import DatePicker from 'components/DatePicker';
import moment from 'moment';

import Attachments from 'helpdesk/components/attachments';

import VykazyTable, {
  getCreationError as getVykazyError
} from 'helpdesk/components/vykazy/vykazyTable';

import classnames from "classnames";

import CKEditor5 from '@ckeditor/ckeditor5-react';
import ck5config from 'configs/components/ck5config';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import axios from 'axios';
import {
  pickSelectStyle
} from 'configs/components/select';
import {
  localFilterToValues,
  toSelArr
} from 'helperFunctions';
import booleanSelects from 'configs/constants/boolSelect'
import CheckboxList from 'helpdesk/components/checkboxList';
import Scheduled from 'helpdesk/components/scheduled';
import {
  noMilestone
} from 'configs/constants/sidebar';
import {
  noDef
} from 'configs/constants/projects';
import {
  ADD_TASK,
  GET_TASKS,
} from '../../queries';
import {
  GET_FILTER,
  GET_PROJECT,
} from 'apollo/localSchema/queries';

export default function RowTaskAdd( props ) {
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
    closeModal
  } = props;

  const userIfInProject = ( project ) => {
    let USERS_WITH_PERMISSIONS = users.filter( ( user ) => project && project.users.includes( user.id ) );
    let user = USERS_WITH_PERMISSIONS.find( ( user ) => user.id === currentUser.id );
    return user ? user : null;
  }

  const [ addTask, {
    client
    } ] = useMutation( ADD_TASK );

  const {
    data: filterData,
    loading: filterLoading
  } = useQuery( GET_FILTER );

  const {
    data: projectData,
    loading: projectLoading
  } = useQuery( GET_PROJECT );

  //state
  const [ layout, setLayout ] = React.useState( 2 );

  const [ project, setProject ] = React.useState( projectID ? projects.find( p => p.id === projectID ) : null );
  const USERS_WITH_PERMISSIONS = users.filter( ( user ) => project && project.users.includes( user.id ) );
  const [ defaultFields, setDefaultFields ] = React.useState( noDef );

  const [ attachments, setAttachments ] = React.useState( [] );
  const [ assignedTo, setAssignedTo ] = React.useState( USERS_WITH_PERMISSIONS.find( ( user ) => user.id === currentUser.id ) );
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

    let filteredAssignedTo = project && project.users.includes( assignedTo.id ) ? assignedTo : null;
    if ( filteredAssignedTo.length === 0 && potencialUser ) {
      filteredAssignedTo = potencialUser;
    }
    let newAssignedTo = def.assignedTo && ( def.assignedTo.fixed || def.assignedTo.def ) ? users.filter( ( item ) => def.assignedTo.value.includes( item.id ) )[ 0 ] : filteredAssignedTo;
    setAssignedTo( newAssignedTo );
    let newRequester = def.requester && ( def.requester.fixed || def.requester.def ) ? users.find( ( item ) => item.id === def.requester.value.id ) : maybeRequester;
    setRequester( newRequester );

    let newCompany = def.company && ( def.company.fixed || def.company.def ) ? companies.find( ( item ) => item.id === def.company.value ) : ( companies && newRequester ? companies.find( ( company ) => company.id === newRequester.company.id ) : null );
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
    setSaving( true );
    addTask( {
        variables: {
          title,
          closeDate: null,
          assignedTo: [ assignedTo.id ],
          company: company.id,
          deadline: deadline ? deadline.valueOf()
            .toString() : null,
          description,
          milestone: null,
          overtime: overtime.value,
          pausal: pausal.value,
          pendingChangable: true,
          pendingDate: pendingDate ? pendingDate.valueOf()
            .toString() : null,
          project: project.id,
          requester: requester ? requester.id : null,
          status: status.id,
          tags: tags.map( tag => tag.id ),
          taskType: taskType ? taskType.id : null,
          repeat: null,
          subtasks: [],
          workTrips: [],
          materials: [],
          customItems: [],
        }
      } )
      .then( ( response ) => {
        const queryFilter = localFilterToValues( filterData.localFilter );
        const existingTasks = client.readQuery( {
            query: GET_TASKS,
            variables: {
              filterId: filterData.localFilter.id,
              filter: queryFilter,
              projectId: projectData.localProject.id
            }
          } )
          .tasks;
        client.writeQuery( {
          query: GET_TASKS,
          data: {
            tasks: {
              ...existingTasks,
              tasks: [ response.data.addTask, ...existingTasks.tasks ]
            }
          },
          variables: {
            filterId: filterData.localFilter.id,
            filter: queryFilter,
            projectId: projectData.localProject.id
          }
        } );
        setSaving( false );
      } )
      .catch( ( err ) => {
        console.log( err.message );
        setSaving( false );
      } );
  }

  const REQUESTERS = ( project && project.lockedRequester ? USERS_WITH_PERMISSIONS : users );


  return (
    <div className="col-12 row task-edit-align-select-labels">
      <div className="col-3 m-r-5 m-l-15" >
        <Label className="col-form-label-3">Write a new task name</Label>
        <input
          className="form-control"
          value={title}
          disabled={viewOnly}
          onChange={e =>setTitle(e.target.value)}
          />
      </div>
      <div className="col-1 m-r-5" >
        <Label className="col-form-label-3">Status</Label>
        <Select
          placeholder="Select required"
          value={status}
          isDisabled={defaultFields.status.fixed || viewOnly}
          styles={pickSelectStyle( [ 'noArrow', ] )}
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
          options={project ? toSelArr(project.statuses) : []}
          />
      </div>

      <div className="col-2 m-r-5">
        <Label className="col-form-label-3">Requester</Label>
        <Select
          value={requester}
          placeholder="Select required"
          isDisabled={defaultFields.requester.fixed || viewOnly}
          onChange={(requester)=>{
            setRequester(requester);
            setCompany(companies.find((company) => company.id === requester.id ))
          }}
          options={REQUESTERS}
          styles={pickSelectStyle(  [ 'noArrow', ] )}
          />
      </div>

      { defaultFields.company.show &&
        <div className="col-2 m-r-5">
          <Label className="col-form-label-3">Firma</Label>
          <Select
            value={company}
            placeholder="Select required"
            isDisabled={defaultFields.company.fixed || viewOnly}
            onChange={(company)=> {
              setCompany(company);
              setPausal(company.monthly ? booleanSelects[1] : booleanSelects[0]);
            }}
            options={companies}
            styles={pickSelectStyle(  [ 'noArrow', ] )}
            />
        </div>
      }


      <div className="col-2 m-r-5">
        <Label className="col-form-label-3">Assigned to</Label>
        <Select
          placeholder="Select required"
          value={assignedTo}
          isDisabled={defaultFields.assignedTo.fixed || viewOnly}
          onChange={(users)=> setAssignedTo(users)}
          options={USERS_WITH_PERMISSIONS}
          styles={pickSelectStyle(  [ 'noArrow', ] )}
          />
      </div>

      <div className="col-1 m-r-5">
        <Label className="col-form-label-3">Deadline</Label>
        <div className="col-form-value-2">
          <DatePicker
            className="form-control fullWidth"
            selected={deadline}
            disabled={viewOnly}
            onChange={date => setDeadline(date)}
            placeholderText="No deadline"
            />
        </div>
      </div>
      <button className="btn btn-secondary m-l-5 mt-auto"
        disabled={viewOnly}
        onClick={addTaskFunc}
        >
        ADD
      </button>

    </div>
  );
}