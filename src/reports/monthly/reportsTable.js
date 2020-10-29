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

import moment from 'moment';
import Loading from 'components/loading';

export default function  ReportsTable (props) {

  const {
    tasks,
    columnsToShow,
    onTriggerCheck,
    onClickTask
  } = props;

	console.log("PROPS");
	console.log(props);

return (
  <table className="table m-b-10">
    <thead>
      <tr>
        <th width="25"></th>
        { columnsToShow.includes('id') && <th>ID</th> }
        { columnsToShow.includes('title') && <th>Názov úlohy</th> }
        { columnsToShow.includes('requester') && <th>Zadal</th> }
        { columnsToShow.includes('assignedTo') && <th>Rieši</th> }
        { columnsToShow.includes('status') && <th>Status</th> }
        { columnsToShow.includes('closeDate') && <th>Close date</th> }
        { columnsToShow.includes('description') && <th>Popis práce</th> }
        { columnsToShow.includes('taskType') && <th style={{width:'150px'}}>Typ práce</th> }
        { columnsToShow.includes('tripType') && <th style={{width:'150px'}}>Výjazd</th> }
        { columnsToShow.includes('hours') && <th style={{width:'50px'}}>Hodiny</th> }
        { columnsToShow.includes('quantity') && <th style={{width:'50px'}}>Mn.</th> }
        { columnsToShow.includes('pricePerHour') && <th style={{width:'70px'}}>Cena/hodna</th> }
        { columnsToShow.includes('pricePerUnit') && <th style={{width:'50px'}}>Cena/ks</th> }
        { columnsToShow.includes('totalPrice') && <th style={{width:'70px'}}>Cena spolu</th> }

      </tr>
    </thead>
    <tbody>
      {
        tasks.map((task)=>
        <tr key={task.id}>
          <td className="table-checkbox">
            <label className="custom-container">
              <Input type="checkbox"
                checked={task.checked}
                onChange={onTriggerCheck} />
                <span className="checkmark" style={{ marginTop: "-3px"}}> </span>
            </label>
          </td>

          { columnsToShow.includes('id') && <td>{task.id}</td> }

          { columnsToShow.includes('title') && <td className="clickable" style={{ color: "#1976d2" }} onClick={onClickTask}>{task.title}</td> }

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
          { columnsToShow.includes('closeDate') && <td>{task.closeDate}</td> }

          {columnsToShow.includes('description') &&
            columnsToShow.includes('taskType') &&
            columnsToShow.includes('hours') &&
            <td colSpan="3">
              <table className="table-borderless full-width">
                <tbody>
                  { task.subtasks.map(subtask =>
                    <tr key={subtask.id}>
                      <td key={subtask.id+ '-title'} style={{paddingLeft:0}}>{subtask.title}</td>
                      <td key={subtask.id+ '-type'} style={{width:'150px', paddingLeft:0}}>{subtask.taskType.title}</td>
                      <td key={subtask.id+ '-time'} style={{width:'50px', paddingLeft:0}}>{subtask.quantity}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </td>
          }

					{columnsToShow.includes('description') &&
						columnsToShow.includes('tripType') &&
						columnsToShow.includes('quantity') &&
						<td colSpan="3">
							<table className="table-borderless full-width">
								<tbody>
									{ task.trips.map(trip =>
										<tr key={trip.id}>
											<td key={trip.id+ '-title'} style={{paddingLeft:0}}>{trip.title}</td>
											<td key={trip.id+ '-type'} style={{width:'150px', paddingLeft:0}}>{trip.tripType.title}</td>
											<td key={trip.id+ '-time'} style={{width:'50px', paddingLeft:0}}>{trip.quantity}</td>
										</tr>
									)}
								</tbody>
							</table>
						</td>
					}

					{columnsToShow.includes('description') &&
						columnsToShow.includes('taskType') &&
						columnsToShow.includes('hours') &&
						columnsToShow.includes('pricePerHour') &&
						columnsToShow.includes('totalPrice') &&
						<td colSpan="3">
							<table className="table-borderless full-width">
								<tbody>
									{ task.subtasks.map(subtask =>
										<tr key={subtask.id}>
											<td key={subtask.id+ '-title'} style={{paddingLeft:0}}>{subtask.title}</td>
											<td key={subtask.id+ '-type'} style={{width:'150px'}}>{subtask.taskType.title}</td>
											<td key={subtask.id+ '-time'} style={{width:'50px'}}>{subtask.quantity}</td>
											<td key={subtask.id+ '-pricePerUnit'} style={{width:'70px'}}>{'task.overtime?this.getUnitAHPrice(subtask):this.getUnitDiscountedPrice(subtask)'}</td>
											<td key={subtask.id+ '-totalPrice'} style={{width:'70px'}}>{'task.overtime?this.getTotalAHPrice(subtask):this.getTotalDiscountedPrice(subtask)'}</td>
										</tr>
									)}
								</tbody>
							</table>
						</td>
					}

					{columnsToShow.includes('description') &&
						columnsToShow.includes('tripType') &&
						columnsToShow.includes('quantity') &&
						columnsToShow.includes('pricePerUnit') &&
						columnsToShow.includes('totalPrice') &&
						<td colSpan="3">
							<table className="table-borderless full-width">
								<tbody>
									{ task.trips.map(trip =>
										<tr key={trip.id}>
											<td key={trip.id+ '-title'} style={{paddingLeft:0}}>{trip.title}</td>
											<td key={trip.id+ '-type'} style={{width:'150px'}}>{trip.taskType.title}</td>
											<td key={trip.id+ '-time'} style={{width:'50px'}}>{trip.quantity}</td>
											<td key={trip.id+ '-pricePerUnit'} style={{width:'70px'}}> {'task.overtime?this.getUnitAHPrice(trip):this.getUnitDiscountedPrice(trip)'}</td>
											<td key={trip.id+ '-totalPrice'} style={{width:'70px'}}>{'task.overtime?this.getTotalAHPrice(trip):this.getTotalDiscountedPrice(trip)'}</td>
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
