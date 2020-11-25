import React from 'react';
import {
  useQuery,
  useMutation,
  gql,
  useApolloClient
}
from "@apollo/client";
import {
  Card,
  CardHeader,
  CardBody
} from 'reactstrap';
import CommandBar from './commandBar';
import ListHeader from './listHeader';
import classnames from 'classnames';
import {
  fromMomentToUnix,
  updateArrayItem
} from 'helperFunctions';
import moment from 'moment';
import {
  DragDropContext,
  Droppable,
  Draggable
} from 'react-beautiful-dnd';

import {
  UPDATE_TASK,
  GET_TASK,
  GET_TASKS,
} from 'helpdesk/task/querries';

export default function TaskListDnD( props ) {
  const {
    history,
    match,
    link,
    commandBar,
    listName,
    statuses,
    setStatuses,
    allStatuses,
    displayValues,
    groupBy,
    groupData,
    displayCol,
    data,
    deleteTask,
    checkTask,
    isTask,
    useBreadcrums,
    breadcrumsData,
    filterId,
    filterValues,
    originalProjectId,
  } = props;

  const [ updateTask ] = useMutation( UPDATE_TASK );

  const client = useApolloClient();

  const groupDataFunc = () => {
    let grouped = [];
    groupData.forEach( ( groupItem ) => grouped.push( {
      groupItem: {
        ...groupItem,
        title: groupItem.title ? groupItem.title : 'Undefined title',
        color: groupItem.color ? groupItem.color : '#b8d9db'
      },
      data: data.filter( ( dataItem ) => dataItem[ groupBy ] !== undefined && dataItem[ groupBy ].id === groupItem.id )
    } ) );
    return grouped;
  }

  const groupRest = () => {
    let ids = groupData.map( ( groupItem ) => groupItem.id );
    return data.filter( ( dataItem ) => dataItem[ groupBy ] === undefined || !ids.includes( dataItem[ groupBy ].id ) );
  }

  const updateTaskFunc = ( id, status, updateData ) => {
    updateTask( {
        variables: updateData
      } )
      .then( ( response ) => {
        try {
          const originalTask = client.readQuery( {
              query: GET_TASK,
              variables: {
                id
              },
            } )
            .task;

          const updatedTask = {
            ...originalTask,
            ...updateData
          }

          client.writeQuery( {
            query: GET_TASK,
            variables: {
              id
            },
            data: {
              task: updatedTask
            }
          } );
        } catch ( e ) {
          console.log( e.message );
        }

        try {
          //update tasks if project changed or not
          let execTasks = client.readQuery( {
              query: GET_TASKS,
              variables: {
                filterId,
                filter: filterValues,
                projectId: originalProjectId
              }
            } )
            .tasks;

          const updatedTask = {
            ...execTasks.tasks.find( task => task.id === id ),
            ...updateData
          };
          console.log( execTasks );

          client.writeQuery( {
            query: GET_TASKS,
            variables: {
              filterId,
              filter: filterValues,
              projectId: originalProjectId
            },
            data: {
              tasks: {
                ...execTasks,
                tasks: updateArrayItem( execTasks.tasks, updatedTask )
              }
            }
          } );
        } catch ( e ) {
          console.log( e.message );
        } finally {

        }
      } )
      .catch( ( err ) => {
        console.log( err.message );
      } );
  }

  const onDragEnd = ( {
    source,
    destination
  } ) => {
    if ( source !== null && destination !== null && parseInt( source.droppableId ) === parseInt( destination.droppableId ) ) return;
    const groups = (
      statuses.length === 0 ?
      groupDataFunc() :
      groupDataFunc()
      .filter( item => statuses.includes( item.groupItem.id ) )
    );

    const tagetStatus = allStatuses.find( ( status ) => status.id === parseInt( destination.droppableId ) )
    const item = groups.find( ( group ) => group.groupItem.id === parseInt( source.droppableId ) )
      .data[ source.index ];
    let updateData = {
      id: item.id,
      status: tagetStatus.id,
    };
    if ( tagetStatus.action === 'PendingDate' ) {
      updateData.pendingDate = fromMomentToUnix( moment()
          .add( 1, 'days' ) )
        .toString();
      updateData.pendingChangable = true;
    } else if ( tagetStatus.action === 'CloseDate' || tagetStatus.action === 'CloseInvalid' ) {
      updateData.important = false;
    }
    updateTaskFunc( item.id, tagetStatus, updateData );
  }

  const GROUP_DATA = (
    statuses.length === 0 ?
    groupDataFunc() :
    groupDataFunc()
    .filter( item => statuses.includes( item.groupItem.id ) )
  );
  return (
    <div>
				<CommandBar {...commandBar} listName={listName} />
				<div className="scroll-visible overflow-x fit-with-header-and-commandbar task-container">
					<ListHeader
						{...commandBar}
						listName={listName}
						useBreadcrums={useBreadcrums}
						breadcrumsData={breadcrumsData}
						statuses={statuses}
						setStatuses={setStatuses}
						allStatuses={allStatuses}
						/>
					<div className="flex-row">
						<DragDropContext onDragEnd={onDragEnd}>
							{ GROUP_DATA.filter( (group) => group.groupItem.action !== 'invoiced' ).map((group)=>
								<Card className="dnd-column" key={group.groupItem.id}>
									<CardHeader className="dnd-header">{group.groupItem.title}</CardHeader>
									<Droppable droppableId={group.groupItem.id.toString()}>
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
																		history.push(link+'/'+item.id);
																	}}
																	key={item.id}>
																	{displayCol(item)}
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
												history.push(link+'/'+item.id);
											}}
											key={item.id}>
											{displayCol(item)}
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
							groupRest().length>0 &&
							<Card className="dnd-column" key="Undefined group">
								<CardHeader style={{backgroundColor:'#b8d9db'}}>Undefined group</CardHeader>
								<CardBody>
									{
										groupRest().map((item)=>
										<ul
											className={classnames("taskCol", "clickable", "list-unstyled")}
											onClick={(e)=>{
												history.push(link+'/'+item.id);
											}}
											key={item.id}>
											{displayCol(item)}
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