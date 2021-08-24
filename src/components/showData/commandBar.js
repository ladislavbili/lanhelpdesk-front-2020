import React from 'react';
import classnames from 'classnames';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap';

export default function CommandBar( props ) {
  const {
    setLayout,
    layout,
    showLayoutSwitch,
    breadcrumsData,
    useBreadcrums,
    listName,
    link,
  } = props;

  const [ layoutOpen, setLayoutOpen ] = React.useState( false );

  const getLayoutIcon = () => {
    switch ( layout ) {
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

  const FILTERED_BREADCRUMBS = ( breadcrumsData ? breadcrumsData.filter( ( breadcrum ) => breadcrum.show ) : [] );

  return (
    <div className={"task-list-commandbar " + (layout !== 0 ? "p-l-30 p-r-19" : "p-l-0")}>

      <div className="breadcrum-bar center-hor">
        {
          useBreadcrums !== true &&
          <div className="breadcrumbs">
            <h2>
              {listName ? listName : ""}
            </h2>
          </div>
        }
        { useBreadcrums  &&
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
          <div className={classnames({"m-r-20": (link.includes("settings")
            || (link.includes("lanwiki") && layout === 1)
            || (link.includes("passmanager") && layout === 1)
            || (link.includes("expenditures") && layout === 1))},

            {"m-r-5": (link.includes("passmanager") && layout === 0)
              || (link.includes("expenditures") && layout === 0)
              || (link.includes("lanwiki") && layout === 0)},

              "d-flex", "flex-row", "align-items-center", "ml-auto")}
              >

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
                      <label className={classnames({'active':layout === 0}, "btn btn-link text-left")}>
                        <input type="radio" name="options" onChange={() => setLayout(0)} checked={layout === 0}/>
                        <i className="fa fa-columns"/>
                        {` Trojstlpec`}
                      </label>
                      <label className={classnames({'active':layout === 1}, "btn btn-link text-left")}>
                        <input type="radio" name="options" checked={layout === 1} onChange={() => setLayout(1)}/>
                        <i className="fa fa-list"/>
                        {` Zoznam`}
                      </label>
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