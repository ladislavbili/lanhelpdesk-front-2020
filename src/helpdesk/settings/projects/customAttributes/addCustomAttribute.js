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
  Button,
  Input
} from 'reactstrap';
import {
  useQuery,
} from "@apollo/client";
import {
  filterUnique,
  toSelArr
} from 'helperFunctions';

import {
  GET_ROLES,
} from '../../roles/querries';

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
    open,
    closeModal,
    addCustomAttribute,
  } = props;

  const [ order, setOrder ] = React.useState( 0 );
  const [ title, setTitle ] = React.useState( "" );
  const [ type, setType ] = React.useState( null );
  const [ options, setOptions ] = React.useState( null );
  const [ allOptions, setAllOptions ] = React.useState( [] );
  const [ read, setRead ] = React.useState( [] );
  const [ write, setWrite ] = React.useState( [] );
  const [ defaultValue, setDefaultValue ] = React.useState( null );
  const [ required, setRequired ] = React.useState( false );

  const {
    data: rolesData,
    loading: rolesLoading
  } = useQuery( GET_ROLES );

  const cantSave = (
    isNaN( parseInt( order ) ) ||
    title.length === 0 ||
    type === null ||
    ( options !== null && options.length < 2 ) ||
    read.length === 0
  )

  if ( rolesLoading ) {
    return null;
  }

  return (
    <Modal isOpen={open}>
      <ModalHeader>
        Create new custom attribute
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

        { type !== null &&
          <FormGroup>
            <Label>Title</Label>
            <input
              className="form-control"
              value={title}
              onChange={e => setTitle(e.target.value)}
              />
          </FormGroup>
        }
        { type !== null &&
          <FormGroup>
            <Label>Order</Label>
            <input
              className="form-control"
              type="number"
              value={order}
              onChange={e => setOrder(e.target.value)}
              />
          </FormGroup>
        }
        { type !== null &&
          <Checkbox
            className="m-t-5"
            label="Required"
            value={  required }
            onChange={ () => setRequired(!required) }
            />
        }
        { options === null && type !== null &&
          <FormGroup>
            <Label>Default value</Label>
            <Input
              className="form-control"
              value={defaultValue}
              type={
                ['decimal','integer'].includes(type.value) ? 'number' : (
                  type.value === 'textarea' ? 'textarea' : 'text'
                )
              }
              onChange={e => setDefaultValue(e.target.value)}
              />
          </FormGroup>
        }
        { options !== null &&
          <FormGroup>
            <Label>Options</Label>
            <Creatable
              isMulti
              value={options}
              onChange={(newOptions) => {
                if(defaultValue !== null && !newOptions.some((option) => option.value === defaultValue.value )){
                  setDefaultValue(null);
                }
                setOptions(newOptions);
                setAllOptions(filterUnique([...allOptions, ...newOptions],'label'));
              }}
              options={allOptions ? allOptions: []}
              styles={selectStyle}
              />
          </FormGroup>
        }
        { type !== null &&
          <FormGroup>
            <Label>Right to read</Label>
            <Select
              styles={selectStyle}
              options={toSelArr(rolesData.roles)}
              value={read}
              isMulti
              onChange={ (readRights) => {
                setRead(readRights);
                setWrite(write.filter((writeRight) => readRights.some((readRight) => readRight.id === writeRight.id ) ))
              }}
              />
          </FormGroup>
        }
        { type !== null &&
          <FormGroup>
            <Label>Right to write</Label>
            <Select
              styles={selectStyle}
              options={read}
              value={write}
              isMulti
              onChange={ (writeRights) => {
                setWrite(writeRights);
              }}
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
          <Button className="btn waves-effect" onClick={() => closeModal()}> Cancel </Button>

          <Button className="btn ml-auto"
            disabled={cantSave}
            onClick={() =>{
              addCustomAttribute({
                order,
                title,
                type,
                options,
                read,
                write,
                defaultValue,
                required,
              });
              setOrder(0);
              setTitle("");
              setType(null);
              setOptions(null);
              setAllOptions([]);
              setRead([]);
              setWrite([]);
              setDefaultValue(null);
              setRequired(false);
              closeModal();
            }}
            >
            Add custom attribute
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
}