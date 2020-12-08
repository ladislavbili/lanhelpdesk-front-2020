import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/client";

import {
  Button,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import {
  toSelArr
} from 'helperFunctions';
import {
  fetchNetOptions
} from "configs/constants/apollo";
import {
  defList,
  defBool,
  defItem
} from 'configs/constants/projects';
import Permissions from "helpdesk/components/projectPermissions";
import ProjectDefaultValues from "helpdesk/components/projects/defaultValues";
import DeleteReplacement from 'components/deleteReplacement';
import Loading from 'components/loading';
import {
  setProject,
} from 'apollo/localSchema/actions';

import {
  GET_BASIC_COMPANIES,
} from '../companies/querries';
import {
  GET_BASIC_USERS,
} from '../users/querries';
import {
  GET_STATUSES,
} from '../statuses/querries';
import {
  GET_TAGS,
} from '../tags/querries';
import {
  GET_TASK_TYPES,
} from '../taskTypes/querries';
import {
  GET_PROJECTS,
  GET_MY_PROJECTS,
  GET_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  GET_MY_DATA
} from './querries';

export default function ProjectEdit( props ) {
  //data & queries
  const {
    history,
    match,
    closeModal,
    projectID
  } = props;

  const id = closeModal ? projectID : parseInt( match.params.id );

  const {
    data: myData,
    loading: myDataLoading
  } = useQuery( GET_MY_DATA );

  const {
    data: projectData,
    loading: projectLoading,
    refetch
  } = useQuery( GET_PROJECT, {
    variables: {
      id
    },
    notifyOnNetworkStatusChange: true,
  } );
  const [ updateProject ] = useMutation( UPDATE_PROJECT );
  const [ deleteProject, {
    client
  } ] = useMutation( DELETE_PROJECT );
  const {
    data: statusesData,
    loading: statusesLoading
  } = useQuery( GET_STATUSES, fetchNetOptions );
  const {
    data: companiesData,
    loading: companiesLoading
  } = useQuery( GET_BASIC_COMPANIES, fetchNetOptions );
  const {
    data: usersData,
    loading: usersLoading
  } = useQuery( GET_BASIC_USERS, fetchNetOptions );
  const {
    data: allTagsData,
    loading: allTagsLoading
  } = useQuery( GET_TAGS, fetchNetOptions );
  const {
    data: taskTypesData,
    loading: taskTypesLoading
  } = useQuery( GET_TASK_TYPES, fetchNetOptions );

  let allProjects = [];
  if ( projectID ) {
    toSelArr( client.readQuery( {
        query: GET_MY_PROJECTS
      } )
      .myProjects );

  } else {
    allProjects = toSelArr( client.readQuery( {
        query: GET_PROJECTS
      } )
      .projects );
  }
  const filteredProjects = allProjects.filter( project => project.id !== id );
  const theOnlyOneLeft = allProjects.length === 1;

  const currentUser = myData ? myData.getMyData : {};

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ description, setDescription ] = React.useState( "" );
  const [ lockedRequester, setLockedRequester ] = React.useState( true );
  const [ projectRights, setProjectRights ] = React.useState( [] );

  const [ assignedTo, setAssignedTo ] = React.useState( defList );
  const [ company, setCompany ] = React.useState( defItem );
  const [ overtime, setOvertime ] = React.useState( defBool );
  const [ pausal, setPausal ] = React.useState( defBool );
  const [ requester, setRequester ] = React.useState( defItem );
  const [ status, setStatus ] = React.useState( defItem );
  const [ tag, setTag ] = React.useState( defList );
  const [ taskType, setTaskType ] = React.useState( defItem );

  const [ saving, setSaving ] = React.useState( false );
  const [ deleteOpen, setDeleteOpen ] = React.useState( false );

  // sync
  React.useEffect( () => {
    if ( !projectLoading ) {
      setTitle( projectData.project.title );
      setDescription( projectData.project.description );
      setLockedRequester( projectData.project.lockedRequester );
      setProjectRights( projectData.project.projectRights );
      let newOvertime = {
        def: projectData.project.def.overtime.def,
        fixed: projectData.project.def.overtime.fixed,
        show: projectData.project.def.overtime.show,
        value: ( projectData.project.def.overtime.value ? {
          value: true,
          label: 'Yes'
        } : {
          value: false,
          label: 'No'
        } )
      };
      setOvertime( newOvertime );
      let newPausal = {
        def: projectData.project.def.pausal.def,
        fixed: projectData.project.def.pausal.fixed,
        show: projectData.project.def.pausal.show,
        value: ( projectData.project.def.pausal.value ? {
          value: true,
          label: 'Yes'
        } : {
          value: false,
          label: 'No'
        } )
      };
      setPausal( newPausal );
    }
  }, [ projectLoading ] );

  React.useEffect( () => {
    if ( !projectLoading && !usersLoading ) {
      let users = toSelArr( usersData.basicUsers, 'email' );
      let newAssignedTo = {
        def: projectData.project.def.assignedTo.def,
        fixed: projectData.project.def.assignedTo.fixed,
        show: projectData.project.def.assignedTo.show,
        value: projectData.project.def.assignedTo.value.map( user => users.find( u => u.id === user.id ) )
      };
      setAssignedTo( newAssignedTo );
      let newRequester = {
        def: projectData.project.def.requester.def,
        fixed: projectData.project.def.requester.fixed,
        show: projectData.project.def.requester.show,
        value: ( projectData.project.def.requester.value ? users.find( u => u.id === projectData.project.def.requester.value.id ) : null )
      };
      setRequester( newRequester );
    }
  }, [ projectLoading, usersLoading ] );

  React.useEffect( () => {
    if ( !projectLoading && !companiesLoading ) {
      let companies = toSelArr( companiesData.basicCompanies );
      let newCompany = {
        def: projectData.project.def.company.def,
        fixed: projectData.project.def.company.fixed,
        show: projectData.project.def.company.show,
        value: ( projectData.project.def.company.value ? companies.find( c => c.id === projectData.project.def.company.value.id ) : null )
      };
      setCompany( newCompany );
    }
  }, [ projectLoading, companiesLoading ] );

  React.useEffect( () => {
    if ( !projectLoading && !statusesLoading ) {
      let statuses = toSelArr( statusesData.statuses );
      let newStatus = {
        def: projectData.project.def.status.def,
        fixed: projectData.project.def.status.fixed,
        show: projectData.project.def.status.show,
        value: ( projectData.project.def.status.value ? statuses.find( c => c.id === projectData.project.def.status.value.id ) : null )
      };
      setStatus( newStatus );
    }
  }, [ projectLoading, statusesLoading ] );

  React.useEffect( () => {
    if ( !projectLoading && !allTagsLoading ) {
      let tags = toSelArr( allTagsData.tags );
      let ids = projectData.project.def.tag.value.map( v => v.id );
      let newValue = tags.filter( t => ids.includes( t.id ) );
      let newTag = {
        def: projectData.project.def.tag.def,
        fixed: projectData.project.def.tag.fixed,
        show: projectData.project.def.tag.show,
        value: newValue
      };
      setTag( newTag );
    }
  }, [ projectLoading, allTagsLoading ] );

  React.useEffect( () => {
    if ( !projectLoading && !taskTypesLoading ) {
      let taskTypes = toSelArr( taskTypesData.taskTypes );
      let newTaskType = {
        def: projectData.project.def.taskType.def,
        fixed: projectData.project.def.taskType.fixed,
        show: projectData.project.def.taskType.show,
        value: ( projectData.project.def.taskType.value ? taskTypes.find( c => c.id === projectData.project.def.taskType.value.id ) : null )
      };
      setTaskType( newTaskType );
    }
  }, [ projectLoading, taskTypesLoading ] );

  React.useEffect( () => {
    refetch( {
      variables: {
        id
      }
    } );
  }, [ id ] );

  // functions
  const updateProjectFunc = () => {
    setSaving( true );

    let newProjectRights = projectRights.map( r => ( {
      read: r.read,
      write: r.write,
      delete: r.delete,
      internal: r.internal,
      admin: r.admin,
      UserId: r.user.id
    } ) );

    let newDef = {
      assignedTo: {
        ...assignedTo,
        value: assignedTo.value.map( u => u.id )
      },
      company: {
        ...company,
        value: ( company.value ? company.value.id : null )
      },
      overtime: {
        ...overtime,
        value: overtime.value.value
      },
      pausal: {
        ...pausal,
        value: pausal.value.value
      },
      requester: {
        ...requester,
        value: ( requester.value ? requester.value.id : null )
      },
      status: {
        ...status,
        value: ( status.value ? status.value.id : null )
      },
      tag: {
        ...tag,
        value: tag.value.map( u => u.id )
      },
      taskType: {
        ...taskType,
        value: ( taskType.value ? taskType.value.id : null )
      },
    }

    updateProject( {
        variables: {
          id,
          title,
          description,
          lockedRequester,
          projectRights: newProjectRights,
          def: newDef,
        }
      } )
      .then( ( response ) => {
        const updatedProject = {
          ...response.data.updateProject
        };
        if ( closeModal ) {
          const myRights = newProjectRights.find( ( projectRight ) => projectRight.UserId === currentUser.id );
          if ( myRights ) {
            client.writeQuery( {
              query: GET_MY_PROJECTS,
              data: {
                projects: [ ...allProjects.filter( project => project.id !== id ), updatedProject ]
              }
            } );
            closeModal( updatedProject, myRights );
          } else {
            client.writeQuery( {
              query: GET_MY_PROJECTS,
              data: {
                projects: [ ...allProjects.filter( project => project.id !== id ) ]
              }
            } );
            closeModal( null, null );
          }
        } else {
          client.writeQuery( {
            query: GET_PROJECTS,
            data: {
              projects: [ ...allProjects.filter( project => project.id !== id ), updatedProject ]
            }
          } );

        }
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
  };

  const deleteProjectFunc = ( replacement ) => {
    setDeleteOpen( false );
    if ( window.confirm( "Are you sure?" ) ) {
      deleteProject( {
          variables: {
            id,
            newId: parseInt( replacement.id ),
          }
        } )
        .then( ( response ) => {
          if ( closeModal ) {
            client.writeQuery( {
              query: GET_MY_PROJECTS,
              data: {
                projects: filteredProjects
              }
            } );
            projectDeleted();
            closeModal( null, null );
          } else {
            client.writeQuery( {
              query: GET_PROJECTS,
              data: {
                projects: filteredProjects
              }
            } );
            history.push( '/helpdesk/settings/projects/add' );
          }
        } )
        .catch( ( err ) => {
          console.log( err.message );
          console.log( err );
        } );
    }
  };

  if (
    projectLoading ||
    statusesLoading ||
    companiesLoading ||
    usersLoading ||
    allTagsLoading ||
    taskTypesLoading ||
    myDataLoading
  ) {
    return <Loading />
  }

  const cannotSave = (
    saving ||
    title === "" ||
    ( company && company.value === null && company.fixed ) ||
    ( status && status.value === null && status.fixed ) ||
    ( assignedTo && assignedTo.value.length === 0 && assignedTo.fixed ) ||
    ( taskType && taskType.value === null && taskType.fixed ) ||
    !projectRights.some( ( projectRight ) => projectRight.admin )
  )

  const myProjectRights = projectRights.find( p => p.user.id === currentUser.id );
  const isAdmin = myProjectRights !== undefined && myProjectRights.admin;

  let canReadUserIDs = projectRights.map( ( permission ) => permission.user.id );
  let canBeAssigned = toSelArr( usersData.basicUsers, 'email' )
    .filter( ( user ) => canReadUserIDs.includes( user.id ) );

  return (
    <div className="p-20 fit-with-header-and-commandbar scroll-visible">
      <FormGroup>
        <Label for="name">Project name</Label>
        <Input type="text" name="name" id="name" placeholder="Enter project name" value={title} onChange={(e)=>setTitle(e.target.value)} />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="description">Popis</Label>
        <Input type="textarea" className="form-control" id="description" placeholder="Zadajte text" value={description} onChange={(e) => setDescription( e.target.value )}/>
      </FormGroup>

      <Permissions
        addUser={(user)=>{
          let newProjectRights = [...projectRights, {user, read: true, write: false, delete: false, internal: false, admin: false}];
          setProjectRights(newProjectRights);
        }}
        givePermission={(user, right)=>{
          let newProjectRights=[...projectRights];
          let index = projectRights.findIndex((r)=>r.user.id === user.id);
          let item = newProjectRights[index];
          item.read = right.read;
          item.write = right.write;
          item.delete = right.delete;
          item.internal= right.internal;
          item.admin = right.admin;

          if(!item.read){
            newProjectRights.splice(index,1);
            setProjectRights(newProjectRights);
            if (lockedRequester){
              let newAssignedTo = {...assignedTo};
              newAssignedTo.value = newAssignedTo.value.filter(u => u.id !== item.user.id);
              setAssignedTo(newAssignedTo);
            }
          }else{
            setProjectRights(newProjectRights);
          }
        }}
        users={(usersLoading ? [] : toSelArr(usersData.basicUsers, 'email'))}
        permissions={projectRights}
        userID={currentUser.id}
        isAdmin={currentUser.role.accessRights.projects || currentUser.role.accessRights.addProjects || isAdmin}
        lockedRequester={lockedRequester}
        lockRequester={() => setLockedRequester( !lockedRequester) }
        />

      <ProjectDefaultValues
        assignedTo={assignedTo}
        setAssignedTo={setAssignedTo}
        company={company}
        setCompany={setCompany}
        overtime={overtime}
        setOvertime={setOvertime}
        pausal={pausal}
        setPausal={setPausal}
        requester={requester}
        setRequester={setRequester}
        status={status}
        setStatus={setStatus}
        tag={tag}
        setTag={setTag}
        taskType={taskType}
        setTaskType={setTaskType}
        statuses={(statusesLoading ? [] : toSelArr(statusesData.statuses))}
        companies={(companiesLoading ? [] : toSelArr(companiesData.basicCompanies))}
        canBeAssigned={canBeAssigned}
        users={lockedRequester ? (toSelArr(projectRights.map(r => r.user), 'email')) : (usersLoading ? [] : toSelArr(usersData.basicUsers, 'email'))}
        allTags={(allTagsLoading ? [] : toSelArr(allTagsData.tags))}
        taskTypes={(taskTypesLoading ? [] : toSelArr(taskTypesData.taskTypes))}
        />

      { (( company.value === null && company.fixed) || ( status.value === null && status.fixed) || ( assignedTo.value.length === 0 && assignedTo.fixed) || ( taskType.value === null && taskType.fixed)) &&
        <div className="red" style={{color:'red'}}>
          Status, assigned to, task type and company can't be empty if they are fixed!
        </div>
      }

      <div className="row">
        {
          closeModal &&
          <Button className="btn-link" onClick={() => closeModal(null, null)}>
            Close
          </Button>
        }
        <Button className="btn-red m-l-5" disabled={saving || theOnlyOneLeft} onClick={() => setDeleteOpen(true)}>
          Delete
        </Button>
        <Button
          className="btn ml-auto"
          disabled={cannotSave}
          onClick={updateProjectFunc}>
          {(saving?'Saving...':'Save project')}
        </Button>
        </div>
        <DeleteReplacement
          isOpen={deleteOpen}
          label="project"
          options={filteredProjects}
          close={()=>setDeleteOpen(false)}
          finishDelete={deleteProjectFunc}
          />
      </div>
  );
}