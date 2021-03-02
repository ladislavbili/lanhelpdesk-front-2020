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
  GET_BASIC_ROLES,
} from 'helpdesk/settings/roles/queries';

import Checkbox from 'components/checkbox';

export default function CustomAttributes( props ) {
  const {
    open,
    updateCustomAttribute,
    attribute,
    closeModal
  } = props;

  const [ order, setOrder ] = React.useState( 0 );
  const [ title, setTitle ] = React.useState( "" );
  const [ options, setOptions ] = React.useState( null );
  const [ allOptions, setAllOptions ] = React.useState( [] );
  const [ read, setRead ] = React.useState( [] );
  const [ write, setWrite ] = React.useState( [] );
  const [ defaultValue, setDefaultValue ] = React.useState( null );
  const [ required, setRequired ] = React.useState( false );

  const {
    data: rolesData,
    loading: rolesLoading
  } = useQuery( GET_BASIC_ROLES );

  // sync
  React.useEffect( () => {
    if ( attribute !== null ) {
      setOrder( attribute.order );
      setTitle( attribute.title );
      setOptions( attribute.options );
      setAllOptions( attribute.allOptions );
      setRead( attribute.read );
      setWrite( attribute.write );
      setDefaultValue( attribute.defaultValue );
      setRequired( attribute.required );
    }
  }, [ attribute ] );

  const cantSave = (
    isNaN( parseInt( order ) ) ||
    title.length === 0 ||
    ( options !== null && options.length < 2 ) ||
    read.length === 0
  )

  if ( rolesLoading ) {
    return null;
  }

  return (
    <Modal isOpen={open}>
      <ModalHeader>
        Edit custom attribute
      </ModalHeader>
      <ModalBody>
        <FormGroup>
          <Label>Type: </Label>
          <span className="m-l-5">
          {attribute !== null ? attribute.type.label : ""}
        </span>
        </FormGroup>

        <FormGroup>
          <Label>Title</Label>
          <input
            className="form-control"
            value={title}
            onChange={e => setTitle(e.target.value)}
            />
        </FormGroup>
        <FormGroup>
          <Label>Order</Label>
          <input
            className="form-control"
            type="number"
            value={order}
            onChange={e => setOrder(e.target.value)}
            />
        </FormGroup>
        <Checkbox
          className="m-t-5"
          label="Required"
          value={  required }
          onChange={ () => setRequired(!required) }
          />
        <FormGroup>
          <Label>Default value</Label>
          <Input
            className="form-control"
            value={defaultValue}
            type={
              ['decimal','integer'].includes((attribute ? attribute.type.value : '')) ?
              'number' :
              (
                (attribute ? attribute.type.value : '') === 'textarea' ? 'textarea' : 'text'
              )
            }
            onChange={e => setDefaultValue(e.target.value)}
            />
        </FormGroup>
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
      <FormGroup>
        <Label>Right to read</Label>
        <Select
          styles={selectStyle}
          options={toSelArr(rolesData.basicRoles)}
          value={read}
          isMulti
          onChange={ (readRights) => {
            setRead(readRights);
            setWrite(write.filter((writeRight) => readRights.some((readRight) => readRight.id === writeRight.id ) ))
          }}
          />
      </FormGroup>
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
        <button className="btn-link-cancel" onClick={() => closeModal()}> Cancel </button>

        <button className="btn ml-auto"
          disabled={cantSave}
          onClick={() =>{
            updateCustomAttribute({
              id: attribute.id,
              order,
              title,
              options,
              read,
              write,
              defaultValue,
              required,
            });
            setOrder(0);
            setTitle("");
            setOptions(null);
            setAllOptions([]);
            setRead([]);
            setWrite([]);
            setDefaultValue(null);
            setRequired(false);
            closeModal();
          }}
          >
          Save custom attribute
        </button>
      </div>
    </ModalBody>
  </Modal>
  );
}