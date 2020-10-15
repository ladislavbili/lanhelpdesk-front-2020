import React from 'react';
import {
  useQuery,
  useApolloClient
}
from "@apollo/react-hooks";
import gql from "graphql-tag";
import {
  Modal,
  ModalBody
}
from 'reactstrap';
import {
  getItemDisplayValue
}
from '../../helperFunctions';
import CommandBar from './commandBar';
import ListHeader from './listHeader';
import Checkbox from '../checkbox';

import MultipleTaskEdit from '../../helpdesk/task/multipleTaskEdit';
/*
import {
  filterName,
  filter
}
from 'localCache';
*/
/*
const GET_MY_DATA = gql `
query {
  getMyData{
		fullName
  }
}
`;
*/
const LOCAL_CACHE = gql `
  query getLocalCache {
    project @client
    milestone @client
    generalFilter @client {
      id
      createdAt
      updatedAt
      createdBy {
        id
        email
      }
      title
      pub
      global
      dashboard
      order
      filter {
        assignedToCur
        assignedTo {
          id
          email
        }
        requesterCur
        requester {
          id
          email
        }
        companyCur
        company {
          id
          title
        }
        taskType {
          id
          title
        }
        oneOf
        updatedAt

        statusDateFrom
        statusDateFromNow
        statusDateTo
        statusDateToNow
        pendingDateFrom
        pendingDateFromNow
        pendingDateTo
        pendingDateToNow
        closeDateFrom
        closeDateFromNow
        closeDateTo
        closeDateToNow
        deadlineFrom
        deadlineFromNow
        deadlineTo
        deadlineToNow
      }
      roles {
        id
        title
      }
      project {
        id
        title
      }
    }
    filter @client {
      assignedToCur
      assignedTo {
        id
        email
      }
      requesterCur
      requester {
        id
        email
      }
      companyCur
      company {
        id
        title
      }
      taskType {
        id
        title
      }
      oneOf
      updatedAt

      statusDateFrom
      statusDateFromNow
      statusDateTo
      statusDateToNow
      pendingDateFrom
      pendingDateFromNow
      pendingDateTo
      pendingDateToNow
      closeDateFrom
      closeDateFromNow
      closeDateTo
      closeDateToNow
      deadlineFrom
      deadlineFromNow
      deadlineTo
      deadlineToNow
    }
  }
`;

