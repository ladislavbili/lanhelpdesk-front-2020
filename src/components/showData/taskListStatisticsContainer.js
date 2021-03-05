import React from 'react';
import CommandBar from './commandBar';
import ListHeader from './listHeader';

import TaskList from './taskList';
import Statistics from './statistics';

export default function TaskListStatisticsContainer( props ) {
  const {
    history,
    link,
    commandBar,
    listName,
    statuses,
    setStatuses,
    allStatuses,
    displayValues,
    setVisibility,
    data,
    deleteTask,
    checkTask,
    layout,
    underSearch: UnderSearch,
    underSearchLabel,
    tasklistLayoutData,
  } = props;

  const [ underSearchOpen, setUnderSearchOpen ] = React.useState( false );
  const [ showStatistics, setShowStatistics ] = React.useState( false );

  return (
    <div>
      <CommandBar
        {...commandBar}
        listName={listName}
        {...tasklistLayoutData}
        showStatistics={showStatistics}
        setShowStatistics={setShowStatistics}
        />
      <div className="full-width scroll-visible fit-with-header-and-commandbar-4 task-container">

        {
          !showStatistics &&
          <ListHeader
            {...commandBar}
            listName={listName}
            statuses={statuses}
            setStatuses={setStatuses}
            allStatuses={allStatuses}
            underSearchButtonEvent={underSearchLabel ? (() => setUnderSearchOpen(!underSearchOpen)) : null}
            underSearchButtonLabel={underSearchLabel}
            layout={layout}
            />
        }
        {
          !showStatistics &&
          UnderSearch !== undefined &&
          underSearchOpen &&
          <UnderSearch/>
        }

        {
          !showStatistics &&
          <TaskList
            history={history}
            link={link}
            displayValues={displayValues}
            data={data}
            deleteTask={deleteTask}
            checkTask={checkTask}
            />
        }        

        {
          showStatistics &&
          <Statistics
            tasks={data}
            />
        }

      </div>
    </div>
  );
}