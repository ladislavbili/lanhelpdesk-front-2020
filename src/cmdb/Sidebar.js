import React, {
  Component
} from 'react';
import {
  NavItem,
  Nav,
  Button
} from 'reactstrap';
import {
  NavLink as Link
} from 'react-router-dom';
import Select from "react-select";

//import CompanyAdd from './settings/companies/companyAdd';
//import CompanyEdit from './settings/companies/companyEdit';
import {
  sidebarSelectStyle
} from 'configs/components/select';

import {
  dashboard,
  addCompany,
} from 'configs/constants/sidebar';

import classnames from "classnames";

export default function Sidebar( props ) {

  const companies = [
		dashboard,
		addCompany,
    {
      id: 1,
      title: 'LanHelpdesk',
      label: 'LanHelpdesk',
      value: 1
	}
];

  const [ company, setCompany ] = React.useState( dashboard );

  const items = [
    {
      id: 1,
      title: "All"
	},
    {
      id: 2,
      title: "Schema"
	},
    {
      id: 3,
      title: "Servers"
	},
    {
      id: 4,
      title: "Web pages"
	},
    {
      id: 5,
      title: "Routers"
	},
];

  return (
    <div className="sidebar">
				<div className="scrollable fit-with-header">
					<div className="p-l-15 p-r-15">
						<Select
							options={companies}
							value={company}
							styles={sidebarSelectStyle}
							onChange={e => {}}
							components={{
								DropdownIndicator: ({ innerProps, isDisabled }) =>
								<div style={{marginTop: "-15px"}}>
									<i className="fa fa-chevron-down" style={{position:'absolute', right:5}}/>
								</div>,
							}}
							/>
					</div>

					<hr />

				<Nav vertical>
					<NavItem className={classnames("row full-width sidebar-item", { "active": 'all' === props.match.params.listID }) }>
						<span
							className={ classnames("clickable sidebar-menu-item link", { "active": 'all' === props.match.params.listID }) }
							onClick={() => {
								history.push(`/cmdb/i/all`)
							}}>
							ALL
						</span>
					</NavItem>
					{
						items.map((item) =>
							<NavItem key={item.id} className={classnames("row full-width sidebar-item", { "active": item.id === parseInt(props.match.params.listID) })}>
								<span
									className={ classnames("clickable sidebar-menu-item link", { "active": item.id === parseInt(props.match.params.listID) }) }
									onClick={() => {}}
									>
									{item.title}
								</span>

									<button
										className='btn-link ml-auto m-r-15'
										onClick={() => props.history.push('/cmdb/edit/'+item.id)}
										>
										<i className="fa fa-cog"/>
									</button>

							</NavItem>
						)
					}
					<NavItem className="row full-width">
						<button
							className='btn-link'
							onClick={() => props.history.push('/cmdb/add')}
							>
							<i className="fa fa-plus" />
							Item
						</button>
					</NavItem>
				</Nav>



				{false && <CompanyAdd />}
					{ false && company.id
						&&
						<CompanyEdit item={company}/>
					}


				</div> <
    /div>
  );
}