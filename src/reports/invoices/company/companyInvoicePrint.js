import React from 'react';
import ReactToPrint from 'react-to-print';
import CompanyInvoice from './companyInvoice';
import {
  useLazyQuery,
} from "@apollo/client";
import {
  GET_TASK_INVOICE,
} from './queries';

export default function CompanyInvoicePrint( props ) {
  const {
    basicInvoice
  } = props;

  const [ fetchTaskInvoice, {
    loading: taskInvoiceLoading,
    data: taskInvoiceData
	} ] = useLazyQuery( GET_TASK_INVOICE );

  React.useEffect( () => {
    if ( taskInvoiceData && !taskInvoiceLoading ) {
      buttonRef.current.click();
    }
  }, [ taskInvoiceLoading, taskInvoiceData ] );

  const toPrintRef = React.useRef();
  const buttonRef = React.useRef();
  return (
    <div className="display-inline">
			<button className="btn btn-link waves-effect" onClick={() => {
					if(taskInvoiceData && !taskInvoiceLoading){
		      buttonRef.current.click();
					}else{
						fetchTaskInvoice({variables:{ id: basicInvoice.id }})
					}
				} }>
				pdf
			</button>
			<ReactToPrint
				trigger={() =>
					<button className="btn btn-link waves-effect" ref={buttonRef} style={{display: 'none'}} >
						pdf
					</button>
				}
				content={()=> toPrintRef.current}
				/>
			<div style={{display: "none"}}>
				<div ref={toPrintRef}>
				<CompanyInvoice invoice={taskInvoiceData === undefined ? null : taskInvoiceData.getTaskInvoice}/>
				</div>
			</div>
		</div>
  )
}