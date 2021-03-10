import React from 'react';
import classnames from 'classnames';
import {
  getEmptyGeneralFilter
} from 'configs/constants/filter';
import {
  allMilestones
} from 'configs/constants/sidebar';

import Checkbox from 'components/checkbox';
import Switch from "react-switch";
import {
  Button,
  Popover,
  PopoverHeader,
  PopoverBody,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

export default function CommandBar( props ) {
  const {
    currentUser,
    showStatistics,
    setShowStatistics,
    tasklistLayout,
    setTasklistLayout,
    localFilter,
    setLocalFilter,
    localProject,
    localMilestone,
    setMilestone,
  } = props;

  const [ layoutOpen, setLayoutOpen ] = React.useState( false );

  const getLayoutIcon = () => {
    switch ( tasklistLayout ) {
      case 0:
        return "fa-columns";
      case 1:
        return "fa-list";
      case 2:
        return "fa-map";
      case 3:
        return "fa-calendar-alt";
      default:
        return "fa-cog";
    }
  }

  const getBreadcrumsData = () => {
    return [
      {
        type: 'project',
        show: true,
        data: localProject,
        label: localProject.title,
        onClick: () => {
          setMilestone( allMilestones );
          setLocalFilter( getEmptyGeneralFilter() );
          history.push( '/helpdesk/taskList/i/all' );
        }
      },
      {
        type: 'milestone',
        show: localProject.id !== null && localMilestone.id !== null,
        data: localMilestone,
        label: localMilestone.title,
        onClick: () => {
          setLocalFilter( getEmptyGeneralFilter() );
          history.push( '/helpdesk/taskList/i/all' );
        }
      },
      {
        type: 'filter',
        show: true,
        data: localFilter,
        label: localFilter.title,
        onClick: () => {}
      }
    ]
  }

  const filteredBreadcrums = getBreadcrumsData()
    .filter( ( breadcrum ) => breadcrum.show );

  return (
    <div className={"task-list-commandbar " + (tasklistLayout !== 0 ? "p-l-30 p-r-19" : "p-l-0")}>
      <div className="breadcrum-bar center-hor">
        <div className="flex-row breadcrumbs">
          { filteredBreadcrums.map( (breadcrum, index) =>
            <h2
              className="clickable"
              key={index}
              onClick={breadcrum.onClick}>{`${index !== 0 ? '\\' : ''}${breadcrum.label}`}</h2>
          )}
        </div>
      </div>

      <div className="ml-auto p-2 align-self-center">
        <div className="d-flex flex-row">
          <div className={ classnames(
              {
                "m-r-20": tasklistLayout !== 0,
                "m-r-5": tasklistLayout === 0,
              },
              "d-flex flex-row align-items-center ml-auto"
            )}
            >
            <div className="m-r-5">
              <label className="center-hor">
                <Switch
                  checked={showStatistics}
                  onChange={() => {
                    setShowStatistics(!showStatistics);
                  }}
                  height={22}
                  width={100}
                  checkedIcon={<span className="switchLabel p-l-20">Tasks</span>}
                  uncheckedIcon={<span className="switchLabel-right m-l--40">Statistics</span>}
                  onColor={"#0078D4"}
                  offColor={"#0078D4"}
                  />
                <span className="m-l-10"></span>
              </label>
            </div>

            <Dropdown className="center-hor"
              isOpen={layoutOpen}
              toggle={() => setLayoutOpen(!layoutOpen)}
              >
              <DropdownToggle className="btn btn-link">
                <i className={"fa " + getLayoutIcon()}/>
              </DropdownToggle>
              <DropdownMenu right>
                <div className="btn-group-vertical" data-toggle="buttons">
                  <label className={classnames({'active':tasklistLayout === 0}, "btn btn-link t-a-l")}>
                    <input type="radio" name="options" onChange={() => setTasklistLayout(0)} checked={tasklistLayout === 0}/>
                    <i className="fa fa-columns"/>
                    Trojstlpec
                  </label>
                  <label className={classnames({'active':tasklistLayout === 1}, "btn btn-link t-a-l")}>
                    <input type="radio" name="options" checked={tasklistLayout === 1} onChange={() => setTasklistLayout(1)}/>
                    <i className="fa fa-list"/>
                    Zoznam
                  </label>
                  <label className={classnames({'active':tasklistLayout === 2}, "btn btn-link t-a-l")}>
                    <input type="radio" name="options" onChange={() => setTasklistLayout(2)} checked={tasklistLayout === 2}/>
                    <i className="fa fa-map"/>
                    DnD
                  </label>
                  <label className={classnames({'active':tasklistLayout === 3}, "btn btn-link t-a-l")}>
                    <input type="radio" name="options" onChange={() => setTasklistLayout(3)} checked={tasklistLayout === 3}/>
                    <i className="fa fa-calendar-alt"/>
                    Kalendár
                  </label>
                </div>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
}