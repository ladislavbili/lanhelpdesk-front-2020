import React from 'react';

import {
  Spinner,
} from 'reactstrap';
import Loading from 'components/loading';
import ReportsTable from './reportsTable';
import ModalTaskEdit from 'helpdesk/task/edit/modalEdit';

import {
  timestampToDate,
  filterUnique,
} from 'helperFunctions';

import {
  columnsToShowPausalSubtasks,
  columnsToShowPausalWorkTrips,
  columnsToShowOverPausalSubtasks,
  columnsToShowOverPausalWorkTrips,
  columnsToShowMaterials
} from './tableConfig';
import {
  useTranslation
} from "react-i18next";

export default function CompanyInvoice( props ) {
  const {
    invoice,
    companyData,
    fromDate,
    toDate,
    invoiceTasks,
    invoiceRefetch,
  } = props;
  const company = companyData.company;
  const totals = invoice.totals;
  const allTasksIds = filterUnique( [
    ...invoice.pausalTasks,
    ...invoice.overPausalTasks,
    ...invoice.projectTasks,
    ...invoice.materialTasks,
  ].map( ( task ) => task.taskId ) );

  const {
    t
  } = useTranslation();


  const [ editedTask, setEditedTask ] = React.useState( null );
  const [ markedTasks, setMarkedTasks ] = React.useState( allTasksIds );
  const [ invoiceTriggered, setInvoiceTriggered ] = React.useState( false );

  React.useEffect( () => {
    setMarkedTasks( allTasksIds );
  }, [ company.id, fromDate, toDate ] );

  const onClickTask = ( task ) => {
    if ( invoiceTriggered ) {
      return;
    }
    setEditedTask( task );
  }

  const markTask = ( taskId ) => {
    if ( markedTasks.includes( taskId ) ) {
      setMarkedTasks( markedTasks.filter( ( taskId2 ) => taskId2 !== taskId ) )
    } else {
      setMarkedTasks( [ ...markedTasks, taskId ] )
    }
  }

  const companyRentTotal = ( company.companyRents.reduce( ( acc, rent ) => acc + rent.total, 0 ) );

  return (
    <div>
      <h2>{t('invoiceOfCompany')}</h2>
      <div className="flex-row m-b-10">
        <div>
          {t('company')}: {company.title}
          <br/>
          {` ${t('period')} ${t('from').toLowerCase()}: ${timestampToDate(fromDate)} ${t('to').toLowerCase()}: ${timestampToDate(toDate)} `}
        </div>
        <div className="m-l-10">
          {t('countOfWorksInPausal')}: {invoice.pausalTotals.workHours}
          <br/>
          {t('countOfTripsInPausal')}: {invoice.pausalTotals.tripHours}
        </div>
      </div>

      <div className="flex-row m-b-30">
        <button
          className="btn btn-danger btn-distance"
          disabled={markedTasks.length === 0 || invoiceTriggered }
          onClick={ () => invoiceTasks(company.id, markedTasks, setInvoiceTriggered, () => setMarkedTasks([]) ) }
          >
          {invoiceTriggered && <Spinner className="m-r-5" />}
          {`${invoiceTriggered ? t('invoicePending') : t('invoiceAction')} ${t('selected').toLowerCase()} ${t('tasks').toLowerCase()} (${markedTasks.length})`}
        </button>
        <button
          className="btn btn-distance"
          disabled={allTasksIds.length === 0}
          onClick={() => {
            if(markedTasks.length !== allTasksIds.length){
              setMarkedTasks(allTasksIds);
            }else{
              setMarkedTasks([]);
            }
          }}
          >
          {`${ markedTasks.length !== allTasksIds.length ? t('mark') : t('unmark') } ${t('allTasks').toLowerCase()}`}
        </button>
      </div>

      <div className="m-b-30">
        <h3 className="m-b-10">{t('worksTripsInPausal')}</h3>
        <h4>{t('works')}</h4>
        <hr />
        <ReportsTable
          tasks={invoice.pausalTasks.filter((task) => task.subtasks.length > 0 )}
          columnsToShow={columnsToShowPausalSubtasks}
          onClickTask={onClickTask}
          markedTasks={markedTasks}
          markTask={markTask}
          />

        <p className="m-0">
          { `${t('totalHours')}: ${ invoice.pausalTotals.workHours }` }
        </p>
        <p className="m-0">
          { `${t('overtimeTotalHours')}: ${ invoice.pausalTotals.workOvertime } ( ${t('taskIDs')}: ${ invoice.pausalTotals.workOvertimeTasks.join(',') })` }
        </p>
        <p className="m-0 m-b-10">
          { `${t('overtimeWorkExtraPrice')}: ${invoice.pausalTotals.workExtraPrice.toFixed(2)} ${t('euro').toLowerCase()}` }
        </p>

        <h4>{t('trips')}</h4>
        <hr />
        <ReportsTable
          tasks={invoice.pausalTasks.filter((task) => task.workTrips.length > 0 )}
          columnsToShow={columnsToShowPausalWorkTrips}
          onClickTask={onClickTask}
          markedTasks={markedTasks}
          markTask={markTask}
          />
        <p className="m-0">
          { `${t('tripTotal')}: ${ invoice.pausalTotals.tripHours }` }
        </p>
        <p className="m-0">
          { `${t('overtimeTripTotal')}: ${ invoice.pausalTotals.tripOvertime } ( ${t('taskIDs')}: ${ invoice.pausalTotals.tripOvertimeTasks.join(',') })` }
        </p>
        <p className="m-0 m-b-10">
          { `${t('overtimeTripExtraPrice')}: ${invoice.pausalTotals.tripExtraPrice.toFixed(2)} ${t('euro').toLowerCase()}` }
        </p>
      </div>

      <div className="m-b-30">
        <h3 className="m-b-10">{t('worksTripsOverPausal')}</h3>
        <h4>{t('works')}</h4>
        <hr />
        <ReportsTable
          tasks={invoice.overPausalTasks.filter((task) => task.subtasks.length > 0 )}
          columnsToShow={columnsToShowOverPausalSubtasks}
          onClickTask={onClickTask}
          markedTasks={markedTasks}
          markTask={markTask}
          />

        <p className="m-0">
          { `${t('totalHours')}: ${ invoice.overPausalTotals.workHours }` }
        </p>
        <p className="m-0">
          { `${t('overtimeTotalHours')}: ${ invoice.overPausalTotals.workOvertime } ( ${t('taskIDs')}: ${ invoice.overPausalTotals.workOvertimeTasks.join(',') })` }
        </p>
        <p className="m-0 m-b-10">
          { `${t('overtimeWorkExtraPrice')}: ${invoice.overPausalTotals.workExtraPrice.toFixed(2)} ${t('euro').toLowerCase()}` }
        </p>
        <p className="m-0">
          { `${t('totalPriceWithoutTax')}: ${invoice.overPausalTotals.workTotalPrice.toFixed(2)} ${t('euro').toLowerCase()}` }
        </p>
        <p className="m-0 m-b-10">
          { `${t('totalPriceWithTax')}: ${invoice.overPausalTotals.workTotalPriceWithDPH.toFixed(2)} ${t('euro').toLowerCase()}` }
        </p>

        <h4>{t('trips')}</h4>
        <hr />
        <ReportsTable
          tasks={invoice.overPausalTasks.filter((task) => task.workTrips.length > 0 )}
          columnsToShow={columnsToShowOverPausalWorkTrips}
          onClickTask={onClickTask}
          markedTasks={markedTasks}
          markTask={markTask}
          />
        <p className="m-0">
          { `${t('tripTotal')}: ${ invoice.overPausalTotals.tripHours }` }
        </p>
        <p className="m-0">
          { `${t('overtimeTripTotal')}: ${ invoice.overPausalTotals.tripOvertime } ( ${t('taskIDs')}: ${ invoice.overPausalTotals.tripOvertimeTasks.join(',') })` }
        </p>
        <p className="m-0 m-b-10">
          { `${t('overtimeTripExtraPrice')}: ${invoice.overPausalTotals.tripExtraPrice.toFixed(2)} ${t('euro').toLowerCase()}` }
        </p>
        <p className="m-0">
          { `${t('totalPriceWithoutTax')}: ${invoice.overPausalTotals.tripTotalPrice.toFixed(2)} ${t('euro').toLowerCase()}` }
        </p>
        <p className="m-0 m-b-10">
          { `${t('totalPriceWithTax')}: ${invoice.overPausalTotals.tripTotalPriceWithDPH.toFixed(2)} ${t('euro').toLowerCase()}` }
        </p>
      </div>

      <div className="m-b-30">
        <h3 className="m-b-10">{t('worksTripsInProject')}</h3>
        <h4>{t('works')}</h4>
        <hr />
        <ReportsTable
          tasks={invoice.projectTasks.filter((task) => task.subtasks.length > 0 )}
          columnsToShow={columnsToShowOverPausalSubtasks}
          onClickTask={onClickTask}
          markedTasks={markedTasks}
          markTask={markTask}
          />
        <p className="m-0">
          { `${t('totalHours')}: ${ invoice.projectTotals.workHours }` }
        </p>
        <p className="m-0">
          { `${t('overtimeTotalHours')}: ${ invoice.projectTotals.workOvertime } ( ${t('taskIDs')}: ${ invoice.projectTotals.workOvertimeTasks.join(',') })` }
        </p>
        <p className="m-0 m-b-10">
          { `${t('overtimeWorkExtraPrice')}: ${invoice.projectTotals.workExtraPrice.toFixed(2)} ${t('euro').toLowerCase()}` }
        </p>
        <p className="m-0">
          { `${t('totalPriceWithoutTax')}: ${invoice.projectTotals.workTotalPrice.toFixed(2)} ${t('euro').toLowerCase()}` }
        </p>
        <p className="m-0 m-b-10">
          { `${t('totalPriceWithTax')}: ${invoice.projectTotals.workTotalPriceWithDPH.toFixed(2)} ${t('euro').toLowerCase()}` }
        </p>

        <h4>{t('trips')}</h4>
        <hr />
        <ReportsTable
          tasks={invoice.projectTasks.filter((task) => task.workTrips.length > 0 )}
          columnsToShow={columnsToShowOverPausalWorkTrips}
          onClickTask={onClickTask}
          markedTasks={markedTasks}
          markTask={markTask}
          />



        <p className="m-0">
          { `${t('tripTotal')}: ${ invoice.projectTotals.tripHours }` }
        </p>
        <p className="m-0">
          { `${t('overtimeTripTotal')}: ${ invoice.projectTotals.tripOvertime } ( ${t('taskIDs')}: ${ invoice.projectTotals.tripOvertimeTasks.join(',') })` }
        </p>
        <p className="m-0 m-b-10">
          { `${t('overtimeTripExtraPrice')}: ${invoice.projectTotals.tripExtraPrice.toFixed(2)} ${t('euro').toLowerCase()}` }
        </p>
        <p className="m-0">
          { `${t('totalPriceWithoutTax')}: ${invoice.projectTotals.tripTotalPrice.toFixed(2)} ${t('euro').toLowerCase()}` }
        </p>
        <p className="m-0 m-b-10">
          { `${t('totalPriceWithTax')}: ${invoice.projectTotals.tripTotalPriceWithDPH.toFixed(2)} ${t('euro').toLowerCase()}` }
        </p>
      </div>

      <div className="m-b-30">
        <h3>{t('material')}</h3>
        <hr />

        <ReportsTable
          tasks={invoice.materialTasks}
          columnsToShow={columnsToShowMaterials}
          onClickTask={onClickTask}
          markedTasks={markedTasks}
          markTask={markTask}
          />

        <p className="m-0">
          { `${t('totalPriceWithoutTax')}: ${invoice.materialTotals.price.toFixed(2)} ${t('euro').toLowerCase()}` }
        </p>
        <p className="m-0 m-b-10">
          { `${t('totalPriceWithTax')}: ${invoice.materialTotals.priceWithDPH.toFixed(2)} ${t('euro').toLowerCase()}` }
        </p>
      </div>

      <div className="m-b-30">
        <h3>{t('monthlyCompanyRent')}</h3>
        <hr />
        <table className="table m-b-10 bkg-white row-highlight">
          <thead>
            <tr>
              <th>ID</th>
              <th>{t('title')}</th>
              <th>{t('quantityShort')}</th>
              <th>{t('pricePcMonth')}</th>
              <th>{t('priceTotalMonth')}</th>
            </tr>
          </thead>
          <tbody>
            { company.companyRents.map((rentedItem) => (
              <tr key={rentedItem.id}>
                <td>{rentedItem.id}</td>
                <td>{rentedItem.title}</td>
                <td>{rentedItem.quantity}</td>
                <td>{rentedItem.price}</td>
                <td>{rentedItem.total}</td>
              </tr>
            )) }
          </tbody>
        </table>
        <p className="m-0">
          { `${t('totalPriceWithoutTax')}: ${companyRentTotal.toFixed(2)} ${t('euro').toLowerCase()}` }
        </p>
        <p className="m-0 m-b-10">
          { `${t('totalPriceWithTax')}: ${(companyRentTotal * (company.dph/100 + 1)).toFixed(2)} ${t('euro').toLowerCase()}` }
        </p>
      </div>

      <ModalTaskEdit
        opened={editedTask !== null}
        taskID={ editedTask ? editedTask.taskId : null }
        closeModal={ (vykazyUpdated) => {
          setEditedTask(null);
          invoiceRefetch();
          //refresh if changed
        } }
        fromInvoice={true}
        />
    </div>
  );
}