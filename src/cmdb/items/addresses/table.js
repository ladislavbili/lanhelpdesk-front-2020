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
            <th className="text-center">
              {t('ip')}
            </th>
            <th className="text-center">
              {t('mask')}
            </th>
            <th className="text-center">
              {t('gateway')}
            </th>
            <th className="text-center">
              {t('dns')}
            </th>
            <th className="text-center">
              {t('vlan')}
            </th>
            <th className="text-center">
              {t('note')}
            </th>
            { !disabled &&
              <th className="text-center" width="55">
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
              <td className="text-center">
                {address.ip}
              </td>
              <td className="text-center">
                {address.mask}
              </td>
              <td className="text-center">
                {address.gateway}
              </td>
              <td className="text-center">
                {address.dns}
              </td>
              <td className="text-center">
                {address.vlan}
              </td>
              <td className="max-width-200 text-center">
                {address.note}
              </td>
              { !disabled &&
                <td className="text-center">
                  <button className="btn-link" onClick={() => setEdited(address) } ><i className="fa fa-pen"/></button>
                  <button className="btn-link" onClick={() => onDelete(address.id) }><i className="fa fa-times m-l-5"/></button>
                </td>
              }
            </tr>
          ))
        }
        { !disabled &&
          <tr>
            <td colSpan="10">
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