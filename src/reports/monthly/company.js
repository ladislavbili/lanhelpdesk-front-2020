import React from 'react';

import {
  useQuery,
  useLazyQuery,
  useMutation,
  useApolloClient
} from "@apollo/client";

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
import Select from 'react-select';

import {
  toSelArr,
  orderArr,
  timestampToDate,
  timestampToString,
  filterUnique
} from 'helperFunctions';

import MonthSelector from '../components/monthSelector';
import Loading from 'components/loading';

import {
  selectStyleColored
} from 'configs/components/select';

import {
  months
} from 'configs/constants/reports';

import ReportsTable from './reportsTable';

import {
  setReportsChosenStatuses,
  setReportsFromDate,
  setReportsToDate
} from 'apollo/localSchema/actions';


import {
  GET_REPORTS_CHOSEN_STATUSES,
  GET_REPORTS_FROM_DATE,
  GET_REPORTS_TO_DATE,
} from 'apollo/localSchema/querries';

import {
  GET_INVOICE_COMPANIES,
  GET_COMPANY_INVOICE_DATA,
  CREATE_TASK_INVOICE
} from './querries';

import {
  GET_STATUSES
} from 'helpdesk/settings/statuses/querries';

import {
  columnsToShowPausalSubtasks,
  columnsToShowPausalWorkTrips,
  columnsToShowOverPausalSubtasks,
  columnsToShowOverPausalWorkTrips,
  columnsToShowMaterials
} from './tableConfig';

