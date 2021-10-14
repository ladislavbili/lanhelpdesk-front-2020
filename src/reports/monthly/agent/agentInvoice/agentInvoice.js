import React from 'react';

import Loading from 'components/loading';
import ModalTaskEdit from 'helpdesk/task/edit/modalEdit';

import {
  timestampToDate,
} from 'helperFunctions';

export default function AgentInvoice( props ) {
  const {
    agent,
    tasksData,
    fromDate,
    toDate,
    fakeTaskTypes,
    fakeTripTypes,
  } = props;

  const tasks = tasksData.tasks;


  const [ editedTask, setEditedTask ] = React.useState( null );

  const onClickTask = ( task ) => {
    setEditedTask( task );
  }

  return (
    <div>
      <h2>Mesačný výkaz faktúrovaných prác agenta</h2>
      <div className="flex-row m-b-30">
        <div>
          {`Agent ${agent.fullName} (${agent.email})`}
          <br/>
          Obdobie od: {timestampToDate(fromDate)} do: {timestampToDate(toDate)}
        </div>
      </div>
      <h3>Práce</h3>
      <hr />
      <table className="table m-b-10 bkg-white row-highlight">
        <thead>
          <tr>
            <th>ID</th>
            <th>Názov úlohy</th>
            <th>Zadal</th>
            <th>Firma</th>
            <th>Status</th>
            <th>Close date</th>
            <th>Popis práce</th>
            <th style={{width:'150px'}}>Typ práce</th>
            <th style={{width:'50px'}}>Hodiny</th>
          </tr>
        </thead>
        <tbody>
          { tasks.filter((task) => task.subtasks.length > 0 ).map((task) => (
            <tr key={task.id}>
              <td>{task.id}</td>
              <td className="clickable" onClick={() => onClickTask(task)}>{task.title}</td>
              <td>{task.requester.fullName}</td>
              <td>{task.company ? task.company.title : 'No company'}</td>
              <td>
                <span className="label label-info" style={{backgroundColor:task.status.color}}>
                  {task.status.title}
                </span>
              </td>
              <td>{timestampToDate(parseInt(task.closeDate))}</td>
              <td colSpan="3" style={{padding:0}}>
                <table className="table-borderless full-width">
                  <tbody>
                    {task.subtasks.map( (subtask) => (
                      <tr key={subtask.id}>
                        <td key={subtask.id+ '-title'} style={{}}>{subtask.title}</td>
                        <td key={subtask.id+ '-type'} style={{width:'150px', }}>{subtask.type.title}</td>
                        <td key={subtask.id+ '-time'} style={{width:'50px', }}>{subtask.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <table className="table m-b-10 bkg-white row-highlight max-width-500">
        <thead>
          <tr>
            <th>Typ práce</th>
            <th className="width-100">Počet hodín</th>
          </tr>
        </thead>
        <tbody>
          { fakeTaskTypes.map((taskType) => (
            <tr key={taskType.id}>
              <td>{taskType.title}</td>
              <td>{taskType.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="m-0">
        {`Spolu počet hodín: ${ Math.floor( Math.random() * 450 ) }`}
      </p>
      <p className="m-0 m-b-10">
        { `Spolu počet hodín mimo pracovný čas: ${ Math.floor(Math.random() * 45 ) } ( Čísla úloh: ${ tasks.filter((task) => Math.random() > 0.5 ).map((task) => task.id ).join(',') })` }
      </p>

      <h3>Výjazdy</h3>
      <hr />
      <table className="table m-b-10 bkg-white row-highlight">
        <thead>
          <tr>
            <th>ID</th>
            <th>Názov úlohy</th>
            <th>Zadal</th>
            <th>Firma</th>
            <th>Status</th>
            <th>Close date</th>
            <th style={{width:'150px'}}>Výjazd</th>
            <th style={{width:'50px'}}>Mn.</th>
          </tr>
        </thead>
        <tbody>
          { tasks.filter((task) => task.workTrips.length > 0 ).map((task) =>
            <tr key={task.id}>
              <td>{task.id}</td>
              <td className="clickable" onClick={() => onClickTask(task)}>{task.title}</td>
              <td>{task.requester.fullName}</td>
              <td>{task.company ? task.company.title : 'No company'}</td>
              <td>
                <span className="label label-info" style={{backgroundColor:task.status.color}}>
                  {task.status.title}
                </span>
              </td>
              <td>{timestampToDate(parseInt(task.closeDate))}</td>
              <td colSpan="2" style={{padding:0}}>
                <table className="table-borderless full-width">
                  <tbody>
                    {task.workTrips.map((trip) => (
                      <tr key={trip.id}>
                        <td style={{width:'150px', }}>{trip.type.title}</td>
                        <td style={{width:'50px', }}>{trip.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <table className="table m-b-10 bkg-white row-highlight max-width-500">
        <thead>
          <tr>
            <th>Výjazd</th>
            <th className="width-100">ks</th>
          </tr>
        </thead>
        <tbody>
          { fakeTripTypes.map((tripType) => (
            <tr key={tripType.id}>
              <td>{tripType.title}</td>
              <td>{tripType.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="m-0">
        {`Spolu počet výjazdov: ${ Math.floor( Math.random() * 450 ) }`}
      </p>
      <p className="m-0 m-b-10">
        { `Spolu počet výjazdov mimo pracovný čas: ${ Math.floor(Math.random() * 45 ) } ( Čísla úloh: ${ tasks.filter((task) => Math.random() > 0.5 ).map((task) => task.id ).join(',') })` }
      </p>

      <h3>Sumár podľa typu práce a výjazdov - v rámci paušálu, nad rámec paušálu, projektových</h3>
      <table className="table m-b-10 bkg-white row-highlight max-width-700">
        <tbody>
          <tr>
            <td>Počet prác vrámci paušálu</td>
            <td>{ Math.floor(Math.random() * 160 ) }</td>
          </tr>
          <tr>
            <td>Počet prác nad rámec paušálu</td>
            <td>{ Math.floor(Math.random() * 160 ) }</td>
          </tr>
          <tr>
            <td>Projektové práce</td>
            <td>{ Math.floor(Math.random() * 160 ) }</td>
          </tr>
          <tr>
            <td>Výjazdy vrámci paušálu</td>
            <td>{ Math.floor(Math.random() * 160 ) }</td>
          </tr>
          <tr>
            <td>Výjazdy nad rámec paušálu</td>
            <td>{ Math.floor(Math.random() * 160 ) }</td>
          </tr>
          <tr>
            <td>Výjazdy pri projektových prácach</td>
            <td>{ Math.floor(Math.random() * 160 ) }</td>
          </tr>
        </tbody>
      </table>
      <ModalTaskEdit
        opened={editedTask !== null}
        taskID={ editedTask ? editedTask.id : null }
        closeModal={ (vykazyUpdated) => {
          setEditedTask(null);
          //refresh if changed
        } }
        />
    </div>
  );
}