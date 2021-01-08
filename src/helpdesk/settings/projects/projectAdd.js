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
import Loading from 'components/loading';
import Checkbox from 'components/checkbox';
import Permissions from "./components/projectPermissions";
import CustomAttributes from "./components/customAttributes";
import Tags from './components/tags';
import Statuses from './components/statuses';
import Groups from './components/groups';
import ProjectAcl from './components/acl';
import ProjectDefaultValues from "./components/defaultValues";
import {
  GET_BASIC_COMPANIES,
} from '../companies/querries';
import {
  GET_BASIC_USERS,
} from '../users/querries';
import {
  GET_STATUSES,
} from '../templateStatuses/querries';
import {
  GET_TASK_TYPES,
} from '../taskTypes/querries';
import {
  GET_PROJECTS,
  GET_MY_PROJECTS,
  ADD_PROJECT,
  GET_MY_DATA
} from './querries';
import {
  createRandomRights
} from './components/aclData';

let fakeID = -1;
let defaultGroups = [];
[ 'Admin', 'Manager', 'Agent', 'Customer' ].map( ( name, index ) => {
  defaultGroups.push( {
    title: name,
    id: fakeID--,
    order: index,
    rights: createRandomRights()
  } )
} )

const defaultStatuses = [
  {
    action: {
      label: "None (nothing happens when status is selected)",
      value: "None"
    },
    color: "#4a90e2",
    icon: "fa fa-play",
    id: 2,
    order: 1,
    title: "New"
  },
  {
    action: {
      label: "None (nothing happens when status is selected)",
      value: "None"
    },
    color: "#7ed321",
    icon: "fa fa-play",
    id: 3,
    order: 2,
    title: "Open"
  },
  {
    action: {
      label: "None (nothing happens when status is selected)",
      value: "None"
    },
    color: "#f6a525",
    icon: "fa fa-play",
    id: 4,
    order: 3,
    title: "Pending"
  },
  {
    action: {
      label: "None (nothing happens when status is selected)",
      value: "None"
    },
    color: "#9b9b9b",
    icon: "fa fa-play",
    id: 5,
    order: 4,
    title: "Closed"
  },
];

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
  const [ defTag, setDefTag ] = React.useState( defList );
  const [ taskType, setTaskType ] = React.useState( defItem );
  const [ tags, setTags ] = React.useState( [] );
  const [ customAttributes, setCustomAttributes ] = React.useState( [] );

  const [ saving, setSaving ] = React.useState( false );

  const [ statuses, setStatuses ] = React.useState( defaultStatuses );
  const [ groups, setGroups ] = React.useState( defaultGroups );
  //events

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
        ...defTag,
        value: defTag.value.map( u => u.id )
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
          tags
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
    !projectRights.some( ( projectRight ) => projectRight.admin ) ||
    tags.some( ( tag ) => (
      tag.title.length === 0 ||
      !tag.color.includes( '#' ) ||
      isNaN( parseInt( tag.order ) )
    ) )
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

      <h4 className="m-t-20 m-b-20"> ACL </h4>
      <div className="row">
        <Checkbox
          className = "m-l-5 m-r-5"
          centerHor
          disabled={false}
          value = { lockedRequester}
          onChange={() => setLockedRequester( !lockedRequester) }
          />
        A requester can be only a user with rights to this project.
      </div>

      <Permissions
        addRight={ (newRight) => {
          setProjectRights([...projectRights, newRight]);
        }}
        deleteRight={ (right) => {
          setProjectRights(projectRights.filter((oldRight) => oldRight.user.id !== right.user.id ));
        }}
        updateRight={ (newRight) => {
          let newProjectRights = [...projectRights];
          let index = newProjectRights.findIndex((right) => right.user.id === newRight.user.id );
          newProjectRights[index] = { ...newProjectRights[index], ...newRight }
          setProjectRights(newProjectRights);
        }}
        users={(usersLoading ? [] : toSelArr(usersData.basicUsers, 'email'))}
        permissions={ projectRights }
        isAdmin={ true }
        groups={ toSelArr(groups) }
        />

      <Groups
        addGroup={(newGroup) => {
          console.log(newGroup);
          setGroups([...groups, newGroup])
        }}
        />

      <ProjectAcl
        groups={ groups }
        updateGroupRight={ (groupID, acl, newVal) => {
          let newGroups = [...groups];
          let index = newGroups.findIndex((group) => group.id === groupID );
          newGroups[index]['rights'][acl] = newVal;
          setGroups(newGroups);

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
        status={status}
        setStatus={setStatus}
        tag={defTag}
        setTag={setDefTag}
        taskType={taskType}
        setTaskType={setTaskType}
        statuses={[]}
        companies={(companiesLoading ? [] : toSelArr(companiesData.basicCompanies))}
        canBeAssigned={canBeAssigned}
        users={lockedRequester ? (projectRights.map(r => r.user)) : (usersLoading ? [] : toSelArr(usersData.basicUsers, 'email'))}
        allTags={toSelArr(tags)}
        taskTypes={(taskTypesLoading ? [] : toSelArr(taskTypesData.taskTypes))}
        />

      { (( company.value === null && company.fixed) || ( status.value === null && status.fixed) || ( assignedTo.value.length === 0 && assignedTo.fixed) || ( taskType.value === null && taskType.fixed)) &&
        <div className="red" style={{color:'red'}}>
          Status, assigned to, task type and company can't be empty if they are fixed!
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

      <div className="row">
        {
          closeModal &&
          <Button className="btn-link" onClick={() => closeModal(null, null)}> Cancel </Button>
        }

        <Button className="btn ml-auto"
          disabled={cannotSave || true}
          onClick={addProjectFunc}
          >
          {saving?'Adding...':'Add project'}
        </Button>
      </div>
    </div>
  );
}