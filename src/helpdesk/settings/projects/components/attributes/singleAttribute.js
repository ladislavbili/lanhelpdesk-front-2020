import React from 'react';
import Select from 'react-select';
import Checkbox from 'components/checkbox';
import DatePicker from 'components/DatePicker';
import {
  pickSelectStyle
} from 'configs/components/select';
import {
  useTranslation
} from "react-i18next";
import {
  updateArrayItem,
} from 'helperFunctions';

export default function ProjectSingleAttribute( props ) {
  //data
  const {
    label,
    roles,
    right,
    noDef,
    dataType,
    noRequired,
    attribute,
    onChangeAttribute,
    canBeRequired,
    defIsMulti,
    defColored,
    defSelectValues,
    defEmptyValue,
    onChangeDefValues,
    onChangeRight,
  } = props;

  const {
    t
  } = useTranslation();

  const value = noDef ? null : (
    defIsMulti ?
    ( attribute.value.length === 0 && defEmptyValue ? [ defEmptyValue ] : attribute.value ) :
    ( attribute.value === null && defEmptyValue ? defEmptyValue : attribute.value )
  )

  let selectStyle = [ 'noArrow', ];
  if ( defColored ) {
    selectStyle.push( 'colored' );
  }
  if ( !noDef && attribute.fixed && canBeRequired ) {
    selectStyle.push( 'required' );
  } else {
    selectStyle.push( 'invisible' );
  }

  const onChangeRightFunc = ( role, name ) => {
    onChangeRight(
      updateArrayItem(
        roles, {
          ...role,
          attributeRights: {
            ...role.attributeRights,
            [ right ]: {
              ...role.attributeRights[ right ],
              [ name ]: !role.attributeRights[ right ][ name ]
            }
          }
        }
      )
    )
  }

  return (
    <table className="table bkg-white m-t-5 m-b-30">
      <thead>
        <tr>
          <th className="font-bold">{label}</th>
          <th width="100"/>
          <th width="100"/>
          <th width="100"/>
          <th width="100"/>
        </tr>
      </thead>
      <tbody>
        { !noDef &&
          <tr>
            <td>
              {t('defaultValue')}
            </td>
            {dataType === 'date' &&
              <td colSpan="4">
                <DatePicker
                  className="form-control hidden-input bolder"
                  selected={value}
                  isClearable={!attribute.fixed}
                  onChange={ (date) => {
                    if(!date.isValid()){
                      onChangeAttribute({ ...attribute, value: null })
                    }else{
                      onChangeAttribute({ ...attribute, value: date })
                    }
                  }}
                  placeholderText={t('noDefaultDate')}
                  />
              </td>
            }
            { !dataType &&
              <td colSpan="4">
                <Select
                  value={ value }
                  isMulti={ defIsMulti }
                  options={ defEmptyValue && !attribute.fixed ? defSelectValues.concat(defEmptyValue) : defSelectValues }
                  onChange={(e) => {
                    if( defEmptyValue && ( (!defIsMulti && e.id === defEmptyValue.id) || (defIsMulti && attribute.value.length !== 0 && e.some((item) => item.id === defEmptyValue.id ) ) ) ){
                      if( defIsMulti ){
                        onChangeAttribute({ ...attribute, value: [] })
                      }else{
                        onChangeAttribute({ ...attribute, value: null })
                      }
                    }else{
                      if( defIsMulti ){
                        onChangeAttribute({ ...attribute, value: e.filter( (item) => item.value !== null ) })
                      }else{
                        onChangeAttribute({ ...attribute, value: e })
                      }
                    }
                  }}
                  styles={pickSelectStyle( selectStyle )}
                  />
              </td>
            }
          </tr>
        }
        { !noDef &&
          <tr>
            <td colSpan="4">
              <label className="font-normal text-normal clickable noselect" htmlFor={`fixed-${label}`}>
                {t('fixed')}
              </label>
            </td>
            <td>
              <Checkbox
                className="m-t-5"
                centerVer
                id={`fixed-${label}`}
                value={ attribute.fixed }
                onChange={ (e) => onChangeAttribute({ ...attribute, fixed: !attribute.fixed }) }
                />
            </td>
          </tr>
        }
        <tr>
          <td>
            <div>
              <label>{t('projectUserACL')}</label>
            </div>
          </td>
          <td>
            <div>
              <label className="m-l-14">{ noRequired ? '' : t('required') }</label>
            </div>
          </td>
          <td>
            <div>
              <label className="m-l-30">{t('add')}</label>
            </div>
          </td>
          <td>
            <div>
              <label className="m-l-25">{t('view')}</label>
            </div>
          </td>
          <td>
            <div>
              <label className="m-l-30">{t('edit')}</label>
            </div>
          </td>
        </tr>
        { roles.map((role) => (
          <tr key={role.id}>
            <td>
              {t(role.title)}
            </td>
            <td>
              { !noRequired &&
                <Checkbox
                  className="m-t-5"
                  centerVer
                  value={ role.attributeRights[right].required }
                  disabled={ !noDef && attribute.fixed }
                  onChange={ (e) => onChangeRightFunc( role, 'required' ) }
                  />
              }
            </td>
            <td>
              <Checkbox
                className="m-t-5"
                centerVer
                value={ role.attributeRights[right].add }
                disabled={ !noDef && attribute.fixed }
                blocked={ role.attributeRights[right].required }
                onChange={ (e) => onChangeRightFunc( role, 'add' ) }
                />
            </td>
            <td>
              <Checkbox
                className="m-t-5"
                centerVer
                value={ role.attributeRights[right].view }
                blocked={ role.attributeRights[right].edit && (noDef || !attribute.fixed) }
                onChange={ (e) => onChangeRightFunc( role, 'view' ) }
                />
            </td>
            <td>
              <Checkbox
                className="m-t-5"
                centerVer
                value={ role.attributeRights[right].edit }
                disabled={ !noDef && attribute.fixed }
                onChange={ (e) => onChangeRightFunc( role, 'edit' ) }
                />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}