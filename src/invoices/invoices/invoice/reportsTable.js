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
import {
  useTranslation
} from "react-i18next";

export default function ReportsTable( props ) {

  const {
    tasks,
    columnsToShow,
    onClickTask,
    markedTasks,
    markTask,
  } = props;

  const {
    t
  } = useTranslation();

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
          { columnsToShow.includes('title') && <th>{t('taskTitle')}</th> }
          { columnsToShow.includes('requester') && <th>{t('requester')}</th> }
          { columnsToShow.includes('assignedTo') && <th>{t('assignedTo')}</th> }
          { columnsToShow.includes('status') && <th>{t('status')}</th> }
          { columnsToShow.includes('statusChange') && <th>{t('statusDate')}</th> }
          { columnsToShow.includes('closeDate') && <th>{t('closeDate')}</th> }
          { columnsToShow.includes('description') && <th>Popis práce</th> }
          { columnsToShow.includes('taskType') && <th style={{width:'150px'}}>{t('workDescription')}</th> }
          { columnsToShow.includes('tripType') && <th style={{width:'150px'}}>{t('trip')}</th> }
          { columnsToShow.includes('hours') && <th style={{width:'50px'}}>{t('hours')}</th> }
          { columnsToShow.includes('material') && <th style={{width:'150px',paddingLeft:0}}>{t('material')}</th> }
          { columnsToShow.includes('quantity') && <th style={{width:'50px'}}>{t('quantityShort')}</th> }
          { columnsToShow.includes('unit') && <th style={{width:'100px'}}>{t('unit')}</th> }
          { columnsToShow.includes('pricePerHour') && <th style={{width:'70px'}}>{t('pricePerHour')}</th> }
          { columnsToShow.includes('pricePerQuantity') && <th style={{width:'100px'}}>{t('pricePerQuantity')}</th> }
          { columnsToShow.includes('pricePerUnit') && <th style={{width:'50px'}}>{t('pricePerUnit')}</th> }
          { columnsToShow.includes('total') && <th style={{width:'70px'}}>{t('totalPrice')}</th> }
        </tr>
      </thead>
      <tbody>
        { tasks.map((task) =>
          <tr key={task.taskId}>
            { columnsToShow.includes('checkbox') &&
              <Checkbox
                className = "m-l-5 m-r-5 m-t-7"
                value = { markedTasks.includes(task.taskId) }
                onChange={() => { markTask(task.taskId) }}
                />
            }
            { columnsToShow.includes('id') && <td>{task.taskId}</td> }

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
                    { task.subtasks.map((subtask, index) =>
                      <tr key={index}>
                        <td key={index + '-title'} style={{paddingLeft:0}}>{subtask.title}</td>
                        <td key={index + '-type'} style={{width:'150px'}}>{task.taskType ? task.taskType.title : 'Chýba'}</td>
                        <td key={index + '-time'} style={{width:'50px'}}>{subtask.quantity}</td>
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
                    { task.workTrips.map((trip, index) =>
                      <tr key={index}>
                        <td key={index + '-type'} style={{width:'150px', paddingLeft:0}}>{trip.type.title}</td>
                        <td key={index + '-time'} style={{width:'50px', paddingLeft:0}}>{trip.quantity}</td>
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
                    { task.subtasks.map((subtask, index) =>
                      <tr key={index}>
                        <td key={index + '-title'} style={{paddingLeft:0}}>{subtask.title}</td>
                        <td key={index + '-type'} style={{width:'150px'}}>{task.taskType.title}</td>
                        <td key={index + '-time'} style={{width:'50px'}}>{subtask.quantity}</td>
                        <td key={index + '-pricePerUnit'} style={{width:'70px'}}>{subtask.price.toFixed(2)}</td>
                        <td key={index + '-totalPrice'} style={{width:'70px'}}>{subtask.total.toFixed(2)}</td>
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
                    { task.workTrips.map((trip, index) =>
                      <tr key={index}>
                        <td key={index + '-type'} style={{width:'150px'}}>{trip.type.title}</td>
                        <td key={index + '-time'} style={{width:'50px'}}>{trip.quantity}</td>
                        <td key={index + '-pricePerUnit'} style={{width:'70px'}}> {trip.price}</td>
                        <td key={index + '-totalPrice'} style={{width:'70px'}}>{(trip.total).toFixed(2)}</td>
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
                    {task.materials.map((material, index) =>
                      <tr key={index}>
                        <td key={index + '-title'} style={{width:'150px',paddingLeft:0}}>{material.title}</td>
                        <td key={index + '-quantity'} style={{width:'50px'}}>{material.quantity}</td>
                        <td key={index + '-unit'} style={{width:'100px'}}>ks</td>
                        <td key={index + '-unitPrice'} style={{width:'100px'}}>{material.price}</td>
                        <td key={index + '-totalPrice'} style={{width:'100px'}}>{material.total}</td>
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