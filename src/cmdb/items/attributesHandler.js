import React, {
  Component
} from 'react';
import {
  Input,
  Label
} from 'reactstrap';
import Select from 'react-select';
import {
  pickSelectStyle
} from "configs/components/select";

export default function AttributesHandler( props ) {

  const {
    attributes
  } = props;

  const drawAttribute = ( attribute ) => {
    switch ( attribute.type.id ) {
      case 'input': {
        return <Input type="text" value={attribute.value} onChange={(e)=>{}}/>
      }
      case 'textarea': {
        return <Input type="textarea" value={attribute.value} onChange={(e)=>{}}/>
      }
      case 'select': {
        return <Select options={attribute.options}  value={attribute.value} styles={pickSelectStyle()} onChange={(item)=>{}} />
      }
      default:
        return <p>{attribute.type.id} of {attribute.title}</p>
    }
  }

  return (
    <div className="item-attributes">
      {
        attributes.map((attribute, index) =>
        {
          if ( index % 2 === 0 ) {
            return (
              <div className="row">
                <div key={attribute.label} className="entry">
                  <label>{attribute.label}</label>
                  <div className="value-input">
                    {drawAttribute(attribute)}
                  </div>
                </div>
                {
                  index < attributes.length - 1 &&
                  <div key={attributes[index + 1].label} className="entry">
                    <label>{attributes[index + 1].label}</label>
                    <div className="value-input">
                    {drawAttribute(attributes[index + 1])}
                  </div>
                  </div>
                }
              </div>
            )
          }
        }
      )
    }
  </div>
  );
}