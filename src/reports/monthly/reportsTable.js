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

export default function  ReportsTable (props) {

  const {
    tasks,
    columnsToShow,
    onClickTask
  } = props;

return (
  <table className="table m-b-10">
    <thead>
      <tr>
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
        { columnsToShow.includes('totalPrice') && <th style={{width:'70px'}}>Cena spolu</th> }

      </tr>
    </thead>
    <tbody>
      {
        tasks.map((task)=>
        <tr key={task.id}>
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
					{ columnsToShow.includes('statusChange') && <td>{timestampToString(task.statusChange)}</td> }
          { columnsToShow.includes('closeDate') && <td>{timestampToString(task.closeDate)}</td> }

          {columnsToShow.includes('description') &&
            columnsToShow.includes('taskType') &&
            columnsToShow.includes('hours') &&
						!columnsToShow.includes('pricePerHour') &&
						!columnsToShow.includes('totalPrice') &&
            <td colSpan="3">
              <table className="table-borderless full-width">
                <tbody>
                  { task.subtasks.map(subtask =>
                    <tr key={subtask.id}>
                      <td key={subtask.id+ '-title'} style={{paddingLeft:0}}>{subtask.title}</td>
                      <td key={subtask.id+ '-type'} style={{width:'150px', paddingLeft:0}}>{subtask.type.title}</td>
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
						!columnsToShow.includes('pricePerUnit') &&
						!columnsToShow.includes('totalPrice') &&
						<td colSpan="3">
							<table className="table-borderless full-width">
								<tbody>
									{ task.workTrips.map(trip =>
										<tr key={trip.id}>
											<td key={trip.id+ '-title'} style={{paddingLeft:0}}>{trip.title}</td>
											<td key={trip.id+ '-type'} style={{width:'150px', paddingLeft:0}}>{trip.type.title}</td>
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
						<td colSpan="5">
							<table className="table-borderless full-width">
								<tbody>
									{ task.subtasks.map(subtask =>
										<tr key={subtask.id}>
											<td key={subtask.id+ '-title'} style={{paddingLeft:0}}>{subtask.title}</td>
											<td key={subtask.id+ '-type'} style={{width:'150px'}}>{subtask.type.title}</td>
											<td key={subtask.id+ '-time'} style={{width:'50px'}}>{subtask.quantity}</td>
											<td key={subtask.id+ '-pricePerUnit'} style={{width:'70px'}}>{task.overtime ? 0 : 0}</td>
											<td key={subtask.id+ '-totalPrice'} style={{width:'70px'}}>{task.overtime ? 0 : 0}</td>
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
						<td colSpan="5">
							<table className="table-borderless full-width">
								<tbody>
									{ task.workTrips.map(trip =>
										<tr key={trip.id}>
											<td key={trip.id+ '-title'} style={{paddingLeft:0}}>{trip.title}</td>
											<td key={trip.id+ '-type'} style={{width:'150px'}}>{trip.type.title}</td>
											<td key={trip.id+ '-time'} style={{width:'50px'}}>{trip.quantity}</td>
											<td key={trip.id+ '-pricePerUnit'} style={{width:'70px'}}> {task.overtime ? 0 : 0}</td>
											<td key={trip.id+ '-totalPrice'} style={{width:'70px'}}>{task.overtime ? 0 : 0}</td>
										</tr>
									)}
								</tbody>
							</table>
						</td>
					}

					{!columnsToShow.includes('description') &&
						columnsToShow.includes('tripType') &&
						columnsToShow.includes('quantity') &&
						columnsToShow.includes('pricePerUnit') &&
						columnsToShow.includes('totalPrice') &&
						<td colSpan="4">
							<table className="table-borderless full-width">
								<tbody>
									{ task.workTrips.map(trip =>
										<tr key={trip.id}>
											<td key={trip.id+ '-type'} style={{width:'150px'}}>{trip.type.title}</td>
											<td key={trip.id+ '-time'} style={{width:'50px'}}>{trip.quantity}</td>
											<td key={trip.id+ '-pricePerUnit'} style={{width:'70px'}}> {task.overtime ? 0 : 0}</td>
											<td key={trip.id+ '-totalPrice'} style={{width:'70px'}}>{task.overtime ? 0 : 0}</td>
										</tr>
									)}
								</tbody>
							</table>
						</td>
					}

					{columnsToShow.includes('material') &&
						columnsToShow.includes('quantity') &&
						columnsToShow.includes('unit') &&
						columnsToShow.includes('pricePerQuantity') &&
						columnsToShow.includes('totalPrice') &&
						<td colSpan="5">
							<table className="table-borderless full-width">
								<tbody>
									{task.materials.map(material =>
									<tr key={material.id}>
										<td key={material.id+ '-title'} style={{width:'150px',paddingLeft:0}}>{material.title}</td>
										<td key={material.id+ '-quantity'} style={{width:'50px'}}>{material.quantity}</td>
										<td key={material.id+ '-unit'} style={{width:'100px'}}>ks</td>
										<td key={material.id+ '-unitPrice'} style={{width:'100px'}}>{material.price}</td>
										<td key={material.id+ '-totalPrice'} style={{width:'100px'}}>{material.totalPrice}</td>
									</tr>
								)}
								{task.customItems.map(customItem =>
								<tr key={customItem.id}>
									<td key={customItem.id+ '-title'} style={{width:'150px',paddingLeft:0}}>{customItem.title}</td>
									<td key={customItem.id+ '-quantity'} style={{width:'50px'}}>{customItem.quantity}</td>
									<td key={customItem.id+ '-unit'} style={{width:'100px'}}>ks</td>
									<td key={customItem.id+ '-unitPrice'} style={{width:'100px'}}>{customItem.price}</td>
									<td key={customItem.id+ '-totalPrice'} style={{width:'100px'}}>{customItem.totalPrice}</td>
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
