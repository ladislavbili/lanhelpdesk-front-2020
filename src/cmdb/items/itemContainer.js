import React, { Component } from 'react';
import ItemEdit from './itemEdit';
import ItemView from './itemView';

export default class ItemContainer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			edit:false,
			saving:false,
			delete:false
		};
	}

	render() {
		return (
			<div className="form-background fit-with-header" style={{padding:0,border:'none'}}>
				<div className="commandbar flex-row p-l-25">
							{ !this.state.edit &&
								<button type="button" className="center-hor btn btn-link-reversed waves-effect" onClick={()=>this.setState({edit:true})}>
									<i
										className="fas fa-pen commandbar-command-icon"
										/>
									{false && <img
										className="commandbar-icon"
										src={require('../../scss/icons/edit.svg')}
										alt="Generic placeholder XX"
										/>}
									{" Edit"}
								</button>
							}
							{ this.state.edit &&
								<button type="button" className="center-hor btn btn-link-reversed waves-effect" onClick={()=>this.setState({edit:false})}>
									<i
										className="fas fa-file-invoice commandbar-command-icon"
										/>
									{" View"}
								</button>
							}
							{ this.state.edit &&
								<button type="button" className="center-hor btn btn-link-reversed waves-effect" onClick={()=>this.setState({saving:true})} disabled={this.state.saving}>
									<i
										className="fas fa-save commandbar-command-icon"
										/>
									{this.state.saving?" Saving...":" Save"}
								</button>
							}
							<button type="button" className="center-hor btn btn-link-reversed waves-effect" onClick={()=>this.setState({delete:true})} disabled={this.state.delete}>
								<i
									className="fas fa-trash commandbar-command-icon"
									/>
								{" Delete"}
							</button>
				</div>
				{
					this.state.edit &&
					<ItemEdit {...this.props} toView={() => this.setState({edit: false})} delete={this.state.delete} saving={this.state.saving} setDeleting={(deleting)=>this.setState({delete:deleting})} setSaving={(saving)=>this.setState({saving})} />
				}
				{
					!this.state.edit &&
					<ItemView {...this.props} delete={this.state.delete} setDeleting={(deleting)=>this.setState({delete:deleting})} />
				}
			</div>
			);
		}
	}
