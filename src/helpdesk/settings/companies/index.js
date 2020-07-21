import React, { Component } from 'react';
import {Button } from 'reactstrap';
import CompanyAdd from './companyAdd';
import CompanyEdit from './companyEdit';

import { connect } from "react-redux";
import {storageCompaniesStart} from '../../../redux/actions';
import {sameStringForms} from '../../../helperFunctions';

class CompaniesList extends Component{
  constructor(props){
    super(props);
    this.state={
      companies:[],
      companyFilter:'',
      sortBy: "0",
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
              <Button
                className="btn-link center-hor"
                onClick={()=>this.props.history.push('/helpdesk/settings/companies/add')}>
                <i className="fa fa-plus p-l-5 p-r-5"/> Company
              </Button>
            </div>

            <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <div className="row">
                <h2 className=" p-l-10 p-b-10 ">
    							Companies
    						</h2>
                <div className="d-flex flex-row align-items-center ml-auto">
                  <div className="text-basic m-r-5 m-l-5">
      							Sort by
      						</div>
                  <select
    								value={this.state.sortBy}
    								className="invisible-select text-bold text-highlight"
    								onChange={(e)=> this.setState({sortBy: e.target.value})}>
    									<option value={0} key={0}>All</option>
      								<option value={1} key={1}>Contracted</option>
        							<option value={2} key={2}>Non-contracted</option>
    							</select>
                </div>
              </div>
              <table className="table table-hover">
                <tbody>
                    {
                      this.state.companies.filter((item) => {
                        let cond = true;
                        if (this.state.sortBy === "1"){
                          cond = parseInt(item.drivePausal) > 0 || parseInt(item.workPausal) > 0;
                        } else if (this.state.sortBy === "2"){
                          cond = !(parseInt(item.drivePausal) > 0 || parseInt(item.workPausal) > 0);
                        }

                        return cond && item.title.toLowerCase().includes(this.state.companyFilter.toLowerCase());
                      })
                        .map((company)=>
                          <tr
                            key={company.id}
                            className={"clickable" + (this.props.match.params.id === company.id ? " active":"")}
                            onClick={()=>this.props.history.push('/helpdesk/settings/companies/'+company.id)}>
                            <td>
                              {company.title}
                            </td>
                            <td width="10%">
                              {company.monthlyPausal  ? "Zmluvný" : "Nezmluvný"}
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
              this.props.match.params.id && this.props.match.params.id==='add' && <CompanyAdd {...this.props}/>
            }
            {
              this.props.match.params.id && this.props.match.params.id!=='add' && this.state.companies.some((item)=>item.id===this.props.match.params.id) && <CompanyEdit match={this.props.match} history = {this.props.history} />
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
