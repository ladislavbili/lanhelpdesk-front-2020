import React from 'react';
import ReactToPrint from 'react-to-print';
import CompanyInvoice from './invoice/invoice';
import {
  useQuery,
  useLazyQuery,
} from "@apollo/client";

import {
  INVOICE,
} from 'reports/queries';

import {
  GET_REPORTS_FROM_DATE,
  GET_REPORTS_TO_DATE,
} from 'apollo/localSchema/queries';

export default function CompanyInvoicePrint( props ) {
  const {
    variables,
    company,
  } = props;

  const [ fetchInvoice, {
    data: invoiceData,
    loading: invoiceLoading,
	} ] = useLazyQuery( INVOICE, {
    onCompleted: () => {
      buttonRef.current.click();
    },
  } );

  const {
    data: fromDateData,
  } = useQuery( GET_REPORTS_FROM_DATE );
  const {
    data: toDateData,
  } = useQuery( GET_REPORTS_TO_DATE );

  const toPrintRef = React.useRef();
  const buttonRef = React.useRef();
  return (
    <div className="display-inline">
			<button className="btn-link btn-distance" onClick={() => {
					if( invoiceData && !invoiceLoading ){
		      buttonRef.current.click();
					}else{
            fetchInvoice( {
              variables,
            } );
					}
				} }>
				PDF
			</button>
			<ReactToPrint
				trigger={() =>
					<button className="btn btn-link waves-effect" disabled={invoiceLoading} ref={buttonRef} style={{display: 'none'}} />
				}
				content={() => toPrintRef.current}
				/>
			<div style={{display: "none"}}>
				<div ref={toPrintRef}>
          { invoiceData &&
            <CompanyInvoice
              invoice={invoiceData.invoice}
              company={company}
              fromDate={fromDateData.reportsFromDate}
              toDate={toDateData.reportsToDate}
              />
          }
				</div>
			</div>
		</div>
  )
}