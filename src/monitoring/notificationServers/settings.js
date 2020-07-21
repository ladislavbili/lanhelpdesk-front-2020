import React, { Component } from 'react';
import { ModalBody, ModalFooter, ModalHeader, Button, FormGroup, Label, Input  } from 'reactstrap';
import {rebase} from "../../index";
import {isEmail} from "../../helperFunctions";

export default class ProjectEdit extends Component{
  constructor(props){
    super(props);
    this.state={

      smtpServer: "",
      smtpHost: "",
      smtpPort: "",
      smtpSecure: false,
      smtpUser: "",
      smtpPass: "",
      smtpTls: false,
      smtpRejectUnauthorized: false,

      imapServer: "",
      imapHost: "",
      imapPort: "",
      imapUser: "",
      imapPassword: "",
      imapTls: false,
      imapRejectUnauthorized: false,

      testMail: "I am a test mail.",

      saving: false,
      opened: false
    }
    this.submit.bind(this);
    this.sendTestMail.bind(this);
    this.testIMAPServer.bind(this);
    this.fetch.bind(this);
    this.fetch("notifications");
  }

  fetch(id){
    rebase.get(`monitoring-sidebar/${id}`,{
      context: this,
      withIds: true,
    }
    ).then((data) => {
      this.setState({
        testMail: data.testMail ? data.testMail : "",

        smtpServer: data.smtp.server ? data.smtp.server : "",
        smtpHost: data.smtp.host ? data.smtp.host : "",
        smtpPort: data.smtp.port ? data.smtp.port : "",
        smtpSecure: data.smtp.secure ? data.smtp.secure : false,
        smtpUser: data.smtp.user ? data.smtp.user : "",
        smtpPass: data.smtp.pass ? data.smtp.pass : "",
        smtpTls: data.smtp.tls ? data.smtp.tls : false,
        smtpRejectUnauthorized: data.smtp.rejectUnauthorized ? data.smtp.rejectUnauthorized : false,

        imapServer: data.imap.server ? data.imap.server : "",
        imapHost: data.imap.host ? data.imap.host : "",
        imapPort: data.imap.port ? data.imap.port : "",
        imapUser: data.imap.user ? data.imap.user : "",
        imapPassword: data.imap.password ? data.imap.password : "",
        imapTls: data.imap.tls ? data.imap.tls : false,
        imapRejectUnauthorized: data.imap.rejectUnauthorized ? data.imap.rejectUnauthorized : false,
      });
      }).catch(err => {
    });
  }


  submit(){
    this.setState({
      saving: true,
    })
    let smtp = {
      server: this.state.smtpServer,
      host: this.state.smtpHost,
      port: this.state.smtpPort,
      secure: this.state.smtpSecure,
      user: this.state.smtpUser,
      pass: this.state.smtpPass,
      tls: this.state.smtpTls,
      rejectUnauthorized: this.state.smtpRejectUnauthorized,
    };
    let imap = {
      server: this.state.imapServer,
      host: this.state.imapHost,
      port: this.state.imapPort,
      user: this.state.imapUser,
      password: this.state.imapPassword,
      tls: this.state.imapTls,
      rejectUnauthorized: this.state.imapRejectUnauthorized,
    };
    let data = {
      testMail: this.state.testMail,
      smtp,
      imap,
    };
    rebase.updateDoc('monitoring-sidebar/notifications', data)
      .then(() => {
        this.setState({
          saving: false,
        }, () => this.props.close())
      }).catch(err => {
    });
  }

  sendTestMail(){

  }

  testIMAPServer(){

  }

