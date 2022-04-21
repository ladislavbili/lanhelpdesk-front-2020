import React from 'react';
import classnames from "classnames";
import {
  Button
} from 'reactstrap';
import {
  useTranslation
} from "react-i18next";

export default function ActiveSearch( props ) {
  const {
    history,
    loading,
    passwordsRefetch,
    globalStringFilter,
    clearLocalStringFilter,
    setGlobalStringFilter,
  } = props;
  
  const {
    t
  } = useTranslation();

  if (
    (
      globalStringFilter === null ||
      Object.keys( globalStringFilter )
      .filter( ( filterKey ) => ( globalStringFilter[ filterKey ].length !== 0 ) )
      .length === 0
    )
  ) {
    return null;
  }

  const clearFilter = () => {
    clearLocalStringFilter();
    setGlobalStringFilter();
  }

  let usedFilter = [];
  if ( globalStringFilter !== null ) {
    usedFilter = [
      ...usedFilter,
      ...Object.keys( globalStringFilter )
    .filter( ( filterKey ) => globalStringFilter[ filterKey ].length !== 0 )
    .map( ( filterKey ) => `${t(filterKey)}: ${globalStringFilter[ filterKey ]}` )
    ]
  }

  return (
    <tr style={{ backgroundColor: 'inherit' }}>
      <td colSpan="100">
        <div
          className={classnames( "search-row" )}
          style={{ maxWidth: 700 }}
          >
          <span className="center-hor m-l-5 font-14">
            <span className="bolder m-r-5">
              {t('searchedPhrases')}:
            </span>
            { usedFilter.join(', ') }
          </span>

          <Button
            disabled={loading}
            className="btn center-hor m-l-10"
            onClick={clearFilter}
            >
            <i className="fa fa-times" />
            {t('clearSearch')}
          </Button>
          <Button
            disabled={loading}
            className="btn center-hor m-l-10"
            onClick={passwordsRefetch}
            >
            <i className="fa fa-redo-alt" />
          {t('repeatSearch')}
          </Button>
          <Button
            className="btn center-hor m-l-10"
            disabled={loading}
            onClick={()=>{
              history.push(`/lanwiki/i/all`)
            }}
            >
            {t('globalSearch')}
          </Button>
        </div>
      </td>
    </tr>
  )
}
