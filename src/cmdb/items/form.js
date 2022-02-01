import React from 'react';
import Select from 'react-select';
import {
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

import CKEditor from 'components/CKEditor';
import DatePicker from 'components/DatePicker';
import Empty from 'components/Empty';
import Addresses from './addresses';
import AddItemErrors from './add/showErrors';
import EditItemErrors from './edit/showErrors';
import {
  translateAllSelectItems,
  toSelArr,
  timestampToString,
} from 'helperFunctions';
import {
  pickSelectStyle,
} from 'configs/components/select';
import classnames from 'classnames';
import moment from 'moment';
import {
  useTranslation
} from "react-i18next";

const statuses = [
  {
    id: true,
    value: true,
    label: 'Active',
    title: 'Active',
    labelId: 'active2',
  },
  {
    id: false,
    value: false,
    label: 'Inactive',
    title: 'Inactive',
    labelId: 'inactive2',
  },
];

export default function ItemForm( props ) {
  const {
    id,
    edit,
    addItem,
    saveItem,
    close,
    companies,
    categories,
    companyId,
    categoryId,
    disabled,
    item,
  } = props;
  const {
    t
  } = useTranslation();

  const [ title, setTitle ] = React.useState( item ? item.title : '' );
  const [ status, setStatus ] = React.useState( item ? translateAllSelectItems( statuses, t )
    .find( ( status ) => status.value === item.active ) : translateAllSelectItems( statuses, t )[ 0 ] );
  const [ placement, setPlacement ] = React.useState( item ? item.location : '' );
  const [ company, setCompany ] = React.useState( item ? companies.find( ( company ) => company.id === item.company.id ) : ( companyId === null ? companies[ 0 ] : companies.find( ( company ) => company.id === companyId ) ) );
  const [ category, setCategory ] = React.useState( item ? categories.find( ( category ) => category.id === item.category.id ) : ( categoryId === null ? categories[ 0 ] : categories.find( ( category ) => category.id === categoryId ) ) );
  const [ installDate, setInstallDate ] = React.useState( item && item.installDate ? moment( parseInt( item.installDate ) ) : null );
  const [ expireDate, setExpireDate ] = React.useState( item && item.expireDate ? moment( parseInt( item.expireDate ) ) : null );
  const [ hardware, setHardware ] = React.useState( item ? item.hardware : '' );
  const [ serialNumber, setSerialNumber ] = React.useState( item ? item.serialNumber : '' );
  const [ description, setDescription ] = React.useState( item ? item.description : '' );
  const [ backup, setBackup ] = React.useState( item ? item.backup : '' );
  const [ monitoring, setMonitoring ] = React.useState( item ? item.monitoring : '' );
  const [ addresses, setAddresses ] = React.useState( item ? item.addresses : [] );

  const [ showErrors, setShowErrors ] = React.useState( false );
  const [ saving, setSaving ] = React.useState( false );

  const cannotSave = () => {
    return (
      saving ||
      title.length === 0 ||
      !company ||
      !company.id ||
      !category ||
      !category.id ||
      addresses.some( ( address ) => address.nic.length === 0 )
    );
  }

  const saveOrAddItem = () => {
    if ( disabled ) {
      return;
    };
    if ( cannotSave() ) {
      setShowErrors( true );
    } else {
      let data = {
        title,
        active: status.id,
        location: placement,
        companyId: company.id,
        categoryId: category.id,
        installDate: installDate === null ? null : installDate.valueOf()
          .toString(),
        expireDate: expireDate === null ? null : expireDate.valueOf()
          .toString(),
        hardware,
        serialNumber,
        description,
        backup,
        monitoring,
      };
      if ( edit ) {
        data.id = id;
        saveItem( data, setSaving, close );
      } else {
        data.addresses = addresses.map( ( address ) => {
          delete address.id;
          return address;
        } );
        addItem( data, setSaving, close );
      }
    }
  }

  return (
    <Empty>
      <div
        className={classnames({"fit-with-header-and-lanwiki-commandbar scroll-visible": edit },"row")}
        style={{backgroundColor: "#eaeaea"}}
        >
        <div className="task-edit-left">
          {!disabled &&
            <h2>{ edit ? `${t('edit')} ${t('cmdbItem2').toLowerCase()}` : `${t('add')} ${t('cmdbItem2').toLowerCase()}` }</h2>
          }
          <FormGroup>
            { disabled &&
              <div className="row">
                <h2>
                  {title}
                </h2>
                <div className="ml-auto">
                  <div>
                    <span className="">
                      {item.createdBy ? `${t('createdBy')} ` : ""}
                    </span>
                    <span className="bolder">
                      {item.createdBy ? `${item.createdBy.fullName}` :''}
                    </span>
                    <span className="">
                      {item.createdBy ?` ${t('atDate')} `: t('createdAt')}
                    </span>
                    <span className="bolder">
                      {item.createdAt ? (timestampToString(item.createdAt)) : ''}
                    </span>
                  </div>
                  <div>
                    <span className="">
                      {item.updatedBy ? `${t('changedBy')} ` : ""}
                    </span>
                    <span className="bolder">
                      {item.updatedBy ? `${item.updatedBy.fullName}` :''}
                    </span>
                    <span className="">
                      {item.updatedBy ?` ${t('atDate')} `: t('changedAt')}
                    </span>
                    <span className="bolder">
                      {item.createdAt ? (timestampToString(item.updatedAt)) : ''}
                    </span>
                  </div>
                </div>
              </div>
            }
            { !disabled &&
              <Empty>
                <Label htmlFor="name">{t('title')}</Label>
                <Input id="name" className="form-control" placeholder={t('titlePlaceholder')} value={title} onChange={(e) => setTitle(e.target.value)}/>
              </Empty>
            }
          </FormGroup>
          <Addresses
            itemId={edit ? item.id : null}
            edit={edit}
            addresses={addresses}
            setAddresses={setAddresses}
            disabled={disabled}
            />
          <FormGroup>
            <Label htmlFor="description">{t('description')}</Label>
            {disabled &&
              <div className="task-edit-popis p-t-10 min-height-100-f" dangerouslySetInnerHTML={{ __html: description }} />
            }
            { !disabled &&
              <CKEditor
                id="description"
                value={description}
                type="imageUpload"
                onChange={(description) => {
                  setDescription(description);
                }}
                />
            }
          </FormGroup>
          <div className="color-yellow-highlight m-b-15 p-10" >
            {category.descriptionLabel.length > 0 ? category.descriptionLabel : t('noNote') }
          </div>
          <FormGroup>
            <Label htmlFor="backup">{t('backup')}</Label>
            {disabled &&
              <div className="task-edit-popis p-t-10 min-height-100-f" dangerouslySetInnerHTML={{ __html: backup }} />
            }
            { !disabled &&
              <CKEditor
                id="backup"
                value={backup}
                type="imageUpload"
                onChange={(backup) => {
                  setBackup(backup);
                }}
                />
            }
          </FormGroup>
          <div className="color-yellow-highlight m-b-15 p-10" >
            {category.backupLabel.length > 0 ? category.backupLabel : t('noNote') }
          </div>
          <FormGroup>
            <Label htmlFor="monitoring">{t('monitoring')}</Label>
            {disabled &&
              <div className="task-edit-popis p-t-10 min-height-100-f" dangerouslySetInnerHTML={{ __html: monitoring }} />
            }
            { !disabled &&
              <CKEditor
                id="monitoring"
                value={monitoring}
                type="imageUpload"
                onChange={(monitoring) => {
                  setMonitoring(monitoring);
                }}
                />
            }
          </FormGroup>
          <div className="color-yellow-highlight m-b-15 p-10" >
            {category.monitoringLabel.length > 0 ? category.monitoringLabel : t('noNote') }
          </div>



          { !edit && <AddItemErrors title={title} category={category} company={company} addresses={addresses} show={showErrors} />}
          { edit && <EditItemErrors title={title} category={category} company={company} show={showErrors} />}

          { !edit &&
            <div className="row m-t-20">
              <button className="btn-link-cancel" onClick={close}>{edit ? t('back') : t('cancel')}</button>
              { !disabled &&
                <div className="ml-auto">
                  <button
                    className="btn"
                    disabled={cannotSave() && showErrors}
                    onClick={saveOrAddItem}
                    >
                    {saving ? `${t('adding')}...` : `${t('add')} ${t('cmdbItem2').toLowerCase()}`}
                  </button>
                </div>
              }
            </div>
          }
        </div>

        <div className="task-edit-right">
          <FormGroup>
            <Label htmlFor="category">{t('category')}</Label>
            { disabled &&
              <div>
                { category.title }
              </div>
            }
            { !disabled &&
              <Select
                placeholder={t('selectCategory')}
                value={category}
                options={toSelArr(categories)}
                onChange={(category)=>{
                  setCategory(category);
                }}
                styles={pickSelectStyle( [ 'noArrow', 'required', ] )}
                />
            }
          </FormGroup>
          <FormGroup>
            <Label htmlFor="company">{t('company')}</Label>
            { disabled &&
              <div>
                { company.title }
              </div>
            }
            { !disabled &&
              <Select
                placeholder={t('selectCompany')}
                value={company}
                options={toSelArr(companies)}
                onChange={(company)=>{
                  setCompany(company);
                }}
                styles={pickSelectStyle( [ 'noArrow', 'required', ] )}
                />
            }
          </FormGroup>
          <FormGroup>
            <Label htmlFor="status">{t('status')}</Label>
            { disabled &&
              <div>
                <span style={{ background: status.value ? '#9beb34' : '#e39a24', color: 'white', borderRadius: 3 }} className="m-r-5 p-l-5 p-r-5">
                  { status.value ? t('active2') : t('inactive2') }
                </span>
              </div>
            }
            { !disabled &&
              <Select
                placeholder={t('selectStatus')}
                value={status}
                options={translateAllSelectItems(statuses, t)}
                onChange={(status)=>{
                  setStatus(status);
                }}
                styles={pickSelectStyle( [ 'noArrow', 'required', ] )}
                />
            }
          </FormGroup>
          <FormGroup>
            <Label htmlFor="placement">{t('placement')}</Label>
            { disabled &&
              <div>{ placement.length === 0 ? t('noPlacement') : placement }</div>
            }
            { !disabled &&
              <Input id="placement" className="form-control" placeholder={t('placementPlaceholder')} value={placement} onChange={(e) => setPlacement(e.target.value)}/>
            }
          </FormGroup>
          <FormGroup>
            <Label htmlFor="installDate">{t('installDate')}</Label>
            { disabled &&
              <div className="disabled-info">{installDate ? timestampToString(installDate.valueOf()) : t('noInstallDate') }</div>
            }
            { !disabled &&
              <div className="flex-input">
                <DatePicker
                  className={classnames("form-control")}
                  selected={installDate}
                  hideTime
                  isClearable
                  onChange={date => {
                    setInstallDate( isNaN(date.valueOf()) ? null : date );
                  }}
                  placeholderText={t('installDatePlaceholder')}
                  />
              </div>
            }
          </FormGroup>
          <FormGroup>
            <Label htmlFor="expireDate">{t('expireDate')}</Label>
            { disabled &&
              <div className="disabled-info">{expireDate ? timestampToString(expireDate.valueOf()) : t('noExpireDate') }</div>
            }
            { !disabled &&
              <div className="flex-input">
                <DatePicker
                  className={classnames("form-control")}
                  selected={expireDate}
                  hideTime
                  isClearable
                  onChange={date => {
                    setExpireDate( isNaN(date.valueOf()) ? null : date );
                  }}
                  placeholderText={t('expireDatePlaceholder')}
                  />
              </div>
            }
          </FormGroup>
          <FormGroup>
            <Label htmlFor="hardware">{t('hardwareModel')}</Label>
            { disabled &&
              <div className="min-height-30">{hardware.length === 0 ? t('noHardwareModel') : hardware }</div>
            }
            { !disabled &&
              <Input id="hardware" className="form-control" placeholder={t('hardwareModelPlaceholder')} value={hardware} onChange={(e) => setHardware(e.target.value)}/>
            }
          </FormGroup>
          <FormGroup>
            <Label htmlFor="serialNumber">{t('serialNumber')}</Label>
            { disabled &&
              <div>{ serialNumber.length === 0 ? t('noSerialNumber') : serialNumber }</div>
            }
            { !disabled &&
              <Input id="serialNumber" className="form-control" placeholder={t('serialNumberPlaceholder')} value={serialNumber} onChange={(e) => setSerialNumber(e.target.value)}/>
            }
          </FormGroup>
        </div>

      </div>
      { !disabled && edit &&
        <div className="task-add-layout row stick-to-bottom">
          <div className="center-ver">
            <button
              className="btn-link task-add-layout-button btn-distance"
              onClick={close}
              >
              <i className="fas fa-arrow-left commandbar-command-icon" />
              {t('close')}
            </button>
            <button
              className="btn-link task-add-layout-button btn-distance"
              disabled={cannotSave() && showErrors}
              onClick={saveOrAddItem}
              >
              {saving ? `${t('saving')}...` : `${t('save')} ${t('cmdbItem2').toLowerCase()}`}
            </button>
          </div>
        </div>
      }
    </Empty>
  );
}