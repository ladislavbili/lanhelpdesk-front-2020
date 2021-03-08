import React, { Component } from 'react';
import {rebase,database} from '../../index';
import { Button,  FormGroup, Label, Input, Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import {toSelArr, snapshotToArray, getAttributeDefaultValue, htmlFixNewLines} from '../../helperFunctions';
import Select from 'react-select';
import {selectStyle} from "configs/components/select";
import IPList from './ipList';
import Links from './links';
import Passwords from './passwords';
import AttributesHandler from './attributesHandler';
import TextareaList from '../components/backups';
import BackupTasksDescription from '../components/backupsDescription';
import CKEditor from 'ckeditor4-react';
import classnames from "classnames";

export default class ItemAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      saving:false,
      loading:true,
      companies:[],
      statuses:[],
      allLinks:[],
      sidebarItem:null,
      tab:'0',

      title:'',
      description:'',
      company:null,
      status:null,
      IPlist:[],
      backupTasks:[{id:-1, def: true}],
      backupTasksDescription: {},
      passwords:[],
      attributes:{},
      links:[],
      toggleTab: "1",
    }
    this.setData.bind(this);
    this.getData.bind(this);
    this.getData();
  }

  getData(){
    Promise.all([
      database.collection('cmdb-statuses').get(),
      database.collection('companies').get(),
      database.collection('cmdb-items').get(),
      database.collection('cmdb-sidebar').where('url','==',this.props.match.params.sidebarID).get(),
    ])
    .then(([statuses,companies,links,sidebarItem])=>{
      this.setData(toSelArr(snapshotToArray(statuses)),toSelArr(snapshotToArray(companies)),toSelArr(snapshotToArray(links)),snapshotToArray(sidebarItem)[0]);
    });
  }


  setData(statuses,companies,links, sidebarItem){
    let attributes={};
    sidebarItem.attributes.forEach((item)=>attributes[item.id]=getAttributeDefaultValue(item))
    this.setState({
      statuses,
      companies,
      sidebarItem,
      attributes,
      allLinks:links,
      loading:false
    });
  }

  removeBackupTask(id){
    this.setState({
      backupTasks: this.state.backupTasks.filter((item)=>item.id!==id),
    });
  }

  removePassword(id){
    this.setState({
      passwords: this.state.passwords.filter((item)=>item.id!==id),
    });
  }



  render(){
    return (
      <div>
        <div className="commandbar">
          <div className="d-flex flex-row align-items-center">
          </div>
        </div>

        <div className="card-box fit-with-header-and-commandbar p-t-15 scrollable" >
          <div className="row m-b-10">
            <h2 className="center-hor flex cmdb-title-edit m-r-10">
              <Input type="text" placeholder="Enter name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
            </h2>
            <div className="ml-auto cmdb-info">
              <div> <span style={{color: "#7FFFD4"}}>*</span> Created by <span className="cmdb-info-name">Natalia Tyulina</span> at 22:00 16.6.2019 <span style={{color: "#7FFFD4"}}>*</span></div>
              <div><span style={{color: "#7FFFD4"}}>*</span> Edit by <span className="cmdb-info-name">Natalia Tyulina</span> at 22:00 16.6.2019 <span style={{color: "#7FFFD4"}}>*</span></div>
              <div><span style={{color: "#7FFFD4"}}>*</span> Status changed by <span className="cmdb-info-name">Natalia Tyulina</span> at 22:00 16.6.2019 <span style={{color: "#7FFFD4"}}>*</span></div>
            </div>
          </div>

          <div className="cmdb-selects col-lg-12">
              <div className="row m-b-10 col-lg-6 cmdb-selects-info">
                <div className="w-30">
                  <Label>Status:</Label>
                </div>
                <div className="flex">
                  <Select
                    styles={selectStyle}
                    options={this.state.statuses}
                    value={this.state.status}
                    onChange={e =>{ this.setState({ status: e }); }}
                    />
                </div>
              </div>
              <div className="row m-b-10 col-lg-6 cmdb-selects-info">
                <div className="w-30">
                  <Label>Company:</Label>
                </div>
                <div className="flex">
                  <Select
                    styles={selectStyle}
                    options={this.state.companies}
                    value={this.state.company}
                    onChange={e =>{ this.setState({ company: e }); }}
                    />
                </div>
              </div>

            <AttributesHandler attributes={this.state.sidebarItem ? this.state.sidebarItem.attributes : []} values={this.state.attributes}
              setValue={(id, val)=>{
                let newAttributes={...this.state.attributes};
                newAttributes[id] = val;
                this.setState({attributes:newAttributes})
              }} />
          </div>

          <FormGroup className="m-b-10">
            <div className="m-r-5 w-10 m-b-15">
              <Label>Description</Label>
            </div>
            <div className="row">
              <div className="flex p-r-15">
                <CKEditor
                  data={this.state.description}
                  onChange={(e)=>this.setState({description:e.editor.getData()})}
                  config={ {
                    codeSnippet_languages: {
                      javascript: 'JavaScript',
                      php: 'PHP'
                    }
                  } }
                  />
              </div>
              <div className="cmdb-yellow">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean et est a dui semper facilisis. Pellentesque placerat elit a nunc. Nullam tortor odio, rutrum quis, egestas ut, posuere sed, felis. Vestibulum placerat feugiat nisl. Suspendisse lacinia, odio non feugiat vestibulum, sem erat blandit metus, ac nonummy magna odio pharetra felis.
              </div>
            </div>
          </FormGroup>

            <div className="m-t-30 cmdb-item-table">
              <IPList items={this.state.IPlist} onChange={(items)=>this.setState({IPlist:items})} />
            </div>

            <div className="m-t-30 cmdb-item-table">
              <Passwords items={this.state.passwords} onChange={(items)=>this.setState({passwords:items})} />
            </div>

            <div className="m-t-30">
              <Label>Backup tasks description</Label>
              <div className="row">
                <div className="flex p-r-15">
                {false &&  <TextareaList
                    items={this.state.backupTasks}
                    onChange={(items)=>this.setState({backupTasks:items})}
                    removeItem={this.removeBackupTask.bind(this)}
                    width={300}
                    rows={6}
                    label={htmlFixNewLines(this.state.sidebarItem?this.state.sidebarItem.bacupTasksLabel:'')}
                    addLabel="Add backup task"
                    />
                }
                  <BackupTasksDescription
                    item={this.state.backupTasksDescription}
                    onChange={(item)=>this.setState({backupTasksDescription: item})}
                    width={300}
                  />
                </div>
                <div className="cmdb-yellow">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean et est a dui semper facilisis. Pellentesque placerat elit a nunc. Nullam tortor odio, rutrum quis, egestas ut, posuere sed, felis. Vestibulum placerat feugiat nisl. Suspendisse lacinia, odio non feugiat vestibulum, sem erat blandit metus, ac nonummy magna odio pharetra felis.
                </div>
              </div>
            </div>

              <Nav tabs className="b-0 m-b-22 m-t-30 m-l--10">
                <NavItem className="cmdb-tab">
                  <NavLink
                    className={classnames({ active: this.state.toggleTab === '1'}, "clickable", "")}
                    onClick={() => { this.setState({toggleTab:'1'}); }}
                  >
                    Comments
                  </NavLink>
                </NavItem>
                <NavItem className="cmdb-tab">
                  <NavLink
                    className={classnames({ active: this.state.toggleTab === '2' }, "clickable", "")}
                    onClick={() => { this.setState({toggleTab:'2'}); }}
                  >
                    Links
                  </NavLink>
                </NavItem>
                <NavItem className="cmdb-tab">
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
                    <Links items={this.state.links} links={this.state.allLinks} onChange={(links)=>this.setState({links})} />
                  </TabPane>
                  <TabPane tabId="3">

                  </TabPane>
                </TabContent>

            <Button className="btn m-t-10  m-b-30 " disabled={this.state.company===null || this.state.status===null} onClick={()=>{
                this.setState({saving:true});
                let body = {
                  title:this.state.title,
                  description:this.state.description,
                  company:this.state.company.id,
                  status:this.state.status.id,
                  IP:this.state.IPlist.map((item)=>item.IP),
                  attributes:this.state.attributes,
                  sidebarID:this.state.sidebarItem.url
                };
                rebase.addToCollection('/cmdb-items', body)
                .then((response)=>{
                  this.state.IPlist.forEach((item)=>{
                    delete item['id'];
                    delete item['fake'];
                    rebase.addToCollection('/cmdb-IPs',{...item,itemID:response.id});
                  });

                  this.state.passwords.forEach((item)=>{
                    delete item['id'];
                    delete item['fake'];
                    rebase.addToCollection('/cmdb-passwords',{...item,itemID:response.id});
                  });

                  this.state.links.forEach((item)=>{
                    delete item['id'];
                    delete item['fake'];
                    delete item['opened'];
                    item.link=item.link.id;
                    rebase.addToCollection('/cmdb-links',{...item,itemID:response.id});
                  });

                  if (this.state.backupTasks.length === 1 && !this.state.backupTasks[0].def){
                    this.state.backupTasks.forEach((item)=>{
                      rebase.addToCollection('/cmdb-backups',
                      {
                        text: item.text ? item.text : "",
                        itemID:response.id,
                        textHeight:item.textHeight ? item.textHeight : null,
                        backupList: item.backupList ? item.backupList : [],
                      });
                    });
                  }

                  let attributes={};
                  this.state.sidebarItem.attributes.forEach((item)=>attributes[item.id]=getAttributeDefaultValue(item));
                  this.setState({
                    title:'',
                    company:null,
                    status:null,
                    IPlist:[],
                    saving:false,
                    attributes,
                    description:'',
                    links:[]
                  });
                  this.props.history.goBack();
                });
              }}>{this.state.saving?'Adding...':(this.state.sidebarItem? ('Add '+this.state.sidebarItem.title) :'Add item')}</Button>

              <Button className="btn-link m-t-10  m-b-30 " onClick={this.props.history.goBack}>Cancel</Button>

          </div>
        </div>
        );
      }
    }
