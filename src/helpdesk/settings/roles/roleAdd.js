import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';

import { connect } from "react-redux";
import Checkbox from '../../../components/checkbox';

class RoleAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      label: "",

      //general rules
      login: false,
      testSections: false,
      mailViaComment: false,
      vykazy: false,
      publicFilters: false,
      addProjects: false,
      viewVykaz: false,
      viewRozpocet: false,

      //settings access
      users: false,
      companies: false,
      pausals: false,
      projects: false,
      statuses: false,
      units: false,
      prices: false,
      suppliers: false,
      tags: false,
      invoices: false,
      roles: false,
      types: false,
      tripTypes: false,
      imaps: false,
      smtps: false,

    }
  }

  componentWillReceiveProps(props){
  }

  componentWillMount(){
  }

  render(){
  //  console.log(this.state.roles);
    return (
      <div className="p-20 scroll-visible fit-with-header-and-commandbar">
          <FormGroup>
            <Label for="role">Role</Label>
              <Input
                name="name"
                id="name"
                type="text"
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
                <tr
                  onClick={() =>
                    this.setState({
                      login: !this.state.login})
                    }
                  >
                  <td>Login to system</td>
                  <td>
                    <Checkbox
                      className = "m-b-5 p-l-0"
                      centerVer
                      centerHor
                      value = { this.state.login }
                      label = ""
                      onChange={()=>{}}
                      highlighted={true}
                      />
                  </td>
                </tr>

                <tr
                  onClick={() =>
                    this.setState({
                     testSections: !this.state.testSections})
                  }
                  >
                  <td>Test sections - Navoody, CMDB, Hesla, Naklady, Projekty, Monitoring</td>
                  <td>
                    <Checkbox
                      className = "m-b-5 p-l-0"
                      centerVer
                      centerHor
                      value = { this.state.testSections }
                      label = ""
                      onChange={()=>{}}
                      highlighted={true}
                      />
                  </td>
                </tr>

                <tr
                  onClick={() =>
                    this.setState({
                      mailViaComment: !this.state.mailViaComment})
                    }
                  >
                  <td>Send mails via comments</td>
                  <td>
                    <Checkbox
                      className = "m-b-5 p-l-0"
                      centerVer
                      centerHor
                      value = { this.state.mailViaComment }
                      label = ""
                      onChange={()=>{}}
                      highlighted={true}
                      />
                  </td>
                </tr>

                <tr
                  onClick={() =>
                    this.setState({
                      vykazy: !this.state.vykazy})
                    }
                  >
                    <td>Výkazy</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        centerVer
                        centerHor
                        value = { this.state.vykazy }
                        label = ""
                        onChange={()=>{}}
                        highlighted={true}
                        />
                    </td>
                  </tr>

                  <tr
                    onClick={() =>
                      this.setState({
                        publicFilters: !this.state.publicFilters})
                      }
                    >
                    <td>Public Filters</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        centerVer
                        centerHor
                        value = { this.state.publicFilters }
                        label = ""
                        onChange={()=>{}}
                        highlighted={true}
                        />
                    </td>
                  </tr>

                  <tr
                    onClick={() =>
                      this.setState({
                        addProjects: !this.state.addProjects})
                      }
                    >
                    <td>Add projects</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        centerVer
                        centerHor
                        value = { this.state.addProjects }
                        label = ""
                        onChange={()=>{}}
                        highlighted={true}
                        />
                    </td>
                  </tr>

                  <tr
                    onClick={() =>
                      this.setState({
                        viewVykaz: !this.state.viewVykaz})
                    }
                    >
                    <td>View vykaz</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        centerVer
                        centerHor
                        value = { this.state.viewVykaz }
                        label = ""
                        onChange={()=>{}}
                        highlighted={true}
                        />
                    </td>
                  </tr>

                  <tr
                    onClick={() =>
                      this.setState({
                        viewRozpocet: !this.state.viewRozpocet})
                      }
                    >
                    <td>View rozpocet</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        centerVer
                        centerHor
                        value = { this.state.viewRozpocet }
                        label = ""
                        onChange={() => {}}
                        highlighted={true}
                        />
                    </td>
                  </tr>

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
                  <tr
                    onClick={() =>
                      this.setState({
                        users: !this.state.users})
                      }
                    >
                    <td>Users</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        centerVer
                        centerHor
                        value = { this.state.users }
                        label = ""
                        onChange={()=>{}}
                        highlighted={true}
                        />
                    </td>
                  </tr>

                  <tr
                    onClick={() =>
                      this.setState({
                        companies: !this.state.companies})
                      }
                    >
                    <td>Companies</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        centerVer
                        centerHor
                        value = { this.state.companies }
                        label = ""
                        onChange={()=>{}}
                        highlighted={true}
                        />
                    </td>
                  </tr>

                  <tr
                    onClick={() =>
                      this.setState({
                        pausals: !this.state.pausals})
                      }
                    >
                    <td>Service level agreements</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        centerVer
                        centerHor
                        value = { this.state.pausals }
                        label = ""
                        onChange={()=>{}}
                        highlighted={true}
                        />
                    </td>
                  </tr>

                  <tr
                    onClick={() =>
                      this.setState({
                        projects: !this.state.projects})
                      }
                    >
                    <td>Projects</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        centerVer
                        centerHor
                        value = { this.state.projects }
                        label = ""
                        onChange={()=>{}}
                        highlighted={true}
                        />
                    </td>
                  </tr>

                  <tr
                    onClick={() =>
                      this.setState({
                        statuses: !this.state.statuses})
                      }
                    >
                    <td>Statuses</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        centerVer
                        centerHor
                        value = { this.state.statuses }
                        label = ""
                        onChange={()=>{}}
                        highlighted={true}
                        />
                    </td>
                  </tr>

                  <tr
                    onClick={() =>
                      this.setState({
                        units: !this.state.units})
                      }
                    >
                    <td>Units</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        centerVer
                        centerHor
                        value = { this.state.units }
                        label = ""
                        onChange={()=>{}}
                        highlighted={true}
                        />
                    </td>
                  </tr>

                  <tr
                    onClick={() =>
                      this.setState({
                        prices: !this.state.prices})
                      }
                    >
                    <td>Prices</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        centerVer
                        centerHor
                        value = { this.state.prices }
                        label = ""
                        onChange={()=>{}}
                        highlighted={true}
                        />
                    </td>
                  </tr>

                  <tr
                    onClick={() =>
                      this.setState({
                        suppliers: !this.state.suppliers})
                      }
                    >
                    <td>Suppliers</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        centerVer
                        centerHor
                        value = { this.state.suppliers }
                        label = ""
                        onChange={()=>{}}
                        highlighted={true}
                        />
                    </td>
                  </tr>

                  <tr
                    onClick={() =>
                      this.setState({
                        tags: !this.state.tags})
                      }
                    >
                    <td>Tags</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        centerVer
                        centerHor
                        value = { this.state.tags }
                        label = ""
                        onChange={()=>{}}
                        highlighted={true}
                        />
                    </td>
                  </tr>

                  <tr
                    onClick={() =>
                      this.setState({
                        invoices: !this.state.invoices})
                      }
                    >
                    <td>Invoices</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        centerVer
                        centerHor
                        value = { this.state.invoices }
                        label = ""
                        onChange={()=>{}}
                        highlighted={true}
                        />
                    </td>
                  </tr>

                  <tr
                    onClick={() =>
                      this.setState({
                        roles: !this.state.roles})
                      }
                    >
                    <td>Roles</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        centerVer
                        centerHor
                        value = { this.state.roles }
                        label = ""
                        onChange={()=>{}}
                        highlighted={true}
                        />
                    </td>
                  </tr>

                  <tr
                    onClick={() =>
                      this.setState({
                        types: !this.state.types})
                      }
                    >
                    <td>Types</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        centerVer
                        centerHor
                        value = { this.state.types }
                        label = ""
                        onChange={()=>{}}
                        highlighted={true}
                        />
                    </td>
                  </tr>

                  <tr
                    onClick={() =>
                      this.setState({
                        tripTypes: !this.state.tripTypes})
                      }
                    >
                    <td>Trip types</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        centerVer
                        centerHor
                        value = { this.state.tripTypes }
                        label = ""
                        onChange={()=>{}}
                        highlighted={true}
                        />
                    </td>
                  </tr>

                  <tr
                    onClick={() =>
                      this.setState({
                        imaps: !this.state.imaps})
                      }
                    >
                    <td>Imaps</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        centerVer
                        centerHor
                        value = { this.state.imaps }
                        label = ""
                        onChange={()=>{}}
                        highlighted={true}
                        />
                    </td>
                  </tr>

                  <tr
                    onClick={() =>
                      this.setState({
                        smtps: !this.state.smtps})
                      }
                    >
                    <td>SMTPs</td>
                    <td>
                      <Checkbox
                        className = "m-b-5 p-l-0"
                        centerVer
                        centerHor
                        value = { this.state.smtps }
                        label = ""
                        onChange={()=>{}}
                        highlighted={true}
                        />
                    </td>
                  </tr>
              </tbody>
            </table>
          </div>

          <Button className="btn" disabled={true} onClick={()=>{}}>{this.state.saving?'Adding...':'Add role'}</Button>

          {this.props.close &&
          <Button className="btn-link"
            onClick={()=>{this.props.close()}}>Cancel</Button>
          }
      </div>
    );
  }
}


export default connect()(RoleAdd);
