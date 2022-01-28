import React from 'react';
import {
  useTranslation
} from "react-i18next";
import Form from './form';

export default function AddressesTable( props ) {
  const {
    addresses,
    onAdd,
    onEdit,
    onDelete,
    disabled,
  } = props;
  const {
    t
  } = useTranslation();

  const [ addOpen, setAddOpen ] = React.useState( false );
  const [ edited, setEdited ] = React.useState( null );

  return (
    <div>
      <table className="table">
        <thead>
          <tr className="bolder">
            <th>
              {t('nic')}
            </th>
            <th>
              {t('ip')}
            </th>
            <th>
              {t('mask')}
            </th>
            <th>
              {t('gateway')}
            </th>
            <th>
              {t('dns')}
            </th>
            <th>
              {t('vlan')}
            </th>
            <th>
              {t('note')}
            </th>
            { !disabled &&
              <th width="55">
                {t('actions')}
              </th>
            }
          </tr>
        </thead>

        <tbody>
          { addresses.map((address) => (
            <tr key={address.id}>
              <td>
                {address.nic}
              </td>
              <td>
                {address.ip}
              </td>
              <td>
                {address.mask}
              </td>
              <td>
                {address.gateway}
              </td>
              <td>
                {address.dns}
              </td>
              <td>
                {address.vlan}
              </td>
              <td className="max-width-200">
                {address.note}
              </td>
              { !disabled &&
                <td>
                  <button className="btn-link" onClick={() => setEdited(address) } ><i className="fa fa-pen"/></button>
                  <button className="btn-link" onClick={() => onDelete(address.id) }><i className="fa fa-times m-l-5"/></button>
                </td>
              }
            </tr>
          ))
        }
        { !disabled &&
          <tr>
            <td>
              <button className="btn-link" onClick={() => setAddOpen(true) }><i className="fa fa-plus"/>{t('address2')}</button>
            </td>
          </tr>
        }
      </tbody>
    </table>
    <Form
      address={edited}
      open={addOpen || edited !== null}
      close={() => {setAddOpen(false); setEdited(null);} }
      edit={!addOpen && edited}
      onChange={(newData) => {
        if(addOpen){
          onAdd(newData);
          setAddOpen(false);
        }else {
          onEdit(newData);
          setEdited(null);
        }
      }}
      />
  </div>
  );
}