import React, { Component } from 'react';
import { FormGroup, Label } from 'reactstrap';

export default class ViewPassword extends Component{

  render(){
    const {title, folder, URL, login, expire, note} = this.props.password;
    let folderLabel = folder ? folder.label : "";

    return (
      <div className={"card-box scrollable fit-with-header-and-commandbar p-t-15 "  + (!this.props.columns ? " center-ver w-30" : "")}>

        <FormGroup className="row">
          <Label className="w-30" >Password name</Label>
          <div>{title}</div>
        </FormGroup>

        <FormGroup className="row">
          <Label className="w-30" >Folder </Label>
          <div>{folderLabel}</div>
        </FormGroup>

        <FormGroup className="row">
          <Label className="w-30" >URL </Label>
          <div>{URL}</div>
        </FormGroup>

        <FormGroup className="row">
          <Label className="w-30" >Login </Label>
          <div>{login}</div>
        </FormGroup>

        <FormGroup className="row">
          <Label className="w-30" >Password expire </Label>
          <div>{expire ? expire.replace("T", " ") : "No expire date"}</div>
        </FormGroup>

        <FormGroup>
          <Label className="w-30" >Note</Label>
          <div>{ note ? this.state.note : "No note"} </div>
        </FormGroup>

      </div>
    );
  }
}
