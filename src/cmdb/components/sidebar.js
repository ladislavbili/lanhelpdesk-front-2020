import React from 'react';
import {
  useQuery,
  useSubscription,
} from "@apollo/client";
import {
  Button,
  NavItem,
  Nav,
  Modal,
  Label,
} from 'reactstrap';
import {
  NavLink as Link
} from 'react-router-dom';
import Empty from 'components/Empty';
import Loading from 'components/loading';
import Select from "react-select";

import {
  pickSelectStyle,
} from 'configs/components/select';

import CategoryAdd from 'cmdb/categories/add/modalButton';
import CategoryEdit from 'cmdb/categories/edit/modalButton';

import ItemAdd from 'cmdb/items/add';

import folderIcon from 'scss/icons/folder.svg';
import filterIcon from 'scss/icons/filter.svg';

import classnames from "classnames";

import {
  useTranslation
} from "react-i18next";

import {
  toSelItem,
  toSelArr,
  translateSelectItem,
} from 'helperFunctions';

import {
  setCmdbSidebarCompany,
  setCmdbSidebarCategory,
} from 'apollo/localSchema/actions';

import {
  CMDB_SIDEBAR_COMPANY,
  CMDB_SIDEBAR_CATEGORY,
} from 'apollo/localSchema/queries';

import {
  GET_BASIC_COMPANIES,
  COMPANIES_SUBSCRIPTION,
} from 'helpdesk/settings/companies/queries';

import {
  GET_CATEGORIES,
  CATEGORIES_SUBSCRIPTION,
} from 'cmdb/categories/queries';

const allCompanies = {
  id: null,
  value: null,
  title: 'allCompanies',
  label: 'allCompanies'
};

export default function Sidebar( props ) {
  const {
    history,
    location,
    match
  } = props;

  const {
    t
  } = useTranslation();

  const {
    data: companyData,
  } = useQuery( CMDB_SIDEBAR_COMPANY );
  const {
    data: categoryData,
  } = useQuery( CMDB_SIDEBAR_CATEGORY );

  const {
    data: companiesData,
    loading: companiesLoading,
    refetch: companiesRefetch,
  } = useQuery( GET_BASIC_COMPANIES, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( COMPANIES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      companiesRefetch();
    }
  } );

  const {
    data: categoriesData,
    loading: categoriesLoading,
    refetch: categoriesRefetch,
  } = useQuery( GET_CATEGORIES, {
    fetchPolicy: 'network-only'
  } );

  useSubscription( CATEGORIES_SUBSCRIPTION, {
    onSubscriptionData: () => {
      categoriesRefetch();
    }
  } );

  const [ showCategories, setShowCategories ] = React.useState( true );

  const company = companyData.cmdbSidebarCompany;
  const category = categoryData.cmdbSidebarCategory;

  React.useEffect( () => {
    if ( !categoriesLoading && match.params.categoryID !== undefined ) {
      setCmdbSidebarCategory( match.params.categoryID === 'all' ? null : toSelItem( categoriesData.cmdbCategories.find( ( category ) => category.id === parseInt( match.params.categoryID ) ) ) );
    }
  }, [ match.params.categoryID, categoriesLoading ] );

  React.useEffect( () => {
    if ( !companiesLoading && match.params.companyID !== undefined ) {
      setCmdbSidebarCompany( match.params.companyID === 'all' ? null : toSelItem( companiesData.basicCompanies.find( ( company ) => company.id === parseInt( match.params.companyID ) ) ) );
    }
  }, [ match.params.companyID, companiesLoading ] );

  if ( companiesLoading || categoriesLoading ) {
    return ( <Loading /> );
  }

  const companies = companiesData.basicCompanies;
  const categories = categoriesData.cmdbCategories;

  return (
    <div className="sidebar">
      <div className="scrollable fit-with-header">
        <ItemAdd  companyId={company ? company.id : null} categoryId={category ? category.id : null} />
        <hr className="m-l-15 m-r-15 m-t-15" />
        <div>
          <div className="sidebar-label row">
            <div>
              <img
                className="m-r-9"
                src={folderIcon}
                alt="Folder icon not found"
                />
              <Label>
                {t('company')}
              </Label>
            </div>
          </div>
          <div className="sidebar-menu-item">
            <Select
              options={[translateSelectItem(allCompanies, t), ...toSelArr(companies)]}
              value={translateSelectItem(company, t)}
              styles={pickSelectStyle([ 'invisible', 'blueFont', 'sidebar', 'flex' ])}
              onChange={company => {
                setCmdbSidebarCompany(company);
                history.push(`/cmdb/i/${category ? category.id : 'all'  }`)
              }}
              />
          </div>
        </div>
        { company.id !== null &&
          <Nav vertical className="m-t-10">
            <NavItem className={classnames("row full-width sidebar-item", { "active": window.location.pathname.includes( '/cmdb/scheme' ) }) }>
              <span
                className={ classnames("clickable sidebar-menu-item link", { "active": window.location.pathname.includes( '/cmdb/scheme' ) }) }
                onClick={() => { history.push(`/cmdb/scheme/${company.id}`) }}
                >
                {t('scheme')}
              </span>
            </NavItem>
            <NavItem className={classnames("row full-width sidebar-item", { "active": window.location.pathname.includes( '/cmdb/manuals' ) }) }>
              <span
                className={ classnames("clickable sidebar-menu-item link", { "active": window.location.pathname.includes( '/cmdb/manuals' ) }) }
                onClick={() => { history.push(`/cmdb/manuals/${company.id}`) }}
                >
                {t('manuals')}
              </span>
            </NavItem>
          </Nav>
        }
        <hr className = "m-l-15 m-r-15 m-t-15" />

        <Nav vertical>
          <div className="sidebar-label row clickable noselect" onClick={() => setShowCategories( !showCategories )}>
            <div>
              <img
                className="m-r-5"
                style={{
                  color: "#212121",
                  height: "17px",
                  marginBottom: "3px"
                }}
                src={filterIcon}
                alt="Filter icon not found"
                />
              <Label className="clickable">
                {t('categories')}
              </Label>
            </div>
            <div className="ml-auto m-r-3">
              { showCategories && <i className="fas fa-chevron-up" /> }
              { !showCategories && <i className="fas fa-chevron-down" /> }
            </div>
          </div>
          { showCategories &&
            <Empty>
              <NavItem className={classnames("row full-width sidebar-item", { "active": category === null }) }>
                <span
                  className={ classnames("clickable sidebar-menu-item link", { "active": category === null }) }
                  onClick={() => { history.push(`/cmdb/i/all`) }}
                  >
                  {t('allCategories')}
                </span>
              </NavItem>
              { categories.map((sidebarCategory) => (
                <NavItem key={sidebarCategory.id} className={classnames("row full-width sidebar-item", { "active": category !== null && category.id === sidebarCategory.id }) }>
                  <span
                    className={ classnames("clickable sidebar-menu-item link", { "active": category !== null && category.id === sidebarCategory.id }) }
                    onClick={() => { history.push(`/cmdb/i/${sidebarCategory.id}`) }}
                    >
                    {sidebarCategory.title}
                  </span>
                  { category !== null && sidebarCategory.id === category.id &&
                    <CategoryEdit id={sidebarCategory.id} folders={categories} history={history} />
                  }
                </NavItem>
              ))}
            </Empty>
          }
        </Nav>
        { showCategories &&
          <CategoryAdd />
        }
      </div>
    </div>
  );
}