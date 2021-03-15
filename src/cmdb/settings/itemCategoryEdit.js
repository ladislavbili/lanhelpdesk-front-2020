import React from 'react';
import {
  Button,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import {
  calculateTextAreaHeight,
  snapshotToArray
} from '../../helperFunctions';
import InputSelectList from '../components/inputSelectList';
import InteractiveTasksDescription from '../components/interactiveDescription';

const inputSelectOptions = [ {
  id: 'input',
  title: 'Input',
  value: 'input',
  label: 'Input'
}, {
  id: 'select',
  title: 'Select',
  value: 'select',
  label: 'Select'
}, {
  id: 'textarea',
  title: 'Text Area',
  value: 'textarea',
  label: 'Text Area'
} ];

export default function SidebarItemEdit( props ) {

  const [ saving, setSaving ] = React.useState( false );
  const [ loading, setLoading ] = React.useState( false );

  const [ title, setTitle ] = React.useState( '' );
  const [ descriptionNote, setDescriptionNote ] = React.useState( "" );
  const [ backupNote, setBackupNote ] = React.useState( "" );
  const [ monitoringNote, setMonitoringNote ] = React.useState( "" );
  const [ newAttributeID, setNewAttributeID ] = React.useState( 0 );
  const [ attributes, setAttributes ] = React.useState( [] );


  const deleteItem = () => {
    if ( window.confirm( "Are you sure?" ) ) {}
  }

  const removeAttribute = ( id ) => {
    let newAttributes = [ ...attributes ];
    let attribute = newAttributes.find( ( item ) => item.id === id );
    newAttributes = newAttributes.map( ( item ) => {
      return {
        ...item,
        order: item.order > attribute.order ? item.order - 1 : item.order
      }
    } );
    newAttributes.splice( newAttributes.findIndex( ( item ) => item.id === id ), 1 );
    setAttributes( newAttributes );
  }

  return (
    <div className="card-box fit-with-header p-t-15" style={{maxWidth:1000}}>
          <h1> Edit item category</h1>
          <FormGroup>
            <Label for="name">Item name</Label>
            <Input
              type="text"
              name="name"
              id="name"
              placeholder="Enter item name"
              value={title}
              onChange={(e)=>{
                setTitle(e.target.value);
              }}
              />
          </FormGroup>

          {
            false &&
            <FormGroup>
              <Label for="name">Custom attributes</Label>
              <InputSelectList
                items={attributes}
                onChange={(items)=>setAttributes(items)}
                removeItem={removeAttribute}
                width={300}
                newID={newAttributeID}
                increaseID={()=>setNewAttributeID(newAttributeID+1)}
                options={inputSelectOptions}
                addLabel="Add"
                />
            </FormGroup>
          }

          <div className="m-t-20 col-lg-12">
            <Label>Description note</Label>
            <div className="flex p-r-15">
              <InteractiveTasksDescription
                item={descriptionNote}
                onChange={(item)=>{}}
                width={300}
                />
            </div>
          </div>

          <div className="m-t-20 col-lg-12">
            <Label>Backup note</Label>
            <div className="flex p-r-15">
              <InteractiveTasksDescription
                item={backupNote}
                onChange={(item)=>{}}
                width={300}
                />
            </div>
          </div>

          <div className="m-t-20 col-lg-12">
            <Label>Monitoring note</Label>
            <div className="flex p-r-15">
              <InteractiveTasksDescription
                item={monitoringNote}
                onChange={(item)=>{}}
                width={300}
                />
            </div>
          </div>

          <div className="row m-t-20">
            <button
              type="button"
              className="center-hor btn-link-cancel btn-distance"
              onClick={() =>{}}
              >
              Cancel
            </button>
            <Button className="btn-red"  disabled={saving} onClick={deleteItem}>Delete</Button>
            <button
              type="button"
              className="ml-auto center-hor btn"
              disabled={saving}
              onClick={() =>{}}
              >
              {saving?'Saving...':'Save'}
            </button>
          </div>
    </div>
  );
}