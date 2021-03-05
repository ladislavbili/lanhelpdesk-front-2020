import React from 'react';
import {
  timestampToString,
} from 'helperFunctions';

export const displayCol = ( task ) => {
  return (
    <li>
      <div className="taskCol-title">
        <span className="attribute-label">#{task.id} | </span> {task.title}
        </div>
        <div className="taskCol-body">
          <p className="pull-right m-0">
            <span className="label-info" style={{backgroundColor:task.status && task.status.color?task.status.color:'white'}}>
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
              <i
                className="fas fa-exclamation-triangle attribute-label m-r-3"
                />
              {task.deadline?timestampToString(task.deadline):'No deadline'}
            </span>
          </p>
          <p >
            <span style={{textOverflow: 'ellipsis'}}>
              <span className="attribute-label">Assigned: </span>
              {task.assignedTo?task.assignedTo.reduce((total,user)=>total+=user.fullName+', ','').slice(0,-2):'Neznámy používateľ'}</span>
          </p>
        </div>

        { task.tags.length > 0 &&
          <div className="taskCol-tags">
            {task.tags.map((tag)=>
              <span key={tag.id} className="label-info m-r-5" style={{backgroundColor: tag.color, color: "white"}}>{tag.title}</span>
            )}
          </div>
        }
      </li>
  )
}

export const displayCal = ( task, showEvent ) => {
  return (
    <div style={ showEvent ? { backgroundColor:'#eaf6ff', borderRadius:5 } : {} }>
        <p className="m-0">
          {showEvent && <span className="label-event">
            Event
          </span>}
          <span className="label-info" style={{backgroundColor:task.status && task.status.color?task.status.color:'white'}}>
            {task.status?task.status.title:'Neznámy status'}
          </span>
          <span className="attribute-label m-l-3">#{task.id} | {task.title}</span>
        </p>
      </div>
  )
}

