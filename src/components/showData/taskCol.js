import React, { Component } from 'react';
import CommandBar from './commandBar';
import ListHeader from './listHeader';
import classnames from "classnames";

export default class ColumnDisplay extends Component {
	render() {
		return (
			<div>
				<CommandBar {...this.props.commandBar} listName={this.props.listName} />
				<ListHeader multiselect={false} greyBackground={true} {...this.props.commandBar} listName={this.props.listName} statuses={this.props.statuses} setStatuses={this.props.setStatuses} allStatuses={this.props.allStatuses} />

			<div className="row p-0 task-container">

					<div className="p-0 golden-ratio-382">
						<div className="scroll-visible fit-with-header-and-commandbar-2 task-list">
							{
								this.props.data.map((item, index)=>
								<ul
									className={classnames("taskCol", "clickable", "list-unstyled", {'selected-item': this.props.itemID === item.id.toString()})}
									id="upcoming"
									style={{borderLeft: (this.props.link.includes("helpdesk") ? ("3px solid " + (item.status ? (item.status.color?item.status.color:'white') : "white")) : "")}}
									onClick={()=>{
										this.props.history.push(this.props.link+'/'+item.id);
									}}
									key={item.id}>
									{this.props.displayCol(item)}
								</ul>
							)
						}
						{
							this.props.data.length===0 &&
							<div className="center-ver" style={{textAlign:'center'}}>
								Neboli nájdené žiadne výsledky pre tento filter
							</div>
						}
						</div>
					</div>
					{
						this.props.itemID && this.props.itemID!=='add' && this.props.data.some((item)=>item.id+""===this.props.itemID) &&
						<this.props.edit match={this.props.match} columns={true} history={this.props.history} />
					}
					{
						(!this.props.itemID || !this.props.data.some((item)=>item.id+""===this.props.itemID)) &&
						(this.props.empty?<this.props.empty/>:null)
					}

				</div>
			</div>
		);
	}
}
