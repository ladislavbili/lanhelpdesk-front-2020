import React, { Component } from 'react';
import {rebase} from '../../../index';
import StatusAdd from './statusAdd';
import StatusEdit from './statusEdit';

export default class Statuses extends Component {
	constructor(props){
    super(props);
    this.state={
      statuses:[],
			search:'',
			openEdit:false,
			openID:null
    }
		this.getStatuses.bind(this);
  }
  componentWillMount(){
    this.ref = rebase.listenToCollection('/cmdb-statuses', {
      context: this,
      withIds: true,
      then:content=>{this.setState({statuses:content, statusFilter:''})},
    });
  }

	componentWillUnmount(){
		rebase.removeBinding(this.ref);
	}

	getStatuses(){
		return this.state.statuses.filter((item)=>item.title.toLowerCase().includes(this.state.search.toLowerCase()))
	}

	render() {
		return (
			<div>
				<div className="commandbar">
					<div className="d-flex flex-row align-items-center">
						<div className="p-2">
							<div className="input-group">
								<input
									type="text"
									value={this.state.search}
									className="form-control search"
									onChange={(e)=>this.setState({search:e.target.value})}
									placeholder="Search" />
									<div className="input-group-append">
										<button className="search-btn" type="button">
											<i className="fa fa-search" />
										</button>
									</div>
							</div>
						</div>
						<StatusAdd/>
					</div>
				</div>

				<div className="fit-with-header-and-commandbar p-20">
						<table className="table">
							<thead >
								<tr>
									<th>
										Status name
									</th>
								</tr>
							</thead>
							<tbody>
								{
									this.getStatuses().map((status)=>
									<tr
										key={status.id}
										className="clickable"
										onClick={()=>{
											this.setState({openEdit:true,openID:status.id})
										}}
										>
										<td>
											{status.title}
										</td>
									</tr>)
								}
							</tbody>
						</table>
				</div>
				<StatusEdit id={this.state.openID} opened={this.state.openEdit} toggle={()=>this.setState({openEdit:false,openID:null})} />
			</div>
			);
		}
	}
