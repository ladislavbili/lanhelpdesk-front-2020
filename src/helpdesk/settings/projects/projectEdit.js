import React from 'react';
import {
  useMutation,
  useQuery
} from "@apollo/client";

import {
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import {
  toSelArr,
  deleteAttributes
} from 'helperFunctions';
import {
  fetchNetOptions
} from "configs/constants/apollo";
import {
  defList,
  defBool,
  defItem,
  allACLs,
  backendCleanRights,
  noDef,
} from 'configs/constants/projects';
import classnames from 'classnames';
import Checkbox from 'components/checkbox';

import ProjectDefaultValues from "./components/defaultValues";
import Tags from './components/tags';
import Statuses from './components/statuses';
import UserGroups from "./components/userGroups";
import Groups from './components/group/groupAdd';
import ProjectAcl from "./components/acl";
import DeleteReplacement from 'components/deleteReplacement';
import CustomAttributes from "./components/customAttributes";
import Loading from 'components/loading';
import ACLErrors from './components/aclErrors';
import {
  setProject,
} from 'apollo/localSchema/actions';
import {
  remapRightsToBackend,
  remapRightsFromBackend
} from './helpers';

import {
  GET_BASIC_COMPANIES,
} from '../companies/queries';
import {
  GET_BASIC_USERS,
} from '../users/queries';
import {
  GET_TASK_TYPES,
} from '../taskTypes/queries';
import {
  GET_PROJECTS,
  GET_MY_PROJECTS,
  GET_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  GET_MY_DATA,
  GET_NUMBER_OF_TASKS,
} from './queries';
let fakeID = -1;

export default function ProjectEdit( props ) {
  //data & queries
  const {
    history,
    match,
    closeModal,
    projectDeleted,
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
    data: companiesData,
    loading: companiesLoading
  } = useQuery( GET_BASIC_COMPANIES, fetchNetOptions );
  const {
    data: usersData,
    loading: usersLoading
  } = useQuery( GET_BASIC_USERS, fetchNetOptions );
  const {
    data: taskTypesData,
    loading: taskTypesLoading
  } = useQuery( GET_TASK_TYPES, fetchNetOptions );
  const {
    data: numberOfTasksData,
    loading: numberOfTasksLoading,
    error: numberOfTasksError,
  } = useQuery( GET_NUMBER_OF_TASKS, {
    variables: {
      projectId: id
    }
  } );

  let allProjects = [];
  if ( closeModal ) {
    allProjects = toSelArr( client.readQuery( {
        query: GET_MY_PROJECTS
      } )
      .myProjects.map( ( projectData ) => projectData.project ) );

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
  const [ autoApproved, setAutoApproved ] = React.useState( true );
  const [ groups, setGroups ] = React.useState( [] );
  const [ userGroups, setUserGroups ] = React.useState( [] );
  const [ addTags, setAddTags ] = React.useState( [] );
  const [ updateTags, setUpdateTags ] = React.useState( [] );
  const [ deleteTags, setDeleteTags ] = React.useState( [] );

  const [ assignedTo, setAssignedTo ] = React.useState( defList( noDef.assignedTo.required ) );
  const [ company, setCompany ] = React.useState( defItem( noDef.company.required ) );
  const [ overtime, setOvertime ] = React.useState( defBool( noDef.overtime.required ) );
  const [ pausal, setPausal ] = React.useState( defBool( noDef.pausal.required ) );
  const [ requester, setRequester ] = React.useState( defItem( noDef.requester.required ) );
  const [ type, setType ] = React.useState( defItem( noDef.type.required ) );
  const [ status, setStatus ] = React.useState( defItem( noDef.status.required ) );
  const [ defTag, setDefTag ] = React.useState( defList( noDef.tag.required ) );

  const [ addStatuses, setAddStatuses ] = React.useState( [] );
  const [ updateStatuses, setUpdateStatuses ] = React.useState( [] );
  const [ deleteStatuses, setDeleteStatuses ] = React.useState( [] );

  const [ customAttributes, setCustomAttributes ] = React.useState( [] );

  const [ saving, setSaving ] = React.useState( false );
  const [ addTaskErrors, setAddTaskErrors ] = React.useState( false );
  const [ deleteOpen, setDeleteOpen ] = React.useState( false );

  const [ dataChanged, setDataChanged ] = React.useState( false );

  // sync
  React.useEffect( () => {
    if ( !projectLoading && !usersLoading && !companiesLoading && !taskTypesLoading ) {

      //PROJECT
      const project = projectData.project;
      setTitle( project.title );
      setDescription( project.description );
      setLockedRequester( project.lockedRequester );
      setAutoApproved( project.autoApproved );

      //STATUS
      let newStatus = {
        def: true,
        fixed: project.def.status.fixed,
        required: true,
        value: ( project.def.status.value ? project.statuses.find( c => c.id === project.def.status.value.id ) : null )
      };
      setStatus( newStatus );
      setDataChanged( false );

      let newOvertime = {
        def: true,
        fixed: project.def.overtime.fixed,
        required: true,
        value: ( project.def.overtime.value ? {
          value: true,
          label: 'Yes'
        } : {
          value: false,
          label: 'No'
        } )
      };
      setOvertime( newOvertime );

      let newPausal = {
        def: true,
        fixed: project.def.pausal.fixed,
        required: true,
        value: ( project.def.pausal.value ? {
          value: true,
          label: 'Yes'
        } : {
          value: false,
          label: 'No'
        } )
      };
      setPausal( newPausal );

      //TAGS
      let tags = toSelArr( getAllTags() );
      let tagIds = project.def.tag.value.map( v => v.id );
      let newValue = tags.filter( t => tagIds.includes( t.id ) );
      let newDefTag = {
        def: project.def.tag.def || project.def.tag.required,
        fixed: project.def.tag.fixed,
        required: project.def.tag.required,
        value: newValue
      };
      setDefTag( newDefTag );
      setDataChanged( false );

      //USERS
      let users = toSelArr( usersData.basicUsers, 'email' );
      let newAssignedTo = {
        def: true,
        fixed: project.def.assignedTo.fixed,
        required: true,
        value: project.def.assignedTo.value.map( user => users.find( u => u.id === user.id ) )
      };
      setAssignedTo( newAssignedTo );
      let newRequester = {
        def: project.def.requester.def || project.def.requester.required,
        fixed: project.def.requester.fixed,
        required: project.def.requester.required,
        value: ( project.def.requester.value ? users.find( u => u.id === project.def.requester.value.id ) : null )
      };
      setRequester( newRequester );
      const {
        groups,
        userGroups
      } = getDefaultGroupData();
      setGroups( groups );
      setUserGroups( userGroups );
      setDataChanged( false );

      //COMPANY
      let companies = toSelArr( companiesData.basicCompanies );
      let newCompany = {
        def: true,
        fixed: project.def.company.fixed,
        required: true,
        value: ( project.def.company.value ? companies.find( c => c.id === project.def.company.value.id ) : null )
      };
      setCompany( newCompany );

      //TASK TYPE
      let taskTypes = toSelArr( taskTypesData.taskTypes );
      let newType = {
        def: project.def.type.def || project.def.type.required,
        fixed: project.def.type.fixed,
        required: project.def.type.required,
        value: ( project.def.type.value ? taskTypes.find( type => type.id === project.def.type.value.id ) : null )
      };
      setType( newType );

      if ( ![
        !project.def.type.required || project.def.type.def,
        !project.def.tag.required || project.def.tag.def,
        !project.def.requester.required || project.def.requester.def,
        [
          project.def.status.required,
          project.def.status.def,
          project.def.assignedTo.required,
          project.def.assignedTo.def,
          project.def.company.required,
          project.def.company.def,
          project.def.pausal.required,
          project.def.pausal.def,
          project.def.overtime.required,
          project.def.overtime.def,
        ].every( ( bool ) => bool )
      ].every( ( bool ) => bool ) ) {
        setDataChanged( true );
      }
    }
  }, [ projectLoading, usersLoading, companiesLoading, taskTypesLoading ] );

  React.useEffect( () => {
    setAddTags( [] );
    setUpdateTags( [] );
    setDeleteTags( [] );
    refetch( {
      variables: {
        id
      }
    } );
    setDataChanged( false );
  }, [ id ] );

  // functions
  const getAllTags = () => {
    let allTags = projectData.project.tags.filter( ( tag ) => !deleteTags.includes( tag.id ) );
    updateTags.map( ( tagChange ) => {
      let index = allTags.findIndex( ( tag ) => tag.id === tagChange.id );
      if ( index !== -1 ) {
        allTags[ index ] = {
          ...allTags[ index ],
          ...tagChange
        };
      }
    } );
    return allTags.concat( addTags );
  }

  const getAllStatuses = () => {
    let allStatuses = projectData.project.statuses.filter( ( status ) => !deleteStatuses.includes( status.id ) );
    updateStatuses.map( ( statusChange ) => {
      let index = allStatuses.findIndex( ( status ) => status.id === statusChange.id );
      if ( index !== -1 ) {
        allStatuses[ index ] = {
          ...allStatuses[ index ],
          ...statusChange
        };
      }
    } );
    return allStatuses.concat( addStatuses );
  }

  const getDefaultGroupData = () => {
    const project = projectData.project;
    const users = toSelArr( usersData.basicUsers, 'email' );
    const groups = toSelArr( project.groups.map( ( group ) => remapRightsFromBackend( group ) ) );
    const userGroups = project.groups.reduce( ( acc, cur ) => {
      let group = groups.find( ( group ) => group.id === cur.id );
      let userGroups = cur.users.map( ( user1 ) => ( {
        user: users.find( ( user2 ) => user2.id === user1.id ),
        group,
      } ) )
      return [ ...acc, ...userGroups ]
    }, [] )
    return {
      groups,
      userGroups
    }
  }

  const filterGroupChanges = () => {
    const {
      groups: originalGroups,
      userGroups: originalUserGroups
    } = getDefaultGroupData();
    const addGroups = groups.filter( ( group ) => group.id < 0 )
      .map( ( group ) => remapRightsToBackend( group ) );
    const updateGroups = groups.filter( ( group ) => group.id > -1 )
      .filter( ( group ) => {
        const originalGroup = originalGroups.find( ( orGroup ) => orGroup.id === group.id );
        const rights = group.rights;
        const originalRights = originalGroup.rights;
        return (
          group.title !== originalGroup.title ||
          group.order !== originalGroup.order ||
          (
            allACLs.filter( ( acl ) => !acl.separator )
            .some( ( acl ) => {
              if ( acl.both ) {
                return ( rights[ acl.id ].read !== originalRights[ acl.id ].read || rights[ acl.id ].write !== originalRights[ acl.id ].write )
              } else {
                return rights[ acl.id ] !== originalRights[ acl.id ];
              }
            } )
          )
        )
      } )
      .map( ( group ) => remapRightsToBackend( group ) );
    const deleteGroups = originalGroups.filter( ( orGroup ) => !groups.some( ( group ) => group.id === orGroup.id ) )
      .map( ( group ) => group.id );
    return {
      addGroups,
      updateGroups,
      deleteGroups
    }
  }

  const compactUserGroups = () => {
    let compactUserGroups = [];
    userGroups.forEach( ( userGroup ) => {
      const index = compactUserGroups.findIndex( ( compactUserGroup ) => compactUserGroup.groupId === userGroup.group.id );
      if ( index === -1 ) {
        compactUserGroups.push( {
          groupId: userGroup.group.id,
          userIds: [ userGroup.user.id ]
        } );
      } else {
        compactUserGroups[ index ].userIds.push( userGroup.user.id );
      }
    } )
    groups.filter( ( group ) => group.id > -1 )
      .forEach( ( group ) => {
        if ( !compactUserGroups.some( ( userGroup ) => userGroup.groupId === group.id ) ) {
          compactUserGroups.push( {
            groupId: group.id,
            userIds: []
          } );
        }
      } )
    return compactUserGroups;
  }

  const updateProjectFunc = () => {
    setSaving( true );

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
      type: {
        ...type,
        value: ( type.value ? type.value.id : null )
      },
      status: {
        ...status,
        value: ( status.value ? status.value.id : null )
      },
      tag: {
        ...defTag,
        value: defTag.value.map( u => u.id )
      },
    }
    updateProject( {
        variables: {
          id,
          title,
          description,
          lockedRequester,
          autoApproved,
          def: newDef,
          addTags,
          updateTags,
          deleteTags,
          deleteStatuses,
          updateStatuses,
          addStatuses,
          ...filterGroupChanges(),
          userGroups: compactUserGroups(),
        }
      } )
      .then( ( response ) => {
        const updatedProject = {
          ...response.data.updateProject
        };
        setAddTags( [] );
        setUpdateTags( [] );
        setDeleteTags( [] );
        client.writeQuery( {
          query: GET_PROJECT,
          variables: {
            id
          },
          data: {
            project: updatedProject
          },
        } );
        if ( closeModal ) {
          const myUserGroup = userGroups.find( ( userGroup ) => userGroup.user.id === currentUser.id );
          const myRights = myUserGroup === undefined ? backendCleanRights() : remapRightsToBackend( groups.find( ( group ) => group.id === myUserGroup.group.id ) )
            .rights;
          if ( myUserGroup ) {
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
          let newProjects = [ ...allProjects ]
          newProjects[ newProjects.findIndex( ( project ) => project.id === id ) ] = updatedProject;
          client.writeQuery( {
            query: GET_PROJECTS,
            data: {
              projects: newProjects
            }
          } );

        }
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );

    setSaving( false );
    setDataChanged( false );
  };

  const deleteProjectFunc = ( replacement ) => {
    setDeleteOpen( false );
    if ( window.confirm( "Deleting a project deletes all tasks in the project. Do you still want to delete the project?" ) ) {
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
    companiesLoading ||
    usersLoading ||
    myDataLoading
  ) {
    return <Loading />
  }
  const doesDefHasValue = () => {
    return (
    [
      type,
    ].every( ( defAttr ) => !defAttr.required || defAttr.value !== null ) && [
      defTag,
    ].every( ( defAttr ) => !defAttr.required || defAttr.value.length !== 0 )
    )
  }

  const addTaskIssue = groups.filter( ( group ) => group.rights.addTasks )
    .some( ( group ) => (
      ( !group.rights.taskTitleEdit ) ||
      ( !group.rights.status.write && !status.def ) ||
      ( !group.rights.tags.write && !defTag.def && defTag.required ) ||
      ( !group.rights.assigned.write && !assignedTo.def ) ||
      ( !group.rights.requester.write && !requester.def && requester.required ) ||
      ( !group.rights.type.write && !type.def && type.required ) ||
      ( !group.rights.company.write && !company.def )
    ) )
  const cannotSave = (
    saving ||
    title === "" ||
    !doesDefHasValue() ||
    ( company && company.value === null && company.fixed ) ||
    ( status && status.value === null && status.fixed ) ||
    ( assignedTo && assignedTo.value.length === 0 && assignedTo.fixed ) ||
    addTags.some( ( tag ) => (
      tag.title.length === 0 ||
      !tag.color.includes( '#' ) ||
      isNaN( parseInt( tag.order ) )
    ) ) ||
    updateTags.some( ( tag ) => (
      ( tag.title !== undefined && tag.title.length === 0 ) ||
      ( tag.color !== undefined && !tag.color.includes( '#' ) ) ||
      ( tag.order !== undefined && isNaN( parseInt( tag.order ) ) )
    ) ) ||
    !getAllStatuses()
    .some( ( status ) => status.action === 'IsNew' ) ||
    !getAllStatuses()
    .some( ( status ) => status.action === 'CloseDate' ) ||
    !groups.some( ( group ) => (
      group.rights.projectPrimary.read &&
      group.rights.projectPrimary.write &&
      group.rights.projectSecondary &&
      userGroups.some( ( userGroup ) => userGroup.group.id === group.id )
    ) ) ||
    addTaskIssue
  )
  const myRights = currentUser.role.accessRights.projects ?
    backendCleanRights( true ) :
    projectData.project.groups.find( ( group ) => group.users.some( ( user ) => user.id === currentUser.id ) )
    .rights;
  const allTags = getAllTags();
  const allStatuses = getAllStatuses();

  return (
    <div>
      <div className="dynamic-bg-commandbar a-i-c p-l-20">
        { dataChanged &&
          <div className="message error-message" style={{ minWidth: 220 }}>
            Save changes before leaving!
          </div>
        }
        { !dataChanged &&
          <div className="message success-message" style={{ minWidth: 42 }}>
            Saved
          </div>
        }
      </div>
      <div
        className={ classnames(
          "p-t-10 p-l-20 p-r-20 p-b-20",
          "scroll-visible",
          "fit-with-header-and-commandbar",
        )}
        >

        <h2 className="m-b-20" >
          Edit project
        </h2>

        { myRights.projectPrimaryRead &&
          <div>
            <FormGroup>
              <Label for="name">Project name<span className="warning-big">*</span></Label>
              <Input
                disabled={!myRights.projectPrimaryWrite}
                type="text"
                name="name"
                id="name"
                placeholder="Enter project name"
                value={title}
                onChange={(e)=>{
                  setTitle(e.target.value);
                  setDataChanged( true );
                }}
                />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="description">Popis</Label>
              <Input
                disabled={!myRights.projectPrimaryWrite}
                type="textarea"
                className="form-control"
                id="description"
                placeholder="Zadajte text"
                value={description}
                onChange={(e) => {
                  setDescription( e.target.value );
                  setDataChanged( true );
                }}
                />
            </FormGroup>
          </div>
        }
        { myRights.projectSecondary &&
          <div>
            <div className="row">
              <Checkbox
                className = "m-l-5 m-r-5"
                centerHor
                disabled={false}
                value = { autoApproved}
                onChange={() => setAutoApproved( !autoApproved) }
                />
              <span className="clickable" onClick = { () => setAutoApproved( !autoApproved) }>
                All subtasks, work trips, materials and custom items are automatically approved.
              </span>
            </div>
            <Statuses
              statuses={allStatuses}
              addStatus={(newStatus) => {
                setAddStatuses([ ...addStatuses, {...newStatus, id: fakeID -- } ]);
                setDataChanged( true );
              }}
              deleteStatus={(id) => {
                if(id > -1){
                  setUpdateStatuses(updateStatuses.filter((status) => status.id !== id ));
                  setDeleteStatuses([ ...deleteStatuses, id ]);
                }else{
                  setAddStatuses(addStatuses.filter((status) => status.id !== id ));
                }
                setDataChanged( true );
              }}
              updateStatus={(newStatus) => {
                if(newStatus.id > -1){
                  let newStatuses = [...updateStatuses];
                  let index = newStatuses.findIndex((status) => status.id === newStatus.id );
                  if(index === -1){
                    newStatuses = newStatuses.concat(newStatus);
                  }else{
                    newStatuses[index] = { ...newStatuses[index], ...newStatus }
                  }
                  setUpdateStatuses(newStatuses);
                }else{
                  let newStatuses = [...addStatuses];
                  let index = newStatuses.findIndex((status) => status.id === newStatus.id );
                  newStatuses[index] = { ...newStatuses[index], ...newStatus }
                  setAddStatuses(newStatuses);
                }
                setDataChanged( true );
              }}
              />

            <Tags
              tags={allTags}
              addTag={(newTag) => {
                setAddTags([ ...addTags, {...newTag, id: fakeID -- } ]);
                setDataChanged( true );
              }}
              deleteTag={(id) => {
                if(id > -1){
                  setUpdateTags(updateTags.filter((tag) => tag.id !== id ));
                  setDeleteTags([ ...deleteTags, id ]);
                }else{
                  setAddTags(addTags.filter((tag) => tag.id !== id ));
                }
                setDataChanged( true );
              }}
              updateTag={(newTag) => {
                if(newTag.id > -1){
                  let newTags = [...updateTags];
                  let index = newTags.findIndex((tag) => tag.id === newTag.id );
                  if(index === -1){
                    newTags = newTags.concat(newTag);
                  }else{
                    newTags[index] = { ...newTags[index], ...newTag }
                  }
                  setUpdateTags(newTags);
                }else{
                  let newTags = [...addTags];
                  let index = newTags.findIndex((tag) => tag.id === newTag.id );
                  newTags[index] = { ...newTags[index], ...newTag }
                  setAddTags(newTags);
                }
                setDataChanged( true );
              }}
              />

            <div className="row">
              <Checkbox
                className = "m-l-5 m-r-5"
                centerHor
                disabled={false}
                value = { lockedRequester}
                onChange={() => {
                  setLockedRequester( !lockedRequester);
                  setDataChanged( true );
                }}
                />
              <span className="clickable" onClick = { () => {
                  setLockedRequester( !lockedRequester);
                  setDataChanged( true );
                } }>
                A requester can be only a user with rights to this project.
              </span>
            </div>

            <Groups
              addGroup={(newGroup) => {
                setGroups([...groups, newGroup]);
                setDataChanged( true );
              }}
              />

            <UserGroups
              addRight={ (userGroup) => {
                setUserGroups([...userGroups, userGroup]);
                setDataChanged( true );
              }}
              deleteRight={ (userGroup) => {
                setUserGroups(userGroups.filter((oldGroup) => oldGroup.user.id !== userGroup.user.id ));
                setDataChanged( true );
              }}
              updateRight={ (userGroup) => {
                let newUserGroups = [...userGroups];
                let index = newUserGroups.findIndex((userG) => userG.user.id === userGroup.user.id );
                newUserGroups[index] = { ...newUserGroups[index], ...userGroup }
                setUserGroups(newUserGroups);
                setDataChanged( true );
              }}
              users={(usersLoading ? [] : toSelArr(usersData.basicUsers, 'email'))}
              permissions={ userGroups }
              isAdmin={ true }
              groups={ toSelArr(groups) }
              />

            <ProjectAcl
              groups={ groups }
              updateGroupRight={ (groupID, acl, newVal) => {
                let newGroups = [...groups];
                let index = newGroups.findIndex((group) => group.id === groupID );
                newGroups[index]['rights'][acl] = newVal;
                setGroups(newGroups);
                setDataChanged( true );
              }}
              updateGroup={(newGroup) => {
                let newGroups = [...groups];
                let index = newGroups.findIndex((group) => group.id === newGroup.id );
                newGroups[index] = { ...newGroups[index], ...newGroup }
                setGroups(newGroups);
                setUserGroups(userGroups.map((userGroup) => (
                  (userGroup.group.id !== newGroup.id) ?
                  userGroup :
                  ({...userGroup, group: {...userGroup.group,...newGroup}})
                ) ));
                setDataChanged( true );
              }}
              deleteGroup={(id) => {
                setGroups( groups.filter((group) => group.id !== id ) );
                setUserGroups( userGroups.filter((userGroup) => userGroup.group.id !== id ) );
                setDataChanged( true );
              }}
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
              type={type}
              setType={setType}
              status={status}
              setStatus={setStatus}
              tag={defTag}
              setTag={setDefTag}
              statuses={toSelArr(allStatuses)}
              companies={(companiesLoading ? [] : toSelArr(companiesData.basicCompanies))}
              users={
                lockedRequester ?
                userGroups.map( (userGroup) => userGroup.user ) :
                (usersLoading ? [] : toSelArr(usersData.basicUsers, 'email'))
              }
              assignableUsers={userGroups.map( (userGroup) => userGroup.user )}
              allTags={toSelArr(allTags)}
              taskTypes={(taskTypesLoading ? [] : toSelArr(taskTypesData.taskTypes))}
              />

            { (( company.value === null && company.fixed) || ( status.value === null && status.fixed) || ( assignedTo.value.length === 0 && assignedTo.fixed)) &&
              <div className="red" style={{color:'red'}}>
                Status, assigned to and company can't be empty if they are fixed!
              </div>
            }

            <CustomAttributes
              disabled={false}
              customAttributes={customAttributes}
              addCustomAttribute={(newCustomAttribute) => {
                setCustomAttributes([...customAttributes, {...newCustomAttribute, id: fakeID-- }]);
                setDataChanged( true );
              }}
              updateCustomAttribute={(changedCustomAttribute) => {
                let newCustomAttributes = [...customAttributes];
                let index = newCustomAttributes.findIndex((attribute) => attribute.id === changedCustomAttribute.id);
                newCustomAttributes[index] = {...newCustomAttributes[index],...changedCustomAttribute};
                setCustomAttributes(newCustomAttributes);
                setDataChanged( true );
              }}
              deleteCustomAttribute={(id) => {
                setCustomAttributes(customAttributes.filter((customAttribute) => customAttribute.id !== id ));
                setDataChanged( true );
              }}
              />
          </div>
        }
        { addTaskErrors && addTaskIssue &&
          <ACLErrors
            {
              ...{
                groups,
                status,
                defTag,
                assignedTo,
                requester,
                type,
                company
              }
            }
            />
        }
        <div className="form-buttons-row">
          {
            closeModal &&
            <button className="btn-link" onClick={() => closeModal(null, null)}>
              Close
            </button>
          }
          { myRights.projectPrimaryWrite &&
            <button className="btn-red" disabled={saving || theOnlyOneLeft} onClick={() => setDeleteOpen(true)}>
              Delete
            </button>
          }
          { !numberOfTasksLoading && !numberOfTasksError &&
            <div className="ml-auto center-hor p-r-5">
              { `This project includes ${numberOfTasksData.getNumberOfTasks} tasks.` }
            </div>
          }

          { (myRights.projectPrimaryWrite || myRights.projectSecondary) &&
            <button
              className={classnames(
                {
                  'ml-auto': false,
                }
                ,"btn"
              )}
              disabled={addTaskErrors && cannotSave}
              onClick={() => {
                if(cannotSave){
                  setAddTaskErrors(true);
                  return;
                }else{
                  updateProjectFunc();
                }
              }}
              >
              {(saving?'Saving...':'Save project')}
            </button>
          }
        </div>
        <DeleteReplacement
          isOpen={deleteOpen}
          label="project"
          options={filteredProjects}
          close={()=>setDeleteOpen(false)}
          finishDelete={deleteProjectFunc}
          />
      </div>
    </div>
  );
}