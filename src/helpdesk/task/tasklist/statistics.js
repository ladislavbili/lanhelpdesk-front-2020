import React from 'react';
import CommandBar from './components/commandBar';
import {
  timestampToString,
} from 'helperFunctions';

export default function Statistics( props ) {

  const {
    tasks
  } = props;

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
    } );

  return (
    <div>
      <CommandBar
        {...props}
        />
      <div className="full-width scroll-visible fit-with-header-and-commandbar-4 task-container">
        <div className="statistics">
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
              <tr>
                <th colSpan="10" className="m-l-8 m-t-5 h2">Number of tasks</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>
                  Spolu
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
            </tbody>

            <thead>
              <tr>
                <td className="m-l-8 m-t-5 h2">Hodiny</td>
                { statistics.map((item) => (
                  <td key={item.status.id} className="v-a-b" style={{borderTop: "none"}}>
                    <div style={{ paddingTop: 'inherit' }}>
                      hod.
                    </div>
                  </td>
                ) ) }
                <td className="v-a-b" style={{borderTop: "none"}}>
                  hod.
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Neschvalené
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
                  Schvalené
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
                  Spolu
                </td>
                { statistics.map((item) => (
                  <td key={item.status.id}>
                    { item.metadata.subtasksPending + item.metadata.subtasksApproved }
                  </td>
                ) ) }
                <td>
                  { totals.metadata.subtasksPending + totals.metadata.subtasksApproved }
                </td>
              </tr>
            </tbody>

            <thead>
              <tr>
                <td className="m-l-8 m-t-5 h2">Výjazdy</td>
                { statistics.map((item) => (
                  <td key={item.status.id} className="v-a-b" style={{borderTop: "none"}}>
                    <div style={{ paddingTop: 'inherit' }}>
                      ks.
                    </div>
                  </td>
                ) ) }
                <td className="v-a-b" style={{borderTop: "none"}}>
                  ks.
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Neschválené
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
                  Schvalené
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
                  Spolu
                </td>
                { statistics.map((item) => (
                  <td key={item.status.id}>
                    { item.metadata.tripsPending + item.metadata.tripsApproved }
                  </td>
                ) ) }
                <td>
                  { totals.metadata.tripsPending + totals.metadata.tripsApproved }
                </td>
              </tr>
            </tbody>

            <thead>
              <tr>
                <td className="m-l-8 m-t-5 h2">Materiál</td>
                { statistics.map((item) => (
                  <td key={item.status.id} className="v-a-b" style={{borderTop: "none"}}>
                    <div style={{ paddingTop: 'inherit' }}>
                      ks.
                    </div>
                  </td>
                ) ) }
                <td className="v-a-b" style={{borderTop: "none"}}>
                  ks.
                </td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Neschvalený
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
                  Schvalený
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
                  Spolu
                </td>
                { statistics.map((item) => (
                  <td key={item.status.id}>
                    { item.metadata.materialsPending + item.metadata.materialsApproved }
                  </td>
                ) ) }
                <td>
                  {
                    totals.metadata.materialsPending + totals.metadata.materialsApproved
                  }
                </td>
              </tr>
            </tbody>

            <thead>
              <tr>
                <td className="m-l-8 m-t-5 h2">Voľné položky</td>
                { statistics.map((item) => (
                  <td key={item.status.id} className="v-a-b" style={{borderTop: "none"}}>
                    <div style={{ paddingTop: 'inherit' }}>
                      ks.
                    </div>
                  </td>
                ) ) }
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Schvalené
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
                  Neschválené
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
                    { item.metadata.itemsPending + item.metadata.itemsApproved }
                  </td>
                ) ) }
                <td>
                  {
                    totals.metadata.itemsPending + totals.metadata.itemsApproved
                  }
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}