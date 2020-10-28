import React from 'react';
import {
  useQuery,
  useMutation,
  useApolloClient
} from "@apollo/client";
import { gql } from '@apollo/client';;

import Loading from 'components/loading';

import ShowData from '../../components/showData';
import {
  timestampToString,
  orderArr
} from 'helperFunctions';
import {
  getEmptyFilter
} from 'configs/constants/filter';
import TaskEdit from './taskEdit';
import TaskEmpty from './taskEmpty';
import TaskCalendar from '../calendar';
//TODO remove and make work
const filter = () => ( {} );
const generalFilter = () => ( {} );
const project = () => ( {} );

const GET_TASKS = gql `
query tasks($filter: FilterInput, $projectId: Int){
  tasks (
    filter: $filter,
    projectId: $projectId,
  ){
		tasks {
			id
			title
			updatedAt
			createdAt
			important
			closeDate
			overtime
			pausal
			pendingChangable
			statusChange
			assignedTo {
				id
				fullName
				email
			}
			company {
				id
				title
			}
			createdBy {
				id
				name
				surname
			}
			deadline
			description
			milestone{
				id
				title
			}
			pendingDate
			project{
				id
				title
			}
			requester{
				id
				name
				surname
				fullName
				email
			}
			status {
				id
				title
				color
				action
			}
			tags {
				id
				title
			}
			taskType {
				id
				title
			}
			repeat {
				repeatEvery
				repeatInterval
				startsAt
			}
		}
    execTime
    secondaryTimes {
      time
      source
    }
  }
}
`;

const GET_MY_DATA = gql `
query {
  getMyData{
    id
		statuses {
			id
			title
			color
			action
		}
		company {
			id
			title
		}
    role {
			level
      accessRights {
        projects
        publicFilters
      }
    }
  }
}
`;

const LOCAL_CACHE = gql `
  query getLocalCache {
    projectName @client
    filterName @client
    milestone @client {
        id
        title
        label
        value
    }
  }
`;

const DELETE_TASK = gql `
mutation deleteTask($id: Int!) {
  deleteTask(
    id: $id,
  ){
    id
  }
}
`;

const SET_USER_STATUSES = gql `
mutation setUserStatuses($ids: [Int]!) {
  setUserStatuses(
    ids: $ids
  ){
		id
  }
}
`;

const GET_STATUSES = gql `
query {
  statuses {
    title
    id
    order
  }
}
`;

