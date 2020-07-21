import React, { Component } from 'react';
import { Button, FormGroup, Label,Input } from 'reactstrap';
import firebase from 'firebase';
import { connect } from "react-redux";
import {setUserID, setUserData, startUsersNotifications} from './redux/actions';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email:'',
			password:'',
			working: false,
			error: false,
		};
		this.login.bind(this);
	}

	login(){
		this.setState({error:false, working:true});
		firebase.auth().signInWithEmailAndPassword(this.state.email,this.state.password).then((res)=>{
			this.setState({working:false})
		}).catch(error=>{this.setState({error:true,working:false});console.log('error')});
	}

	render() {
		return (
			<div style={{height:'100vh',display: 'flex'}}>
			<div className="card" style={{backgroundColor:'white', borderRadius:6, padding:'10px 20px', width:'350px',margin:'auto'}}>

				<FormGroup>
					<Label for="email">E-mail</Label>
					<Input type="email" name="email" id="email" placeholder="Enter e-mail" value={this.state.email} onChange={(e)=>this.setState({email:e.target.value})}
						onKeyPress={(e)=>{
							if(e.charCode===13 && !this.state.working && this.state.email.length>0 && this.state.password.length>0){
								this.login();
							}
						}}
						/>
				</FormGroup>
				<FormGroup>
					<Label for="pass">Password</Label>
					<Input type="password" name="pass" id="pass" placeholder="Enter password" value={this.state.password} onChange={(e)=>this.setState({password:e.target.value})}
						onKeyPress={(e)=>{
							if(e.charCode===13 && !this.state.working && this.state.email.length>0 && this.state.password.length>0){
								this.login();
							}
						}}
						/>
				</FormGroup>
			<Button color="primary" disabled={this.state.working||this.state.email.length===0||this.state.password.length===0} onClick={this.login.bind(this)}>Login</Button>
			{
				this.state.error && <div style={{color:'red'}}>
        Wrong username or password!
      </div>
			}
			</div>
		</div>
		);
	}
}

const mapStateToProps = ({ userReducer }) => {
	const { id } = userReducer;
	return { id };
};

export default connect(mapStateToProps, { setUserID, setUserData, startUsersNotifications })(Login);
