import React, { Component } from 'react';
import {Button } from 'reactstrap';
import {rebase} from '../../../index';
import WorkTypeAdd from './workTypeAdd';
import WorkTypeEdit from './workTypeEdit';

export default class WorkTypesList extends Component{
  constructor(props){
    super(props);
    this.state={
      workTypes:[]
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/help-work_types', {
      context: this,
      withIds: true,
      then:content=>{this.setState({workTypes:content, workTypeFilter:''})},
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
                    value={this.state.workTypeFilter}
                    onChange={(e)=>this.setState({workTypeFilter:e.target.value})}
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
                  onClick={()=>this.props.history.push('/helpdesk/settings/workTypes/add')}>
                 <i className="fa fa-plus m-r-5 m-l-5 "/> Work type
                </Button>

            </div>
          </div>

          <div className="row m-0 p-0 taskList-container">
            <div className="col-lg-4 p-0 scrollable fit-with-header-and-commandbar">
              <table className="table table-hover p-5">
                <thead>
                  <tr>
                    <th>Work type name</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.workTypes.filter((item)=>item.title.toLowerCase().includes(this.state.workTypeFilter.toLowerCase())).map((workType)=>
                    <tr
                      key={workType.id}
                      className={"clickable" + (this.props.match.params.id === workType.id ? " sidebar-item-active":"")}
                      onClick={()=>this.props.history.push('/helpdesk/settings/workTypes/'+workType.id)}>
                      <td className={(this.props.match.params.id === workType.id ? "text-highlight":"")}>
                        {workType.title}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="col-lg-8 p-0">
                {
                  this.props.match.params.id && this.props.match.params.id==='add' && <WorkTypeAdd />
                }
                {
                  this.props.match.params.id && this.props.match.params.id!=='add' && this.state.workTypes.some((item)=>item.id===this.props.match.params.id) && <WorkTypeEdit match={this.props.match} history={this.props.history} />
                }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
