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

export default function CompanyInvoice( props ) {
  const {
    company,
    tasksData,
    fromDate,
    toDate,
  } = props;
  const totals = tasksData.totals;
  const tasks = tasksData.tasks;


  const [ editedTask, setEditedTask ] = React.useState( null );

  //TODO: company rents isnt covered by rights
  console.log( '----' );
  console.log( tasks );

  const onClickTask = ( task ) => {
    setEditedTask( task );
  }

  return (
    <div>
      <h2>Fakturačný výkaz firmy</h2>
      <div className="flex-row m-b-30">
        <div>
          Firma {company.title}
          <br/>
          Obdobie od: {timestampToDate(fromDate)} do: {timestampToDate(toDate)}
        </div>
        <div className="m-l-10">
          Počet prác vrámci paušálu: {totals.approvedSubtasks + totals.pendingSubtasks}
          <br/>
          Počet výjazdov vrámci paušálu: {totals.approvedMaterials + totals.pendingMaterials}
        </div>
      </div>

      <div className="m-b-30">
        <h3 className="m-b-10">Práce a výjazdy v rámci paušálu</h3>
        <h4>Práce</h4>
        <hr />
        <ReportsTable
          tasks={tasks.filter((task) => task.subtasks.length > 0 )}
          columnsToShow={columnsToShowPausalSubtasks}
          onClickTask={onClickTask}
          />

        <p className="m-0">
          { `Spolu počet hodín: ${ totals.approvedSubtasks }` }
        </p>
        <p className="m-0">
          { `Spolu počet hodín mimo pracovný čas: ${ totals.pendingSubtasks } ( Čísla úloh: ${ tasks.filter((task) => Math.random() > 0.5 ).map((task) => task.id ).join(',') })` }
        </p>
        <p className="m-0 m-b-10">
          { `Spolu prirážka za práce mimo pracovných hodín: ${(Math.random() * 1000).toFixed(2)} eur` }
        </p>

        <h4>Výjazdy</h4>
        <hr />
        <ReportsTable
          tasks={tasks.filter((task) => task.workTrips.length > 0 )}
          columnsToShow={columnsToShowPausalWorkTrips}
          onClickTask={onClickTask}
          />
        <p className="m-0">
          { `Spolu počet výjazdov: ${ totals.approvedMaterials }` }
        </p>
        <p className="m-0">
          { `Spolu počet výjazdov mimo pracovný čas: ${ totals.pendingMaterials } ( Čísla úloh: ${ tasks.filter((task) => Math.random() > 0.5 ).map((task) => task.id ).join(',') })` }
        </p>
        <p className="m-0 m-b-10">
          { `Spolu prirážka za výjazdy mimo pracovných hodín: ${(Math.random() * 1000).toFixed(2)} eur` }
        </p>
      </div>

      <div className="m-b-30">
        <h3 className="m-b-10">Práce a výjazdy nad rámec paušálu</h3>
        <h4>Práce</h4>
        <hr />
        <ReportsTable
          tasks={tasks.filter((task) => task.subtasks.length > 0 )}
          columnsToShow={columnsToShowOverPausalSubtasks}
          onClickTask={onClickTask}
          />

        <p className="m-0">
          { `Spolu počet hodín: ${ totals.approvedSubtasks }` }
        </p>
        <p className="m-0">
          { `Spolu počet hodín mimo pracovný čas: ${ totals.pendingSubtasks } ( Čísla úloh: ${ tasks.filter((task) => Math.random() > 0.5 ).map((task) => task.id ).join(',') })` }
        </p>
        <p className="m-0">
          { `Spolu prirážka za práce mimo pracovných hodín: ${(Math.random() * 1000).toFixed(2)} eur` }
        </p>
        <p className="m-0">
          { `Spolu cena bez DPH: ${(Math.random() * 1000).toFixed(2)} eur` }
        </p>
        <p className="m-0 m-b-10">
          { `Spolu cena s DPH: ${(Math.random() * 1000).toFixed(2)} eur` }
        </p>

        <h4>Výjazdy</h4>
        <hr />
        <ReportsTable
          tasks={tasks.filter((task) => task.workTrips.length > 0 )}
          columnsToShow={columnsToShowOverPausalWorkTrips}
          onClickTask={onClickTask}
          />
        <p className="m-0">
          { `Spolu počet výjazdov: ${ totals.approvedMaterials }` }
        </p>
        <p className="m-0">
          { `Spolu počet výjazdov mimo pracovný čas: ${ totals.pendingMaterials } ( Čísla úloh: ${ tasks.filter((task) => Math.random() > 0.5 ).map((task) => task.id ).join(',') })` }
        </p>
        <p className="m-0 m-b-10">
          { `Spolu prirážka za výjazdy mimo pracovných hodín: ${(Math.random() * 1000).toFixed(2)} eur` }
        </p>
        <p className="m-0">
          { `Spolu cena bez DPH: ${(Math.random() * 1000).toFixed(2)} eur` }
        </p>
        <p className="m-0 m-b-10">
          { `Spolu cena s DPH: ${(Math.random() * 1000).toFixed(2)} eur` }
        </p>
      </div>

      <div className="m-b-30">
        <h3 className="m-b-10">Projektové práce a výjazdy</h3>
        <h4>Práce</h4>
        <hr />
        <ReportsTable
          tasks={tasks.filter((task) => task.subtasks.length > 0 )}
          columnsToShow={columnsToShowOverPausalSubtasks}
          onClickTask={onClickTask}
          />
        <p className="m-0">
          { `Spolu počet hodín: ${ totals.approvedSubtasks }` }
        </p>
        <p className="m-0">
          { `Spolu počet hodín mimo pracovný čas: ${ totals.pendingSubtasks } ( Čísla úloh: ${ tasks.filter((task) => Math.random() > 0.5 ).map((task) => task.id ).join(',') })` }
        </p>
        <p className="m-0">
          { `Spolu prirážka za práce mimo pracovných hodín: ${(Math.random() * 1000).toFixed(2)} eur` }
        </p>
        <p className="m-0">
          { `Spolu cena bez DPH: ${(Math.random() * 1000).toFixed(2)} eur` }
        </p>
        <p className="m-0 m-b-10">
          { `Spolu cena s DPH: ${(Math.random() * 1000).toFixed(2)} eur` }
        </p>

        <h4>Výjazdy</h4>
        <hr />
        <ReportsTable
          tasks={tasks.filter((task) => task.workTrips.length > 0 )}
          columnsToShow={columnsToShowOverPausalWorkTrips}
          onClickTask={onClickTask}
          />

        <p className="m-0">
          { `Spolu počet výjazdov: ${ totals.approvedMaterials }` }
        </p>
        <p className="m-0">
          { `Spolu počet výjazdov mimo pracovný čas: ${ totals.pendingMaterials } ( Čísla úloh: ${ tasks.filter((task) => Math.random() > 0.5 ).map((task) => task.id ).join(',') })` }
        </p>
        <p className="m-0 m-b-10">
          { `Spolu prirážka za výjazdy mimo pracovných hodín: ${(Math.random() * 1000).toFixed(2)} eur` }
        </p>
        <p className="m-0">
          { `Spolu cena bez DPH: ${(Math.random() * 1000).toFixed(2)} eur` }
        </p>
        <p className="m-0 m-b-10">
          { `Spolu cena s DPH: ${(Math.random() * 1000).toFixed(2)} eur` }
        </p>
      </div>

      <div className="m-b-30">
        <h3>Materiál</h3>
        <hr />

        <ReportsTable
          tasks={tasks.filter((task) => task.materials.length > 0 )}
          columnsToShow={columnsToShowMaterials}
          onClickTask={onClickTask}
          />

        <p className="m-0">
          { `Spolu cena bez DPH: ${(Math.random() * 1000).toFixed(2)} eur` }
        </p>
        <p className="m-0 m-b-10">
          { `Spolu cena s DPH: ${(Math.random() * 1000).toFixed(2)} eur` }
        </p>
      </div>

      <div className="m-b-30">
        <h3>Mesačný prenájom služieb a harware</h3>
        <hr />
        <table className="table m-b-10 bkg-white row-highlight">
          <thead>
            <tr>
              <th>ID</th>
              <th>Názov</th>
              <th>Mn.</th>
              <th>Cena/ks/mesiac</th>
              <th>Cena spolu/mesiac</th>
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
          { `Spolu cena bez DPH: ${(Math.random() * 1000).toFixed(2)} eur` }
        </p>
        <p className="m-0 m-b-10">
          { `Spolu cena s DPH: ${(Math.random() * 1000).toFixed(2)} eur` }
        </p>
      </div>

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