export default function List( props ) {
  const {
    history,
    link,
    commandBar,
    listName,
    statuses,
    setStatuses,
    allStatuses,
    displayValues,
    data,
    deleteTask,
    checkTask
  } = props;
  const [ checkedAll, setCheckedAll ] = React.useState( false );
  const [ editOpen, setEditOpen ] = React.useState( false );
  const {
    data: localCache
  } = useQuery( LOCAL_CACHE );

  const currentUser = data ? data.getMyData : {};
  //const accessRights = currentUser && currentUser.role ? currentUser.role.accessRights : {};

  const client = useApolloClient();

  const clearFilter = () => {
    if ( window.confirm( "Are you sure you want to clear the filter?" ) ) {
      client.writeData( {
        data: {
          showDataFilter: {
            id: "",
            title: "",
            status: "",
            requester: "",
            company: "",
            assignedTo: "",
            createdAt: "",
            deadline: "",
          }
        }
      } );
    }
  }

  //	const selectedFilter = showDataFilter();
  //	console.log(selectedFilter);
  return (
    <div>
				<CommandBar {...commandBar} listName={listName}/>
				<div className="full-width scroll-visible fit-with-header-and-commandbar task-container">
					<ListHeader {...commandBar} listName={listName} statuses={statuses} setStatuses={setStatuses} allStatuses={allStatuses} />
					<table className="table">
						<thead>
								<tr>
									{
										displayValues.map((display,index)=> {
											if(display.type==='important') {
												return null;
											}else if (display.type === 'checkbox'){
												return <th key={display.value} className="row" colSpan={'1'} style={{color: '#0078D4', paddingLeft: "1px", paddingRight: "1px"}}>
													 <div
														 onClick={() => {
															 if( !data.some( (item) => item.checked ) ){
																 window.alert('Please first pick tasks to delete!');
																 return;
															 }
															 if (window.confirm("Are you sure you want to delete checked tasks?")){
																 deleteTask()
															 }
														 }}>
															<i className="far fa-trash-alt clickable"	/>
														</div>
														<div
															className="ml-auto"
															onClick={() => {
																if( !data.some( (item) => item.checked ) ){
																	 window.alert('Please first pick tasks to edit!');
																	 return;
																 }
																 setEditOpen(true);
															}}>
															<i	className="fas fa-pen clickable"/>
														</div>
												 	</th>
											}
											return (
												<th
													style={(display.value === "createdAt" || display.value === "deadline" ? {textAlign: "right"} : {})}
													colSpan={((index===0 || index ===1 || displayValues[index-1].type!=='important') && display.value !== "deadline")?'1':'2'}
													key={display.value}
													width={display.value === 'title' ? "30%" : ((display.value === "id") ? "50px" : '')}>
													{display.label}
												</th>
											)
										}
									)}
								</tr>
							</thead>

							<tbody>
								<tr>
									{
										displayValues.map((display,index)=>{
											if(display.type==='important'){
												return null;
											}else if (display.type === 'checkbox'){
												return <th key={display.value} colSpan={'1'} >
													<Checkbox
														className = "m-l-7 m-t-3 p-l-0"
														value = { checkedAll }
														label = ""
														onChange={(e)=> {checkTask('all', e.target.checked); setCheckedAll(!checkedAll) }}
														highlighted={false}
														/>
												</th>
											}else {
												const value = (localCache.showDataFilter[display.value] === "cur" ? currentUser().fullName : localCache.showDataFilter[display.value]);
												return <th key={display.value} colSpan={((index===0 || index ===1 || displayValues[index-1].type!=='important') )?'1':'2'} >
													<div className={(display.value === "deadline" ? "row" : "")}>

														<div style={{width: "80%"}}>
															<input
																type="text"
																value={ value }
																className="form-control hidden-input"
																style={{fontSize: "12px", marginRight: "10px"}}
																onChange={(e) => {
																	let newShowDataFilter = {...localCache.showDataFilter};
																	newShowDataFilter[display.value] = e.target.value;
																	client.writeData({ data: { showDataFilter: newShowDataFilter } });
																}}/>
															</div>
													{display.value === "deadline" &&
														<div>
															<button type="button" className="btn btn-link waves-effect" onClick={clearFilter}>
																<i
																	className="fas fa-times commandbar-command-icon m-l-8 text-highlight"
																	/>
															</button>
														</div>
													}
												</div>
													</th>
											}
										}
									)}
								</tr>
								{
									data
									.filter((item) =>
									{
										return displayValues
													.every((display)=> {
														let value = getItemDisplayValue(item,display);
														if(display.value === "assignedTo"){
															value = item["assignedTo"].map(item => `${item.name} ${item.surname} (${item.email})`).toString();
														}
														if(display.value === "status"){
															value = item["status"] ? item["status"].title.toString() : "";
														}
														if(display.value === "tags"){
															value = item["tags"].map(item => `${item.title}`).toString();
														}
														if(display.value === "URL"){
															value = item["URL"];
														}
														if(display.value === "password"){
															value = item["password"];
														}
														if(display.value === 'important'){
															return true;
														}
														if(display.value === 'checked'){
															return true;
														}
														let result = value.toString().toLowerCase().includes(localCache.showDataFilter[display.value].toLowerCase());
														return result;
													});
									}).map((item)=>
										<tr
											key={item.id}
											className="clickable">
											{ displayValues
												.map((display,index)=>
												<td
													colSpan={(index===displayValues.length-1)?"2":"1"}
													style={(display.value === "createdAt" || display.value === "deadline" ? {textAlign: "right"} : {})}
													key={display.value}
													className={display.value}
													onClick={(e)=>{
														if (display.type !== 'checkbox'){
															history.push(link+'/'+item.id);
														}
													}}
													>
													{	display.type !== 'checkbox' &&
														getItemDisplayValue(item,display)
													}
													{ display.type === 'checkbox' &&
														<Checkbox
															className = "p-l-0"
															value = { item.checked }
															label = ""
															disabled = { item.viewOnly === true }
															onChange={(e)=> checkTask(item.id, e.target.checked)}
															highlighted={false}
															/>
													}
												</td>
											)}
										</tr>
								)}
							</tbody>
						</table>
				</div>


				<Modal isOpen={editOpen}  >
						<ModalBody className="scrollable" >
	            <MultipleTaskEdit tasks={data.filter(d => d.checked)} close={() => setEditOpen(false)} />
						</ModalBody>
					</Modal>

			</div>
  );
}