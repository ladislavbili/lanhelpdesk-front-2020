import React from 'react';

import Select from "react-select";
import {
  selectStyle
} from "configs/components/select";
import Checkbox from 'components/checkbox';
import ErrorMessage from 'components/errorMessage';

export default function ProjectPermissions( props ) {
  //data
  const {
    users,
    addUser,
    givePermission,
    permissions,
    userID,
    isAdmin,
    lockedRequester,
    lockRequester
  } = props;

  const [ chosenUser, setChosenUser ] = React.useState( {} );
  const showNoAdminError = !permissions.some( ( projectRight ) => projectRight.admin )
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
							value={chosenUser}
							styles={selectStyle}
							onChange={(e)=> setChosenUser(e)}
							options={users.filter((user)=> !permissions.map((permission)=>permission.user.id).includes(user.id))}
							/>
					</div>
					<div>
						<button
							className="btn"
							disabled={chosenUser===null}
							onClick={() => {
								addUser(chosenUser);
								setChosenUser(null);
							}}
							>
              Pridať
            </button>
					</div>
				</div>

				{	permissions.length > 0
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
								permissions.map(permission =>
								<tr key={permission.user.id}>
									<td> {permission.user.email} </td>
										<td>
											<Checkbox
				                className = "m-l-5 m-r-5"
												centerVer
												centerHor
												disabled = {userID===permission.user.id && !isAdmin}
												value = { permission.read }
												onChange={()=>{
													let permissions = null;
													if(permission.read){
														permissions={read:false, write:false, delete:false, admin: false, internal: permission.internal }
													}else{
														permissions={read:true, write:false, delete:false, admin: false, internal: permission.internal }
													}
													givePermission(permission.user,permissions);
												}}
				                />
										</td>

										<td>
											<Checkbox
				                className = "m-l-5 m-r-5"
												centerVer
												centerHor
				                value = { permission.write }
												disabled={ userID===permission.user.id && !isAdmin }
												onChange={()=>{
													let permissions = null;
													if(permission.write){
														permissions={read:true, write:false, delete:false, admin: false, internal: permission.internal }
													}else{
														permissions={read:true, write:true, delete:false, admin: false, internal: permission.internal }
													}
													givePermission(permission.user,permissions);
												}}
				                />
										</td>

										<td>
											<Checkbox
				                className = "m-l-5 m-r-5"
												centerVer
												centerHor
				                value = { permission.delete }
				                disabled={userID===permission.user.id && !isAdmin}
												onChange={()=>{
													let permissions = null;
													if(permission.delete){
														permissions={read:true, write:true, delete:false, admin: false, internal: permission.internal }
													}else{
														permissions={read:true, write:true, delete:true, admin: false, internal: permission.internal }
													}
													givePermission(permission.user,permissions);
												}}
				                />
										</td>
										<td>
											<Checkbox
				                className = "m-l-5 m-r-5"
												centerVer
												centerHor
				                value = { permission.admin }
												disabled={userID===permission.user.id && !isAdmin}
												onChange={()=>{
													let permissions = null;
													if(permission.admin){
														permissions={read:true, write:true, delete:true, admin: false, internal: permission.internal }
													}else{
														permissions={read:true, write:true, delete:true, admin: true, internal: permission.internal }
													}
													givePermission(permission.user,permissions);
												}}
				                />
										</td>
										<td>
											<Checkbox
				                className = "m-l-5 m-r-5"
												centerVer
												centerHor
												disabled={userID===permission.user.id && !isAdmin}
				                value = { permission.internal }
												onChange={()=>{
													let permissions = {read:permission.read, write:permission.write, delete:permission.delete, admin: permission.admin, internal: !permission.internal };
													givePermission(permission.user,permissions);
												}}
				                />
										</td>
										<td>
											<button className="btn-link" disabled={(userID===permission.user.id && !isAdmin)} onClick={()=>{
													if(window.confirm('Are you sure?')){
														givePermission(permission.user,{read:false, write:false, delete:false, admin:false, internal:false});
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
        <ErrorMessage message="Project must have at least one administrator!" show={showNoAdminError} />
				<div className="row">
					<Checkbox
						className = "m-l-5 m-r-5"
						centerHor
						disabled={false}
						value = { lockedRequester}
						onChange={() => lockRequester()}
						/> A requester can be only a user with rights to this project.
				</div>

			</div>
  );
}