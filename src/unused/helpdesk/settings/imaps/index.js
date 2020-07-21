import React, { Component } from 'react';
import {rebase} from '../../../index';
import {Button } from 'reactstrap';
import ImapAdd from './imapAdd';
import ImapEdit from './imapEdit';

export default class ImapsList extends Component{
  constructor(props){
    super(props);
    this.state={
      imaps:[]
    }
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/imaps', {
      context: this,
      withIds: true,
      then:content=>{this.setState({imaps:content, imapFilter:''})},
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
                    value={this.state.imapFilter}
                    onChange={(e)=>this.setState({imapFilter:e.target.value})}
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
          				onClick={()=>this.props.history.push('/helpdesk/settings/imaps/add')}>
          			 <i className="fa fa-plus m-r-5 m-l-5 "/> Imap
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
                  {this.state.imaps.filter((item)=>
                    item.title.toLowerCase().includes(this.state.imapFilter.toLowerCase())||
                    item.host.toLowerCase().includes(this.state.imapFilter.toLowerCase())||
                    item.port.toString().toLowerCase().includes(this.state.imapFilter.toLowerCase())||
                    item.user.toLowerCase().includes(this.state.imapFilter.toLowerCase())
                  ).map((imap)=>
                    <tr
                      key={imap.id}
                      className={"clickable" + (this.props.match.params.id === imap.id ? " sidebar-item-active":"")}
                      onClick={()=>this.props.history.push('/helpdesk/settings/imaps/'+imap.id)}>
                      <td className={(this.props.match.params.id === imap.id ? "text-highlight":"")}>
                        {imap.title}
                      </td>
                      <td className={(this.props.match.params.id === imap.id ? "text-highlight":"")}>
                        {imap.host}
                      </td>
                      <td className={(this.props.match.params.id === imap.id ? "text-highlight":"")}>
                        {imap.port}
                      </td>
                      <td className={(this.props.match.params.id === imap.id ? "text-highlight":"")}>
                        {imap.user}
                      </td>
                      <td className={(this.props.match.params.id === imap.id ? "text-highlight":"")}>
                        {imap.def.toString()}
                      </td>
                    </tr>
                    )}
                </tbody>
              </table>
            </div>
            <div className="col-lg-8 p-0">
            {
              this.props.match.params.id && this.props.match.params.id==='add' && <ImapAdd />
            }
            {
              this.props.match.params.id && this.props.match.params.id!=='add' && this.state.imaps.some((item)=>item.id===this.props.match.params.id) && <ImapEdit match={this.props.match} history={this.props.history} />
            }
          </div>
        </div>
      </div>
    </div>
    );
  }
}
