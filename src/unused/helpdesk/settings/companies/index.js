import React, { Component } from 'react';
import {Button } from 'reactstrap';
import {rebase} from '../../../index';
import CompanyAdd from './companyAdd';
import CompanyEdit from './companyEdit';

export default class CompaniesList extends Component{
  constructor(props){
    super(props);
    this.state={
      companies:[]
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/companies', {
      context: this,
      withIds: true,
      then:content=>{this.setState({companies:content, companyFilter:''})},
    });
  }

  componentWillUnmount(){
    rebase.removeBinding(this.ref);
  }

  render(){

    return (
      <div className="content-page">
				<div className="content" style={{ paddingTop: 0 }}>
					<div className="commandbar">
						<div className="row align-items-center">
              <div className="p-2">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control search"
                    value={this.state.companyFilter}
                    onChange={(e)=>this.setState({companyFilter:e.target.value})}
                    placeholder="Search"
                  />
                  <div className="input-group-append">
                    <button className="search-btn" type="button">
                      <i className="fa fa-search" />
                    </button>
                  </div>
                </div>
              </div>

                <Button
          				className="btn-link t-a-l"
          				onClick={()=>this.props.history.push('/helpdesk/settings/companies/add')}>
          			 <i className="fa fa-plus m-r-5 m-l-5 "/> Company
          			</Button>

            </div>
          </div>

          <div className="row m-0 p-0 taskList-container">
            <div className="col-lg-4 p-0 scrollable fit-with-header-and-commandbar">
              <table className="table table-hover p-5">
                <thead>
                  <tr>
                    <th>Company name</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.companies.filter((item) => item.title.toLowerCase().includes(this.state.companyFilter.toLowerCase()))
                      .map((company)=>
                        <tr
                          key={company.id}
                          className={"clickable" + (this.props.match.params.id === company.id ? " sidebar-item-active":"")}
                          onClick={()=>this.props.history.push('/helpdesk/settings/companies/'+company.id)}>
                          <td className={(this.props.match.params.id === company.id ? "text-highlight":"")}>
                            {company.title}
                          </td>
                        </tr>
                    )
                }
                </tbody>
              </table>
            </div>
            <div className="col-lg-8 p-0">
              {
                this.props.match.params.id && this.props.match.params.id==='add' && <CompanyAdd />
              }
              {
                this.props.match.params.id && this.props.match.params.id!=='add' && this.state.companies.some((item)=>item.id===this.props.match.params.id) && <CompanyEdit match={this.props.match} history = {this.props.history} />
              }
            </div>
          </div>
        </div>
      </div>
);
}
}
