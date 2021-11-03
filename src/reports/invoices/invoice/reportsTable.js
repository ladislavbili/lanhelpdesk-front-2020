import React from 'react';

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  FormGroup,
  Label
} from 'reactstrap';

import {
  timestampToString
} from 'helperFunctions';

import moment from 'moment';
import Loading from 'components/loading';
import Checkbox from 'components/checkbox';

export default function ReportsTable( props ) {

  const {
    tasks,
    columnsToShow,
    onClickTask,
    markedTasks,
    markTask,
  } = props;

  const displayPausalSubtasks = (
    columnsToShow.includes( 'description' ) &&
    columnsToShow.includes( 'taskType' ) &&
    columnsToShow.includes( 'hours' ) &&
    !columnsToShow.includes( 'pricePerHour' ) &&
    !columnsToShow.includes( 'total' )
  );

  const displayPausalWorkTrips = (
    columnsToShow.includes( 'tripType' ) &&
    columnsToShow.includes( 'quantity' ) &&
    !columnsToShow.includes( 'pricePerUnit' ) &&
    !columnsToShow.includes( 'total' )
  );

  const displayOverPausalSubtasks = (
    columnsToShow.includes( 'description' ) &&
    columnsToShow.includes( 'taskType' ) &&
    columnsToShow.includes( 'hours' ) &&
    columnsToShow.includes( 'pricePerHour' ) &&
    columnsToShow.includes( 'total' )
  );

  const displayOverPausalWorkTrips = (
    columnsToShow.includes( 'tripType' ) &&
    columnsToShow.includes( 'quantity' ) &&
    columnsToShow.includes( 'pricePerUnit' ) &&
    columnsToShow.includes( 'total' )
  );

  const displayMaterials = (
    columnsToShow.includes( 'material' ) &&
    columnsToShow.includes( 'quantity' ) &&
    columnsToShow.includes( 'unit' ) &&
    columnsToShow.includes( 'pricePerQuantity' ) &&
    columnsToShow.includes( 'total' )
  );

  return (
    <table className="table m-b-10 bkg-white row-highlight">
      <thead>
        <tr>
          { columnsToShow.includes('checkbox') && <th width="30"/> }
          { columnsToShow.includes('id') && <th>ID</th> }
          { columnsToShow.includes('title') && <th>Názov úlohy</th> }
          { columnsToShow.includes('requester') && <th>Zadal</th> }
          { columnsToShow.includes('assignedTo') && <th>Rieši</th> }
          { columnsToShow.includes('status') && <th>Status</th> }
          { columnsToShow.includes('statusChange') && <th>Status date</th> }
          { columnsToShow.includes('closeDate') && <th>Close date</th> }
          { columnsToShow.includes('description') && <th>Popis práce</th> }
          { columnsToShow.includes('taskType') && <th style={{width:'150px'}}>Typ práce</th> }
          { columnsToShow.includes('tripType') && <th style={{width:'150px'}}>Výjazd</th> }
          { columnsToShow.includes('hours') && <th style={{width:'50px'}}>Hodiny</th> }
          { columnsToShow.includes('material') && <th style={{width:'150px',paddingLeft:0}}>Material</th> }
          { columnsToShow.includes('quantity') && <th style={{width:'50px'}}>Mn.</th> }
          { columnsToShow.includes('unit') && <th style={{width:'100px'}}>Jednotka</th> }
          { columnsToShow.includes('pricePerHour') && <th style={{width:'70px'}}>Cena/hodna</th> }
          { columnsToShow.includes('pricePerQuantity') && <th style={{width:'100px'}}>Cena/Mn.</th> }
          { columnsToShow.includes('pricePerUnit') && <th style={{width:'50px'}}>Cena/ks</th> }
          { columnsToShow.includes('total') && <th style={{width:'70px'}}>Cena spolu</th> }
        </tr>
      </thead>
      <tbody>
        { tasks.map((task) =>
          <tr key={task.id}>
            { columnsToShow.includes('checkbox') &&
              <Checkbox
                className = "m-l-5 m-r-5 m-t-7"
                value = { markedTasks.includes(task.id) }
                onChange={() => { markTask(task.id) }}
                />
            }
            { columnsToShow.includes('id') && <td>{task.id}</td> }

            { columnsToShow.includes('title') && <td className="clickable" style={{ color: "#1976d2" }} onClick={() => onClickTask(task)}>{task.title}</td> }

            { columnsToShow.includes('requester') && <td>{task.requester ? task.requester.email : 'Nikto'}</td> }

            { columnsToShow.includes('assignedTo') &&
              <td>
                { task.assignedTo.map(user =>
                  <p key={user.id}>{user.email}</p>
                )}
              </td>
            }
            { columnsToShow.includes('status') &&
              <td>
                <span className="label label-info"
                  style={{backgroundColor: task.status && task.status.color ? task.status.color: 'white'}}>
                  {task.status ? task.status.title : 'Neznámy status'}
                </span>
              </td>
            }
            { columnsToShow.includes('statusChange') && <td>{timestampToString(task.statusChange)}</td> }
            { columnsToShow.includes('closeDate') && <td>{timestampToString(task.closeDate)}</td> }

            { displayPausalSubtasks &&
              <td colSpan="3">
                <table className="table-borderless full-width">
                  <tbody>
                    { task.subtasks.map(subtask =>
                      <tr key={subtask.id}>
                        <td key={subtask.id + '-title'} style={{paddingLeft:0}}>{subtask.title}</td>
                        <td key={subtask.id + '-type'} style={{width:'150px'}}>{task.taskType ? task.taskType.title : 'Chýba'}</td>
                        <td key={subtask.id + '-time'} style={{width:'50px'}}>{subtask.quantity}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </td>
            }

            {displayPausalWorkTrips &&
              <td colSpan="3">
                <table className="table-borderless full-width">
                  <tbody>
                    { task.workTrips.map(trip =>
                      <tr key={trip.id}>
                        <td key={trip.id + '-type'} style={{width:'150px', paddingLeft:0}}>{trip.type.title}</td>
                        <td key={trip.id + '-time'} style={{width:'50px', paddingLeft:0}}>{trip.quantity}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </td>
            }

            {displayOverPausalSubtasks &&
              <td colSpan="5">
                <table className="table-borderless full-width">
                  <tbody>
                    { task.subtasks.map(subtask =>
                      <tr key={subtask.id}>
                        <td key={subtask.id + '-title'} style={{paddingLeft:0}}>{subtask.title}</td>
                        <td key={subtask.id + '-type'} style={{width:'150px'}}>{task.taskType.title}</td>
                        <td key={subtask.id + '-time'} style={{width:'50px'}}>{subtask.quantity}</td>
                        <td key={subtask.id + '-pricePerUnit'} style={{width:'70px'}}>{subtask.price.toFixed(2)}</td>
                        <td key={subtask.id + '-totalPrice'} style={{width:'70px'}}>{subtask.total.toFixed(2)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </td>
            }

            {displayOverPausalWorkTrips &&
              <td colSpan="4">
                <table className="table-borderless full-width">
                  <tbody>
                    { task.workTrips.map(trip =>
                      <tr key={trip.id}>
                        <td key={trip.id + '-type'} style={{width:'150px'}}>{trip.type.title}</td>
                        <td key={trip.id + '-time'} style={{width:'50px'}}>{trip.quantity}</td>
                        <td key={trip.id + '-pricePerUnit'} style={{width:'70px'}}> {trip.price}</td>
                        <td key={trip.id + '-totalPrice'} style={{width:'70px'}}>{(trip.total).toFixed(2)}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </td>
            }

            {displayMaterials &&
              <td colSpan="5">
                <table className="table-borderless full-width">
                  <tbody>
                    {task.materials.map(material =>
                      <tr key={material.id}>
                        <td key={material.id + '-title'} style={{width:'150px',paddingLeft:0}}>{material.title}</td>
                        <td key={material.id + '-quantity'} style={{width:'50px'}}>{material.quantity}</td>
                        <td key={material.id + '-unit'} style={{width:'100px'}}>ks</td>
                        <td key={material.id + '-unitPrice'} style={{width:'100px'}}>{material.price}</td>
                        <td key={material.id + '-totalPrice'} style={{width:'100px'}}>{material.total}</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </td>
            }

          </tr>
        )
      }
    </tbody>
  </table>
  )
}