import React from 'react';

import Select from "react-select";
import {
  pickSelectStyle
} from "configs/components/select";

export default function ProjectPermissions( props ) {
  //data
  const {
    users,
    addRight,
    updateRight,
    deleteRight,
    groups,
    permissions,
    isAdmin,
  } = props;

  const [ chosenUser, setChosenUser ] = React.useState( null );
  const [ group, setGroup ] = React.useState( null );
  return (
    <div >
				<h3 className="m-t-20 m-b-20"> Prístupové práva  <span className="warning-big">*</span></h3>
				<div className="row">
					<div className="m-r-10 center-hor">
						<label className="">
							Používateľ
						</label>
					</div>
          <div className="flex m-r-10">
						<Select
							value={chosenUser}
							styles={pickSelectStyle()}
							onChange={(e)=> setChosenUser(e)}
							options={users.filter((user)=> !permissions.map((permission)=>permission.user.id).includes(user.id))}
							/>
					</div>
          <div className="flex m-r-10">
						<Select
							value={group}
							styles={pickSelectStyle()}
							onChange={(e)=> setGroup(e)}
							options={groups}
							/>
					</div>
					<div>
						<button
							className="btn"
							disabled={ chosenUser === null || group === null }
							onClick={() => {
								addRight({ user: chosenUser, group });
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
                  <th width="150px" > Group </th>
								<th width="50px" className="t-a-c"></th>
							</tr>
						</thead>

						<tbody>
							{
								permissions.sort((userGroup1,userGroup2) => {
                  if( userGroup1.group.order === userGroup2.group.order ){
                    return (userGroup1.user.email < userGroup2.user.email) ? -1 : 1;
                  }
                  return (userGroup1.group.order < userGroup2.group.order) ? -1 : 1;
                } ).map(permission =>
								<tr key={permission.user.id}>
									<td> {permission.user.email} </td>
									<td>
                    <Select
                      value={permission.group}
                      styles={pickSelectStyle()}
                      onChange={(e)=> updateRight({ ...permission, group: e })}
                      options={groups}
                      />
                  </td>
										<td>
											<button className="btn-link" disabled={(!isAdmin)} onClick={()=>{
													if(window.confirm('Are you sure?')){
														deleteRight(permission)
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
			</div>
  );
}