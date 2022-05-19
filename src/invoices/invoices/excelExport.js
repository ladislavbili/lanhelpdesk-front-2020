import React from 'react';
import {
  useLazyQuery,
} from "@apollo/client";
import Excel from 'exceljs';
import FileSaver from 'file-saver';
import moment from 'moment';

import {
  timestampToDate,
  timestampToString,
} from 'helperFunctions';
import {
  INVOICE,
} from 'invoices/queries';

import {
  GET_REPORTS_FROM_DATE,
  GET_REPORTS_TO_DATE,
} from 'apollo/localSchema/queries';

export default function ExcelExport( props ) {
  const {
    variables,
    company,
  } = props;

  const [ fetchInvoice, {
    data: invoiceData,
    loading: invoiceLoading,
  } ] = useLazyQuery( INVOICE, {
    onCompleted: ( invoiceData ) => {
      downloadExcel( invoiceData.invoice )
    },
  } );

  const downloadExcel = async ( invoice ) => {
    console.log( 'aaaa' );
    const filename = `Výkaz ${company.title} ${moment(variables.dateFrom).year()}/${moment(variables.dateFrom).month()}`;

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
        width: 3 * widthMultiplier
      },
      {
        width: 10 * widthMultiplier
      },
      {
        width: 4 * widthMultiplier
      },
      {
        width: 3 * widthMultiplier
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
      [ `Firma ${company.title}`, `Počet prác vrámci paušálu: ${invoice.pausalTotals.workHours}` ],
      [ `Obdobie od ${timestampToDate(parseInt(variables.fromDate))} do: ${timestampToDate(parseInt(variables.toDate))}`, `Počet výjazdov vrámci paušálu: ${invoice.pausalTotals.tripHours}` ],
      [],
      [ 'Práce a výjazdy vrámci paušálu' ],
      [ 'Práce' ],
      [ 'ID', 'Názov úlohy', 'Zadal', 'Rieši', 'Close date', 'Popis práce', 'Hodiny' ]
    ] )
    setMultipleCellsStyle( [ 'A1', 'A6' ], h1, sheet );
    setMultipleCellsStyle( [ 'A5' ], h2, sheet )
    setMultipleCellsStyle( [ 'A7', 'B7', 'C7', 'D7', 'E7', 'F7', 'G7', 'H7', 'I7' ], h3, sheet );

    //Prace
    invoice.pausalTasks.filter( ( task ) => task.subtasks.length !== 0 )
      .forEach( ( task ) => {
        sheet.addRows(
          task.subtasks.map( ( subtask, index ) => {
            if ( index === 0 ) {
              return [
              task.taskId,
              task.title,
              task.requester.fullName,
              task.assignedTo.map( ( user ) => user.fullName )
                .join( '\n' ),
              timestampToString( parseInt( task.closeDate ) ),
              subtask.title,
              subtask.quantity,
            ]
            }
            let row = [];
            row[ 6 ] = subtask.title;
            row[ 7 ] = subtask.quantity;
            return row;
          } )
        );
      } )
    sheet.addRow( [] );
    sheet.addRow( [ 'Spolu počet hodín:', invoice.pausalTotals.workHours ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );

    sheet.addRow( [
      'Spolu počet hodín mimo pracovný čas:', invoice.pausalTotals.workOvertime, `Čísla úloh: ${invoice.pausalTotals.workOvertimeTasks.join(',')}`
    ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );

    sheet.addRow( [ 'Spolu prirážka za práce mimo pracovných hodín:', `${invoice.pausalTotals.workExtraPrice.toFixed(2)} eur` ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );
    //Koniec Prace
    sheet.addRow( [] );

    //Zaciatok vyjazdov
    sheet.addRow( [ 'Výjazdy' ] )
    setLastRowStyle( [ 'A' ], sheet, h1 );
    sheet.addRow( [ 'ID', 'Názov úlohy', 'Zadal', 'Rieši', 'Close date', 'Výjazd', 'Mn.' ] )
    setLastRowStyle( [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H' ], sheet, h3 );
    invoice.pausalTasks.filter( ( task ) => task.workTrips.length !== 0 )
      .forEach( ( task ) => {
        sheet.addRows(
          task.workTrips.map( ( trip, index ) => {
            if ( index === 0 ) {
              return [
              task.taskId,
              task.title,
              task.requester.fullName,
              task.assignedTo.map( ( user ) => user.fullName )
                .join( '\n' ),
              timestampToString( parseInt( task.closeDate ) ),
              trip.type.title,
              trip.quantity
            ]
            }
            let row = [];
            row[ 6 ] = trip.type.title;
            row[ 7 ] = trip.quantity;
            return row;
          } )
        );
      } )
    sheet.addRow( [] );
    sheet.addRow( [ 'Spolu počet výjazdov:', invoice.pausalTotals.tripHours ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );

    sheet.addRow( [
      'Spolu počet výjazdov mimo pracovný čas:', invoice.pausalTotals.tripOvertime, `Čísla úloh: ${invoice.pausalTotals.tripOvertimeTasks.join(',')}`
    ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );

    sheet.addRow( [ 'Spolu prirážka za výjazdov mimo pracovných hodín:', `${invoice.pausalTotals.tripExtraPrice.toFixed(2)} eur` ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );
    //Koniec vyjazdov
    //PAUSALE KONCIA
    sheet.addRow( [] );

    //MIMO PAUSALU
    sheet.addRow( [ 'Práce a výjazdy nad rámec paušálu' ] )
    setLastRowStyle( [ 'A' ], sheet, h2 );
    //Zaciatok - Prace
    sheet.addRow( [ 'Práce' ] )
    setLastRowStyle( [ 'A' ], sheet, h1 );
    sheet.addRow( [ 'ID', 'Názov úlohy', 'Zadal', 'Rieši', 'Close date', 'Popis práce', 'Hodiny', 'Cena/hodna', 'Cena spolu' ] )
    setLastRowStyle( [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K' ], sheet, h3 );

    invoice.overPausalTasks.filter( ( task ) => task.subtasks.length !== 0 )
      .forEach( ( task ) => {
        sheet.addRows(
          task.subtasks.map( ( subtask, index ) => {
            if ( index === 0 ) {
              return [
              task.taskId,
              task.title,
              task.requester.fullName,
              task.assignedTo.map( ( user ) => user.fullName )
                .join( '\n' ),
              timestampToString( parseInt( task.closeDate ) ),
              subtask.title,
              subtask.quantity,
              subtask.price,
              subtask.total,
            ]
            }
            let row = [];
            row[ 6 ] = subtask.title;
            row[ 7 ] = subtask.quantity;
            row[ 8 ] = subtask.price;
            row[ 9 ] = subtask.total;
            return row;
          } )
        );
      } )
    sheet.addRow( [] );

    sheet.addRow( [ 'Spolu počet hodín:', invoice.overPausalTotals.workHours ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );

    sheet.addRow( [ 'Spolu počet hodín mimo pracovný čas:', invoice.overPausalTotals.workOvertime, `Čísla úloh: ${
      invoice.overPausalTotals.workOvertimeTasks.join(',')}`
    ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );

    sheet.addRow( [ 'Spolu prirážka za práce mimo pracovných hodín:', `${invoice.overPausalTotals.workExtraPrice.toFixed(2)} eur` ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );

    sheet.addRow( [ 'Spolu cena bez DPH:', `${invoice.overPausalTotals.workTotalPrice.toFixed(2)} eur` ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );

    sheet.addRow( [ 'Spolu cena s DPH:', `${invoice.overPausalTotals.workTotalPriceWithDPH.toFixed(2)} eur` ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );
    //Koniec - Prace
    sheet.addRow( [] );
    //Zaciatok - Vyjazdy
    sheet.addRow( [ 'Výjazdy' ] )
    setLastRowStyle( [ 'A' ], sheet, h1 );
    sheet.addRow( [ 'ID', 'Názov úlohy', 'Zadal', 'Rieši', 'Close date', 'Výjazd', 'Mn.', 'Cena/ks', 'Cena spolu' ] )
    setLastRowStyle( [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ], sheet, h3 );
    invoice.overPausalTasks.filter( ( task ) => task.workTrips.length !== 0 )
      .forEach( ( task ) => {
        sheet.addRows(
          task.workTrips.map( ( trip, index ) => {
            if ( index === 0 ) {
              return [
              task.taskId,
              task.title,
              task.requester.fullName,
              task.assignedTo.map( ( user ) => user.fullName )
                .join( '\n' ),
              timestampToString( parseInt( task.closeDate ) ),
              trip.type.title,
              trip.quantity,
              trip.price,
              trip.total,
            ]
            }
            let row = [];
            row[ 6 ] = trip.type.title;
            row[ 7 ] = trip.quantity;
            row[ 8 ] = trip.price;
            row[ 9 ] = trip.total;
            return row;
          } )
        );
      } )
    sheet.addRow( [] );

    sheet.addRow( [ 'Spolu počet výjazdov:', invoice.overPausalTotals.tripHours ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );

    sheet.addRow( [ 'Spolu počet výjazdov mimo pracovný čas:', invoice.overPausalTotals.tripOvertime, `Čísla úloh: ${
      invoice.overPausalTotals.tripOvertimeTasks.join(',')}`
    ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );

    sheet.addRow( [ 'Spolu prirážka za výjazdy mimo pracovných hodín:', `${invoice.overPausalTotals.tripExtraPrice.toFixed(2)} eur` ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );

    sheet.addRow( [ 'Spolu cena bez DPH:', `${invoice.overPausalTotals.tripTotalPrice.toFixed(2)} eur` ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );

    sheet.addRow( [ 'Spolu cena s DPH:', `${invoice.overPausalTotals.tripTotalPriceWithDPH.toFixed(2)} eur` ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );
    //Koniec - Vyjazdy
    //MIMO PAUSALU KONCI
    sheet.addRow( [] );

    //PROJEKTOVE ULOHY
    sheet.addRow( [ 'Projektové práce a výjazdy' ] )
    setLastRowStyle( [ 'A' ], sheet, h2 );
    //Zaciatok - Prace
    sheet.addRow( [ 'Práce' ] )
    setLastRowStyle( [ 'A' ], sheet, h1 );
    sheet.addRow( [ 'ID', 'Názov úlohy', 'Zadal', 'Rieši', 'Close date', 'Popis práce', 'Typ práce', 'Hodiny', 'Cena/hodna', 'Cena spolu' ] )
    setLastRowStyle( [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K' ], sheet, h3 );

    invoice.projectTasks.filter( ( task ) => task.subtasks.length !== 0 )
      .forEach( ( task ) => {
        sheet.addRows(
          task.subtasks.map( ( subtask, index ) => {
            if ( index === 0 ) {
              return [
              task.taskId,
              task.title,
              task.requester.fullName,
              task.assignedTo.map( ( user ) => user.fullName )
                .join( '\n' ),
              timestampToString( parseInt( task.closeDate ) ),
              subtask.title,
              subtask.type,
              subtask.quantity,
              subtask.price,
              subtask.total,
            ]
            }
            let row = [];
            row[ 6 ] = subtask.title;
            row[ 7 ] = subtask.type;
            row[ 8 ] = subtask.quantity;
            row[ 9 ] = subtask.price;
            row[ 10 ] = subtask.total;
            return row;
          } )
        );
      } )
    sheet.addRow( [] );

    sheet.addRow( [ 'Spolu počet hodín:', invoice.projectTotals.workHours ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );

    sheet.addRow( [ 'Spolu počet hodín mimo pracovný čas:', invoice.projectTotals.workOvertime, `Čísla úloh: ${
      invoice.projectTotals.workOvertimeTasks.join(',') }`
    ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );

    sheet.addRow( [ 'Spolu prirážka za práce mimo pracovných hodín:', `${invoice.projectTotals.workExtraPrice.toFixed(2)} eur` ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );

    sheet.addRow( [ 'Spolu cena bez DPH:', `${invoice.projectTotals.workTotalPrice.toFixed(2)} eur` ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );

    sheet.addRow( [ 'Spolu cena s DPH:', `${invoice.projectTotals.workTotalPriceWithDPH.toFixed(2)} eur` ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );
    //Koniec - Prace
    sheet.addRow( [] );
    //Zaciatok - Vyjazdy
    sheet.addRow( [ 'Výjazdy' ] )
    setLastRowStyle( [ 'A' ], sheet, h1 );
    sheet.addRow( [ 'ID', 'Názov úlohy', 'Zadal', 'Rieši', 'Close date', 'Výjazd', 'Mn.', 'Cena/ks', 'Cena spolu' ] )
    setLastRowStyle( [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J' ], sheet, h3 );
    invoice.projectTasks.filter( ( task ) => task.workTrips.length !== 0 )
      .forEach( ( task ) => {
        sheet.addRows(
          task.workTrips.map( ( trip, index ) => {
            if ( index === 0 ) {
              return [
              task.taskId,
              task.title,
              task.requester.fullName,
              task.assignedTo.map( ( user ) => user.fullName )
                .join( '\n' ),
              timestampToString( parseInt( task.closeDate ) ),
              trip.type.title,
              trip.quantity,
              trip.price,
              trip.total,
            ]
            }
            let row = [];
            row[ 6 ] = trip.type.title;
            row[ 7 ] = trip.quantity;
            row[ 8 ] = trip.price;
            row[ 9 ] = trip.total;
            return row;
          } )
        );
      } )
    sheet.addRow( [] );

    sheet.addRow( [ 'Spolu počet výjazdov:', invoice.projectTotals.tripHours ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );

    sheet.addRow( [ 'Spolu počet výjazdov mimo pracovný čas:', invoice.projectTotals.tripOvertime, `Čísla úloh: ${
      invoice.projectTotals.tripOvertimeTasks.join(',') }`
    ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );

    sheet.addRow( [ 'Spolu prirážka za výjazdy mimo pracovných hodín:', `${invoice.projectTotals.tripExtraPrice.toFixed(2)} eur` ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );

    sheet.addRow( [ 'Spolu cena bez DPH:', `${invoice.projectTotals.tripTotalPrice.toFixed(2)} eur` ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );

    sheet.addRow( [ 'Spolu cena s DPH:', `${invoice.projectTotals.tripTotalPriceWithDPH.toFixed(2)} eur` ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );
    //Koniec - Vyjazdy
    //Projetky KONCIA
    sheet.addRow( [] )

    // MATERIALE
    sheet.addRow( [ 'Materiále a voľné položky' ] )
    setLastRowStyle( [ 'A' ], sheet, h2 );
    sheet.addRow( [ 'ID', 'Názov', 'Zadal', 'Rieši', 'Close date', 'Material', 'Mn.', 'Cena/Mn.', 'Cena spolu' ] )
    setLastRowStyle( [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K' ], sheet, h3 );
    invoice.materialTasks.forEach( ( task ) => {
      sheet.addRows(
        task.materials.map( ( material, index ) => {
          if ( index === 0 ) {
            return [
              task.taskId,
              task.title,
              task.requester.fullName,
              task.assignedTo.map( ( user ) => user.fullName )
              .join( '\n' ),
              timestampToString( parseInt( task.closeDate ) ),
              material.title,
              material.quantity,
              material.price,
              material.total,
            ]
          }
          let row = [];
          row[ 6 ] = material.title;
          row[ 7 ] = material.quantity;
          row[ 8 ] = material.price;
          row[ 9 ] = material.total;
          return row;
        } )
      );
    } )
    sheet.addRow( [] );

    sheet.addRow( [ 'Spolu cena bez DPH:', `${invoice.materialTotals.price.toFixed(2)} EUR` ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );

    sheet.addRow( [ 'Spolu cena s DPH:', `${invoice.materialTotals.priceWithDPH.toFixed(2)} EUR` ] )
    setLastRowStyle( [ 'A', 'B' ], sheet, h3 );
    sheet.addRow( [] );


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
    <button className="btn-link"
      disabled={invoiceLoading}
      onClick={() => {
        if(invoiceData && !invoiceLoading){
          downloadExcel(invoiceData.invoice)
        }else{
          fetchInvoice({variables});
        }
      }}
      >
      Excel
    </button>
  );
}