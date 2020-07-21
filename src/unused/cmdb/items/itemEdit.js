import React, { Component } from 'react';
import {rebase,database} from '../../index';
import { Button,  FormGroup, Label, Input } from 'reactstrap';
import {toSelArr, snapshotToArray} from '../../helperFunctions';
import Select from 'react-select';
import IPList from '../ipList';
import TextareaListMutable from '../components/textareaListBoth';

export default class ItemEdit extends Component{
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
    }

    this.removeBackupTask.bind(this);
    this.setData.bind(this);
    this.getData.bind(this);
    this.getData();
  }

  getData(){
    Promise.all([
      database.collection('cmdb-statuses').get(),
      database.collection('companies').get(),
      database.collection('cmdb-items').doc(this.props.match.params.id).get(),
      database.collection('cmdb-item-IPList').where("itemID", "==", this.props.match.params.id).get(),
      database.collection('cmdb-item-backups').where("itemID", "==", this.props.match.params.id).get(),
    ])
    .then(([statuses,companies,item,ipList,backups])=>{
      this.setData(
        toSelArr(snapshotToArray(statuses)),
        toSelArr(snapshotToArray(companies)),
        {id:item.id,...item.data()},
        snapshotToArray(ipList),
        snapshotToArray(backups),
    );
    });
  }

  setData(statuses,companies,item,ipList,backups,storages){
    this.setState({
      statuses,
      companies,
      title: item.title,
      company: companies.find((i)=>i.id===item.company),
      status: statuses.find((i)=>i.id===item.status),
      originalIPList: ipList,
      IPlist: ipList.map((i)=>{return {...i,fake:false}}),
      backupTasks: backups.map((i)=>{return {...i,fake:false, textHeight: i.text.split("\n").length, textLeftHeight: i.textLeft.split("\n").length}}),
      defaultBackupTasks: backups.map((i)=> i.id),
    });
  }

  removeBackupTask(id){
    this.setState({
      backupTasks: this.state.backupTasks.filter((item)=>item.id!==id),
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

          <TextareaListMutable
            items={this.state.backupTasks}
            onChange={(items)=>this.setState({backupTasks:items})}
            removeItem={this.removeBackupTask.bind(this)}
            width={300}
            rows={1}
            label={``}
            addLabel="Add"
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
            rebase.updateDoc('/cmdb-items/'+ID, body);

            this.state.IPlist.filter((item)=>item.fake).forEach((item)=>{
              let newItem={...item};
              delete newItem['id'];
              delete newItem['fake'];
              rebase.addToCollection('/cmdb-item-IPList',{...newItem,itemID:ID});
            });

            this.state.IPlist.filter((item)=>!item.fake).forEach((item)=>{
              let newItem={...item};
              delete newItem['id'];
              delete newItem['fake'];
              rebase.updateDoc('/cmdb-item-IPList/'+item.id,{...newItem});
            });

            let currentIDs=this.state.IPlist.filter((item)=>!item.fake).map((item)=>item.id);
            this.state.originalIPList.filter((item)=>!currentIDs.includes(item.id)).forEach((item)=>{
              rebase.removeDoc('/cmdb-item-IPList/'+item.id);
            });

            this.state.backupTasks.filter((item)=>item.fake).forEach((item)=>{
              rebase.addToCollection('/cmdb-item-backups',{text:item.text, textLeft:item.textLeft, itemID:ID});
            });
            this.state.backupTasks.filter((item)=>!item.fake).forEach((item)=>{
              rebase.updateDoc('/cmdb-item-backups/'+item.id,{text:item.text, textLeft:item.textLeft, itemID:ID});
            });

            let backupTasksID = this.state.backupTasks.map(item => item.id);
            this.state.defaultBackupTasks.filter((item)=> !backupTasksID.includes(item)).forEach((item)=>{
              rebase.removeDoc('/cmdb-item-backups/'+item);
            });

            this.setState({
              title:'',
              company:null,
              status:null,
              IPlist:[],
              backupTasks:[],
              saving:false
            });

            this.props.history.goBack();
          }}>{this.state.saving?'Saving...':'Save server'}</Button>
        </div>
      </div>
    );
  }
}
