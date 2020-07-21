import React, { Component } from 'react';
import {Button } from 'reactstrap';
import ImapAdd from './imapAdd';
import ImapEdit from './imapEdit';
import { connect } from "react-redux";
import {storageImapsStart} from '../../../redux/actions';
import {sameStringForms} from '../../../helperFunctions';

class ImapsList extends Component{
  constructor(props){
    super(props);
    this.state={
      imaps:[],
      imapFilter:''
    }
  }
  componentWillReceiveProps(props){
    if(!sameStringForms(props.imaps,this.props.imaps)){
      this.setState({imaps:props.imaps})
    }
  }

  componentWillMount(){
    if(!this.props.imapsActive){
      this.props.storageImapsStart();
    }
    this.setState({imaps:this.props.imaps});
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
                      value={this.state.imapFilter}
                      onChange={(e)=>this.setState({imapFilter:e.target.value})}
                      placeholder="Search"
                      />
                  </div>
                </div>
                <Button
                  className="btn-link center-hor"
                  onClick={()=>this.props.history.push('/helpdesk/settings/imaps/add')}>
                  <i className="fa fa-plus p-l-5 p-r-5"/> IMAP
                </Button>
              </div>
              <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
                <h2 className=" p-l-10 p-b-10 ">
    							IMAPs
    						</h2>
                <table className="table table-hover">
                  <thead>
                    <tr className="clickable">
                      <th>Title</th>
                      <th>Host</th>
                      <th>Port</th>
                      <th>Username</th>
                      <th></th>
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
                        className={"clickable" + (this.props.match.params.id === imap.id ? " active":"")}
                        onClick={()=>this.props.history.push('/helpdesk/settings/imaps/'+imap.id)}>
                        <td>
                          {imap.title}
                        </td>
                        <td>
                          {imap.host}
                        </td>
                        <td>
                          {imap.port}
                        </td>
                        <td>
                          {imap.user}
                        </td>
                        <td>
                          {
                            imap.working === false ?
                            <i style={{color:'red'}}
                              className="far fa-times-circle"
                              />
                            :
                            <i style={{color:'green'}}
                              className="far fa-check-circle"
                              />
                          }
                        </td>
                      </tr>
                      )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="col-lg-8">
              <div className="commandbar">
              </div>
            {
              this.props.match.params.id && this.props.match.params.id==='add' && <ImapAdd />
            }
            {
              this.props.match.params.id && this.props.match.params.id!=='add' && this.state.imaps.some((item)=>item.id===this.props.match.params.id) && <ImapEdit match={this.props.match} history={this.props.history} />
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageImaps }) => {
  const { imapsActive, imaps } = storageImaps;
  return { imapsActive, imaps };
};

export default connect(mapStateToProps, { storageImapsStart })(ImapsList);
