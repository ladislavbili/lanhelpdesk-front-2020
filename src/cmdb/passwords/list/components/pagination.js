import React from 'react';
import Loading from 'components/loading';
import classnames from 'classnames';
import {
  useTranslation
} from "react-i18next";

export default function Pagination( props ) {
  const {
    match,
    history,
    count,
    page,
    shortForm,
    limit,
    loading,
  } = props;

  const {
    t
  } = useTranslation();

  const pageFrom = limit * ( page - 1 ) + 1;
  let pageTo = pageFrom + limit - 1;
  if ( pageTo > count ) {
    pageTo = count;
  }

  if ( loading ) {
    return (
      <div className="ml-auto" style={{ width: 150 }}>
        <Loading noPos size={2} />
      </div>
    )
  }

  const path = `/cmdb/passwords/${match.params.companyID}/p/`;

  return (
    <div className={classnames("row m-b-10 ml-auto m-r-30")}>
      <div className="message ml-auto m-t-1">
        { `${ pageFrom }-${ pageTo } ${!shortForm ? t('fromTotalOf').toLowerCase() : t('of')} ${count} ${!shortForm ? t('page2').toLowerCase()  : ''}` }
      </div>
      <button
        disabled={  page === 1 }
        onClick={ () => { history.push(`${path}${page - 1}`) } }
        className="btn-link center-hor m-l-5 p-l-5 p-r-5"
        >
        <i className="fa fa-chevron-left" />
      </button>
      <button
        disabled={ page * limit >= count }
        onClick={ () => { history.push(`${path}${page + 1}`) } }
        className="btn-link center-hor m-l-5 p-l-5 p-r-5"
        >
        <i className="fa fa-chevron-right" />
      </button>
    </div>
  );
}