import React from 'react';
import {
  Button
} from 'reactstrap';
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
    taskList
  } = props;

  const {
    t
  } = useTranslation();

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
    <div className={classnames("row m-b-10 ml-auto", {"m-r-30": taskList})}>
      <div className="message ml-auto m-t-1">
        { `${ tasksFrom }-${ tasksTo } ${!shortForm ? t('fromTotalOf').toLowerCase() : t('of')} ${count} ${!shortForm ? t('tasks2').toLowerCase()  : ''}` }
      </div>
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