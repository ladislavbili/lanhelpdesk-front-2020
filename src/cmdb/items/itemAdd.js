import React from 'react';
import {
  Button,
  FormGroup,
  Label,
  Input,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from 'reactstrap';
import {
  toSelArr,
  snapshotToArray,
  getAttributeDefaultValue,
  htmlFixNewLines
} from '../../helperFunctions';
import Select from 'react-select';
import {
  selectStyle
} from "configs/components/select";
import IPList from './ipList';
import Passwords from './passwords';
import AttributesHandler from './attributesHandler';
import InteractiveTasksDescription from '../components/interactiveDescription';
import CKEditor from 'ckeditor4-react';
import classnames from "classnames";

export default function ItemAdd( props ) {

  const {
    match
  } = props;

  const itemCategoryID = match.params.itemCategoryID;

  const [ saving, setSaving ] = React.useState( false );
  const [ loading, setLoading ] = React.useState( true );

  const [ title, setTitle ] = React.useState( '' );
  const [ description, setDescription ] = React.useState( '' );
  const [ IPs, setIPs ] = React.useState( [] );
  const [ passwords, setPasswords ] = React.useState( [] );
  const [ backupTasksDescription, setBackupTasksDescription ] = React.useState( {} );
  const [ monitoringTasksDescription, setMonitoringTasksDescription ] = React.useState( {} );
  const [ attributes, setAttributes ] = React.useState( {} );

  const removePassword = ( id ) => {
    setPasswords( passwords.filter( ( item ) => item.id !== id ) );
  }

  return (
    <div className="fit-with-header">
      <div className="commandbar flex-row">

        <button type="button" className="center-hor btn-link btn-distance" onClick={() =>{}}>
          <i
            className="fas fa-arrow-left"
            />
          Cancel
        </button>
        <button type="button" className="center-hor btn-link btn-distance" onClick={() =>{}}>
          <i
            className="fas fa-save"
            />
          {saving?'Adding...':'Add item'}
        </button>
      </div>

      <div className="card-box fit-with-header-and-commandbar p-t-15 scrollable" >
        <div className="row m-b-10">
          <h2 className="center-hor flex cmdb-title-edit m-r-10">
            <Input
              type="text"
              placeholder="Enter name"
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
              />
          </h2>
        </div>

        <AttributesHandler
          attributes={[]}
          values={[]}
          setValue={(id, val)=>{}}
          />

        <FormGroup className = "col-lg-12  m-t-20" >
          <Label className="m-0" style={{height: "30px"}}>Description</Label>
          <div className = "row" >
            <div className="flex p-r-15">
              <CKEditor
                data={null}
                onChange={(e)=>{}}
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
          <IPList items={[]} onChange={(items)=>{}} />
        </div>

        <div className="m-t-20 col-lg-12">
          <Passwords items={[]} onChange={(items)=>{}} />
        </div>

        <div className="m-t-20 col-lg-12">
          <Label>Backup tasks description</Label>
          <div className="row">
            <div className="flex p-r-15">
              <InteractiveTasksDescription
                item={backupTasksDescription}
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
                item={monitoringTasksDescription}
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
    </div>
  );
}