import React from 'react';

import Loading from 'components/loading';
import CommandBar from '../components/commandBar';
import ListHeader from '../components/listHeader';
import ItemRender from '../components/columnItemRender';
import TaskEdit from '../../edit';
import TaskEmpty from '../../taskEmpty';
import classnames from "classnames";

export default function ColumnList( props ) {
  const {
    match,
    history,
    loading,
    link,
    tasks,
  } = props;

  const taskID = parseInt( match.params.taskID );
  return (
    <div>
      <CommandBar
        {...props}
        />
      <ListHeader {...props} multiselect={false} />

      <div className="row p-0 task-container">

        <div className="p-0 ">
          <div className="scroll-visible fit-with-header-and-commandbar-list task-list">
            { loading &&
              <Loading/>
            }
            { !loading && tasks.map((task, index) =>
              <ul
                className={classnames( "taskCol", "clickable", "list-unstyled", {'selected-item': taskID === task.id} )}
                style={{borderLeft: "3px solid " + ( task.status ? ( task.status.color ? task.status.color : 'white' ) : "white") }}
                onClick={()=>{
                  history.push(link+'/'+task.id);
                }}
                key={task.id}>
                <ItemRender task={task} />
              </ul>
            ) }
          { !loading && tasks.length===0 &&
            <div className="center-ver" style={{textAlign:'center'}}>
              Neboli nájdené žiadne výsledky pre tento filter
            </div>
          }
        </div>
      </div>
      { !isNaN(taskID) && tasks.some((task) => task.id === taskID ) &&
        <TaskEdit match={match} columns={true} history={history} />
      }
      { ( isNaN(taskID) || !tasks.some((task)=>task.id === taskID)) &&
        <TaskEmpty />
      }

    </div>
  </div>
  );
}