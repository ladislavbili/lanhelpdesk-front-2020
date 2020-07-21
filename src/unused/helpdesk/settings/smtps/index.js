import React, { Component } from 'react';
import {rebase} from '../../../index';
import {Button } from 'reactstrap';
import SMTPAdd from './smtpAdd';
import SMTPEdit from './smtpEdit';

export default class SMTPsList extends Component{
  constructor(props){
    super(props);
    this.state={
      smtps:[]
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/smtps', {
      context: this,
      withIds: true,
      then:content=>{this.setState({smtps:content, smtpFilter:''})},
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
                    value={this.state.smtpFilter}
                    onChange={(e)=>this.setState({smtpFilter:e.target.value})}
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
          				onClick={()=>this.props.history.push('/helpdesk/settings/smtps/add')}>
          			 <i className="fa fa-plus m-r-5 m-l-5 "/> SMTP
          			</Button>

            </div>
          </div>

          <div className="row m-0 p-0 taskList-container">
            <div className="col-lg-4 p-0 scrollable fit-with-header-and-commandbar">
              <table className="table table-hover p-5">
                <thead>
                  <tr className="clickable">
                    <th>Title</th>
                    <th>Host</th>
                    <th>Port</th>
                    <th>Username</th>
                    <th>Default</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.smtps.filter((item)=>
                    item.title.toLowerCase().includes(this.state.smtpFilter.toLowerCase())||
                    item.host.toLowerCase().includes(this.state.smtpFilter.toLowerCase())||
                    item.port.toString().toLowerCase().includes(this.state.smtpFilter.toLowerCase())||
                    item.user.toLowerCase().includes(this.state.smtpFilter.toLowerCase())
                  ).map((smtp)=>
                    <tr
                      key={smtp.id}
                      className={"clickable" + (this.props.match.params.id === smtp.id ? " sidebar-item-active":"")}
                      onClick={()=>this.props.history.push('/helpdesk/settings/smtps/'+smtp.id)}>
                      <td className={(this.props.match.params.id === smtp.id ? "text-highlight":"")}>
                        {smtp.title}
                      </td>
                      <td className={(this.props.match.params.id === smtp.id ? "text-highlight":"")}>
                        {smtp.host}
                      </td>
                      <td className={(this.props.match.params.id === smtp.id ? "text-highlight":"")}>
                        {smtp.port}
                      </td>
                      <td className={(this.props.match.params.id === smtp.id ? "text-highlight":"")}>
                        {smtp.user}
                      </td>
                      <td className={(this.props.match.params.id === smtp.id ? "text-highlight":"")}>
                        {smtp.def.toString()}
                      </td>
                    </tr>
                    )}
                </tbody>
              </table>
            </div>
            <div className="col-lg-8 p-0">
            {
              this.props.match.params.id && this.props.match.params.id==='add' && <SMTPAdd />
            }
            {
              this.props.match.params.id && this.props.match.params.id!=='add' && this.state.smtps.some((item)=>item.id===this.props.match.params.id) && <SMTPEdit match={this.props.match} history={this.props.history} />
            }
          </div>
        </div>
      </div>
    </div>
    );
  }
}
