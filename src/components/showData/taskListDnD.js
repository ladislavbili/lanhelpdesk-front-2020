import React, { Component } from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import CommandBar from './commandBar';
import ListHeader from './listHeader';
import classnames from 'classnames';
import { rebase } from 'index';
import { fromMomentToUnix } from 'helperFunctions';
import moment from 'moment';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export default class TaskListDnD extends Component {

	constructor(props) {
		super(props);
		this.groupData.bind(this);
		this.groupRest.bind(this);
	}

	groupData(){
		let grouped=[];
		this.props.groupData.forEach((groupItem)=>grouped.push({
			groupItem:{...groupItem, title:groupItem.title?groupItem.title:'Undefined title', color: groupItem.color?groupItem.color:'#b8d9db'},
			data:this.props.data.filter((dataItem)=>dataItem[this.props.groupBy]!==undefined && dataItem[this.props.groupBy].id===groupItem.id)
		}));
		return grouped;
	}

	groupRest(){
		let ids=this.props.groupData.map((groupItem)=>groupItem.id);
		return this.props.data.filter((dataItem)=> dataItem[this.props.groupBy]===undefined || !ids.includes(dataItem[this.props.groupBy].id));
	}

	onDragEnd({ source, destination }){
		if( source !== null && destination !== null && source.droppableId === destination.droppableId ) return;
		const groups = (
			this.props.statuses.length === 0 ?
			this.groupData() :
			this.groupData().filter(item => this.props.statuses.includes(item.groupItem.id))
		);

		let tagetStatus = this.props.allStatuses.find( (status) => status.id === destination.droppableId )
		let item = groups.find( (group) => group.groupItem.id === source.droppableId ).data[source.index];
		if(tagetStatus.action==='pending'){
			rebase.updateDoc('/help-tasks/'+item.id, {
				pendingDate: fromMomentToUnix(moment().add(1,'days')),
				pendingChange:true,
				status: tagetStatus.id
			})
		}else if(tagetStatus.action==='close'||tagetStatus.action==='invalid'){
			rebase.updateDoc('/help-tasks/'+item.id, {
				status: tagetStatus.id,
				important: false,
				statusChange: fromMomentToUnix(moment()),
				closeDate: fromMomentToUnix(moment()),
			})
		}
		else{
			rebase.updateDoc('/help-tasks/'+item.id, {
				status: tagetStatus.id,
				statusChange:fromMomentToUnix(moment()),
			})
		}
	}

	render() {
		const GROUP_DATA = (
			this.props.statuses.length === 0 ?
			this.groupData() :
			this.groupData().filter(item => this.props.statuses.includes(item.groupItem.id))
		);
		return (
			<div>
				<CommandBar {...this.props.commandBar} listName={this.props.listName} />
				<div className="scroll-visible overflow-x fit-with-header-and-commandbar task-container">
					<ListHeader
						{...this.props.commandBar}
						listName={this.props.listName}
						useBreadcrums={this.props.useBreadcrums}
						breadcrumsData={this.props.breadcrumsData}
						statuses={this.props.statuses}
						setStatuses={this.props.setStatuses}
						allStatuses={this.props.allStatuses}
						/>
					<div className="flex-row">
						<DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
							{ GROUP_DATA.filter( (group) => group.groupItem.action !== 'invoiced' ).map((group)=>
								<Card className="dnd-column" key={group.groupItem.id}>
									<CardHeader className="dnd-header">{group.groupItem.title}</CardHeader>
									<Droppable droppableId={group.groupItem.id}>
										{(provided, snapshot) => (
											<div
												ref={provided.innerRef}
												className="dnd-body card-body"
												style={{
													background: snapshot.isDraggingOver ? 'lightblue' : 'inherit',
												}}>
												{ group.data.map((item, index) => (
													<Draggable
														key={item.id}
														draggableId={item.id.toString()}
														index={index}>
														{(provided, snapshot) => (
															<div
																ref={provided.innerRef}
																{...provided.draggableProps}
																{...provided.dragHandleProps}
																>
																<ul
																	className={classnames("taskCol" ,"clickable", "list-unstyled", "dnd-item")}
																	style={{borderLeft: "3px solid " + group.groupItem.color}}
																	onClick={(e)=>{
																		this.props.history.push(this.props.link+'/'+item.id);
																	}}
																	key={item.id}>
																	{this.props.displayCol(item)}
																</ul>
															</div>
														)}
													</Draggable>
												))}
												{provided.placeholder}
											</div>
										)}
									</Droppable>
								</Card>
							)}
						</DragDropContext>
						{
							GROUP_DATA.filter( (group) => group.groupItem.action === 'invoiced' ).map((group)=>
							<Card className="dnd-column" key={group.groupItem.id}>
								<CardHeader className="dnd-header">{group.groupItem.title}</CardHeader>
								<CardBody className="dnd-body">
									{
										group.data.map((item)=>
										<ul
											className={classnames("taskCol" ,"clickable", "list-unstyled", "dnd-item")}
											style={{borderLeft: "3px solid " + group.groupItem.color}}
											onClick={(e)=>{
												this.props.history.push(this.props.link+'/'+item.id);
											}}
											key={item.id}>
											{this.props.displayCol(item)}
										</ul>
									)}
									{
										group.data.length===0 &&
										<div className="center-ver" style={{textAlign:'center'}}>
											Neboli nájdené žiadne výsledky pre tento filter
										</div>
									}
								</CardBody>
							</Card>
						)}
						{
							this.groupRest().length>0 &&
							<Card className="dnd-column" key="Undefined group">
								<CardHeader style={{backgroundColor:'#b8d9db'}}>Undefined group</CardHeader>
								<CardBody>
									{
										this.groupRest().map((item)=>
										<ul
											className={classnames("taskCol", "clickable", "list-unstyled")}
											onClick={(e)=>{
												this.props.history.push(this.props.link+'/'+item.id);
											}}
											key={item.id}>
											{this.props.displayCol(item)}
										</ul>
									)}
								</CardBody>
							</Card>
						}
					</div>
				</div>
			</div>
		);
	}
}
