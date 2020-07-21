import React, { Component } from 'react';
import {rebase,database} from '../../index';
import { Button,  FormGroup, Label, Input } from 'reactstrap';
import {toSelArr, snapshotToArray} from '../../helperFunctions';
import Select from 'react-select';
import IPList from '../ipList';
import TextareaList from '../components/textareaListTextOnly';


export default class ServerEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      saving:false,
      companies:[],
      statuses:[],
      originalIPList:[],
      title:'',
      company:null,
      status:null,
      IPlist:[],
      backupTasks:[],
      diskArray:[],
    }

    this.removeDiskArray.bind(this);
    this.removeBackupTask.bind(this);
    this.setData.bind(this);
    this.getData.bind(this);
    this.getData();
  }

  getData(){
    Promise.all([
      database.collection('cmdb-statuses').get(),
      database.collection('companies').get(),
      database.collection('cmdb-servers').doc(this.props.match.params.id).get(),
      database.collection('cmdb-IPList').where("serverID", "==", this.props.match.params.id).get(),
      database.collection('cmdb-server-backups').where("serverID", "==", this.props.match.params.id).get(),
      database.collection('cmdb-server-storage').where("serverID", "==", this.props.match.params.id).get(),
    ])
    .then(([statuses,companies,server,ipList,backups,storages])=>{
      this.setData(
        toSelArr(snapshotToArray(statuses)),
        toSelArr(snapshotToArray(companies)),
        {id:server.id,...server.data()},
        snapshotToArray(ipList),
        snapshotToArray(backups),
        snapshotToArray(storages),
    );
    });
  }

  setData(statuses,companies,server,ipList,backups,storages){
    this.setState({
      statuses,
      companies,
      title:server.title,
      company:companies.find((item)=>item.id===server.company),
      status:statuses.find((item)=>item.id===server.status),
      originalIPList:ipList,
      IPlist:ipList.map((item)=>{return {...item,fake:false}}),
      backupTasks:backups.map((item)=>{return {...item,fake:false}}),
      defaultBackupTasks:backups.map((item)=> item.id),
      diskArray:storages.map((item)=>{return {...item,fake:false}}),
      defaultDiskArray:storages.map((item)=> item.id),
    });
  }

  removeBackupTask(id){
    this.setState({
      backupTasks: this.state.backupTasks.filter((item)=>item.id!==id),
    });
  }

  removeDiskArray(id){
    this.setState({
      diskArray: this.state.diskArray.filter((item)=>item.id!==id),
    });
  }

  render(){
    return (
        <div className="container-padding form-background card-box scrollable fit-with-header">
          <div className="ml-auto mr-auto" style={{maxWidth:1000}}>
            <FormGroup>
              <Label>Name</Label>
              <Input type="text" placeholder="Enter name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
            </FormGroup>
            <FormGroup>
              <Label>Company</Label>
              <Select
                className="supressDefaultSelectStyle"
                options={this.state.companies}
                value={this.state.company}
                onChange={e =>{ this.setState({ company: e }); }}
              />
            </FormGroup>
            <FormGroup>
              <Label>Status</Label>
              <Select
                className="supressDefaultSelectStyle"
                options={this.state.statuses}
                value={this.state.status}
                onChange={e =>{ this.setState({ status: e }); }}
              />
            </FormGroup>

          <IPList items={this.state.IPlist} onChange={(items)=>this.setState({IPlist:items})} />
          <TextareaList
            items={this.state.backupTasks}
            onChange={(items)=>this.setState({backupTasks:items})}
            removeItem={this.removeBackupTask.bind(this)}
            width={300}
            rows={6}
            label={`
                Názov <br>
                Zálohované údaje  <br>
                Rotáciu zálohy  <br>
                Čas spustenia <br>
                Notifikačný email <br>
                Smtp settings pre notifikácie <br>
            `}
            addLabel="Add backup task"
            />

          <TextareaList
            items={this.state.diskArray}
            onChange={(items)=>this.setState({diskArray:items})}
            removeItem={this.removeDiskArray.bind(this)}
            width={300}
            rows={3}
            label={`
              <span>
              RAID RADIČ <br>
              POCET HDD <br>
              Typ a velkost hdd <br>
            </span>
            `}
            addLabel="Add disk array"
            />


        <Button color="secondary" onClick={this.props.history.goBack}>Cancel</Button>

        <Button color="success" disabled={this.state.company===null || this.state.status===null} onClick={()=>{
            let ID = this.props.match.params.id;
            this.setState({saving:true});
            let body = {
              title:this.state.title,
              company:this.state.company.id,
              status:this.state.status.id,
              IP:this.state.IPlist.map((item)=>item.IP)
            };
            rebase.updateDoc('/cmdb-servers/'+ID, body);

            this.state.IPlist.filter((item)=>item.fake).forEach((item)=>{
              let newItem={...item};
              delete newItem['id'];
              delete newItem['fake'];
              rebase.addToCollection('/cmdb-IPList',{...newItem,serverID:ID});
            });

            this.state.IPlist.filter((item)=>!item.fake).forEach((item)=>{
              let newItem={...item};
              delete newItem['id'];
              delete newItem['fake'];
              rebase.updateDoc('/cmdb-IPList/'+item.id,{...newItem});
            });

            let currentIDs=this.state.IPlist.filter((item)=>!item.fake).map((item)=>item.id);
            this.state.originalIPList.filter((item)=>!currentIDs.includes(item.id)).forEach((item)=>{
              rebase.removeDoc('/cmdb-IPList/'+item.id);
            });

            this.state.backupTasks.filter((item)=>item.fake).forEach((item)=>{
              rebase.addToCollection('/cmdb-server-backups',{text:item.text,serverID:ID});
            });
            this.state.backupTasks.filter((item)=>!item.fake).forEach((item)=>{
              rebase.updateDoc('/cmdb-server-backups/'+item.id,{text:item.text,serverID:ID});
            });

            let backupTasksID = this.state.backupTasks.map(item => item.id);
            this.state.defaultBackupTasks.filter((item)=> !backupTasksID.includes(item)).forEach((item)=>{
              rebase.removeDoc('/cmdb-server-backups/'+item);
            });

            this.state.diskArray.filter((item)=>item.fake).forEach((item)=>{
              rebase.addToCollection('/cmdb-server-storage',{text:item.text,serverID:ID});
            });
            this.state.diskArray.filter((item)=>!item.fake).forEach((item)=>{
              rebase.updateDoc('/cmdb-server-storage/'+item.id,{text:item.text,serverID:ID});
            });

            let diskArraysID = this.state.diskArray.map(item => item.id);
            this.state.defaultDiskArray.filter((item)=> !diskArraysID.includes(item)).forEach((item)=>{
              rebase.removeDoc('/cmdb-server-storage/'+item);
            });

            this.setState({
              title:'',
              company:null,
              status:null,
              IPlist:[],
              backupTasks:[],
              diskArray:[],
              saving:false
            });

            this.props.history.goBack();
          }}>{this.state.saving?'Saving...':'Save server'}</Button>
        </div>
      </div>
    );
  }
}
