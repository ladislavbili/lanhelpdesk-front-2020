import React from 'react';
import Select from 'react-select';
import {
  pickSelectStyle,
} from 'configs/components/select';
import {
  useTranslation
} from "react-i18next";

// breadcrums, layout switch
export default function CommandBar( props ) {
  const {
    company,
    category,
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
      id: 'active',
      value: 'active',
      label: t( 'active2' ),
      title: t( 'active2' ),
    },
    {
      id: 'updatedAt',
      value: 'updatedAt',
      label: t( 'updatedAt' ),
      title: t( 'updatedAt' ),
    },
  ];

  const filteredBreadcrums = [
    {
      type: 'company',
      data: company,
      show: true,
      label: t( company.title ),
      onClick: () => {
        history.push( '/cmdb/i/all' );
      },
    },
    {
      type: 'category',
      data: category,
      show: category.id !== null,
      label: t( category.title ),
      onClick: () => {},
    }
  ];

  return (
    <div className="task-list-commandbar m-l-30 m-r-45">
      <div className="center-hor flex row">
        <div className="flex-row breadcrumbs">
          { filteredBreadcrums.filter((breadcrum) => breadcrum.show ).map( (breadcrum, index) =>(
            <h2
              className="clickable"
              key={index}
              onClick={breadcrum.onClick}
              >
              {`${index !== 0 && breadcrum.label ? '\\' : ''}${breadcrum.label}`}
            </h2>
          ))}
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
    </div>
  );
}