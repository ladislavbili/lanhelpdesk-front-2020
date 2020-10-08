import React from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { Button, FormGroup, Label,Input } from 'reactstrap';
import {toSelArr} from '../../../helperFunctions';
import Permissions from "../../components/projects/permissions";
import ProjectDefaultValues from "../../components/projects/defaultValues";

import {  GET_PROJECTS } from './index';

export const ADD_PROJECT = gql`
mutation addProject($title: String!, $descrption: String!, $lockedRequester: Boolean!, $projectRights: [ProjectRightInput]!, $def: ProjectDefaultsInput!) {
  addProject(
    title: $title,
    descrption: $descrption,
    lockedRequester: $lockedRequester,
    projectRights: $projectRights,
    def: $def,
  ){
    id
    title
    descrption
    lockedRequester
    projectRights {
			read
			write
			delete
			internal
			admin
			user {
				id
        email
			}
		}
    def {
			assignedTo {
				def
				fixed
				show
				value {
					id
				}
			}
			company {
				def
				fixed
				show
				value {
					id
				}
			}
			overtime {
				def
				fixed
				show
				value
			}
			pausal {
				def
				fixed
				show
				value
			}
			requester {
				def
				fixed
				show
				value {
					id
				}
			}
			status {
				def
				fixed
				show
				value {
					id
				}
			}
			tag {
				def
				fixed
				show
				value {
					id
				}
			}
			taskType {
				def
				fixed
				show
				value {
					id
				}
			}
		}

  }
}
`;

const GET_STATUSES = gql`
query {
  statuses{
    id
    title
  }
}
`;

const GET_COMPANIES = gql`
query {
  companies{
    id
    title
  }
}
`;

const GET_USERS = gql`
query {
  users{
    id
    email
  }
}
`;

const GET_TAGS = gql`
query {
  tags{
    id
    title
  }
}
`;

const GET_TASK_TYPES = gql`
query {
  taskTypes{
    id
    title
  }
}
`;

const GET_MY_DATA = gql`
query {
  getMyData{
    id
    role {
      accessRights {
        addProjects
      }
    }
  }
}
`;

