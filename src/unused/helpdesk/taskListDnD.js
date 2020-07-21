import React, { Component } from 'react';
import { Card, CardHeader, CardBody } from 'reactstrap';
import CommandBar from './commandBar';
import ListHeader from './listHeader';
import classnames from 'classnames';

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

	render() {
		const GROUP_DATA = ( this.props.statuses.length === 0 ? this.groupData() : this.groupData().filter(item => this.props.statuses.includes(item.groupItem.id)));
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
								{
									GROUP_DATA.map((group)=>
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
