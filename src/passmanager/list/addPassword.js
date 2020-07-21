import React, { Component } from 'react';
import {rebase} from '../../index';
import { Button,  FormGroup, Label, Input,  InputGroup, InputGroupAddon, InputGroupText, Alert } from 'reactstrap';
import {toSelArr} from '../../helperFunctions';
import Select from 'react-select';
import {selectStyle} from "configs/components/select";

export default class UnitAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      folders:[],
      saving:false,
      displayPasswordConfirm:false,
      displayPassword:false,
      passwordConfirm:'',
      folder:null,
      title:'',
      login:'',
      URL:'',
      password:'',
      expire:'',
      note:'',
    }
  }

  componentWillMount(){
    this.ref1 = rebase.listenToCollection('/pass-folders', {
      context: this,
      withIds: true,
      then:content=>{
        let folders=toSelArr(content);
        let folder = this.state.folder;
        if(folder===null){
          folder=folders.find((item)=>item.id===this.props.match.params.id);
          if(folder===undefined){
            if(folders.length!==0){
              folder=folders[0];
            }else{
              folder=null;
            }
          }
        }
        this.setState({folders,folder});
      },
    });
  }

  componentWillUnmount(){
    rebase.removeBinding(this.ref1);
  }

  render(){
    return (
      <div className="flex">
				<div className="commandbar p-2">
					<div className="d-flex flex-row align-items-center p-l-18">
          </div>
				</div>

        <div className="ml-auto mr-auto card-box fit-with-header p-t-15 w-50">
          <FormGroup>
            <Label>Password name</Label>
            <Input type="text" className="from-control" placeholder="Enter name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
          </FormGroup>
          <FormGroup>
            <Label>Folder</Label>
            <Select
              styles={selectStyle}
              options={this.state.folders}
              value={this.state.folder}
              onChange={e =>{ this.setState({ folder: e }); }}
                />
          </FormGroup>

          <FormGroup>
            <Label>URL</Label>
            <Input type="text" className="from-control" placeholder="Enter URL" value={this.state.URL} onChange={(e)=>this.setState({URL:e.target.value})} />
          </FormGroup>

          <FormGroup>
            <Label>Login</Label>
            <Input type="text" className="from-control" placeholder="Enter login" value={this.state.login} onChange={(e)=>this.setState({login:e.target.value})} />
          </FormGroup>

          <FormGroup>
            <Label>Password</Label>
            <InputGroup>
              <Input type={this.state.displayPassword?'text':"password"} className="from-control" placeholder="Enter password" value={this.state.password} onChange={(e)=>this.setState({password:e.target.value})} />
              <InputGroupAddon addonType="append" className="clickable" onClick={()=>this.setState({displayPassword:!this.state.displayPassword})}>
                <InputGroupText>
                  <i className={"mt-auto mb-auto "+ (!this.state.displayPassword ?'fa fa-eye':'fa fa-eye-slash')}/>
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <Label>Password confirm</Label>
            <InputGroup>
              <Input type={this.state.displayPasswordConfirm?'text':"password"} className="from-control" placeholder="Confirm password" value={this.state.passwordConfirm} onChange={(e)=>this.setState({passwordConfirm:e.target.value})} />
              <InputGroupAddon addonType="append" className="clickable" onClick={()=>this.setState({displayPasswordConfirm:!this.state.displayPasswordConfirm})}>
                <InputGroupText>
                  <i className={"mt-auto mb-auto "+ (!this.state.displayPasswordConfirm ?'fa fa-eye':'fa fa-eye-slash')}/>
                </InputGroupText>
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>

          {this.state.password.length>0 && this.state.password===this.state.passwordConfirm &&
            <Alert color="success">
              Passwords match!
            </Alert>
          }
          { this.state.password.length>0 && this.state.password!==this.state.passwordConfirm &&
            <Alert color="warning">
              Passwords don't match!
            </Alert>
          }

          <Button className="btn-link m-b-5" disabled={this.state.saving} onClick={()=>{
              let password=Math.random().toString(36).slice(-8);
              this.setState({password,passwordConfirm:password});
            }}>Generate password</Button>

          <FormGroup>
            <Label>Password expire</Label>
            <Input type="datetime-local" className="from-control" placeholder="Expiration date" value={this.state.expire} onChange={(e)=>this.setState({expire:e.target.value})} />
          </FormGroup>

          <FormGroup>
            <Label>Note</Label>
            <Input type="textarea" className="from-control" placeholder="Leave a note here" value={this.state.note} onChange={(e)=>this.setState({note:e.target.value})} />
          </FormGroup>

        <Button className="btn-link" onClick={this.props.history.goBack}>Cancel</Button>

        <Button className="btn" disabled={this.state.saving||this.state.password!==this.state.passwordConfirm||this.state.password===""||this.state.title===""||this.state.folder===null} onClick={()=>{
            this.setState({saving:true});
            let body = {
              title:this.state.title,
              login:this.state.login,
              URL:this.state.URL,
              password:this.state.password,
              expire:this.state.expire,
              note:this.state.note,
              folder:this.state.folder.id
            };
            rebase.addToCollection('/pass-passwords', body)
              .then((response)=>{
                this.setState({
                  folder:'',
                  title:'',
                  login:'',
                  URL:'',
                  password:'',
                  passwordConfirm:'',
                  expire:isNaN(new Date(this.state.expire).getTime()) ? null : (new Date(this.state.expire).getTime()),
                  note:'',
                  saving:false});
                  this.props.history.goBack();
              });
          }}>{this.state.saving?'Adding...':'Add password'}</Button>
      </div>
    </div>
    );
  }
}
