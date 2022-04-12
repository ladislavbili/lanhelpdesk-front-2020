import React from 'react';
import {
  useTranslation
} from "react-i18next";
import Form from './form';

export default function PasswordsTable( props ) {
  const {
    passwords,
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
  const [ shownPasswords, setShownPasswords ] = React.useState( [] );

  return (
    <div>
      <table className="table">
        <thead>
          <tr className="bolder">
            <th>
              {t('title')}
            </th>
            <th className="text-center">
              {t('login')}
            </th>
            <th className="text-center">
              {t('password')}
            </th>
            <th className="text-center">
              {t('url')}
            </th>
            <th className="text-center">
              {t('expireDate')}
            </th>
            { !disabled &&
              <th className="text-center" width="55">
                {t('actions')}
              </th>
            }
          </tr>
        </thead>

        <tbody>
          { passwords.map((password) => (
            <tr key={password.id}>
              <td>
                {password.title}
              </td>
              <td className="text-center">
                {password.login.length > 0 ? password.login : t('noLogin') }
              </td>
              <td className="text-center">
                <div>
                  <button
                    className="btn-link m-r-5"
                    onClick={() => {
                      if(shownPasswords.includes(password.id)){
                        setShownPasswords(shownPasswords.filter((id) => id !== password.id ));
                      }else{
                        setShownPasswords([...shownPasswords, password.id]);
                      }
                    }}
                    >
                    <i className={`p-l-5 p-r-5 center-hor fa ${(!(shownPasswords.includes(password.id)) ? 'fa fa-eye' : 'fa fa-eye-slash')}`} />
                    { !(shownPasswords.includes(password.id)) ? t('show') : t('hide') }
                  </button>
                  { (shownPasswords.includes(password.id)) &&
                    <span className="p-r-10">{ password.password.length === 0 ? t('noPassword') : password.password }</span>
                  }
                </div>
              </td>
              <td className="text-center">
                <a href={`//${password.url}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>{password.url}</a>
              </td>
              <td className="text-center">
                {password.expireDate ? timestampToString(password.expireDate) : t('noExpireDate') }
              </td>
              { !disabled &&
                <td className="text-center">
                  <button className="btn-link" onClick={() => setEdited(password) } ><i className="fa fa-pen"/></button>
                  <button className="btn-link" onClick={() => onDelete(password.id) }><i className="fa fa-times m-l-5"/></button>
                </td>
              }
            </tr>
          ))
        }
        { !disabled &&
          <tr>
            <td colSpan="10">
              <button className="btn-link" onClick={() => setAddOpen(true) }><i className="fa fa-plus"/>{t('password')}</button>
            </td>
          </tr>
        }
      </tbody>
    </table>
    <Form
      passwordData={edited}
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