import React from 'react';
import classnames from 'classnames';

export default function CommandBar( props ) {

  const FILTERED_BREADCRUMBS = ( props.breadcrumsData ? props.breadcrumsData.filter( ( breadcrum ) => breadcrum.show ) : [] );
  return (
    <div className={"commandbar " + (props.layout !== 0 ? "p-l-20" : "p-l-0")}>

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
						{ FILTERED_BREADCRUMBS.map((breadcrum, index)=>
							<h2
								className="clickable"
								key={index}
								onClick={breadcrum.onClick}>{breadcrum.label + ((FILTERED_BREADCRUMBS.length - 1 !== index) ? ` \\ ` : "")}</h2>
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
							<div className="text-basic m-r-5 m-l-5">
								Sort by
							</div>

							<select
								value={props.orderBy}
								className="invisible-select text-bold text-highlight"
								onChange={(e)=>props.setOrderBy(e.target.value)}>
								{ props.orderByValues.map((item,index)=>
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
						</div>
					</div>
				</div>
			</div>
  );
}