export default function MothlyReportsCompany( props ) {
  //local
  const {
    data: chosenStatusesData,
    loading: chosenStatusesLoading
  } = useQuery( GET_REPORTS_CHOSEN_STATUSES );
  const {
    data: fromDateData,
    loading: fromDateLoading
  } = useQuery( GET_REPORTS_FROM_DATE );
  const {
    data: toDateData,
    loading: toDateLoading
  } = useQuery( GET_REPORTS_TO_DATE );

  //network
  const {
    data: statusesData,
    loading: statusesLoading
  } = useQuery( GET_STATUSES );

  const [ createTaskInvoice ] = useMutation( CREATE_TASK_INVOICE );

  const [ newInvoice, setNewInvoice ] = React.useState( false );
  const [ newInvoiceTitle, setNewInvoiceTitle ] = React.useState( "" );

  const [ fetchInvoiceCompanies, {
    loading: invoiceCompaniesLoading,
    data: invoiceCompaniesData
		} ] = useLazyQuery( GET_INVOICE_COMPANIES );

  const [ fetchCompanyInvoice, {
    loading: companyInvoiceLoading,
    data: companyInvoiceData
		} ] = useLazyQuery( GET_COMPANY_INVOICE_DATA );

  const onTrigger = ( newFrom, newTo ) => {
    fetchInvoiceCompanies( {
      variables: {
        fromDate: newFrom ?
          newFrom.valueOf()
          .toString() : fromDate.valueOf()
          .toString(),
        toDate: newTo ?
          newTo.valueOf()
          .toString() : toDate.valueOf()
          .toString(),
        statuses: chosenStatuses.map( status => status.id )
      },
      options: {
        fetchPolicy: 'network-only'
      }
    } );
  }

  const onClickTask = ( taskId ) => {
    console.log( "clicked!" );
  }

  const [ showCompany, setShowCompany ] = React.useState( null );

  React.useEffect( () => {
    if ( !statusesLoading ) {
      const statuses = statusesData && statusesData.statuses ?
        toSelArr( orderArr( statusesData.statuses.filter( ( status ) => status.action.toLowerCase()
          .includes( 'close' ) ) ) ) : [];
      setReportsChosenStatuses( statuses );
    }
  }, [ statusesLoading ] );

  React.useEffect( () => {
    if ( chosenStatuses.length > 0 ) {
      onTrigger();
    }
  }, [ chosenStatuses ] );

  React.useEffect( () => {
    if ( showCompany !== null ) {
      fetchCompanyInvoice( {
        variables: {
          fromDate: fromDate.valueOf()
            .toString(),
          toDate: toDate.valueOf()
            .toString(),
          statuses: chosenStatuses.map( status => status.id ),
          companyId: showCompany.id
        },
        options: {
          fetchPolicy: 'network-only'
        }
      } );
    }
  }, [ showCompany ] );

  React.useEffect( () => {
    if ( chosenStatuses.length > 0 ) {
      onTrigger();
    }
  }, [ chosenStatuses ] );

  const invoiceTasks = () => {
    createTaskInvoice( {
        variables: {
          fromDate: fromDate.valueOf()
            .toString(),
          toDate: toDate.valueOf()
            .toString(),
          statuses: chosenStatuses.map( status => status.id ),
          companyId: showCompany.id,
          title: newInvoiceTitle,
        }
      } )
      .then( ( response ) => {} )
      .catch( ( err ) => {
        console.log( err.message );
      } );
  }

  const loading = statusesLoading || invoiceCompaniesLoading;

  const chosenStatuses = chosenStatusesData ? chosenStatusesData.reportsChosenStatuses : [];

  const fromDate = fromDateData ? fromDateData.reportsFromDate : null;
  const toDate = toDateData ? toDateData.reportsToDate : null;

  const statuses = statusesData && statusesData.statuses ? toSelArr( orderArr( statusesData.statuses ) ) : [];
  const INVOICE_COMPANIES = invoiceCompaniesData && invoiceCompaniesData.getInvoiceCompanies ? invoiceCompaniesData.getInvoiceCompanies : [];

  const statusIDs = chosenStatuses.map( status => status.id );

  const currentInvoiceData = companyInvoiceData ? companyInvoiceData.getCompanyInvoiceData : {};

  let allTasksIds = [];
  if ( newInvoice ) {
    allTasksIds = filterUnique( [
      ...currentInvoiceData.pausalTasks.map( ( pausalTask ) => pausalTask.id ),
      ...currentInvoiceData.overPausalTasks.map( ( overPausalTask ) => overPausalTask.task.id ),
      ...currentInvoiceData.projectTasks.map( ( projectTask ) => projectTask.task.id ),
      ...currentInvoiceData.materialTasks.map( ( materialTask ) => materialTask.task.id ),
    ] )
  }
  const invoiceLoaded = showCompany !== null && Object.keys( currentInvoiceData )
    .length !== 0;
  return (
    <div className="scrollable fit-with-header">
      <h2 className="m-l-20 m-t-20">Firmy</h2>
      <div style={{maxWidth:500}}>
        <MonthSelector
          blockedShow={chosenStatuses.length === 0}
          fromDate={fromDate}
          onChangeFromDate={(date) => {
            setReportsFromDate( date );
          }}
          toDate={toDate}
          onChangeToDate={(date) => {
            setReportsToDate( date );
          }}
          onTrigger={onTrigger}
          />
        <div className="p-20">
          <Select
            value={chosenStatuses}
            placeholder="Vyberte statusy"
            isMulti
            onChange={(newChosenStatuses)=> {
              setReportsChosenStatuses( newChosenStatuses );
            }}
            options={statuses}
            styles={selectStyleColored}
            />
        </div>
      </div>

      {
        loading &&
        <Loading />
      }
      {
        !loading &&
        <div className="p-20">
          <table className="table m-b-10">
            <thead>
              <tr>
                <th>Company name</th>
                <th>Work hours</th>
                <th>Materials</th>
                <th>Vlastné položky</th>
                <th>Trips</th>
                <th>Rented items</th>
              </tr>
            </thead>
            <tbody>
              {
                INVOICE_COMPANIES.map((inv)=>
                <tr
                  key={inv.company.id}
                  className="clickable"
                  onClick={()=> setShowCompany(inv.company)}>
                  <td>{inv.company.title}</td>
                  <td>{inv.subtasksHours}</td>
                  <td>{inv.materialsQuantity}</td>
                  <td>{inv.customItemsQuantity}</td>
                  <td>{inv.tripsHours}</td>
                  <td>{inv.rentedItemsQuantity}</td>
                </tr>
              )
            }
            {
              INVOICE_COMPANIES.length === 0 &&
              <tr
                key="no-items"
                >
                <td colSpan="6">{`No invoiceable companies in date range ${timestampToString(fromDate.valueOf())} - ${timestampToString(toDate.valueOf())}`}</td>
              </tr>
            }
          </tbody>
        </table>
        {
          invoiceLoaded &&
          <div className="commandbar">
            <Button
              className="btn-danger m-l-5 center-hor"
              onClick={() => {
                const title = 'Fakturačný výkaz firmy ' +
                showCompany.title +
                ' od ' +
                timestampToDate(fromDate) +
                ' do '+
                timestampToDate(toDate) +
                ' vytvorený dňa ' +
                timestampToDate(moment());
                setNewInvoiceTitle(title);
                setNewInvoice(true);
              }}
              >
              Faktúrovať
            </Button>
          </div>
        }

        {
          showCompany !== null && !invoiceLoaded &&
          <Loading />
        }

        { invoiceLoaded &&
          <div className="p-20">
            <h2>Fakturačný výkaz firmy</h2>
            <div className="flex-row m-b-30">
              <div>
                Firma {showCompany.title} <br/>
              Obdobie od: {timestampToDate(fromDate)} do: {timestampToDate(toDate)}
            </div>
            <div className="m-l-10">
              Počet prác vrámci paušálu: {currentInvoiceData && currentInvoiceData.pausalCounts && currentInvoiceData.pausalCounts.subtasks ?
                currentInvoiceData.pausalCounts.subtasks : 0}
                <br/>
                Počet výjazdov vrámci paušálu: {currentInvoiceData && currentInvoiceData.pausalCounts && currentInvoiceData.pausalCounts.trips ?
                  currentInvoiceData.pausalCounts.trips : 0}
                </div>
              </div>
              
              <div className="m-b-30">
                <h3 className="m-b-10">Práce a výjazdy v rámci paušálu</h3>
                <h4>Práce</h4>
                <hr />
                <ReportsTable
                  tasks={
                    currentInvoiceData &&
                    currentInvoiceData.pausalTasks ?
                    currentInvoiceData.pausalTasks.filter(invoiceTask =>
                      invoiceTask.subtasks.length > 0
                    ).map(invoiceTask =>
                      ({
                        ...invoiceTask.task,
                        subtasks: invoiceTask.subtasks,
                      })
                    ) :
                    []
                  }
                  columnsToShow={columnsToShowPausalSubtasks}
                  onClickTask={onClickTask}
                  />

                <p className="m-0">Spolu počet hodín: {
                    currentInvoiceData &&
                    currentInvoiceData.pausalCounts ?
                    currentInvoiceData.pausalCounts.subtasks.toFixed(2) : 0
                  }
                </p>
                <p className="m-0">Spolu počet hodín mimo pracovný čas: {
                    currentInvoiceData &&
                    currentInvoiceData.pausalCounts ?
                    currentInvoiceData.pausalCounts.subtasksAfterHours.toFixed(2) : 0
                  } ( Čísla úloh: {
                    currentInvoiceData &&
                    currentInvoiceData.pausalCounts ? currentInvoiceData.pausalCounts.subtasksAfterHoursTaskIds.join(",") :
                    ""
                  })
                </p>
                <p className="m-0 m-b-10">Spolu prirážka za práce mimo pracovných hodín: {
                    currentInvoiceData &&
                    currentInvoiceData.pausalCounts ?
                    currentInvoiceData.pausalCounts.subtasksAfterHoursPrice.toFixed(2) :
                    0
                  } eur
                </p>

                <h4>Výjazdy</h4>
                <hr />
                <ReportsTable
                  tasks={
                    currentInvoiceData &&
                    currentInvoiceData.pausalTasks ?
                    currentInvoiceData.pausalTasks.filter(invoiceTask =>
                      invoiceTask.trips.length > 0
                    ).map(invoiceTask =>
                      ({
                        ...invoiceTask.task,
                        workTrips: invoiceTask.trips,
                      })
                    ) :
                    []
                  }
                  columnsToShow={columnsToShowPausalWorkTrips}
                  onClickTask={onClickTask}
                  />
                <p className="m-0">Spolu počet výjazdov: {
                    currentInvoiceData &&
                    currentInvoiceData.pausalCounts ?
                    currentInvoiceData.pausalCounts.trips.toFixed(2) : 0
                  }
                </p>
                <p className="m-0">Spolu počet výjazdov mimo pracovný čas: {
                    currentInvoiceData &&
                    currentInvoiceData.pausalCounts ?
                    currentInvoiceData.pausalCounts.tripsAfterHours.toFixed(2) : 0
                  } ( Čísla úloh: {
                    currentInvoiceData &&
                    currentInvoiceData.pausalCounts ? currentInvoiceData.pausalCounts.tripsAfterHoursTaskIds.join(",") :
                    ""
                  })
                </p>
                <p className="m-0 m-b-10">Spolu prirážka za výjazdy mimo pracovných hodín: {
                    currentInvoiceData &&
                    currentInvoiceData.pausalCounts ?
                    currentInvoiceData.pausalCounts.tripsAfterHoursPrice.toFixed(2) :
                    0
                  } eur
                </p>
              </div>

              <div className="m-b-30">
                <h3 className="m-b-10">Práce a výjazdy nad rámec paušálu</h3>
                <h4>Práce</h4>
                <hr />
                <ReportsTable
                  tasks={
                    currentInvoiceData &&
                    currentInvoiceData.overPausalTasks ?
                    currentInvoiceData.overPausalTasks.filter(invoiceTask =>
                      invoiceTask.subtasks.length > 0
                    ).map(invoiceTask => {
                      return {
                        ...invoiceTask.task,
                        subtasks: invoiceTask.subtasks,
                      }
                    }) :
                    []
                  }
                  columnsToShow={columnsToShowOverPausalSubtasks}
                  onClickTask={onClickTask}
                  />

                <p className="m-0">Spolu počet hodín: {
                    currentInvoiceData &&
                    currentInvoiceData.overPausalCounts ?
                    currentInvoiceData.overPausalCounts.subtasks.toFixed(2) :
                    0
                  }
                </p>
                <p className="m-0">Spolu počet hodín mimo pracovný čas: {
                    currentInvoiceData &&
                    currentInvoiceData.overPausalCounts ?
                    currentInvoiceData.overPausalCounts.subtasksAfterHours.toFixed(2) :
                    0
                  } ( Čísla úloh: {
                    currentInvoiceData &&
                    currentInvoiceData.overPausalCounts ? currentInvoiceData.overPausalCounts.subtasksAfterHoursTaskIds.join(",") :
                    ""
                  })
                </p>
                <p className="m-0">Spolu prirážka za práce mimo pracovných hodín: {
                    currentInvoiceData &&
                    currentInvoiceData.overPausalCounts ?
                    currentInvoiceData.overPausalCounts.subtasksAfterHoursPrice.toFixed(2) :
                    0
                  } eur
                </p>
                <p className="m-0">Spolu cena bez DPH: {
                    currentInvoiceData &&
                    currentInvoiceData.overPausalCounts ?
                    currentInvoiceData.overPausalCounts.subtasksTotalPriceWithoutDPH.toFixed(2) :
                    0
                  } eur
                </p>
                <p className="m-0">Spolu cena s DPH: {
                    currentInvoiceData &&
                    currentInvoiceData.overPausalCounts ?
                    currentInvoiceData.overPausalCounts.subtasksTotalPriceWithDPH.toFixed(2) :
                    0
                  } eur
                </p>

                <h4>Výjazdy</h4>
                <hr />
                <ReportsTable
                  tasks={
                    currentInvoiceData &&
                    currentInvoiceData.overPausalTasks ?
                    currentInvoiceData.overPausalTasks.filter(invoiceTask =>
                      invoiceTask.trips.length > 0
                    ).map(invoiceTask =>
                      ({
                        ...invoiceTask.task,
                        workTrips: invoiceTask.trips,
                      })
                    ) :
                    []
                  }
                  columnsToShow={columnsToShowOverPausalWorkTrips}
                  onClickTask={onClickTask}
                  />

                <p className="m-0">Spolu počet výjazdov: {
                    currentInvoiceData &&
                    currentInvoiceData.overPausalCounts ?
                    currentInvoiceData.overPausalCounts.trips.toFixed(2) : 0
                  }
                </p>
                <p className="m-0">Spolu počet výjazdov mimo pracovný čas: {
                    currentInvoiceData &&
                    currentInvoiceData.overPausalCounts ?
                    currentInvoiceData.overPausalCounts.tripsAfterHours.toFixed(2) : 0
                  } ( Čísla úloh: {
                    currentInvoiceData &&
                    currentInvoiceData.overPausalCounts ? currentInvoiceData.overPausalCounts.tripsAfterHoursTaskIds.join(",") :
                    ""
                  })
                </p>
                <p className="m-0">Spolu prirážka za výjazdy mimo pracovných hodín: {
                    currentInvoiceData &&
                    currentInvoiceData.overPausalCounts ?
                    currentInvoiceData.overPausalCounts.tripsAfterHoursPrice.toFixed(2) :
                    0
                  } eur
                </p>
                <p className="m-0">Spolu cena bez DPH: {
                    currentInvoiceData &&
                    currentInvoiceData.overPausalCounts ?
                    currentInvoiceData.overPausalCounts.tripsTotalPriceWithoutDPH.toFixed(2) :
                    0
                  } eur
                </p>
                <p className="m-0">Spolu cena s DPH: {
                    currentInvoiceData &&
                    currentInvoiceData.overPausalCounts ?
                    currentInvoiceData.overPausalCounts.tripsTotalPriceWithDPH.toFixed(2) :
                    0
                  } eur
                </p>
              </div>

              <div className="m-b-30">
                <h3 className="m-b-10">Projektové práce a výjazdy</h3>
                <h4>Práce</h4>
                <hr />
                <ReportsTable
                  tasks={
                    currentInvoiceData &&
                    currentInvoiceData.projectTasks ?
                    currentInvoiceData.projectTasks.filter(invoiceTask =>invoiceTask.subtasks.length > 0
                    ).map(invoiceTask =>
                      ({
                        ...invoiceTask.task,
                        subtasks: invoiceTask.subtasks,
                      })
                    ) :
                    []
                  }
                  columnsToShow={columnsToShowOverPausalSubtasks}
                  onClickTask={onClickTask}
                  />

                <p className="m-0">Spolu počet hodín: {
                    currentInvoiceData &&
                    currentInvoiceData.projectCounts ?
                    currentInvoiceData.projectCounts.subtasks.toFixed(2) :
                    0
                  }
                </p>
                <p className="m-0">Spolu počet hodín mimo pracovný čas: {
                    currentInvoiceData &&
                    currentInvoiceData.projectCounts ?
                    currentInvoiceData.projectCounts.subtasksAfterHours.toFixed(2) :
                    0
                  } ( Čísla úloh: {
                    currentInvoiceData &&
                    currentInvoiceData.projectCounts ? currentInvoiceData.projectCounts.subtasksAfterHoursTaskIds.join(",") :
                    ""
                  }) eur
                </p>
                <p className="m-0">Spolu prirážka za práce mimo pracovných hodín: {
                    currentInvoiceData &&
                    currentInvoiceData.projectCounts ?
                    currentInvoiceData.projectCounts.subtasksAfterHoursPrice.toFixed(2) :
                    0
                  } eur
                </p>
                <p className="m-0">Spolu cena bez DPH: {
                    currentInvoiceData &&
                    currentInvoiceData.projectCounts ?
                    currentInvoiceData.projectCounts.subtasksTotalPriceWithoutDPH.toFixed(2) :
                    0
                  } eur
                </p>
                <p className="m-0">Spolu cena s DPH: {
                    currentInvoiceData &&
                    currentInvoiceData.projectCounts ?
                    currentInvoiceData.projectCounts.subtasksTotalPriceWithDPH.toFixed(2) :
                    0
                  } eur
                </p>

                <h4>Výjazdy</h4>
                <hr />
                <ReportsTable
                  tasks={
                    currentInvoiceData &&
                    currentInvoiceData.projectTasks ?
                    currentInvoiceData.projectTasks.filter(invoiceTask =>
                      invoiceTask.trips.length > 0
                    ).map(invoiceTask =>
                      ({
                        ...invoiceTask.task,
                        workTrips: invoiceTask.trips,
                      })
                    ) :
                    []
                  }
                  columnsToShow={columnsToShowOverPausalWorkTrips}
                  onClickTask={onClickTask}
                  />

                <p className="m-0">Spolu počet výjazdov: {
                    currentInvoiceData &&
                    currentInvoiceData.projectCounts ?
                    currentInvoiceData.projectCounts.trips.toFixed(2) :
                    0
                  }
                </p>
                <p className="m-0">Spolu počet výjazdov mimo pracovný čas: {
                    currentInvoiceData &&
                    currentInvoiceData.projectCounts ?
                    currentInvoiceData.projectCounts.tripsAfterHours.toFixed(2) :
                    0
                  } ( Čísla úloh: {
                    currentInvoiceData &&
                    currentInvoiceData.projectCounts ? currentInvoiceData.projectCounts.tripsAfterHoursTaskIds.join(",") :
                    ""
                  }) eur
                </p>
                <p className="m-0">Spolu prirážka za výjazdov mimo pracovných hodín: {
                    currentInvoiceData &&
                    currentInvoiceData.projectCounts ?
                    currentInvoiceData.projectCounts.tripsAfterHoursPrice.toFixed(2) :
                    0
                  } eur
                </p>
                <p className="m-0">Spolu cena bez DPH: {
                    currentInvoiceData &&
                    currentInvoiceData.projectCounts ?
                    currentInvoiceData.projectCounts.tripsTotalPriceWithoutDPH.toFixed(2) :
                    0
                  } eur
                </p>
                <p className="m-0">Spolu cena s DPH: {
                    currentInvoiceData &&
                    currentInvoiceData.projectCounts ?
                    currentInvoiceData.projectCounts.tripsTotalPriceWithDPH.toFixed(2) :
                    0
                  } eur
                </p>
              </div>

              <div className="m-b-30">
                <h3>Materiále a voľné položky</h3>
                <hr />

                <ReportsTable
                  tasks={
                    currentInvoiceData &&
                    currentInvoiceData.materialTasks ?
                    currentInvoiceData.materialTasks.filter(invoiceMaterial =>
                      invoiceMaterial.materials.length + invoiceMaterial.customItems.length > 1
                    ).map(invoiceMaterial =>
                      ({
                        ...invoiceMaterial.task,
                        materials: invoiceMaterial.materials,
                        customItems: invoiceMaterial.customItems
                      })
                    ) :
                    []
                  }
                  columnsToShow={columnsToShowMaterials}
                  onClickTask={onClickTask}
                  />

                <p className="m-0">Spolu cena bez DPH: {
                    currentInvoiceData ?
                    currentInvoiceData.totalMaterialAndCustomItemPriceWithoutDPH.toFixed(2) :
                    0
                  } eur
                </p>
                <p className="m-0">Spolu cena s DPH: {
                    currentInvoiceData ?
                    currentInvoiceData.totalMaterialAndCustomItemPriceWithDPH.toFixed(2) :
                    0
                  } eur
                </p>
              </div>

              <div className="m-b-30">
                <h3>Mesačný prenájom služieb a harware</h3>
                <hr />
                <table className="table m-b-10">
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
                    {currentInvoiceData &&
                      currentInvoiceData.company &&
                      currentInvoiceData.company.companyRents &&
                      currentInvoiceData.company.companyRents.map((rentedItem)=>
                      <tr key={rentedItem.id}>
                        <td>{rentedItem.id}</td>
                        <td>{rentedItem.title}</td>
                        <td>{rentedItem.quantity}</td>
                        <td>{rentedItem.price}</td>
                        <td>{rentedItem.total}</td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
              <p className="m-0">Spolu cena bez DPH: {
                  currentInvoiceData &&
                  currentInvoiceData.companyRentsCounts ?
                  currentInvoiceData.companyRentsCounts.totalWithoutDPH :
                  0
                } eur
              </p>
              <p className="m-0">Spolu cena s DPH: {
                  currentInvoiceData &&
                  currentInvoiceData.companyRentsCounts ?
                  currentInvoiceData.companyRentsCounts.totalWithDPH :
                  0
                } eur
              </p>
            </div>

          </div>
        }

        <Modal
          isOpen={newInvoice}
          toggle={ () => setNewInvoice(!newInvoice) }
          >
          <ModalHeader>
            { `Creating new invoice ( from tasks ${allTasksIds.toString()} )` }
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="name">Invoice name</Label>
              <Input
                type="text"
                name="name"
                id="name"
                placeholder="Enter invoice name"
                value={newInvoiceTitle}
                onChange={(e) => setNewInvoiceTitle(e.target.value)}
                />
            </FormGroup>
            <Button
              className="btn-primary center-hor"
              onClick={() => invoiceTasks()}
              >
              Add
            </Button>
          </ModalBody>
        </Modal>

        <Modal isOpen={false} toggle={()=>{}}>
          <ModalHeader toggle={()=>{}}>{}</ModalHeader>
          <ModalBody>
            {
              /*false &&
              <TaskEdit inModal={true} columns={true}  closeModal={()=>{}}/>
              */
            }
          </ModalBody>
        </Modal>

        </div>
      }
    </div>
  );
}