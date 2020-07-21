import React, { Component } from 'react';
import {Button } from 'reactstrap';
import {rebase} from '../../../index';
import StatusAdd from './statusAdd';
import StatusEdit from './statusEdit';

export default class StatusesList extends Component{
  constructor(props){
    super(props);
    this.state={
      statuses:[]
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/help-statuses', {
      context: this,
      withIds: true,
      then:content=>{this.setState({statuses:content.sort((item1,item2)=>{
        if(item1.order &&item2.order){
          return item1.order > item2.order? 1 :-1;
        }
        return -1;
      }), statusFilter:''})},
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
                    value={this.state.statusFilter}
                    onChange={(e)=>this.setState({statusFilter:e.target.value})}
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
                onClick={()=>this.props.history.push('/helpdesk/settings/statuses/add')}>
               <i className="fa fa-plus m-r-5 m-l-5 "/> Status
              </Button>

          </div>
        </div>

        <div className="row m-0 p-0 taskList-container">
          <div className="col-lg-4 p-0 scrollable fit-with-header-and-commandbar">
            <table className="table table-hover p-5">
              <thead>
                <tr>
                  <th>Status name</th>
                  <th>Order</th>
                </tr>
              </thead>
              <tbody>
                {this.state.statuses.filter((item)=>item.title.toLowerCase().includes(this.state.statusFilter.toLowerCase())).map((status)=>
                  <tr key={status.id}
                     className={"clickable" + (this.props.match.params.id === status.id ? " sidebar-item-active":"")}
                     onClick={()=>this.props.history.push('/helpdesk/settings/statuses/'+status.id)}>
                    <td className={(this.props.match.params.id === status.id ? "text-highlight":"")}>
                      {status.title}
                    </td>
                    <td className={(this.props.match.params.id === status.id ? "text-highlight":"")}>
                      {status.order?status.order:0}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="col-lg-8 p-0">
            {
              this.props.match.params.id && this.props.match.params.id==='add' && <StatusAdd />
            }
            {
              this.props.match.params.id && this.props.match.params.id!=='add' && this.state.statuses.some((item)=>item.id===this.props.match.params.id) && <StatusEdit match={this.props.match} history={this.props.history} />
            }
          </div>
        </div>
      </div>
    </div>
    );
  }
}
