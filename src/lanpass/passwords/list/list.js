import React from 'react';
import Loading from 'components/loading';

import CommandBar from './components/commandBar';
import Pagination from './components/pagination';
import ActiveSearch from './components/activeSearch';

import {
  timestampToString,
} from 'helperFunctions';

import {
  useTranslation
} from "react-i18next";

export default function PasswordsList( props ) {
  const {
    history,
    match,
    loading,
    passwords,
    folderId,
    setLocalStringFilter,
    localStringFilter,
    setGlobalStringFilter,
    globalStringFilter,
  } = props;

  const {
    t
  } = useTranslation();

  let path = `/lanpass/i/${match.params.folderID ? match.params.folderID : 'all' }/p/${match.params.password ? match.params.password : 1 }`;

  return (
    <div>
      <CommandBar
        {...props}
        />
      <div className="full-width scroll-visible fit-with-header-and-commandbar-list task-container">
        <div className="row m-l-30">
        <input
          type="text"
          value={ localStringFilter.title }
          placeholder={t('title')}
          className="form-control width-250"
          style={{fontSize: "12px", marginRight: "10px"}}
          onKeyPress={(e) => {
            if( e.charCode === 13 && !loading){
              setGlobalStringFilter();
            }
          }}
          onChange={(e) => {
            setLocalStringFilter('title', e.target.value );
          }}
          />
          <button className="btn" style={{height: "32px"}} onClick={ setGlobalStringFilter } >
            {t('search')}
          </button>
        </div>

        <table className="table">
          <thead>
              <tr>
                <th style={{paddingBottom: "12px", paddingTop: "12px"}}>
                  {t('title')}
                </th>
                <th width="250" style={{paddingBottom: "12px", paddingTop: "12px"}}>
                  {t('url')}
                </th>
                <th width="250" style={{paddingBottom: "12px", paddingTop: "12px"}}>
                  {t('login2')}
                </th>
                <th width="250" style={{paddingBottom: "12px", paddingTop: "12px"}}>
                  {t('expireDate')}
                </th>
              </tr>
          </thead>

          <tbody>
            <ActiveSearch {...props} />

            { passwords.map((password) => (
              <tr key={password.id} className="clickable noselect" onClick={() => history.push(`${path}/${password.id}`)}>
                <td className="font-14-f">
                  {
                    password.isPrivate &&
                     <i className="fa fa-solid fa-user-secret"></i>
                   }
                  {password.title}
                </td>
                <td className="p-l-0">
                    <a href={`//${password.url}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>{password.url}</a>
                </td>
                <td className="p-l-0">
                  {password.login.length > 0 ? password.login : t('noLogin') }
                </td>
                <td className="p-l-0">
                  {password.expireDate ? timestampToString(password.expireDate) : t('noExpireDate') }
                </td>
              </tr>
            ))}
            { passwords.length === 0 &&
              <tr className="clickable noselect">
                <td colSpan="10" className="font-14-f">
                  {t('noData')}
                </td>
              </tr>
            }
            { loading &&
              <tr>
                <td colSpan="100">
                  <Loading noPos flex/>
                </td>
              </tr>
            }
          </tbody>
        </table>
        <Pagination {...props} />
      </div>
    </div>
  );
}
