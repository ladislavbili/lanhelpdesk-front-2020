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
    <div className="scrollable edit">
      <div className="fit-with-header-and-commandbar contents">

        <div className="row">
          <h2 className="flex center-hor">
            {`${item.id}: `}
            <input type="text" className="title-edit" placeholder="Enter name" value={item.title} onChange={(e)=>{}} />
          </h2>
          <div className="item-creation-info">
            <span> Created by <span className="bolder"> Natalia Tyulina </span> at <span className="bolder"> 22:00 16.6.2019 </span></span>
            <span> Edit by <span className="bolder"> Natalia Tyulina </span> at <span className="bolder"> 22:00 16.6.2019 </span></span>
            <span> Status changed by <span className="bolder"> Natalia Tyulina </span> at <span className="bolder"> 22:00 16.6.2019 </span></span>
          </div>
        </div>

        <hr />

        <AttributesHandler
          attributes={item.attributes}
          values={[]}
          setValue={(id, val)=>{}}
          />

        <FormGroup className="row m-t-10">
          <div className="description">
            <label>Description</label>
            <div className="">
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
          </div>
          <div className = "description-yellow" >
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit.Aenean et est a dui semper facilisis.Pellentesque placerat elit a nunc.Nullam tortor odio, rutrum quis, egestas ut, posuere sed, felis.Vestibulum placerat feugiat nisl.Suspendisse lacinia, odio non feugiat vestibulum, sem erat blandit metus, ac nonummy magna odio pharetra felis.
          </div>
        </FormGroup>

        <IPList items={item.ips} onChange={(items)=>{}} />

        <Passwords items={item.passwords} onChange={(items)=>{}} />

        <div className="row m-b-20">
          <div className="description">
            <Label>Backup tasks description</Label>
            <InteractiveTasksDescription
              item={item.backupTasksDescription}
              onChange={(item)=>{}}
              width={300}
              />
          </div>
          <div className="description-yellow">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean et est a dui semper facilisis.
          </div>
        </div>

        <div className="row">
          <div className="description">
            <Label>Monitoring tasks description</Label>
            <InteractiveTasksDescription
              item={item.monitoringTasksDescription}
              onChange={(item)=>{}}
              width={300}
              />
          </div>
          <div className="description-yellow">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean et est a dui semper facilisis.
          </div>
        </div>

      </div>
    </div>
  );
}