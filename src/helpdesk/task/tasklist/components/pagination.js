import React from 'react';
import {
  Button
} from 'reactstrap';
import Loading from 'components/loading';


export default function Pagination( props ) {
  const {
    match,
    history,
    count,
    page,
    limit,
    loading,
  } = props;

  const tasksFrom = limit * ( page - 1 ) + 1;
  let tasksTo = tasksFrom + limit - 1;
  if ( tasksTo > count ) {
    tasksTo = count;
  }

  if ( loading ) {
    return (
      <div className="ml-auto" style={{ width: 150 }}>
      <Loading noPos size={2} />
    </div>
    )
  }

  const path = `/helpdesk/taskList/i/${match.params.listID}/p/`;

  return (
    <div className="row m-b-10 m-r-30 ml-auto">
      <div className="message ml-auto m-t-1">{ `${ tasksFrom }-${ tasksTo } from total of ${count} tasks` }</div>
        <Button
          disabled={  page === 1 }
          onClick={ () => { history.push(`${path}${page - 1}`) } }
          className="btn-link center-hor m-l-5 p-l-5 p-r-5"
          >
          <i className="fa fa-chevron-left" />
        </Button>
        <Button
          disabled={ page * limit >= count }
          onClick={ () => { history.push(`${path}${page + 1}`) } }
          className="btn-link center-hor m-l-5 p-l-5 p-r-5"
          >
          <i className="fa fa-chevron-right" />
        </Button>
    </div>
  );
}