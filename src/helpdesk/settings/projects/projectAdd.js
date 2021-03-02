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
  toSelArr
} from 'helperFunctions';
import {
  fetchNetOptions
} from "configs/constants/apollo";
import {
  defList,
  defBool,
  defItem,
  defaultGroups,
  noDef
} from 'configs/constants/projects';
import classnames from 'classnames';
import Loading from 'components/loading';
import Checkbox from 'components/checkbox';

import UserGroups from "./components/userGroups";
import CustomAttributes from "./components/customAttributes";
import Tags from './components/tags';
import Statuses from './components/statuses';
import Groups from './components/group/groupAdd';
import ProjectDefaultValues from "./components/defaultValues";
import ProjectAcl from "./components/acl";
import ACLErrors from './components/aclErrors';

import {
  remapRightsToBackend
} from './helpers';

import {
  GET_BASIC_COMPANIES,
} from '../companies/queries';
import {
  GET_BASIC_USERS,
} from '../users/queries';
import {
  GET_STATUS_TEMPLATES,
} from '../templateStatuses/queries';
import {
  GET_TASK_TYPES,
} from '../taskTypes/queries';
import {
  GET_PROJECTS,
  GET_MY_PROJECTS,
  ADD_PROJECT,
  GET_MY_DATA
} from './queries';

