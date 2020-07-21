import React, { Component } from 'react';
import {Button } from 'reactstrap';
import WorkTypeAdd from './workTypeAdd';
import WorkTypeEdit from './workTypeEdit';

import { connect } from "react-redux";
import {storageHelpWorkTypesStart} from '../../../redux/actions';
import {sameStringForms} from '../../../helperFunctions';

class WorkTypesList extends Component{
  constructor(props){
    super(props);
    this.state={
      workTypes:[],
      workTypeFilter:''
    }
  }

  componentWillReceiveProps(props){
    if(!sameStringForms(props.workTypes,this.props.workTypes)){
      this.setState({workTypes:props.workTypes})
    }
  }

  componentWillMount(){
    if(!this.props.workTypesActive){
      this.props.storageHelpWorkTypesStart();
    }
    this.setState({workTypes:this.props.workTypes});
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
                    className="form-control search"
                    value={this.state.workTypeFilter}
                    onChange={(e)=>this.setState({workTypeFilter:e.target.value})}
                    placeholder="Search"
                    />
                </div>
              </div>
              <Button
                className="btn-link t-a-l"
                onClick={()=>this.props.history.push('/helpdesk/settings/workTypes/add')}>
                <i className="fa fa-plus m-r-5 m-l-5 "/> Work type
              </Button>
            </div>
            <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <h2 className=" p-l-10 p-b-10 ">
  							Work type name
  						</h2>
              <table className="table table-hover">
                <tbody>
                  {this.state.workTypes.filter((item)=>item.title.toLowerCase().includes(this.state.workTypeFilter.toLowerCase())).map((workType)=>
                    <tr
                      key={workType.id}
                      className={"clickable" + (this.props.match.params.id === workType.id ? " active":"")}
                      onClick={()=>this.props.history.push('/helpdesk/settings/workTypes/'+workType.id)}>
                      <td>
                        {workType.title}
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
                this.props.match.params.id && this.props.match.params.id==='add' && <WorkTypeAdd />
              }
              {
                this.props.match.params.id && this.props.match.params.id!=='add' && this.state.workTypes.some((item)=>item.id===this.props.match.params.id) && <WorkTypeEdit match={this.props.match} history={this.props.history} />
              }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageHelpWorkTypes}) => {
  const { workTypesActive, workTypes } = storageHelpWorkTypes;
  return { workTypesActive, workTypes };
};

export default connect(mapStateToProps, { storageHelpWorkTypesStart })(WorkTypesList);