export const displayFooter = ( tasks ) => {
  let statistics = [];
  let totals = {
    taskCounter: 0,
    metadata: {
      subtasksApproved: 0,
      subtasksPending: 0,
      tripsApproved: 0,
      tripsPending: 0,
      materialsApproved: 0,
      materialsPending: 0,
      itemsApproved: 0,
      itemsPending: 0,
    }
  }
  tasks.filter( ( task ) => task.status )
    .forEach( ( task ) => {
      const index = statistics.findIndex( ( data ) => data.status.id === task.status.id )
      totals.taskCounter++;
      totals.metadata.subtasksApproved += task.metadata.subtasksApproved;
      totals.metadata.subtasksPending += task.metadata.subtasksPending;
      totals.metadata.tripsApproved += task.metadata.tripsApproved;
      totals.metadata.tripsPending += task.metadata.tripsPending;
      totals.metadata.materialsApproved += task.metadata.materialsApproved;
      totals.metadata.materialsPending += task.metadata.materialsPending;
      totals.metadata.itemsApproved += task.metadata.itemsApproved;
      totals.metadata.itemsPending += task.metadata.itemsPending;
      if ( index !== -1 ) {
        statistics[ index ].taskCounter++;
        statistics[ index ].metadata.subtasksApproved += task.metadata.subtasksApproved;
        statistics[ index ].metadata.subtasksPending += task.metadata.subtasksPending;
        statistics[ index ].metadata.tripsApproved += task.metadata.tripsApproved;
        statistics[ index ].metadata.tripsPending += task.metadata.tripsPending;
        statistics[ index ].metadata.materialsApproved += task.metadata.materialsApproved;
        statistics[ index ].metadata.materialsPending += task.metadata.materialsPending;
        statistics[ index ].metadata.itemsApproved += task.metadata.itemsApproved;
        statistics[ index ].metadata.itemsPending += task.metadata.itemsPending;

      } else {
        statistics.push( {
          status: task.status,
          taskCounter: 1,
          metadata: {
            subtasksApproved: task.metadata.subtasksApproved,
            subtasksPending: task.metadata.subtasksPending,
            tripsApproved: task.metadata.tripsApproved,
            tripsPending: task.metadata.tripsPending,
            materialsApproved: task.metadata.materialsApproved,
            materialsPending: task.metadata.materialsPending,
            itemsApproved: task.metadata.itemsApproved,
            itemsPending: task.metadata.itemsPending,
          }
        } )
      }
    } )
  return (
    <table className="table m-t-20">
          <thead>
            <tr>
              <th>Status</th>
              { statistics.map((item, index) => (
                <th key={index}>
                  <span className="m-r-5 p-l-5 p-r-5" style={{ backgroundColor: item.status.color, color: 'white', borderRadius: 3, fontWeight: 'normal' }}>
                    {item.status.title}
                  </span>
                </th>
              ) ) }
              <th>Spolu</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                Počet úloh
              </td>
              { statistics.map((item) => (
                <td key={item.status.id}>
                  {item.taskCounter}
                </td>
              ) ) }
              <td>
                {totals.taskCounter}
              </td>
            </tr>
            <tr>
              <td>
                Schvalené hodiny
              </td>
              { statistics.map((item) => (
                <td key={item.status.id}>
                  {item.metadata.subtasksApproved}
                </td>
              ) ) }
              <td>
                {totals.metadata.subtasksApproved}
              </td>
            </tr>
            <tr>
              <td>
                Neschvalené hodiny
              </td>
              { statistics.map((item) => (
                <td key={item.status.id}>
                  {item.metadata.subtasksPending}
                </td>
              ) ) }
              <td>
                {totals.metadata.subtasksPending}
              </td>
            </tr>
            <tr>
              <td>
                Schvalené výjazdy
              </td>
              { statistics.map((item) => (
                <td key={item.status.id}>
                  {item.metadata.tripsApproved}
                </td>
              ) ) }
              <td>
                {totals.metadata.tripsApproved}
              </td>
            </tr>
            <tr>
              <td>
                Neschválené výjazdy
              </td>
              { statistics.map((item) => (
                <td key={item.status.id}>
                  {item.metadata.tripsPending}
                </td>
              ) ) }
              <td>
                {totals.metadata.tripsPending}
              </td>
            </tr>
            <tr>
              <td>
                Schvalený materiál
              </td>
              { statistics.map((item) => (
                <td key={item.status.id}>
                  {item.metadata.materialsApproved}
                </td>
              ) ) }
              <td>
                {totals.metadata.materialsApproved}
              </td>
            </tr>
            <tr>
              <td>
                Neschvalený materiál
              </td>
              { statistics.map((item) => (
                <td key={item.status.id}>
                  {item.metadata.materialsPending}
                </td>
              ) ) }
              <td>
                {totals.metadata.materialsPending}
              </td>
            </tr>
            <tr>
              <td>
                Schvalené položky
              </td>
              { statistics.map((item) => (
                <td key={item.status.id}>
                  {item.metadata.itemsApproved}
                </td>
              ) ) }
              <td>
                {totals.metadata.itemsApproved}
              </td>
            </tr>
            <tr>
              <td>
                Neschválené položky
              </td>
              { statistics.map((item) => (
                <td key={item.status.id}>
                  {item.metadata.itemsPending}
                </td>
              ) ) }
              <td>
                {totals.metadata.itemsPending}
              </td>
            </tr>
            <tr>
              <td>
                Spolu hodiny
              </td>
              { statistics.map((item) => (
                <td key={item.status.id}>
                  {
                    item.metadata.subtasksPending +
                    item.metadata.subtasksApproved +
                    item.metadata.tripsPending +
                    item.metadata.tripsApproved +
                    item.metadata.materialsPending +
                    item.metadata.materialsApproved +
                    item.metadata.itemsPending +
                    item.metadata.itemsApproved
                  }
                </td>
              ) ) }
              <td>
                {
                  totals.metadata.subtasksPending +
                  totals.metadata.subtasksApproved +
                  totals.metadata.tripsPending +
                  totals.metadata.tripsApproved +
                  totals.metadata.materialsPending +
                  totals.metadata.materialsApproved +
                  totals.metadata.itemsPending +
                  totals.metadata.itemsApproved
                }
              </td>
            </tr>
          </tbody>
        </table>
  );
}