import React from 'react';
import {
  FormGroup,
  Label
} from 'reactstrap';
import Loading from 'components/loading';
import Select from 'react-select';
import {
  timestampToDate,
  toSelArr
} from 'helperFunctions';
import {
  useQuery,
  useLazyQuery,
} from "@apollo/client";
import {
  selectStyle
} from 'configs/components/select';
import {
  COMPANIES_WITH_INVOICES,
  GET_COMPANY_INVOICES,
  GET_TASK_INVOICE
} from './queries';

import CompanyInvoice from './companyInvoice';
import CompanyInvoicePrint from './companyInvoicePrint';
import ExcelExport from './excelExport';

export default function CompanyReports( props ) {

  //querries and mutations
  const {
    data: companiesData,
    loading: companiesLoading
  } = useQuery( COMPANIES_WITH_INVOICES );

  const [ fetchCompanyInvoices, {
    loading: companyInvoicesLoading,
    data: companyInvoicesData
		} ] = useLazyQuery( GET_COMPANY_INVOICES );

  const [ fetchTaskInvoice, {
    loading: taskInvoiceLoading,
    data: taskInvoiceData
    } ] = useLazyQuery( GET_TASK_INVOICE );

  //state
  const [ company, setCompany ] = React.useState( null );
  const [ invoice, setInvoice ] = React.useState( null );

  const loading = (
    companiesLoading
  );

  if ( loading ) {
    return <Loading/>
  }

  const Invoice = () => {
    if ( !taskInvoiceData || taskInvoiceLoading ) {
      return ( <Loading /> )
    }
    return (
      <CompanyInvoice invoice={taskInvoiceData.getTaskInvoice}/>
    )
  }

  const InvoiceList = () => {
    if ( !companyInvoicesData || companyInvoicesLoading ) {
      return ( <Loading /> )
    }
    return (
      <div className="p-20">
        <table className="table m-b-10">
          <thead>
            <tr>
              <th>Názov</th>
              <th>Obdobie</th>
              <th>Export</th>
            </tr>
          </thead>
          <tbody>
            {
              companyInvoicesData.getCompanyInvoices.map((invoice) =>
              <tr key={invoice.id}>
                <td className="clickable" onClick={ () => { setInvoice(invoice); fetchTaskInvoice({variables:{ id: invoice.id }}) }}>{invoice.title}</td>
                <td className="clickable" onClick={ () => { setInvoice(invoice); fetchTaskInvoice({variables:{ id: invoice.id }}) }}>
                  {
                    `od ${timestampToDate(parseInt(invoice.fromDate))} do ${timestampToDate(parseInt(invoice.toDate))}`
                  }
                  </td>
                <td>
                  <CompanyInvoicePrint basicInvoice={invoice}/>
                  <ExcelExport filename={invoice.title} basicInvoice={invoice} />
              </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="scrollable fit-with-header">
        <FormGroup className="flex-row p-20" style={{maxWidth:700}}>
          <Label className="center-hor p-r-5" for="name">Firma:</Label>
          <span className='flex'>
          <Select
            value={company}
            placeholder="Vyberte firmu"
            onChange={(company) => {
              setCompany(company);
              fetchCompanyInvoices({variables: {id: company.id}})
            }}
            options={toSelArr(companiesData.companiesWithInvoices)}
            styles={selectStyle}
            />
        </span>
        </FormGroup>
        { company !== null && <InvoiceList /> }
        { invoice &&
          <Invoice />
          }
      </div>
  );
}