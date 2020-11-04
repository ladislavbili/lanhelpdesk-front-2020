import React, {
  Component
} from 'react';
import {
  connect
} from "react-redux";
import {
  FormGroup,
  Label
} from 'reactstrap';
import Select from 'react-select';
import {
  storageCompaniesStart,
  storageHelpCompanyInvoicesStart
} from '../../redux/actions';
import {
  timestampToDate,
  toSelArr
} from '../../helperFunctions';
import {
  selectStyle
} from 'configs/components/select';
import CompanyInvoice from './companyInvoice';
import CompanyInvoicePrint from './companyInvoicePrint';

class CompanyReports extends Component {
  render() {
    return null;
  }
  /*
  constructor(props){
  	super(props);
  	this.state={
  		showCompany:null,
  		showInvoice:null,
  	}
  	this.getFilteredCompanies.bind(this);
  }

  storageLoaded(props){
  	return props.companiesLoaded &&
  	props.companyInvoicesLoaded
  }

  componentWillMount(){
  	if(!this.props.companiesActive){
  		this.props.storageCompaniesStart();
  	}
  	if(!this.props.companyInvoicesActive){
  		this.props.storageHelpCompanyInvoicesStart();
  	}
  }

  getFilteredCompanies(){
  	return this.props.companies.filter((company)=>this.props.companyInvoices.some((invoice)=>invoice.company.id===company.id))
  }

  render() {
  	return (
  			<div className="scrollable fit-with-header">
  					<FormGroup className="flex-row p-20" style={{maxWidth:700}}>
  						<Label className="center-hor p-r-5" for="name">Firma:</Label>
  						<span className='flex'>
  						<Select
  							value={this.state.showCompany}
  							placeholder="Vyberte firmu"
  							onChange={(company)=>{
  								this.setState({showCompany:company });
  							}}
  							options={toSelArr(this.getFilteredCompanies())}
  							styles={selectStyle}
  							/>
  					</span>
  					</FormGroup>

  				{ this.state.showCompany!==null && <div className="p-20">
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
  								this.props.companyInvoices.filter((invoice)=>invoice.company.id===this.state.showCompany.id).sort((invoice1,invoice2)=>invoice1.createdAt>invoice2.createdAt?-1:1).map((invoice)=>
  								<tr key={invoice.id}>
  									<td className="clickable" onClick={()=>this.setState({showInvoice:invoice})}>{invoice.title}</td>
  									<td className="clickable" onClick={()=>this.setState({showInvoice:invoice})}>{`od ${timestampToDate(invoice.from)} do ${timestampToDate(invoice.to)}`}</td>
  									<td><CompanyInvoicePrint invoice={invoice}/></td>
  								</tr>
  							)}
  						</tbody>
  					</table>
  				</div>}

  				{this.state.showInvoice!==null &&
  					<CompanyInvoice invoice={this.state.showInvoice}/>
  					}
  			 </div>
  	);
  }*/
}

const mapStateToProps = ( {
  storageCompanies,
  storageHelpCompanyInvoices
} ) => {
  const {
    companiesActive,
    companies,
    companiesLoaded
  } = storageCompanies;
  const {
    companyInvoicesLoaded,
    companyInvoicesActive,
    companyInvoices
  } = storageHelpCompanyInvoices;

  return {
    companiesActive,
    companies,
    companiesLoaded,
    companyInvoicesLoaded,
    companyInvoicesActive,
    companyInvoices,
  };
};

export default connect( mapStateToProps, {
  storageCompaniesStart,
  storageHelpCompanyInvoicesStart
} )( CompanyReports );