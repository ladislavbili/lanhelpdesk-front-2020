import React, {
  Component
} from 'react';
import {
  NavItem,
  Nav,
  Label,
  Button
} from 'reactstrap';
import {
  NavLink as Link
} from 'react-router-dom';
import Select from "react-select";

//import CompanyAdd from './settings/companies/companyAdd';
//import CompanyEdit from './settings/companies/companyEdit';
import {
  sidebarSelectStyle,
  invisibleSelectStyle
} from 'configs/components/select';

import {
  itemCategories as items,
  companies
} from './constants';

import folderIcon from 'scss/icons/folder.svg';
import filterIcon from 'scss/icons/filter.svg';

import classnames from "classnames";

import {
  dashboard,
  addCompany,
} from 'configs/constants/sidebar';

export default function Sidebar( props ) {

  const {
    history,
    match,
  } = props;

  const [ company, setCompany ] = React.useState( dashboard );

  return (
    <div className="sidebar">
				<div className="scrollable fit-with-header">

          <div className="sidebar-label row">
              <img
                className="m-r-5"
                style={{
                  color: "#212121",
                  height: "14px",
                  marginBottom: "0px"
                }}
                src={folderIcon}
                alt="Filter icon not found"
                />
              <Label>
                Company
              </Label>
          </div>

					<div className="p-l-8 p-r-8">
						<Select
							options={companies}
							value={company}
							styles={invisibleSelectStyle}
							onChange={e => {}}
							components={{
								DropdownIndicator: ({ innerProps, isDisabled }) =>
								<div style={{marginTop: "-10px"}}>
									<i className="fa fa-chevron-down" style={{position:'absolute', right:5}}/>
								</div>,
							}}
							/>
					</div>

					<hr/>

            <div className="sidebar-label row">
                <img
                  className="m-r-5"
                  style={{
                    color: "#212121",
                    height: "14px",
                    marginBottom: "0px"
                  }}
                  src={filterIcon}
                  alt="Filter icon not found"
                  />
                <Label>
                  Item Category
                </Label>
            </div>

				<Nav vertical>
					<NavItem className={classnames("row full-width sidebar-item", { "active": 'all' === match.params.itemCategoryID }) }>
						<span
							className={ classnames("clickable sidebar-menu-item link", { "active": 'all' === match.params.itemCategoryID }) }
							onClick={() => {
								history.push(`/cmdb/i/all`)
							}}>
							ALL
						</span>
					</NavItem>
					{
						items.map((item) =>
							<NavItem key={item.id} className={classnames("row full-width sidebar-item", { "active": item.id === parseInt(match.params.itemCategoryID) })}>
								<span
									className={ classnames("clickable sidebar-menu-item link", { "active": item.id === parseInt(match.params.itemCategoryID) }) }
									onClick={() => history.push('/cmdb/i/'+item.id)}
									>
									{item.title}
								</span>

                {
                  item.id === parseInt(match.params.itemCategoryID) &&
                  <div
                    className={classnames("sidebar-icon", "clickable p-r-10", {"active" : item.id === parseInt(match.params.itemCategoryID)})}
                    onClick={() => history.push('/cmdb/edit-category/'+item.id)}
                    >
                    <i className="fa fa-cog"/>
                  </div>
                }

							</NavItem>
						)
					}


          					<hr/>

					<NavItem className="row full-width">
						<button
              className="btn sidebar-btn m-l-5 m-r-5"
              style={{width: "calc(100% - 10px)"}}
							onClick={() => history.push('/cmdb/add')}
							>
							<i className="fa fa-plus" />
							Item
						</button>
					</NavItem>
				</Nav>

      <div className='p-l-15 p-r-15'>

        <NavItem className="row full-width">
          <Button
            className='btn-link'
            onClick={ () =>  {} }
            >
            <i className="fa fa-plus" />
            Company
          </Button>
        </NavItem>

        <NavItem className="row full-width">
          <Button
            className='btn-link'
            onClick={ () => history.push('/cmdb/add-category') }
            >
            <i className="fa fa-plus" />
            Item Category
          </Button>
        </NavItem>


				{false && <CompanyAdd />}

      </div>
				</div> <
    /div>
  );
}