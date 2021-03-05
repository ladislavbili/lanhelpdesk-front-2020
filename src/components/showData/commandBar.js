import React from 'react';
import {
  useQuery,
  useLazyQuery,
} from "@apollo/client";
import classnames from 'classnames';
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
import Checkbox from 'components/checkbox';
import Switch from "react-switch";
import {
  objectToAtributeArray
} from 'helperFunctions';

import {
  GET_PROJECT,
} from 'apollo/localSchema/queries';

import {
  GET_MY_DATA,
  GET_PROJECT_GROUPS
} from './queries';

export default function CommandBar( props ) {
  const {
    setLayout,
    showLayoutSwitch,
    dndLayout,
    calendarLayout,
    showStatistics,
    setShowStatistics,
  } = props;

  const [ popoverOpen, setPopoverOpen ] = React.useState( false );
  const [ layoutOpen, setLayoutOpen ] = React.useState( false );

  const {
    data: myData,
    loading: myDataLoading,
  } = useQuery( GET_MY_DATA );

  const {
    data: projectData,
    loading: projectLoading,
  } = useQuery( GET_PROJECT );

  const [ fetchProjectGroups, {
    loading: projectGroupsLoading,
    data: projectGroupsData
  } ] = useLazyQuery( GET_PROJECT_GROUPS );

  const currentUser = myData ? myData.getMyData : {};

  React.useEffect( () => {
    if ( !projectLoading ) {
      if ( projectData.localProject.id !== null ) {
        fetchProjectGroups( {
          variables: {
            id: projectData.localProject.id
          }
        } );
      }
    }
  }, [ projectLoading ] );

  const getLayoutIcon = () => {
    switch ( currentUser.tasklistLayout ) {
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

  const FILTERED_BREADCRUMBS = ( props.breadcrumsData ? props.breadcrumsData.filter( ( breadcrum ) => breadcrum.show ) : [] );

  return (
    <div className={"task-list-commandbar " + (props.layout !== 0 ? "p-l-30 p-r-19" : "p-l-0")}>

      <div className="breadcrum-bar center-hor">
        {
          props.useBreadcrums !== true &&
          <div className="breadcrumbs">
            <h2>
              {props.listName?props.listName:""}
            </h2>
          </div>
        }
        {props.useBreadcrums  &&
          <div className="flex-row breadcrumbs">
            { FILTERED_BREADCRUMBS.map((breadcrum, index) =>
              <h2
                className="clickable"
                key={index}
                onClick={breadcrum.onClick}>{`${index !== 0 ? '\\' : ''}${breadcrum.label}`}</h2>
            )}
          </div>
        }

      </div>

      <div className="ml-auto p-2 align-self-center">
        <div className="d-flex flex-row">
          <div className={classnames({"m-r-20": (props.link.includes("settings")
            || (props.link.includes("lanwiki") && props.layout === 1)
            || (props.link.includes("passmanager") && props.layout === 1)
            || (props.link.includes("expenditures") && props.layout === 1)
            || (props.link.includes("helpdesk") && !props.link.includes("settings") && props.layout !== 0))},

            {"m-r-5": (props.link.includes("helpdesk") && !props.link.includes("settings") && props.layout === 0)
              || (props.link.includes("passmanager") && props.layout === 0)
              || (props.link.includes("expenditures") && props.layout === 0)
              || (props.link.includes("lanwiki") && props.layout === 0)},

              "d-flex", "flex-row", "align-items-center", "ml-auto")}
              >

              <div className="m-r-5">
                <label className="center-hor">
                  <Switch
                    checked={showStatistics}
                    onChange={(checked)=>{
                      setShowStatistics(!showStatistics);
                    }}
                    height={22}
                    width={90}
                    checkedIcon={<span className="switchLabel">Statistics</span>}
                    uncheckedIcon={<span className="switchLabel-right">Tasks</span>}
                    onColor={"#0078D4"} />
                  <span className="m-l-10"></span>
                </label>
              </div>

              {
                showLayoutSwitch &&
                <Dropdown className="center-hor"
                  isOpen={layoutOpen}
                  toggle={() => setLayoutOpen(!layoutOpen)}
                  >
                  <DropdownToggle className="btn btn-link">
                    <i className={"fa " + getLayoutIcon()}/>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <div className="btn-group-vertical" data-toggle="buttons">
                      <label className={classnames({'active':currentUser.tasklistLayout === 0}, "btn btn-link t-a-l")}>
                        <input type="radio" name="options" onChange={() => setLayout(0)} checked={currentUser.tasklistLayout === 0}/>
                        <i className="fa fa-columns"/> Trojstlpec
                      </label>
                      <label className={classnames({'active':currentUser.tasklistLayout === 1}, "btn btn-link t-a-l")}>
                        <input type="radio" name="options" checked={currentUser.tasklistLayout === 1} onChange={() => setLayout(1)}/>
                        <i className="fa fa-list"/> Zoznam
                      </label>
                      {
                        dndLayout &&
                        <label className={classnames({'active':currentUser.tasklistLayout === 2}, "btn btn-link t-a-l")}>
                          <input type="radio" name="options" onChange={() => setLayout(2)} checked={currentUser.tasklistLayout === 2}/>
                          <i className="fa fa-map"/> DnD
                        </label>
                      }

                      {
                        calendarLayout &&
                        <label className={classnames({'active':currentUser.tasklistLayout === 3}, "btn btn-link t-a-l")}>
                          <input type="radio" name="options" onChange={() => setLayout(3)} checked={currentUser.tasklistLayout === 3}/>
                          <i className="fa fa-calendar-alt"/> Kalendár
                        </label>
                      }
                    </div>
                  </DropdownMenu>
                </Dropdown>
              }

            </div>
          </div>
        </div>
      </div>
  );
}