import React, { Component } from 'react';
import {rebase,database} from '../../index';
import {  FormGroup, Label, Input, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import {toSelArr, snapshotToArray, getAttributeDefaultValue, htmlFixNewLines} from '../../helperFunctions';
import Select from 'react-select';
import {selectStyle} from "configs/components/select";
import IPList from './ipList';
import Passwords from './passwords';
import AttributesHandler from './attributesHandler';
import TextareaList from '../components/backups';
import classnames from 'classnames';
import CKEditor from 'ckeditor4-react';
import Links from './links';

export default class ItemEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      saving:false,
      loading:true,
      companies:[],
      statuses:[],
      allLinks:[],
      originalIPs:[],
      originalPasswords:[],
      originalBackups:[],
      originalLinks:[],
      sidebarItem:null,
      tab:0,

      title:'',
      description:'',
      company:null,
      status:null,
      links:[],
      IPlist:[],
      backupTasks:[],
      passwords:[],
      attributes:{},
    }
    this.setData.bind(this);
    this.getData.bind(this);
    this.submit.bind(this);
    this.delete.bind(this);
    this.getData();
  }

  componentWillReceiveProps(props){
    if(props.saving){
      this.submit();
    }
    if(props.delete){
      this.delete();
    }
  }

  getData(){
    let sidebarID = this.props.match.params.sidebarID;
    let itemID = this.props.match.params.itemID;
    Promise.all([
      database.collection('cmdb-items').get(),
      database.collection('cmdb-statuses').get(),
      database.collection('companies').get(),
      database.collection('cmdb-sidebar').where('url','==',sidebarID).get(),
      database.collection('cmdb-IPs').where('itemID','==',itemID).get(),
      database.collection('cmdb-passwords').where('itemID','==',itemID).get(),
      database.collection('cmdb-backups').where('itemID','==',itemID).get(),
      database.collection('cmdb-links').where('link','==',itemID).get(),
      database.collection('cmdb-links').where('itemID','==',itemID).get(),
    ])
    .then(([items,statuses,companies,sidebarItem,IPs,passwords,backups,links1,links2])=>{
      this.setData(
        snapshotToArray(items).find((item)=>item.id===itemID),
        toSelArr(snapshotToArray(statuses)),
        toSelArr(snapshotToArray(companies)),
        snapshotToArray(sidebarItem)[0],
        snapshotToArray(IPs),
        snapshotToArray(passwords),
        snapshotToArray(backups),
        toSelArr(snapshotToArray(items).filter((item)=>item.id!==itemID)),
        [...(snapshotToArray(links1).map((item)=>{return{...item,source:false,itemID:item.link,link:item.itemID,opened:false}})),...(snapshotToArray(links2).map((item)=>{return{...item,source:true,opened:false}}))]
    );
    });
  }

  setData(item,statuses,companies,sidebarItem, IPs,passwords, backups, items, links){
    let attributes={};
    sidebarItem.attributes.forEach((item)=>attributes[item.id]=getAttributeDefaultValue(item));
    attributes={...attributes,...item.attributes};
    let company = companies.find((item2)=>item2.id===item.company);
    if(company===undefined){
      if(companies.length>0){
        company=companies[0];
      }else{
        company=null
      }
    }
    let status = statuses.find((item2)=>item2.id===item.status);
    if(!status){
      if(statuses.length>0){
        status=statuses[0];
      }
      status=null
    }
    this.setState({
      statuses,
      companies,
      sidebarItem,
      allLinks:items,
      loading:false,

      title:item.title,
      description:item.description?item.description:'',
      company,
      status,
      IPlist:IPs.map((item)=>{return {...item,fake:false}}),
      passwords:passwords.map((item)=>{return {...item,fake:false}}),
      backupTasks:backups.map((item)=>{return {...item,fake:false}}),
      links:links.map((item)=>{return {...item,fake:false,link:items.find((item2)=>item2.id===item.link)}}),
      attributes,

      originalLinks:links.map((item)=>item.id),
      originalIPs:IPs.map((item)=> item.id),
      originalPasswords:passwords.map((item)=> item.id),
      originalBackups:backups.map((item)=> item.id),
    });
  }

  delete(){
    if(window.confirm('Are you sure?')){
      this.setState({saving:true,loading:true})
      this.state.originalIPs.map((item)=>rebase.removeDoc('/cmdb-IPs/'+item));
      this.state.originalBackups.map((item)=>rebase.removeDoc('/cmdb-backups/'+item));
      this.state.originalPasswords.map((item)=>rebase.removeDoc('/cmdb-backups/'+item));
      this.state.originalLinks.map((item)=>rebase.removeDoc('/cmdb-links/'+item));
      rebase.removeDoc('/cmdb-items/'+this.props.match.params.itemID);
      this.props.setDeleting(false);
      this.props.history.goBack();
    }
    this.props.setDeleting(false);
  }

  submit(){
    let ID = this.props.match.params.itemID;
    this.setState({saving:true});
    let body = {
      title:this.state.title,
      description:this.state.description,
      company:this.state.company.id,
      status:this.state.status.id,
      IP:this.state.IPlist.map((item)=>item.IP),
      attributes:this.state.attributes
    };
    let promises=[];
    promises.push(rebase.updateDoc('/cmdb-items/'+ID, body));

    this.state.IPlist.filter((item)=>item.fake).forEach((item)=>{
      let newItem={...item};
      delete newItem['id'];
      delete newItem['fake'];
      promises.push(rebase.addToCollection('/cmdb-IPs',{...newItem,itemID:ID}));
    });

    this.state.IPlist.filter((item)=>!item.fake).forEach((item)=>{
      let newItem={...item};
      delete newItem['id'];
      delete newItem['fake'];
      promises.push(rebase.updateDoc('/cmdb-IPs/'+item.id,{...newItem}));
    });

    let currentIDs=this.state.IPlist.filter((item)=>!item.fake).map((item)=>item.id);
    this.state.originalIPs.filter((item)=>!currentIDs.includes(item)).forEach((item)=>{
      promises.push(rebase.removeDoc('/cmdb-IPs/'+item.id));
    });
    ////
    this.state.passwords.filter((item)=>item.fake).forEach((item)=>{
      let newItem={...item};
      delete newItem['id'];
      delete newItem['fake'];
      promises.push(rebase.addToCollection('/cmdb-passwords',{...newItem,itemID:ID}));
    });

    this.state.passwords.filter((item)=>!item.fake).forEach((item)=>{
      let newItem={...item};
      delete newItem['id'];
      delete newItem['fake'];
      promises.push(rebase.updateDoc('/cmdb-passwords/'+item.id,{...newItem}));
    });
    currentIDs=this.state.passwords.filter((item)=>!item.fake).map((item)=>item.id);
    this.state.originalPasswords.filter((item)=>!currentIDs.includes(item)).forEach((item)=>{
      promises.push(rebase.removeDoc('/cmdb-passwords/'+item.id));
    });

    ///

    ////
    this.state.links.filter((item)=>item.fake).forEach((item)=>{
      let newItem={...item};
      delete newItem['id'];
      delete newItem['source'];
      delete newItem['fake'];
      delete newItem['opened'];
      newItem.link=newItem.link.id;
      promises.push(rebase.addToCollection('/cmdb-links',{...newItem,itemID:ID}));
    });

    this.state.links.filter((item)=>!item.fake).forEach((item)=>{
      let newItem={...item};
      delete newItem['id'];
      delete newItem['source'];
      delete newItem['fake'];
      delete newItem['opened'];
      newItem.link=newItem.link.id;
      if(!item.source){
        let link = newItem.link;
        newItem.link = newItem.itemID;
        newItem.itemID = link;
      }
      promises.push(rebase.updateDoc('/cmdb-links/'+item.id,{...newItem}));
    });
    currentIDs=this.state.links.filter((item)=>!item.fake).map((item)=>item.id);
    this.state.originalLinks.filter((item)=>!currentIDs.includes(item)).forEach((item)=>{

      promises.push(rebase.removeDoc('/cmdb-links/'+item));
    });

    ///
    this.state.backupTasks.filter((item)=>item.fake).forEach((item)=>{
      promises.push(rebase.addToCollection('/cmdb-backups',{text:item.text,itemID:ID,textHeight:item.textHeight,backupList:item.backupList?item.backupList:[]}));
    });
    this.state.backupTasks.filter((item)=>!item.fake).forEach((item)=>{
      promises.push(rebase.updateDoc('/cmdb-backups/'+item.id,{text:item.text,itemID:ID,textHeight:item.textHeight,backupList:item.backupList?item.backupList:[]}));
    });

    currentIDs = this.state.backupTasks.map(item => item.id);
    this.state.originalBackups.filter((item)=> !currentIDs.includes(item)).forEach((item)=>{
      promises.push(rebase.removeDoc('/cmdb-backups/'+item));
    });
    Promise.all(promises).then(()=>{
      this.setState({saving:false,loading:true})
      Promise.all([
        database.collection('cmdb-items').doc(this.props.match.params.itemID).get(),
        database.collection('cmdb-IPs').where('itemID','==',this.props.match.params.itemID).get(),
        database.collection('cmdb-passwords').where('itemID','==',this.props.match.params.itemID).get(),
        database.collection('cmdb-backups').where('itemID','==',this.props.match.params.itemID).get(),
        database.collection('cmdb-links').where('link','==',this.props.match.params.itemID).get(),
        database.collection('cmdb-links').where('itemID','==',this.props.match.params.itemID).get(),
      ])
      .then(([item,IPs,passwords, backups,links1,links2])=>{
        this.setData(
          {id:item.id,...item.data()},
          this.state.statuses,
          this.state.companies,
          this.state.sidebarItem,
          snapshotToArray(IPs),
          snapshotToArray(passwords),
          snapshotToArray(backups),this.state.allLinks,
          [...(snapshotToArray(links1).map((item)=>{return{...item,source:false,itemID:item.link,link:item.itemID}})),...(snapshotToArray(links2).map((item)=>{return{...item,source:true}}))]
        );
        this.props.setSaving(false);
      });
    })
  }

  removeBackupTask(id){
    this.setState({
      backupTasks: this.state.backupTasks.filter((item)=>item.id!==id),
    });
  }

  render(){
    return (
          <div className="ml-auto mr-auto card-box fit-with-header p-t-15 w-50">
            <FormGroup>
              <Label>Name</Label>
              <Input type="text" placeholder="Enter name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
            </FormGroup>
            <FormGroup>
              <Label>Company</Label>
              <Select
                styles={selectStyle}
                options={this.state.companies}
                value={this.state.company}
                onChange={e =>{ this.setState({ company: e }); }}
              />
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Select
                styles={selectStyle}
                options={this.state.statuses}
                value={this.state.status}
                onChange={e =>{ this.setState({ status: e }); }}
              />
            </FormGroup>

            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.tab === 0, clickable:true })}
                  onClick={() => { this.setState({tab:0}); }}
                >
                  Description
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.tab === 1, clickable:true })}
                  onClick={() => { this.setState({tab:1}); }}
                >
                  IP list
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.tab === 2 , clickable:true   })}
                  onClick={() => { this.setState({tab:2}); }}
                >
                  Backup tasks
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.tab === 3, clickable:true })}
                  onClick={() => { this.setState({tab:3}); }}
                >
                  Attributes
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.tab === 4, clickable:true })}
                  onClick={() => { this.setState({tab:4}); }}
                >
                  Passwords
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({ active: this.state.tab === 5, clickable:true })}
                  onClick={() => { this.setState({tab:5}); }}
                  >
                  Links
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.tab} className="m-t-15">
              <TabPane tabId={0}>
                <CKEditor
                  data={this.state.description}
                  onChange={(e)=>this.setState({description:e.editor.getData()})}
                  config={ {
                      //height: [ '60vh' ],
                      codeSnippet_languages: {
                        javascript: 'JavaScript',
                        php: 'PHP'
                      }
                  } }
                  />
              </TabPane>
              <TabPane tabId={1}>
                <IPList items={this.state.IPlist} onChange={(items)=>this.setState({IPlist:items})} />
              </TabPane>
              <TabPane tabId={2}>
                <TextareaList
                  items={this.state.backupTasks}
                  onChange={(items)=>this.setState({backupTasks:items})}
                  removeItem={this.removeBackupTask.bind(this)}
                  width={300}
                  rows={6}
                  label={htmlFixNewLines(this.state.sidebarItem?this.state.sidebarItem.bacupTasksLabel:'')}
                  addLabel="Add backup task"
                />
              </TabPane>
              <TabPane tabId={3}>
                <AttributesHandler attributes={this.state.sidebarItem ? this.state.sidebarItem.attributes : []} values={this.state.attributes}
                  setValue={(id, val)=>{
                    let newAttributes={...this.state.attributes};
                    newAttributes[id] = val;
                    this.setState({attributes:newAttributes})
                  }} />
              </TabPane>
              <TabPane tabId={4}>
                <Passwords items={this.state.passwords} onChange={(items)=>this.setState({passwords:items})} />
              </TabPane>
              <TabPane tabId={5}>
                <Links items={this.state.links} links={this.state.allLinks} onChange={(links)=>this.setState({links})} />
              </TabPane>
            </TabContent>
        </div>
    );
  }
}
