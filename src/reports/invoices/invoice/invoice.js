import React from 'react';

import Loading from 'components/loading';
import ReportsTable from './reportsTable';
import ModalTaskEdit from 'helpdesk/task/edit/modalEdit';

import {
  timestampToDate,
} from 'helperFunctions';

import {
  columnsToShowPausalSubtasks,
  columnsToShowPausalWorkTrips,
  columnsToShowOverPausalSubtasks,
  columnsToShowOverPausalWorkTrips,
  columnsToShowMaterials
} from './tableConfig';

export default function Invoice( props ) {
  const {
    invoice,
    invoiceRefetch,
    company,
    fromDate,
    toDate,
  } = props;

  const totals = invoice.totals;

  const [ editedTask, setEditedTask ] = React.useState( null );

  const onClickTask = ( task ) => {
    setEditedTask( task );
  }

  return (
    <div>
      <h2>Fakturačný výkaz firmy</h2>
      <div className="flex-row m-b-10">
        <div>
          Firma {company.title}
          <br/>
          Obdobie od: {timestampToDate(fromDate)} do: {timestampToDate(toDate)}
        </div>
        <div className="m-l-10">
          Počet prác vrámci paušálu: {invoice.pausalTotals.workHours}
          <br/>
          Počet výjazdov vrámci paušálu: {invoice.pausalTotals.tripHours}
        </div>
      </div>

      <div className="m-b-30">
        <h3 className="m-b-10">Práce a výjazdy v rámci paušálu</h3>
        <h4>Práce</h4>
        <hr />
        <ReportsTable
          tasks={invoice.pausalTasks.filter((task) => task.subtasks.length > 0 )}
          columnsToShow={columnsToShowPausalSubtasks}
          onClickTask={onClickTask}
          />

        <p className="m-0">
          { `Spolu počet hodín: ${ invoice.pausalTotals.workHours }` }
        </p>
        <p className="m-0">
          { `Spolu počet hodín mimo pracovný čas: ${ invoice.pausalTotals.workOvertime } ( Čísla úloh: ${ invoice.pausalTotals.workOvertimeTasks.join(',') })` }
        </p>
        <p className="m-0 m-b-10">
          { `Spolu prirážka za práce mimo pracovných hodín: ${invoice.pausalTotals.workExtraPrice.toFixed(2)} eur` }
        </p>

        <h4>Výjazdy</h4>
        <hr />
        <ReportsTable
          tasks={invoice.pausalTasks.filter((task) => task.workTrips.length > 0 )}
          columnsToShow={columnsToShowPausalWorkTrips}
          onClickTask={onClickTask}
          />
        <p className="m-0">
          { `Spolu počet výjazdov: ${ invoice.pausalTotals.tripHours }` }
        </p>
        <p className="m-0">
          { `Spolu počet výjazdov mimo pracovný čas: ${ invoice.pausalTotals.tripOvertime } ( Čísla úloh: ${ invoice.pausalTotals.tripOvertimeTasks.join(',') })` }
        </p>
        <p className="m-0 m-b-10">
          { `Spolu prirážka za výjazdy mimo pracovných hodín: ${invoice.pausalTotals.tripExtraPrice.toFixed(2)} eur` }
        </p>
      </div>

      <div className="m-b-30">
        <h3 className="m-b-10">Práce a výjazdy nad rámec paušálu</h3>
        <h4>Práce</h4>
        <hr />
        <ReportsTable
          tasks={invoice.overPausalTasks.filter((task) => task.subtasks.length > 0 )}
          columnsToShow={columnsToShowOverPausalSubtasks}
          onClickTask={onClickTask}
          />

        <p className="m-0">
          { `Spolu počet hodín: ${ invoice.overPausalTotals.workHours }` }
        </p>
        <p className="m-0">
          { `Spolu počet hodín mimo pracovný čas: ${ invoice.overPausalTotals.workOvertime } ( Čísla úloh: ${ invoice.overPausalTotals.workOvertimeTasks.join(',') })` }
        </p>
        <p className="m-0 m-b-10">
          { `Spolu prirážka za práce mimo pracovných hodín: ${invoice.overPausalTotals.workExtraPrice.toFixed(2)} eur` }
        </p>
        <p className="m-0">
          { `Spolu cena bez DPH: ${invoice.overPausalTotals.workTotalPrice.toFixed(2)} eur` }
        </p>
        <p className="m-0 m-b-10">
          { `Spolu cena s DPH: ${invoice.overPausalTotals.workTotalPriceWithDPH.toFixed(2)} eur` }
        </p>

        <h4>Výjazdy</h4>
        <hr />
        <ReportsTable
          tasks={invoice.overPausalTasks.filter((task) => task.workTrips.length > 0 )}
          columnsToShow={columnsToShowOverPausalWorkTrips}
          onClickTask={onClickTask}
          />
        <p className="m-0">
          { `Spolu počet výjazdov: ${ invoice.overPausalTotals.tripHours }` }
        </p>
        <p className="m-0">
          { `Spolu počet výjazdov mimo pracovný čas: ${ invoice.overPausalTotals.tripOvertime } ( Čísla úloh: ${ invoice.overPausalTotals.tripOvertimeTasks.join(',') })` }
        </p>
        <p className="m-0 m-b-10">
          { `Spolu prirážka za výjazdy mimo pracovných hodín: ${invoice.overPausalTotals.tripExtraPrice.toFixed(2)} eur` }
        </p>
        <p className="m-0">
          { `Spolu cena bez DPH: ${invoice.overPausalTotals.tripTotalPrice.toFixed(2)} eur` }
        </p>
        <p className="m-0 m-b-10">
          { `Spolu cena s DPH: ${invoice.overPausalTotals.tripTotalPriceWithDPH.toFixed(2)} eur` }
        </p>
      </div>

      <div className="m-b-30">
        <h3 className="m-b-10">Projektové práce a výjazdy</h3>
        <h4>Práce</h4>
        <hr />
        <ReportsTable
          tasks={invoice.projectTasks.filter((task) => task.subtasks.length > 0 )}
          columnsToShow={columnsToShowOverPausalSubtasks}
          onClickTask={onClickTask}
          />
        <p className="m-0">
          { `Spolu počet hodín: ${ invoice.projectTotals.workHours }` }
        </p>
        <p className="m-0">
          { `Spolu počet hodín mimo pracovný čas: ${ invoice.projectTotals.workOvertime } ( Čísla úloh: ${ invoice.projectTotals.workOvertimeTasks.join(',') })` }
        </p>
        <p className="m-0 m-b-10">
          { `Spolu prirážka za práce mimo pracovných hodín: ${invoice.projectTotals.workExtraPrice.toFixed(2)} eur` }
        </p>
        <p className="m-0">
          { `Spolu cena bez DPH: ${invoice.projectTotals.workTotalPrice.toFixed(2)} eur` }
        </p>
        <p className="m-0 m-b-10">
          { `Spolu cena s DPH: ${invoice.projectTotals.workTotalPriceWithDPH.toFixed(2)} eur` }
        </p>

        <h4>Výjazdy</h4>
        <hr />
        <ReportsTable
          tasks={invoice.projectTasks.filter((task) => task.workTrips.length > 0 )}
          columnsToShow={columnsToShowOverPausalWorkTrips}
          onClickTask={onClickTask}
          />

        <p className="m-0">
          { `Spolu počet výjazdov: ${ invoice.projectTotals.tripHours }` }
        </p>
        <p className="m-0">
          { `Spolu počet výjazdov mimo pracovný čas: ${ invoice.projectTotals.tripOvertime } ( Čísla úloh: ${ invoice.projectTotals.tripOvertimeTasks.join(',') })` }
        </p>
        <p className="m-0 m-b-10">
          { `Spolu prirážka za výjazdy mimo pracovných hodín: ${invoice.projectTotals.tripExtraPrice.toFixed(2)} eur` }
        </p>
        <p className="m-0">
          { `Spolu cena bez DPH: ${invoice.projectTotals.tripTotalPrice.toFixed(2)} eur` }
        </p>
        <p className="m-0 m-b-10">
          { `Spolu cena s DPH: ${invoice.projectTotals.tripTotalPriceWithDPH.toFixed(2)} eur` }
        </p>
      </div>

      <div className="m-b-30">
        <h3>Materiál</h3>
        <hr />

        <ReportsTable
          tasks={invoice.materialTasks}
          columnsToShow={columnsToShowMaterials}
          onClickTask={onClickTask}
          />

        <p className="m-0">
          { `Spolu cena bez DPH: ${invoice.materialTotals.price.toFixed(2)} eur` }
        </p>
        <p className="m-0 m-b-10">
          { `Spolu cena s DPH: ${invoice.materialTotals.priceWithDPH.toFixed(2)} eur` }
        </p>
      </div>

      <ModalTaskEdit
        opened={editedTask !== null}
        taskID={ editedTask ? editedTask.id : null }
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