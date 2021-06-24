import React from 'react';
import {
  Button
} from 'reactstrap';
import Loading from 'components/loading';

export default function DnDPagination( props ) {
  const {
    page,
    setPage,
    limit,
    count,
    loading,
  } = props;

  const tasksFrom = limit * ( page - 1 ) + 1;
  let tasksTo = tasksFrom + limit - 1;
  if ( tasksTo > count ) {
    tasksTo = count;
  }

  return (
    <div className="dnd-pagination row">
      <Button
        disabled={  page === 1 }
        onClick={ () => setPage( page - 1  ) }
        className="btn-link center-hor m-l-5 p-l-5 p-r-5"
        >
        <i className="fa fa-chevron-left" />
      </Button>
      <div className="message center-hor center-ver m-t-1">
        { loading ? `Loading...` : `${ tasksFrom }-${ tasksTo } from total of ${count} tasks` }
      </div>
      <Button
        disabled={ page * limit >= count }
        onClick={ () => setPage( page + 1  ) }
        className="btn-link center-hor m-l-5 p-l-5 p-r-5"
        >
        <i className="fa fa-chevron-right" />
      </Button>
    </div>
  );
}