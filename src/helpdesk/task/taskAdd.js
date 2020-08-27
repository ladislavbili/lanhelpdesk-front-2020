import React, { Component } from 'react';
import { useMutation, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Select from 'react-select';
import { Label, Button } from 'reactstrap';
import DatePicker from 'react-datepicker';
import moment from 'moment';

import Subtasks from '../components/subtasks';
import Repeat from '../components/repeat';
import Attachments from '../components/attachments';

import VykazyTable from '../components/vykazyTable';

import classnames from "classnames";

import CKEditor5 from '@ckeditor/ckeditor5-react';
import ck5config from 'configs/components/ck5config';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import datePickerConfig from 'configs/components/datepicker';
import {invisibleSelectStyleNoArrow, invisibleSelectStyleNoArrowColored,invisibleSelectStyleNoArrowColoredRequired, invisibleSelectStyleNoArrowRequired} from 'configs/components/select';
import booleanSelects from 'configs/constants/boolSelect'
import { noMilestone } from 'configs/constants/sidebar';
import { noDef } from 'configs/constants/projects';

export const ADD_TASK = gql`
mutation addTask($title: String!, $closeDate: Int!, $assignedTo: [Int]!, $company: Int!, $deadline: Int, $description: String!, $milestone: Int, $overtime: Boolean!, $pausal: Boolean!, $pendingChangable: Boolean, $pendingDate: Int, $project: Int!, $requester: Int, $status: Int!, $tags: [Int]!, $taskType: Int!, $repeat: RepeatInput ) {
  addTask(
    title: $title,
    closeDate: $closeDate,
    assignedTo: $assignedTo,
    company: $company,
    deadline: $deadline,
    description: $description,
    milestone: $milestone,
    overtime: $overtime,
    pausal: $pausal,
    pendingChangable: $pendingChangable,
    pendingDate: $pendingDate,
    project: $project,
    requester: $requester,
    status: $status,
    tags: $tags,
    taskType: $taskType,
    repeat: $repeat,
  ){
    id
    title
  }
}
`;

export default function TaskAdd (props){
  //data & queries
  const { history, match, loading, newID, projectID, currentUser, projects, users, allTags, taskTypes, tripTypes, milestones, companies, statuses, units, defaultUnit, closeModal } = props;
  const [ addTask, {client} ] = useMutation(ADD_TASK);

  //state
  const [ layout, setLayout ] = React.useState(1);

	const [ defaultFields, setDefaultFields ] = React.useState(noDef);

  const [ attachments, setAttachments ] = React.useState([]);
  const [ assignedTo, setAssignedTo ] = React.useState([]);
  const [ closeDate, setCloseDate ] = React.useState(null);
  const [ company, setCompany ] = React.useState(null);
  const [ customItems, setCustomItems ] = React.useState([]);
  const [ deadline, setDeadline ] = React.useState(null);
  const [ description, setDescription ] = React.useState("");
  const [ descriptionVisible, setDescriptionVisible ] = React.useState(false);
  const [ milestone, setMilestone ] = React.useState([noMilestone]);
  const [ overtime, setOvertime ] = React.useState(booleanSelects[0]);
  const [ pausal, setPausal ] = React.useState(booleanSelects[0]);
  const [ pendingDate, setPendingDate ] = React.useState(null);
  const [ pendingChangable, setPendingChangable ] = React.useState(false);
  const [ project, setProject ] = React.useState(projectID ? projects.find(p => p.id === projectID) : null);
  const [ reminder, setReminder ] = React.useState(null);
  const [ repeat, setRepeat ] = React.useState(null);
  const [ requester, setRequester ] = React.useState(null);
  const [ saving, setSaving ] = React.useState(false);
  const [ status, setStaus ] = React.useState(null);
  const [ subtasks, setSubtasks ] = React.useState([]);
  const [ tags, setTags ] = React.useState([]);
  const [ taskMaterials, setTaskMaterials ] = React.useState([]);
  const [ taskType, setTaskType ] = React.useState(null);
  const [ taskWorks, setTaskWorks ] = React.useState([]);
	const [ title, setTitle ] = React.useState("");
  const [ workTrips, setWorkTrips ] = React.useState([]);

  let counter = 0;

	const getNewID = () => {
			return counter++;
		}

	const userRights = project ? project.projectRights.find(r => r.user.id === currentUser.id) : false;

	const [ viewOnly, setViewOnly ] = React.useState(currentUser.role.level !== 0 && !userRights.write);

	const setDefaults = (id, forced) => {
		if(id === null){
			setDefaultFields( noDef );
			return;
		}

		let pro = projects.find((proj) => proj.id === id);
		let def = pro.def;
		if(!def){
			setDefaultFields( noDef );
			return;
		}

		if (props.task && !forced) {
			setDefaultFields( def );
			return;
		}

		let permission = pro.projectRights.find(r => r.user.id === currentUser.id);
		let maybeRequester = users ? users.find((user)=>user.id === currentUser.id) : null;

		let permissionIDs = project ? project.projectRights.map((permission) => permission.user.id) : [];

		let filterredAssignedTo = assignedTo.filter((user)=>permissionIDs.includes(user.id));
		let newAssignedTo = def.assignedTo && (def.assignedTo.fixed || def.assignedTo.def) ? users.filter((item)=> def.assignedTo.value.includes(item.id)) : filterredAssignedTo;
		setAssignedTo(newAssignedTo);

		let newCompany = def.company && (def.company.fixed || def.company.def) ? companies.find((item)=> item.id === def.company.value) : (companies && newRequester ? companies.find((company) => company.id === currentUser.company.id) : null);
		setCompany(newCompany);

		let newRequester = def.requester && (def.requester.fixed || def.requester.def) ? users.find((item)=> item.id === def.requester.value.id) : maybeRequester;
		setRequester(newRequester);

		let newStatus = def.status && (def.status.fixed || def.status.def) ? statuses.find((item)=> item.id === def.status.value.is) : statuses[0];
		setStaus(newStatus);

		let mappedTags = def.tag.value.map(t => t.id);
		let newTags = def.tag&& (def.tag.fixed || def.tag.def) ? allTags.filter((item)=> mappedTags.includes(item.id)) : allTags;
		setTags(newTags);

		let newTaskType = def.taskType && (def.taskType.fixed || def.taskType.def) ? taskTypes.find((item)=> item.id===def.taskType.value) : taskType;
		setTaskType(newTaskType);

		let newOvertime = def.overtime && (def.overtime.fixed || def.overtime.def) ? booleanSelects.find((item)=> def.overtime.value === item.value) : overtime;
		setOvertime(newOvertime);

		let newPausal = def.pausal && (def.pausal.fixed || def.pausal.def) ? booleanSelects.find((item)=> def.pausal.value === item.value) : pausal;
		setPausal(newPausal);

		setProject(pro);

		const userRights = pro.projectRights.find(r => r.user.id === currentUser.id);
		setViewOnly(currentUser.role.level !== 0 && !userRights.write);

		setDefaultFields( def );
	}

	const addTaskFunc = () => {
		setSaving(true);
    addTask({ variables: {
      title,
      closeDate: closeDate ? closeDate.unix() : 0,
      assignedTo: assignedTo.map(user => user.id),
      company: company.id,
      deadline: deadline ?  deadline.unix() : null,
      description,
      milestone: milestone ? milestone.id : null,
      overtime: overtime.value,
      pausal: pausal.value,
      pendingChangable,
      pendingDate: pendingDate ? pendingDate.unix() : null,
      project: project.id,
      requester: requester ? requester.id : null,
      status: status.id,
      tags: tags.map(tag => tag.id),
      taskType: taskType ? taskType.id: null,
      repeat: repeat ? {...repeat, startsAt: repeat.startsAt + "", repeatEvery: repeat.repeatEvery + ""} : null
    } }).then( ( response ) => {
      console.log(response);
      closeModal();
    }).catch( (err) => {
      console.log(err.message);
    });
		setSaving(false);
	}

	const	renderTitle = () => {
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

const USERS_WITH_PERMISSIONS = users.filter((user)=> project && project.projectRights.some((r) => r.user.id === user.id));
const REQUESTERS =  (project && project.lockedRequester ? USERS_WITH_PERMISSIONS : users);

const renderSelectsLayout1 = () => {
	return(
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
								const userRights = project.projectRights.find(r => r.user.id === currentUser.id);
								setViewOnly(currentUser.role.level !== 0 && !userRights.write);

								if(viewOnly){
										setRepeat(null);
										setTaskWorks([]);
										setSubtasks([]);
										setTaskMaterials([]);
										setCustomItems([]);
									//		workTrips:[],
									//		allTags:[],
									setDeadline(null);
									setCloseDate(null);
									setPendingDate(null);
									setReminder(null);
								}

								setDefaults(project.id, true);
							}}
							options={projects.filter((project)=>{
								if (currentUser.role.level === 0){
									return true;
								}
								let permission = project.projectRights.find((permission)=>permission.user.id === currentUser.id);
								return permission && permission.read;
							})}
							styles={invisibleSelectStyleNoArrow}
							/>
					</div>
				</div>
				}

		{!viewOnly &&
      <div className="col-lg-12">
			<div className="col-lg-12">
				<div className="col-lg-4">
					<div className="row p-r-10">
						<Label className="col-3 col-form-label">Projekt</Label>
						<div className="col-9">
							<Select
								placeholder="Select required"
								value={project}
								onChange={(project)=>{
									setProject(project);
									setMilestone(noMilestone);

									let permissionIDs = project.projectRights.map((permission) => permission.user.id);
									let newAssignedTo = assignedTo.filter((user)=>permissionIDs.includes(user.id));
									setAssignedTo(newAssignedTo);

									const userRights = project.projectRights.find(r => r.user.id === currentUser.id);
									setViewOnly(currentUser.role.level !== 0 && !userRights.write);

									if(viewOnly){
											setRepeat(null);
											setTaskWorks([]);
											setSubtasks([]);
											setTaskMaterials([]);
											setCustomItems([]);
											//	workTrips:[],
								//			allTags:[],
											setDeadline(null);
											setCloseDate(null);
											setPendingDate(null);
											setReminder(null);
									}
									setDefaults(project.id, true);
								}}
								options={projects.filter((project)=>{
									if (currentUser.role.level === 0){
										return true;
									}
									let permission = project.projectRights.find((permission)=>permission.user.id === currentUser.id);
									return permission && permission.read;
								})}
								styles={invisibleSelectStyleNoArrowRequired}
								/>
						</div>
					</div>
				</div>
				{!viewOnly &&
					defaultFields.assignedTo.show &&
					<div className="col-lg-8">
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

			<div className="col-lg-4">
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
									setStaus(status);
									setPendingDate( moment().add(1,'d') );
								}else if(status.action==='CloseDate'||status.action==='CloseInvalid'){
									setStaus(status);
									setCloseDate( moment() );
								}
								else{
									setStaus(status);
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
				</div>}
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
					</div>}
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

			<div className="col-lg-4">
					{!viewOnly &&
						defaultFields.requester.show &&
            <div className="row p-r-10">
						<Label className="col-3 col-form-label">Zadal</Label>
						<div className="col-9">
							<Select
								value={requester}
								placeholder="Select required"
								isDisabled={defaultFields.requester.fixed || viewOnly}
								onChange={(requester)=>setRequester(requester)}
								options={REQUESTERS}
								styles={invisibleSelectStyleNoArrowRequired}
								/>
						</div>
					</div>}
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
  									setPausal(company.taskWorkPausal > 0 ? booleanSelects[1] : booleanSelects[0]);
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
									isDisabled={viewOnly || !company || company.taskWorkPausal ===0 || defaultFields.pausal.fixed}
									styles={invisibleSelectStyleNoArrowRequired}
									onChange={(pausal)=> setPausal(pausal)}
									options={booleanSelects}
									/>
							</div>
						</div>}
			</div>

			<div className="col-lg-4">
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
		</div>}
	</div>
)}

