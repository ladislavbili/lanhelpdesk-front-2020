import {
  Component
} from 'react';

export default class RerouteToMonthlyCompany extends Component {
  constructor( props ) {
    super( props );
    this.props.history.push( './reports/monthly/companies' );
  }
  render() {
    return null;
  }
}