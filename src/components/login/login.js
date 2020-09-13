import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';

import { currentUser } from 'localCache';

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email:'',
			password:'',
			signingIn: false,
			error:  null,
		};
		this.login.bind(this);
	}

	login(){
		this.setState({error: null, signingIn:true});

		this.props.login({ variables: { email: this.state.email, password: this.state.password } }).then( ( response ) => {
			this.setState({signingIn:false});
			localStorage.setItem("acctok", response.data.loginUser.accessToken);
			this.props.client.writeData({ data: { isLoggedIn: true } });
			console.log("LOGIN RESPONSE");
			console.log(response);
			currentUser(response.data.loginUser);
		}).catch( (err) => {
			this.setState({error: err.message, signingIn:false});
		});
	}

	render() {
		return (
			<div style={{height:'100vh',display: 'flex'}}>
			<div className="card" style={{backgroundColor:'white', borderRadius:6, padding:'10px 20px', width:'350px',margin:'auto'}}>

				<FormGroup>
					<Label for="email">E-mail</Label>
					<Input type="email" name="email" id="email" placeholder="Enter e-mail" value={this.state.email} onChange={(e)=>this.setState({email:e.target.value})}
						onKeyPress={(e)=>{
							if(e.charCode===13 && !this.state.signingIn && this.state.email.length>0 && this.state.password.length>0){
								this.login();
							}
						}}
						/>
				</FormGroup>
				<FormGroup>
					<Label for="pass">Password</Label>
					<Input type="password" name="pass" id="pass" placeholder="Enter password" value={this.state.password} onChange={(e)=>this.setState({password:e.target.value})}
						onKeyPress={(e)=>{
							if(e.charCode===13 && !this.state.signingIn && this.state.email.length>0 && this.state.password.length>0){
								this.login();
							}
						}}
						/>
				</FormGroup>
			<Button color="primary" disabled={this.state.signingIn||this.state.email.length===0||this.state.password.length===0} onClick={this.login.bind(this)}>Login</Button>
			{this.state.error !== null &&
				<div style={{color:'red'}}>
        {this.state.error}
	      </div>
				}
			</div>
		</div>
		);
	}
}
