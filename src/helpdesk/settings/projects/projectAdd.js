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
import classnames from 'classnames';
import Permissions from "./projectPermissions";
import ProjectDefaultValues from "./defaultValues";
import Loading from 'components/loading';
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
  ADD_PROJECT,
  GET_MY_DATA
} from './querries';

export default function ProjectAdd( props ) {
  //data & queries
  const {
    history,
    closeModal
  } = props;
  const {
    data: myData,
    loading: myDataLoading
  } = useQuery( GET_MY_DATA );
  const [ addProject, {
    client
  } ] = useMutation( ADD_PROJECT );
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

  //events
  React.useEffect( () => {
    if ( !myDataLoading && !usersLoading ) {
      const CurrentUser = toSelArr( usersData.basicUsers, 'email' )
        .find( ( user ) => user.id === currentUser.id );
      setProjectRights( [ {
        user: CurrentUser,
        read: true,
        write: true,
        delete: true,
        internal: true,
        admin: true
      } ] );
    }
  }, [ myDataLoading, usersLoading ] );


  //functions
  const addProjectFunc = () => {
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

    addProject( {
        variables: {
          title,
          description,
          lockedRequester,
          projectRights: newProjectRights,
          def: newDef,
        }
      } )
      .then( ( response ) => {
        const newProject = {
          ...response.data.addProject,
          __typename: "Project"
        };
        if ( closeModal ) {
          const myRights = newProjectRights.find( ( projectRight ) => projectRight.UserId === currentUser.id );
          if ( myRights ) {
            const allProjects = client.readQuery( {
                query: GET_MY_PROJECTS
              } )
              .myProjects;
            client.writeQuery( {
              query: GET_MY_PROJECTS,
              data: {
                myProjects: [ ...allProjects, newProject ]
              }
            } );
            closeModal( newProject, myRights );
          } else {
            closeModal( null, null );
          }
        } else {
          const allProjects = client.readQuery( {
              query: GET_PROJECTS
            } )
            .projects;
          client.writeQuery( {
            query: GET_PROJECTS,
            data: {
              projects: [ ...allProjects, newProject ]
            }
          } );
          history.push( '/helpdesk/settings/projects/' + newProject.id );
        }
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );
    setSaving( false );
  }
  const cannotSave = (
    saving ||
    title === "" ||
    ( company.value === null && company.fixed ) ||
    ( status.value === null && status.fixed ) ||
    ( assignedTo.value.length === 0 && assignedTo.fixed ) ||
    ( taskType.value === null && taskType.fixed ) ||
    !projectRights.some( ( projectRight ) => projectRight.admin )
  )
  if (
    statusesLoading ||
    companiesLoading ||
    usersLoading ||
    allTagsLoading ||
    taskTypesLoading ||
    myDataLoading
  ) {
    return <Loading />
  }

  let canReadUserIDs = projectRights.map( ( permission ) => permission.user.id );
  let canBeAssigned = toSelArr( usersData.basicUsers, 'email' )
    .filter( ( user ) => canReadUserIDs.includes( user.id ) );

  return (
    <div
      className={ classnames(
        {
          "scroll-visible": !closeModal,
          "fit-with-header-and-commandbar": !closeModal
        },
        "p-20"
      )}
      >
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
					isAdmin={currentUser.role.accessRights.projects || currentUser.role.accessRights.addProjects}
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
        users={lockedRequester ? (projectRights.map(r => r.user)) : (usersLoading ? [] : toSelArr(usersData.basicUsers, 'email'))}
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
          <Button className="btn-link" onClick={() => closeModal(null, null)}> Cancel </Button>
        }

        <Button className="btn ml-auto"
          disabled={cannotSave}
          onClick={addProjectFunc}
          >
          {saving?'Adding...':'Add project'}
        </Button>
      </div>
    </div>
  );
}