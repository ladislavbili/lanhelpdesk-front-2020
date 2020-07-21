import React, { Component } from 'react';
import { Button } from 'reactstrap';
import { connect } from "react-redux";
import {storageUsersStart} from '../../../redux/actions';
import Select from "react-select";
import {selectStyle} from "configs/components/select";
import {toSelArr} from '../../../helperFunctions';
import Checkbox from '../../../components/checkbox';

class Permissions extends Component {
	constructor(props) {
		super();
		this.state = {
			users: [],
			chosenUser: null,
		};
	}

	componentWillMount(){
		if(!this.props.usersActive){
			this.props.storageUsersStart();
		}
		this.setState({users:toSelArr(this.props.users,'email')})
	}


	componentWillReceiveProps(props){
	  if(props.usersLoaded && !this.props.usersLoaded){
	    this.setState({users:toSelArr(props.users,'email')})
	  }
	}

	render() {
		return (
			<div >
				<h3 className="m-t-20 m-b-20"> Prístupové práva </h3>
				<div className="row">
					<div className="m-r-10 center-hor">
						<label className="">
							Používateľ
						</label>
					</div>
					<div className="flex m-r-10">
						<Select
							value={this.state.chosenUser}
							styles={selectStyle}
							onChange={(e)=> this.setState({chosenUser: e})}
							options={this.state.users.filter((user)=> user.role.value > -1 && !this.props.permissions.map((permission)=>permission.user.id).includes(user.id))}
							/>
					</div>
					<div>
						<Button className="btn" disabled={this.state.chosenUser===null} onClick={() => {this.props.addUser(this.state.chosenUser);this.setState({chosenUser:null})}}>Pridať</Button>
					</div>
				</div>

				{	this.props.permissions.length > 0
					&&
					<table className="table m-t-10">
						<thead>
							<tr>
								<th > Username </th>
								<th className="t-a-c"> Read </th>
								<th className="t-a-c"> Write </th>
								<th className="t-a-c"> Delete</th>
								<th className="t-a-c"> Admin</th>
								<th className="t-a-c"> Internal</th>
								<th className="t-a-c"></th>
							</tr>
						</thead>

						<tbody>
							{
								this.props.permissions.map(permission =>
								<tr key={permission.user.id}>
									<td> {permission.user.email} </td>
										<td>
											<Checkbox
				                className = "m-l-5 m-r-5"
												centerVer
												centerHor
												disabled = {this.props.userID===permission.user.id && !this.props.isAdmin}
												value = { permission.read }
												onChange={()=>{
													let permissions = null;
													if(permission.read){
														permissions={read:false, write:false, delete:false, isAdmin:false, internal: permission.internal }
													}else{
														permissions={read:true, write:false, delete:false, isAdmin:false, internal: permission.internal }
													}
													this.props.givePermission(permission.user,permissions);
												}}
				                />
										</td>

										<td>
											<Checkbox
				                className = "m-l-5 m-r-5"
												centerVer
												centerHor
				                value = { permission.write }
												disabled={ this.props.userID===permission.user.id && !this.props.isAdmin }
												onChange={()=>{
													let permissions = null;
													if(permission.write){
														permissions={read:true, write:false, delete:false, isAdmin:false, internal: permission.internal }
													}else{
														permissions={read:true, write:true, delete:false, isAdmin:false, internal: permission.internal }
													}
													this.props.givePermission(permission.user,permissions);
												}}
				                />
										</td>

										<td>
											<Checkbox
				                className = "m-l-5 m-r-5"
												centerVer
												centerHor
				                value = { permission.delete }
				                disabled={this.props.userID===permission.user.id && !this.props.isAdmin}
												onChange={()=>{
													let permissions = null;
													if(permission.delete){
														permissions={read:true, write:true, delete:false, isAdmin:false, internal: permission.internal }
													}else{
														permissions={read:true, write:true, delete:true, isAdmin:false, internal: permission.internal }
													}
													this.props.givePermission(permission.user,permissions);
												}}
				                />
										</td>
										<td>
											<Checkbox
				                className = "m-l-5 m-r-5"
												centerVer
												centerHor
				                value = { permission.isAdmin }
												disabled={this.props.userID===permission.user.id && !this.props.isAdmin}
												onChange={()=>{
													let permissions = null;
													if(permission.isAdmin){
														permissions={read:true, write:true, delete:true, isAdmin:false, internal: permission.internal }
													}else{
														permissions={read:true, write:true, delete:true, isAdmin:true, internal: permission.internal }
													}
													this.props.givePermission(permission.user,permissions);
												}}
				                />
										</td>
										<td>
											<Checkbox
				                className = "m-l-5 m-r-5"
												centerVer
												centerHor
												disabled={this.props.userID===permission.user.id && !this.props.isAdmin}
				                value = { permission.internal }
												onChange={()=>{
													let permissions = {read:permission.read, write:permission.write, delete:permission.delete, isAdmin:permission.isAdmin, internal: !permission.internal };
													this.props.givePermission(permission.user,permissions);
												}}
				                />
										</td>
										<td>
											<button className="btn btn-link waves-effect" disabled={(this.props.userID===permission.user.id && !this.props.isAdmin) || this.props.disabled} onClick={()=>{
													if(window.confirm('Are you sure?')){
														this.props.givePermission(permission.user,{read:false, write:false, delete:false, isAdmin:false, internal:false});
													}
												}}>
												<i className="fa fa-times"  />
												</button>
										</td>
								</tr>
							)
							}
						</tbody>
					</table>
				}
				<div className="row">
					<Checkbox
						className = "m-l-5 m-r-5"
						centerHor
						disabled={false}
						value = { this.props.lockedRequester}
						onChange={()=> this.props.lockRequester()}
						/> A requester can be only a user with rights to this project.
				</div>

			</div>
		);
	}
}


const mapStateToProps = ({ storageUsers}) => {
  const { usersActive, users, usersLoaded } = storageUsers;
  return { usersActive, users, usersLoaded };
};

export default connect(mapStateToProps, { storageUsersStart })(Permissions);
