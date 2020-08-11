import React from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { Button, FormGroup, Label,Input } from 'reactstrap';
import {toSelArr, sameStringForms, testing} from '../../../helperFunctions';
import Permissions from "../../components/projects/permissions";
import ProjectDefaultValues from "../../components/projects/defaultValues";
import { noDef } from 'configs/constants/projects';

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

export default function ProjectAdd(props){
  //data & queries
  const { history, match } = props;
  const [ addProject, {client} ] = useMutation(ADD_PROJECT);
  const { data: statusesData, loading: statusesLoading } = useQuery(GET_STATUSES);
  const { data: companiesData, loading: companiesLoading } = useQuery(GET_COMPANIES);
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS);
  const { data: allTagsData, loading: allTagsLoading } = useQuery(GET_TAGS);
  const { data: taskTypesData, loading: taskTypesLoading } = useQuery(GET_TASK_TYPES);

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
      const allProjects = client.readQuery({query: GET_PROJECTS}).projects;
      const newProject = {...response.data.addProject, __typename: "Project"};
      client.writeQuery({ query: GET_PROJECTS, data: {projects: [...allProjects, newProject ] } });
      history.push('/helpdesk/settings/projects/' + newProject.id)
    }).catch( (err) => {
      console.log(err.message);
    });
    setSaving( false );
  }

  const cannotSave = saving || title==="" || (company.value === null && company.fixed) || (status.value === null && status.fixed) || (assignedTo.value.length === 0 && assignedTo.fixed) || (taskType.value === null && taskType.fixed)



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
					userID={0}
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
        canBeAssigned={(usersLoading ? [] : toSelArr(usersData.users, 'email'))}
        users={lockedRequester ? (projectRights.map(r => r.user)) : (usersLoading ? [] : toSelArr(usersData.users, 'email'))}
        allTags={(allTagsLoading ? [] : toSelArr(allTagsData.tags))}
        taskTypes={(taskTypesLoading ? [] : toSelArr(taskTypesData.taskTypes))}
				/>

      { (( company.value === null && company.fixed) || ( status.value === null && status.fixed) || ( assignedTo.value.length === 0 && assignedTo.fixed) || ( taskType.value === null && taskType.fixed)) &&
          <div className="red" style={{color:'red'}}>
          Status, assigned to, task type and company can't be empty if they are fixed!
        </div>
      }

			<Button className="btn"
				disabled={cannotSave}
				onClick={addProjectFunc}>
				{saving?'Adding...':'Add project'}
			</Button>
    </div>
    );
  }
