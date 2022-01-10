import React from 'react';
import DatePicker from 'components/DatePicker';
import Checkbox from 'components/checkbox';
import Loading from 'components/loading';

import CommandBar from './components/commandBar';
import Pagination from './components/pagination';
import ActiveSearch from './components/activeSearch';

import {
  getItemDisplayValue,
  timestampToString,
}
from 'helperFunctions';
import {
  useTranslation
} from "react-i18next";
import moment from 'moment';

import {
  defaultTasksAttributesFilter
} from 'configs/constants/tasks';

export default function PagesList( props ) {
  const {
    history,
    match,
    loading,
    pages,
    folderId,
    setLocalStringFilter,
    localStringFilter,
    setGlobalStringFilter,
  } = props;

  const {
    t
  } = useTranslation();

  let path = `/lanwiki/i/${match.params.folderID ? match.params.folderID : 'all' }/p/${match.params.page ? match.params.page : 1 }`;

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
              <th width="250">
                {t('tags')}
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
              <th>
                <input
                  type="text"
                  value={ localStringFilter.tags }
                  className="form-control"
                  style={{fontSize: "12px", marginRight: "10px"}}
                  onKeyPress={(e) => {
                    if( e.charCode === 13 && !loading){
                      setGlobalStringFilter();
                    }
                  }}
                  onChange={(e) => {setLocalStringFilter('tags', e.target.value );
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
                      {t('filter')}
                    </button>
                  </div>
                </th>
              }
            </tr>

            <ActiveSearch {...props} />

            { pages.map((page) => (
              <tr key={page.id} className="clickable noselect" onClick={() => history.push(`${path}/${page.id}`)}>
                <td>
                  {page.title}
                </td>
                <td>
                  {page.tags.map((tag) => (
                    <div key={tag.id} style={{ background: tag.color, color: 'white', borderRadius: 3 }} className="m-r-5 m-t-5 p-l-5 p-r-5">
                      {tag.title}
                    </div>
                  ))}
                </td>
                { folderId === null &&
                  <td>
                    {page.folder.title}
                  </td>
                }
              </tr>
            ))}

            { !loading && pages.length === 0 &&
              <tr>
                <td colSpan="3" className="bolder">
                  {t('noLanwikiPages')}
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