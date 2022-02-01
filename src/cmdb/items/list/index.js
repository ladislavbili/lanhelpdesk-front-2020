import React from 'react';
import {
  useQuery,
} from "@apollo/client";

import {
  useTranslation
} from "react-i18next";

import Loading from 'components/loading';
import ItemsList from './list';
import {
  setCmdbGlobalStringFilter,
  setCmdbLocalStringFilter,
  clearCmdbLocalStringFilter,
} from 'apollo/localSchema/actions';
import {
  CMDB_SIDEBAR_COMPANY,
  CMDB_SIDEBAR_CATEGORY,
  CMDB_LOCAL_STRING_FILTER,
  CMDB_GLOBAL_STRING_FILTER,
} from 'apollo/localSchema/queries';

import {
  GET_ITEMS,
} from 'cmdb/items/queries';


export default function CmdbItemsLoader( props ) {
  const {
    match,
  } = props;
  const {
    t
  } = useTranslation();

  const page = match.params.page ? parseInt( match.params.page ) : 1;
  const limit = 30;

  const {
    data: sidebarCompanyData,
  } = useQuery( CMDB_SIDEBAR_COMPANY );
  const {
    data: sidebarCategoryData,
  } = useQuery( CMDB_SIDEBAR_CATEGORY );
  const {
    data: localStringFilterData,
  } = useQuery( CMDB_LOCAL_STRING_FILTER );
  const {
    data: globalStringFilterData,
  } = useQuery( CMDB_GLOBAL_STRING_FILTER );

  const [ sort, setSort ] = React.useState( {
    id: 'id',
    value: 'id',
    label: t( 'id' ),
    title: t( 'id' ),
  } );

  const company = (
    sidebarCompanyData.cmdbSidebarCompany === null ? {
      id: null,
      title: t( 'allCompanies' )
    } :
    sidebarCompanyData.cmdbSidebarCompany
  );

  const category = (
    sidebarCategoryData.cmdbSidebarCategory === null ? {
      id: null,
      title: t( 'allCategory' )
    } :
    sidebarCategoryData.cmdbSidebarCategory
  );

  const companyId = company.id;
  const categoryId = category.id;
  const localStringFilter = localStringFilterData.cmdbLocalStringFilter;
  const globalStringFilter = globalStringFilterData.cmdbGlobalStringFilter;

  const {
    data: itemsData,
    loading: itemsLoading,
    refetch: itemsRefetch,
  } = useQuery( GET_ITEMS, {
    variables: {
      companyId,
      categoryId,
      page: match.params.page ? parseInt( match.params.page ) : 1,
      limit,
      stringFilter: globalStringFilter,
      sort: sort.id,
    },
    fetchPolicy: 'network-only',
  } );

  React.useEffect( () => {
    itemsRefetch( {
      variables: {
        companyId,
        categoryId,
        page: match.params.page ? parseInt( match.params.page ) : 1,
        limit,
        stringFilter: globalStringFilter,
        sort: sort.id,
      }
    } )
  }, [ companyId, categoryId, match.params.page, globalStringFilter ] );



  const items = itemsLoading ? [] : itemsData.cmdbItems.items;
  const count = itemsLoading ? 0 : itemsData.cmdbItems.count;

  return (
    <ItemsList
      {...props}
      loading={itemsLoading}
      items={items}
      count={count}
      page={page}
      limit={limit}
      company={company}
      category={category}
      companyId={companyId}
      categoryId={categoryId}
      sort={sort}
      setSort={setSort}
      itemsRefetch={() => {
        itemsRefetch( {
          variables: {
            companyId,
            categoryId,
            page: match.params.page ? parseInt( match.params.page ) : 1,
            limit,
            stringFilter: globalStringFilter,
            sort: sort.id,
          }
        } );
      }}
      setGlobalStringFilter={setCmdbGlobalStringFilter}
      setLocalStringFilter={setCmdbLocalStringFilter}
      clearLocalStringFilter={clearCmdbLocalStringFilter}
      localStringFilter={localStringFilter}
      globalStringFilter={globalStringFilter}
      />
  );
}