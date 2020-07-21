import React, { Component } from 'react';
import {rebase,database} from '../../index';
import { Label, Table, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import {snapshotToArray, getAttributeDefaultValue, htmlFixNewLines} from '../../helperFunctions';
import classnames from "classnames";

export default class ItemView extends Component{
  constructor(props){
    super(props);
    this.state={
      loading:true,
      tab:'0',
      item:null,
      statuses:[],
      companies:[],
      sidebarItem:null,
      IPs:[],
      passwords:[],
      backups:[],
      backupsDescription: {},
      items:[],
      links:[],
      toggleTab: "1",
    }
    this.setData.bind(this);
    this.getData.bind(this);
    this.delete.bind(this);
    this.getData();
  }

  componentWillReceiveProps(props){
    if(props.delete){
      this.delete();
    }
  }

  getData(){
    Promise.all([
      database.collection('cmdb-items').get(),
      database.collection('cmdb-statuses').get(),
      database.collection('companies').get(),
      database.collection('cmdb-sidebar').where('url','==',this.props.match.params.sidebarID).get(),
      database.collection('cmdb-IPs').where('itemID','==',this.props.match.params.itemID).get(),
      database.collection('cmdb-passwords').where('itemID','==',this.props.match.params.itemID).get(),
      database.collection('cmdb-backups').where('itemID','==',this.props.match.params.itemID).get(),
      database.collection('cmdb-links').where('link','==',this.props.match.params.itemID).get(),
      database.collection('cmdb-links').where('itemID','==',this.props.match.params.itemID).get(),
    ])
    .then(([items,statuses,companies,sidebarItem,IPs,passwords,backups,links1,links2])=>{
      this.setData(
        snapshotToArray(items).find((item)=>item.id===this.props.match.params.itemID),
        snapshotToArray(statuses),
        snapshotToArray(companies),
        snapshotToArray(sidebarItem)[0],
        snapshotToArray(IPs),
        snapshotToArray(passwords),
        snapshotToArray(backups),
        snapshotToArray(items),
        [...(snapshotToArray(links1).map((item)=>{return{...item,itemID:item.link,link:item.itemID}})),...(snapshotToArray(links2).map((item)=>{return{...item}}))]
      );
    });
  }

  setData(item,statuses,companies,sidebarItem, IPs,passwords, backups,items,links){
    let attributes={};
    sidebarItem.attributes.forEach((item)=>attributes[item.id]=getAttributeDefaultValue(item));
    attributes={...attributes,...item.attributes};
    this.setState({
      item,
      statuses,
      companies,
      sidebarItem,
      IPs,
      passwords,
      backups,
      backupsDescription: item.backupsDescription,
      attributes,
      items,
      links: links.map((item)=>{
        return {
          ...item,
          link:items.find((item2)=>item2.id===item.link)
        }
      })
    });
  }

  delete(){
    if(window.confirm('Are you sure?')){
      this.setState({saving:true,loading:true})
      this.state.IPs.map((item)=>rebase.removeDoc('/cmdb-IPs/'+item));
      this.state.backups.map((item)=>rebase.removeDoc('/cmdb-backups/'+item));
      rebase.removeDoc('/cmdb-items/'+this.props.match.params.itemID);
      this.props.setDeleting(false);
      this.props.history.goBack();
    }
    this.props.setDeleting(false);
  }

  render(){
    let company = this.state.companies.find((item)=>item.id===this.state.item.company);
    let companyTitle = "";
    if (company){
      companyTitle = company.title;
    }

    return (
        <div className="card-box fit-with-header-and-commandbar scrollable">
            <div className="row m-b-10">
              <h2 className="center-hor cmdb-title">
                {this.state.item===null?'':this.state.item.title}
              </h2>
              <div className="ml-auto cmdb-info">
                <div> <span style={{color: "#7FFFD4"}}>*</span> Created by <span className="cmdb-info-name">Natalia Tyulina</span> at 22:00 16.6.2019 <span style={{color: "#7FFFD4"}}>*</span></div>
                <div><span style={{color: "#7FFFD4"}}>*</span> Edit by <span className="cmdb-info-name">Natalia Tyulina</span> at 22:00 16.6.2019 <span style={{color: "#7FFFD4"}}>*</span></div>
                <div><span style={{color: "#7FFFD4"}}>*</span> Status changed by <span className="cmdb-info-name">Natalia Tyulina</span> at 22:00 16.6.2019 <span style={{color: "#7FFFD4"}}>*</span></div>
              </div>
            </div>

            <hr />
            <div className="cmdb-selects col-lg-12">
                <div className="row col-lg-6 cmdb-selects-info">
                  <div className="w-30">
                    <Label>Status:</Label>
                  </div>
                  <div className="">
                    {companyTitle}
                  </div>
                </div>
                <div className="row col-lg-6 cmdb-selects-info">
                  <div className="w-30">
                    <Label>Company:</Label>
                  </div>
                  <div className="">
                    {companyTitle}
                  </div>
                </div>

              { this.state.sidebarItem &&
                 this.state.sidebarItem.attributes.map((item)=>
                <div key={item.id} className="row col-lg-6 cmdb-selects-info">
                  <div className="w-30">
                    <Label>{item.title.length > 0 ? item.title : "No title"}</Label>
                  </div>
                  { false && item.type.id==='select' &&
                    <div className="">{item.title}</div>
                  }
                  { false && item.type.id==='input' &&
                    <div className="">{item.title}</div>
                  }
                  { false && item.type.id==='textarea' &&
                    <div className="" dangerouslySetInnerHTML ={{__html:htmlFixNewLines(item.title)}}></div>
                  }
                </div>
              )
            }
            </div>

              <div className="m-t-20 col-lg-12">
                <Label className="m-0" style={{height: "30px"}}>Description</Label>
                <div className="row">
                  <div className="flex p-r-15" dangerouslySetInnerHTML={{__html:this.state.item===null ? '': ( this.state.item.description.length === 0 ? "No description" : this.state.item.description.replace(/(?:\r\n|\r|\n)/g, '<br>') )}}></div>
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
                      <th>DNS</th>
                      <th>DNS 2</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.state.IPs.map((item,index)=>
                      <tr key={item.id}>
                        <td>{item.NIC}</td>
                        <td>{item.IP}</td>
                        <td>{item.mask}</td>
                        <td>{item.gateway}</td>
                        <td>{item.DNS}</td>
                        <td>{item.DNS2}</td>
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
                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.state.passwords.map((item,index)=>
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.login}</td>
                        <td>{item.password}</td>
                        {false && <td> <a href={item.IP} target="_blank" without rel="noopener noreferrer">{item.IP}</a></td> }
                        <td>{item.IP}</td>
                        <td>{item.note}</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              <div className="m-t-20 col-lg-12">
                <Label>Backup tasks description</Label>
                <div className="row">
                  <div className="flex">
                    { false && this.state.backups.map((item,index)=>
                      <div className="" key={item.id}>
                        <Label>
                          <div dangerouslySetInnerHTML ={{__html:htmlFixNewLines(this.state.sidebarItem?this.state.sidebarItem.bacupTasksLabel:'')}}/>
                        </Label>
                        <div  dangerouslySetInnerHTML ={{__html:htmlFixNewLines(item.text)}}>
                        </div>
                      </div>
                    )}
                    {this.state.backupsDescription ? this.state.backupsDescription.text : "No backup tasks description"}
                  </div>
                  <div className="cmdb-yellow">
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean et est a dui semper facilisis. Pellentesque placerat elit a nunc. Nullam tortor odio, rutrum quis, egestas ut, posuere sed, felis. Vestibulum placerat feugiat nisl. Suspendisse lacinia, odio non feugiat vestibulum, sem erat blandit metus, ac nonummy magna odio pharetra felis.
                  </div>
                </div>
              </div>

              <Nav tabs className="col-lg-12 m-t-20 ">
                <NavItem className="">
                  <NavLink
                    className={classnames({ active: this.state.toggleTab === '1'}, "clickable", "")}
                    onClick={() => { this.setState({toggleTab:'1'}); }}
                  >
                    Comments
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink>  |  </NavLink>
                </NavItem>
                <NavItem className="">
                  <NavLink
                    className={classnames({ active: this.state.toggleTab === '2' }, "clickable", "")}
                    onClick={() => { this.setState({toggleTab:'2'}); }}
                  >
                    Links
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink>  |  </NavLink>
                </NavItem>
                <NavItem className="">
                  <NavLink
                    className={classnames({ active: this.state.toggleTab === '3' }, "clickable", "")}
                    onClick={() => { this.setState({toggleTab:'3'}); }}
                  >
                    Attachments
                  </NavLink>
                </NavItem>
              </Nav>

                <TabContent activeTab={this.state.toggleTab}>
                  <TabPane tabId="1">

                  </TabPane>
                  <TabPane tabId="2" className="cmdb-item-table">
                    <Table className="table">
                      <thead>
                        <tr>
                          <th>Connection</th>
                          <th>Note</th>
                        </tr>
                      </thead>
                      <tbody>
                        { this.state.links.map((item,index)=>
                          <tr key={item.id}>
                            <td><a href={'/cmdb/i/'+item.link.sidebarID+'/'+item.link.id} target="_blank" without="true" rel="noopener noreferrer">{item.link.title}</a></td>
                            <td><div dangerouslySetInnerHTML ={{__html:htmlFixNewLines(item.note)}}></div></td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </TabPane>
                  <TabPane tabId="3">

                  </TabPane>
                </TabContent>

      </div>
    );
  }
}
