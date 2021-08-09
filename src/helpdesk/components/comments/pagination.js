import React from 'react';
import {
  Button
} from 'reactstrap';
import Loading from 'components/loading';
import classnames from 'classnames';

export default function Pagination( props ) {
  const {
    count,
    page,
    limit,
    loading,
    setPage,
  } = props;

  const dataFrom = limit * ( page - 1 ) + 1;
  let dataTo = dataFrom + limit - 1;
  if ( dataTo > count ) {
    dataTo = count;
  }

  if ( loading ) {
    return (
      <div className="ml-auto" style={{ width: 150 }}>
        <Loading noPos size={2} />
      </div>
    )
  }

  return (
    <div className={classnames("row m-b-10 ml-auto")}>
      <div className="message ml-auto m-t-1">
        { `${ dataFrom }-${ dataTo } from total of ${count} comments` }
      </div>
      <Button
        disabled={  page === 1 }
        onClick={ () => setPage(page - 1) }
        className="btn-link center-hor m-l-5 p-l-5 p-r-5"
        >
        <i className="fa fa-chevron-left" />
      </Button>
      <Button
        disabled={ page * limit >= count }
        onClick={ () => setPage(page + 1) }
        className="btn-link center-hor m-l-5 p-l-5 p-r-5"
        >
        <i className="fa fa-chevron-right" />
      </Button>
    </div>
  );
}