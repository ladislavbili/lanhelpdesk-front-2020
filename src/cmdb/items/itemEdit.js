import React from 'react';
import {
  FormGroup,
  Label,
  Input,
  Nav,
  NavItem,
  NavLink
} from 'reactstrap';
import Select from 'react-select';
import CKEditor from 'ckeditor4-react';
import classnames from "classnames";
import {
  selectStyle
} from "configs/components/select";
import AttributesHandler from './attributesHandler';
import IPList from './ipList';
import Passwords from './passwords';
import InteractiveTasksDescription from '../components/interactiveDescription';

import {
  exampleItem as item
} from '../constants';

export default function ItemEdit( props ) {

  const deleteItem = () => {
    if ( window.confirm( 'Are you sure?' ) ) {}
  }

  const submit = () => {}

  const removeBackupTask = ( id ) => {}

  return (
    <div className="card-box fit-with-header-and-commandbar scrollable p-t-15">

      <div className="row m-b-10">
        <h2 className="center-hor flex cmdb-title-edit m-r-10">
          <Input type="text" placeholder="Enter name" value={item.title} onChange={(e)=>{}} />
        </h2>
        <div className="ml-auto cmdb-info">
          <div> <span style={{color: "#7FFFD4"}}>*</span> Created by <span className="cmdb-info-name">Natalia Tyulina</span> at 22:00 16.6.2019 <span style={{color: "#7FFFD4"}}>*</span></div>
          <div><span style={{color: "#7FFFD4"}}>*</span> Edit by <span className="cmdb-info-name">Natalia Tyulina</span> at 22:00 16.6.2019 <span style={{color: "#7FFFD4"}}>*</span></div>
          <div><span style={{color: "#7FFFD4"}}>*</span> Status changed by <span className="cmdb-info-name">Natalia Tyulina</span> at 22:00 16.6.2019 <span style={{color: "#7FFFD4"}}>*</span></div>
        </div>
      </div>

      <AttributesHandler
        attributes={item.attributes}
        values={[]}
        setValue={(id, val)=>{}}
        />


      <FormGroup className = "col-lg-12  m-t-20" >
        <Label className="m-0" style={{height: "30px"}}>Description</Label>
        <div className = "row" >
          <div className="flex p-r-15">
            <CKEditor
              data={null}
              onChange={(e)=>{/*this.setState({description:e.editor.getData()})*/}}
              config={ {
                codeSnippet_languages: {
                  javascript: 'JavaScript',
                  php: 'PHP'
                }
              } }
              />
          </div>
          <div className = "cmdb-yellow" >
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit.Aenean et est a dui semper facilisis.Pellentesque placerat elit a nunc.Nullam tortor odio, rutrum quis, egestas ut, posuere sed, felis.Vestibulum placerat feugiat nisl.Suspendisse lacinia, odio non feugiat vestibulum, sem erat blandit metus, ac nonummy magna odio pharetra felis.
          </div>
        </div>
      </FormGroup>

      <div className="m-t-20 col-lg-12">
        <IPList items={item.ips} onChange={(items)=>{}} />
      </div>

      <div className="m-t-20 col-lg-12">
        <Passwords items={item.passwords} onChange={(items)=>{}} />
      </div>

      <div className="m-t-20 col-lg-12">
        <Label>Backup tasks description</Label>
        <div className="row">
          <div className="flex p-r-15">
            <InteractiveTasksDescription
              item={item.backupTasksDescription}
              onChange={(item)=>{}}
              width={300}
              />
          </div>
          <div className="cmdb-yellow">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean et est a dui semper facilisis.
          </div>
        </div>
      </div>

      <div className="m-t-20 col-lg-12">
        <Label>Monitoring tasks description</Label>
        <div className="row">
          <div className="flex p-r-15">
            <InteractiveTasksDescription
              item={item.monitoringTasksDescription}
              onChange={(item)=>{}}
              width={300}
              />
          </div>
          <div className="cmdb-yellow">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean et est a dui semper facilisis.
          </div>
        </div>
      </div>

    </div>
  );
}