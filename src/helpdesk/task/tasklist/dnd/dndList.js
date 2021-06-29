import React from 'react';
import {
  useMutation,
  useApolloClient
}
from "@apollo/client";
import {
  Card,
  CardHeader,
  CardBody
} from 'reactstrap';
import CommandBar from '../components/commandBar';
import ItemRender from '../components/columnItemRender';
import Search from '../components/search';
import ActiveSearch from '../components/activeSearch';
import InvoicedColumn from './invoicedColumn';
import StatusColumn from './statusColumn';
import classnames from 'classnames';
import {
  unimplementedAttributes,
} from 'configs/constants/tasks';
import {
  localFilterToValues,
  deleteAttributes,
  updateArrayItem,
  filterUnique,
} from 'helperFunctions';
import moment from 'moment';
import {
  DragDropContext,
  Droppable,
  Draggable
} from 'react-beautiful-dnd';
import {
  addLocalError,
} from 'apollo/localSchema/actions';

import {
  UPDATE_TASK,
  GET_TASK,
  GET_TASKS,
} from 'helpdesk/task/queries';
const limit = 20;

export default function TaskListDnD( props ) {
  const {
    history,
    link,
    localProject,
    localFilter,
    globalStringFilter,
    globalTaskSearch,
    tasks,
    taskVariables,
  } = props;
  const client = useApolloClient();

  const statuses = (
    localProject.project.statuses ?
    localProject.project.statuses :
    filterUnique( tasks.map( ( task ) => task.status ), 'id' )
  )

  const activeSearchHidden = (
    globalStringFilter === null ||
    Object.keys( globalStringFilter )
    .filter( ( filterKey ) => globalStringFilter[ filterKey ].length !== 0 )
    .length === 0
  ) && globalTaskSearch.length === 0;

  const [ updateTask ] = useMutation( UPDATE_TASK );
  const [ changedTask, setChangedTask ] = React.useState( null );

  const onDragEnd = ( props ) => {
    const {
      source,
      destination,
      draggableId,
    } = props;

    if (
      source !== null &&
      destination !== null &&
      parseInt( source.droppableId ) === parseInt( destination.droppableId )
    ) {
      return;
    }

    const originalStatus = statuses.find( ( status ) => status.id === parseInt( source.droppableId ) );
    const targetStatus = statuses.find( ( status ) => status.id === parseInt( destination.droppableId ) );
    let updateData = {
      id: parseInt( draggableId ),
      status: targetStatus.id,
    };
    if ( targetStatus.action === 'PendingDate' ) {
      updateData.pendingDate = moment()
        .add( 1, 'days' )
        .valueOf()
        .toString();
      updateData.pendingChangable = true;
    } else if ( targetStatus.action === 'CloseDate' || targetStatus.action === 'CloseInvalid' ) {
      updateData.important = false;
    }
    updateTaskFunc( originalStatus, targetStatus, updateData );
  }

  const updateTaskFunc = ( originalStatus, newStatus, updateData ) => {
    updateTask( {
        variables: updateData
      } )
      .then( ( response ) => {
        setChangedTask( {
          originalStatus,
          newStatus,
          id: updateData.id,
        } )
      } )
      .catch( ( err ) => {
        addLocalError( err );
      } );
  }

  return (
    <div className="relative">
      <CommandBar
        {...props}
        showSort
        />
      <div className="scroll-visible overflow-x fit-with-header-and-commandbar task-container">
        <Search {...props} />
        <ActiveSearch {...props} includeGlobalSearch />
        <div className="flex-row m-l-30" >
          <DragDropContext onDragEnd={onDragEnd}>
            { statuses
              .filter( (status) => status.action !== 'Invoiced' )
              .map( (status) =>
              <StatusColumn {...props} change={changedTask} status={status} key={status.id} limit={limit} />
            ) }
          </DragDropContext>
          { statuses
            .filter( (status) => status.action === 'Invoiced' )
            .map( (status) =>
            <InvoicedColumn {...props} status={status} key={status.id} limit={limit} />
          )}
        </div>
      </div>
    </div>
  );
}