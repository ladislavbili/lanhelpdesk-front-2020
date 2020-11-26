import React from 'react';
import {
  timestampToString
} from 'helperFunctions';
import Excel from 'exceljs';
import FileSaver from 'file-saver';
import {
  useLazyQuery,
} from "@apollo/client";
import {
  GET_TASK_INVOICE,
} from './queries';

export default function ExcelExport( props ) {
  const {
    basicInvoice,
    filename
  } = props;

  const [ fetchTaskInvoice, {
    loading: taskInvoiceLoading,
    data: taskInvoiceData,
  } ] = useLazyQuery( GET_TASK_INVOICE, {
    onCompleted: () => {
      downloadExcel( taskInvoiceData.getTaskInvoice )
    },
  } );

  const downloadExcel = async ( invoice ) => {

    const h1 = {
      bold: true,
      size: 16,
    };
    const h2 = {
      bold: true,
      size: 14,
    }
    const h3 = {
      bold: true,
    }

    const ws = new Excel.Workbook();
    const sheet = ws.addWorksheet( 'Vykaz' );
    const widthMultiplier = 5;
    sheet.columns = [
      {
        width: 11 * widthMultiplier
      },
      {
        width: 8 * widthMultiplier
      },
      {
        width: 4 * widthMultiplier
      },
      {
        width: 4 * widthMultiplier
      },
      {
        width: 2 * widthMultiplier
      },
      {
        width: 3 * widthMultiplier
      },
      {
        width: 10 * widthMultiplier
      },
      {
        width: 4 * widthMultiplier
      },
      {
        width: 2 * widthMultiplier
      },
      {
        width: 3 * widthMultiplier
      },
      {
        width: 3 * widthMultiplier
      },
    ];


    sheet.addRows( [
      [ 'Fakturačný výkaz firmy' ],
      [ `Firma ${invoice.invoicedCompany.title}`, `Počet prác vrámci paušálu: ${invoice.pausalCounts.subtasks}` ],
      [ `Obdobie od ${timestampToString(invoice.from)} do: ${timestampToString(parseInt(invoice.toDate))}`, `Počet výjazdov vrámci paušálu: ${invoice.pausalCounts.trips}` ],
      [],
      [ 'Práce a výjazdy vrámci paušálu' ],
      [ 'Práce' ],
      [ 'ID', 'Názov úlohy', 'Zadal', 'Rieši', 'Status', 'Close date', 'Popis práce', 'Typ práce', 'Hodiny' ]
    ] )
    setMultipleCellsStyle( [ 'A1', 'A6' ], h1, sheet );
    setMultipleCellsStyle( [ 'A5' ], h2, sheet )
    setMultipleCellsStyle( [ 'A7', 'B7', 'C7', 'D7', 'E7', 'F7', 'G7', 'H7', 'I7' ], h3, sheet );

    //Prace
    invoice.pausalTasks.filter( ( pausalTask ) => pausalTask.subtasks.length !== 0 )
      .forEach( ( pausalTask ) => {
        sheet.addRows(
          pausalTask.subtasks.map( ( subtaskData, index ) => {
            if ( index === 0 ) {
              return [
              pausalTask.task.id,
              pausalTask.task.title,
              pausalTask.task.requester.fullName,
              pausalTask.task.assignedTo.reduce( ( acc, user ) => acc + user.fullName + '\n', "" ),
              pausalTask.task.status.title,
              timestampToString( parseInt( pausalTask.task.closeDate ) ),
              subtaskData.subtask.title,
              subtaskData.type,
              subtaskData.quantity
            ]
            }
            let row = [];
            row[ 7 ] = subtaskData.subtask.title;
            row[ 8 ] = subtaskData.type;
            row[ 9 ] = subtaskData.quantity;
            return row;
          } )
        );
      } )
    sheet.addRow( [] );
    sheet.addRow( [ 'Spolu počet hodín:', invoice.pausalCounts.subtasks ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );

    sheet.addRow( [
      'Spolu počet hodín mimo pracovný čas:', invoice.pausalCounts.subtasksAfterHours, `Čísla úloh: ${invoice.pausalCounts.subtasksAfterHoursTaskIds.toString()}`
    ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );

    sheet.addRow( [ 'Spolu prirážka za práce mimo pracovných hodín:', `${invoice.pausalCounts.subtasksAfterHoursPrice} eur` ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );
    //Koniec Prace
    sheet.addRow( [] );

    //Zaciatok vyjazdov
    sheet.addRow( [ 'Výjazdy' ] )
    setLastRowStyle( [ 'A' ], sheet, h1 );
    sheet.addRow( [ 'ID', 'Názov úlohy', 'Zadal', 'Rieši', 'Status', 'Close date', 'Výjazd', 'Mn.' ] )
    setLastRowStyle( [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ], sheet, h3 );
    invoice.pausalTasks.filter( ( pausalTask ) => pausalTask.trips.length !== 0 )
      .forEach( ( pausalTask ) => {
        sheet.addRows(
          task.trips.map( ( trip, index ) => {
            if ( index === 0 ) {
              return [
              pausalTask.task.id,
              pausalTask.task.title,
              pausalTask.task.requester.fullName,
              pausalTask.task.assignedTo.reduce( ( acc, user ) => acc + user.fullName + '\n', "" ),
              pausalTask.task.status.title,
              timestampToString( parseInt( pausalTask.task.closeDate ) ),
              tripData.type,
              tripData.quantity
            ]
            }
            let row = [];
            row[ 7 ] = tripData.type;
            row[ 8 ] = tripData.quantity;
            return row;
          } )
        );
      } )
    sheet.addRow( [] );
    sheet.addRow( [ 'Spolu počet výjazdov:', invoice.pausalCounts.trips ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );

    sheet.addRow( [
      'Spolu počet výjazdov mimo pracovný čas:', invoice.pausalCounts.tripsAfterHours, `Čísla úloh: ${invoice.pausalCounts.tripsAfterHoursTaskIds.toString()}`
    ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );

    sheet.addRow( [ 'Spolu prirážka za výjazdov mimo pracovných hodín:', `${invoice.pausalCounts.tripsAfterHoursPrice} eur` ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );
    //Koniec vyjazdov
    //PAUSALE KONCIA
    sheet.addRow( [] );

    //MIMO PAUSALU
    sheet.addRow( [ 'Práce a výjazdy nad rámec paušálu' ] )
    setLastRowStyle( [ 'A' ], sheet, h2 );
    //Zaciatok - Prace
    sheet.addRow( [ 'Práce' ] )
    setLastRowStyle( [ 'A' ], sheet, h1 );
    sheet.addRow( [ 'ID', 'Názov úlohy', 'Zadal', 'Rieši', 'Status', 'Close date', 'Popis práce', 'Typ práce', 'Hodiny', 'Cena/hodna', 'Cena spolu' ] )
    setLastRowStyle( [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K' ], sheet, h3 );

    invoice.overPausalTasks.filter( ( opTask ) => opTask.subtasks.length !== 0 )
      .forEach( ( opTask ) => {
        sheet.addRows(
          opTask.works.map( ( subtasks, index ) => {
            if ( index === 0 ) {
              return [
                opTask.task.id,
                opTask.task.title,
                opTask.task.requester.fullName,
                opTask.task.assignedTo.reduce( ( acc, user ) => acc + user.fullName + '\n', "" ),
                opTask.task.status.title,
                timestampToString( parseInt( opTask.task.closeDate ) ),
              subtaskData.subtask.title,
              subtaskData.type,
              subtaskData.quantity,
              subtaskData.price,
              subtaskData.price * subtaskData.quantity,
            ]
            }
            let row = [];
            row[ 7 ] = subtaskData.subtask.title;
            row[ 8 ] = subtaskData.type;
            row[ 9 ] = subtaskData.quantity;
            row[ 10 ] = subtaskData.price;
            row[ 11 ] = subtaskData.price * subtaskData.quantity;
            return row;
          } )
        );
      } )
    sheet.addRow( [] );

    sheet.addRow( [ 'Spolu počet hodín:', invoice.overPausalCounts.subtasks ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );

    sheet.addRow( [ 'Spolu počet hodín mimo pracovný čas:', invoice.overPausalCounts.subtasksAfterHours, `Čísla úloh: ${
      invoice.overPausalCounts.subtasksAfterHoursTaskIds.toString()}`
    ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );

    sheet.addRow( [ 'Spolu prirážka za práce mimo pracovných hodín:', `${invoice.overPausalCounts.subtasksAfterHoursPrice} eur` ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );

    sheet.addRow( [ 'Spolu cena bez DPH:', `${invoice.overPausalCounts.subtasksTotalPriceWithoutDPH} eur` ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );

    sheet.addRow( [ 'Spolu cena s DPH:', `${invoice.overPausalCounts.subtasksTotalPriceWithDPH} eur` ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );
    //Koniec - Prace
    sheet.addRow( [] );
    //Zaciatok - Vyjazdy
    sheet.addRow( [ 'Výjazdy' ] )
    setLastRowStyle( [ 'A' ], sheet, h1 );
    sheet.addRow( [ 'ID', 'Názov úlohy', 'Zadal', 'Rieši', 'Status', 'Close date', 'Výjazd', 'Mn.', 'Cena/ks', 'Cena spolu' ] )
    setLastRowStyle( [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ], sheet, h3 );
    invoice.overPausalTasks.filter( ( opTask ) => opTask.trips.length !== 0 )
      .forEach( ( opTask ) => {
        sheet.addRows(
          opTask.trips.map( ( trip, index ) => {
            if ( index === 0 ) {
              return [
                opTask.task.id,
                opTask.task.title,
                opTask.task.requester.fullName,
                opTask.task.assignedTo.reduce( ( acc, user ) => acc + user.fullName + '\n', "" ),
                opTask.task.status.title,
                timestampToString( parseInt( opTask.task.closeDate ) ),
              tripData.type,
              tripData.quantity,
              tripData.price,
              tripData.quantity * tripData.price,
            ]
            }
            let row = [];
            row[ 7 ] = tripData.type;
            row[ 8 ] = tripData.quantity;
            row[ 9 ] = tripData.price;
            row[ 10 ] = tripData.quantity * tripData.price;
            return row;
          } )
        );
      } )
    sheet.addRow( [] );

    sheet.addRow( [ 'Spolu počet výjazdov:', invoice.overPausalCounts.trips ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );

    sheet.addRow( [ 'Spolu počet výjazdov mimo pracovný čas:', invoice.overPausalCounts.tripsAfterHours, `Čísla úloh: ${
      invoice.overPausalCounts.tripsAfterHours.toString()}`
    ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );

    sheet.addRow( [ 'Spolu prirážka za výjazdy mimo pracovných hodín:', `${invoice.overPausalCounts.tripsAfterHoursPrice} eur` ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );

    sheet.addRow( [ 'Spolu cena bez DPH:', `${invoice.overPausalCounts.tripsTotalPriceWithoutDPH} eur` ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );

    sheet.addRow( [ 'Spolu cena s DPH:', `${invoice.overPausalCounts.tripsTotalPriceWithDPH} eur` ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );
    //Koniec - Vyjazdy
    //MIMO PAUSALU KONCI
    sheet.addRow( [] );

    //PROJEKTOVE ULOHY
    sheet.addRow( [ 'Projektové práce a výjazdy' ] )
    setLastRowStyle( [ 'A' ], sheet, h2 );
    //Zaciatok - Prace
    sheet.addRow( [ 'Práce' ] )
    setLastRowStyle( [ 'A' ], sheet, h1 );
    sheet.addRow( [ 'ID', 'Názov úlohy', 'Zadal', 'Rieši', 'Status', 'Close date', 'Popis práce', 'Typ práce', 'Hodiny', 'Cena/hodna', 'Cena spolu' ] )
    setLastRowStyle( [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K' ], sheet, h3 );

    invoice.projectTasks.filter( ( projectTask ) => projectTask.subtasks.length !== 0 )
      .forEach( ( projectTask ) => {
        sheet.addRows(
          projectTask.subtasks.map( ( subtaskData, index ) => {
            if ( index === 0 ) {
              return [
              projectTask.task.id,
              projectTask.task.title,
              projectTask.task.requester.fullName,
              projectTask.task.assignedTo.reduce( ( acc, user ) => acc + user.fullName + '\n', "" ),
              projectTask.task.status.title,
              timestampToString( parseInt( projectTask.task.closeDate ) ),
              subtaskData.subtask.title,
              subtaskData.type,
              subtaskData.quantity,
              subtaskData.price,
              subtaskData.quantity * subtaskData.price,
            ]
            }
            let row = [];
            row[ 7 ] = subtaskData.subtask.title;
            row[ 8 ] = subtaskData.type;
            row[ 9 ] = subtaskData.quantity;
            row[ 10 ] = subtaskData.price;
            row[ 11 ] = subtaskData.quantity * subtaskData.price;
            return row;
          } )
        );
      } )
    sheet.addRow( [] );

    sheet.addRow( [ 'Spolu počet hodín:', invoice.projectCounts.subtasks ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );

    sheet.addRow( [ 'Spolu počet hodín mimo pracovný čas:', invoice.projectCounts.subtasksAfterHours, `Čísla úloh: ${
      invoice.projectCounts.subtasksAfterHoursTaskIds.toString()}`
    ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );

    sheet.addRow( [ 'Spolu prirážka za práce mimo pracovných hodín:', `${invoice.projectCounts.subtasksAfterHoursPrice} eur` ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );

    sheet.addRow( [ 'Spolu cena bez DPH:', `${invoice.projectCounts.subtasksTotalPriceWithoutDPH} eur` ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );

    sheet.addRow( [ 'Spolu cena s DPH:', `${invoice.projectCounts.subtasksTotalPriceWithDPH} eur` ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );
    //Koniec - Prace
    sheet.addRow( [] );
    //Zaciatok - Vyjazdy
    sheet.addRow( [ 'Výjazdy' ] )
    setLastRowStyle( [ 'A' ], sheet, h1 );
    sheet.addRow( [ 'ID', 'Názov úlohy', 'Zadal', 'Rieši', 'Status', 'Close date', 'Výjazd', 'Mn.', 'Cena/ks', 'Cena spolu' ] )
    setLastRowStyle( [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ], sheet, h3 );
    invoice.projectTasks.filter( ( projectTask ) => projectTask.trips.length !== 0 )
      .forEach( ( projectTask ) => {
        sheet.addRows(
          projectTask.trips.map( ( tripData, index ) => {
            if ( index === 0 ) {
              return [
            projectTask.task.id,
            projectTask.task.title,
            projectTask.task.requester.fullName,
            projectTask.task.assignedTo.reduce( ( acc, user ) => acc + user.fullName + '\n', "" ),
            projectTask.task.status.title,
            timestampToString( parseInt( projectTask.task.closeDate ) ),
              tripData.type,
              tripData.quantity,
              tripData.price,
              tripData.quantity * tripData.price,
            ]
            }
            let row = [];
            row[ 7 ] = tripData.type;
            row[ 8 ] = tripData.quantity;
            row[ 9 ] = tripData.price;
            row[ 10 ] = tripData.quantity * tripData.price;
            return row;
          } )
        );
      } )
    sheet.addRow( [] );

    sheet.addRow( [ 'Spolu počet výjazdov:', invoice.projectCounts.trips ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );

    sheet.addRow( [ 'Spolu počet výjazdov mimo pracovný čas:', invoice.projectCounts.tripsAfterHours, `Čísla úloh: ${
      invoice.projectCounts.tripsAfterHoursTaskIds.toString()}`
    ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );

    sheet.addRow( [ 'Spolu prirážka za výjazdy mimo pracovných hodín:', `${invoice.projectCounts.tripsAfterHoursPrice} eur` ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );

    sheet.addRow( [ 'Spolu cena bez DPH:', `${invoice.projectCounts.tripsTotalPriceWithoutDPH} eur` ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );

    sheet.addRow( [ 'Spolu cena s DPH:', `${invoice.projectCounts.tripsTotalPriceWithDPH} eur` ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );
    //Koniec - Vyjazdy
    //Projetky KONCIA
    sheet.addRow( [] )

    // MATERIALE
    sheet.addRow( [ 'Materiále a voľné položky' ] )
    setLastRowStyle( [ 'A' ], sheet, h2 );
    sheet.addRow( [ 'ID', 'Názov', 'Zadal', 'Rieši', 'Status', 'Close date', 'Material', 'Mn.', 'Jednotka', 'Cena/Mn.', 'Cena spolu' ] )
    setLastRowStyle( [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K' ], sheet, h3 );
    invoice.materialTasks.forEach( ( materialTask ) => {
      sheet.addRows(
        materialTask.materials.map( ( materialData, index ) => {
          if ( index === 0 ) {
            return [
              materialTask.task.id,
              materialTask.task.title,
              materialTask.task.requester.fullName,
              materialTask.task.assignedTo.reduce( ( acc, user ) => acc + user.fullName + '\n', "" ),
              materialTask.task.status.title,
              timestampToString( parseInt( materialTask.task.closeDate ) ),
              materialData.title,
              materialData.quantity,
              materialData.price,
              materialData.quantity * materialData.price,
            ]
          }
          let row = [];
          row[ 7 ] = materialData.title;
          row[ 8 ] = materialData.quantity;
          row[ 9 ] = materialData.price;
          row[ 10 ] = materialData.quantity * materialData.price;
          return row;
        } )
      );
      sheet.addRows(
        materialTask.customItems.map( ( customItemData, index ) => {
          if ( index === 0 ) {
            return [
              materialTask.task.id,
              materialTask.task.title,
              materialTask.task.requester.fullName,
              materialTask.task.assignedTo.reduce( ( acc, user ) => acc + user.fullName + '\n', "" ),
              materialTask.task.status.title,
              timestampToString( parseInt( materialTask.task.closeDate ) ),
              customItemData.title,
              customItemData.quantity,
              customItemData.price,
              customItemData.quantity * customItemData.price,
            ]
          }
          let row = [];
          row[ 7 ] = customItemData.title;
          row[ 8 ] = customItemData.quantity;
          row[ 9 ] = customItemData.price;
          row[ 10 ] = customItemData.quantity * customItemData.price;
          return row;
        } )
      );
    } )
    sheet.addRow( [] );

    sheet.addRow( [ 'Spolu cena bez DPH:', `${invoice.totalMaterialAndCustomItemPriceWithDPH} EUR` ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );

    sheet.addRow( [ 'Spolu cena s DPH:', `${invoice.totalMaterialAndCustomItemPriceWithoutDPH} EUR` ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );
    sheet.addRow( [] );

    //SLUZBY
    sheet.addRow( [ 'Mesačný prenájom služieb a harware' ] )
    setLastRowStyle( [ 'A' ], sheet, h2 );
    sheet.addRow( [ 'Názov', 'Mn.', 'Cena/ks/mesiac', 'Cena spolu/mesiac' ] )
    setLastRowStyle( [ 'A', 'B', 'C', 'D' ], sheet, h3 );
    sheet.addRows(
      invoice.invoicedCompany.companyRents.map( ( rentedItem ) => [
        rentedItem.title,
        rentedItem.quantity,
        rentedItem.price,
        rentedItem.quantity * rentedItem.price
      ] )
    )
    sheet.addRow( [] );
    sheet.addRow( [ 'Spolu cena bez DPH:', `${invoice.companyRentsCounts.totalWithoutDPH} EUR` ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );

    sheet.addRow( [ 'Spolu cena s DPH:', `${invoice.companyRentsCounts.totalWithDPH} EUR` ] )
    setLastRowStyle( [ 'A' ], sheet, h3 );


    //STIAHNUTE
    ws.xlsx.writeBuffer()
      .then( buffer => FileSaver.saveAs( new Blob( [ buffer ] ), `${filename}.xlsx` ) )
  }

  const setLastRowStyle = ( range, sheet, style ) => {
    range.forEach( ( letter ) => {
      sheet.getCell( `${letter}${sheet.rowCount}` )
        .font = style;
    } )
  }

  const mergerLastRow = ( range, sheet ) => {
    sheet.mergeCells( `${range[0]}${sheet.rowCount}:${range[1]}${sheet.rowCount}` );
  }

  const setMultipleCellsStyle = ( cells, style, sheet ) => {
    cells.forEach( ( cell ) => {
      sheet.getCell( `${cell}` )
        .font = style;
    } )
  }

  return (
    <button className="btn btn-link waves-effect"
      onClick={() => {
        if(taskInvoiceData && !taskInvoiceLoading){
        downloadExcel(taskInvoiceData.getTaskInvoice)
        }else{
          fetchTaskInvoice({variables:{ id: basicInvoice.id }})
        }
      }}
      >
      Excel
    </button>
  );
}