export default function ProjectAdd(props){
  //data & queries
  const { history, closeModal } = props;
  const { data } = useQuery(GET_MY_DATA);
  const [ addProject, {client} ] = useMutation(ADD_PROJECT);
  const { data: statusesData, loading: statusesLoading } = useQuery(GET_STATUSES, { options: { fetchPolicy: 'network-only' }});
  const { data: companiesData, loading: companiesLoading } = useQuery(GET_COMPANIES, { options: { fetchPolicy: 'network-only' }});
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS, { options: { fetchPolicy: 'network-only' }});
  const { data: allTagsData, loading: allTagsLoading } = useQuery(GET_TAGS, { options: { fetchPolicy: 'network-only' }});
  const { data: taskTypesData, loading: taskTypesLoading } = useQuery(GET_TASK_TYPES, { options: { fetchPolicy: 'network-only' }});

  const currentUser = data ? data.getMyData : {};

  //state
  const [ title, setTitle ] = React.useState("");
  const [ descrption, setDescription ] = React.useState("");
  const [ lockedRequester, setLockedRequester ] = React.useState(true);
  const [ projectRights, setProjectRights ] = React.useState([]);

  const [ assignedTo, setAssignedTo ] = React.useState({
    fixed: false,
    def: false,
    show: true,
    value: []
  });
  const [ company, setCompany ] = React.useState({
    fixed: false,
    def: false,
    show: true,
    value: null,
  });
  const [ overtime, setOvertime ] = React.useState({
    fixed: false,
    def: false,
    show: true,
    value: {value: false, label: 'No'}
  });
  const [ pausal, setPausal ] = React.useState({
    fixed: false,
    def: false,
    show: true,
    value: {value: false, label: 'No'}
  });
  const [ requester, setRequester ] = React.useState({
    fixed: false,
    def: false,
    show: true,
    value: null
  });
  const [ status, setStatus ] = React.useState({
    fixed: false,
    def: false,
    show: true,
    value: null
  });
  const [ tag, setTag ] = React.useState({
    fixed: false,
    def: false,
    show: true,
    value: []
  });
  const [ taskType, setTaskType ] = React.useState({
    fixed: false,
    def: false,
    show: true,
    value: null
  });

  const [ saving, setSaving ] = React.useState(false);

    //functions
  const addProjectFunc = () => {
    setSaving( true );

    let newProjectRights = projectRights.map(r => ({
      read: r.read,
      write: r.write,
      delete: r.delete,
      internal: r.internal,
      admin: r.admin,
      UserId: r.user.id
    }));
    let newDef = {
      assignedTo: {...assignedTo, value: assignedTo.value.map(u => u.id)},
      company: {...company, value: (company.value ? company.value.id : null)},
      overtime: {...overtime, value: overtime.value.value },
      pausal: {...pausal, value: pausal.value.value},
      requester: {...requester, value: (requester.value ? requester.value.id : null)},
      status: {...status, value: (status.value ? status.value.id : null)},
      tag: {...tag, value: tag.value.map(u => u.id)},
      taskType: {...taskType, value: (taskType.value ? taskType.value.id : null)},
    }

    addProject({ variables: {
      title,
      descrption,
      lockedRequester,
      projectRights: newProjectRights,
      def: newDef,
    } }).then( ( response ) => {
      const allProjects = client.readQuery({query: GET_PROJECTS}).myProjects;
      const newProject = {...response.data.addProject, __typename: "Project"};
      client.writeQuery({ query: GET_PROJECTS, data: {myProjects: [...allProjects, newProject ] } });
      if (closeModal){
        props.addProject(newProject);
        closeModal();
      } else {
        history.push('/helpdesk/settings/projects/' + newProject.id);
      }
    }).catch( (err) => {
      console.log(err.message);
    });
    setSaving( false );
  }

  const cannotSave = saving || title==="" || (company.value === null && company.fixed) || (status.value === null && status.fixed) || (assignedTo.value.length === 0 && assignedTo.fixed) || (taskType.value === null && taskType.fixed)

  let canReadUserIDs = [];
  let canBeAssigned = [];

  if (!usersLoading) {
    canReadUserIDs = projectRights.map((permission)=>permission.user.id);
    canBeAssigned = toSelArr(usersData.users, 'email').filter((user)=>canReadUserIDs.includes(user.id));
  }

    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
				<FormGroup>
					<Label for="name">Project name</Label>
					<Input type="text" name="name" id="name" placeholder="Enter project name" value={title} onChange={(e)=>setTitle(e.target.value)} />
				</FormGroup>

				<FormGroup>
					<Label htmlFor="description">Popis</Label>
					<Input type="textarea" className="form-control" id="description" placeholder="Zadajte text" value={descrption} onChange={(e) => setDescription( e.target.value )}/>
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
          users={(usersLoading ? [] : toSelArr(usersData.users, 'email'))}
					permissions={projectRights}
					userID={currentUser.id}
					isAdmin={true}
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
        companies={(companiesLoading ? [] : toSelArr(companiesData.companies))}
        canBeAssigned={canBeAssigned}
        users={lockedRequester ? (projectRights.map(r => r.user)) : (usersLoading ? [] : toSelArr(usersData.users, 'email'))}
        allTags={(allTagsLoading ? [] : toSelArr(allTagsData.tags))}
        taskTypes={(taskTypesLoading ? [] : toSelArr(taskTypesData.taskTypes))}
				/>

      { (( company.value === null && company.fixed) || ( status.value === null && status.fixed) || ( assignedTo.value.length === 0 && assignedTo.fixed) || ( taskType.value === null && taskType.fixed)) &&
          <div className="red" style={{color:'red'}}>
          Status, assigned to, task type and company can't be empty if they are fixed!
        </div>
      }

      <div>
  			<Button className="btn"
  				disabled={cannotSave}
  				onClick={addProjectFunc}>
  				{saving?'Adding...':'Add project'}
  			</Button>
        { closeModal &&
          <Button className="btn-link ml-auto" onClick={() => closeModal()}> Cancel </Button>
        }
      </div>
    </div>
    );
  }
