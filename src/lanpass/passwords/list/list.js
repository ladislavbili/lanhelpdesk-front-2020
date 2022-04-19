import React from 'react';
import Loading from 'components/loading';

import CommandBar from './components/commandBar';
import Pagination from './components/pagination';
import ActiveSearch from './components/activeSearch';

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
        <table className="table">
          <thead>
            <tr>
              <th>
                {t('title')}
              </th>
              { folderId === null &&
                <th width="350">
                  {t('folder')}
                </th>
              }
            </tr>
          </thead>

          <tbody>
            <tr>
              <th>
                <input
                  type="text"
                  value={ localStringFilter.title }
                  className="form-control"
                  style={{fontSize: "12px", marginRight: "10px"}}
                  onKeyPress={(e) => {
                    if( e.charCode === 13 && !loading){
                      setGlobalStringFilter();
                    }
                  }}
                  onChange={(e) => {setLocalStringFilter('title', e.target.value );
                  }}
                  />
              </th>
              { folderId === null &&
                <th>
                  <div className="row">
                    <div className="flex">
                      <input
                        type="text"
                        value={ localStringFilter.folder }
                        className="form-control"
                        style={{fontSize: "12px", marginRight: "10px"}}
                        onKeyPress={(e) => {
                          if( e.charCode === 13 && !loading){
                            setGlobalStringFilter();
                          }
                        }}
                        onChange={(e) => {setLocalStringFilter('folder', e.target.value );
                        }}
                        />
                    </div>
                    <button className="btn m-l-5" onClick={ setGlobalStringFilter } >
                      {t('search')}
                    </button>
                  </div>
                </th>
              }
            </tr>

            <ActiveSearch {...props} />

            { passwords.map((password) => (
              <tr key={password.id} className="clickable noselect" onClick={() => history.push(`${path}/${password.id}`)}>
                <td className="font-14-f">
                  {password.title}
                </td>
                { folderId === null &&
                  <td>
                    {password.folder.title}
                  </td>
                }
              </tr>
            ))}
            { passwords.length === 0 &&
              <tr>
                <td colSpan="10">
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
