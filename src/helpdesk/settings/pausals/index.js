import React, { Component } from 'react';
import PausalEdit from './pausalEdit';

import { connect } from "react-redux";
import {storageCompaniesStart} from '../../../redux/actions';
import {sameStringForms} from '../../../helperFunctions';

class CompaniesList extends Component{
  constructor(props){
    super(props);
    this.state={
      companies:[],
      companyFilter:''
    }
  }

  componentWillReceiveProps(props){
    if(!sameStringForms(props.companies,this.props.companies)){
      this.setState({companies:props.companies})
    }
  }

  componentWillMount(){
    if(!this.props.companiesActive){
      this.props.storageCompaniesStart();
    }
    this.setState({companies:this.props.companies});
  }

  render(){
    console.log(this.state.companies);

    return (
      <div className="content">
        <div className="row m-0 p-0 taskList-container">
          <div className="col-lg-4">
            <div className="commandbar">
              <div className="search-row">
                <div className="search">
                  <button className="search-btn" type="button">
                    <i className="fa fa-search" />
                  </button>
                    <input
                      type="text"
                      className="form-control search-text"
                      value={this.state.companyFilter}
                      onChange={(e)=>this.setState({companyFilter:e.target.value})}
                      placeholder="Search"
                    />
                </div>
              </div>
            </div>

            <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <h2 className=" p-b-10 p-l-10">
                Service level agreements
  						</h2>
              <table className="table table-hover">
                <tbody>
                  {
                    this.state.companies.filter(item => item.workPausal !== 0 || item.drivePausal !== 0)
                      .filter((item) => item.title.toLowerCase().includes(this.state.companyFilter.toLowerCase())||(item.drivePausal).toLowerCase().includes(this.state.companyFilter.toLowerCase())||(item.pausal+'').toLowerCase().includes(this.state.companyFilter.toLowerCase()))
                      .map((company)=>
                        <tr
                          key={company.id}
                          className={"clickable" + (this.props.match.params.id === company.id ? " active":"")}
                          onClick={()=>this.props.history.push('/helpdesk/settings/pausals/'+company.id)}>
                          <td>
                            {company.title}
                          </td>
                          <td>
                            {company.workPausal}
                          </td>
                          <td>
                            {company.drivePausal}
                          </td>
                        </tr>
                    )
                }
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="commandbar"></div>
            {
              this.props.match.params.id && this.state.companies.some((item)=>item.id===this.props.match.params.id) && <PausalEdit match={this.props.match} history = {this.props.history} />
            }
          </div>
        </div>
        </div>
      );
}
}

const mapStateToProps = ({ storageCompanies}) => {
  const { companiesActive, companies } = storageCompanies;
  return { companiesActive, companies };
};

export default connect(mapStateToProps, { storageCompaniesStart })(CompaniesList);
