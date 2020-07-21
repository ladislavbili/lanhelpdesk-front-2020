import React, { Component } from 'react';
import {rebase} from '../../index';
import { connect } from "react-redux";
import ShowData from '../../components/showData';
import ContainerViewEdit from './containerViewEdit';
import { Button, Input } from 'reactstrap';
import {setPasswordsOrderBy, setPasswordsAscending, setLayout} from '../../redux/actions';
import PassEmpty from "./passEmpty";

//const attributes=[{title:'Server name',id:'title'},{title:'IP',id:'IP'},{title:'Status',id:'status'},{title:'Company',id:'company'}];

class List extends Component {
	constructor(props) {
		super(props);
		this.state = {
			search:'',
			passwords:[],
			filterName:''
		};
		this.ref=null;
		this.fetchData.bind(this);
		this.fetchData(this.props.match.params.listID);
	}

	componentWillReceiveProps(props){
		if(this.props.match.params.listID!==props.match.params.listID){
			this.fetchData(props.match.params.listID);
		}
	}

	fetchData(id){
		if(this.ref!==null){
			rebase.removeBinding(this.ref);
		}
		this.ref = rebase.listenToCollection('/pass-passwords', {
			context: this,
			withIds: true,
			query: (ref) => ref.where('folder', '==', id),
			then:content=>{this.setState({passwords:content.map((item)=>{return {...item, shown:false}})})},
		});

		rebase.get('pass-folders/'+id, {
			context: this,
		}).then((result)=>{
			this.setState({filterName:result.title});
		});
	}

	componentWillUnmount(){
		rebase.removeBinding(this.ref);
	}

	render() {
		let link='';
		if(this.props.match.params.hasOwnProperty('listID')){
			link = '/passmanager/i/'+this.props.match.params.listID;
		}else{
			link = '/passmanager'
		}
		return (
			<ShowData
				layout={this.props.layout}
				setLayout={this.props.setLayout}
				data={this.state.passwords}
				displayCol={(pass)=>
					<li>
						<div className="taskCol-title">
							<span>{pass.title}</span>
						</div>
						<div className="taskCol-body">
							<p>
								<span>
									<span className="attribute-label">URL: </span>
										<a href={pass.URL} target="_blank" rel="noopener noreferrer" onClick={(e)=>e.stopPropagation()}>{pass.URL? pass.URL:' Nezadané'}</a>
								</span>
							</p>
							<p>
								<span>
									<span className="attribute-label">Login: </span>
									{pass.login?pass.login:'Žiadny'}
								</span>
							</p>
						</div>
						<div className="taskCol-tags">
						</div>
					</li>
				}
				filterBy={[
					{value:'title',type:'text'},
					{value:'URL',type:'text'},
					{value:'login',type:'text'},
				]}
				filterName="pass-passwords"
				displayValues={[
					{value:'title',label:'Title',type:'text'},
					{value:'URL',label:'URL',type:'url'},
					{value:'login',label:'Login',type:'text'},
					{value:'password',label:'Password',type:'custom',func:(pass)=>
						<span className="row">
							<span onClick={(e)=>e.stopPropagation()}>
							{
								pass.shown &&
								<Input type="text" placeholder="No pass" style={{width:'auto'}} className="mb-auto mt-auto" id={'input'+pass.id}	value={pass.password} disabled={true}/>
							}
							{!pass.shown && <Button color="primary" className="mb-auto mt-auto" onClick={()=>{
								let newPasswords = [...this.state.passwords];
								newPasswords.find((item2)=>pass.id===item2.id).shown=true;
								this.setState({passwords:newPasswords});
							}}>
							Show password
						</Button>}
					</span>

					<Button color="warning" className="m-l-10 mb-auto mt-auto" onClick={(e)=>{
							e.stopPropagation();
							navigator.clipboard.writeText(pass.password);
						}}>
						Copy
					</Button>
						</span>
					},
				]}
				orderByValues={[
					{value:'title',label:'Title',type:'text'},
					{value:'URL',label:'URL',type:'text'},
					{value:'login',label:'Login',type:'text'},
				]}
				link={link}
				history={this.props.history}
				orderBy={this.props.orderBy}
				setOrderBy={this.props.setPasswordsOrderBy}
				ascending={this.props.ascending}
				setAscending={this.props.setPasswordsAscending}
				itemID={this.props.match.params.passID}
				listID={this.props.match.params.listID}
				listName={this.state.filterName}
				match={this.props.match}
				edit={ContainerViewEdit}
				empty={PassEmpty}
				 />
			);
		}
	}

	const mapStateToProps = ({ passReducer, appReducer }) => {
		const { orderBy, ascending } = passReducer;
		return { orderBy,ascending, layout:appReducer.layout };
	};

	export default connect(mapStateToProps, { setPasswordsOrderBy, setPasswordsAscending, setLayout })(List);