export default function TasksIndex( props ) {
  const {
    history,
    match,
    //calendarEvents
  } = props;
  const {
    data,
    loading
  } = useQuery( GET_MY_DATA );

  let mappedFilter = {
    ...filter()
  };
  mappedFilter.requester = mappedFilter.requester ? mappedFilter.requester.id : null;
  mappedFilter.assignedTo = mappedFilter.assignedTo ? mappedFilter.assignedTo.id : null;
  mappedFilter.company = mappedFilter.company ? mappedFilter.company.id : null;
  delete mappedFilter.__typename;

  /*
    const {
      data: tasksData,
      loading: tasksLoading
    } = useQuery( GET_TASKS, {
      variables: {
        filterId: ( generalFilter() ? generalFilter()
          .id : null ),
        filter: mappedFilter,
        projectId: ( project()
          .id !== null ? project()
          .id : null )
      }
    } );
  */
  const tasksLoading = true;
  const taskData = {
    tasks: []
  };
  const {
    data: localCache
  } = useQuery( LOCAL_CACHE );
  const [ deleteTask ] = useMutation( DELETE_TASK );
  const [ setUserStatuses ] = useMutation( SET_USER_STATUSES );
  const {
    data: statusesData,
    loading: statusesLoading
  } = useQuery( GET_STATUSES );
  const statuses = ( statusesLoading || !statusesData ? [] : orderArr( statusesData.statuses ) );

  const currentUser = data ? data.getMyData : {};
  const client = useApolloClient();

  const [ filterName, setFilterName ] = React.useState( generalFilter ? generalFilter.title : "" );
  const [ tasks, setTasks ] = React.useState( [] );

  React.useEffect( () => {
    setFilterName( generalFilter ? generalFilter.title : "" );
  }, [ match.params.listID ] );

  React.useEffect( () => {
    if ( !tasksLoading ) {
      setTasks( tasksData && tasksData.tasks && tasksData.tasks.tasks ? tasksData.tasks.tasks : [] );
    }
  }, [ tasksLoading ] );

  const getBreadcrumsData = () => {
    return [ {
        type: 'project',
        show: true,
        data: localCache ? localCache.projectName : null,
        label: localCache ? localCache.projectName : 'Invalid project',
        onClick: () => {
          client.writeData( {
            data: {
              milestone: null,
            }
          } );
          filter( getEmptyFilter() );
          generalFilter( null );
          history.push( '/helpdesk/taskList/i/all' );
        }
      },
      {
        type: 'milestone',
        show: true,
        data: localCache ? localCache.milestone : null,
        label: localCache && localCache.milestone ? localCache.milestone.label : 'Invalid milestone',
        onClick: () => {
          filter( getEmptyFilter() );
          generalFilter( null );
          history.push( '/helpdesk/taskList/i/all' );
        }
      },
      {
        type: 'filter',
        show: true,
        data: localCache ? localCache.filterName : null,
        label: localCache ? localCache.filterName : 'Invalid filter',
        onClick: () => {}
      }
    ]
  }

  const displayCol = ( task ) => {
    return ( <li>
				<div className="taskCol-title">
					<span className="attribute-label">#{task.id} | </span> {task.title}
				</div>
				<div className="taskCol-body">
					<p className="pull-right m-0">
						<span className="label label-info" style={{backgroundColor:task.status && task.status.color?task.status.color:'white'}}>
							{task.status?task.status.title:'Neznámy status'}
						</span>
					</p>
					<p>
						<span>
							<span className="attribute-label">Requested by: </span>
									{task.requester?(" " + task.requester.fullName):' Neznámy používateľ '}
						</span>
					</p>
					<p className="pull-right">
						<span>
							<span className="attribute-label">	<i className="fa fa-star-of-life" /> </span>
							{task.createdAt?timestampToString(task.createdAt):'None'}
						</span>
					</p>
					<p>
						<span>
							<span className="attribute-label">From </span>
							{task.company ? task.company.title : " Unknown"}
						</span>
					</p>

					<p className="pull-right">
						<span>
							<img
								className="dnd-item-icon"
								src={require('../../scss/icons/excl-triangle.svg')}
								alt="Generic placeholder XX"
								/>
							{task.deadline?timestampToString(task.deadline):'None'}
						</span>
					</p>
					<p >
						<span style={{textOverflow: 'ellipsis'}}>
							<span className="attribute-label">Assigned: </span>
							{task.assignedTo?task.assignedTo.reduce((total,user)=>total+=user.fullName+', ','').slice(0,-2):'Neznámy používateľ'}</span>
					</p>
				</div>

					<div className="taskCol-tags">
						{task.tags.map((tag)=>
							<span key={tag.id} className="label label-info m-r-5" style={{backgroundColor: tag.color, color: "white"}}>{tag.title}</span>
						)}
					</div>

			</li> )
  }

  /*
  const displayCal = ( task, showEvent ) => {
    return ( <div style={ showEvent ? { backgroundColor:'#eaf6ff', borderRadius:5 } : {} }>
					<p className="m-0">
						{showEvent && <span className="label label-event">
						Event
					</span>}
						<span className="label label-info" style={{backgroundColor:task.status && task.status.color?task.status.color:'white'}}>
							{task.status?task.status.title:'Neznámy status'}
						</span>
						<span className="attribute-label m-l-3">#{task.id} | {task.title}</span>
					</p>
					{false &&  <p className="m-0">
						<span className="m-l-3">
							<span className="attribute-label">Requested by: </span>
									{task.requester?(" " + task.requester.fullName):' Neznámy používateľ '}
						</span>
						<span className="m-l-3">
							<span className="attribute-label">	<i className="fa fa-star-of-life" /> </span>
							{task.createdAt?timestampToString(task.createdAt):'None'}
						</span>
						<span className="m-l-3">
							<span className="attribute-label">From: </span>
							{task.company ? task.company.title : " Unknown"}
						</span>
						<span className="m-l-3">
							<span className="attribute-label">Deadline: </span>
							{task.deadline?timestampToString(task.deadline):'None'}
						</span>
						<span className="m-l-3">
							<span className="attribute-label">Assigned: </span>
							{task.assignedTo?task.assignedTo.reduce((total,user)=>total+=user.fullName+', ','').slice(0,-2):'Neznámy používateľ'}
						</span>
					</p>}
			</div> )
  }
  */

  const filterTasks = () => {
    let newTasks = tasks.map( ( task ) => {
      return {
        ...task,
        viewOnly: getViewOnly( task, task.status, task.project ),
        checked: task.checked ? task.checked : false,
      }
    } );
    let filteredTasks = [];
    if ( localCache ) {
      filteredTasks = newTasks.filter( ( task ) => {
        if ( task.project && task.milestone ) {
          return task.milestone.id === localCache.milestone.id
        }
        return true;
      } );
    }
    return filteredTasks;
  }

  const getViewOnly = ( task, status, project ) => {
    if ( project === undefined ) {
      return true;
    }
    let permission = {};
    if ( project.projectRights ) {
      permission = project.projectRights.find( ( permission ) => permission.user.id === currentUser.id );
    }
    return ( ( permission === undefined || !permission.write ) && currentUser.role.level === 0 ) || ( status && status.action === 'Invoiced' );
  }

  const checkTask = ( id, check ) => {
    let newTasks = tasks.map( ( task ) => {
      if ( task.id === id ) {
        return {
          ...task,
          checked: check
        }
      } else if ( id === 'all' ) {
        return {
          ...task,
          checked: check
        }
      }
      return {
        ...task
      }
    } );

    setTasks( newTasks );
  }

  const deleteTaskFunc = () => {
    if ( window.confirm( "Are you sure?" ) ) {
      let filteredTasks = filterTasks();
      let tasksToDelete = filteredTasks.filter( task => task.checked );
      let failedTasks = tasksToDelete.filter( ( task ) => task.viewOnly );
      tasksToDelete = tasksToDelete.filter( task => !task.viewOnly );
      let newTasks = tasks.filter( task1 => !tasksToDelete.some( ( task2 ) => task1.id === task2.id ) );

      tasksToDelete.forEach( task => {
        deleteTask( {
            variables: {
              id: task.id,
            }
          } )
          .then( ( response ) => {} )
          .catch( ( err ) => {
            console.log( err.message );
            console.log( err );
          } );
      } );

      tasks( newTasks );

      if ( failedTasks.length > 0 ) {
        window.alert( `${tasksToDelete.length} were deleted. Some tasks couln't be deleted. This includes: \n` + failedTasks.reduce( ( acc, task ) => acc + `${task.id} ${task.title} \n`, '' ) )
      }
    }
  }

  const setUserStatusesFunc = ( ids ) => {
    setUserStatuses( {
        variables: {
          ids
        }
      } )
      .then( ( response ) => {} )
      .catch( ( err ) => {
        console.log( err.message );
      } );
  }

  const getCalendarEventsData = ( tasks ) => {
    /*let taskIDs = tasks.map((task)=>task.id);
    return this.props.calendarEvents.filter((event)=>taskIDs.includes(event.taskID)).map((event)=>{
    	let task = tasks.find((task)=>event.taskID===task.id);
    	return {
    		...task,
    		isTask:false,
    		eventID:event.id,
    		titleFunction:this.displayCal,
    		start:new Date(event.start),
    		end:new Date(event.end),
    	}
    })*/
  }

  const getCalendarAllDayData = ( tasks ) => {
    /*return tasks.map((task) => {
    	let newTask = {
    		...task,
    		isTask:true,
    		titleFunction:this.displayCal,
    		allDay: !task.status || task.status.action !== 'pendingOLD',
    	}
    	if(!task.status){
    		return {
    			...newTask,
    			status: this.props.statuses.find((status)=>status.action==='new'),
    			start:new Date(),
    		}
    	}
    	switch (task.status.action) {
    		case 'invoiced':{
    			return {
    				...newTask,
    				start:new Date(task.invoicedDate),
    			}
    		}
    		case 'close':{
    			return {
    				...newTask,
    				start:new Date(task.closeDate),
    			}
    		}
    		case 'invalid':{
    			return {
    				...newTask,
    				start:new Date(task.closeDate),
    			}
    		}
    		case 'pending':{
    			return {
    				...newTask,
    				start:new Date(task.pendingDate),
    				//end:new Date(task.pendingDateTo ? task.pendingDateTo: fromMomentToUnix(moment(task.pendingDate).add(30,'minutes')) ),
    			}
    		}
    		default:{
    			return {
    				...newTask,
    				start:new Date(),
    			}
    		}
    	}
    }).map((task)=>({...task,end: task.status.action !== 'pendingOLD' ? task.start : task.end }))*/
  }

  const dataLoading = loading || tasksLoading;

  if ( dataLoading ) {
    return ( <Loading /> );
  }

  let link = '';
  if ( match.params.hasOwnProperty( 'listID' ) ) {
    link = '/helpdesk/taskList/i/' + match.params.listID;
  } else {
    link = '/helpdesk/taskList'
  }
  return (
      <ShowData
			data={filterTasks()}
			filterBy={[
				{value:'assignedTo',type:'list',func:((total,user)=>total+=user.email+' '+user.fullName+' ')},
				//		{value:'tags',type:'list',func:((cur,item)=>cur+item.title+' ')},
				{value:'statusChange',type:'date'},
				{value:'createdAt',type:'date'},
				{value:'requester',type:'user'},
				{value:'deadline',type:'date'},
				{value:'status',type:'object'},
				{value:'title',type:'text'},
				{value:'id',type:'int'},
				{value:'company',type:'object'},
			]}
			displayCol={displayCol}
			filterName="help-tasks"
			displayValues={[
				{value:'checked', label: '', type:'checkbox'},
				{value:'important',label:'',type:'important'},
				{value:'title',label:'Title',type:'text'},
				{value:'id',label:'ID',type:'int'},
				{value:'status',label:'Status',type:'object'},
				{value:'requester',label:'Requester',type:'user'},
				{value:'company',label:'Company',type:'object'},
				{value:'assignedTo',label:'Assigned',type:'list',func:(items)=>
					(<div>
						{
							items.map((item)=><div key={item.id}>{item.fullName}</div>)
						}
					</div>)
				},
				{value:'createdAt',label:'Created at',type:'date'},
				/*		{value:'tags',label:'Tags',type:'list',func:(items)=>
							(<div>
							{items.map((item)=>
								<span key={item.id} className="label label-info m-r-5">{item.title}</span>)
							}
							</div>)
						},*/
				{value:'deadline',label:'Deadline',type:'date'}
			]}
			orderByValues={[
				{value:'id',label:'ID',type:'int'},
				{value:'status',label:'Status',type:'object'},
				{value:'title',label:'Title',type:'text'},
				{value:'requester',label:'Requester',type:'user'},
				{value:'assignedTo',label:'Assigned',type:'list',func:((total,user)=>total+=user.email+' '+user.name+' '+user.surname+' ')},
				{value:'createdAt',label:'Created at',type:'date'},
				//		{value:'tags',label:'Tags',type:'list',func:((cur,item)=>cur+item.title+' ')},
				{value:'deadline',label:'Deadline',type:'date'}
			]}
			dndGroupAttribute="status"
			dndGroupData={statuses}
			calendar={TaskCalendar}
			calendarAllDayData={getCalendarAllDayData}
			calendarEventsData={getCalendarEventsData}
			link={link}
			history={history}
			itemID={match.params.taskID ? match.params.taskID : ""}
			listID={match.params.listID}
			match={match}
			isTask={true}
			listName={filterName}
			Edit={TaskEdit}
			Empty={TaskEmpty}
			useBreadcrums={true}
			breadcrumsData={getBreadcrumsData()}
			setStatuses={setUserStatusesFunc}
			statuses={currentUser.statuses}
			allStatuses={statuses}
			checkTask={checkTask}
			deleteTask={deleteTaskFunc}
		 />
	);
}