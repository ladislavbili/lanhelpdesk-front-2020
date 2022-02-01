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

export default function ManualsList( props ) {
  const {
    history,
    match,
    loading,
    manuals,
    setLocalStringFilter,
    localStringFilter,
    setGlobalStringFilter,
  } = props;

  const {
    t
  } = useTranslation();

  let path = `/cmdb/manuals/${match.params.companyID ? match.params.companyID : 'all' }/p/${match.params.page ? match.params.page : 1 }`;

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
                {t('updatedAt')}
              </th>
                <th width="350">
                  {t('createdAt')}
                </th>
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
              <th/>
                <th>
                    <div className="row">
                      <div className="flex" />
                      <button className="btn m-l-5" onClick={ setGlobalStringFilter } >
                        {t('filter')}
                      </button>
                    </div>
                </th>
            </tr>

            <ActiveSearch {...props} />

            { manuals.map((manual) => (
              <tr key={manual.id} className="clickable noselect" onClick={() => history.push(`${path}/${manual.id}`)}>
                <td>
                  {manual.title}
                </td>
                <td>
                  <span className="">
                    {manual.createdBy ? `${t('createdBy')} ` : ""}
                  </span>
                  <span className="bolder">
                    {manual.createdBy ? `${manual.createdBy.fullName}` :''}
                  </span>
                  <span className="">
                    {manual.createdBy ?` ${t('atDate')} `: t('createdAt')}
                  </span>
                  <span className="bolder">
                    {manual.createdAt ? (timestampToString(manual.createdAt)) : ''}
                  </span>
                </td>
                  <td>
                    <span className="">
                      {manual.updatedBy ? `${t('changedBy')} ` : ""}
                    </span>
                    <span className="bolder">
                      {manual.updatedBy ? `${manual.updatedBy.fullName}` :''}
                    </span>
                    <span className="">
                      {manual.updatedBy ?` ${t('atDate')} `: t('changedAt')}
                    </span>
                    <span className="bolder">
                      {manual.createdAt ? (timestampToString(manual.updatedAt)) : ''}
                    </span>
                  </td>
              </tr>
            ))}

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