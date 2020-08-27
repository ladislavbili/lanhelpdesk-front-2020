import React from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { Button, FormGroup, Label, Input, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import {toSelArr, sameStringForms, snapshotToArray,testing} from '../../../helperFunctions';
import Permissions from "../../components/projects/permissions";
import ProjectDefaultValues from "../../components/projects/defaultValues";
import booleanSelects from 'configs/constants/boolSelect'
import { noDef } from 'configs/constants/projects';
import Select from 'react-select';
import {selectStyle} from "configs/components/select";
import Loading from 'components/loading';

import {  GET_PROJECTS } from './index';

export const GET_PROJECT = gql`
query project($id: Int!) {
  project(
		id: $id,
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

export const UPDATE_PROJECT = gql`
mutation updateProject($id: Int!, $title: String, $descrption: String, $lockedRequester: Boolean, $projectRights: [ProjectRightInput], $def: ProjectDefaultsInput) {
  updateProject(
		id: $id,
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

export const DELETE_PROJECT = gql`
mutation deleteProject($id: Int!, $newId: Int!) {
  deleteProject(
    id: $id,
    newId: $newId,
  ){
    id
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

export default function ProjectEdit(props){
  //data & queries
  const { history, match, closeModal } = props;
  const { data: projectData, loading: projectLoading, refetch } = useQuery(GET_PROJECT, { variables: {id: parseInt(match.params.id)} });
  const [updateProject, {updateData}] = useMutation(UPDATE_PROJECT);
  const [deleteProject, {deleteData, client}] = useMutation(DELETE_PROJECT);
  const { data: statusesData, loading: statusesLoading } = useQuery(GET_STATUSES);
  const { data: companiesData, loading: companiesLoading } = useQuery(GET_COMPANIES);
  const { data: usersData, loading: usersLoading } = useQuery(GET_USERS);
  const { data: allTagsData, loading: allTagsLoading } = useQuery(GET_TAGS);
  const { data: taskTypesData, loading: taskTypesLoading } = useQuery(GET_TASK_TYPES);

  const allProjects = toSelArr(client.readQuery({query: GET_PROJECTS}).projects);
  const filteredProjects = allProjects.filter( project => project.id !== parseInt(match.params.id) );
  const theOnlyOneLeft = allProjects.length === 0;

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
  const [ newProject, setNewProject ] = React.useState(null);
  const [ choosingNewProject, setChooseingNewProject ] = React.useState(false);

	// sync
	React.useEffect( () => {
			if (!projectLoading){
				setTitle(projectData.project.title);
				setDescription(projectData.project.descrption);
				setLockedRequester(projectData.project.lockedRequester);
				setProjectRights(projectData.project.projectRights);
        let newOvertime = {
          def: projectData.project.def.overtime.def,
          fixed: projectData.project.def.overtime.fixed,
          show: projectData.project.def.overtime.show,
          value:  (projectData.project.def.overtime.value ? {value: true, label: 'Yes'} :{value: false, label: 'No'})};
				setOvertime(newOvertime);
        let newPausal = {
          def: projectData.project.def.pausal.def,
          fixed: projectData.project.def.pausal.fixed,
          show: projectData.project.def.pausal.show,
          value:  (projectData.project.def.pausal.value ? {value: true, label: 'Yes'} :{value: false, label: 'No'})};
        setPausal(newPausal);
			}
	}, [projectLoading]);

	React.useEffect( () => {
			if (!projectLoading && !usersLoading){
				let users = toSelArr(usersData.users, 'email');
				let newAssignedTo = {
          def: projectData.project.def.assignedTo.def,
          fixed: projectData.project.def.assignedTo.fixed,
          show: projectData.project.def.assignedTo.show,
          value: projectData.project.def.assignedTo.value.map(user => users.find(u => u.id === user.id))};
				setAssignedTo(newAssignedTo);
				let newRequester = {
          def: projectData.project.def.requester.def,
          fixed: projectData.project.def.requester.fixed,
          show: projectData.project.def.requester.show,
          value: (projectData.project.def.requester.value ? users.find(u => u.id === projectData.project.def.requester.value.id) : null)
        };
				setRequester(newRequester);
			}
	}, [projectLoading, usersLoading]);

	React.useEffect( () => {
			if (!projectLoading && !companiesLoading){
				let companies = toSelArr(companiesData.companies);
				let newCompany = {
          def: projectData.project.def.company.def,
          fixed: projectData.project.def.company.fixed,
          show: projectData.project.def.company.show,
          value: (projectData.project.def.company.value ? companies.find(c => c.id === projectData.project.def.company.value.id) : null)
        };
				setCompany(newCompany);
			}
	}, [projectLoading, companiesLoading]);

	React.useEffect( () => {
			if (!projectLoading && !statusesLoading){
				let statuses = toSelArr(statusesData.statuses);
				let newStatus = {
          def: projectData.project.def.status.def,
          fixed: projectData.project.def.status.fixed,
          show: projectData.project.def.status.show,
          value: (projectData.project.def.status.value ? statuses.find(c => c.id === projectData.project.def.status.value.id) : null)
        };
				setStatus(newStatus);
			}
	}, [projectLoading, statusesLoading]);

	React.useEffect( () => {
			if (!projectLoading && !allTagsLoading){
				let tags = toSelArr(allTagsData.tags);
        let ids = projectData.project.def.tag.value.map(v => v.id);
        let newValue = tags.filter(t => ids.includes(t.id));
				let newTag =  {
          def: projectData.project.def.tag.def,
          fixed: projectData.project.def.tag.fixed,
          show: projectData.project.def.tag.show,
          value: newValue};
				setTag(newTag);
			}
	}, [projectLoading, allTagsLoading]);

	React.useEffect( () => {
			if (!projectLoading && !taskTypesLoading){
				let taskTypes = toSelArr(taskTypesData.taskTypes);
				let newTaskType = {
          def: projectData.project.def.taskType.def,
          fixed: projectData.project.def.taskType.fixed,
          show: projectData.project.def.taskType.show,
          value: (projectData.project.def.taskType.value ? taskTypes.find(c => c.id === projectData.project.def.taskType.value.id) : null)
        };
				setTaskType(newTaskType);
			}
	}, [projectLoading, taskTypesLoading]);

	React.useEffect( () => {
			refetch({ variables: {id: parseInt(match.params.id)} });
	}, [match.params.id]);

	// functions
	const updateProjectFunc = () => {
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

		updateProject({ variables: {
			id: parseInt(match.params.id),
			title,
      descrption,
      lockedRequester,
      projectRights: newProjectRights,
      def: newDef,
		} }).then( ( response ) => {
			const updatedProject = {...response.data.updateProject};
			client.writeQuery({ query: GET_PROJECTS, data: {projects: [...allProjects.filter( project => project.id !== parseInt(match.params.id) ), updatedProject ] } });
		}).catch( (err) => {
			console.log(err.message);
		});

		 setSaving( false );
	};


  const deleteProjectFunc = () => {
    setChooseingNewProject(false);
    if(window.confirm("Are you sure?")){
      deleteProject({ variables: {
        id: parseInt(match.params.id),
        newId: ( newProject ? parseInt(newProject.id) : null ),
      } }).then( ( response ) => {
        client.writeQuery({ query: GET_PROJECTS, data: {projects: filteredProjects} });
        history.push('/helpdesk/settings/projects/add');
      }).catch( (err) => {
        console.log(err.message);
        console.log(err);
      });
    }
  };

	/*	let canReadUserIDs = this.state.permissions.map((permission)=>permission.user.id);
		let canBeAssigned = this.state.users.filter((user)=>canReadUserIDs.includes(user.id));*/
		if (projectLoading || statusesLoading || companiesLoading || usersLoading || allTagsLoading || taskTypesLoading) {
	    return <Loading />
	  }

	  const cannotSave = saving || title==="" || (company && company.value === null && company.fixed) || (status && status.value === null && status.fixed) || (assignedTo && assignedTo.value.length === 0 && assignedTo.fixed) || (taskType && taskType.value === null && taskType.fixed);

    return (
      <div className="p-20 fit-with-header-and-commandbar scroll-visible">
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
		        users={lockedRequester ? (toSelArr(projectRights.map(r => r.user), 'email')) : (usersLoading ? [] : toSelArr(usersData.users, 'email'))}
		        allTags={(allTagsLoading ? [] : toSelArr(allTagsData.tags))}
		        taskTypes={(taskTypesLoading ? [] : toSelArr(taskTypesData.taskTypes))}
						/>

					{ (( company.value === null && company.fixed) || ( status.value === null && status.fixed) || ( assignedTo.value.length === 0 && assignedTo.fixed) || ( taskType.value === null && taskType.fixed)) &&
						<div className="red" style={{color:'red'}}>
						Status, assigned to, task type and company can't be empty if they are fixed!
					</div>
				}

				<Modal isOpen={choosingNewProject}>
					<ModalHeader>
						Please choose an project to replace this one
					</ModalHeader>
					<ModalBody>
						<FormGroup>
							<Select
								styles={selectStyle}
								options={filteredProjects}
								value={newProject}
								onChange={s => setNewProject(s)}
								/>
						</FormGroup>
					</ModalBody>
					<ModalFooter>
						<Button className="btn-link mr-auto"onClick={() => setChooseingNewProject(false)}>
							Cancel
						</Button>
						<Button className="btn ml-auto" disabled={!newProject} onClick={deleteProjectFunc}>
							Complete deletion
						</Button>
					</ModalFooter>
				</Modal>

					<div className="row">
					<Button
						className="btn"
						disabled={cannotSave}
						onClick={updateProjectFunc}>
						{(saving?'Saving...':'Save project')}
					</Button>
					<Button className="btn-red m-l-5" disabled={saving || theOnlyOneLeft} onClick={() => setChooseingNewProject(true)}>
						Delete
					</Button>
          {closeModal &&
            <Button className="btn-link" onClick={closeModal()}>
              Close
            </Button>}
				</div>
      </div>
    );
  }
