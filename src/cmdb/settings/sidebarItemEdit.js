import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import {rebase, database} from '../../index';
import { calculateTextAreaHeight, snapshotToArray} from '../../helperFunctions';
import InputSelectList from '../components/inputSelectList';
const inputSelectOptions=[{id:'input',title:'Input',value:'input',label:'Input'},{id:'select',title:'Select',value:'select',label:'Select'},{id:'textarea',title:'Text Area',value:'textarea',label:'Text Area'}];

export default class SidebarItemEdit extends Component{
  constructor(props){
    super(props);
    this.state={
      loading:true,
      saving:false,

      title:'',
      bacupTasksLabel:'',
      backupTasksHeight:31,
      sidebarItems:[],
      attributes:[],
      url:'',
      newAttributeID:0
    }
    this.setData.bind(this);
    this.setData(this.props.match.params.sidebarID);
  }

  componentWillMount(){
    this.ref = rebase.listenToCollection('/cmdb-sidebar', {
      context: this,
      withIds: true,
      then:content=>{this.setState({sidebarItems:content})},
    });
  }

  componentWillUnmount(){
    rebase.removeBinding(this.ref);
  }

  deleteItem(){
    if(window.confirm("Are you sure?")){

      database.collection('cmdb-items').where("sidebarID", "==", this.state.url).get().then((resp)=>{
        snapshotToArray(resp).forEach((item)=>
          Promise.all(
            [
              database.collection('cmdb-IPs').where("itemID", "==", item.id).get(),
              database.collection('cmdb-backups').where("itemID", "==", item.id).get(),
              database.collection('cmdb-passwords').where("itemID", "==", item.id).get(),
          ]).then(([IPs,backups,passwords])=>{
            snapshotToArray(IPs).forEach((item2)=>rebase.removeDoc('/cmdb-IPs/'+item2.id));
            snapshotToArray(backups).forEach((item2)=>rebase.removeDoc('/cmdb-backups/'+item2.id));
            snapshotToArray(passwords).forEach((item2)=>rebase.removeDoc('/cmdb-passwords/'+item2.id));
            rebase.removeDoc('/cmdb-items/'+item.id);
            this.props.history.goBack();
          })
        )
      });
      rebase.removeDoc('/cmdb-sidebar/'+this.props.match.params.sidebarID);
    }
  }

  setData(id){
    let item = this.state.sidebarItems.find((item)=>item.id===id);
    if(item===undefined){
      rebase.get('cmdb-sidebar/'+id, {
        context: this,
      }).then((item)=>{
        this.setState({
          title:item.title,
          bacupTasksLabel:item.bacupTasksLabel,
          backupTasksHeight:item.backupTasksHeight,
          newAttributeID:item.newAttributeID,
          attributes:item.attributes,
          url:item.url
        })
      });
    }else{
      this.setState({
        title:item.title,
        bacupTasksLabel:item.bacupTasksLabel,
        backupTasksHeight:item.backupTasksHeight,
        newAttributeID:item.newAttributeID,
        attributes:item.attributes,
        url:item.url
      })
    }
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.sidebarID!==props.match.params.sidebarID){
      this.setData(props.match.params.sidebarID);
    }
  }


  removeAttribute(id){
    let attributes = [...this.state.attributes];
    let attribute = attributes.find((item)=>item.id===id);
    attributes = attributes.map((item)=>{
      return {...item, order:item.order>attribute.order?item.order-1:item.order}
    });
    attributes.splice(attributes.findIndex((item)=>item.id===id),1);
    this.setState({attributes});
  }

  render(){
    return (
      <div className="scrollable">
        <div className="ml-auto mr-auto card-box fit-with-header p-t-15" style={{maxWidth:1000}}>
        <FormGroup>
          <Label for="name">Item name</Label>
          <Input type="text" name="name" id="name" placeholder="Enter item name" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
        </FormGroup>
        <FormGroup>
          <Label for="backupTasks">Backup tasks label</Label>
          <Input
            type="textarea"
            name="backupTasks"
            id="backupTasks"
            placeholder="Enter backup tasks label"
            style={{height:this.state.backupTasksHeight}}
            value={this.state.bacupTasksLabel}
            onChange={(e)=>{
              this.setState({bacupTasksLabel:e.target.value, backupTasksHeight:calculateTextAreaHeight(e)});
            }}
          />
        </FormGroup>

        <FormGroup>
          <Label for="name">Custom attributes</Label>
        <InputSelectList
          items={this.state.attributes}
          newID={this.state.newAttributeID}
          increaseID={()=>{this.setState({newAttributeID:this.state.newAttributeID+1})}}
          onChange={(items)=>this.setState({attributes:items})}
          removeItem={this.removeAttribute.bind(this)}
          width={300}
          options={inputSelectOptions}
          addLabel="Add"
          />

        </FormGroup>
        <div>

        </div>
        <Button className="btn"  disabled={this.state.saving} onClick={()=>{
            this.setState({saving:true});
            let attributes = [...this.state.attributes].map((att)=>{
              let attribute = {...att};
              return attribute;
            });
            let body = {
              title:this.state.title,
              bacupTasksLabel:this.state.bacupTasksLabel,
              attributes
              }
              rebase.updateDoc('/cmdb-sidebar/'+this.props.match.params.sidebarID, body)
              .then((response)=>{
                this.setState({saving:false})
              });
          }}>{this.state.saving?'Saving...':'Save sidebar item'}</Button>
        <Button className="btn-link"  disabled={this.state.saving} onClick={this.deleteItem.bind(this)}>Delete</Button>
      </div>
    </div>
    );
  }
}
