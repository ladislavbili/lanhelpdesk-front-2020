import React, {
  Component
} from 'react';

import Select from "react-select";
import {
  pickSelectStyle
} from "configs/components/select";

import {
  rebase
} from '../index';

export default class Permissions extends Component {
  constructor( props ) {
    super();
    this.state = {
      users: [],
      view: props.view || [],
      edit: props.edit || [],
      permissions: props.permissions || [],
      chosenUser: null,
    };


    this.addUser.bind( this );
  }

  componentWillMount() {
    rebase.bindCollection( '/users', {
      context: this,
      withIds: true,
      state: "users",
      then( data ) {},
      onFailure( err ) {
        console.log( err );
      }
    } );
  }

  componentWillReceiveProps( props ) {
    if ( this.props.id !== props.id ) {
      this.setState( {
        view: props.view,
        edit: props.edit,
        permissions: props.permissions,
      } )
    }
  }

  addUser() {
    this.setState( {
      view: [ ...this.state.view, this.state.chosenUser.id ],
      chosenUser: null,
    } )
  }

  render() {
    const USERS_TABLE = this.state.users
      .filter( user => this.state.view.includes( user.id ) || this.state.edit.includes( user.id ) || this.state.permissions.includes( user.id ) )
      .map( user => {
        let u = {
          id: user.id,
          name: user.username
        };
        u.view = this.state.view.includes( user.id );
        u.edit = this.state.edit.includes( user.id );
        u.permissions = this.state.permissions.includes( user.id );
        return u;
      } );
    const USERS_SELECT = this.state.users
      .filter( user => !this.state.view.includes( user.id ) && !this.state.edit.includes( user.id ) && !this.state.permissions.includes( user.id ) )
      .map( user => {
        return {
          ...user,
          value: user.id,
          label: user.username
        }
      } );

    return (
      <div >
				<hr />
				<h3 className="m-t-20" style={{color: "red"}}> DEMO - prava </h3>
				<div className="row">
					<div className="m-r-10 center-hor">
						<label className="">
							Používateľ
						</label>
					</div>
					<div className="flex m-r-10">
						<Select
							value={this.state.chosenUser}
							styles={pickSelectStyle()}
							onChange={(e)=> this.setState({chosenUser: e})}
							options={USERS_SELECT}
							/>
					</div>
					<div>
						<button className="btn" onClick={() => this.addUser()}>Pridať</button>
					</div>
				</div>

				{	USERS_TABLE.length > 0
					&&
					<table className="table">
						<thead>
							<tr>
								<th > Username </th>
								<th className="t-a-c"> View </th>
								<th className="t-a-c"> Edit </th>
								<th className="t-a-c"> Permissions</th>
							</tr>
						</thead>

						<tbody>
							{
								USERS_TABLE.map(user =>
								<tr key={user.id}>
									<td> {user.name} </td>
										<td className="table-checkbox t-a-c">
											<input
												type="checkbox"
												checked={user.view}
												onChange={() => {
																			let newView = [];
																			if (!user.view){
																				newView = [...this.state.view, user.id]
																			} else {
																				newView = this.state.view.filter(id => id !== user.id);
																			}
																			this.setState({
																				view: newView,
																		})
												}}
											/>
										</td>

										<td className="table-checkbox t-a-c">
											<input
												type="checkbox"
												checked={user.edit}
												onChange={() => {
																			let newEdit = [];
																			if (!user.edit){
																				newEdit = [...this.state.edit, user.id]
																			} else {
																				newEdit = this.state.edit.filter(id => id !== user.id);
																			}
																			this.setState({
																				edit: newEdit,
																		})
												}}
											/>
										</td>

										<td className="table-checkbox t-a-c">
											<input
												type="checkbox"
												checked={user.permissions}
												onChange={() => {
																			let newPermissions = [];
																			if (!user.permissions){
																				newPermissions = [...this.state.permissions, user.id]
																			} else {
																				newPermissions = this.state.permissions.filter(id => id !== user.id);
																			}
																			this.setState({
																				permissions: newPermissions,
																		})
												}}
											/>
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
}