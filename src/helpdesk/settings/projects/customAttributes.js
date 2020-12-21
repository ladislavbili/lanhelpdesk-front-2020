import React from 'react';
import Select, {
  Creatable
} from 'react-select';
import {
  selectStyle,
} from 'configs/components/select';
import {
  Modal,
  ModalBody,
  ModalHeader,
  FormGroup,
  Label,
  Button
} from 'reactstrap';
import {
  filterUnique
} from 'helperFunctions';
import Checkbox from 'components/checkbox';

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
  const [ order, setOrder ] = React.useState( 0 );
  const [ title, setTitle ] = React.useState( "" );
  const [ type, setType ] = React.useState( null );
  const [ options, setOptions ] = React.useState( null );
  const [ allOptions, setAllOptions ] = React.useState( [] );
  const [ read, setRead ] = React.useState( [] );
  const [ write, setWrite ] = React.useState( [] );
  const [ defaultValue, setDefaultValue ] = React.useState( null );
  const [ required, setRequired ] = React.useState( false );

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
            <th className="t-a-c"></th>
          </tr>
        </thead>

        <tbody>
          { customAttributes.map( customAttribute =>
            <tr key={customAttribute.id}>
              <td> {customAttribute.order} </td>
              <td> {customAttribute.title} </td>
              <td> {customAttribute.type.title} </td>
              <td> {customAttribute.options.map((option) => (<p id={option.id}>{option.title}</p>))} </td>
              <td> {customAttribute.read.map((read) => (<p id={read.id}>{read.fullName}</p>))} </td>
              <td> {customAttribute.write.map((write) => (<p id={write.id}>{write.fullName}</p>))} </td>
              <td> {customAttribute.defaultValue} </td>
              <td> {customAttribute.required ? 'Yes' : 'No'} </td>
                <td>
                  <button className="btn btn-link waves-effect" disabled={disabled} onClick={()=>{
                      if(window.confirm('Are you sure?')){
                        deleteCustomAttribute(customAttribute.id);
                      }
                    }}>
                    <i className="fa fa-times"  />
                    </button>
                </td>
            </tr>
          )}
          <tr>
            <td colSpan={8}>
              <button className="btn waves-effect"
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
      <Modal isOpen={addCustomAttributeOpen}>
        <ModalHeader>
          Create new task
        </ModalHeader>
				<ModalBody>
          <FormGroup>
            <Label>Type</Label>
            <Select
              styles={selectStyle}
              options={types}
              value={type}
              onChange={type => {
                switch (type.value) {
                  case 'text':{
                  }
                  case 'textarea':{
                    setOptions(null);
                    setAllOptions([]);
                    setDefaultValue('');
                    break;
                  }
                  case 'integer':{
                  }
                  case 'decimal':{
                    setOptions(null);
                    setAllOptions([]);
                    setDefaultValue(0);
                    break;
                  }
                  case 'select':{
                    setOptions([]);
                    setAllOptions([]);
                    setDefaultValue(null);
                    break;
                  }
                  case 'multiselect':{
                    setOptions([]);
                    setAllOptions([]);
                    setDefaultValue([]);
                    break;
                  }
                  default:{
                    break;
                  }
                }
                setType(type);
              }}
              />
          </FormGroup>
          { options !== null &&
          <FormGroup>
            <Label>Options</Label>
              <Creatable
              isMulti
              value={options}
              onChange={(newOptions) => {
                setOptions(newOptions);
                setAllOptions(filterUnique([...allOptions, ...newOptions],'label'));
              }}
              options={allOptions ? allOptions: []}
              styles={selectStyle}
              />
          </FormGroup>
          }
          { options !== null &&
            <FormGroup>
              <Label>Default option</Label>
            <Select
              styles={selectStyle}
              options={options}
              value={defaultValue}
              onChange={ (newDefault) => {
                setDefaultValue(newDefault);
              }}
              />
          </FormGroup>
          }
          <div className="row">
            <Button className="btn waves-effect" onClick={() => setAddCustomAttributeOpen(false)}> Cancel </Button>

            <Button className="btn ml-auto"
              disabled={false}
              onClick={() => addCustomAttribute()}
              >
              Add custom attribute
            </Button>
          </div>
				</ModalBody>
			</Modal>
    </div>
  );
}