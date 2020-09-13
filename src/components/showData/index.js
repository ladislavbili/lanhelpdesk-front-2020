import React, { Component } from 'react';
import TaskCol from './taskCol';
import TaskList from './taskList';
import TaskListDnD from './taskListDnD';
import { connect } from "react-redux";
import {timestampToString} from '../../helperFunctions';
//import {setSearch, setFilter, addShowDataFilter } from '../../redux/actions';

import { search, filter, filterName, tasklistLayout } from 'localCache';

export default function ShowDataContainer (props){
	//data
	const { match, history, data,  filterBy, ascending, orderBy, orderByValues, displayValues, useBreadcrums, breadcrumsData, listName, empty, itemID, link, displayCol, isTask, setStatuses, statuses, allStatuses, Edit, dndGroupData, dndGroupAttribute, calendarAllDayData, calendarEventsData, checkTask, deleteTask } = props;

	//state
	const [ filterView, setFilterView ] = React.useState(false);
	/*
	constructor(props) {
		super(props);
		this.state = {
			search: this.props.search
		};
		console.log("hello?");
		this.filterData.bind(this);
		this.addShowDataFilter.bind(this);
		this.addShowDataFilter();
	}
*/

	const addShowDataFilter = () => {
		/*if(filter[filterName]===undefined){
			let defaultFilter={};
			this.props.displayValues.forEach((display)=>{
				defaultFilter[display.value]=''
			})
			this.props.addShowDataFilter(this.props.filterName, defaultFilter);
		}*/
	}

	const filterData = () => {
		//return data;
		return data.filter((item)=>{
			let filterString="";
			filterBy.forEach((value)=>{
				if(!item[value.value]){
					return;
				}
				if(value.type==='object'){
					if (value.value === "status"){
						filterString+= (100 - item[value.value].order) + " " + item.statusChange + " ";
					} else {
						filterString+= item[value.value].title + " ";
					}
				}else if(value.type==='text'){
					filterString+= item[value.value] + " ";
				}else if(value.type==='int'){
					filterString+= item[value.value] + " ";
				}else if(value.type==='list'){
					filterString+= item[value.value].reduce(value.func,'') + " ";
				}else if(value.type==='date'){
					filterString+= timestampToString(item[value.value]) + " ";
				}else if(value.type==='user'){
					filterString+= item[value.value].email+' '+item[value.value].name+' '+item[value.value].surname + " ";
				}
			});
			return filterString.toLowerCase().includes(search().toLowerCase());
		}).sort((item1,item2)=>{
			let val1 = getSortValue(item1);
			let val2 = getSortValue(item2);
			if(ascending){
				if(val1===null){
					return 1;
				}
				return val1 > val2? 1 : -1;
			}else{
				if(val2===null){
					return 1;
				}
				return val1 < val2? 1 : -1;
			}
		}).sort((val1,val2)=>{
			if(val1.important && !val2.important){
				return -1;
			}else if(!val2.important && val2.important){
				return 1;
			}
			return 0;
		});
	}
	const getSortValue = (item) => {
		let value = orderByValues.find((val)=>val.value===orderBy);
		if(value.type==='object'){
			if (value.value === "status"){
				return item[value.value] ? ((100 - item[value.value].order) + " " +  item.statusChange) : null;
			}
			return item[value.value]?item[value.value].title.toLowerCase():null;
		}else if(value.type==='text'){
			return item[value.value].toLowerCase();
		}else if(value.type==='int'){
			return item[value.value];
		}else if(value.type==='list'){
			return item[value.value].reduce(value.func,'').toLowerCase();
		}else if(value.type==='date'){
			return parseInt(item[value.value]?item[value.value]:null);
		}else if(value.type==='user'){
			return (item[value.value].surname+' '+item[value.value].name).toLowerCase();
		}
	}

	return (
		<div className="content-page">
			<div className="content" style={{ paddingTop: 0 }}>
				<div className="row m-0">
					{tasklistLayout() === 0 && (
						<div className={'' + (filterView ? 'col-xl-9' : 'col-xl-12')}>
							<TaskCol
								commandBar={props}
								useBreadcrums={useBreadcrums}
								breadcrumsData={breadcrumsData}
								listName={listName}
								history={history}
								empty={empty}
								match={match}
								data={filterData()}
								itemID={itemID}
								link={link}
								displayCol={displayCol}
								isTask={isTask}
								setStatuses={setStatuses}
								statuses={statuses}
								allStatuses={allStatuses}
								Edit={Edit}
								/>
						</div>
					)}

{/* filter[filterName]!==undefined &&*/}
					{tasklistLayout() === 1 && (
						<div className={'' + (filterView ? 'col-xl-9' : 'col-xl-12')}>
							{itemID && <Edit match={match} columns={false} history={history} />}
							{!itemID &&
								<TaskList
									commandBar={props}
									useBreadcrums={useBreadcrums}
									breadcrumsData={breadcrumsData}
									listName={listName}
									history={history}
									match={match}
									data={filterData()}
									displayValues={displayValues}
									filterName={filterName}
									isTask={isTask}
									setStatuses={setStatuses}
									statuses={statuses}
									allStatuses={allStatuses}
									link={link}
									checkTask={checkTask}
									deleteTask={deleteTask}
									/>}
						</div>
					)}

					{tasklistLayout() === 2 && (
						<div className={'' + (filterView ? 'col-xl-9' : 'col-xl-12')}>
							{itemID && <edit match={match} columns={false} history={history} />}
							{!itemID &&
								<TaskListDnD
									commandBar={props}
									useBreadcrums={useBreadcrums}
									breadcrumsData={breadcrumsData}
									listName={listName}
									history={history}
									match={match}
									data={filterData()}
									displayValues={displayValues}
									displayCol={displayCol}
									link={link}
									groupBy={dndGroupAttribute}
									groupData={dndGroupData}
									isTask={isTask}
									setStatuses={setStatuses}
									statuses={statuses}
									allStatuses={allStatuses}
									/>
							}
						</div>
					)}
					{tasklistLayout() === 3 && (
						<div className={'' + (filterView ? 'col-xl-9' : 'col-xl-12')}>
							<calendar
								commandBar={props}
								useBreadcrums={useBreadcrums}
								breadcrumsData={breadcrumsData}
								listName={listName}
								history={history}
								match={match}
								data={
									(calendarAllDayData ? calendarAllDayData(filterData()):[]).concat(
										calendarEventsData ? calendarEventsData(filterData()):[]
									)
								}
								link={link}
								groupBy={dndGroupAttribute}
								groupData={dndGroupData}
								isTask={isTask}
								setStatuses={setStatuses}
								statuses={statuses}
								allStatuses={allStatuses}
								Edit={Edit}
								/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
	/*
}
const mapStateToProps = ({ filterReducer, showDataReducer }) => {
	return { search:filterReducer.search ,filter:showDataReducer.filter };
};

export default connect(mapStateToProps, { setSearch, setFilter, addShowDataFilter })(ShowDataContainer);*/
