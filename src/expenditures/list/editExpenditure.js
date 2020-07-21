import React, { Component } from 'react';
import {rebase,database} from '../../index';
import { Button,  FormGroup, Label, Input } from 'reactstrap';
import {toSelArr,snapshotToArray} from '../../helperFunctions';
import Select from 'react-select';
import {selectStyle} from 'configs/components/select';

const REPEAT = [
  {label: "Nie", value: 1},
  {label: "Denne", value: 2},
  {label: "Týždenne", value: 3},
  {label: "Mesačne", value: 4},
  {label: "Ročne", value: 5}
];

export default class EditFolder extends Component{
  constructor(props){
    super(props);
    this.state={
      folders:[],
      saving:false,

      item:null,
      title: "",
      folder:null,
      price: 0.00,
      repeat: "",
      startDate: "",
      note:'',
    }
    this.fetch.bind(this);
    this.fetch(this.props.match.params.expID);
  }

  fetch(id){
    Promise.all([
      rebase.get('expenditures-instances/'+id, {
        context: this,
        withIds:true,
      }),
      database.collection('expenditures-folders').get()
    ])
    .then(([instance,content])=>{
        let arr = toSelArr(snapshotToArray(content));
        let folders = arr.map(f => {
        let newF = {...f};
        newF["value"] = f.id;
        newF["label"] = f.title;
        return newF;
      });
      this.setState({
        item: instance,
        title:  instance.title,
        folder: folders.filter(f => f.id === instance.folder)[0],
        price:  instance.price,
        repeat:  REPEAT.filter(r => r.label === instance.repeat)[0],
  			startDate: instance.startDate!==null?new Date(instance.startDate).toISOString().replace('Z',''):'',
        note: instance.note,
        folders
      });
    });
  }

  componentWillReceiveProps(props){
    if(this.props.match.params.expID!==props.match.params.expID){
      this.fetch(props.match.params.expID);
    }
  }



  render(){
    return (
      <div className="flex">
				<div className="commandbar p-2">
					<div className="d-flex flex-row align-items-center p-l-18">
          </div>
				</div>

        <div className={"card-box scrollable fit-with-header-and-commandbar p-t-15 "  + (!this.props.columns ? " center-ver w-50" : "")}>
            <FormGroup>
              <Label>Názov</Label>
              <Input className="form-control" type="text" placeholder="zadajte názov" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
            </FormGroup>

          <FormGroup>
            <Label>Folder</Label>
            <Select
              styles={selectStyle}
              options={this.state.folders}
              value={this.state.folder}
              onChange={e =>{ this.setState({ folder: e }); }}
                />
          </FormGroup>
          <FormGroup>
            <Label>Suma</Label>
            <Input className="form-control" type="number" placeholder="0.00" required name="price" min="0" step="0.01" title="Currency" pattern="^\d+(?:\.\d{1,2})?$" value={this.state.price} onChange={(e)=> this.setState({price: e.target.value})} />
          </FormGroup>

          <FormGroup>
            <Label>Opakovanie</Label>
              <Select
                styles={selectStyle}
                options={REPEAT}
                value={this.state.repeat}
                onChange={e =>{ this.setState({ repeat: e }); }}
                  />
          </FormGroup>

          <FormGroup>
            <Label>Začiatočný dátum</Label>
            <Input className="form-control" type="datetime-local" placeholder="Expiration date" value={this.state.startDate} onChange={(e)=>this.setState({startDate:e.target.value})} />
          </FormGroup>

          <FormGroup>
            <Label>Note</Label>
            <Input className="form-control" type="textarea" placeholder="Leave a note here" value={this.state.note} onChange={(e)=>this.setState({note:e.target.value})} />
          </FormGroup>

        <Button className="btn-link" onClick={this.props.history.goBack}>Cancel</Button>
{"    "}
        <Button className="btn" disabled={this.state.saving||this.state.loading||this.state.title===""||this.state.folder===null} onClick={()=>{
            this.setState({saving:true});
            let body = {
              title: this.state.title,
              folder: this.state.folder.id,
              repeat:this.state.repeat.label,
              price: this.state.price,
              startDate: isNaN(new Date(this.state.startDate).getTime()) ? null : (new Date(this.state.startDate).getTime()),
              note: this.state.note,
            };
            rebase.updateDoc('expenditures-instances/'+this.props.match.params.expID, body)
              .then((response)=>{
                this.setState({saving:false});
                if(this.state.folder.id!==this.state.item.folder){
                  this.props.history.push('/expenditures/i/'+this.state.folder.id+'/'+this.state.item.id);
                }
              });
          }}>{this.state.saving?'Saving...':'Save'}</Button>
      </div>
      </div>
    );
  }
}
