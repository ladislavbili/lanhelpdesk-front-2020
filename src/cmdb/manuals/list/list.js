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
    company,
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
          onChange={(e) => {setLocalStringFilter('title', e.target.value );
          }}
          />
        <button className="btn" style={{height: "32px"}} onClick={ setGlobalStringFilter } >
            {t('search')}
          </button>
          <button
            className="btn-link center-hor commandbar-addon m-l-5"
            onClick={()=> history.push(`/cmdb/manuals/${company.id === null ? 'all' : company.id}/add`)}>
            <i className="fa fa-plus p-l-5 p-r-5"/>
            {t('manual')}
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th style={{paddingBottom: "12px", paddingTop: "12px"}}>
                {t('title')}
              </th>
              <th width="250" style={{paddingBottom: "12px", paddingTop: "12px"}}>
                {t('updatedAt')}
              </th>
              <th width="350" style={{paddingBottom: "12px", paddingTop: "12px"}}>
                {t('createdAt')}
              </th>
            </tr>
          </thead>

          <tbody>
            <ActiveSearch {...props} />

            { manuals.map((manual) => (
              <tr key={manual.id} className="clickable noselect" onClick={() => history.push(`${path}/${manual.id}`)}>
                <td className="font-14-f">
                  {manual.title}
                </td>
                <td className="p-l-0">
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
                <td className="p-l-0">
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
            { manuals.length === 0 &&
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
