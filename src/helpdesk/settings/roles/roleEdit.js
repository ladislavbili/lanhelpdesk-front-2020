import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';

import { connect } from "react-redux";
import Checkbox from '../../../components/checkbox';
import { roles, acl, generalRights, specificRules } from 'configs/constants/roles';

class RoleEdit extends Component{
  constructor(props){
    super(props);
    const role = roles.find( (role) => role.id === this.props.match.params.id );
    this.disabled = true;
    if( role === undefined ){
      this.state = {
        title: 'Undefined role',
        ...acl
      }
    }else{
      this.state = {
        title: role.title,
        ...role.acl
      }
    }
  }

  componentWillReceiveProps(props){
    if( this.props.match.params.id !== props.match.params.id ){
      const role = roles.find( (role) => role.id === props.match.params.id );
      if( role === undefined ){
        this.setState({
          title: 'Undefined role',
          ...acl
        })
      } else{
        this.setState({
          title: role.title,
          ...role.acl
        })
      }
    }
  }

  componentWillMount(){
  }

  render(){
    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
          <FormGroup>
            <Label for="role">Role</Label>
              <Input
                name="name"
                id="name"
                type="text"
                disabled={this.disabled}
                placeholder="Enter role name"
                value={this.state.label}
                onChange={(e)=>{
                  this.setState({
                    label: e.target.value})
              }}
              />
          </FormGroup>

          <div className="">
            <h2>General rights</h2>
            <table className="table">
              <thead>
                <tr>
                    <th  width={"90%"} key={1}>
                      Name
                    </th>
                    <th className="t-a-c" key={2}>
                      Granted
                    </th>
                </tr>
              </thead>
              <tbody>
                { generalRights.map( (right) =>
                  <tr
                    className="clickable"
                    key={right.value}
                    onClick={() => {
                      if(this.disabled) return;
                      let change = {}
                        change[right.value] = !this.state[right.value]
                      this.setState(change)
                      }}
                      >
                      <td>{ right.name }</td>
                      <td>
                        <Checkbox
                          disabled={ this.disabled }
                          className = "m-b-5 p-l-0"
                          centerVer
                          centerHor
                          value = { this.state[right.value] }
                          label = ""
                          onChange={()=>{}}
                          highlighted={true}
                          />
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>

            <div className="">
              <h2>Specific rules</h2>
              <table className="table">
                <thead>
                  <tr>
                      <th width={"90%"} key={1}>
                        Access
                      </th>
                      <th className="t-a-c" key={2}>
                        View & Edit
                      </th>
                  </tr>
                </thead>
                <tbody>
                  { specificRules.map( (rule) =>
                    <tr
                      onClick={() => {
                        if(this.disabled) return;
                        let change = {}
                          change[rule.value] = !this.state[rule.value]
                        this.setState(change)
                        }}
                        >
                        <td>{rule.name}</td>
                        <td>
                          <Checkbox
                            className = "m-b-5 p-l-0"
                            centerVer
                            centerHor
                            disabled={this.disabled}
                            value = { this.state[rule.value] }
                            label = ""
                            onChange={()=>{}}
                            highlighted={true}
                            />
                        </td>
                      </tr>
                  )}
              </tbody>
            </table>
          </div>

          <Button className="btn" disabled={true} onClick={()=>{}}>{this.state.saving?'Savinging...':'Save'}</Button>

          {this.props.close &&
          <Button className="btn-link"
            onClick={()=>{this.props.close()}}>Cancel</Button>
          }
      </div>
    );
  }
}

export default connect()(RoleEdit);
