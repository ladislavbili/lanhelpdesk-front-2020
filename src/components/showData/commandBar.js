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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';
import Checkbox from 'components/checkbox';
import MultiSelect from 'components/MultiSelectNew';
import CustomAttributes from "helpdesk/settings/projects/components/customAttributes";
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
    displayValues: allDisplayValues,
    setVisibility,
  } = props;

  const displayValues = allDisplayValues
    .filter( ( displayValue ) => displayValue.type !== 'checkbox' )
    .map( ( displayValue ) => ( {
      ...displayValue,
      id: displayValue.value
    } ) );
  const [ popoverOpen, setPopoverOpen ] = React.useState( false );
  const [ openCustomAttributes, setOpenCustomAttributes ] = React.useState( false );
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

  const toggle = () => setPopoverOpen( !popoverOpen );

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

  const canAddCustomAttributes = projectGroupsData ? projectGroupsData.project.groups.some( group => objectToAtributeArray( group.users, "id" )
    .includes( currentUser.id ) && group.rights.projectSecondary ) : false;

  return (
    <div className={"task-list-commandbar " + (props.layout !== 0 ? "p-l-30" : "p-l-0")}>

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

              { canAddCustomAttributes &&
                <button type="button" className="btn-link" onClick={() => setOpenCustomAttributes(true)}>
                  <i className="fa fa-plus"/> Custom Attribute
                  </button>
                }

                <Modal isOpen={openCustomAttributes} className="modal-without-borders">
                  <ModalBody style={{padding: "20px"}}>
                    <CustomAttributes
                      disabled={false}
                      customAttributes={[]}
                      addCustomAttribute={() => {
                      }}
                      updateCustomAttribute={() => {
                      }}
                      deleteCustomAttribute={() => {}}
                      />
                  </ModalBody>
                  <ModalFooter className="p-l-20 p-r-20">
                    <button type="button" className="btn btn-link-cancel mr-auto" onClick={() => setOpenCustomAttributes(false)}>
                      Close
                    </button>
                  </ModalFooter>
                </Modal>

                <div className="text-basic m-r-5 m-l-5">
                  Sort by
                </div>

                <select
                  value={props.orderBy}
                  className="invisible-select text-bold text-highlight"
                  onChange={(e)=>props.setOrderBy(e.target.value)}>
                  { props.orderByValues.map((item,index) =>
                    <option value={item.value} key={index}>{item.label}</option>
                  ) }
                </select>

                { !props.ascending &&
                  <button type="button" className="btn btn-link btn-outline-blue waves-effect" onClick={()=>props.setAscending(true)}>
                    <i className="fas fa-arrow-up" />
                  </button>
                }

                { props.ascending &&
                  <button type="button" className="btn btn-link btn-outline-blue waves-effect" onClick={()=>props.setAscending(false)}>
                    <i className="fas fa-arrow-down" />
                  </button>
                }

                <div className="row">
                  <button className="btn btn-link waves-effect" onClick={ toggle } >
                    <i className="fa fa-cog" />
                  </button>
                  <MultiSelect
                    className="center-hor"
                    menuClassName="m-t-30"
                    bodyClassName="p-l-10 p-r-10 scrollable"
                    bodyStyle={{ maxHeight: 300 }}
                    direction="left"
                    style={{}}
                    header="Select task list columns"
                    closeMultiSelect={toggle}
                    showFilter={false}
                    open={popoverOpen}
                    items={displayValues}
                    selected={displayValues.filter((displayValue) => displayValue.show )}
                    onChange={(_, item, deleted ) => {
                      let newVisibility = {};
                      displayValues.forEach((displayValue) => {
                        if(displayValue.id !== item.id){
                          newVisibility[displayValue.visKey ? displayValue.visKey : displayValue.value ] = displayValue.show;
                        }else{
                          newVisibility[displayValue.visKey ? displayValue.visKey : displayValue.value] = !deleted;
                        }
                      })
                      setVisibility(newVisibility);
                    }}
                    />
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
                        <label className={classnames({'active':currentUser.tasklistLayout === 0}, "btn btn-link")}>
                          <input type="radio" name="options" onChange={() => setLayout(0)} checked={currentUser.tasklistLayout === 0}/>
                          <i className="fa fa-columns"/>
                        </label>
                        <label className={classnames({'active':currentUser.tasklistLayout === 1}, "btn btn-link")}>
                          <input type="radio" name="options" checked={currentUser.tasklistLayout === 1} onChange={() => setLayout(1)}/>
                          <i className="fa fa-list"/>
                        </label>
                        {
                          dndLayout &&
                          <label className={classnames({'active':currentUser.tasklistLayout === 2}, "btn btn-link")}>
                            <input type="radio" name="options" onChange={() => setLayout(2)} checked={currentUser.tasklistLayout === 2}/>
                            <i className="fa fa-map"/>
                          </label>
                        }

                        {
                          calendarLayout &&
                          <label className={classnames({'active':currentUser.tasklistLayout === 3}, "btn btn-link")}>
                            <input type="radio" name="options" onChange={() => setLayout(3)} checked={currentUser.tasklistLayout === 3}/>
                            <i className="fa fa-calendar-alt"/>
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