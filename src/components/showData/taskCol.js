import React from 'react';
import { useQuery, useMutation, useApolloClient } from "@apollo/react-hooks";
import gql from "graphql-tag";

import CommandBar from './commandBar';
import ListHeader from './listHeader';
import classnames from "classnames";

export default function ColumnDisplay(props) {
	const {match, history, commandBar, useBreadcrums, breadcrumsData, listName, Empty, data, itemID, link, displayCol, isTask, setStatuses, statuses, allStatuses, Edit} = props;

	return (
		<div>
			<CommandBar {...commandBar} listName={listName} />
			<ListHeader multiselect={false} greyBackground={true} {...commandBar} listName={listName} statuses={statuses} setStatuses={setStatuses} allStatuses={allStatuses} />

		<div className="row p-0 task-container">

				<div className="p-0 golden-ratio-382">
					<div className="scroll-visible fit-with-header-and-commandbar-2 task-list">
						{
							data.map((item, index)=>
							<ul
								className={classnames("taskCol", "clickable", "list-unstyled", {'selected-item': itemID.toString() === item.id.toString()})}
								id="upcoming"
								style={{borderLeft: (link.includes("helpdesk") ? ("3px solid " + (item.status ? (item.status.color?item.status.color:'white') : "white")) : "")}}
								onClick={()=>{
									history.push(link+'/'+item.id);
								}}
								key={item.id}>
								{displayCol(item)}
							</ul>
						)
					}
					{
						data.length===0 &&
						<div className="center-ver" style={{textAlign:'center'}}>
							Neboli nájdené žiadne výsledky pre tento filter
						</div>
					}
					</div>
				</div>
				{
					itemID && itemID!=='add' && data.some((item)=>item.id.toString()===itemID.toString()) &&
					<Edit match={match} columns={true} history={history} />
				}
				{
					(!itemID || !data.some((item)=>item.id+""===itemID)) &&
					(Empty?<Empty/>:null)
				}

			</div>
		</div>
	);
}
