import React from 'react';
import {
  timestampToString,
} from 'helperFunctions';
import TaskEdit from 'helpdesk/task/edit';
import {
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';


export default function UserInvoice( props ) {
  const {
    invoice,
  } = props;

  const [ editedTask, setEditedTask ] = React.useState( null );
  const onClickTask = ( task ) => {
    setEditedTask( task );
  }

  return (
    <div className="p-20">
      <h2>Mesačný výkaz faktúrovaných prác agenta</h2>
      <div className="flex-row m-b-30">
        <div>
          {`Agent ${invoice.user.fullName} (${invoice.user.email})`}
          <br/>
          {`Obdobie od ${timestampToString(parseInt(invoice.fromDate))} do: ${timestampToString(parseInt(invoice.toDate))}`}
        </div>
      </div>
      <h3>Práce</h3>
      <hr />
      <table className="table m-b-30">
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
          { invoice.subtaskTasks.map((subtaskTask) =>
            <tr key={subtaskTask.task.id}>
              <td>{subtaskTask.task.id}</td>
              <td className="clickable" onClick={() => onClickTask(subtaskTask.task)}>{subtaskTask.task.title}</td>
              <td>{subtaskTask.task.requester.fullName}</td>
              <td>
                {subtaskTask.task.assignedTo.map( (assignedTo) =>
                  <p key={assignedTo.id}>{assignedTo.fullName}</p>
                )}
              </td>
              <td>
                <span className="label label-info" style={{backgroundColor:subtaskTask.task.status.color}}>
                  {subtaskTask.task.status.title}
                </span>
              </td>
              <td>{timestampToString(parseInt(subtaskTask.task.closeDate))}</td>
              <td colSpan="3" style={{padding:0}}>
                <table className="table-borderless full-width">
                  <tbody>
                    {subtaskTask.subtasks.map( (subtaskData) =>
                      <tr key={subtaskData.id}>
                        <td key={subtaskData.id+ '-title'} style={{}}>{subtaskData.subtask.title}</td>
                        <td key={subtaskData.id+ '-type'} style={{width:'150px', }}>{subtaskData.type}</td>
                        <td key={subtaskData.id+ '-time'} style={{width:'50px', }}>{subtaskData.quantity}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <table className="table m-b-10">
        <thead>
          <tr>
            <th>Typ práce</th>
            <th>Počet hodín</th>
          </tr>
        </thead>
        <tbody>
          { invoice.subtaskTotals.map((subtaskTotal) =>
            <tr key={subtaskTotal.type}>
              <td>{subtaskTotal.type}</td>
              <td>{subtaskTotal.quantity}</td>
            </tr>
          )}
        </tbody>
      </table>
      <p className="m-0">Spolu počet hodín: {invoice.subtaskCounts.total}
      </p>
      <p className="m-0">
        Spolu počet hodín mimo pracovný čas: {invoice.subtaskCounts.afterHours}
        {` (Čísla úloh: ${invoice.subtaskCounts.afterHoursTaskIds.toString()})`}
      </p>

      <h3>Výjazdy</h3>
      <hr />
      <table className="table m-b-30">
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
          { invoice.tripTasks.map((tripTask) =>
            <tr key={tripTask.task.id}>
              <td>{tripTask.task.id}</td>
              <td className="clickable" onClick={() => onClickTask(tripTask.task)}>{tripTask.task.title}</td>
              <td>{tripTask.task.requester.fullName}</td>
              <td>
                {tripTask.task.assignedTo.map( (assignedTo) =>
                  <p key={assignedTo.id}>{assignedTo.fullName}</p>
                )}
              </td>
              <td>
                <span className="label label-info" style={{backgroundColor:tripTask.task.status.color}}>
                  {tripTask.task.status.title}
                </span>
              </td>
              <td>{timestampToString(parseInt(tripTask.task.closeDate))}</td>
              <td colSpan="2" style={{padding:0}}>
                <table className="table-borderless full-width">
                  <tbody>
                    {tripTask.trips.map((trip)=>
                      <tr key={trip.id}>
                        <td style={{width:'150px', }}>{trip.type}</td>
                        <td style={{width:'50px', }}>{trip.quantity}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <table className="table m-b-10">
        <thead>
          <tr>
            <th>Výjazd</th>
            <th>ks</th>
          </tr>
        </thead>
        <tbody>
          { invoice.tripTotals.map((tripTotal) =>
            <tr key={tripTotal.type}>
              <td>{tripTotal.type}</td>
              <td>{tripTotal.quantity}</td>
            </tr>
          )}
        </tbody>
      </table>
      <p className="m-0">Spolu počet výjazdov: {invoice.tripCounts.total}
      </p>
      <p className="m-0">
        Spolu počet výjazdov mimo pracovný čas: {invoice.tripCounts.afterHours}
        {` (Čísla úloh: ${invoice.tripCounts.afterHoursTaskIds.toString()})`}
      </p>

      <h3>Sumár podľa typu práce a výjazdov - v rámci paušálu, nad rámec paušálu, projektových</h3>
      <table className="table m-b-10">
        <tbody>
          <tr>
            <td>Počet prác vrámci paušálu</td>
            <td>{invoice.typeTotals.subtaskPausal}</td>
          </tr>
          <tr>
            <td>Počet prác nad rámec paušálu</td>
            <td>{invoice.typeTotals.subtaskOverPausal }</td>
          </tr>
          <tr>
            <td>Projektové práce</td>
            <td>{invoice.typeTotals.subtaskProject }</td>
          </tr>
          <tr>
            <td>Výjazdy vrámci paušálu</td>
            <td>{invoice.typeTotals.tripPausal }</td>
          </tr>
          <tr>
            <td>Výjazdy nad rámec paušálu</td>
              <td>{invoice.typeTotals.tripOverPausal }</td>
          </tr>
          <tr>
            <td>Výjazdy pri projektových prácach</td>
              <td>{invoice.typeTotals.tripProject }</td>
          </tr>
        </tbody>
      </table>
      <Modal isOpen={editedTask !== null} toggle={()=>{}}>
        <ModalHeader toggle={()=>setEditedTask(null)}>{editedTask !== null && `Editing task: ${editedTask.id}: ${editedTask.title}`}</ModalHeader>
        <ModalBody>
          { editedTask !== null &&
            <TaskEdit inModal={true} taskID={editedTask.id} closeModal={()=>setEditedTask(null)}/>
          }
        </ModalBody>
      </Modal>
    </div>
  )
}