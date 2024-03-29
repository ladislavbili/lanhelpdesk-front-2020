import React from 'react';
import Select from 'react-select';
import Loading from 'components/loading';

import CommandBar from './components/commandBar';
import Pagination from './components/pagination';
import ActiveSearch from './components/activeSearch';

import {
  pickSelectStyle,
} from 'configs/components/select';

import {
  translateAllSelectItems,
} from 'helperFunctions';
import {
  useTranslation
} from "react-i18next";

const statuses = [
  {
    id: null,
    value: null,
    label: 'All',
    title: 'All',
    labelId: 'all',
  },
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

export default function ItemsList( props ) {
  const {
    history,
    match,
    loading,
    items,
    companyId,
    categoryId,
    setLocalStringFilter,
    localStringFilter,
    setGlobalStringFilter,
  } = props;

  const {
    t
  } = useTranslation();

  let path = `/cmdb/i/${match.params.categoryID ? match.params.categoryID : 'all' }/p/${match.params.page ? match.params.page : 1 }`;

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
                <th>
                  {t('active2')}
                </th>
              { companyId === null &&
                <th width="350">
                  {t('company')}
                </th>
              }
              { categoryId === null &&
                <th width="350">
                  {t('category')}
                </th>
              }
              <th width="350">
                {t('ips')}
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
                  onChange={(e) => {
                    setLocalStringFilter('title', e.target.value );
                  }}
                  />
                </th>
              <th>
              <Select
                placeholder={t('selectStatus')}
                value={translateAllSelectItems(statuses, t).find((status) => status.id === localStringFilter.active )}
                options={translateAllSelectItems(statuses, t)}
                onChange={(status)=>{
                  setLocalStringFilter('active', status.value );
                }}
                styles={pickSelectStyle( [ 'noArrow', 'size12', 'inputSize' ] )}
                />
              </th>
              { companyId === null &&
                <th>
                  <input
                    type="text"
                    value={ localStringFilter.company }
                    className="form-control"
                    style={{fontSize: "12px", marginRight: "10px"}}
                    onKeyPress={(e) => {
                      if( e.charCode === 13 && !loading){
                        setGlobalStringFilter();
                      }
                    }}
                    onChange={(e) => {setLocalStringFilter('company', e.target.value );
                    }}
                    />
                </th>
              }
              { categoryId === null &&
                <th>
                  <input
                    type="text"
                    value={ localStringFilter.category }
                    className="form-control"
                    style={{fontSize: "12px", marginRight: "10px"}}
                    onKeyPress={(e) => {
                      if( e.charCode === 13 && !loading){
                        setGlobalStringFilter();
                      }
                    }}
                    onChange={(e) => {setLocalStringFilter('category', e.target.value );
                    }}
                    />
                </th>
              }
              <th>
                <div className="row">
                  <div className="flex">
                    <input
                      type="text"
                      value={ localStringFilter.ips }
                      className="form-control"
                      style={{fontSize: "12px", marginRight: "10px"}}
                      onKeyPress={(e) => {
                        if( e.charCode === 13 && !loading){
                          setGlobalStringFilter();
                        }
                      }}
                      onChange={(e) => {setLocalStringFilter('ips', e.target.value );
                      }}
                      />
                  </div>
                  <button  className="btn m-l-10" style={{height: "32px"}} onClick={ setGlobalStringFilter } >
                    {t('search')}
                  </button>
                </div>
              </th>
            </tr>

            <ActiveSearch {...props} />

            { items.map((item) => (
              <tr key={item.id} className="clickable noselect" onClick={() => history.push(`${path}/${item.id}`)}>
                <td className="font-14-f">
                  {item.title}
                </td>
                <td className="p-l-0">
                  { !item.active ? t('inactive2') : t('active2') }
                </td>
                { companyId === null &&
                  <td className="p-l-0">
                    {item.company.title}
                  </td>
                }
                { categoryId === null &&
                  <td className="p-l-0">
                    {item.category.title}
                  </td>
                }
                <td className="p-l-0">
                  {item.addresses.map((address) => (
                    <div key={address.id} className="m-r-5 m-t-5 p-l-5 p-r-5">
                      {address.ip}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
            { items.length === 0 &&
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