  render(){
    return (
      <div>
            <ModalHeader>
              Email notification settings
            </ModalHeader>
            <ModalBody>

              <h2>Send e-mail SMTP settings</h2>
                <FormGroup>
                  <Label>Server</Label>
                  <Input type="text" placeholder="Enter server" value={this.state.smtpServer} onChange={(e)=>this.setState({smtpServer: e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label>Host</Label>
                  <Input type="text" placeholder="Enter port" value={this.state.smtpHost} onChange={(e)=>this.setState({smtpHost: e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label>Port</Label>
                  <Input type="text" placeholder="Enter port" value={this.state.smtpPort} onChange={(e)=>this.setState({smtpPort: e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label>Login</Label>
                  <Input type="text" className={(this.state.smtpUser.length > 0 && !isEmail(this.state.smtpUser)) ? "form-control-warning" : ""} placeholder="Enter login" value={this.state.smtpUser} onChange={(e)=>this.setState({smtpUser: e.target.value})} />
                  { this.state.smtpUser.length > 0 &&
                    !isEmail(this.state.smtpUser) &&
                    <Label className="pull-right warning">This mail address is invalid.</Label>
                  }
                </FormGroup>
                <FormGroup>
                  <Label>Password</Label>
                  <Input type="password" placeholder="Enter password" value={this.state.smtpPass} onChange={(e)=>this.setState({smtpPass: e.target.value})}  />
                </FormGroup>
                <FormGroup className="row">
                  <div className="m-r-10">
                    <Label htmlFor="secure">Secure</Label>
                  </div>
                  <div className="m-l-15">
                    <Input id="secure" type="checkbox" checked={this.state.smtpSecure} value={this.state.smtpSecure} onChange={(e)=>this.setState({smtpSecure: !this.state.smtpSecure})} />
                  </div>
                  <div className="m-l-15" htmlFor="secure">{this.state.smtpSecure ? "YES" : "NO"}</div>
                </FormGroup>
                <FormGroup className="row">
                  <div className="m-r-10">
                    <Label >TLS/SSL</Label>
                  </div>
                  <div className="m-l-15">
                    <Input  type="checkbox" checked={this.state.smtpTls} value={this.state.smtpTls} onChange={(e)=>this.setState({smtpTls: !this.state.smtpTls})} />
                  </div>
                  <div className="m-l-15">{this.state.smtpTls ? "YES" : "NO"}</div>
                </FormGroup>
                <FormGroup className="row m-b-15">
                  <div className="m-r-10">
                    <Label >Reject unauthorized</Label>
                  </div>
                  <div className="m-l-15">
                    <Input  type="checkbox" checked={this.state.smtpRejectUnauthorized} value={this.state.smtpRejectUnauthorized} onChange={(e)=>this.setState({smtpRejectUnauthorized: !this.state.smtpRejectUnauthorized})} />
                  </div>
                  <div className="m-l-15">{this.state.smtpRejectUnauthorized ? "YES" : "NO"}</div>
                </FormGroup>

                <hr/>

              <FormGroup className="m-t-10 m-b-10">
                <Label>Send test e-mail</Label>
                <Input type="text" placeholder="Enter test mail body." value={this.state.testMail} onChange={(e)=>this.setState({testMail: e.target.value})} />
              </FormGroup>
              <div className="h-30">
                <Button className="pull-right btn-link" disabled={this.state.saving} onClick={() => this.sendTestMail()}>
                  Send
                </Button>
              </div>
              <hr className="m-t-10 m-b-10"/>

              <h2>Receive e-mail IMAP settings</h2>
                <FormGroup>
                  <Label>Server</Label>
                  <Input type="text" placeholder="Enter server" value={this.state.imapServer} onChange={(e)=>this.setState({imapServer: e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label>Host</Label>
                  <Input type="text" placeholder="Enter port" value={this.state.imapHost} onChange={(e)=>this.setState({imapHost: e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label>Port</Label>
                  <Input type="text" placeholder="Enter port" value={this.state.imapPort} onChange={(e)=>this.setState({imapPort: e.target.value})} />
                </FormGroup>
                <FormGroup>
                  <Label>Login</Label>
                  <Input type="text" className={(this.state.imapUser.length > 0 && !isEmail(this.state.imapUser)) ? "form-control-warning" : ""} placeholder="Enter login" value={this.state.imapUser} onChange={(e)=>this.setState({imapUser: e.target.value})} />
                  { this.state.imapUser.length > 0 &&
                    !isEmail(this.state.imapUser) &&
                    <Label className="pull-right warning">This mail address is invalid.</Label>
                  }
                </FormGroup>
                <FormGroup>
                  <Label>Password</Label>
                  <Input type="password" placeholder="Enter password" value={this.state.imapPassword} onChange={(e)=>this.setState({imapPassword: e.target.value})} />
                </FormGroup>
                <FormGroup className="row">
                  <div className="m-r-10">
                    <Label >TLS/SSL</Label>
                  </div>
                  <div className="m-l-15">
                    <Input  type="checkbox" checked={this.state.imapTls} value={this.state.imapTls} onChange={(e)=>this.setState({imapTls: !this.state.imapTls})} />
                  </div>
                  <div className="m-l-15">{this.state.imapTls ? "YES" : "NO"}</div>
                </FormGroup>
                <FormGroup className="row m-b-15">
                  <div className="m-r-10">
                    <Label >Reject unauthorized</Label>
                  </div>
                  <div className="m-l-15">
                    <Input  type="checkbox" checked={this.state.imapRejectUnauthorized} value={this.state.imapRejectUnauthorized} onChange={(e)=>this.setState({imapRejectUnauthorized: !this.state.imapRejectUnauthorized})} />
                  </div>
                  <div className="m-l-15">{this.state.imapRejectUnauthorized ? "YES" : "NO"}</div>
                </FormGroup>
                <div className="h-30">
                  <Button className="pull-right btn-link" disabled={this.state.saving} onClick={() => this.testIMAPServer()}>
                    Test IMAP Server
                  </Button>
                </div>
              </ModalBody>

              <ModalFooter>
              <Button
                className="mr-auto btn-link"
                onClick={() => this.props.close()}>
                Close
              </Button>

              <Button
                className="btn"
                disabled={this.state.saving
                  || !isEmail(this.state.imapUser)
                  || !isEmail(this.state.smtpUser)}
                onClick={() => this.submit()}>
                {this.state.saving?'Saving...':'Save changes'}</Button>
            </ModalFooter>

          </div>
    );
  }
}
