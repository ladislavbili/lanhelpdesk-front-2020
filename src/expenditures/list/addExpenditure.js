import React, { Component } from 'react';
import {rebase} from '../../index';
import { Button,  FormGroup, Label, Input } from 'reactstrap';
import Select from 'react-select';
import {selectStyle} from "configs/components/select";

const REPEAT = [
  {label: "Nie", value: 1},
  {label: "Denne", value: 2},
  {label: "Týždenne", value: 3},
  {label: "Mesačne", value: 4},
  {label: "Ročne", value: 5}
];

export default class AddFolder extends Component{
  constructor(props){
    super(props);
    this.state={
      folders:[],
      saving:false,

      title: "",
      folder:null,
      price: 0.00,
      repeat: "",
      startDate: "",
      startDateDay: "",
      startDateMonth: "",
      startDateYear: "",
      note:'',
    }
  }

  componentWillMount(){
    this.ref1 = rebase.listenToCollection('/expenditures-folders', {
      context: this,
      withIds: true,
      then:content=>{
        let folders = content.map(f => {
          let newF = {...f};
          newF["value"] = f.id;
          newF["label"] = f.title;
          return newF;
        });
        let folder = folders.filter(f => f.id === this.props.match.params.id)[0];
        this.setState({
          folders, folder
        });
      },
    });
  }

  componentWillUnmount(){
    rebase.removeBinding(this.ref1);
  }

  render(){
    return (
      <div className="flex">
				<div className="commandbar p-2">
					<div className="d-flex flex-row align-items-center p-l-18">
          </div>
				</div>

        <div className="ml-auto mr-auto card-box fit-with-header p-t-15 w-50">
            <FormGroup>
              <Label>Názov</Label>
              <Input type="text" className="from-control" placeholder="zadajte názov" value={this.state.title} onChange={(e)=>this.setState({title:e.target.value})} />
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
            <Input type="number" className="from-control" placeholder="0.00" required name="price" min="0" step="0.01" title="Currency" pattern="^\d+(?:\.\d{1,2})?$" value={this.state.price} onChange={(e)=> this.setState({price: e.target.value})} />
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
            <Input type="date" className="from-control" placeholder="Expiration date" value={this.state.startDate} onChange={(e)=>this.setState({startDate:e.target.value})} />
          </FormGroup>

          <FormGroup>
            <Label>Note</Label>
            <Input type="textarea" className="from-control" placeholder="Leave a note here" value={this.state.note} onChange={(e)=>this.setState({note:e.target.value})} />
          </FormGroup>

        <Button className="btn-link" onClick={this.props.history.goBack}>Cancel</Button>
        {"    "}
        <Button className="btn" disabled={this.state.saving||this.state.title===""||this.state.folder===null} onClick={()=>{
            this.setState({saving:true});
            let body = {
              title: this.state.title,
              folder: this.state.folder.id,
              repeat:this.state.repeat.label,
              price:this.state.price,
              startDate: this.state.startDate,
              note:this.state.note,
            };
            rebase.addToCollection('/expenditures-instances', body)
              .then((response)=>{
                this.setState({
                  title: "",
                  folder:null,
                  price: 0,
                  repeat: "",
                  startDate: "",
                  note:'',
                  saving:false});
                  this.props.history.goBack();
              });
          }}>{this.state.saving?'Adding...':'Add'}</Button>
      </div>
      </div>
    );
  }
}
