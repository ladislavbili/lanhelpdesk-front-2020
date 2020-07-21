import React, { Component } from 'react';
import TaskCol from './taskCol';
import TaskList from './taskList';
import TaskListDnD from './taskListDnD';
import { connect } from "react-redux";
import {timestampToString} from '../../helperFunctions';
import {setSearch, setFilter,addShowDataFilter } from '../../redux/actions';

class ShowDataContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search: this.props.search
		};
		this.filterData.bind(this);
		this.addShowDataFilter.bind(this);
		this.addShowDataFilter();
	}

	addShowDataFilter(){
		if(this.props.filter[this.props.filterName]===undefined){
			let defaultFilter={};
			this.props.displayValues.forEach((display)=>{
				defaultFilter[display.value]=''
			})
			this.props.addShowDataFilter(this.props.filterName,defaultFilter);
		}

	}

	filterData(){
		return this.props.data.filter((item)=>{
			let filterString="";
			this.props.filterBy.forEach((value)=>{
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
			return filterString.toLowerCase().includes(this.props.search.toLowerCase());
		}).sort((item1,item2)=>{
			let val1 = this.getSortValue(item1);
			let val2 = this.getSortValue(item2);
			if(this.props.ascending){
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
	getSortValue(item){
		let value = this.props.orderByValues.find((val)=>val.value===this.props.orderBy);
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

	render() {

		return (
			<div className="content-page">
				<div className="content" style={{ paddingTop: 0 }}>
					<div className="row m-0">
						{this.props.layout === 0 && (
							<div className={'' + (this.state.filterView ? 'col-xl-9' : 'col-xl-12')}>
								<TaskCol
									commandBar={this.props}
									useBreadcrums={this.props.useBreadcrums}
									breadcrumsData={this.props.breadcrumsData}
									listName={this.props.listName}
									history={this.props.history}
									empty={this.props.empty}
									match={this.props.match}
									data={this.filterData()}
									itemID={this.props.itemID}
									link={this.props.link}
									displayCol={this.props.displayCol}
									isTask={this.props.isTask}
									setStatuses={this.props.setStatuses}
									statuses={this.props.statuses}
									allStatuses={this.props.allStatuses}
									edit={this.props.edit}
									/>
							</div>
						)}


						{this.props.layout === 1 && this.props.filter[this.props.filterName]!==undefined && (
							<div className={'' + (this.state.filterView ? 'col-xl-9' : 'col-xl-12')}>
								{this.props.itemID && <this.props.edit match={this.props.match} columns={false} history={this.props.history} />}
								{!this.props.itemID &&
									<TaskList
										commandBar={this.props}
										useBreadcrums={this.props.useBreadcrums}
										breadcrumsData={this.props.breadcrumsData}
										listName={this.props.listName}
										history={this.props.history}
										match={this.props.match}
										data={this.filterData()}
										displayValues={this.props.displayValues}
										filterName={this.props.filterName}
										isTask={this.props.isTask}
										setStatuses={this.props.setStatuses}
										statuses={this.props.statuses}
										allStatuses={this.props.allStatuses}
										link={this.props.link}
										checkTask={this.props.checkTask}
										deleteTask={this.props.deleteTask}
										/>}
							</div>
						)}

						{this.props.layout === 2 && (
							<div className={'' + (this.state.filterView ? 'col-xl-9' : 'col-xl-12')}>
								{this.props.itemID && <this.props.edit match={this.props.match} columns={false} history={this.props.history} />}
								{!this.props.itemID &&
									<TaskListDnD
										commandBar={this.props}
										useBreadcrums={this.props.useBreadcrums}
										breadcrumsData={this.props.breadcrumsData}
										listName={this.props.listName}
										history={this.props.history}
										match={this.props.match}
										data={this.filterData()}
										displayValues={this.props.displayValues}
										displayCol={this.props.displayCol}
										link={this.props.link}
										groupBy={this.props.dndGroupAttribute}
										groupData={this.props.dndGroupData}
										isTask={this.props.isTask}
										setStatuses={this.props.setStatuses}
										statuses={this.props.statuses}
										allStatuses={this.props.allStatuses}
										/>
								}
							</div>
						)}
						{this.props.layout === 3 && (
							<div className={'' + (this.state.filterView ? 'col-xl-9' : 'col-xl-12')}>
								<this.props.calendar
									commandBar={this.props}
									useBreadcrums={this.props.useBreadcrums}
									breadcrumsData={this.props.breadcrumsData}
									listName={this.props.listName}
									history={this.props.history}
									match={this.props.match}
									data={
										(this.props.calendarAllDayData ? this.props.calendarAllDayData(this.filterData()):[]).concat(
											this.props.calendarEventsData ? this.props.calendarEventsData(this.filterData()):[]
										)
									}
									link={this.props.link}
									groupBy={this.props.dndGroupAttribute}
									groupData={this.props.dndGroupData}
									isTask={this.props.isTask}
									setStatuses={this.props.setStatuses}
									statuses={this.props.statuses}
									allStatuses={this.props.allStatuses}
									edit={this.props.edit}
									/>
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ filterReducer, showDataReducer }) => {
	return { search:filterReducer.search ,filter:showDataReducer.filter };
};

export default connect(mapStateToProps, { setSearch, setFilter, addShowDataFilter })(ShowDataContainer);