const renderSelectsLayout2 = () => {
	return(
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
									const userRights = project.projectRights.find(r => r.user.id === currentUser.id);
									setViewOnly(currentUser.role.level !== 0 && !userRights.write);

									if(viewOnly){
											setRepeat(null);
											setTaskWorks([]);
											setSubtasks([]);
											setTaskMaterials([]);
											setCustomItems([]);
										//		workTrips:[],
										//		allTags:[],
										setDeadline(null);
										setCloseDate(null);
										setPendingDate(null);
										setReminder(null);
									}

									setDefaults(project.id, true);
								}}
								options={projects.filter((project)=>{
									if (currentUser.role.level === 0){
										return true;
									}
									let permission = project.projectRights.find((permission)=>permission.user.id === currentUser.id);
									return permission && permission.read;
								})}
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

									let permissionIDs = project.projectRights.map((permission) => permission.user.id);
									let newAssignedTo = assignedTo.filter((user)=>permissionIDs.includes(user.id));
									setAssignedTo(newAssignedTo);

									const userRights = project.projectRights.find(r => r.user.id === currentUser.id);
									setViewOnly(currentUser.role.level !== 0 && !userRights.write);

									if(viewOnly){
											setRepeat(null);
											setTaskWorks([]);
											setSubtasks([]);
											setTaskMaterials([]);
											setCustomItems([]);
											setDeadline(null);
											setCloseDate(null);
											setPendingDate(null);
											setReminder(null);
									}
									setDefaults(project.id, true);
								}}
								options={projects.filter((project)=>{
									if (currentUser.role.level === 0){
										return true;
									}
									let permission = project.projectRights.find((permission)=>permission.user.id === currentUser.id);
									return permission && permission.read;
								})}
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
					</div>}

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
									setStaus(status);
									setPendingDate( moment().add(1,'d') );
								}else if(status.action==='CloseDate'||status.action==='CloseInvalid'){
									setStaus(status);
									setCloseDate( moment() );
								}
								else{
									setStaus(status);
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
				</div>}

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
						</div>}

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
						</div>}

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
  									setPausal(company.taskWorkPausal > 0 ? booleanSelects[1] : booleanSelects[0]);
  								}}
  								options={companies}
									styles={invisibleSelectStyleNoArrowRequired}
									/>
							</div>
						</div>}

					{!viewOnly &&
						defaultFields.pausal.show &&
						<div className="">
							<Label className="col-form-label-2">Paušál</Label>
							<div className="col-form-value-2">
								<Select
									value={pausal}
									placeholder="Select required"
									isDisabled={viewOnly || !company || company.taskWorkPausal ===0 || defaultFields.pausal.fixed}
									styles={invisibleSelectStyleNoArrowRequired}
									onChange={(pausal)=> setPausal(pausal)}
									options={booleanSelects}
									/>
							</div>
						</div>}

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
				</div>}

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
					/>}

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
			</div>}

	</div>
	)
}

	const renderPopis = () => {
		return(
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
					let time = moment().unix();
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


	const renderVykazyTable = (taskWorks, workTrips, taskMaterials, customItems) => {
		return(
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
						setTaskWorks([...taskWorks,{id:getNewID(), ...newService}]);
					}}
					subtasks={taskWorks}
					defaultType={taskType}
					taskTypes={taskTypes}
					updateSubtask={(id,newData)=>{
						let newTaskWorks=[...taskWorks];
						newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...newData};
						setTaskWorks(newTaskWorks);
					}}
					updateSubtasks={(multipleSubtasks)=>{
						let newTaskWorks=[...taskWorks];
						multipleSubtasks.forEach(({id, newData})=>{
							newTaskWorks[newTaskWorks.findIndex((taskWork)=>taskWork.id===id)]={...newTaskWorks.find((taskWork)=>taskWork.id===id),...newData};
						});
						setTaskWorks(newTaskWorks);
					}}
					removeSubtask={(id)=>{
						let newTaskWorks=[...taskWorks];
						newTaskWorks.splice(newTaskWorks.findIndex((taskWork)=>taskWork.id===id),1);
						setTaskWorks(newTaskWorks);
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

					materials={taskMaterials}
					submitMaterial={(newMaterial)=>{
						setTaskMaterials([...taskMaterials,{id:getNewID(),...newMaterial}]);
					}}
					updateMaterial={(id,newData)=>{
						let newTaskMaterials=[...taskMaterials];
						newTaskMaterials[newTaskMaterials.findIndex((material)=>material.id===id)]={...newTaskMaterials.find((material)=>material.id===id),...newData};
						setTaskMaterials(newTaskMaterials);
					}}
					updateMaterials={(multipleMaterials)=>{
						let newTaskMaterials=[...taskMaterials];
						multipleMaterials.forEach(({id, newData})=>{
							newTaskMaterials[newTaskMaterials.findIndex((material)=>material.id===id)]={...newTaskMaterials.find((material)=>material.id===id),...newData};
						});
						setTaskMaterials(newTaskMaterials);
					}}
					removeMaterial={(id)=>{
						let newTaskMaterials=[...taskMaterials];
						newTaskMaterials.splice(newTaskMaterials.findIndex((taskMaterial)=>taskMaterial.id===id),1);
						setTaskMaterials(newTaskMaterials);
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

					units={units}
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
					disabled={title==="" || status===null || project === null || company === null || saving || loading || newID===null}
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

				{ !viewOnly && renderVykazyTable(taskWorks, workTrips, taskMaterials, customItems) }

				{ renderButtons() }

				</div>

				{ layout === 2 && renderSelectsLayout2() }

			</div>
	);
}
