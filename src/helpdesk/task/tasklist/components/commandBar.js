import React from 'react';
import MultiSelect from 'components/MultiSelectNew';
import Empty from 'components/Empty';
import classnames from 'classnames';
import {
  getEmptyGeneralFilter
} from 'configs/constants/filter';
import {
  allMilestones
} from 'configs/constants/sidebar';
import {
  orderByValues,
  attributeLimitingRights,
  ganttAttributeLimitingRights,
} from 'configs/constants/tasks';

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

// breadcrums, layout switch
export default function CommandBar( props ) {
  const {
    loading,
    tasklistLayout,
    setTasklistLayout,
    localFilter,
    setLocalFilter,
    localProject,
    localMilestone,
    setMilestone,
    canViewCalendar,
    displayValues: allDisplayValues,
    setPreference,
    ascending,
    orderBy,
    setOrderBy,
    setAscending,
    gantt,
    showSort,
    showPreferences,
  } = props;
  //prop constants
  const displayValues = (
    allDisplayValues ?
    allDisplayValues
    .filter( ( displayValue ) => displayValue.type !== 'checkbox' )
    .map( ( displayValue ) => ( {
      ...displayValue,
      id: displayValue.value
    } ) ) : []
  );

  //state
  const [ layoutOpen, setLayoutOpen ] = React.useState( false );
  const [ columnPreferencesOpen, setColumnPreferencesOpen ] = React.useState( false );

  //fucs
  const openColumnPreferences = () => setColumnPreferencesOpen( !columnPreferencesOpen );

  const getPreferenceColumns = () => {
    if ( localProject.project.id === null ) {
      return displayValues;
    }
    let notAllowedColumns = ( gantt ? ganttAttributeLimitingRights : attributeLimitingRights )
      .filter( ( limitingRight ) => !localProject.right[ limitingRight.right ] )
      .map( ( limitingRight ) => limitingRight.preference );
    return displayValues.filter( ( column ) => !notAllowedColumns.includes( column.value ) );
  }

  const getLayoutIcon = () => {
    switch ( tasklistLayout ) {
      case 0:
        //return "fa-columns";
      case 1:
        return "fa-list";
      case 2:
        return "fa-map";
      case 3:
        return "fa-calendar-alt";
      case 4:
        return "fa-project-diagram";
      case 5:
        return "fa-chart-bar";
      default:
        return "fa-cog";
    }
  }

  const getLayoutTitle = () => {
    switch ( tasklistLayout ) {
      case 0:
        //return "fa-columns";
      case 1:
        return "Zoznam";
      case 2:
        return "DnD";
      case 3:
        return "Kalendár";
      case 4:
        return "Project management";
      case 5:
        return "Statistics";
      default:
        return "";
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
    <div className="task-list-commandbar m-l-30 m-r-45">
      <div className="breadcrum-bar center-hor">
        <div className="flex-row breadcrumbs">
          { filteredBreadcrums.map( (breadcrum, index) =>
            <h2
              className="clickable"
              key={index}
              onClick={breadcrum.onClick}>{`${index !== 0 && breadcrum.label ? '\\' : ''}${breadcrum.label}`}</h2>
          )}
        </div>
      </div>

      <div className="ml-auto p-2 align-self-center">
        <div className="d-flex flex-row">
          <div className={ classnames(
              "d-flex flex-row align-items-center ml-auto"
            )}
            >

            <div className="d-flex flex-row">
              <div className={classnames( "d-flex", "flex-row", "align-items-center", "ml-auto" )} >
                { showSort &&
                  <Empty>
                    <div className="text-basic m-r-5 m-l-5">
                      Sort by
                    </div>

                    <select
                      value={orderBy}
                      className="invisible-select text-bold text-highlight"
                      onChange={(e)=>setOrderBy(e.target.value)}>
                      { orderByValues.map((item,index) =>
                        <option value={item.value} key={index}>{item.label}</option>
                      ) }
                    </select>

                    { ascending &&
                      <button type="button" className="btn-link" onClick={()=>setAscending(false)}>
                        <i className="fas fa-arrow-up" />
                      </button>
                    }

                    { !ascending &&
                      <button type="button" className="btn-link" onClick={()=>setAscending(true)}>
                        <i className="fas fa-arrow-down" />
                      </button>
                    }
                  </Empty>
                }
                { showPreferences &&
                  <div className="row">
                    <button className="btn-link m-l-10" onClick={ openColumnPreferences } >
                      <i className="fa fa-cog" />
                    </button>
                    <MultiSelect
                      disabled={loading}
                      className="center-hor"
                      menuClassName="m-t-30"
                      bodyClassName="p-l-10 p-r-10 scrollable"
                      bodyStyle={{ maxHeight: 300 }}
                      direction="left"
                      style={{}}
                      header="Select task list columns"
                      closeMultiSelect={openColumnPreferences}
                      showFilter={false}
                      open={columnPreferencesOpen}
                      items={getPreferenceColumns().filter((displayValue) => !displayValue.permanent )}
                      selected={getPreferenceColumns().filter((displayValue) => displayValue.show )}
                      onChange={(_, item, deleted ) => {
                        let newVisibility = {};
                        displayValues.filter((displayValue) => !displayValue.permanent ).forEach((displayValue) => {
                          if(displayValue.id !== item.id){
                            newVisibility[displayValue.visKey ? displayValue.visKey : displayValue.value ] = displayValue.show;
                          }else{
                            newVisibility[displayValue.visKey ? displayValue.visKey : displayValue.value] = !deleted;
                          }
                        })
                        setPreference(newVisibility);
                      }}
                      />
                  </div>
                }

              </div>
            </div>

            <Dropdown className="center-hor m-l-5"
              isOpen={layoutOpen}
              toggle={() => setLayoutOpen(!layoutOpen)}
              >
              <DropdownToggle className="btn btn-link">
                <i className={"m-r-5 fa " + getLayoutIcon()}/>
                {getLayoutTitle()}
              </DropdownToggle>
              <DropdownMenu right>
                <div className="btn-group-vertical" data-toggle="buttons">
                  {
                    /*
                    <label className={classnames({'active':tasklistLayout === 0}, "btn btn-link t-a-l")}>
                    <input type="radio" name="options" onChange={() => setTasklistLayout(0)} checked={tasklistLayout === 0}/>
                    <i className="fa fa-columns"/>
                    {` Trojstlpec`}
                    </label>
                    */
                  }
                  <label className={classnames({'active':tasklistLayout === 1 || tasklistLayout === 0}, "btn btn-link t-a-l")}>
                    <input type="radio" name="options" checked={tasklistLayout === 1 || ( tasklistLayout === 2 && localProject.id === null ) } onChange={() => setTasklistLayout(1)}/>
                    <i className="fa fa-list m-r-5"/>
                    Zoznam
                  </label>
                  { localProject.id &&
                    <label className={classnames({'active':tasklistLayout === 2}, "btn btn-link t-a-l")}>
                      <input type="radio" name="options" onChange={() => setTasklistLayout(2)} checked={tasklistLayout === 2}/>
                      <i className="fa fa-map m-r-5"/>
                      DnD
                    </label>
                  }
                  { canViewCalendar &&
                    <label className={classnames({'active':tasklistLayout === 3}, "btn btn-link t-a-l")}>
                      <input type="radio" name="options" onChange={() => setTasklistLayout(3)} checked={tasklistLayout === 3}/>
                      <i className="fa fa-calendar-alt m-r-5"/>
                      Kalendár
                    </label>
                  }
                  { localProject.id &&
                    <label className={classnames({'active':tasklistLayout === 4}, "btn btn-link t-a-l")}>
                      <input type="radio" name="options" onChange={() => setTasklistLayout(4)} checked={tasklistLayout === 4}/>
                      <i className="fa fa-project-diagram m-r-5"/>
                      Project management
                    </label>
                  }
                  { localProject.id &&
                    <label className={classnames({'active':tasklistLayout === 5}, "btn btn-link t-a-l")}>
                      <input
                        type="radio"
                        name="options"
                        onChange={() =>{
                          setTasklistLayout(5);
                        }}
                        checked={tasklistLayout === 5}
                        />
                      <i className="fa fa-chart-bar m-r-5"/>
                      Statistics
                    </label>
                  }
                </div>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );
}