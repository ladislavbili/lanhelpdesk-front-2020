import React, { Component } from 'react';
import {Button } from 'reactstrap';
import PublicFilterAdd from './publicFilterAdd';
import PublicFilterEdit from './publicFilterEdit';

import { storageHelpFiltersStart } from 'redux/actions';
import { filterIncludesText } from 'helperFunctions';
import { connect } from "react-redux";
import { roles } from 'configs/constants/roles';

class PublicFiltersList extends Component{
  constructor(props){
    super(props);
    this.state={
      search: "",
      roleFilter: 'all'
    }
  }

  componentWillMount(){
		if(!this.props.filtersActive){
			this.props.storageHelpFiltersStart();
		}
	}

  getFilteredFilters(){
    const roleFilter = this.state.roleFilter;
    return this.props.filters.filter((filter) => (
      filter.public &&
      filterIncludesText( filter.title, this.state.search ) && (
        roleFilter === 'all' ||
        ( roleFilter === 'none' && (filter.roles === undefined || filter.roles.length === 0 ) ) ||
        ( filter.roles !== undefined && filter.roles.includes( roleFilter ) )
      )
    )).sort((item1,item2)=> item1.order - item2.order);
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
                    value={this.state.search}
                    onChange={(e)=>this.setState({search:e.target.value})}
                    placeholder="Search"
                    />
                </div>
              </div>
              <Button
                className="btn-link center-hor"
                onClick={()=> this.props.history.push('/helpdesk/settings/publicFilters/add')}>
                <i className="fa fa-plus p-l-5 p-r-5"/> Public Filter
              </Button>
            </div>
            <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <div className="row p-l-10 p-b-10">
                <h2 className="">
    							Public Filters
    						</h2>
                <div className="d-flex flex-row align-items-center ml-auto">
                  <div className="text-basic m-r-5 m-l-5">
      							Sort by
      						</div>
                  <select
    								value={this.state.roleFilter}
    								className="invisible-select text-bold text-highlight"
    								onChange={(e)=> this.setState({ roleFilter: e.target.value})}>
    									<option value='all'>All filters</option>
                      { roles.map((role) =>
                        <option value={role.id} key={role.id}>{role.title}</option>
                      )}
                      <option value='none'>Without role</option>
    							</select>
                </div>
              </div>
              <table className="table table-hover">
                <tbody>
                  {this.getFilteredFilters().map((filter)=>
                    <tr
                      key={filter.id}
                      className={"clickable" + (this.props.match.params.id === filter.id ? " active":"")}
                      style={{whiteSpace: "nowrap",  overflow: "hidden"}}
                      onClick={()=>this.props.history.push('/helpdesk/settings/publicFilters/'+filter.id.toString())}>
                      <td
                        style={{maxWidth: "300px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }}  >
                        {filter.title}
                      </td>
                      <td
                        style={{maxWidth: "300px", whiteSpace: "nowrap",  overflow: "hidden", textOverflow: "ellipsis"  }}  >
                        {filter.order}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="commandbar"></div>
            {
              this.props.match.params.id && this.props.match.params.id==='add' && <PublicFilterAdd />
            }
            {
              this.props.match.params.id &&
              this.props.match.params.id!=='add' &&
              this.getFilteredFilters().some((item)=>item.id.toString()===this.props.match.params.id) &&
              <PublicFilterEdit match={this.props.match} history={this.props.history}/>
              }
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = ({ storageHelpFilters }) => {
  const { filtersActive, filters, filtersLoaded } = storageHelpFilters;
  return {
    filtersActive, filters, filtersLoaded,
  };
};

export default connect(mapStateToProps, { storageHelpFiltersStart })(PublicFiltersList);
