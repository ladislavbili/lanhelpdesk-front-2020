import React from 'react';

import Loading from 'components/loading';
import ModalTaskEdit from 'helpdesk/task/edit/modalEdit';

import {
  timestampToDate,
} from 'helperFunctions';

import {
  useTranslation
} from "react-i18next";

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

  const {
    t
  } = useTranslation();

  const [ editedTask, setEditedTask ] = React.useState( null );

  const onClickTask = ( task ) => {
    setEditedTask( task );
  }

  return (
    <div>
      <h2>{t('monthlyAgentInvoice')}</h2>
      <div className="flex-row m-b-30">
        <div>
          {`${t('agent')} ${agent.fullName} (${agent.email})`}
          <br/>
          ${t('period')} {t('from').toLowerCase()}: {timestampToDate(fromDate)} {t('to').toLowerCase()}: {timestampToDate(toDate)}
        </div>
      </div>
      <h3>{t('works')}</h3>
      <hr />
      <table className="table m-b-10 bkg-white row-highlight">
        <thead>
          <tr>
            <th>ID</th>
            <th>{t('taskTitle')}</th>
            <th>{t('requester')}</th>
            <th>{t('company')}</th>
            <th>{t('status')}</th>
            <th>{t('closeDate')}</th>
            <th>{t('workDescription')}</th>
            <th style={{width:'150px'}}>{t('workType')}</th>
            <th style={{width:'50px'}}>{t('hoursCount')}</th>
          </tr>
        </thead>
        <tbody>
          { workTasks.map((task) => (
            <tr key={task.taskId}>
              <td>{task.taskId}</td>
              <td className="clickable" onClick={() => onClickTask(task)}>{task.title}</td>
              <td>{task.requester.fullName}</td>
              <td>{task.company ? task.company.title : t('noCompany')}</td>
              <td>
                <span className="label label-info" style={{backgroundColor:task.status.color}}>
                  {task.status.title}
                </span>
              </td>
              <td>{isNaN(parseInt(task.closeDate)) ? t('notClosed') : timestampToDate(parseInt(task.closeDate))}</td>
              <td colSpan="3" style={{padding:0}}>
                <table className="table-borderless full-width">
                  <tbody>
                    {task.subtasks.map( (subtask, index) => (
                      <tr key={index}>
                        <td key={index + '-title'} style={{}}>{subtask.title}</td>
                        <td key={index + '-type'} style={{width:'150px', }}>{task.taskType.title}</td>
                        <td key={index + '-time'} style={{width:'50px', }}>{subtask.quantity}</td>
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
            <th>{t('workType')}</th>
            <th className="width-100">{t('hoursCount')}</th>
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
        {`${t('totalHours')}: ${ totals.workHours }`}
      </p>
      <p className="m-0 m-b-10">
        { `${t('overtimeTotalHours')}: ${ totals.workOvertime } ( ${t('taskIDs')}: ${ totals.workOvertimeTasks.join(',') })` }
      </p>

      <h3>{t('trips')}</h3>
      <hr />
      <table className="table m-b-10 bkg-white row-highlight">
        <thead>
          <tr>
            <th>ID</th>
            <th>{t('taskTitle')}</th>
            <th>{t('requester')}</th>
            <th>{t('company')}</th>
            <th>{t('status')}</th>
            <th>{t('closeDate')}</th>
            <th style={{width:'150px'}}>{t('trip')}</th>
            <th style={{width:'50px'}}>{t('quantityShort')}</th>
          </tr>
        </thead>
        <tbody>
          { tripTasks.map((task) =>
            <tr key={task.taskId}>
              <td>{task.taskId}</td>
              <td className="clickable" onClick={() => onClickTask(task)}>{task.title}</td>
              <td>{task.requester.fullName}</td>
              <td>{task.company ? task.company.title : t('company')}</td>
              <td>
                <span className="label label-info" style={{backgroundColor:task.status.color}}>
                  {task.status.title}
                </span>
              </td>
              <td>{isNaN(parseInt(task.closeDate)) ? t('notClosed') : timestampToDate(parseInt(task.closeDate))}</td>
              <td colSpan="2" style={{padding:0}}>
                <table className="table-borderless full-width">
                  <tbody>
                    {task.workTrips.map((trip, index) => (
                      <tr key={index}>
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
            <th>{t('trip')}</th>
            <th className="width-100">{t('pc')}</th>
          </tr>
        </thead>
        <tbody>
          { tripTypeTotals.map((tripType, index) => (
            <tr key={index}>
              <td>{tripType.title}</td>
              <td>{tripType.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="m-0">
        {`${t('tripTotal')}: ${ totals.tripHours }`}
      </p>
      <p className="m-0 m-b-10">
        { `${t('overtimeTripTotal')}: ${ totals.tripOvertime } ( ${t('taskIDs')}: ${ totals.tripOvertimeTasks.join(',') })` }
      </p>

      <h3>{t('uniqueAgentTotal')}</h3>
      <table className="table m-b-10 bkg-white row-highlight max-width-700">
        <tbody>
          { invoiced &&
            <tr>
              <td>{t('countOfWorksInPausal')}</td>
              <td>{ totals.pausalWorkHours }</td>
            </tr>
          }
          { invoiced &&
          <tr>
            <td>{t('countOfWorksOverPausal')}</td>
            <td>{ totals.overPausalWorkHours }</td>
          </tr>
        }
        { !invoiced &&
          <tr>
            <td>{t('countOfWorksInPausalAndOverPausal')}</td>
            <td>{ totals.pausalWorkHours }</td>
          </tr>
        }
          <tr>
            <td>{t('countOfWorksInProject')}</td>
            <td>{ totals.projectWorkHours }</td>
          </tr>

        { invoiced &&
          <tr>
            <td>{t('countOfTripsInPausal')}</td>
            <td>{ totals.pausalTripHours }</td>
          </tr>
        }
        { invoiced &&
          <tr>
            <td>{t('countOfTripsOverPausal')}</td>
            <td>{ totals.overPausalTripHours }</td>
          </tr>
        }
        { !invoiced &&
          <tr>
            <td>{t('countOfTripsInPausalAndOverPausal')}</td>
            <td>{ totals.pausalTripHours }</td>
          </tr>
        }
          <tr>
            <td>{t('countOfTripsInProject')}</td>
            <td>{ totals.projectTripHours }</td>
          </tr>
        </tbody>
      </table>
      <ModalTaskEdit
        opened={editedTask !== null}
        taskID={ editedTask ? editedTask.taskId : null }
        closeModal={ (vykazyUpdated) => {
          setEditedTask(null);
          //refresh if changed
          invoiceRefetch();
        } }
        fromInvoice={true}
        />
    </div>
  );
}