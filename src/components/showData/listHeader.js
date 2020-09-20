import React, { Component } from 'react';
import { connect } from "react-redux";
//import Search from './search';
//import Checkbox from '../checkbox';
//import Multiselect from '../multiselect';
import classnames from "classnames";

class ListHeader extends Component {
	render() {
		return (
				<div
					className={classnames("d-flex", "p-b-10", "flex-row", {'bkg-F6F6F6': this.props.greyBackground})}>
				</div>
		);
	}
}

const mapStateToProps = ({ userReducer }) => {
	return { currentUser:userReducer };
};
/*

<Search {...this.props}/>
{ !this.props.multiselect && this.props.statuses &&
	<div className="center-hor flex-row">
		<Checkbox
			className="m-l-5  m-r-10"
			label= "All"
			value={ this.props.statuses.length===0 || this.props.allStatuses.every((status)=>this.props.statuses.includes(status.id)) }
			onChange={()=>{
				if(this.props.statuses.length===0){
					let newStatuses = this.props.allStatuses.map((status) => status.id );
				//	rebase.updateDoc('/users/'+this.props.currentUser.id, {statuses:newStatuses});
					this.props.setStatuses( newStatuses );
				}else{
			//		rebase.updateDoc('/users/'+this.props.currentUser.id, {statuses:[]});
					this.props.setStatuses( [] );
				}
			}}
			/>
		{ this.props.allStatuses.map((status)=>
			<Checkbox
				key={status.id}
				className="m-l-5 m-r-10"
				label={ status.title }
				value={ this.props.statuses.includes(status.id) }
				onChange={()=>{
					if(this.props.statuses.includes(status.id)) {
						let newStatuses = this.props.statuses.filter( (id) => !(status.id === id) );
				//		rebase.updateDoc('/users/'+this.props.currentUser.id, {statuses:newStatuses});
						this.props.setStatuses( newStatuses );
					}else{
						let newStatuses = [...this.props.statuses, status.id];
				//		rebase.updateDoc('/users/'+this.props.currentUser.id, {statuses:newStatuses});
						this.props.setStatuses(newStatuses);
					}
				}}
				/>
			)}
		</div>
	}
	{ this.props.multiselect && this.props.statuses &&
		<Multiselect
			className="ml-auto m-r-10"
			options={ [{ id:'All', label: 'All' }, ...this.props.allStatuses.map((status)=>({...status,label:status.title}))] }
			value={
				[{ id:'All', label: 'All' }, ...this.props.allStatuses.map((status)=>({...status,label:status.title}))]
				.filter((status)=> this.props.statuses.includes(status.id))
				.concat(this.props.allStatuses.every((status)=>this.props.statuses.includes(status.id))?[{ id:'All', label: 'All' }]:[])
			}
			label={ "Status filter" }
			onChange={ (status) => {
				if(status.id === 'All'){
					if(this.props.statuses.length===0){
						let newStatuses = this.props.allStatuses.map((status) => status.id );
				//		rebase.updateDoc('/users/'+this.props.currentUser.id, {statuses:newStatuses});
						this.props.setStatuses( newStatuses );
					}else{
						rebase.updateDoc('/users/'+this.props.currentUser.id, {statuses:[]});
						this.props.setStatuses( [] );
					}
				}else{
					if(this.props.statuses.includes(status.id)) {
						let newStatuses = this.props.statuses.filter( (id) => !(status.id === id) );
			//			rebase.updateDoc('/users/'+this.props.currentUser.id, {statuses:newStatuses});
						this.props.setStatuses( newStatuses );
					}else{
						let newStatuses = [...this.props.statuses, status.id];
		//				rebase.updateDoc('/users/'+this.props.currentUser.id, {statuses:newStatuses});
						this.props.setStatuses(newStatuses);
					}
				}
			} }
			/>
}
*/

export default connect(mapStateToProps, {  })(ListHeader);
