import React from 'react';
import {
  Button
} from 'reactstrap';

import Select from "react-select";
import {
  selectStyle
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
          <div className="flex m-r-10">
						<Select
							value={group}
							styles={selectStyle}
							onChange={(e)=> setGroup(e)}
							options={groups}
							/>
					</div>
					<div>
						<Button
							className="btn"
							disabled={ chosenUser === null || group === null }
							onClick={() => {
								addRight({ user: chosenUser, group });
								setChosenUser(null);
							}}
							>
              Pridať
            </Button>
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
								permissions.map(permission =>
								<tr key={permission.user.id}>
									<td> {permission.user.email} </td>
									<td>
                    <Select
                      value={permission.group}
                      styles={selectStyle}
                      onChange={(e)=> updateRight({ ...permission, group: e })}
                      options={groups}
                      />
                  </td>
										<td>
											<button className="btn btn-link waves-effect" disabled={(!isAdmin)} onClick={()=>{
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