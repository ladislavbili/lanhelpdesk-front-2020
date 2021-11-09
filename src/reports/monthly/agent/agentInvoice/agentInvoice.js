import React from 'react';

import Loading from 'components/loading';
import ModalTaskEdit from 'helpdesk/task/edit/modalEdit';

import {
  timestampToDate,
} from 'helperFunctions';

export default function AgentInvoice( props ) {
  const {
    invoice,
    invoiced,
    agent,
    fromDate,
    toDate,
    invoiceRefetch,
  } = props;

  const {
    workTasks,
    taskTypeTotals,
    tripTasks,
    tripTypeTotals,
    totals,
  } = invoice;

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
          { workTasks.map((task) => (
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
              <td>{isNaN(parseInt(task.closeDate)) ? 'Not closed yet' : timestampToDate(parseInt(task.closeDate))}</td>
              <td colSpan="3" style={{padding:0}}>
                <table className="table-borderless full-width">
                  <tbody>
                    {task.subtasks.map( (subtask) => (
                      <tr key={subtask.id}>
                        <td key={subtask.id+ '-title'} style={{}}>{subtask.title}</td>
                        <td key={subtask.id+ '-type'} style={{width:'150px', }}>{task.taskType.title}</td>
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
          { taskTypeTotals.map((taskType) => (
            <tr key={taskType.id}>
              <td>{taskType.title}</td>
              <td>{taskType.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="m-0">
        {`Spolu počet hodín: ${ totals.workHours }`}
      </p>
      <p className="m-0 m-b-10">
        { `Spolu počet hodín mimo pracovný čas: ${ totals.workOvertime } ( Čísla úloh: ${ totals.workOvertimeTasks.join(',') })` }
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
          { tripTasks.map((task) =>
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
              <td>{isNaN(parseInt(task.closeDate)) ? 'Not closed yet' : timestampToDate(parseInt(task.closeDate))}</td>
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
          { tripTypeTotals.map((tripType) => (
            <tr key={tripType.id}>
              <td>{tripType.title}</td>
              <td>{tripType.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="m-0">
        {`Spolu počet výjazdov: ${ totals.tripHours }`}
      </p>
      <p className="m-0 m-b-10">
        { `Spolu počet výjazdov mimo pracovný čas: ${ totals.tripOvertime } ( Čísla úloh: ${ totals.tripOvertimeTasks.join(',') })` }
      </p>

      <h3>Sumár podľa typu práce a výjazdov - v rámci paušálu, nad rámec paušálu, projektových</h3>
      <table className="table m-b-10 bkg-white row-highlight max-width-700">
        <tbody>
          { invoiced &&
            <tr>
              <td>Počet prác vrámci paušálu</td>
              <td>{ totals.pausalWorkHours }</td>
            </tr>
          }
          { invoiced &&
          <tr>
            <td>Počet prác nad rámec paušálu</td>
            <td>{ totals.overPausalWorkHours }</td>
          </tr>
        }
        { !invoiced &&
          <tr>
            <td>Počet prác vrámci a nad rámec paušálu</td>
            <td>{ totals.pausalWorkHours }</td>
          </tr>
        }
          <tr>
            <td>Projektové práce</td>
            <td>{ totals.projectWorkHours }</td>
          </tr>

        { invoiced &&
          <tr>
            <td>Výjazdy vrámci paušálu</td>
            <td>{ totals.pausalTripHours }</td>
          </tr>
        }
        { invoiced &&
          <tr>
            <td>Výjazdy nad rámec paušálu</td>
            <td>{ totals.overPausalTripHours }</td>
          </tr>
        }
        { !invoiced &&
          <tr>
            <td>Výjazdy vrámci nad rámec paušálu</td>
            <td>{ totals.pausalTripHours }</td>
          </tr>
        }
          <tr>
            <td>Výjazdy pri projektových prácach</td>
            <td>{ totals.projectTripHours }</td>
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