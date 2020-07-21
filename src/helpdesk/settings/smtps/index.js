import React, { Component } from 'react';
import {Button } from 'reactstrap';
import SMTPAdd from './smtpAdd';
import SMTPEdit from './smtpEdit';

import firebase from 'firebase';
import { connect } from "react-redux";
import {storageSmtpsStart} from 'redux/actions';
import {sameStringForms} from 'helperFunctions';
import { REST_URL } from 'configs/restAPI';

class SMTPsList extends Component{
  constructor(props){
    super(props);
    this.state={
      smtps:[],
      smtpFilter:'',
      smtpTesting: false,
    }
  }

  componentWillReceiveProps(props){
    if(!sameStringForms(props.smtps,this.props.smtps)){
      this.setState({smtps:props.smtps})
    }
  }

  componentWillMount(){
    if(!this.props.smtpsActive){
      this.props.storageSmtpsStart();
    }
    this.setState({smtps:this.props.smtps});
  }

  testSMTPs(){
    this.setState({ smtpTesting: true })
    firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((token)=>{
      fetch(`${REST_URL}/test-smtps`,{
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
          token
        }),
      })
    })
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
                    value={this.state.smtpFilter}
                    onChange={(e)=>this.setState({smtpFilter:e.target.value})}
                    placeholder="Search"
                    />
                </div>
              </div>
              <Button
                className="btn-link center-hor"
                onClick={()=>this.props.history.push('/helpdesk/settings/smtps/add')}>
                <i className="fa fa-plus p-l-5 p-r-5"/> SMTP
              </Button>
            </div>
            <div className="p-t-9 p-r-10 p-l-10 scroll-visible fit-with-header-and-commandbar">
              <div className="row">
                <h2 className=" p-l-10 p-b-10">
                  SMTPs
                </h2>
                { this.props.role === 3 && !this.state.smtpTesting &&
                  <Button
                    disabled={ this.props.role !== 3 || this.state.smtpTesting }
                    className="btn-primary center-hor ml-auto"
                    onClick={this.testSMTPs.bind(this)}
                    >
                    Test SMTPs
                  </Button>
                }
                { this.props.role === 3 && this.state.smtpTesting &&
                  <div className="center-hor ml-auto">
                    Testing SMTPs...
                  </div>
                }
              </div>
              <table className="table table-hover">
                <thead>
                  <tr className="clickable">
                    <th>Title</th>
                    <th>Host</th>
                    <th>Port</th>
                    <th>Username</th>
                    <th>Default</th>
                    <th></th>
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
                      className={"clickable" + (this.props.match.params.id === smtp.id ? " active":"")}
                      onClick={()=>this.props.history.push('/helpdesk/settings/smtps/'+smtp.id)}>
                      <td>
                        {smtp.title}
                      </td>
                      <td>
                        {smtp.host}
                      </td>
                      <td>
                        {smtp.port}
                      </td>
                      <td>
                        {smtp.user}
                      </td>
                      <td>
                        {smtp.def.toString()}
                      </td>
                      <td>
                        {
                          smtp.working === false ?
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
            <div className="commandbar"></div>
            {
              this.props.match.params.id && this.props.match.params.id==='add' && <SMTPAdd />
            }
            {
              this.props.match.params.id && this.props.match.params.id!=='add' && this.state.smtps.some((item)=>item.id===this.props.match.params.id) && <SMTPEdit match={this.props.match} history={this.props.history} />
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ storageSmtps, userReducer }) => {
  const { smtpsActive, smtps } = storageSmtps;
  const role = userReducer.userData ? userReducer.userData.role.value : 0;
  return { smtpsActive, smtps, role };
};

export default connect(mapStateToProps, { storageSmtpsStart })(SMTPsList);
