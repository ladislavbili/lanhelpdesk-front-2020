import React from 'react';
import Select from 'react-select';

import {
  pickSelectStyle,
} from 'configs/components/select';
import {
  useTranslation
} from "react-i18next";
import {
  setLSidebarFolder,
  setLSidebarTag,
} from 'apollo/localSchema/actions';

// breadcrums, layout switch
export default function CommandBar( props ) {
  const {
    company,
    sort,
    setSort,
    history,
  } = props;

  const {
    t
  } = useTranslation();

  const sortOptions = [
    {
      id: 'id',
      value: 'id',
      label: t( 'id' ),
      title: t( 'id' ),
    },
    {
      id: 'title',
      value: 'title',
      label: t( 'title' ),
      title: t( 'title' ),
    },
    {
      id: 'updatedAt',
      value: 'updatedAt',
      label: t( 'updatedAt' ),
      title: t( 'updatedAt' ),
    },
  ];

  return (
    <div className="m-l-30 m-r-30">
    <div className="list-commandbar">
        <div className="flex-row breadcrumbs">
          <h2>{company.id === null ? t('noCompany') :company.title }</h2>
        </div>
        <div className="ml-auto center-hor row">
          <div className="color-basic m-r-5 m-l-5 center-hor">
            {t('sortBy')}
          </div>
          <div className="min-width-120 m-r-5">
            <Select
              placeholder={t('sortBy')}
              value={ sort }
              onChange={ (sort) => setSort(sort) }
              options={ sortOptions }
              styles={pickSelectStyle([ 'noArrow', 'invisible', 'bolder', 'basic', 'right', 'segoe' ])}
              />
          </div>
        </div>
      </div>
      <div>
        <button
          className="btn-link center-hor commandbar-addon"
          onClick={()=> history.push(`/cmdb/manuals/${company.id}/add`)}>
          <i className="fa fa-plus p-l-5 p-r-5"/>
          {t('manual')}
        </button>
      </div>
    </div>
  );
}