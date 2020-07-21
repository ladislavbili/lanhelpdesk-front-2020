import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import Checkbox from '../../../components/checkbox';
import Select from 'react-select';

import {selectStyle} from "configs/components/select";
import {toSelArr} from 'helperFunctions';
import {rebase } from 'index';
import { connect } from "react-redux";
import { storageImapsStart, storageHelpProjectsStart } from 'redux/actions';

const noProject = { id: null, title: 'No project', value: null, label: 'No project' }

class ImapAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      title:'',
      project: noProject,
      host: "",
      port: 993,
      user: '',
      password: '',
      tls: true,
      rejectUnauthorized: false,
      def:false,

      saving:false,
      showPass:false
    }
  }

  componentWillMount(){
    if(!this.props.imapsActive){
      this.props.storageImapsStart();
    }
    if(!this.props.projectsActive){
      this.props.storageHelpProjectsStart();
    }
  }

  canSave(){
    return this.state.title!=='' &&
    this.state.host!=='' &&
    this.state.port!=='' &&
    this.state.user!=='' &&
    this.props.imapsLoaded &&
    this.props.projectsLoaded
  }


  render(){
    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
        <Checkbox
          className = "m-b-5 p-l-0"
          value = { this.state.def }
          onChange={()=>{
            this.setState({def:!this.state.def})
          }}
          label = "Default"
          />

        <FormGroup>
          <Label for="name">Title</Label>
          <Input type="text" name="name" id="name" placeholder="Enter title" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
        </FormGroup>
        <FormGroup>
          <Label for="project">Default project</Label>
          <Select
            id="project"
            name="project"
            styles={selectStyle}
            options={toSelArr([noProject, ...this.props.projects])}
            value={this.state.project}
            onChange={ project => this.setState({ project }) }
            />
        </FormGroup>
        <FormGroup>
          <Label for="name">Host</Label>
          <Input type="text" name="name" id="host" placeholder="Enter host" value={this.state.host} onChange={(e)=>this.setState({host:e.target.value})} />
        </FormGroup>
        <FormGroup>
          <Label for="name">Port</Label>
          <Input type="number" name="name" id="port" placeholder="Enter port" value={this.state.port} onChange={(e)=>this.setState({port:e.target.value})} />
        </FormGroup>
        <FormGroup>
          <Label for="name">Username</Label>
          <Input type="text" name="name" id="user" placeholder="Enter user" value={this.state.user} onChange={(e)=>this.setState({user:e.target.value})} />
        </FormGroup>
        <FormGroup>
          <Label>Password</Label>
          <InputGroup>
            <Input type={this.state.showPass?'text':"password"} className="from-control" placeholder="Enter password" value={this.state.password} onChange={(e)=>this.setState({password:e.target.value})} />
            <InputGroupAddon addonType="append" className="clickable" onClick={()=>this.setState({showPass:!this.state.showPass})}>
              <InputGroupText>
                <i className={"mt-auto mb-auto "+ (!this.state.showPass ?'fa fa-eye':'fa fa-eye-slash')}/>
              </InputGroupText>
            </InputGroupAddon>
          </InputGroup>
        </FormGroup>

        <Checkbox
          className = "m-b-5 p-l-0"
          value = { this.state.tls }
          onChange={()=>{
            this.setState({tls:!this.state.tls})
          }}
          label = "TLS"
          />

        <Checkbox
          className = "m-b-5 p-l-0"
          value = { this.state.rejectUnauthorized }
          onChange={()=>{
            this.setState({rejectUnauthorized:!this.state.rejectUnauthorized})
          }}
          label = "Reject unauthorized"
          />

        <Button className="btn" disabled={this.state.saving|| !this.canSave()} onClick={()=>{
            this.setState({saving:true});
            rebase.addToCollection('/imaps', {
              title:this.state.title ,
              project: this.state.project !== null ? this.state.project.id : null,
              host:this.state.host ,
              port:this.state.port ,
              user:this.state.user ,
              password:this.state.password ,
              tls:this.state.tls ,
              rejectUnauthorized:this.state.rejectUnauthorized ,
              def:this.state.def,
            }).then((response)=>{
              if(this.state.def){
                this.props.imaps.filter((imap)=>imap.id!==response.id && imap.def).forEach((item)=>{
                  rebase.updateDoc('/imaps/'+item.id,{def:false})
                })
              }
              this.setState({
                title:'',
                host: "",
                port: 993,
                user: '',
                password: '',
                tls: true,
                rejectUnauthorized: false,
                def:false,
                saving:false,
                project: null,
              })
            });
          }}>{this.state.saving?'Adding...':'Add Imap'}</Button>
        </div>
      );
    }
  }

  const mapStateToProps = ({ storageImaps, storageHelpProjects }) => {
    const { imapsLoaded,imapsActive, imaps } = storageImaps;
    const { projectsLoaded, projectsActive, projects } = storageHelpProjects;
    return {
      imapsLoaded, imapsActive, imaps,
      projectsLoaded, projectsActive, projects,
    };
  };

  export default connect(mapStateToProps, { storageImapsStart, storageHelpProjectsStart })(ImapAdd);
