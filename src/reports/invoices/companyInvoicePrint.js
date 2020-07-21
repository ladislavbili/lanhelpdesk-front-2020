import React, { Component } from 'react';
import ReactToPrint from 'react-to-print';
import CompanyInvoice from './companyInvoice';

export default class CompanyInvoicePrint extends Component {

	render() {
		return (
			<div className="display-inline">
					<ReactToPrint
						trigger={() =>
							<button className="btn btn-link waves-effect">
								pdf
							</button>
						}
						content={()=>this.toPrint}
					/>
				<div style={{display: "none"}}>
					<CompanyInvoice ref={ref => (this.toPrint = ref)} invoice={this.props.invoice}/>
				</div>
			</div>
		)
	}
}
