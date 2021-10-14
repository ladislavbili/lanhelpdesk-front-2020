import React from 'react';
import {
  months
} from 'configs/constants/reports';

export default function InvoicesListOfDates( props ) {

  const {
    companies,
    fromDate,
    toDate,
    setInvoiceFilter,
  } = props;

  const [ hideResults, setHideResults ] = React.useState( false );

  const openInvoice = ( company ) => {
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
        { (hideResults ? [] : companies ).map((company) => (
          <tr key={company.id}>
            <td className="clickable" onClick={ () => openInvoice(company) }>{company.title}</td>
            <td className="clickable" onClick={ () => openInvoice(company) }>{`${months.find((month) => month.value === fromDate.month() + 1 ).label} ${fromDate.year()}`}</td>
            <td>
              <button className="btn-link m-r-10"
                onClick={() => {} }
                >
                PDF
              </button>
              <button className="btn-link"
                onClick={() => {} }
                >
                Excel
              </button>
            </td>
          </tr>
        ))}
        { companies.length !== 0 &&
          <tr key='No company'>
            <td colSpan="3">This range of dates has no invoiced tasks</td>
          </tr>
        }
      </tbody>
    </table>
  );
}