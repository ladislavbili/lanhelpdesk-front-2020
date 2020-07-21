import React, { Component } from 'react';
import {rebase,database} from '../../index';
import { Button,  FormGroup, Label, Input } from 'reactstrap';
import {toSelArr, snapshotToArray} from '../../helperFunctions';
import Select from 'react-select';
import IPList from '../ipList';
import TextareaListMutable from '../components/textareaListBoth';


export default class ItemAdd extends Component{
  constructor(props){
    super(props);
    this.state={
      saving:false,
      companies:[],
      statuses:[],
      title:'',
      company:null,
      status:null,
      IPlist: [],
      backupTasks:[],
    }
    this.setData.bind(this);
    this.getData.bind(this);
    this.getData();
  }

  getData(){
    Promise.all([
      database.collection('cmdb-statuses').get(),
      database.collection('companies').get(),
    ])
    .then(([statuses,companies])=>{
      this.setData(toSelArr(snapshotToArray(statuses)),toSelArr(snapshotToArray(companies)));
    });
  }

  setData(statuses,companies){
    this.setState({
      statuses,
      companies
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
            label={`Názov`}
            addLabel="Add"
            />

        <Button color="secondary" onClick={this.props.history.goBack}>Cancel</Button>

        <Button color="primary" disabled={this.state.company===null || this.state.status===null} onClick={()=>{
            this.setState({saving:true});
            let body = {
              title:this.state.title,
              company:this.state.company.id,
              status:this.state.status.id,
              IP:this.state.IPlist.map((item)=>item.IP)
            };
            rebase.addToCollection('/cmdb-items', body)
              .then((response)=>{
                this.state.IPlist.forEach((item)=>{
                  delete item['id'];
                  delete item['fake'];
                  rebase.addToCollection('/cmdb-item-IPList',{...item, itemID:response.id});
                });

                this.state.backupTasks.forEach((item)=>{
                  rebase.addToCollection('/cmdb-item-backups',{text:item.text.replace(/\n$/, ""), textLeft:item.textLeft.replace(/\n$/, ""), itemID:response.id});
                });
                  this.setState({
                  title:'',
                  company:null,
                  status:null,
                  IPlist:[],
                  backupTasks:[],
                  saving:false});
                  this.props.history.goBack();
              });
          }}>{this.state.saving?'Adding...':'Add item'}</Button>
        </div>
      </div>
    );
  }
}
