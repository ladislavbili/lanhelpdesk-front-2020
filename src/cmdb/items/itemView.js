import React from 'react';
import {
  Label,
  Table,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';
import classnames from "classnames";

import {
  exampleItem as item
} from '../constants';

export default function ItemView( props ) {


  const deleteItem = () => {
    if ( window.confirm( 'Are you sure?' ) ) {
      /*    this.setState({saving:true,loading:true})

          this.props.setDeleting(false);
          this.props.history.goBack();*/
    }
  }

  return (
    <div className="card-box fit-with-header-and-commandbar scrollable">
            <div className="row m-b-10">
              <h2 className="center-hor cmdb-title">
                {item.title}
              </h2>
              <div className="ml-auto cmdb-info">
                <div> <span style={{color: "#7FFFD4"}}>*</span> Created by <span className="cmdb-info-name">Natalia Tyulina</span> at 22:00 16.6.2019 <span style={{color: "#7FFFD4"}}>*</span></div>
                <div><span style={{color: "#7FFFD4"}}>*</span> Edit by <span className="cmdb-info-name">Natalia Tyulina</span> at 22:00 16.6.2019 <span style={{color: "#7FFFD4"}}>*</span></div>
                <div><span style={{color: "#7FFFD4"}}>*</span> Status changed by <span className="cmdb-info-name">Natalia Tyulina</span> at 22:00 16.6.2019 <span style={{color: "#7FFFD4"}}>*</span></div>
              </div>
            </div>

            <hr />
            <div className="cmdb-selects">
              {item.attributes.map((attribute, index) =>
                {
                  if ( index % 2 === 0 ) {
                    return (
                      <div className="row">
                        <div key={attribute.label} className="entry">
                            <label className="">{attribute.label}</label>
                            <label className="value">{attribute.value}</label>
                        </div>
                        {
                          index < item.attributes.length - 1 &&
                          <div key={item.attributes[index + 1].label} className="entry">
                              <label className="">{item.attributes[index + 1].label}</label>
                              <label className="value">{item.attributes[index + 1].value}</label>
                          </div>
                        }
                      </div>
                    )
                  }
                }
              )
            }
            </div>

              <div className="">
                <Label className="">Description</Label>
                <div className="row">
                  <div className="flex" dangerouslySetInnerHTML={{__html: item.description.length === 0 ? "No description" : item.description.replace(/(?:\r\n|\r|\n)/g, '<br>') }}></div>
                  <div className="cmdb-yellow">
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean et est a dui semper facilisis. Pellentesque placerat elit a nunc. Nullam tortor odio, rutrum quis, egestas ut, posuere sed, felis. Vestibulum placerat feugiat nisl. Suspendisse lacinia, odio non feugiat vestibulum, sem erat blandit metus, ac nonummy magna odio pharetra felis.
                  </div>
                </div>
              </div>

              <div className="m-t-20 col-lg-12">
                <Table className="table">
                  <thead>
                    <tr>
                      <th>NIC</th>
                      <th>IP</th>
                      <th>Mask</th>
                      <th>Gateway</th>
                      <th>DNS 1</th>
                      <th>DNS 2</th>
                      <th>VLAN</th>
                      <th colSpan={2}>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    { item.ips.map((ip, index)=>
                      <tr key={ip.id}>
                        <td>{ip.NIC}</td>
                        <td>{ip.IP}</td>
                        <td>{ip.mask}</td>
                        <td>{ip.gateway}</td>
                        <td>{ip.DNS1}</td>
                        <td>{ip.DNS2}</td>
                        <td>{ip.VLAN}</td>
                        <td>{ip.note}</td>
                        <td width="30px">
                          <button type="button" className="btn-link" onClick={() => {}}>
                            <i
                              className="fas fa-times"
                              />
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              <div className="m-t-20 col-lg-12">
                <Table className="table">
                  <thead>
                    <tr>
                      <th>Passwords</th>
                      <th>Login</th>
                      <th>Password</th>
                      <th>IP/URL</th>
                      <th colSpan={2}>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    { item.passwords?.map((password,index)=>
                      <tr key={password.id}>
                        <td>{password.title}</td>
                        <td>{password.login}</td>
                        <td>{password.password}</td>
                        <td>{password.IP}</td>
                        <td>{password.note}</td>
                        <th key="action" width="30px">
                          <button type="button" className="btn-link" onClick={() => {}}>
                            <i
                              className="fas fa-times"
                              />
                          </button>
                        </th>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              <div className="m-t-20 col-lg-12">
                <Label>Backup tasks Description</Label>
                <div className="row">
                  <div className="flex">
                    {item.backupsDescription ? item.backupsDescription : "No backup tasks description"}
                  </div>
                  <div className="cmdb-yellow">
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean et est a dui semper facilisis. Pellentesque placerat elit a nunc. Nullam tortor odio, rutrum quis, egestas ut, posuere sed, felis. Vestibulum placerat feugiat nisl. Suspendisse lacinia, odio non feugiat vestibulum, sem erat blandit metus, ac nonummy magna odio pharetra felis.
                  </div>
                </div>
              </div>

              <div className="m-t-20 col-lg-12">
                <Label>Monitoring Description</Label>
                <div className="row">
                  <div className="flex">
                    {item.monitoringDescription ? item.monitoringDescription : "No monitoring description"}
                  </div>
                  <div className="cmdb-yellow">
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean et est a dui semper facilisis. Pellentesque placerat elit a nunc. Nullam tortor odio, rutrum quis, egestas ut, posuere sed, felis. Vestibulum placerat feugiat nisl. Suspendisse lacinia, odio non feugiat vestibulum, sem erat blandit metus, ac nonummy magna odio pharetra felis.
                  </div>
                </div>
              </div>

      </div>
  );
}