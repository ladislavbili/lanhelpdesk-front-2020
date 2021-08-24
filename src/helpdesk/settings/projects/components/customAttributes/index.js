import React from 'react';
import {
  Modal,
  ModalBody,
  ModalHeader,
  FormGroup,
  Label,
  Input
} from 'reactstrap';
import {
  filterUnique
} from 'helperFunctions';
import Checkbox from 'components/checkbox';
import AddCustomAttributeModal from './addCustomAttribute';
import EditCustomAttributeModal from './editCustomAttribute';

const types = [
  {
    label: 'Text',
    value: 'text'
  },
  {
    label: 'Textarea',
    value: 'textarea'
  },
  {
    label: 'Number - whole',
    value: 'integer'
  },
  {
    label: 'Number - decimal',
    value: 'decimal'
  },
  {
    label: 'Select - single',
    value: 'select'
  },
  {
    label: 'Select - multi',
    value: 'multiselect'
  }
]

export default function CustomAttributes( props ) {
  const {
    disabled,
    customAttributes,
    addCustomAttribute,
    updateCustomAttribute,
    deleteCustomAttribute,
  } = props;


  const [ addCustomAttributeOpen, setAddCustomAttributeOpen ] = React.useState( false );
  const [ editCustomAttributeOpen, setEditCustomAttributeOpen ] = React.useState( null );

  return (
    <div>
      <h3 className="m-t-20"> Custom Attributes</h3>
      <table className="table m-t-10 vykazyTable">
        <thead>
          <tr>
            <th> Order </th>
            <th> Title </th>
            <th> Type </th>
            <th> Options </th>
            <th> Read </th>
            <th> Write </th>
            <th> Default value </th>
            <th> Required </th>
            <th className="text-center"></th>
          </tr>
        </thead>
        <tbody>
          { customAttributes.map( customAttribute =>
            <tr key={customAttribute.id}>
              <td> {customAttribute.order} </td>
              <td> {customAttribute.title} </td>
              <td> {customAttribute.type.label} </td>
              <td> {customAttribute.options ? customAttribute.options.map((option) => (<p id={option.id}>{option.title}</p>)) : '' } </td>
              <td> {customAttribute.read.map((read) => (<p id={read.id}>{read.title}</p>))} </td>
              <td> {customAttribute.write.map((write) => (<p id={write.id}>{write.title}</p>))} </td>
              <td> {customAttribute.defaultValue} </td>
              <td> {customAttribute.required ? 'Yes' : 'No'} </td>
              <td>
                <button className="btn-link btn-distance" disabled={disabled} onClick={()=>{
                    if(window.confirm('Are you sure?')){
                      deleteCustomAttribute(customAttribute.id);
                    }
                  }}>
                  <i className="fa fa-times"  />
                </button>
                <button
                  className="btn-link"
                  disabled={disabled}
                  onClick={()=>{
                    setEditCustomAttributeOpen(customAttribute);
                  }}>
                  <i className="fa fa-pen"  />
                </button>
              </td>
            </tr>
          )}
          <tr>
            <td colSpan={8}>
              <button className="btn"
                disabled={disabled}
                onClick={()=>{
                  setAddCustomAttributeOpen(true);
                }}
                >
                <i className="fa fa-plus p-r-5" />
                Custom attribute
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <AddCustomAttributeModal open={addCustomAttributeOpen} addCustomAttribute={addCustomAttribute} closeModal={() => setAddCustomAttributeOpen(false)} />
      <EditCustomAttributeModal
        open={editCustomAttributeOpen !== null}
        updateCustomAttribute={ updateCustomAttribute }
        attribute={ editCustomAttributeOpen }
        closeModal={() => setEditCustomAttributeOpen(null)}
        />
    </div>
  );
}