let fakeID = -1;

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
  } = useQuery( GET_STATUS_TEMPLATES, fetchNetOptions );
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
    refetch: refetchMyProjects,
  } = useQuery( GET_MY_PROJECTS );

  const currentUser = myData ? myData.getMyData : {};

  //state
  const [ title, setTitle ] = React.useState( "" );
  const [ description, setDescription ] = React.useState( "" );
  const [ lockedRequester, setLockedRequester ] = React.useState( true );
  const [ autoApproved, setAutoApproved ] = React.useState( true );
  const [ groups, setGroups ] = React.useState( defaultGroups );
  const [ userGroups, setUserGroups ] = React.useState( [] );

  const [ assignedTo, setAssignedTo ] = React.useState( defList );
  const [ company, setCompany ] = React.useState( defItem );
  const [ overtime, setOvertime ] = React.useState( defBool );
  const [ pausal, setPausal ] = React.useState( defBool );
  const [ requester, setRequester ] = React.useState( defItem );
  const [ type, setType ] = React.useState( {
    ...defItem,
    required: false
  } );
  const [ status, setStatus ] = React.useState( defItem );
  const [ defTag, setDefTag ] = React.useState( {
    ...defList,
    required: noDef.tag.required
  } );
  const [ taskType, setTaskType ] = React.useState( defItem );
  const [ tags, setTags ] = React.useState( [] );
  const [ customAttributes, setCustomAttributes ] = React.useState( [] );

  const [ saving, setSaving ] = React.useState( false );
  const [ addTaskErrors, setAddTaskErrors ] = React.useState( false );
  const [ statuses, setStatuses ] = React.useState( [] );

  //events
  React.useEffect( () => {
    if ( !statusesLoading ) {
      setStatuses( statusesData.statusTemplates.map( ( statusTemplate ) => ( {
        id: fakeID--,
        title: statusTemplate.title,
        color: statusTemplate.color,
        icon: statusTemplate.icon,
        action: statusTemplate.action,
        order: statusTemplate.order,
      } ) ) )
    }
  }, [ statusesLoading ] );

  React.useEffect( () => {
    if ( !myDataLoading && !usersLoading ) {
      setUserGroups( [ {
        group: toSelArr( groups )
          .find( ( group ) => group.order === 0 ),
        user: toSelArr( usersData.basicUsers, 'email' )
          .find( ( user ) => user.id === myData.getMyData.id )
      } ] )
    }
  }, [ myDataLoading, usersLoading ] );

  //functions
  const addProjectFunc = () => {
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
    let newGroups = groups.map( ( group ) => remapRightsToBackend( group ) )
    let newUserGroups = userGroups.map( ( userGroup ) => ( {
      userId: userGroup.user.id,
      groupId: userGroup.group.id
    } ) );

    addProject( {
        variables: {
          title,
          description,
          lockedRequester,
          autoApproved,
          def: newDef,
          groups: newGroups,
          userGroups: newUserGroups,
          tags,
          statuses
        }
      } )
      .then( ( response ) => {
        const newProject = {
          ...response.data.addProject,
          __typename: "Project"
        };
        if ( closeModal ) {
          const myUserGroup = userGroups.find( ( userGroup ) => userGroup.user.id === currentUser.id );
          const myRights = myUserGroup === undefined ? createCleanRights() : remapRightsToBackend( groups.find( ( group ) => group.id === myUserGroup.group.id ) )
            .rights;
          if ( myUserGroup ) {
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
          refetchMyProjects();
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
    currentUser &&
    ( company.value === null && company.fixed ) ||
    ( status.value === null && status.fixed ) ||
    ( assignedTo.value.length === 0 && assignedTo.fixed ) ||
    !groups.some( ( group ) => (
      group.rights.projectPrimary.read &&
      group.rights.projectPrimary.write &&
      group.rights.projectSecondary &&
      userGroups.some( ( userGroup ) => userGroup.group.id === group.id )
    ) ) ||
    tags.some( ( tag ) => (
      tag.title.length === 0 ||
      !tag.color.includes( '#' ) ||
      isNaN( parseInt( tag.order ) )
    ) ) ||
    !statuses.some( ( status ) => status.action === 'IsNew' ) ||
    !statuses.some( ( status ) => status.action === 'CloseDate' ) ||
    addTaskIssue

  )
  if (
    statusesLoading ||
    companiesLoading ||
    usersLoading ||
    taskTypesLoading ||
    myDataLoading
  ) {
    return <Loading />
  }

  return (
    <div>
      { !closeModal &&
        <div className="dynamic-bg-commandbar a-i-c p-l-20">
          { cannotSave &&
            <div className="message error-message" style={{ minWidth: 220 }}>
              Fill in all the required information!
            </div>
          }
        </div>
      }


      <div
        className={ classnames(
          {
            "scroll-visible": !closeModal,
            "fit-with-header-and-commandbar": !closeModal,
          },
          "p-t-10 p-l-20 p-r-20 p-b-20",
        )}
        >
        <h2 className="m-b-20" >
          Add project
        </h2>
        <FormGroup>
          <Label for="name">Project name <span className="warning-big">*</span></Label>
          <Input type="text" name="name" id="name" placeholder="Enter project name" value={title} onChange={(e)=>setTitle(e.target.value)} />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Popis</Label>
          <Input type="textarea" className="form-control" id="description" placeholder="Zadajte text" value={description} onChange={(e) => setDescription( e.target.value )}/>
        </FormGroup>

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
          statuses={statuses}
          addStatus={(newStatus) => {
            setStatuses([ ...statuses, {...newStatus, id: fakeID -- } ])
          }}
          deleteStatus={(id) => {
            setStatuses( statuses.filter((tag) => tag.id !== id ) )
          }}
          updateStatus={(newStatus) => {
            let newStatuses = [...statuses];
            let index = newStatuses.findIndex((status) => status.id === newStatus.id );
            newStatuses[index] = { ...newStatuses[index], ...newStatus }
            setStatuses(newStatuses);
          }}
          />

        <Tags
          tags={tags}
          addTag={(newTag) => {
            setTags([ ...tags, {...newTag, id: fakeID -- } ])
          }}
          deleteTag={(id) => {
            setTags( tags.filter((tag) => tag.id !== id ) )
          }}
          updateTag={(newTag) => {
            let newTags = [...tags];
            let index = newTags.findIndex((tag) => tag.id === newTag.id );
            newTags[index] = { ...newTags[index], ...newTag }
            setTags(newTags);
          }}
          />

        <div className="row">
          <Checkbox
            className = "m-l-5 m-r-5"
            centerHor
            disabled={false}
            value = { lockedRequester}
            onChange={() => setLockedRequester( !lockedRequester) }
            />
          <span className="clickable" onClick = { () => setLockedRequester( !lockedRequester) }>
            A requester can be only a user with rights to this project.
          </span>
        </div>

        <Groups
          addGroup={(newGroup) => {
            setGroups([...groups, newGroup])
          }}
          />

        <UserGroups
          addRight={ (userGroup) => {
            setUserGroups([...userGroups, userGroup]);
          }}
          deleteRight={ (userGroup) => {
            setUserGroups(userGroups.filter((oldGroup) => oldGroup.user.id !== userGroup.user.id ));
          }}
          updateRight={ (userGroup) => {
            let newUserGroups = [...userGroups];
            let index = newUserGroups.findIndex((userG) => userG.user.id === userGroup.user.id );
            newUserGroups[index] = { ...newUserGroups[index], ...userGroup }
            setUserGroups(newUserGroups);
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
            ) ))
          }}
          deleteGroup={(id) => {
            setGroups( groups.filter((group) => group.id !== id ) );
            setUserGroups( userGroups.filter((userGroup) => userGroup.group.id !== id ) );
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
          taskType={taskType}
          setTaskType={setTaskType}
          statuses={toSelArr(statuses)}
          companies={(companiesLoading ? [] : toSelArr(companiesData.basicCompanies))}
          users={
            lockedRequester ?
            userGroups.map( (userGroup) => userGroup.user ) :
            (usersLoading ? [] : toSelArr(usersData.basicUsers, 'email'))
          }
          assignableUsers={userGroups.map( (userGroup) => userGroup.user )}
          allTags={toSelArr(tags)}
          taskTypes={(taskTypesLoading ? [] : toSelArr(taskTypesData.taskTypes))}
          />

        { (( company.value === null && company.fixed) || ( status.value === null && status.fixed) || ( assignedTo.value.length === 0 && assignedTo.fixed) ) &&
          <div className="red" style={{color:'red'}}>
            Status, assigned to and company can't be empty if they are fixed!
          </div>
        }


        <CustomAttributes
          disabled={false}
          customAttributes={customAttributes}
          addCustomAttribute={(newCustomAttribute) => {
            setCustomAttributes([...customAttributes, {...newCustomAttribute, id: fakeID-- }]);
          }}
          updateCustomAttribute={(changedCustomAttribute) => {
            let newCustomAttributes = [...customAttributes];
            let index = newCustomAttributes.findIndex((attribute) => attribute.id === changedCustomAttribute.id);
            newCustomAttributes[index] = {...newCustomAttributes[index],...changedCustomAttribute};
            setCustomAttributes(newCustomAttributes);
          }}
          deleteCustomAttribute={(id) => {
            setCustomAttributes(customAttributes.filter((customAttribute) => customAttribute.id !== id ));
          }}
          />
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
        <div className="row form-buttons-row">
          {
            closeModal &&
            <button className="btn-link mr-auto" onClick={() => closeModal(null, null)}> Cancel </button>
          }

          {closeModal && cannotSave &&
            <div className="ml-auto message error-message" style={{ minWidth: 220 }}>
              Fill in all the required information!
            </div>
          }

          <button className={classnames(
              "btn",
              {"ml-auto": !closeModal}
            )}
            disabled={ addTaskErrors && cannotSave }
            onClick={() => {
              if(cannotSave){
                setAddTaskErrors(true);
                return;
              }else{
                addProjectFunc();
              }
            }}
            >
            {saving?'Adding...':'Add project'}
          </button>
        </div>
      </div>
    </div>
  );
}