import React, { Component } from 'react';
import { Button, FormGroup, Label,Input, Alert, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';
import Select from 'react-select';

import {selectStyle} from "configs/components/select";
import Checkbox from 'components/checkbox';
import { toSelArr } from 'helperFunctions';
import { rebase } from 'index';
import { connect } from "react-redux";
import { storageImapsStart, storageHelpProjectsStart } from 'redux/actions';

const noProject = { id: null, title: 'No project', value: null, label: 'No project' }

class ImapEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      loading:true,
      saving:false,
      imaps:[],
      isDefault:false,
      showPass:false,

      title:'',
      project: noProject,
      host: "",
      port: 993,
      user: '',
      password: '',
      tls: true,
      rejectUnauthorized: false,
      def:false,
    }
    this.setData.bind(this);
  }

  canSave(){
    return this.state.title!=='' &&
      this.state.host!=='' &&
      this.state.port!=='' &&
      this.state.user!=='' &&
      this.props.imapsLoaded &&
      this.props.projectsLoaded
  }

  setData(props){
    if(!props.imapsLoaded || !props.projectsLoaded) return;
    const imaps = props.imaps;
    const id = props.match.params.id;
    const imap = imaps.find((item)=>item.id===id);
    let project = null;
    if( imap.project !== undefined ){
      project = toSelArr([noProject, ...this.props.projects]).find((project) => project.id === imap.project)
    }
    if( !project ){
      project = noProject;
    }
    this.setState({
      loading:false,
      imaps,
      isDefault:imap.def,
      showPass:false,

      title: imap.title,
      project,
      host: imap.host,
      port: imap.port,
      user: imap.user,
      password: imap.password,
      tls: imap.tls,
      rejectUnauthorized: imap.rejectUnauthorized,
      def:imap.def,
      })
  }

  componentWillMount(){
    if(!this.props.imapsActive){
      this.props.storageImapsStart();
    }
    if(!this.props.projectsActive){
      this.props.storageHelpProjectsStart();
    }
    this.setData(this.props);
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.id!==props.match.params.id){
      this.setState({loading:true})
      if(props.imapsLoaded){
        this.setData(props);
      }
    }
    if( (props.imapsLoaded && !this.props.imapsLoaded) || (props.projectsLoaded && !this.props.projectsLoaded) ){
      this.setData(props);
    }
  }

  render(){
    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
        {
          this.state.loading &&
          <Alert color="success">
            Loading data...
          </Alert>
        }

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

        <div className="row">
            <Button className="btn" disabled={this.state.saving || !this.canSave()} onClick={()=>{
              this.setState({saving:true});
              rebase.updateDoc('/imaps/'+this.props.match.params.id, {
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
                if(this.state.def && !this.state.isDefault){
                  this.state.imaps.filter((imap)=>imap.id!==this.props.match.params.id && imap.def).forEach((item)=>{
                    rebase.updateDoc('/imaps/'+item.id,{def:false})
                  })
                }
                this.setState({saving:false});
              });
            }}>{this.state.saving?'Saving Imap...':'Save Imap'}</Button>

          <Button className="btn-red m-l-5" disabled={this.state.saving} onClick={()=>{
                  if(window.confirm("Are you sure?")){
                    rebase.removeDoc('/imaps/'+this.props.match.params.id).then(()=>{
                      this.props.history.goBack();
                    });
                  }
              }}>Delete</Button>
          </div>
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

export default connect(mapStateToProps, { storageImapsStart, storageHelpProjectsStart })(ImapEdit);
