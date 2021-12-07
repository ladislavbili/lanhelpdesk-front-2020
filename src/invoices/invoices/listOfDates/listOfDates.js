import React from 'react';
import moment from 'moment';
import PrintInvoice from 'invoices/invoices/print';

export default function InvoicesListOfDates( props ) {

  const {
    company,
    dates,
    setInvoiceFilter,
  } = props;

  const [ hideResults, setHideResults ] = React.useState( false );

  const openInvoice = ( date ) => {
    let fromDate = moment( {
        year: date.year,
        month: date.month.value - 1
      } )
      .startOf( 'month' );
    let toDate = moment( {
        year: date.year,
        month: date.month.value - 1
      } )
      .endOf( 'month' );
    setInvoiceFilter( {
      fromDate,
      toDate,
      company
    } )
  }

  return (
    <table className="table bkg-white row-highlight max-width-700">
      <thead>
        <tr>
          <th>Company</th>
          <th>Obdobie</th>
          <th width="150">
            <div className="row">
              <span className="mt-auto">
              Export
            </span>
            <button className="btn-link ml-auto"
              onClick={() => setHideResults(!hideResults)}
              >
              { hideResults ?
                <i className="fas fa-chevron-up" /> :
                <i className="fas fa-chevron-down" />
              }
            </button>
          </div>
          </th>
        </tr>
      </thead>
      <tbody>
        { (hideResults ? [] : dates ).map((date) => (
          <tr key={`${date.year}-${date.month.value}`}>
            <td className="clickable" onClick={ () => openInvoice(date) }>{company.title}</td>
            <td className="clickable" onClick={ () => openInvoice(date) }>{`${date.month.label} ${date.year}`}</td>
            <td>
              <PrintInvoice
                company={company}
                variables={{
                  companyId: company.id,
                  fromDate: moment( {
                      year: date.year,
                      month: date.month.value - 1
                    } )
                    .startOf( 'month' ).valueOf()
                  .toString(),
                  toDate: moment( {
                      year: date.year,
                      month: date.month.value - 1
                    } )
                    .endOf( 'month' ).valueOf()
                  .toString(),
                }}
                />
              <button className="btn-link"
                onClick={() => {} }
                >
                Excel
              </button>
            </td>
          </tr>
        ))}
        { dates.length === 0 &&
          <tr key='No date'>
            <td colSpan="3">This company has no invoiced tasks</td>
          </tr>
        }
      </tbody>
    </table>
  );
}