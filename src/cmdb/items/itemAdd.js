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
import IPList from './ipList';
import Passwords from './passwords';
import AttributesHandler from './attributesHandler';
import InteractiveTasksDescription from '../components/interactiveDescription';
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
    <div>
      <div className="commandbar flex-row">
        <button type="button" className="center-hor btn-link btn-distance" onClick={() => props.history.goBack()} >
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

      <div className="scrollable edit">
        <div className="fit-with-header-and-commandbar contents" >

          <div className="m-t-15">
            <label>Item name</label>
            <input
              type="text"
              className="title-edit flex"
              style={{width: "100%"}}
              placeholder="Enter name"
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
              />
          </div>

          <AttributesHandler
            attributes={[]}
            values={[]}
            setValue={(id, val)=>{}}
            />

          <FormGroup className="row">
            <div className="description">
              <label>Description</label>
              <div className="flex p-r-15">
                <input
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
            </div>
            <div className = "description-yellow" >
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit.Aenean et est a dui semper facilisis.Pellentesque placerat elit a nunc.Nullam tortor odio, rutrum quis, egestas ut, posuere sed, felis.Vestibulum placerat feugiat nisl.Suspendisse lacinia, odio non feugiat vestibulum, sem erat blandit metus, ac nonummy magna odio pharetra felis.
            </div>
          </FormGroup>

          <IPList items={[]} onChange={(items)=>{}} />

          <Passwords items={[]} onChange={(items)=>{}} />

          <div className="row m-t-10">
            <div className="description">
              <Label>Backup tasks description</Label>
              <div className="">
                <InteractiveTasksDescription
                  item={backupTasksDescription}
                  onChange={(item)=>{}}
                  width={300}
                  />
              </div>
            </div>
            <div className="description-yellow">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean et est a dui semper facilisis.
            </div>
          </div>

          <div className="row m-t-10">
            <div className="description">
              <Label>Monitoring tasks description</Label>
              <InteractiveTasksDescription
                item={monitoringTasksDescription}
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
    </div>
  );
}